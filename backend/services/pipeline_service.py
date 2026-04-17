from input_pipeline.pipeline import run_pipeline
from services.onboarding_service import upsert_company_metadata,store_pipeline_temp
import asyncio
import traceback
from input_pipeline.config import CRAWLER
from db.database import safe_acquire,get_pool
from state import RUN_WORKERS,WORKER_STATUS
import json


# 🔥 GLOBAL LIMIT (tune this)
PIPELINE_LIMIT = asyncio.Semaphore(10)

async def update_job_progress(conn, job_id, stage, progress, log=None):
    await conn.execute("""
        UPDATE core_tables.pipeline_jobs
        SET 
            stage = $1,
            progress = $2,
            logs = COALESCE(logs, '[]'::jsonb) || $3::jsonb,
            updated_at = NOW()
        WHERE id = $4
    """,
        stage,
        progress,
        json.dumps([log]) if log else json.dumps([]),
        job_id
    )

async def run_pipeline_and_store(user_id: str, website_url: str, job_id: str = None):
    async with PIPELINE_LIMIT:   # concurrency control
        try:
            # Update progress to "crawling" before starting
            if job_id:
                try:
                    async with (await safe_acquire()) as conn:
                        await update_job_progress(conn, job_id, "crawling", 20, "Crawling website...")
                except Exception as prog_err:
                    print("⚠️ Progress update failed (non-fatal):", str(prog_err))

            result = await run_pipeline(
                website_url=website_url,
                max_pages=CRAWLER["max_pages"],
                run_semantic=True
            )

            # Update progress to "processing" after crawl completes
            if job_id:
                try:
                    async with (await safe_acquire()) as conn:
                        await update_job_progress(conn, job_id, "processing", 70, "Crawl complete, processing data...")
                except Exception as prog_err:
                    print("⚠️ Progress update failed (non-fatal):", str(prog_err))

            return result

        except Exception as e:
            traceback.print_exc()
            print("❌ PIPELINE ERROR:", str(e))
            raise

async def pipeline_worker(worker_id: int):
    print(f"👷 Worker {worker_id} started")

    retry_count = 0

    try:
        while True:

            # =====================================================
            # 🔍 STEP 1: LOOK FOR JOB
            # =====================================================
            job = None

            try:
                print(f"🔍 Worker {worker_id} checking for jobs...")

                async with (await safe_acquire()) as conn:
                    async with conn.transaction():

                        job = await conn.fetchrow("""
                            SELECT *
                            FROM core_tables.pipeline_jobs
                            WHERE status = 'pending'
                            ORDER BY created_at ASC
                            LIMIT 1
                            FOR UPDATE SKIP LOCKED
                        """)

                        if job:
                            print(f"✅ Worker {worker_id} picked job {job['id']}")

                            await conn.execute("""
                                UPDATE core_tables.pipeline_jobs
                                SET status='processing',
                                    stage='starting',
                                    progress=5,
                                    updated_at=NOW()
                                WHERE id=$1
                            """, job["id"])

                retry_count = 0  # reset after successful DB call

            except Exception as e:
                retry_count += 1
                print(f"❌ Worker {worker_id} DB error ({retry_count}):", str(e))

                if retry_count >= 5:
                    print(f"🛑 Worker {worker_id} stopping due to DB failure")
                    return

                await asyncio.sleep(3)
                continue

            # =====================================================
            # ⏳ NO JOB FOUND
            # =====================================================
            if not job:
                await asyncio.sleep(2)
                continue

            job_id = job["id"]
            user_id = job["user_id"]
            website_url = job["website_url"]

            print(f"🚀 Worker {worker_id} processing job {job_id}")

            # =====================================================
            # 🚀 STEP 2: RUN PIPELINE
            # =====================================================
            try:
                WORKER_STATUS[worker_id] = {
                    "status": "processing",
                    "job_id": job_id,
                    "stage": "running_pipeline"
                }

                # 🔥 RUN MAIN PIPELINE (progress updates handled inside)
                result = await run_pipeline_and_store(
                    user_id=user_id,
                    website_url=website_url,
                    job_id=job_id
                )

                print("🔥 PIPELINE COMPLETED")

            except Exception as e:
                print(f"❌ Worker {worker_id} pipeline failed:", str(e))

                try:
                    async with (await safe_acquire()) as conn:
                        await conn.execute("""
                            UPDATE core_tables.pipeline_jobs
                            SET status='failed',
                                stage='error',
                                progress=100,
                                logs = COALESCE(logs, '[]'::jsonb) || $2::jsonb,
                                updated_at=NOW()
                            WHERE id=$1
                        """, job_id, json.dumps([str(e)]))
                except Exception as db_err:
                    print("❌ Failed to update job failure:", str(db_err))

                continue

            # =====================================================
            # 📦 STEP 3: STORE RESULTS
            # =====================================================
            try:
                async with (await safe_acquire()) as conn:

                    # ✅ STORE PRODUCTS
                    if result and getattr(result, "products", None):
                        await store_pipeline_temp(
                            conn=conn,
                            job_id=job_id,
                            user_id=user_id,
                            products=result.products
                        )
                        print(f"📦 Stored {len(result.products)} products")

                    # ✅ STORE COMPANY
                    if result and getattr(result, "company", None):
                        await upsert_company_metadata(
                            conn=conn,
                            user_id=user_id,
                            data=result.company.__dict__
                        )

                    # ✅ MARK COMPLETED
                    await conn.execute("""
                        UPDATE core_tables.pipeline_jobs
                        SET status='completed',
                            stage='finished',
                            progress=100,
                            updated_at=NOW()
                        WHERE id=$1
                    """, job_id)

                    print(f"✅ Job {job_id} completed")

                    WORKER_STATUS[worker_id] = {
                        "status": "idle",
                        "job_id": None,
                        "stage": "completed"
                    }

            except Exception as e:
                print(f"❌ Worker {worker_id} store failed:", str(e))

                try:
                    async with (await safe_acquire()) as conn:
                        await conn.execute("""
                            UPDATE core_tables.pipeline_jobs
                            SET status='failed',
                                stage='store_failed',
                                progress=100,
                                logs = COALESCE(logs, '[]'::jsonb) || $2::jsonb,
                                updated_at=NOW()
                            WHERE id=$1
                        """, job_id, json.dumps([str(e)]))
                except Exception as db_err:
                    print("❌ Failed to update store failure:", str(db_err))

            # =====================================================
            # ⏱ SMALL DELAY
            # =====================================================
            await asyncio.sleep(0.5)

    except asyncio.CancelledError:
        print(f"🛑 Worker {worker_id} cancelled")

    except Exception as e:
        print(f"❌ Worker {worker_id} crashed:", str(e))

    print(f"🛑 Worker {worker_id} stopped")