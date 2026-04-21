import asyncio
import signal
import json
from db.database import create_pool, close_pool, safe_acquire
from services.pipeline_service import run_pipeline_and_store, update_job_progress
from services.onboarding_service import store_pipeline_temp, upsert_company_metadata

# ─────────────────────────────────────────────
#  CONFIG
# ─────────────────────────────────────────────

# How many jobs run at the same time.
# Each job spawns one Chromium browser (~150-250 MB RAM).
# Tune based on your server's available memory:
#   2 GB RAM  → MAX_CONCURRENT_JOBS = 2
#   4 GB RAM  → MAX_CONCURRENT_JOBS = 3
#   8 GB RAM  → MAX_CONCURRENT_JOBS = 5
MAX_CONCURRENT_JOBS = 10

MAX_JOB_RETRIES = 3

# ─────────────────────────────────────────────
#  SHUTDOWN FLAG
# ─────────────────────────────────────────────

_shutdown = False

def handle_shutdown(signum, frame):
    global _shutdown
    print(f"⚠️  Shutdown signal received — draining jobs and stopping...")
    _shutdown = True


# ─────────────────────────────────────────────
#  JOB SLOT — one independent concurrent runner
# ─────────────────────────────────────────────

async def _job_slot(slot_id: int, browser_semaphore: asyncio.Semaphore) -> None:
    """
    One concurrent job slot. Independently polls the DB for pending jobs,
    runs the pipeline, and stores results. Multiple slots run in parallel.

    browser_semaphore caps the number of concurrent Playwright browsers
    so we don't OOM the server.
    """
    print(f"  [Slot {slot_id}] Ready")

    db_error_count = 0

    while not _shutdown:

        # ─── STEP 1: Pick a job ───────────────────────────────────────
        job = None

        try:
            async with (await safe_acquire()) as conn:
                async with conn.transaction():
                    job = await conn.fetchrow("""
                        SELECT *
                        FROM core_tables.pipeline_jobs
                        WHERE status = 'pending'
                        AND retry_count < $1
                        ORDER BY created_at ASC
                        LIMIT 1
                        FOR UPDATE SKIP LOCKED
                    """, MAX_JOB_RETRIES)

                    if job:
                        await conn.execute("""
                            UPDATE core_tables.pipeline_jobs
                            SET status    = 'processing',
                                stage     = 'starting',
                                progress  = 5,
                                updated_at = NOW()
                            WHERE id = $1
                        """, job["id"])

            db_error_count = 0  # reset on success

        except Exception as e:
            db_error_count += 1
            print(f"  [Slot {slot_id}] ❌ DB error ({db_error_count}): {e}")

            if db_error_count >= 5:
                print(f"  [Slot {slot_id}] 🛑 Too many DB errors — stopping slot")
                return

            await asyncio.sleep(3)
            continue

        # ─── STEP 2: No job available — wait and retry ────────────────
        if not job:
            await asyncio.sleep(2)
            continue

        job_id      = job["id"]
        user_id     = job["user_id"]
        website_url = job["website_url"]

        print(f"  [Slot {slot_id}] 🚀 Picked job {job_id} → {website_url}")

        # ─── STEP 3: Run pipeline (bounded by browser semaphore) ──────
        # The semaphore ensures at most MAX_CONCURRENT_JOBS browsers run at once.
        async with browser_semaphore:
            try:
                result = await run_pipeline_and_store(
                    user_id=user_id,
                    website_url=website_url,
                    job_id=job_id,
                )
                print(f"  [Slot {slot_id}] ✅ Pipeline done for job {job_id}")

            except Exception as e:
                print(f"  [Slot {slot_id}] ❌ Pipeline failed for job {job_id}: {e}")

                try:
                    async with (await safe_acquire()) as conn:
                        await conn.execute("""
                            UPDATE core_tables.pipeline_jobs
                            SET status      = 'failed',
                                stage       = 'error',
                                progress    = 100,
                                retry_count = retry_count + 1,
                                logs        = COALESCE(logs, '[]'::jsonb) || $2::jsonb,
                                updated_at  = NOW()
                            WHERE id = $1
                        """, job_id, json.dumps([str(e)]))
                except Exception as db_err:
                    print(f"  [Slot {slot_id}] ❌ Failed to mark job as failed: {db_err}")

                continue  # pick next job

        # ─── STEP 4: Store results ────────────────────────────────────
        try:
            async with (await safe_acquire()) as conn:
                async with conn.transaction():

                    if result and getattr(result, "products", None):
                        await store_pipeline_temp(
                            conn=conn,
                            job_id=job_id,
                            user_id=user_id,
                            products=result.products,
                        )
                        print(f"  [Slot {slot_id}] 📦 Stored {len(result.products)} products")

                    if result and getattr(result, "company", None):
                        await upsert_company_metadata(
                            conn=conn,
                            user_id=user_id,
                            data=result.company.__dict__,
                        )

                    await conn.execute("""
                        UPDATE core_tables.pipeline_jobs
                        SET status     = 'completed',
                            stage      = 'finished',
                            progress   = 100,
                            updated_at = NOW()
                        WHERE id = $1
                    """, job_id)

                    print(f"  [Slot {slot_id}] ✅ Job {job_id} completed")

        except Exception as e:
            print(f"  [Slot {slot_id}] ❌ Store failed for job {job_id}: {e}")

            try:
                async with (await safe_acquire()) as conn:
                    await conn.execute("""
                        UPDATE core_tables.pipeline_jobs
                        SET status      = 'failed',
                            stage       = 'store_failed',
                            progress    = 100,
                            retry_count = retry_count + 1,
                            logs        = COALESCE(logs, '[]'::jsonb) || $2::jsonb,
                            updated_at  = NOW()
                        WHERE id = $1
                    """, job_id, json.dumps([str(e)]))
            except Exception as db_err:
                print(f"  [Slot {slot_id}] ❌ Failed to mark store failure: {db_err}")

        # Small breathe between jobs
        await asyncio.sleep(0.5)

    print(f"  [Slot {slot_id}] 🛑 Stopped")


# ─────────────────────────────────────────────
#  MAIN WORKER
# ─────────────────────────────────────────────

async def worker() -> None:
    print(f"\n{'═' * 50}")
    print(f"  👷 Worker starting — {MAX_CONCURRENT_JOBS} concurrent job slots")
    print(f"{'═' * 50}\n")

    await create_pool()

    # Semaphore shared across all slots — caps concurrent Playwright browsers
    browser_semaphore = asyncio.Semaphore(MAX_CONCURRENT_JOBS)

    # Launch all slots concurrently — they independently race for jobs
    await asyncio.gather(*[
        _job_slot(slot_id, browser_semaphore)
        for slot_id in range(MAX_CONCURRENT_JOBS)
    ])

    print("\n🛑 All slots stopped — worker shutting down")


# ─────────────────────────────────────────────
#  ENTRY POINT
# ─────────────────────────────────────────────

if __name__ == "__main__":
    signal.signal(signal.SIGTERM, handle_shutdown)
    signal.signal(signal.SIGINT, handle_shutdown)

    try:
        asyncio.run(worker())
    finally:
        asyncio.run(close_pool())
