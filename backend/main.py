import sys
import asyncio

# ✅ fix Playwright on Windows
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
from aws_secrets import load_secrets
load_secrets()
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from routers import onboarding
from db.database import create_pool, close_pool
from services.pipeline_service import pipeline_worker  

app = FastAPI()
app.include_router(onboarding.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://172.16.31.72:5173",
        "http://192.168.0.100:5173",
        "http://192.168.0.100:8000",
        "https://product-insight.integerstech.com",
        "null",
    ],
    allow_origin_regex=r"https://.*\.trycloudflare\.com",
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# =====================================================
# ✅ STARTUP
# =====================================================
@app.on_event("startup")
async def startup():
    await create_pool()
    print("🔥 API STARTED")

    # ✅ start 10 pipeline workers
    for i in range(10):
        asyncio.create_task(pipeline_worker(i))
    print(f"👷 Started 10 pipeline workers")


# =====================================================
# ✅ SHUTDOWN
# =====================================================
@app.on_event("shutdown")
async def shutdown():
    tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
    for task in tasks:
        task.cancel()
    if tasks:
        await asyncio.gather(*tasks, return_exceptions=True)

    await close_pool()
    print("🛑 DB Pool Closed")