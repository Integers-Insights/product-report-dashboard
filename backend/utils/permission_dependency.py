from fastapi import Request, HTTPException
from database.connection import get_db_connection
from modules.auth.jwt_utils import verify_token
from jose import JWTError
from datetime import datetime

def require_permission(*required_permissions):

    def checker(request: Request):

        token = request.cookies.get("access_token")
        payload = verify_token(token)

        user_permissions = payload.get("permissions", [])

        # Check if user has ANY of the required permissions
        if not any(p in user_permissions for p in required_permissions):
            raise HTTPException(status_code=403, detail="Permission denied")

        return payload

    return checker


def require_subscription(module_code: str):

    def checker(request: Request):

        payload = verify_token(request.cookies.get("access_token"))
        company_id = payload["company_id"]

        conn = get_db_connection()
        cur = conn.cursor()

        try:
            cur.execute("""
                SELECT cs.status, cs.end_date
                FROM core_auth_table.company_subscriptions cs
                JOIN core_auth_table.subscription_plan_modules spm
                    ON cs.plan_id = spm.plan_id
                JOIN core_auth_table.subscription_modules sm
                    ON sm.module_id = spm.module_id
                WHERE cs.company_id = %s
                AND cs.status = 'active'
                AND spm.is_enabled = TRUE
                AND sm.module_code = %s
                LIMIT 1
            """, (company_id, module_code))

            result = cur.fetchone()

            if not result:
                raise HTTPException(402, "Upgrade required")

            # 🔥 Safety check (in case scheduler hasn’t run yet)
            if result["end_date"] and result["end_date"] < datetime.utcnow():
                raise HTTPException(402, "Subscription expired. Please renew.")

        finally:
            cur.close()
            conn.close()

    return checker