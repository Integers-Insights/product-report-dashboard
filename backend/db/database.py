import os
import asyncio
import asyncpg
from dotenv import load_dotenv
from typing import AsyncGenerator, Optional
from pathlib import Path
from fastapi import HTTPException

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# =====================================================
# DATABASE CONFIGURATION (Update placeholders here)
# =====================================================

DATABASE_HOST = os.getenv("AI_REPORTS_HOST")
DATABASE_PORT = os.getenv("AI_REPORTS_PORT")
DATABASE_USER = os.getenv("AI_REPORTS_USER")
DATABASE_PASSWORD = os.getenv("AI_REPORTS_PASSWORD")
DATABASE_NAME = os.getenv("AI_REPORTS_DB")

DATABASE_URL = f"postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"


# =====================================================
# CONNECTION POOL
# =====================================================

db_pool: Optional[asyncpg.pool.Pool] = None


# =====================================================
# ✅ CREATE POOL
# =====================================================
db_pool = None

async def create_pool():
    global db_pool

    print("🔥 Creating NEW DB pool...")

    db_pool = await asyncpg.create_pool(
        dsn=DATABASE_URL,
        min_size=10,
        max_size=80,
        command_timeout=60,
        max_inactive_connection_lifetime=300,
        server_settings={
            # Auto-kill any connection that stays idle inside a transaction
            # for more than 30 seconds — prevents the RDS warning
            "idle_in_transaction_session_timeout": "30000",  # 30s in ms
            # Kill runaway queries after 60 seconds
            "statement_timeout": "60000",                    # 60s in ms
        },
    )

    print("✅ DB pool created")

    # Auto-migrate: ensure required columns exist
    async with db_pool.acquire() as conn:
        await conn.execute("""
            ALTER TABLE core_auth_table.company_usage
            ADD COLUMN IF NOT EXISTS usage_date DATE
        """)
        await conn.execute("""
            UPDATE core_auth_table.company_usage
            SET usage_date = DATE(created_at)
            WHERE usage_date IS NULL
        """)
        await conn.execute("""
            ALTER TABLE core_auth_table.company_subscription_payments
            ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT
        """)
        await conn.execute("""
            ALTER TABLE core_auth_table.company_addon_purchases
            ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT
        """)
        await conn.execute("""
            ALTER TABLE core_auth_table.company_addon_purchases
            ADD COLUMN IF NOT EXISTS credits_used INTEGER NOT NULL DEFAULT 0
        """)

    return db_pool


# =====================================================
# ✅ CLOSE POOL
# =====================================================
async def close_pool():
    global db_pool

    if db_pool:
        try:
            await asyncio.wait_for(db_pool.close(), timeout=5.0)
        except asyncio.TimeoutError:
            print("⚠️ Pool close timed out — forcing termination")
            db_pool.terminate()
        finally:
            db_pool = None


# =====================================================
# ✅ SAFE ACQUIRE (CRITICAL FIX)
# =====================================================
async def safe_acquire():
    global db_pool

    try:
        if db_pool is None:
            raise Exception("Pool not initialized")

        return db_pool.acquire()

    except Exception as e:
        print("⚠️ Pool broken, recreating...", str(e))

        db_pool = await create_pool()

        return db_pool.acquire()


# =====================================================
# ✅ FASTAPI DEPENDENCY
# =====================================================
# async def get_db():
#     # HTTPException must NOT be caught here — catching it and yielding
#     # again causes "generator didn't stop after athrow()" crash.
#     try:
#         acquire_ctx = await safe_acquire()
#         async with acquire_ctx as connection:
#             yield connection
#     except HTTPException:
#         raise  # let FastAPI handle it normally
#     except Exception as e:
#         print("⚠️ DB pool error, recreating...", str(e))
#         await create_pool()
#         acquire_ctx = await safe_acquire()
#         async with acquire_ctx as connection:
#             yield connection
async def get_db():
    try:
        acquire_ctx = await safe_acquire()
    except Exception as e:
        print("⚠️ DB pool error, recreating...", str(e))
        await create_pool()
        acquire_ctx = await safe_acquire()

    async with acquire_ctx as connection:
        try:
            yield connection
        finally:
            # If the endpoint crashed mid-transaction, roll it back
            # before returning the connection to the pool.
            # This prevents "idle in transaction" connections on RDS.
            if connection.is_in_transaction():
                await connection.execute("ROLLBACK")

# =====================================================
# ✅ GET POOL (FOR WORKERS)
# =====================================================
def get_pool():
    if db_pool is None or db_pool._closed:
        raise RuntimeError("DB pool not available")
    return db_pool