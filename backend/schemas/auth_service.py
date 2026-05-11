import uuid
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Request,Response, Depends, Header
from utils.security import hash_password, verify_password
from utils.jwt_utils import create_access_token,get_user_permissions
from utils.email_service import send_verification_email
from user_agents import parse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import re 
from utils.service import generate_unique_slug
from db.database import get_db 
from utils.service import get_current_user
import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
#----------------------
# HELPER
#----------------------

async def verify_internal_api(x_api_key: str = Header(...)):
    print("HEADER KEY:", x_api_key)
    print("ENV KEY:", os.getenv("INTERNAL_API_KEY"))

    if x_api_key != os.getenv("INTERNAL_API_KEY"):
        raise HTTPException(status_code=403, detail="Unauthorized internal API")

def extract_name_from_email(email: str) -> str:
    name_part = email.split("@")[0]
    name_part = re.sub(r'\d+', '', name_part)  # remove numbers
    name_part = name_part.replace(".", " ").replace("_", " ")
    return name_part.title().strip()

def get_device_name(user_agent_string):

    try:
        ua = parse(user_agent_string)

        os = ua.os.family
        browser = ua.browser.family

        if ua.is_mobile:
            device_type = "Mobile"
        elif ua.is_tablet:
            device_type = "Tablet"
        elif ua.is_pc:
            device_type = "Desktop"
        else:
            device_type = "Device"

        return f"{os} • {browser}"

    except Exception:
        return "Unknown Device"
    
async def send_data_export_email(user_email: str, full_name: str, data: dict):
    """Send user their data export via email."""
    try:
        AWS_REGION            = os.getenv("AWS_REGION")
        AWS_ACCESS_KEY_ID     = os.getenv("AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
        SMTP_USER             = os.getenv("SMTP_USER")

        import json
        data_json = json.dumps(data, indent=2, default=str)

        ses = boto3.client(
            "ses",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

        html_body = f"""
        <html>
        <body style="font-family:Arial,sans-serif;background:#f5f7fa;padding:20px;">
        <div style="max-width:500px;margin:auto;background:#fff;padding:30px;border-radius:10px">
            <h2 style="color:#0F172A;">📦 Your Data Export</h2>
            <p>Hi {full_name},</p>
            <p>As requested, here is a summary of your data from Intrade24.</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px;color:#64748B;">Products</td>
                    <td style="padding:8px;font-weight:bold;">{len(data.get('products', []))}</td></tr>
                <tr style="background:#f8fafc;">
                    <td style="padding:8px;color:#64748B;">Markets Analysed</td>
                    <td style="padding:8px;font-weight:bold;">{len(data.get('market_intelligence', []))}</td></tr>
                <tr><td style="padding:8px;color:#64748B;">Exported At</td>
                    <td style="padding:8px;font-weight:bold;">{data.get('exported_at')}</td></tr>
            </table>
            <p>Your complete data is included below in JSON format.</p>
            <pre style="background:#f1f5f9;padding:15px;border-radius:6px;
                        font-size:11px;overflow:auto;max-height:400px;">
{data_json[:3000]}{"..." if len(data_json) > 3000 else ""}
            </pre>
            <p style="font-size:12px;color:#64748B;margin-top:30px;">
                If you have questions contact us at support@intrade24.com
            </p>
        </div>
        </body>
        </html>
        """

        ses.send_email(
            Source=SMTP_USER,
            Destination={"ToAddresses": [user_email]},
            Message={
                "Subject": {"Data": "Your Intrade24 Data Export"},
                "Body": {
                    "Html": {"Data": html_body},
                    "Text": {"Data": f"Your data export:\n\n{data_json}"},
                },
            },
        )

        print(f"✅ Data export sent to {user_email}")

    except Exception as e:
        print(f"❌ Failed to send data export: {e}")

async def send_data_export_request_email(user_email: str, full_name: str, user_id: str):
    """Notify admin that a user requested data export."""
    try:
        AWS_REGION           = os.getenv("AWS_REGION")
        AWS_ACCESS_KEY_ID    = os.getenv("AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
        SMTP_USER            = os.getenv("SMTP_USER")
        ADMIN_EMAIL          = os.getenv("ADMIN_EMAIL", "neel.integers@gmail.com")

        if not all([AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SMTP_USER]):
            print("EMAIL ERROR: Missing environment variables")
            return

        ses = boto3.client(
            "ses",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
        <div style="max-width:500px;margin:auto;background:#ffffff;padding:30px;border-radius:10px">
            <h2 style="color:#0F172A;">📦 Data Export Request</h2>
            <p>A user has requested their data export.</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px;color:#64748B;">Name</td><td style="padding:8px;font-weight:bold;">{full_name}</td></tr>
                <tr style="background:#f8fafc;"><td style="padding:8px;color:#64748B;">Email</td><td style="padding:8px;font-weight:bold;">{user_email}</td></tr>
                <tr><td style="padding:8px;color:#64748B;">User ID</td><td style="padding:8px;font-weight:bold;">{user_id}</td></tr>
                <tr style="background:#f8fafc;"><td style="padding:8px;color:#64748B;">Requested</td><td style="padding:8px;font-weight:bold;">{datetime.utcnow().strftime('%d %b %Y %H:%M UTC')}</td></tr>
            </table>
            <p style="color:#DC2626;font-weight:bold;">⏰ Please send their data within 1-2 business days.</p>
            <p style="font-size:12px;color:#64748B;margin-top:30px;">
                Reply to this email or contact {user_email} directly.
            </p>
        </div>
        </body>
        </html>
        """

        text_body = f"""
        Data Export Request

        Name     : {full_name}
        Email    : {user_email}
        User ID  : {user_id}
        Requested: {datetime.utcnow().strftime('%d %b %Y %H:%M UTC')}

        Please send their data within 1-2 business days.
        """

        response = ses.send_email(
            Source=SMTP_USER,
            Destination={"ToAddresses": [ADMIN_EMAIL]},
            Message={
                "Subject": {"Data": f"Data Export Request — {user_email}"},
                "Body": {
                    "Html": {"Data": html_body},
                    "Text": {"Data": text_body},
                },
            },
        )

        print(f"✅ Export request email sent to admin | MessageId: {response.get('MessageId')}")

    except ClientError as e:
        print(f"❌ SES ClientError: {e.response['Error']['Message']}")
    except Exception as e:
        print(f"⚠️ Failed to send export request email: {e}")

# =========================================================
# SIGNUP
# =========================================================

# async def signup_user(conn, data, request, background_tasks):

#     # 1️⃣ Validate
#     if not data.email or not data.password or not data.company_name:
#         raise HTTPException(
#             status_code=400,
#             detail="Email, password and company name required"
#         )

#     # 2️⃣ Check email
#     user = await conn.fetchrow("""
#         SELECT user_id
#         FROM core_auth_table.auth_user
#         WHERE LOWER(email) = LOWER($1)
#     """, data.email)

#     if user:
#         raise HTTPException(status_code=400, detail="Email already exists")

#     # 3️⃣ Check company
#     company = await conn.fetchrow("""
#         SELECT id
#         FROM core_tables.companies_other
#         WHERE LOWER(name) = LOWER($1)
#     """, data.company_name)

#     if company:
#         company_id = str(company["id"])
#     else:
#         company_id = str(uuid.uuid4())

#         slug = await generate_unique_slug(conn, data.company_name)

#         await conn.execute("""
#             INSERT INTO core_tables.companies_other
#             (
#                 id,name,legal_name,slug,company_type,source,
#                 created_at,updated_at
#             )
#             VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
#         """,
#             company_id,
#             data.company_name,
#             data.company_name,
#             slug,
#             "customer",
#             "customer"
#         )

#     # 4️⃣ Create user
#     user_id = str(uuid.uuid4())
#     hashed_password = hash_password(data.password)

#     await conn.execute("""
#         INSERT INTO core_auth_table.auth_user
#         (
#             user_id,email,password_hash,
#             full_name,phone,status,
#             companies_other_id,role,created_at
#         )
#         VALUES ($1,$2,$3,$4,$5,$6,$7,'admin',NOW())
#     """,
#         user_id,
#         data.email,
#         hashed_password,
#         data.full_name,
#         data.phone,
#         "pending_verification",
#         company_id
#     )

#     # 5️⃣ Assign trial plan on signup (expires in 7 days)
#     from utils.subscription_service import assign_trial_plan_if_needed
#     await assign_trial_plan_if_needed(conn, company_id, trial_days=7)

#     # 6️⃣ Email verification
#     token = str(uuid.uuid4())

#     await conn.execute("""
#         INSERT INTO core_auth_table.email_verification_tokens
#         (id,user_id,token,expires_at)
#         VALUES ($1,$2,$3,$4)
#     """,
#         str(uuid.uuid4()),
#         user_id,
#         token,
#         datetime.utcnow() + timedelta(hours=10)
#     )

#     # =========================================================
#     # 🚀 BACKGROUND EMAIL (NON-BLOCKING)
#     # =========================================================
#     background_tasks.add_task(
#         send_verification_email,
#         data.email,
#         token
#     )

#     return {
#         "success": True,
#         "message": "Signup successful. Verify your email."
#     }


async def signup_user(conn, data, request, background_tasks):

    # 1️⃣ Validate
    if not data.email or not data.password or not data.company_name:
        raise HTTPException(
            status_code=400,
            detail="Email, password and company name required"
        )

    # ✅ GDPR consent required
    if not data.gdpr_consent:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "GDPR_CONSENT_REQUIRED",
                "message": "You must accept the Privacy Policy to create an account."
            }
        )

    # 2️⃣ Check email
    user = await conn.fetchrow("""
        SELECT user_id
        FROM core_auth_table.auth_user
        WHERE LOWER(email) = LOWER($1)
    """, data.email)

    if user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # 3️⃣ Check company
    company = await conn.fetchrow("""
        SELECT id
        FROM core_tables.companies_other
        WHERE LOWER(name) = LOWER($1)
    """, data.company_name)

    if company:
        company_id = str(company["id"])
    else:
        company_id = str(uuid.uuid4())
        slug = await generate_unique_slug(conn, data.company_name)

        await conn.execute("""
            INSERT INTO core_tables.companies_other
            (id, name, legal_name, slug, company_type, source, created_at, updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
        """,
            company_id,
            data.company_name,
            data.company_name,
            slug,
            "customer",
            "customer"
        )

    # 4️⃣ Create user ✅ with GDPR consent
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(data.password)

    await conn.execute("""
        INSERT INTO core_auth_table.auth_user
        (
            user_id, email, password_hash,
            full_name, phone, status,
            companies_other_id, role,
            gdpr_consent, gdpr_consent_at,
            marketing_consent,
            created_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'admin',$8,NOW(),$9,NOW())
    """,
        user_id,
        data.email,
        hashed_password,
        data.full_name,
        data.phone,
        "pending_verification",
        company_id,
        data.gdpr_consent,          # ✅
        data.marketing_consent,     # ✅
    )

    # 5️⃣ Assign trial plan
    from utils.subscription_service import assign_trial_plan_if_needed
    await assign_trial_plan_if_needed(conn, company_id, trial_days=7)

    # 6️⃣ Email verification
    token = str(uuid.uuid4())

    await conn.execute("""
        INSERT INTO core_auth_table.email_verification_tokens
        (id, user_id, token, expires_at)
        VALUES ($1, $2, $3, NOW() + INTERVAL '48 hours')
    """,
        str(uuid.uuid4()),
        user_id,
        token,
    )

    background_tasks.add_task(
        send_verification_email,
        data.email,
        token
    )

    return {
        "success": True,
        "message": "Signup successful. Verify your email."
    }

# =========================================================
# LOGIN
# =========================================================

async def login_user(conn, data):
 
    user = await conn.fetchrow("""
        SELECT a.user_id as user_id, a.full_name as full_name,
                c.name as company_name, a.password_hash,
               a.companies_other_id as companies_other_id,
                 a.status, a.is_submitted, a.role
        FROM core_auth_table.auth_user a
		join core_tables.companies_other c
		on a.companies_other_id= c.id
        WHERE LOWER(email) = LOWER($1)
    """, data.email)
 
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
 
 
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
 
 
    if user["status"] != "active":
        raise HTTPException(status_code=403, detail="Please verify your email")
 
 
    user_id = str(user["user_id"])
    company_id = str(user["companies_other_id"]) if user["companies_other_id"] else None

    from utils.subscription_service import check_and_handle_subscription_expiry, assign_trial_plan_if_needed
    await check_and_handle_subscription_expiry(conn, company_id)
    await assign_trial_plan_if_needed(conn, company_id)

    permissions = await get_user_permissions(conn, user_id)
 
    access_token = create_access_token(
        user_id=user_id,
        company_id=company_id,
        permissions=permissions,
        #expires_delta=timedelta(days=365)
    )
 
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "user_id": user_id,
            "name": user["full_name"],
            "company_id": company_id,
            "company_name": user["company_name"],
            "isSubmitted": user["is_submitted"],
            "role": user["role"] or "member",
        },
        "access_token": access_token
    }

# async def login_user(conn, data, request, response):

#     user = await conn.fetchrow("""
#         SELECT user_id, full_name, password_hash,
#         companies_other_id, status,is_submitted
#         FROM core_auth_table.auth_user
#         WHERE LOWER(email)=LOWER($1)
#     """, data.email)

#     if not user:
#         raise HTTPException(401, "Invalid credentials")

#     if not verify_password(data.password, user["password_hash"]):
#         raise HTTPException(401, "Invalid credentials")

#     if user["status"] != "active":
#         raise HTTPException(403, "Email verification required")

#     user_id = str(user["user_id"])
#     company_id = str(user["companies_other_id"])
#     is_submitted=str(user["is_submitted"])

#     user_agent = request.headers.get("user-agent")
#     device = get_device_name(user_agent)
#     ip = request.client.host

#     permissions = await get_user_permissions(conn, user_id)

#     access_token = create_access_token(
#         user_id,
#         company_id,
#         permissions
#     )

#     refresh_token = create_refresh_token(
#         user_id,
#         company_id
#     )

#     session_id = str(uuid.uuid4())

#     await conn.execute("""
#         INSERT INTO core_auth_table.auth_sessions
#         (
#             session_id,user_id,device,ip_address,
#             user_agent,refresh_token,is_revoked,
#             created_at,expires_at,last_seen_at
#         )
#         VALUES ($1,$2,$3,$4,$5,$6,FALSE,NOW(),NOW()+INTERVAL '7 days',NOW())
#     """,
#         session_id,
#         user_id,
#         device,
#         ip,
#         user_agent,
#         refresh_token
#     )

#     response.delete_cookie("access_token", path="/")
#     response.delete_cookie("refresh_token", path="/")

#     response.set_cookie(
#             key="access_token",
#             value=access_token,
#             httponly=True,
#             secure=False,
#             samesite="none",
#             max_age=60 * 10
#         )

#     response.set_cookie(
#             key="refresh_token",
#             value=refresh_token,
#             httponly=True,
#             secure=False,
#             samesite="none",
#             max_age=60 * 60 * 24 * 7
#         )

#     return {
#         "success": True,
#         "message": "Login successful",
#         "user_id": user_id,
#         "is_submitted":is_submitted,
#         "name": user["full_name"]
#     }

async def change_user_password(
    data,
    conn = Depends(get_db),
    current_user = Depends(get_current_user)
):

    user_id = current_user["user_id"]

    try:
        # =====================================
        # Fetch user password
        # =====================================
        user = await conn.fetchrow(
            """
            SELECT password_hash
            FROM core_auth_table.auth_user
            WHERE user_id = $1
            """,
            user_id
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error_code": "USER_NOT_FOUND",
                    "message": "User not found"
                }
            )

        # =====================================
        # Verify current password
        # =====================================
        if not verify_password(data.current_password, user["password_hash"]):
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error_code": "INVALID_CURRENT_PASSWORD",
                    "message": "Current password is incorrect"
                }
            )

        # =====================================
        # Validate new password
        # =====================================
        if data.new_password != data.confirm_password:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error_code": "PASSWORD_MISMATCH",
                    "message": "New password and confirm password do not match"
                }
            )

        if len(data.new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error_code": "WEAK_PASSWORD",
                    "message": "Password must be at least 8 characters"
                }
            )

        if data.current_password == data.new_password:
            raise HTTPException(
                status_code=400,
                detail={
                    "success": False,
                    "error_code": "PASSWORD_SAME",
                    "message": "New password must be different from current password"
                }
            )

        # =====================================
        # Update password
        # =====================================
        new_hash = hash_password(data.new_password)

        await conn.execute(
            """
            UPDATE core_auth_table.auth_user
            SET password_hash = $1,
                tokens_revoked_at = NOW(),
                updated_at = NOW()
            WHERE user_id = $2
            """,
            new_hash,
            user_id
        )

        # Revoke all active sessions
        await conn.execute(
            """
            UPDATE core_auth_table.auth_sessions
            SET is_revoked = TRUE
            WHERE user_id = $1
            """,
            user_id
        )

        return {
            "success": True,
            'force_logout':True,
            "message": "Password updated successfully. Please login again."
        }

    except HTTPException:
        raise

    except Exception as e:
        print("PASSWORD UPDATE ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error_code": "PASSWORD_UPDATE_FAILED",
                "message": "Unable to update password"
            }
        )

# async def google_signup_login(
#     token: str,
#     company_name: str,
#     request: Request,
#     response: Response,
#     conn = Depends(get_db)
# ):

#     # ==========================================
#     # 🔐 Verify Google Token
#     # ==========================================
#     try:
#         idinfo = id_token.verify_oauth2_token(
#             token,
#             google_requests.Request(),
#             GOOGLE_CLIENT_ID
#         )

#         if not idinfo.get("email_verified"):
#             raise HTTPException(400, "Google email not verified")

#         email = idinfo["email"]
#         full_name = idinfo.get("name") or extract_name_from_email(email)
#         picture = idinfo.get("picture") or \
#             f"https://ui-avatars.com/api/?name={full_name.replace(' ', '+')}&background=random"

#     except Exception:
#         raise HTTPException(401, "Invalid Google token")

#     try:
#         # ==========================================
#         # 🔍 Check existing user
#         # ==========================================
#         user = await conn.fetchrow(
#             """
#             SELECT user_id, companies_other_id, auth_provider
#             FROM core_auth_table.auth_user
#             WHERE LOWER(email) = LOWER($1)
#             """,
#             email
#         )

#         is_new_user = False
#         is_new_company = False

#         if user:
#             if user["auth_provider"] == "local":
#                 raise HTTPException(
#                     400, "This account uses email/password login"
#                 )

#             user_id = str(user["user_id"])
#             company_id = str(user["companies_other_id"])

#             # update profile
#             await conn.execute(
#                 """
#                 UPDATE core_auth_table.auth_user
#                 SET profile_picture = $1,
#                     full_name = $2
#                 WHERE user_id = $3
#                 """,
#                 picture,
#                 full_name,
#                 user_id
#             )

#         else:
#             is_new_user = True

#             # ==========================================
#             # 🔍 Check / Create Company
#             # ==========================================
#             company = await conn.fetchrow(
#                 """
#                 SELECT id FROM core_tables.companies_other
#                 WHERE LOWER(name) = LOWER($1)
#                 """,
#                 company_name
#             )

#             if company:
#                 company_id = str(company["id"])
#             else:
#                 is_new_company = True
#                 company_id = str(uuid.uuid4())

#                 slug = await generate_unique_slug(conn, company_name)

#                 await conn.execute(
#                     """
#                     INSERT INTO core_tables.companies_other
#                     (id, name, legal_name, slug, company_type,
#                      source, created_at, updated_at)
#                     VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
#                     """,
#                     company_id,
#                     company_name,
#                     company_name,
#                     slug,
#                     "customer",
#                     "customer"
#                 )

#             # ==========================================
#             # 🆕 Create User
#             # ==========================================
#             user_id = str(uuid.uuid4())

#             await conn.execute(
#                 """
#                 INSERT INTO core_auth_table.auth_user
#                 (user_id, email, full_name, status,
#                  companies_other_id, auth_provider,
#                  profile_picture, created_at)
#                 VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
#                 """,
#                 user_id,
#                 email,
#                 full_name,
#                 "active",
#                 company_id,
#                 "google",
#                 picture
#             )

#         # ==========================================
#         # 🎯 Assign Plan (New Company)
#         # ==========================================
#         if is_new_company:
#             plan = await conn.fetchrow(
#                 """
#                 SELECT plan_id
#                 FROM core_auth_table.subscription_plans
#                 WHERE plan_name = 'basic'
#                 AND status = 'active'
#                 """
#             )

#             if plan:
#                 await conn.execute(
#                     """
#                     INSERT INTO core_auth_table.company_subscriptions
#                     (subscription_id, company_id, plan_id,
#                      status, start_date, end_date, created_at)
#                     VALUES ($1,$2,$3,'active',$4,$5,NOW())
#                     """,
#                     str(uuid.uuid4()),
#                     company_id,
#                     plan["plan_id"],
#                     datetime.utcnow(),
#                     datetime.utcnow() + timedelta(days=14)
#                 )

#         # ==========================================
#         # 🎯 Assign Permissions (New User)
#         # ==========================================
#         if is_new_user:
#             modules = await conn.fetch(
#                 """
#                 SELECT sm.module_code
#                 FROM core_auth_table.company_subscriptions cs
#                 JOIN core_auth_table.subscription_plan_modules spm
#                     ON cs.plan_id = spm.plan_id
#                 JOIN core_auth_table.subscription_modules sm
#                     ON sm.module_id = spm.module_id
#                 WHERE cs.company_id = $1
#                 AND cs.status = 'active'
#                 AND spm.is_enabled = TRUE
#                 """,
#                 company_id
#             )

#             for row in modules:
#                 group_name = f"{row['module_code']}.operator"

#                 await conn.execute(
#                     """
#                     INSERT INTO core_auth_table.user_permissions_groups
#                     (id, user_id, group_id, assigned_at)
#                     SELECT gen_random_uuid(), $1, pg.group_id, NOW()
#                     FROM core_auth_table.permissions_groups pg
#                     WHERE pg.group_name = $2
#                     AND NOT EXISTS (
#                         SELECT 1 FROM core_auth_table.user_permissions_groups
#                         WHERE user_id = $1 AND group_id = pg.group_id
#                     )
#                     """,
#                     user_id,
#                     group_name
#                 )

#         # ==========================================
#         # 🔐 Generate Tokens
#         # ==========================================
#         permissions = await get_user_permissions(conn, user_id)

#         access_token = create_access_token(user_id, company_id, permissions)
#         refresh_token = create_refresh_token(user_id, company_id)

#         # ==========================================
#         # 🖥️ Create Session
#         # ==========================================
#         await conn.execute(
#             """
#             INSERT INTO core_auth_table.auth_sessions
#             (session_id, user_id, device, ip_address,
#              user_agent, refresh_token,
#              is_revoked, created_at, expires_at, last_seen_at)
#             VALUES ($1,$2,$3,$4,$5,$6,FALSE,NOW(),$7,NOW())
#             """,
#             str(uuid.uuid4()),
#             user_id,
#             "web",
#             request.client.host,
#             request.headers.get("user-agent"),
#             refresh_token,
#             datetime.now(timezone.utc) + timedelta(days=7)
#         )

#         # ==========================================
#         # 🍪 Cookies
#         # ==========================================
#         response.set_cookie(
#             key="access_token",
#             value=access_token,
#             httponly=True,
#             secure=False,  # True in production
#             samesite="Lax",
#             max_age=60 * 30
#         )

#         response.set_cookie(
#             key="refresh_token",
#             value=refresh_token,
#             httponly=True,
#             secure=False,
#             samesite="Lax",
#             max_age=60 * 60 * 24 * 7
#         )

#         return {
#             "message": "Google login successful",
#             "user_id": user_id
#         }

#     except Exception as e:
#         print("GOOGLE AUTH ERROR:", str(e))
#         raise HTTPException(500, "Google login failed")

async def google_signup_login(
    token: str,
    request: Request,
    response: Response,
    conn = Depends(get_db)
):

    # ==========================================
    # 🔐 Verify Google Token
    # ==========================================
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID
        )

        if not idinfo.get("email_verified"):
            raise HTTPException(400, "Google email not verified")

        email = idinfo["email"]
        full_name = idinfo.get("name") or extract_name_from_email(email)

        picture = idinfo.get("picture") or \
            f"https://ui-avatars.com/api/?name={full_name.replace(' ', '+')}&background=random"

    except Exception:
        raise HTTPException(401, "Invalid Google token")

    try:
        # ==========================================
        # 🔍 Check existing user
        # ==========================================
        user = await conn.fetchrow(
            """
            SELECT user_id, auth_provider
            FROM core_auth_table.auth_user
            WHERE LOWER(email) = LOWER($1)
            """,
            email
        )

        is_new_user = False

        if user:
            if user["auth_provider"] == "local":
                raise HTTPException(
                    400, "This account uses email/password login"
                )

            user_id = str(user["user_id"])

            # update profile
            await conn.execute(
                """
                UPDATE core_auth_table.auth_user
                SET profile_picture = $1,
                    full_name = $2
                WHERE user_id = $3
                """,
                picture,
                full_name,
                user_id
            )

        else:
            is_new_user = True
            user_id = str(uuid.uuid4())

            # ==========================================
            # 🆕 Create User (NO COMPANY)
            # ==========================================
            await conn.execute(
                """
                INSERT INTO core_auth_table.auth_user
                (user_id, email, full_name, status,
                 auth_provider, profile_picture, created_at)
                VALUES ($1,$2,$3,$4,$5,$6,NOW())
                """,
                user_id,
                email,
                full_name,
                "active",
                "google",
                picture
            )

        # ==========================================
        # 🔐 Generate Tokens (NO company_id)
        # ==========================================
        permissions = []  # or minimal default

        access_token = create_access_token(user_id, None, permissions)
        #refresh_token = create_refresh_token(user_id, None)

        # ==========================================
        # 🖥️ Create Session
        # ==========================================
        await conn.execute(
            """
            INSERT INTO core_auth_table.auth_sessions
            (session_id, user_id, device, ip_address,
             user_agent, refresh_token,
             is_revoked, created_at, expires_at, last_seen_at)
            VALUES ($1,$2,$3,$4,$5,$6,FALSE,NOW(),$7,NOW())
            """,
            str(uuid.uuid4()),
            user_id,
            "web",
            request.client.host,
            request.headers.get("user-agent"),
            #refresh_token,
            datetime.now(timezone.utc) + timedelta(days=7)
        )

        # ==========================================
        # 🍪 Cookies
        # ==========================================
        # response.set_cookie(
        #     key="access_token",
        #     value=access_token,
        #     httponly=True,
        #     secure=False,
        #     samesite="Lax",
        #     max_age=60 * 30
        # )

        # response.set_cookie(
        #     key="refresh_token",
        #     value=refresh_token,
        #     httponly=True,
        #     secure=False,
        #     samesite="Lax",
        #     max_age=60 * 60 * 24 * 7
        # )

        return {
            "success": True,
            "message": "Google login successful",
            "user_id": user_id,
            "is_new_user": is_new_user,
            "access_token": access_token
        }

    except Exception as e:
        print("GOOGLE AUTH ERROR:", str(e))
        raise HTTPException(500, "Google login failed")

# async def get_user_profile(
#     conn = Depends(get_db),
#     current_user = Depends(get_current_user)
# ):

#     user_id = current_user["user_id"]

#     try:
#         profile = await conn.fetchrow(
#             """
#             SELECT
#                 u.user_id,
#                 u.full_name,
#                 u.email,
#                 u.phone,
#                 u.status,
#                 c.name as company_name,
#                 cp.onboarding_completed
#             FROM core_auth_table.auth_user u
#             LEFT JOIN core_tables.companies_other c
#                 ON u.companies_other_id = c.id
#             LEFT JOIN product_info.company_preferences cp
#                 ON cp.company_id = c.id
#             WHERE u.user_id = $1
#             """,
#             user_id
#         )

#         if not profile:
#             raise HTTPException(
#                 status_code=404,
#                 detail={
#                     "success": False,
#                     "error_code": "PROFILE_NOT_FOUND",
#                     "message": "Profile not found"
#                 }
#             )

#         # convert asyncpg Record → dict
#         return {
#             "success": True,
#             "data": dict(profile)
#         }

#     except HTTPException:
#         raise

#     except Exception as e:
#         print("PROFILE ERROR:", str(e))

#         raise HTTPException(
#             status_code=500,
#             detail={
#                 "success": False,
#                 "error_code": "PROFILE_FETCH_FAILED",
#                 "message": "Unable to fetch profile"
#             }
#         )

async def update_company_profile(data, conn, current_user):

    user_id = current_user["user_id"]

    try:
        # =====================================
        # Fetch existing company
        # =====================================
        user = await conn.fetchrow("""
            SELECT
                c.id           AS company_id,
                c.name         AS company_name,
                c.company_type AS business_type,
                c.industry
            FROM core_auth_table.auth_user u
            LEFT JOIN core_tables.companies_other c
                ON u.companies_other_id = c.id
            WHERE u.user_id = $1
        """, user_id)

        if not user or not user["company_id"]:
            raise HTTPException(status_code=404, detail={
                "success": False,
                "error_code": "COMPANY_NOT_FOUND",
                "message": "Company not found for this user"
            })

        # =====================================
        # Detect changes
        # =====================================
        no_change = (
            (not data.company_name  or data.company_name  == user["company_name"])  and
            (not data.business_type or data.business_type == user["business_type"]) and
            (not data.industry      or data.industry      == user["industry"])
        )

        if no_change:
            return {
                "success": True,
                "message": "No changes detected",
                "data": {
                    "company_name":  user["company_name"],
                    "business_type": user["business_type"],
                    "industry":      user["industry"],
                }
            }

        # =====================================
        # Update companies_other
        # =====================================
        await conn.execute("""
            UPDATE core_tables.companies_other
            SET
                name         = COALESCE($1, name),
                company_type = COALESCE($2, company_type),
                industry     = COALESCE($3, industry),
                updated_at   = NOW()
            WHERE id = $4
        """,
            data.company_name,
            data.business_type,
            data.industry,
            user["company_id"],
        )

        # =====================================
        # Fetch updated company
        # =====================================
        updated = await conn.fetchrow("""
            SELECT
                c.name         AS company_name,
                c.company_type AS business_type,
                c.industry
            FROM core_tables.companies_other c
            WHERE c.id = $1
        """, user["company_id"])

        return {
            "success": True,
            "message": "Company profile updated successfully",
            "data": dict(updated)
        }

    except HTTPException:
        raise

    except Exception as e:
        print("COMPANY UPDATE ERROR:", str(e))
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error_code": "COMPANY_UPDATE_FAILED",
            "message": "Unable to update company profile"
        })

async def get_user_profile(conn, user_id):
    try:
        profile = await conn.fetchrow(
            """
            SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                u.status,
                c.name as company_name,
                c.headquarters_country as country,
                c.company_type as business_type,
                c.industry
            FROM core_auth_table.auth_user u
            LEFT JOIN core_tables.companies_other c
                ON u.companies_other_id = c.id
            WHERE u.user_id = $1
            """,
            user_id
        )
        if not profile:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error_code": "PROFILE_NOT_FOUND",
                    "message": "Profile not found"
                }
            )
        return {
            "success": True,
            "data": dict(profile)
        }
    except HTTPException:
        raise
    except Exception as e:
        print("PROFILE ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error_code": "PROFILE_FETCH_FAILED",
                "message": "Unable to fetch profile"
            }
        )
    
async def update_user_profile(data, conn, current_user):

    user_id = current_user["user_id"]

    try:
        # =====================================
        # Fetch existing user
        # =====================================
        user = await conn.fetchrow(
            """
            SELECT email, full_name, phone
            FROM core_auth_table.auth_user
            WHERE user_id = $1
            """,
            user_id
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail={
                    "success": False,
                    "error_code": "USER_NOT_FOUND",
                    "message": "User not found"
                }
            )

        old_email = user["email"]

        # =====================================
        # Normalize & detect changes
        # =====================================
        new_email = data.email.strip().lower() if data.email else None
        old_email_clean = old_email.strip().lower()

        email_changed = new_email and new_email != old_email_clean

        # =====================================
        # Prevent duplicate email
        # =====================================
        if email_changed:
            existing = await conn.fetchrow(
                """
                SELECT 1
                FROM core_auth_table.auth_user
                WHERE LOWER(email) = LOWER($1)
                AND user_id != $2
                """,
                new_email,
                user_id
            )

            if existing:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "success": False,
                        "error_code": "EMAIL_ALREADY_EXISTS",
                        "message": "Email already in use"
                    }
                )

        # =====================================
        # Check if anything changed at all
        # =====================================
        no_change = (
            (not data.full_name or data.full_name == user["full_name"]) and
            (not data.phone or data.phone == user["phone"]) and
            (not email_changed)
        )

        if no_change:
            return {
                "success": True,
                "message": "No changes detected",
                "email_verification_required": False,
                "force_logout": False,
                "data": dict(user)
            }

        # =====================================
        # Update profile
        # =====================================
        await conn.execute(
            """
            UPDATE core_auth_table.auth_user
            SET
                full_name = COALESCE($1, full_name),
                phone = COALESCE($2, phone),
                email = COALESCE($3, email),
                status = CASE
                            WHEN $4 = TRUE THEN 'pending_verification'
                            ELSE status
                         END,
                updated_at = NOW()
            WHERE user_id = $5
            """,
            data.full_name,
            data.phone,
            new_email,
            email_changed,
            user_id
        )

        # =====================================
        # EMAIL CHANGE FLOW
        # =====================================
        if email_changed:

            verification_token = str(uuid.uuid4())

            await conn.execute(
                """
                INSERT INTO core_auth_table.email_verification_tokens
                (id, user_id, token, expires_at)
                VALUES ($1, $2, $3, NOW() + INTERVAL '48 hours')
                """,
                str(uuid.uuid4()),
                user_id,
                verification_token,
            )

            # send email
            await send_verification_email(
                email=new_email,
                token=verification_token
            )

            # revoke sessions
            await conn.execute(
                """
                UPDATE core_auth_table.auth_sessions
                SET is_revoked = TRUE
                WHERE user_id = $1
                """,
                user_id
            )

        # =====================================
        # Fetch updated profile
        # =====================================
        updated_user = await conn.fetchrow(
            """
            SELECT full_name, email, phone, status
            FROM core_auth_table.auth_user
            WHERE user_id = $1
            """,
            user_id
        )

        if email_changed:
            return {
                "success": True,
                "force_logout": True,
                "message": "Please verify your email and login again",
            }

        return {
            "success": True,
            "message": "Profile updated successfully",
            "email_verification_required": False,
            "force_logout": False,
            "data": dict(updated_user)
        }

    except HTTPException:
        raise

    except Exception as e:
        print("PROFILE UPDATE ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error_code": "PROFILE_UPDATE_FAILED",
                "message": "Unable to update profile"
            }
        )


# =========================================================
# ADMIN CHECK — require admin role + pro plan
# =========================================================

async def _check_admin_pro(conn, user_id: str, company_id: str):
    """
    Raises 403 if:
      - caller is not role='admin'
      - active plan is not 'pro'
    Returns plan_name on success.
    """
    from utils.subscription_service import get_company_plan

    # Check caller role
    row = await conn.fetchrow("""
        SELECT role FROM core_auth_table.auth_user WHERE user_id = $1
    """, user_id)
    if not row or row["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail={
                "success": False,
                "error": "not_admin",
                "message": "Only the account admin can manage users.",
            }
        )

    # Check plan
    plan_name = await get_company_plan(conn, company_id)
    if plan_name != "pro":
        raise HTTPException(
            status_code=403,
            detail={
                "success": False,
                "error": "pro_required",
                "message": "User management is only available on the Pro plan.",
                "plan_name": plan_name,
            }
        )

    return plan_name


# =========================================================
# CREATE SUB-USER (admin + pro only, 3-user limit)
# =========================================================

PLAN_USER_LIMITS = {
    "trial": 1,
    "basic": 1,
    "pro":   3,
}

async def create_user(conn, data, caller_user_id: str, company_id: str):

    # 1. Must be admin on pro plan
    plan_name = await _check_admin_pro(conn, caller_user_id, company_id)

    user_limit = PLAN_USER_LIMITS.get(plan_name, 1)

    # 2. Count existing active users under this company
    row = await conn.fetchrow("""
        SELECT COUNT(*) AS cnt
        FROM core_auth_table.auth_user
        WHERE companies_other_id = $1
          AND status != 'inactive'
    """, company_id)
    current_count = row["cnt"] if row else 0

    if current_count >= user_limit:
        raise HTTPException(
            status_code=403,
            detail={
                "success": False,
                "error": "user_limit_reached",
                "message": f"Your {plan_name} plan allows {user_limit} user(s). "
                           f"You already have {current_count}.",
                "current_users": current_count,
                "user_limit": user_limit,
                "plan_name": plan_name,
            }
        )

    # 3. Check email uniqueness
    existing = await conn.fetchrow("""
        SELECT user_id FROM core_auth_table.auth_user
        WHERE LOWER(email) = LOWER($1)
    """, data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    # 4. Create member user — active immediately, no email verification
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(data.password)

    await conn.execute("""
        INSERT INTO core_auth_table.auth_user
        (user_id, email, password_hash, full_name, phone, status,
         companies_other_id, role, is_submitted, created_at)
        VALUES ($1, $2, $3, $4, $5, 'active', $6, 'member', TRUE, NOW())
    """,
        user_id,
        data.email,
        hashed_password,
        data.full_name,
        None,
        company_id,
    )

    return {
        "success": True,
        "message": "User created successfully.",
        "user_id": user_id,
        "email": data.email,
        "full_name": data.full_name,
        "role": "member",
        "plan_name": plan_name,
        "users_used": current_count + 1,
        "user_limit": user_limit,
    }


async def get_company_users(conn, caller_user_id: str, company_id: str):

    # 1. Must be admin on pro plan
    await _check_admin_pro(conn, caller_user_id, company_id)

    # 2. Fetch all active member users under this company
    rows = await conn.fetch("""
        SELECT user_id, full_name, email
        FROM core_auth_table.auth_user
        WHERE companies_other_id = $1
          AND role = 'member'
          AND status != 'inactive'
        ORDER BY created_at ASC
    """, company_id)

    users = [
        {
            "user_id": row["user_id"],
            "full_name": row["full_name"],
            "email": row["email"],
        }
        for row in rows
    ]

    return {
        "success": True,
        "company_id": company_id,
        "total": len(users),
        "users": users,
    }
# =========================================================
# DELETE SUB-USER (admin + pro only, cannot delete self)
# =========================================================

async def delete_user(conn, target_user_id: str, caller_user_id: str, company_id: str):

    # 1. Must be admin on pro plan
    await _check_admin_pro(conn, caller_user_id, company_id)

    # 2. Cannot delete self
    if target_user_id == caller_user_id:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "cannot_delete_self",
                "message": "You cannot delete your own account.",
            }
        )

    # 3. Target must belong to same company and not be admin
    target = await conn.fetchrow("""
        SELECT user_id, role, status
        FROM core_auth_table.auth_user
        WHERE user_id = $1
          AND companies_other_id = $2
          AND status != 'inactive'
    """, target_user_id, company_id)

    if not target:
        raise HTTPException(
            status_code=404,
            detail={"success": False, "error": "user_not_found", "message": "User not found."}
        )

    if target["role"] == "admin":
        raise HTTPException(
            status_code=403,
            detail={"success": False, "error": "cannot_delete_admin", "message": "Cannot delete another admin."}
        )

    # 4. Soft-delete — use 'inactive' (constraint only allows: active, pending_verification, inactive)
    await conn.execute("""
        UPDATE core_auth_table.auth_user
        SET status = 'inactive', updated_at = NOW()
        WHERE user_id = $1
    """, target_user_id)

    return {
        "success": True,
        "message": "User deleted successfully.",
        "deleted_user_id": target_user_id,
    }

