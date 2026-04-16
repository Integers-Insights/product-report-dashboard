from jose import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
load_dotenv()
from fastapi import HTTPException,Request

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 10
REFRESH_TOKEN_EXPIRE_DAYS = 7

async def get_user_permissions(conn, user_id):

    rows = await conn.fetch("""
        SELECT pg.group_name
        FROM core_auth_table.user_permissions_groups upg
        JOIN core_auth_table.permissions_groups pg
            ON upg.group_id = pg.group_id
        WHERE upg.user_id = $1
    """, user_id)

    return [row["group_name"] for row in rows]

def create_access_token(user_id, company_id, permissions):
    from datetime import timezone
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "company_id": company_id,
        "type": "access",
        "permissions": permissions,
        "iat": int(now.timestamp()),   # true UTC unix timestamp
        "exp": now + timedelta(days=365)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


# def create_refresh_token(user_id, company_id):
#     payload = {
#         "sub": user_id,
#         "company_id": company_id,
#         "type": "refresh",
#         "exp": datetime.utcnow() + timedelta(days=7)
#     }
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication token missing"
        )

    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

# def get_current_user(request: Request):

#     token = request.cookies.get("access_token")

#     if not token:
#         raise HTTPException(status_code=401, detail="Not authenticated")

#     return verify_token(token)