# import sys
# import asyncio

# # ✅ fix Playwright on Windows
# if sys.platform == "win32":
#     asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
from aws_secrets import load_secrets
load_secrets()
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from routers import onboarding, admin
from db.database import create_pool, close_pool

app = FastAPI()
app.include_router(onboarding.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "* ",
        "http://localhost:5173",
        "https://www.reportinshort.com",
        "https://product-insight.integerstech.com",
        "https://product-insight-backend.integermarket.com",
        "https://dulcet-dragon-bed711.netlify.app"  # ✅ add this
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



# =====================================================
# ✅ SHUTDOWN
# =====================================================
@app.on_event("shutdown")
async def shutdown():
    tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]
    for task in tasks:
        task.cancel()
    if tasks:
        try:
            await asyncio.gather(*tasks, return_exceptions=True)
        except asyncio.CancelledError:
            pass

    try:
        await close_pool()
    except Exception:
        pass
    print("🛑 DB Pool Closed")