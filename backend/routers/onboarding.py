import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import APIRouter, Depends,Request,Response,Body,BackgroundTasks
from fastapi.responses import RedirectResponse,StreamingResponse
from schemas.onbording_schema import *
from utils.jwt_utils import *
from db.database import get_pool
from schemas.auth_service import signup_user,login_user,update_company_profile,change_user_password,google_signup_login,get_user_profile,get_company_users,update_user_profile,create_user,delete_user
from services.onboarding_service import ensure_onboarding_completed,resolve_company_id,upsert_company_for_user, update_step2, update_step3,upsert_research_preferences,insert_selected_products_v2
from db.database import get_db
import asyncpg
from services.module_data_service import build_module_inputs
import uuid
from module_runner import ModuleRunner
from datetime import datetime,timedelta
from utils.service import get_current_user
from utils.subscription_service import (
    get_company_plan,
    check_product_limit,
    check_and_increment_usage,
    apply_plan_visibility,
    apply_trial_visibility,
    check_and_handle_subscription_expiry,
)
from services.pipeline_service import run_pipeline_and_store
import asyncio
import json
from services.intelligence_fetcher import fetch_product_intelligence,get_all_products,get_reports,get_buyer_list, fetch_all_products_overview, fetch_dashboard_data, fetch_recent_activity
from services.intelligence_service import run_intelligence_background
from services.module_data_service import fetch_module_inputs
import traceback

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
EXPIRE_URL = os.getenv("EXPIRE_URL") or FRONTEND_URL

router = APIRouter()
#--------------------
#  Helper
#---------------------

async def get_company_id(conn, user_id):
    row = await conn.fetchrow("""
        SELECT companies_other_id
        FROM core_auth_table.auth_user
        WHERE user_id = $1
    """, user_id)

    return row["companies_other_id"] if row else None
#-----------------------------------------

@router.get("/dashboard")
async def dashboard(
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        user_id = current_user["user_id"]
        return await fetch_dashboard_data(conn, user_id)
    except HTTPException:
        raise
    except Exception as e:
        print("DASHBOARD ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch dashboard", "detail": str(e)})


@router.get("/dashboard/recent-activity")
async def recent_activity(
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        user_id = current_user["user_id"]
        return await fetch_recent_activity(conn, user_id)
    except HTTPException:
        raise
    except Exception as e:
        print("RECENT ACTIVITY ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch recent activity", "detail": str(e)})


@router.get("/profile")
async def user_profile(
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return await get_user_profile(conn, current_user["user_id"])
    except HTTPException:
        raise
    except Exception as e:
        print("PROFILE ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error": "Failed to fetch profile",
                "detail": str(e)
            }
        )

# @router.get("/profile")
# async def user_profile(
#     conn = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     try:
#         return await get_user_profile(conn, current_user)
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("PROFILE ERROR:", str(e))
#         raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch profile", "detail": str(e)})

@router.put("/update-profile")
async def update_profile(
    data: UpdateProfileRequest,
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        result = await update_user_profile(data, conn, current_user)
        return result
    except HTTPException:
        raise
    except Exception as e:
        print("UPDATE PROFILE ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to update profile", "detail": str(e)})

@router.put("/profile/company")
async def update_company_api(
    data: UpdateCompanyRequest,
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    return await update_company_profile(data, conn, current_user)

@router.post("/signup")
async def signup(
    data: SignupRequest,
    request: Request,
    background_tasks: BackgroundTasks,   # ✅ ADD THIS
    conn = Depends(get_db)
):
    try:
        return await signup_user(conn, data, request, background_tasks)
    except HTTPException:
        raise
    except Exception as e:
        print("SIGNUP ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Signup failed", "detail": str(e)})

@router.post("/login")
async def login(
    data: LoginRequest,
    # request: Request,
    # response: Response,
    conn = Depends(get_db)
):
    try:
        return await login_user(conn, data)
    except HTTPException:
        raise
    except Exception as e:
        print("LOGIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Login failed", "detail": str(e)})

@router.post("/auth/google")
async def google_auth(
    data: GoogleAuthRequest,
    request: Request,
    response: Response,
    conn = Depends(get_db)
):
    try:
        return await google_signup_login(
            token=data.token,
            #company_name=data.company_name,
            request=request,
            response=response,
            conn=conn
        )
    except HTTPException:
        raise
    except Exception as e:
        print("GOOGLE AUTH ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Google authentication failed", "detail": str(e)})

# @router.post("/internal/company/enrich")
# async def enrich_company(
#     data: dict,
#     conn = Depends(get_db),
#     _ = Depends(verify_internal_api)
# ):
#     try:
#         # 🔥 Call your existing function
#         await upsert_company_metadata(
#             conn=conn,
#             user_id=data.get("user_id"),  # optional
#             data=data
#         )

#         return {
#             "success": True,
#             "message": "Company enrichment successful"
#         }

#     except Exception as e:
#         print("ENRICH ERROR:", str(e))

#         raise HTTPException(
#             status_code=500,
#             detail={
#                 "success": False,
#                 "message": "Enrichment failed"
#             }
#         )

# @router.post("/company/enrich")
# async def enrich_company(
#     data: PipelineRequest,
#     current_user = Depends(get_current_user)
# ):
#     try:
#        # user_id = current_user["sub"]
#         user_id = current_user["user_id"]
#         asyncio.create_task(
#             run_pipeline_and_store(
#                 user_id=user_id,
#                 website_url=data.website_url
#             )
#         )
#         return {"success": True, "message": "Enrichment started"}
#     except HTTPException:
#         raise
#     except Exception as e:
#         print("COMPANY ENRICH ERROR:", str(e))
#         raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to start enrichment", "detail": str(e)})

@router.post("/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return await change_user_password(payload, conn, current_user)
    except HTTPException:
        raise
    except Exception as e:
        print("CHANGE PASSWORD ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to change password", "detail": str(e)})


@router.post("/step1")
async def onboarding_step1(
    payload: Step1Request,
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):
   # user_id = current_user["sub"]
    user_id = current_user["user_id"]

    try:
        # ✅ Create or update company automatically
        company_id = await upsert_company_for_user(
            conn=conn,
            user_id=user_id,
            data=payload
        )

        # ✅ Assign trial plan on first login (Google users have no company at login time)
        from utils.subscription_service import assign_trial_plan_if_needed
        await assign_trial_plan_if_needed(conn, str(company_id))

    except Exception as e:
        print("STEP1 ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to save company info"
        )

    return {
        "message": "Step 1 saved",
        "company_id": str(company_id)
    }


@router.post("/step2")
async def onboarding_step2(
    payload: Step2Request,
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # user_id = current_user["sub"]
    user_id = current_user["user_id"]
    try:
        company_id = await resolve_company_id(conn, user_id)
        await update_step2(conn, user_id, company_id, payload)
        return {"success": True, "message": "Step 2 saved"}
    except HTTPException:
        raise
    except Exception as e:
        print("STEP2 ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to save step 2", "detail": str(e)})

@router.post("/step3")
async def onboarding_step3(
    payload: Step3Request,
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # user_id = current_user["sub"]
    user_id = current_user["user_id"]
    try:
        company_id = await resolve_company_id(conn, user_id)
        await update_step3(conn, user_id, company_id, payload)
        return {"success": True, "message": "Onboarding completed"}
    except HTTPException:
        raise
    except Exception as e:
        print("STEP3 ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to save step 3", "detail": str(e)})

@router.post("/logout")
async def logout(
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        user_id = current_user["user_id"]

        # ✅ Update last_login
        await conn.execute(
            """
            UPDATE core_auth_table.auth_user
            SET last_login = NOW()
            WHERE user_id = $1
            """,
            user_id
        )

        # 🔒 Revoke all sessions for this user
        await conn.execute(
            """
            UPDATE core_auth_table.auth_sessions
            SET is_revoked = TRUE
            WHERE user_id = $1
            """,
            user_id
        )

        return {"success": True, "message": "Logged out from current device"}

    except Exception as e:
        print("LOGOUT ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Logout encountered an error", "detail": str(e)})

# @router.post("/refresh")
# async def refresh_token(
#     request: Request,
#     response: Response,
#     conn = Depends(get_db)
# ):

#     old_refresh = request.cookies.get("refresh_token")

#     if not old_refresh:
#         raise HTTPException(status_code=401, detail="Missing refresh token")

#     try:
#         payload = verify_token(old_refresh)

#         user_id = payload["sub"]
#         company_id = payload["company_id"]

#         # 🔎 Find active session
#         session = await conn.fetchrow(
#             """
#             SELECT session_id, is_revoked
#             FROM core_auth_table.auth_sessions
#             WHERE refresh_token = $1
#             """,
#             old_refresh
#         )

#         if not session or session["is_revoked"]:
#             raise HTTPException(status_code=401, detail="Token reuse detected")

#         # 🔄 Rotation

#         # 1️⃣ Revoke old refresh token
#         await conn.execute(
#             """
#             UPDATE core_auth_table.auth_sessions
#             SET is_revoked = TRUE
#             WHERE refresh_token = $1
#             """,
#             old_refresh
#         )

#         # 2️⃣ Fetch latest permissions
#         permissions = await get_user_permissions(conn, user_id)

#         # 3️⃣ Create new tokens
#         # new_refresh = create_refresh_token(user_id, company_id)
#         new_access = create_access_token(user_id, company_id, permissions)

#         # 4️⃣ Update session
#         await conn.execute(
#             """
#             UPDATE core_auth_table.auth_sessions
#             SET refresh_token = $1,
#                 is_revoked = FALSE,
#                 last_seen_at = $2,
#                 expires_at = $3
#             WHERE session_id = $4
#             """,
#             new_refresh,
#             datetime.utcnow(),
#             datetime.utcnow() + timedelta(days=7),
#             session["session_id"]
#         )

#         # 🍪 Set cookies
#         response.set_cookie(
#             key="access_token",
#             value=new_access,
#             httponly=True,
#             secure=False,
#             samesite="Lax",
#             max_age=60 * 10
#         )

#         response.set_cookie(
#             key="refresh_token",
#             value=new_refresh,
#             httponly=True,
#             secure=False,
#             samesite="Lax",
#             max_age=60 * 60 * 24 * 7
#         )

#         return {"message": "Token rotated successfully"}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail={"success": False, "error": "Invalid refresh token"})


@router.get("/verify-email")
async def verify_email(token: str, request: Request, conn=Depends(get_db)):
    try:
        # ==============================

        # 🔹 CHECK TOKEN

        # ==============================

        row = await conn.fetchrow("""

            SELECT user_id

            FROM core_auth_table.email_verification_tokens

            WHERE token = $1

            AND expires_at > NOW()

        """, token)
 
        if not row:

            return RedirectResponse(

                url=f"{EXPIRE_URL}?reason=expired",

                status_code=302

            )
 
        user_id = str(row["user_id"])
 
        # ==============================

        # 🔹 ACTIVATE USER

        # ==============================

        company_row = await conn.fetchrow("""

            UPDATE core_auth_table.auth_user

            SET status = 'active'

            WHERE user_id = $1

            RETURNING companies_other_id

        """, user_id)
 
        if not company_row:

            print("VERIFY EMAIL ERROR: user has no company linked", user_id)

            return RedirectResponse(

                url=f"{EXPIRE_URL}?reason=error",

                status_code=302

            )
 
        company_id = str(company_row["companies_other_id"])
 
        # ==============================

        # 🔹 FETCH MODULES & ASSIGN PERMISSIONS

        # ==============================

        modules = await conn.fetch("""

            SELECT sm.module_code

            FROM core_auth_table.company_subscriptions cs

            JOIN core_auth_table.subscription_plan_modules spm

                ON cs.plan_id = spm.plan_id

            JOIN core_auth_table.subscription_modules sm

                ON sm.module_id = spm.module_id

            WHERE cs.company_id = $1

            AND cs.status = 'active'

            AND spm.is_enabled = TRUE

        """, company_id)
 
        for row in modules:

            module_code = row["module_code"]

            group_name = f"{module_code}.operator"
 
            await conn.execute("""

                INSERT INTO core_auth_table.user_permissions_groups

                (id, user_id, group_id, assigned_at)

                SELECT

                    gen_random_uuid(),

                    $1,

                    pg.group_id,

                    NOW()

                FROM core_auth_table.permissions_groups pg

                WHERE pg.group_name = $2

                ON CONFLICT DO NOTHING

            """, user_id, group_name)
 
        # ==============================

        # 🔹 CREATE TOKEN

        # ==============================

        permissions = await get_user_permissions(conn, user_id)
 
        access_token = create_access_token(

            user_id,

            company_id,

            permissions

        )
 
        # ==============================

        # 🔹 CREATE SESSION (FIXED)

        # ==============================

        session_id = str(uuid.uuid4())
 
        await conn.execute("""

            INSERT INTO core_auth_table.auth_sessions

            (session_id, user_id, device, ip_address,

             user_agent, refresh_token,

             is_revoked, created_at, expires_at, last_seen_at)

            VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()+INTERVAL '7 days',NOW())

        """,

            session_id,

            user_id,

            "web",

            request.client.host,

            request.headers.get("user-agent"),

            None,   # ✅ FIX (refresh_token missing issue solved)

            False

        )
 
        # ==============================

        # 🔹 DELETE USED TOKEN

        # ==============================

        await conn.execute("""

            DELETE FROM core_auth_table.email_verification_tokens

            WHERE token = $1

        """, token)
 
        # ==============================

        # 🔹 REDIRECT WITH TOKEN (IMPORTANT)

        # ==============================

        redirect = RedirectResponse(

            url=f"{FRONTEND_URL}/verify-email?verified=true&token={access_token}",

            status_code=302

        )
 
        return redirect
 
    except HTTPException:

        raise
 
    except Exception as e:

        print("VERIFY EMAIL ERROR:", str(e))

        return RedirectResponse(

            url=f"{EXPIRE_URL}?reason=error",

            status_code=302

        )
 

# @router.get("/verify-email")
# async def verify_email(token: str, request: Request, conn=Depends(get_db)):
#     try:
#         # check token
#         row = await conn.fetchrow("""
#             SELECT user_id
#             FROM core_auth_table.email_verification_tokens
#             WHERE token = $1
#             AND expires_at > NOW()
#         """, token)

#         if not row:
#             return RedirectResponse(url=f"{EXPIRE_URL}?reason=expired", status_code=302)

#         user_id = str(row["user_id"])

#         # activate user
#         company_row = await conn.fetchrow("""
#             UPDATE core_auth_table.auth_user
#             SET status = 'active'
#             WHERE user_id = $1
#             RETURNING companies_other_id
#         """, user_id)

#         if not company_row:
#             print("VERIFY EMAIL ERROR: user has no company linked", user_id)
#             return RedirectResponse(url=f"{EXPIRE_URL}?reason=error", status_code=302)

#         company_id = str(company_row["companies_other_id"])

#         # ==============================
#         # FETCH MODULES
#         # ==============================

#         modules = await conn.fetch("""
#             SELECT sm.module_code
#             FROM core_auth_table.company_subscriptions cs
#             JOIN core_auth_table.subscription_plan_modules spm
#             ON cs.plan_id = spm.plan_id
#             JOIN core_auth_table.subscription_modules sm
#             ON sm.module_id = spm.module_id
#             WHERE cs.company_id = $1
#             AND cs.status = 'active'
#             AND spm.is_enabled = TRUE
#         """, company_id)

#         for row in modules:
#             module_code = row["module_code"]
#             group_name = f"{module_code}.operator"

#             await conn.execute("""
#                 INSERT INTO core_auth_table.user_permissions_groups
#                 (id, user_id, group_id, assigned_at)
#                 SELECT
#                     gen_random_uuid(),
#                     $1,
#                     pg.group_id,
#                     NOW()
#                 FROM core_auth_table.permissions_groups pg
#                 WHERE pg.group_name = $2
#             """, user_id, group_name)

#         # ==============================
#         # CREATE TOKENS
#         # ==============================

#         permissions = await get_user_permissions(conn, user_id)

#         access_token = create_access_token(
#             user_id,
#             company_id,
#             permissions
#         )

#         # refresh_token = create_refresh_token(
#         #     user_id,
#         #     company_id
#         # )

#         # ==============================
#         # CREATE SESSION
#         # ==============================

#         session_id = str(uuid.uuid4())

#         await conn.execute("""
#             INSERT INTO core_auth_table.auth_sessions
#             (session_id, user_id, device, ip_address,
#             user_agent, refresh_token,
#             is_revoked, created_at, expires_at, last_seen_at)
#             VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW()+INTERVAL '7 days',NOW())
#         """,
#             session_id,
#             user_id,
#             "web",
#             request.client.host,
#             request.headers.get("user-agent"),
#             #refresh_token,
#             None,
#             False
#         )

#         # Delete used token
#         await conn.execute("""
#             DELETE FROM core_auth_table.email_verification_tokens WHERE token = $1
#         """, token)

#         #redirect = RedirectResponse(url=f"{FRONTEND_URL}/verify-email?verified=true&user_id={user_id}", status_code=302)
#         redirect = RedirectResponse(
#                 url=f"{FRONTEND_URL}/verify-email?verified=true&token={access_token}",
#                 status_code=302
#             )
#         # redirect.set_cookie(
#         #     key="access_token",
#         #     value=access_token,
#         #     httponly=True,
#         #     secure=False,
#         #     samesite="Lax",
#         #     max_age=60 * 30
#         # )

#         # redirect.set_cookie(
#         #     key="refresh_token",
#         #     value=refresh_token,
#         #     httponly=True,
#         #     secure=False,
#         #     samesite="Lax",
#         #     max_age=60 * 60 * 24 * 7
#         # )

#         return redirect

#     except HTTPException:
#         raise
#     except Exception as e:
#         print("VERIFY EMAIL ERROR:", str(e))
#         return RedirectResponse(url=f"{EXPIRE_URL}?reason=error", status_code=302)


# @router.post("/research-preferences")
# async def save_research_preferences(
#     request: ResearchPreferencesRequest,
#     conn=Depends(get_db),
#     current_user=Depends(get_current_user)
# ):
#     try:
        user_id = current_user["user_id"]

#         # =========================================================
#         # ✅ 1. SAVE PREFERENCES
#         # =========================================================
#         await upsert_research_preferences(
#             conn=conn,
#             user_id=user_id,
#             data=request
#         )

#         # =========================================================
#         # ✅ 2. GET COMPANY
#         # =========================================================
#         company_id = await get_company_id(conn, user_id)

#         # =========================================================
#         # ✅ 3. GET ONLY SELECTED PRODUCTS (CRITICAL FIX)
#         # =========================================================
#         products = await conn.fetch("""
#             SELECT id, product_name, description, hs_code
#             FROM product_info.product_master
#             WHERE company_id = $1
#             AND created_by = $2
#             AND is_selected = TRUE
#         """, company_id, user_id)

#         if not products:
#             raise HTTPException(400, "No selected products found")

#         # =========================================================
#         # ✅ 4. UPDATE STATUS
#         # =========================================================
#         await conn.execute("""
#             UPDATE product_info.product_master
#             SET status = 'market_intelligence_processed',
#                 updated_at = NOW()
#             WHERE company_id = $1
#             AND created_by = $2
#             AND is_selected = TRUE
#         """, company_id, user_id)

#         # =========================================================
#         # 🚀 5. TRIGGER ENGINE (ONLY SELECTED PRODUCTS)
#         # =========================================================
#         print(f"🚀 Triggering Market Intelligence for {len(products)} products")

#         asyncio.create_task(
#             trigger_market_intelligence(
#                 company_id=company_id,
#                 user_id=user_id,
#                 products=[dict(p) for p in products]   # 🔥 PASS PRODUCTS
#             )
#         )

#         return {
#             "success": True,
#             "message": "Preferences saved & Market Intelligence started",
#             "products_count": len(products)
#         }

#     except Exception as e:
#         print("PREFERENCES ERROR:", str(e))
#         raise HTTPException(500, "Failed to save research preferences")


@router.post("/research-preferences")
async def save_research_preferences(
    request: ResearchPreferencesRequest,
    job_id: str,   # ✅ ADD THIS (IMPORTANT)
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        # user_id = current_user["sub"]
        user_id = current_user["user_id"]
        # =========================================================
        # ✅ 1. SAVE PREFERENCES
        # =========================================================
        await upsert_research_preferences(
            conn=conn,
            user_id=user_id,
            data=request
        )

        # =========================================================
        # ✅ 2. GET COMPANY + CHECK SUBSCRIPTION
        # =========================================================
        company_id = await get_company_id(conn, user_id)

        if not company_id:
            raise HTTPException(status_code=404, detail="Company not found")

        # =========================================================
        # ✅ 3. VALIDATE PRODUCTS FOR THIS JOB ONLY
        # =========================================================
        products = await conn.fetch("""
            SELECT id
            FROM product_info.product_master
            WHERE company_id = $1
            AND job_id = $2
        """, company_id, job_id)

        if not products:
            raise HTTPException(
                status_code=400,
                detail="No products found for this job"
            )

        # =========================================================
        # ✅ 4. UPDATE STATUS → PROCESSING (ONLY THIS JOB)
        # =========================================================
        await conn.execute("""
            UPDATE product_info.product_master
            SET status = 'intelligence_processing',
                updated_at = NOW()
            WHERE company_id = $1
            AND job_id = $2
        """, company_id, job_id)

        print(f"🚀 Starting intelligence | job_id={job_id} | products={len(products)}")

        # =========================================================
        # ✅ 5. CHECK LIMITS BEFORE STARTING (plan-aware)
        # =========================================================
        from datetime import datetime, timezone
        from utils.subscription_service import PLAN_CONFIG as _PC
        now   = datetime.now(timezone.utc)
        today = now.date()

        subscription = await conn.fetchrow("""
            SELECT sp.plan_name, sp.query_limit, cs.start_date, cs.end_date
            FROM core_auth_table.company_subscriptions cs
            JOIN core_auth_table.subscription_plans sp ON cs.plan_id = sp.plan_id
            WHERE cs.company_id = $1 AND cs.status = 'active'
            ORDER BY cs.created_at DESC LIMIT 1
        """, company_id)

        plan_name   = subscription["plan_name"]   if subscription else "trial"
        daily_limit = subscription["query_limit"] if subscription else None
        unlimited   = (daily_limit is None or daily_limit == -1)

        plan_cfg   = _PC.get(plan_name, {})
        limit_type = plan_cfg.get("limit_type", "daily")

        addon_remaining = 0
        addon_row = await conn.fetchrow("""
            SELECT COALESCE(SUM(credits - credits_used), 0) AS addon_left
            FROM core_auth_table.company_addon_purchases
            WHERE company_id = $1 AND payment_status = 'paid'
        """, company_id)
        addon_remaining = int(addon_row["addon_left"]) if addon_row else 0

        can_run = len(products)

        if not unlimited:
            if limit_type == "daily":
                # ── TRIAL: daily reset check ───────────────────────────────
                used_row = await conn.fetchrow("""
                    SELECT COALESCE(SUM(usage_count), 0) AS total_used
                    FROM core_auth_table.company_usage
                    WHERE company_id = $1 AND usage_date = $2
                      AND module_code NOT LIKE 'addon_%'
                """, company_id, today)
                used_today = int(used_row["total_used"]) if used_row else 0
                effective_remaining = (daily_limit - used_today) + addon_remaining

                if effective_remaining <= 0:
                    return {
                        "success":        False,
                        "error":          "daily_limit_reached",
                        "message":        f"Daily limit of {daily_limit} queries reached. Resets tomorrow at midnight UTC.",
                        "used_today":     used_today,
                        "daily_limit":    daily_limit,
                        "addon_credits":  addon_remaining,
                        "can_run":        0,
                        "products_count": len(products),
                    }
                can_run = min(len(products), effective_remaining)

            else:
                # ── BASIC / PRO: product cap per day + monthly pool ────────
                product_limit_per_day = plan_cfg.get("product_limit_per_day", -1)

                if product_limit_per_day != -1:
                    prod_row = await conn.fetchrow("""
                        SELECT COALESCE(SUM(usage_count), 0) AS total
                        FROM core_auth_table.company_usage
                        WHERE company_id = $1
                          AND module_code = 'product_intelligence'
                          AND usage_date = $2
                    """, company_id, today)
                    products_used_today = int(prod_row["total"]) if prod_row else 0
                    products_remaining  = product_limit_per_day - products_used_today

                    if products_remaining <= 0:
                        return {
                            "success":                 False,
                            "error":                   "daily_product_limit_reached",
                            "message":                 "Daily product limit has reached. Resets tomorrow at midnight UTC.",
                            "product_limit_per_day":   product_limit_per_day,
                            "products_used_today":     products_used_today,
                            "addon_credits":           addon_remaining,
                            "can_run":                 0,
                            "products_count":          len(products),
                        }
                    can_run = min(len(products), products_remaining)

                # Monthly pool check
                start_date_only = subscription["start_date"]
                if hasattr(start_date_only, "date"):
                    start_date_only = start_date_only.date()
                month_row = await conn.fetchrow("""
                    SELECT COALESCE(SUM(usage_count), 0) AS total_used
                    FROM core_auth_table.company_usage
                    WHERE company_id = $1
                      AND usage_date >= $2
                      AND module_code NOT LIKE 'addon_%'
                """, company_id, start_date_only)
                used_this_cycle = int(month_row["total_used"]) if month_row else 0
                end_date = subscription["end_date"]
                if end_date and start_date_only:
                    days_in_cycle = max((end_date.date() - start_date_only).days, 1)
                else:
                    days_in_cycle = 30
                monthly_limit = daily_limit * days_in_cycle
                cycle_remaining = (monthly_limit - used_this_cycle) + addon_remaining

                if cycle_remaining <= 0:
                    return {
                        "success":          False,
                        "error":            "monthly_limit_reached",
                        "message":          f"Monthly query limit of {monthly_limit} reached. Purchase add-on credits to continue.",
                        "monthly_limit":    monthly_limit,
                        "used_this_month":  used_this_cycle,
                        "addon_credits":    addon_remaining,
                        "can_run":          0,
                        "products_count":   len(products),
                    }

        # =========================================================
        # 🚀 6. SAFE BACKGROUND EXECUTION
        # =========================================================
        asyncio.create_task(
            run_intelligence_background(company_id, job_id)
        )

        # =========================================================
        # ✅ 7. RESPONSE
        # =========================================================

        return {
            "success":        True,
            "message":        "Preferences saved & intelligence started",
            "company_id":     company_id,
            "job_id":         job_id,
            "products_count": len(products),
            "can_run":        can_run,
            "addon_credits":  addon_remaining,
        }

    except HTTPException:
        raise

    except Exception as e:
        print("❌ PREFERENCES ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to save research preferences"
        )

@router.post("/pipeline/run")
async def run_pipeline_endpoint(
    request: PipelineRequest,
    conn = Depends(get_db),
    current_user = Depends(get_current_user),
    _= Depends(ensure_onboarding_completed)
):
    user_id = current_user["user_id"]

    try:
        # =========================================================
        # ✅ CREATE JOB (INSTEAD OF RUNNING PIPELINE)
        # =========================================================
        job_id = str(uuid.uuid4())

        await conn.execute("""
            INSERT INTO core_tables.pipeline_jobs (
                id,
                user_id,
                website_url,
                status,
                created_at,
                updated_at
            )
            VALUES ($1,$2,$3,'pending',NOW(),NOW())
        """,
            job_id,
            user_id,
            str(request.website_url)
        )

        return {
            "success": True,
            "message": "Pipeline started",
            "job_id": job_id,
            "status": "pending"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Pipeline failed to start: {str(e)}"
        )

@router.get("/pipeline/products/{job_id}")
async def get_pipeline_products(
    job_id: str,
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    # user_id = current_user["sub"]
    user_id = current_user["user_id"]
    try:
        rows = await conn.fetch("""
            SELECT id, product_data, is_selected
            FROM product_info.pipeline_temp_products
            WHERE job_id = $1
            AND user_id = $2
            ORDER BY created_at DESC
        """, job_id, user_id)

        # ✅ Convert JSON properly
        result = []
        for r in rows:
            data = r["product_data"]
            if isinstance(data, str):
                data = json.loads(data)
            result.append({
                "id": str(r["id"]),
                "is_selected": r["is_selected"],
                **data
            })

        return {"success": True, "products": result, "count": len(result)}

    except Exception as e:
        print("GET PIPELINE PRODUCTS ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch pipeline products", "detail": str(e)})


# @router.get("/pipeline/status/{job_id}")
# async def get_pipeline_status(
#     job_id: str,
#     conn=Depends(get_db),
#     current_user=Depends(get_current_user)
# ):
#     # user_id = current_user["sub"]
#     user_id = current_user["user_id"]
#     try:
#         job = await conn.fetchrow("""
#             SELECT
#                 id,
#                 status,
#                 stage,
#                 progress,
#                 retry_count,
#                 error,
#                 logs,
#                 partial_product,
#                 created_at,
#                 updated_at
#             FROM core_tables.pipeline_jobs
#             WHERE id = $1 AND user_id = $2
#         """, job_id, user_id)

#         if not job:
#             raise HTTPException(status_code=404, detail={"success": False, "error": "Job not found", "code": "JOB_NOT_FOUND"})

#         job = dict(job)

#         status = job.get("status") or "pending"
#         stage = job.get("stage") or "starting"
#         progress = job.get("progress") or 0
#         progress = max(0, min(100, progress))

#         logs = job.get("logs") or []
#         if isinstance(logs, str):
#             logs = [logs]

#         return {
#             "success": True,
#             "job_id": job["id"],
#             "status": status,
#             "stage": stage,
#             "progress": progress,
#             "retry_count": job.get("retry_count", 0),
#             "error": job.get("error"),
#             "logs": logs,
#             "partial_product": job.get("partial_product"),
#             "timestamps": {
#                 "created_at": job.get("created_at"),
#                 "updated_at": job.get("updated_at"),
#             },
#             "is_completed": status == "completed",
#             "is_failed": status == "failed",
#             "is_processing": status == "processing"
#         }

#     except HTTPException:
#         raise
#     except Exception as e:
#         print("PIPELINE STATUS ERROR:", str(e))
#         raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch pipeline status", "detail": str(e)})


@router.get("/pipeline/stream/{job_id}")
async def stream_pipeline_status(
    job_id: str,
    request: Request,
    current_user=Depends(get_current_user),
):
    user_id = current_user["user_id"]

    async def event_generator():
        pool = get_pool()
        async with pool.acquire() as conn:
            while True:
                if await request.is_disconnected():
                    break

                job = await conn.fetchrow("""
                    SELECT j.status, j.stage, j.progress, j.logs, j.error,
                           j.updated_at,
                           -- ✅ fetch current engine from all products in this job
                           ARRAY_AGG(DISTINCT pm.current_engine) 
                               FILTER (WHERE pm.current_engine IS NOT NULL) AS active_engines,
                           ARRAY_AGG(DISTINCT pm.product_name) AS product_names,
                           COUNT(pm.id) AS total_products,
                           COUNT(pm.id) FILTER (
                               WHERE pm.status = 'intelligence_completed'
                           ) AS completed_products
                    FROM core_tables.pipeline_jobs j
                    LEFT JOIN product_info.product_master pm
                        ON pm.job_id = j.id
                    WHERE j.id = $1 AND j.user_id = $2
                    GROUP BY j.status, j.stage, j.progress, j.logs, 
                             j.error, j.updated_at
                """, job_id, user_id)

                if not job:
                    yield f"data: {json.dumps({'error': 'Job not found'})}\n\n"
                    break

                status   = job["status"]   or "pending"
                progress = max(0, min(100, job["progress"] or 0))
                logs     = job["logs"] or []
                if isinstance(logs, str):
                    logs = [logs]

                data = {
                    "job_id":             job_id,
                    "status":             status,
                    "stage":              job["stage"] or "starting",
                    "progress":           progress,
                    "logs":               logs,
                    "error":              job["error"],

                    # ✅ live engine updates
                    "active_engines":     job["active_engines"] or [],
                    "product_names":      job["product_names"]  or [],
                    "total_products":     job["total_products"]  or 0,
                    "completed_products": job["completed_products"] or 0,

                    "is_completed":       status == "completed",
                    "is_failed":          status == "failed",
                    "is_processing":      status == "processing",
                }

                print(f"📡 [stream] job={job_id} | status={status} | progress={progress}%")
                yield f"data: {json.dumps(data, default=str)}\n\n"

                if status in ("completed", "failed"):
                    break

                await asyncio.sleep(1)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control":    "no-cache",
            "X-Accel-Buffering": "no",
            "Connection":       "keep-alive",
        }
    )


@router.post("/products/select")
async def select_products(
    job_id: str,
    product_ids: List[str],
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    # user_id = current_user["sub"]
    user_id = current_user["user_id"]
    try:
        company_id = await get_company_id(conn, user_id)
        plan_name = await get_company_plan(conn, str(company_id) if company_id else None)

        # Check plan product limit before allowing selection
        await check_product_limit(conn, str(company_id), plan_name)

        # 🔄 reset selection
        await conn.execute("""
            UPDATE product_info.pipeline_temp_products
            SET is_selected = FALSE
            WHERE job_id = $1 AND user_id = $2
        """, job_id, user_id)

        # ✅ fetch selected rows
        rows = await conn.fetch("""
            SELECT id, product_data
            FROM product_info.pipeline_temp_products
            WHERE id = ANY($1::uuid[])
            AND user_id = $2
            AND job_id = $3
        """, product_ids, user_id, job_id)

        updated_products = []

        for r in rows:
            raw = r["product_data"]
            p = json.loads(raw) if isinstance(raw, str) else raw

            missing_fields = []

            def check(field, label, required, suggestion):
                value = p.get(field)
                if value is None or value == "" or value == []:
                    missing_fields.append({
                        "field": field,
                        "label": label,
                        "required": required,
                        "suggestion": suggestion
                    })

            check("product_name", "Product Name", True, "Enter product name")
            check("description", "Description", True, "Add 2–3 sentence description")
            check("category", "Category", True, "Select product category")
            check("price", "Price", False, "Add FOB price")
            check("packaging", "Packaging", False, "Add packaging details")
            check("moq", "MOQ", False, "Add minimum order quantity")
            check("hs_code", "HS Code", False, "Add HS code")
            check("ingredients", "Ingredients", False, "Add ingredients")
            check("images", "Images", False, "Add product images")
            check("specifications", "Specifications", False, "Add specs")

            p["missing_fields"] = missing_fields

            await conn.execute("""
                UPDATE product_info.pipeline_temp_products
                SET product_data = $1,
                    is_selected = TRUE,
                    updated_at = NOW()
                WHERE id = $2
            """, json.dumps(p), r["id"])

            updated_products.append({
                "id": str(r["id"]),
                "product_data": p
            })

        # Deduct 1 query per selected product
        for _ in updated_products:
            await check_and_increment_usage(conn, str(company_id), "product_intelligence")

        return {
            "success": True,
            "selected_count": len(product_ids),
            "products": updated_products
        }

    except HTTPException:
        raise
    except Exception as e:
        print("PRODUCTS SELECT ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to select products", "detail": str(e)})

@router.post("/products/update")
async def update_product(
    product_id: str,
    updates: Dict = Body(...),
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    # user_id = current_user["sub"]
    user_id = current_user["user_id"]
    try:
        # 🔍 get existing data
        row = await conn.fetchrow("""
            SELECT product_data
            FROM product_info.pipeline_temp_products
            WHERE id = $1 AND user_id = $2
        """, product_id, user_id)

        if not row:
            raise HTTPException(status_code=404, detail={"success": False, "error": "Product not found", "code": "PRODUCT_NOT_FOUND"})

        raw = row["product_data"]
        p = json.loads(raw) if isinstance(raw, str) else raw

        for key, value in updates.items():
            p[key] = value

        missing_fields = []

        def check(field, label, required):
            value = p.get(field)
            if value is None or value == "" or value == []:
                missing_fields.append({"field": field, "label": label, "required": required})

        check("product_name", "Product Name", True)
        check("description", "Description", True)
        check("category", "Category", True)

        p["missing_fields"] = missing_fields

        await conn.execute("""
            UPDATE product_info.pipeline_temp_products
            SET product_data = $1,
                updated_at = NOW()
            WHERE id = $2
        """, json.dumps(p), product_id)

        return {"success": True, "product_data": p}

    except HTTPException:
        raise
    except Exception as e:
        print("PRODUCT UPDATE ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to update product", "detail": str(e)})

@router.post("/products/confirm/{job_id}")
async def confirm_products(
    job_id: str,
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        # user_id = current_user["sub"]
        user_id = current_user["user_id"]
        company_id = await get_company_id(conn, user_id)

        # ✅ get selected
        selected_products = await conn.fetch("""
            SELECT product_data
            FROM product_info.pipeline_temp_products
            WHERE job_id = $1
            AND user_id = $2
            AND is_selected = TRUE
        """, job_id, user_id)

        if not selected_products:
            raise HTTPException(400, "No products selected")

        # ✅ insert into main
        await insert_selected_products_v2(
            conn,
            user_id,
            company_id,
            selected_products,
            job_id
        )

        # ✅ fetch inserted product ids
        inserted_products = await conn.fetch("""
            SELECT id, product_name
            FROM product_info.product_master
            WHERE job_id = $1
              AND created_by = $2
              AND company_id = $3
        """, job_id, user_id, company_id)

        # ✅ mark processed
        await conn.execute("""
            UPDATE product_info.pipeline_temp_products
            SET status = 'processed',
                updated_at = NOW()
            WHERE job_id = $1
            AND user_id = $2
            AND is_selected = TRUE
        """, job_id, user_id)

        return {
            "success": True,
            "message": "Products moved to main table",
            "count": len(inserted_products),
            "products": [
                {"product_id": str(r["id"]), "product_name": r["product_name"]}
                for r in inserted_products
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        print("CONFIRM ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to confirm products", "detail": str(e)})


# @router.get("/products/fetched/{id}")
# async def get_single_product(
#     id: str,
#     conn = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):
#     # user_id = current_user["sub"]
#     user_id = current_user["user_id"]
#     try:
#         row = await conn.fetchrow("""
#             SELECT id, product_data
#             FROM product_info.pipeline_temp_products
#             WHERE id = $1 AND user_id = $2
#         """, id, user_id)

#         if not row:
#             raise HTTPException(status_code=404, detail={"success": False, "error": "Product not found", "code": "PRODUCT_NOT_FOUND"})

#         data = row["product_data"]
#         if isinstance(data, str):
#             data = json.loads(data)

#         return {"success": True, "id": str(row["id"]), **data}

#     except HTTPException:
#         raise
#     except Exception as e:
#         print("GET PRODUCT ERROR:", str(e))
#         raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch product", "detail": str(e)})

# @router.post("/intelligence/run")
# async def run_intelligence(
#     company_id: str,
#     conn=Depends(get_db)
# ):
#     """
#     Run intelligence modules for all selected products of a company.

#     - Fetches product + company data from DB
#     - Builds ModuleInput for each product
#     - Runs all modules
#     """

#     # =========================================================
#     # ✅ 1. FETCH DATA FROM DB
#     # =========================================================
#     try:
#         rows = await fetch_module_inputs(conn, company_id)

#         if not rows:
#             raise HTTPException(
#                 status_code=404,
#                 detail="No selected products found for this company"
#             )

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(
#             status_code=500,
#             detail=f"DB fetch failed: {str(e)}"
#         )

#     # =========================================================
#     # ✅ 2. BUILD MODULE INPUTS
#     # =========================================================
#     try:
#         inputs = build_module_inputs(rows)

#         if not inputs:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Failed to build module inputs"
#             )

#     except Exception as e:
#         raise HTTPException(
#             status_code=422,
#             detail=f"Input build failed: {str(e)}"
#         )

#     # =========================================================
#     # ✅ 3. RUN MODULES FOR EACH PRODUCT
#     # =========================================================
#     results = []

#     try:
#         runner = ModuleRunner()

#         for inp in inputs:
#             try:
#                 result = await runner.run_all(inp)

#                 results.append({
#                     "product_id": inp.product_id,
#                     "success": True,
#                     "data": result
#                 })

#             except Exception as e:
#                 traceback.print_exc()

#                 results.append({
#                     "product_id": inp.product_id,
#                     "success": False,
#                     "error": str(e)
#                 })

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(
#             status_code=500,
#             detail=f"Runner failed: {type(e).__name__}: {str(e)}"
#         )

#     # =========================================================
#     # ✅ 4. RETURN RESPONSE
#     # =========================================================
#     return {
#         "company_id": company_id,
#         "total_products": len(inputs),
#         "results": results
#     }

@router.get("/product-intelligence/{product_id}")
async def get_product_intelligence(
    product_id: str,
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Validate UUID format before touching the DB
    try:
        uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=422, detail={
            "error": "Invalid product_id format",
            "detail": f"'{product_id}' is not a valid UUID",
            "code": "INVALID_UUID",
            "success":False
        })

    # user_id = current_user["sub"]
    user_id = current_user["user_id"]
    data = await fetch_product_intelligence(conn, product_id, user_id)

    if not data.get("success", True):
        code = data.get("code", "UNKNOWN")
        status = 404 if code == "PRODUCT_NOT_FOUND" else 500
        raise HTTPException(status_code=status, detail={
            "error": data.get("error"),
            "detail": data.get("detail"),
            "code": code,
        })

    company_id = current_user.get("company_id")
    plan_name = await get_company_plan(conn, str(company_id) if company_id else None)
    print(f"🔒 Applying plan visibility | plan={plan_name} | company={company_id}")
    market_raw = data.get("market_intelligence", {})
    print(f"🔒 market_info count before mask: {len(market_raw.get('market_info', []))}")
    data = apply_plan_visibility(data, plan_name)
    market_masked = data.get("market_intelligence", {})
    print(f"🔒 market_info count after mask: {len(market_masked.get('market_info', []))}")
    data["plan"] = plan_name

    return data


@router.get("/products-overview")
async def get_all_products_overview(
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        user_id = current_user["user_id"]
        data = await fetch_all_products_overview(conn, user_id)

        if not data.get("success"):
            raise HTTPException(status_code=500, detail={
                "success": False,
                "error": data.get("error"),
                "detail": data.get("detail"),
                "code": data.get("code"),
            })

        company_id = current_user.get("company_id")
        plan_name = await get_company_plan(conn, str(company_id) if company_id else None)
        data["products"] = apply_trial_visibility(data.get("products", []), plan_name)
        data["plan"] = plan_name

        return data

    except HTTPException:
        raise
    except Exception as e:
        print("PRODUCTS OVERVIEW ERROR:", str(e))
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": "Failed to fetch products overview",
            "detail": str(e)
        })

# =========================================================
# BILLING — USAGE DASHBOARD
# =========================================================
@router.get("/billing/usage")
async def get_usage_dashboard(
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    company_id = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=403, detail="No company linked to this account")

    try:
        from datetime import datetime, timezone
        from utils.subscription_service import PLAN_CONFIG
        now   = datetime.now(timezone.utc)
        today = now.date()

        # 1. Active plan + query_limit + subscription dates
        subscription = await conn.fetchrow("""
            SELECT sp.plan_name, sp.query_limit,
                   cs.start_date, cs.end_date, cs.billing_cycle
            FROM core_auth_table.company_subscriptions cs
            JOIN core_auth_table.subscription_plans sp ON cs.plan_id = sp.plan_id
            WHERE cs.company_id = $1 AND cs.status = 'active'
            ORDER BY cs.created_at DESC LIMIT 1
        """, company_id)

        if not subscription:
            raise HTTPException(status_code=402, detail="No active subscription")

        plan_name     = subscription["plan_name"]
        daily_limit   = subscription["query_limit"]   # -1 = unlimited
        billing_cycle = subscription["billing_cycle"]
        end_date      = subscription["end_date"]
        unlimited     = (daily_limit is None or daily_limit == -1)

        # 2. Modules allowed for this plan (use PLAN_CONFIG as source of truth)
        plan_cfg     = PLAN_CONFIG.get(plan_name, {})
        modules_cfg  = plan_cfg.get("modules", [])
        all_modules  = [
            "product", "overview", "variants",
            "price_intelligence", "buyers_intelligence",
            "trade_intelligence", "market_intelligence",
            "competitor_intelligence", "scoring",
        ]
        active_modules = all_modules if modules_cfg == "all" else modules_cfg
        # Filter out non-intelligence keys
        skip = {"product", "overview"}
        active_modules = [m for m in active_modules if m not in skip]

        # 3. Usage counts — scope depends on plan type
        from datetime import timedelta
        from utils.subscription_service import PLAN_CONFIG as _PC
        start_date      = subscription["start_date"]
        start_date_only = start_date.date() if hasattr(start_date, "date") else start_date
        plan_cfg        = _PC.get(plan_name, {})
        limit_type      = plan_cfg.get("limit_type", "daily")   # "daily"=trial, "monthly"=basic/pro

        if end_date and start_date:
            days_in_cycle = max((end_date.date() - start_date_only).days, 1)
        else:
            days_in_cycle = 365 if billing_cycle == "yearly" else 30

        year_start = today.replace(month=1, day=1)

        free_row = await conn.fetchrow("""
            SELECT
                COALESCE(SUM(usage_count) FILTER (WHERE usage_date = $2), 0)  AS free_used_today,
                COALESCE(SUM(usage_count) FILTER (WHERE usage_date >= $3), 0) AS free_used_cycle,
                COALESCE(SUM(usage_count) FILTER (WHERE usage_date >= $4), 0) AS free_used_year,
                COALESCE(SUM(usage_count) FILTER (
                    WHERE usage_date = $2 AND module_code = 'product_intelligence'
                ), 0) AS products_used_today
            FROM core_auth_table.company_usage
            WHERE company_id = $1
              AND module_code NOT LIKE 'addon_%'
              AND usage_date >= $3
        """, company_id, today, start_date_only, year_start)

        free_used_today       = int(free_row["free_used_today"])   if free_row else 0
        free_used_cycle       = int(free_row["free_used_cycle"])   if free_row else 0
        free_used_year        = int(free_row["free_used_year"])    if (free_row and billing_cycle == "yearly") else 0
        products_used_today   = int(free_row["products_used_today"]) if free_row else 0

        # 4. Add-on credits
        addon_row = await conn.fetchrow("""
            SELECT
                COALESCE(SUM(credits), 0)      AS addon_total,
                COALESCE(SUM(credits_used), 0) AS addon_used
            FROM core_auth_table.company_addon_purchases
            WHERE company_id = $1
              AND payment_status = 'paid'
              AND ($2::timestamptz IS NULL OR created_at <= $2::timestamptz)
        """, company_id, end_date)
        addon_total     = int(addon_row["addon_total"]) if addon_row else 0
        addon_used_all  = int(addon_row["addon_used"])  if addon_row else 0
        addon_remaining = addon_total - addon_used_all

        # ── Build usage_summary based on plan type ────────────────────────────
        if unlimited:
            usage_summary = {
                "daily_limit":          "unlimited",
                "monthly_limit":        "unlimited",
                "yearly_limit":         "unlimited" if billing_cycle == "yearly" else 0,
                "used_today":           free_used_today,
                "used_this_cycle":      free_used_cycle,
                "used_this_year":       free_used_year,
                "remaining_today":      "unlimited",
                "cycle_remaining":      "unlimited",
                "yearly_remaining":     "unlimited" if billing_cycle == "yearly" else 0,
                "addon_purchased":      addon_total,
                "addon_used":           addon_used_all,
                "addon_remaining":      addon_remaining,
            }

        elif limit_type == "daily":
            # ── TRIAL: daily reset ─────────────────────────────────────────────
            free_remaining = max(daily_limit - free_used_today, 0)
            usage_summary = {
                "daily_limit":          daily_limit,
                "used_today":           free_used_today,
                "free_remaining":       free_remaining,
                "addon_purchased":      addon_total,
                "addon_used":           addon_used_all,
                "addon_remaining":      addon_remaining,
                "remaining_today":      free_remaining + addon_remaining,
                "resets":               "daily at midnight UTC",
            }

        else:
            # ── BASIC / PRO: monthly pool, no daily reset ──────────────────────
            monthly_limit         = daily_limit * days_in_cycle
            monthly_remaining     = max(monthly_limit - free_used_cycle, 0)
            yearly_limit          = (daily_limit * days_in_cycle) if billing_cycle == "yearly" else 0
            yearly_remaining      = max(yearly_limit - free_used_year, 0) if billing_cycle == "yearly" else 0
            product_limit_per_day = plan_cfg.get("product_limit_per_day", 0)
            products_remaining    = max(product_limit_per_day - products_used_today, 0)

            usage_summary = {
                "monthly_limit":          monthly_limit,
                "yearly_limit":           yearly_limit,
                "used_this_month":        free_used_cycle,
                "used_this_year":         free_used_year,
                "monthly_remaining":      monthly_remaining,
                "yearly_remaining":       yearly_remaining,
                "product_limit_per_day":  product_limit_per_day,
                "products_used_today":    products_used_today,
                "products_remaining_today": products_remaining,
                "addon_purchased":        addon_total,
                "addon_used":             addon_used_all,
                "addon_remaining":        addon_remaining,
            }

        return {
            "success":        True,
            "plan_name":      plan_name,
            "billing_cycle":  billing_cycle,
            "end_date":       str(end_date).split(".")[0] if end_date else "no expiry",
            "date":           str(today),
            "usage":          usage_summary,
            "active_modules": active_modules,
        }

    except HTTPException:
        raise
    except Exception as e:
        print("BILLING USAGE ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


# =========================================================
# BILLING — ADDON PACKAGES
# =========================================================
@router.get("/billing/addon-packages")
async def get_addon_packages(
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        packages = await conn.fetch("""
            SELECT id, name, credits, price, currency, module_code
            FROM core_auth_table.addon_packages
            WHERE is_active = TRUE
            ORDER BY module_code, credits ASC
        """)

        return {
            "success": True,
            "packages": [
                {
                    "id":          str(row["id"]),
                    "name":        row["name"],
                    "module_code": row["module_code"],
                    "credits":     row["credits"],
                    "price":       float(row["price"]),
                    "currency":    row["currency"],
                }
                for row in packages
            ]
        }

    except Exception as e:
        print("ADDON PACKAGES ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


# =========================================================
# RAZORPAY CLIENT HELPER
# Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env
# =========================================================
def _get_razorpay_client():
    import razorpay, os
    key_id     = os.environ.get("RAZORPAY_KEY_ID", "")
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", "")
    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail="Razorpay credentials not configured")
    return razorpay.Client(auth=(key_id, key_secret))


# =========================================================
# BILLING — CREATE ADDON ORDER
# =========================================================
@router.post("/billing/create-addon-order")
async def create_addon_order(
    package_id: str,
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    company_id = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=403, detail="No company linked to this account")

    try:
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)

        package = await conn.fetchrow("""
            SELECT module_code, credits, price, currency
            FROM core_auth_table.addon_packages
            WHERE id = $1 AND is_active = TRUE
        """, package_id)

        if not package:
            raise HTTPException(status_code=404, detail="Package not found")

        # Create Razorpay order
        rz = _get_razorpay_client()
        rz_order = rz.order.create({
            "amount":   int(float(package["price"]) * 100),  # paise
            "currency": package["currency"] or "INR",
            "receipt":  str(uuid.uuid4()),
            "notes":    {"company_id": company_id, "module_code": package["module_code"]},
        })
        order_id = rz_order["id"]

        await conn.execute("""
            INSERT INTO core_auth_table.company_addon_purchases
            (id, company_id, module_code, credits, amount_paid, currency,
             payment_status, payment_provider, provider_order_id, month, year)
            VALUES ($1,$2,$3,$4,$5,$6,'pending','razorpay',$7,$8,$9)
        """,
            str(uuid.uuid4()),
            company_id,
            package["module_code"],
            package["credits"],
            package["price"],
            package["currency"] or "INR",
            order_id,
            now.month,
            now.year,
        )

        return {
            "success":     True,
            "order_id":    order_id,
            "amount":      int(float(package["price"]) * 100),
            "currency":    package["currency"] or "INR",
            "credits":     package["credits"],
            "module_code": package["module_code"],
        }

    except HTTPException:
        raise
    except Exception as e:
        print("CREATE ADDON ORDER ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


# =========================================================
# BILLING — VERIFY ADDON PAYMENT
# =========================================================
class AddonPaymentVerifyRequest(BaseModel):
    razorpay_order_id:   str
    razorpay_payment_id: str
    razorpay_signature:  str

@router.post("/billing/verify-payment")
async def verify_addon_payment(
    body: AddonPaymentVerifyRequest,
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        import razorpay.errors

        rz = _get_razorpay_client()

        # Verify Razorpay signature
        try:
            rz.utility.verify_payment_signature({
                "razorpay_order_id":   body.razorpay_order_id,
                "razorpay_payment_id": body.razorpay_payment_id,
                "razorpay_signature":  body.razorpay_signature,
            })
        except razorpay.errors.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        purchase = await conn.fetchrow("""
            SELECT credits, module_code, credits_used, payment_status, company_id
            FROM core_auth_table.company_addon_purchases
            WHERE provider_order_id = $1
        """, body.razorpay_order_id)

        if not purchase:
            raise HTTPException(status_code=404, detail="Order not found")

        # If webhook already processed it — skip update, just return success
        if purchase["payment_status"] != "paid":
            await conn.execute("""
                UPDATE core_auth_table.company_addon_purchases
                SET payment_status = 'paid', razorpay_payment_id = $2
                WHERE provider_order_id = $1
            """, body.razorpay_order_id, body.razorpay_payment_id)

        # Total remaining add-on credits for this month
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        addon_row = await conn.fetchrow("""
            SELECT COALESCE(SUM(credits - credits_used), 0) AS total_remaining
            FROM core_auth_table.company_addon_purchases
            WHERE company_id = $1
              AND payment_status = 'paid'
              AND month = $2 AND year = $3
        """, str(purchase["company_id"]), now.month, now.year)

        return {
            "success":           True,
            "message":           f"{purchase['credits']} add-on queries activated",
            "credits_added":     purchase["credits"],
            "module_code":       purchase["module_code"],
            "addon_remaining":   int(addon_row["total_remaining"]) if addon_row else purchase["credits"],
        }

    except HTTPException:
        raise
    except Exception as e:
        print("VERIFY ADDON PAYMENT ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


# =========================================================
# BILLING — CREATE SUBSCRIPTION ORDER
# =========================================================
@router.post("/billing/create-subscription-order")
async def create_subscription_order(
    plan_name: str,
    billing_cycle: str,
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    company_id = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=403, detail="No company linked to this account")

    if billing_cycle not in ("monthly", "yearly"):
        raise HTTPException(status_code=400, detail="billing_cycle must be 'monthly' or 'yearly'")

    try:
        plan = await conn.fetchrow("""
            SELECT plan_id, monthly_price, yearly_price
            FROM core_auth_table.subscription_plans
            WHERE LOWER(plan_name::text) = LOWER($1) AND status = 'active'
        """, plan_name)

        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")

        amount = plan["monthly_price"] if billing_cycle == "monthly" else plan["yearly_price"]
        if not amount:
            raise HTTPException(status_code=400, detail=f"{billing_cycle} pricing not available for this plan")

        # Prevent same-plan re-subscription
        current_plan = await conn.fetchrow("""
            SELECT sp.plan_name
            FROM core_auth_table.company_subscriptions cs
            JOIN core_auth_table.subscription_plans sp ON cs.plan_id = sp.plan_id
            WHERE cs.company_id = $1 AND cs.status = 'active'
            ORDER BY cs.created_at DESC LIMIT 1
        """, company_id)

        if current_plan and current_plan["plan_name"].lower() == plan_name.lower():
            raise HTTPException(status_code=400, detail=f"Already on {plan_name} plan")

        # Cancel any stale pending orders
        await conn.execute("""
            UPDATE core_auth_table.company_subscription_payments
            SET payment_status = 'cancelled'
            WHERE company_id = $1 AND payment_status = 'pending'
        """, company_id)

        # Create Razorpay order
        rz = _get_razorpay_client()
        rz_order = rz.order.create({
            "amount":   int(float(amount) * 100),  # paise
            "currency": "INR",
            "receipt":  str(uuid.uuid4()),
            "notes":    {"company_id": company_id, "plan_name": plan_name, "billing_cycle": billing_cycle},
        })
        order_id = rz_order["id"]

        await conn.execute("""
            INSERT INTO core_auth_table.company_subscription_payments
            (id, company_id, plan_id, amount, currency, payment_status,
             payment_provider, provider_order_id, billing_cycle)
            VALUES ($1,$2,$3,$4,'INR','pending','razorpay',$5,$6)
        """,
            str(uuid.uuid4()),
            company_id,
            str(plan["plan_id"]),
            amount,
            order_id,
            billing_cycle,
        )

        return {
            "success":       True,
            "order_id":      order_id,
            "plan_name":     plan_name,
            "billing_cycle": billing_cycle,
            "amount":        int(float(amount) * 100),
            "currency":      "INR",
        }

    except HTTPException:
        raise
    except Exception as e:
        print("CREATE SUBSCRIPTION ORDER ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


# =========================================================
# BILLING — VERIFY SUBSCRIPTION PAYMENT + ACTIVATE
# =========================================================


@router.post("/billing/verify-subscription-payment")
async def verify_subscription_payment(
    body: SubscriptionPaymentVerifyRequest,
    conn=Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        import razorpay.errors
        from utils.subscription_service import upgrade_company_plan

        rz = _get_razorpay_client()

        # Verify Razorpay signature
        try:
            rz.utility.verify_payment_signature({
                "razorpay_order_id":   body.razorpay_order_id,
                "razorpay_payment_id": body.razorpay_payment_id,
                "razorpay_signature":  body.razorpay_signature,
            })
        except razorpay.errors.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        payment = await conn.fetchrow("""
            SELECT company_id, plan_id, billing_cycle, payment_status
            FROM core_auth_table.company_subscription_payments
            WHERE provider_order_id = $1
        """, body.razorpay_order_id)

        if not payment:
            raise HTTPException(status_code=404, detail="Payment order not found")

        company_id    = str(payment["company_id"])
        billing_cycle = payment["billing_cycle"]
        duration_days = 30 if billing_cycle == "monthly" else 365

        plan_row = await conn.fetchrow("""
            SELECT plan_name FROM core_auth_table.subscription_plans WHERE plan_id = $1
        """, str(payment["plan_id"]))

        if not plan_row:
            raise HTTPException(status_code=404, detail="Plan not found")

        # Webhook may have already activated the subscription — return success without re-processing
        if payment["payment_status"] == "paid":
            subscription = await conn.fetchrow("""
                SELECT end_date FROM core_auth_table.company_subscriptions
                WHERE company_id = $1 AND status = 'active'
                ORDER BY created_at DESC LIMIT 1
            """, company_id)
            return {
                "success":        True,
                "message":        "Subscription activated",
                "plan_name":      plan_row["plan_name"],
                "billing_cycle":  billing_cycle,
                "valid_for_days": duration_days,
                "end_date":       str(subscription["end_date"]) if subscription else None,
            }

        result = await upgrade_company_plan(
            conn=conn,
            company_id=company_id,
            plan_name=plan_row["plan_name"],
            billing_cycle=billing_cycle,
            duration_days=duration_days,
            source="razorpay",
        )

        await conn.execute("""
            UPDATE core_auth_table.company_subscription_payments
            SET payment_status = 'paid', razorpay_payment_id = $2
            WHERE provider_order_id = $1
        """, body.razorpay_order_id, body.razorpay_payment_id)

        return {
            "success":        True,
            "message":        "Subscription activated",
            "plan_name":      plan_row["plan_name"],
            "billing_cycle":  billing_cycle,
            "valid_for_days": duration_days,
            "end_date":       result["end_date"],
        }

    except HTTPException:
        raise
    except Exception as e:
        print("VERIFY SUBSCRIPTION PAYMENT ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": str(e)})


# =========================================================
# BILLING — RAZORPAY WEBHOOK (async safety net)
# Configure in Razorpay Dashboard → Webhooks → your server URL
# Set RAZORPAY_WEBHOOK_SECRET in your .env
# =========================================================
@router.post("/billing/webhook")
async def razorpay_webhook(
    request: Request,
    conn=Depends(get_db),
):
    import hmac, hashlib, os
    from utils.subscription_service import upgrade_company_plan

    webhook_secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET", "")
    body_bytes     = await request.body()

    # Verify webhook signature
    if webhook_secret:
        expected = hmac.new(
            webhook_secret.encode(),
            body_bytes,
            hashlib.sha256,
        ).hexdigest()
        received = request.headers.get("x-razorpay-signature", "")
        if not hmac.compare_digest(expected, received):
            raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    event   = payload.get("event")

    # ── payment.captured → activate subscription ────────────────────────────
    if event == "payment.captured":
        payment_entity = payload["payload"]["payment"]["entity"]
        order_id       = payment_entity.get("order_id")
        payment_id     = payment_entity.get("id")

        if not order_id:
            return {"status": "ignored"}

        # Check if subscription payment
        row = await conn.fetchrow("""
            SELECT company_id, plan_id, billing_cycle, payment_status
            FROM core_auth_table.company_subscription_payments
            WHERE provider_order_id = $1
        """, order_id)

        if row and row["payment_status"] == "pending":
            company_id    = str(row["company_id"])
            billing_cycle = row["billing_cycle"]
            duration_days = 30 if billing_cycle == "monthly" else 365

            plan_row = await conn.fetchrow("""
                SELECT plan_name FROM core_auth_table.subscription_plans WHERE plan_id = $1
            """, str(row["plan_id"]))

            if plan_row:
                await upgrade_company_plan(
                    conn=conn,
                    company_id=company_id,
                    plan_name=plan_row["plan_name"],
                    billing_cycle=billing_cycle,
                    duration_days=duration_days,
                    source="razorpay_webhook",
                )
                await conn.execute("""
                    UPDATE core_auth_table.company_subscription_payments
                    SET payment_status = 'paid', razorpay_payment_id = $2
                    WHERE provider_order_id = $1
                """, order_id, payment_id)

        # Check if addon payment
        addon_row = await conn.fetchrow("""
            SELECT id, payment_status
            FROM core_auth_table.company_addon_purchases
            WHERE provider_order_id = $1
        """, order_id)

        if addon_row and addon_row["payment_status"] == "pending":
            await conn.execute("""
                UPDATE core_auth_table.company_addon_purchases
                SET payment_status = 'paid', razorpay_payment_id = $2
                WHERE provider_order_id = $1
            """, order_id, payment_id)

    return {"status": "ok"}


# ─────────────────────────────────────────────
#  USER MANAGEMENT (admin + pro only)
# ─────────────────────────────────────────────

@router.post("/create-user")
async def create_user_api(
    data: CreateUserRequest,
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    caller_user_id = current_user.get("user_id")
    company_id     = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Company not found for current user")
    return await create_user(conn, data, caller_user_id, company_id)

@router.get("/users")
async def get_company_users_api(
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    caller_user_id = current_user.get("user_id")
    company_id     = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Company not found for current user")
    return await get_company_users(conn, caller_user_id, company_id)

@router.delete("/delete-user/{target_user_id}")
async def delete_user_api(
    target_user_id: str,
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    caller_user_id = current_user.get("user_id")
    company_id     = current_user.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Company not found for current user")
    return await delete_user(conn, target_user_id, caller_user_id, company_id)


@router.get("/my-products")
async def get_all_products_api(
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await get_all_products(conn, user_id)

@router.get("/buyer-list")
async def get_buyer_list_api(
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await get_buyer_list(conn, user_id)

@router.get("/reports")
async def get_reports_api(
    conn=Depends(get_db),
    current_user=Depends(get_current_user),
):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return await get_reports(conn, user_id)


