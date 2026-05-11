from datetime import timedelta,datetime
import uuid
import re
from jose import jwt,JWTError
from utils.jwt_utils import verify_token, SECRET_KEY, ALGORITHM, create_access_token,  get_user_permissions
from fastapi import Request, Response, HTTPException, Depends
from db.database import get_db
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError, ExpiredSignatureError
#from services.onboarding_service import resolve_company_id

TEMP_ACCESS_DAYS = 14
 
security = HTTPBearer(auto_error=False)

async def resolve_company_id(conn, user_id):
    
    # 1. Try existing mapping
    company_id = await conn.fetchval("""
        SELECT companies_other_id
        FROM core_auth_table.auth_user
        WHERE user_id = $1
    """, user_id)

    if company_id:
        return company_id

    # 2. Create new company
    company_id = await conn.fetchval("""
        INSERT INTO core_tables.companies_other (id, name)
        VALUES (gen_random_uuid(), 'New Company')
        RETURNING id
    """)

    # 3. Map user → company
    await conn.execute("""
        UPDATE core_auth_table.auth_user
        SET companies_other_id = $1
        WHERE user_id = $2
    """, company_id, user_id)

    return company_id

def handle_device_access(cur, user_id, device_hash, ip_address):

    cur.execute("""
        SELECT temporary_access_until
        FROM core_auth_table.device_access
        WHERE user_id = %s
        AND device_hash = %s
        AND ip_address = %s
        LIMIT 1
    """, (user_id, device_hash, ip_address))

    device = cur.fetchone()

    if device:
        return True

    # grant temporary access
    expiry_date = datetime.utcnow() + timedelta(days=TEMP_ACCESS_DAYS)

    cur.execute("""
        INSERT INTO core_auth_table.device_access
        (
            id,
            user_id,
            device_hash,
            ip_address,
            temporary_access_until,
            created_at
        )
        VALUES (%s,%s,%s,%s,%s,NOW())
    """, (
        str(uuid.uuid4()),
        user_id,
        device_hash,
        ip_address,
        expiry_date
    ))

    return {
        "warning": "New device detected",
        "message": "Temporary access granted for 14 days from this device.",
        "temporary_access_until": expiry_date
    }

def generate_slug(name: str) -> str:
    """
    Converts company name into URL-friendly slug.
    Example:
    "PQR Pvt Ltd" -> "pqr-pvt-ltd"
    """

    # Lowercase
    slug = name.lower()

    # Replace non-alphanumeric with hyphen
    slug = re.sub(r'[^a-z0-9]+', '-', slug)

    # Remove leading/trailing hyphens
    slug = slug.strip('-')

    return slug

async def generate_unique_slug(conn, company_name: str):

    base_slug = re.sub(r'[^a-zA-Z0-9]+', '-', company_name.lower()).strip("-")
    slug = base_slug
    counter = 1

    while True:

        existing = await conn.fetchrow(
            """
            SELECT 1
            FROM core_tables.companies_other
            WHERE slug = $1
            """,
            slug
        )

        if not existing:
            return slug

        slug = f"{base_slug}-{counter}"
        counter += 1

# async def get_current_user(
#     request: Request,
#     conn = Depends(get_db)
# ):
#     token = None

#     # =========================================================
#     # ✅ 1. TRY AUTH HEADER (PRIORITY)
#     # =========================================================
#     auth_header = request.headers.get("Authorization")

#     if auth_header and auth_header.startswith("Bearer "):
#         token = auth_header.replace("Bearer ", "")

#     # =========================================================
#     # ✅ 2. FALLBACK TO COOKIE
#     # =========================================================
#     if not token:
#         token = request.cookies.get("access_token")

#     if not token:
#         raise HTTPException(
#             status_code=401,
#             detail={
#                 "success": False,
#                 "error_code": "AUTH_TOKEN_MISSING",
#                 "message": "Authentication token missing"
#             }
#         )

#     try:
#         payload = verify_token(token)

#         if payload.get("type") != "access":
#             raise HTTPException(
#                 status_code=401,
#                 detail={
#                     "success": False,
#                     "error_code": "INVALID_TOKEN_TYPE",
#                     "message": "Invalid token type"
#                 }
#             )

#         user_id = payload.get("sub")

#         # 🔥 DEBUG (keep this for now)
#         print("✅ CURRENT USER:", user_id)

#         # =========================================================
#         # 🔥 RESOLVE COMPANY
#         # =========================================================
#         company_id = payload.get("company_id")  # ⚡ FASTER than DB

#         # fallback if missing
#         if not company_id:
#             company_id = await resolve_company_id(conn, user_id)

#         return {
#             "sub": user_id,
#             "company_id": company_id,
#             "email": payload.get("email"),
#         }

#     except JWTError:
#         raise HTTPException(
#             status_code=401,
#             detail={
#                 "success": False,
#                 "error_code": "TOKEN_EXPIRED_OR_INVALID",
#                 "message": "Token expired or invalid"
#             }
#         )

async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    conn=Depends(get_db),
):

    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authorization token missing"
        )

    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        # Check if token was issued before password change
        iat = payload.get("iat")
        if iat:
            row = await conn.fetchrow("""
                SELECT tokens_revoked_at
                FROM core_auth_table.auth_user
                WHERE user_id = $1
            """, user_id)
            if row and row["tokens_revoked_at"]:
                from datetime import timezone as _tz
                revoked_at = row["tokens_revoked_at"]
                # Ensure timezone-aware for comparison
                if revoked_at.tzinfo is None:
                    revoked_at = revoked_at.replace(tzinfo=_tz.utc)
                revoked_ts = int(revoked_at.timestamp())
                if iat < revoked_ts:
                    raise HTTPException(
                        status_code=401,
                        detail="Session expired. Please login again."
                    )

        user = {
            "user_id": user_id,
            "company_id": payload.get("company_id"),
            "permissions": payload.get("permissions"),
        }

        request.state.user = user
        return user

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")