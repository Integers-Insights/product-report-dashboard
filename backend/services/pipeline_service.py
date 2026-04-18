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

# async def update_job_progress(conn, job_id, stage, progress, log=None):
#     await conn.execute("""
#         UPDATE core_tables.pipeline_jobs
#         SET 
#             stage = $1,
#             progress = $2,
#             logs = COALESCE(logs, '[]'::jsonb) || $3::jsonb,
#             updated_at = NOW()
#         WHERE id = $4
#     """,
#         stage,
#         progress,
#         json.dumps([log]) if log else json.dumps([]),
#         job_id
#     )


# def _make_progress_callback(job_id):
#     async def _cb(pages_crawled: int, total_pages: int, products_found: int):
#         if not job_id:
#             return
#         print(f"📊 [progress_cb] pages={pages_crawled} | total={total_pages} | products={products_found}")
#         try:
#             async with (await safe_acquire()) as conn:
#                 # ✅ direct update — no COALESCE, no update_job_progress wrapper
#                 await conn.execute("""
#                     UPDATE core_tables.pipeline_jobs
#                     SET pages_crawled  = $1,
#                         total_pages    = $2,
#                         products_found = $3,
#                         updated_at     = NOW()
#                     WHERE id = $4
#                 """, pages_crawled, total_pages, products_found, job_id)
#                 print(f"✅ [progress_cb] DB updated — pages={pages_crawled}")
#         except Exception as e:
#             print(f"⚠️ Progress callback DB failed: {e}")
#     return _cb

def _make_progress_callback(job_id):
    async def _cb(pages_crawled: int, total_pages: int, products_found: int):
        if not job_id:
            return
        print(f"📊 [progress_cb] pages={pages_crawled} | job_id={job_id} | type={type(job_id)}")
        try:
            import uuid
            async with (await safe_acquire()) as conn:
                # ✅ cast to UUID explicitly
                result = await conn.execute("""
                    UPDATE core_tables.pipeline_jobs
                    SET pages_crawled  = $1,
                        total_pages    = $2,
                        products_found = $3,
                        updated_at     = NOW()
                    WHERE id = $4::uuid
                """, pages_crawled, total_pages, products_found, str(job_id))
                print(f"✅ [progress_cb] DB updated — result={result}")
        except Exception as e:
            print(f"⚠️ Progress callback DB failed: {e}")
    return _cb

async def update_job_progress(
    conn, job_id, stage, progress,
    log=None,
    pages_crawled=None,
    total_pages=None,
    products_found=None
):
    await conn.execute("""
        UPDATE core_tables.pipeline_jobs
            SET
                stage          = $1,
                progress       = $2,
                logs           = COALESCE(logs, '[]'::jsonb) || $3::jsonb,
                pages_crawled  = COALESCE($5, pages_crawled),
                total_pages    = COALESCE($6, total_pages),
                products_found = COALESCE($7, products_found),
                updated_at     = NOW()
            WHERE id = $4
    """,
    stage,
    progress,
    json.dumps([log]) if log else json.dumps([]),
    job_id,
    pages_crawled,   # pass None instead of 0 to keep existing value
    total_pages,
    products_found,
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

            print(f"🔍 CRAWLER max_pages = {CRAWLER['max_pages']}")
            result = await run_pipeline(
                website_url=website_url,
                max_pages=CRAWLER["max_pages"],
                run_semantic=True,
                progress_callback=_make_progress_callback(job_id),
                #store_callback=_make_store_callback(job_id, user_id),
            )

            # Update progress to "processing" after crawl completes
            if job_id:
                try:
                    async with (await safe_acquire()) as conn:
                        await update_job_progress(
                            conn, job_id,
                            stage="crawling",
                            progress=20,
                            log="Crawling website...",
                            pages_crawled=None,              # ✅ None — don't overwrite
                            total_pages=CRAWLER["max_pages"], # ✅ 50 — store from start
                            products_found=None,             # ✅ None — don't overwrite
                        )
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

                    # ✅ STORE PRODUCTS — skip if already stored live
                    if result and getattr(result, "products", None):
                        existing = await conn.fetchval("""
                            SELECT COUNT(*) 
                            FROM product_info.pipeline_temp_products
                            WHERE job_id = $1
                        """, job_id)

                        if existing == 0:
                            # live store didn't run — fallback to bulk store
                            await store_pipeline_temp(
                                conn=conn,
                                job_id=job_id,
                                user_id=user_id,
                                products=result.products
                            )
                            print(f"📦 Bulk stored {len(result.products)} products")
                        else:
                            print(f"📦 {existing} products already stored live — skipping bulk store")

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