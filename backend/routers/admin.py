import os
import asyncpg
from fastapi import APIRouter, Depends, HTTPException
from db.database import get_db
from utils.service import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

SUPER_ADMIN_EMAIL = os.getenv("SUPER_ADMIN_EMAIL", "")


async def require_super_admin(current_user=Depends(get_current_user), conn=Depends(get_db)):
    try:
        user_id = current_user["user_id"]
        row = await conn.fetchrow(
            "SELECT role FROM core_auth_table.auth_user WHERE user_id = $1", user_id
        )
        if not row or row["role"] != "super_admin":
            raise HTTPException(status_code=403, detail={"success": False, "error": "Super admin access only"})
        return current_user
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": "Auth check failed", "detail": str(e)})


# ─────────────────────────────────────────────
#  USER MANAGEMENT
# ─────────────────────────────────────────────

@router.get("/users/by-country")
async def users_by_country(conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        rows = await conn.fetch("""
            SELECT
                COALESCE(c.headquarters_country, 'Unknown') AS country,
                COUNT(DISTINCT u.user_id)                   AS total_users,
                COUNT(DISTINCT u.user_id) FILTER (WHERE u.status = 'active')   AS active_users,
                COUNT(DISTINCT u.user_id) FILTER (WHERE u.status = 'inactive') AS inactive_users,
                COUNT(DISTINCT cs.subscription_id) FILTER (WHERE sp.plan_name = 'trial')  AS trial_count,
                COUNT(DISTINCT cs.subscription_id) FILTER (WHERE sp.plan_name = 'basic')  AS basic_count,
                COUNT(DISTINCT cs.subscription_id) FILTER (WHERE sp.plan_name = 'pro')    AS pro_count
            FROM core_auth_table.auth_user u
            LEFT JOIN core_tables.companies_other c ON c.id = u.companies_other_id
            LEFT JOIN core_auth_table.company_subscriptions cs
                ON cs.company_id = c.id AND cs.status = 'active'
            LEFT JOIN core_auth_table.subscription_plans sp ON sp.plan_id = cs.plan_id
            WHERE u.role = 'admin' OR u.role = 'member'
            GROUP BY country
            ORDER BY total_users DESC
        """)
        return {
            "success": True,
            "total_countries": len(rows),
            "countries": [dict(r) for r in rows]
        }
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("USERS BY COUNTRY DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("USERS BY COUNTRY ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch users by country", "detail": str(e)})


@router.get("/users")
async def list_users(conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        rows = await conn.fetch("""
            SELECT
                u.user_id, u.email, u.full_name, u.phone, u.role,
                u.status, u.created_at,
                c.name AS company_name,
                sp.plan_name,
                cs.status AS subscription_status,
                cs.end_date
            FROM core_auth_table.auth_user u
            LEFT JOIN core_tables.companies_other c ON c.id = u.companies_other_id
            LEFT JOIN core_auth_table.company_subscriptions cs
                ON cs.company_id = c.id AND cs.status = 'active'
            LEFT JOIN core_auth_table.subscription_plans sp ON sp.plan_id = cs.plan_id
            WHERE u.role = 'admin' OR u.role = 'member'
            ORDER BY u.created_at DESC
        """)
        return {"success": True, "total": len(rows), "users": [dict(r) for r in rows]}
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("LIST USERS DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("LIST USERS ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch users", "detail": str(e)})


@router.get("/users/{user_id}")
async def get_user(user_id: str, conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        row = await conn.fetchrow("""
            SELECT
                u.user_id, u.email, u.full_name, u.phone, u.role,
                u.status, u.created_at, u.is_submitted,
                c.id AS company_id, c.name AS company_name,
                c.headquarters_country, c.industry,
                sp.plan_name, cs.start_date, cs.end_date
            FROM core_auth_table.auth_user u
            LEFT JOIN core_tables.companies_other c ON c.id = u.companies_other_id
            LEFT JOIN core_auth_table.company_subscriptions cs
                ON cs.company_id = c.id AND cs.status = 'active'
            LEFT JOIN core_auth_table.subscription_plans sp ON sp.plan_id = cs.plan_id
            WHERE u.user_id = $1
        """, user_id)
        if not row:
            raise HTTPException(status_code=404, detail={"success": False, "error": "User not found"})
        return {"success": True, "user": dict(row)}
    except HTTPException:
        raise
    except asyncpg.InvalidTextRepresentationError:
        raise HTTPException(status_code=400, detail={"success": False, "error": "Invalid user_id format"})
    except asyncpg.PostgresError as e:
        print("GET USER DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("GET USER ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch user", "detail": str(e)})


@router.patch("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_super_admin)
):
    try:
        status = body.get("status")
        if status not in ("active", "inactive", "pending_verification"):
            raise HTTPException(status_code=400, detail={"success": False, "error": "Invalid status. Use: active, inactive, pending_verification"})

        result = await conn.execute(
            "UPDATE core_auth_table.auth_user SET status = $1, updated_at = NOW() WHERE user_id = $2",
            status, user_id
        )
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail={"success": False, "error": "User not found"})

        return {"success": True, "user_id": user_id, "status": status}
    except HTTPException:
        raise
    except asyncpg.InvalidTextRepresentationError:
        raise HTTPException(status_code=400, detail={"success": False, "error": "Invalid user_id format"})
    except asyncpg.CheckViolationError as e:
        raise HTTPException(status_code=400, detail={"success": False, "error": "Status value not allowed by database constraint", "detail": str(e)})
    except asyncpg.PostgresError as e:
        print("UPDATE USER STATUS DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("UPDATE USER STATUS ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to update user status", "detail": str(e)})


# ─────────────────────────────────────────────
#  SUBSCRIPTION MANAGEMENT
# ─────────────────────────────────────────────

@router.get("/subscriptions")
async def list_subscriptions(conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        rows = await conn.fetch("""
            SELECT
                cs.subscription_id, cs.company_id, cs.status,
                cs.billing_cycle, cs.start_date, cs.end_date, cs.source,
                sp.plan_name,
                c.name AS company_name,
                u.email
            FROM core_auth_table.company_subscriptions cs
            JOIN core_auth_table.subscription_plans sp ON sp.plan_id = cs.plan_id
            LEFT JOIN core_tables.companies_other c ON c.id = cs.company_id
            LEFT JOIN core_auth_table.auth_user u ON u.companies_other_id = cs.company_id
            ORDER BY cs.created_at DESC
            LIMIT 100
        """)
        return {"success": True, "total": len(rows), "subscriptions": [dict(r) for r in rows]}
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("LIST SUBSCRIPTIONS DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("LIST SUBSCRIPTIONS ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch subscriptions", "detail": str(e)})


@router.post("/subscriptions/upgrade")
async def admin_upgrade_plan(
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_super_admin)
):
    try:
        from utils.subscription_service import upgrade_company_plan
        company_id    = body.get("company_id")
        plan_name     = body.get("plan_name")
        billing_cycle = body.get("billing_cycle")
        duration_days = body.get("duration_days")

        if not company_id or not plan_name:
            raise HTTPException(status_code=400, detail={"success": False, "error": "company_id and plan_name are required"})

        result = await upgrade_company_plan(
            conn, company_id, plan_name,
            billing_cycle=billing_cycle,
            duration_days=duration_days,
            source="admin_override"
        )
        return {"success": True, **result}
    except HTTPException:
        raise
    except asyncpg.ForeignKeyViolationError:
        raise HTTPException(status_code=404, detail={"success": False, "error": "Company not found"})
    except asyncpg.PostgresError as e:
        print("UPGRADE PLAN DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error during plan upgrade", "detail": str(e)})
    except Exception as e:
        print("UPGRADE PLAN ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to upgrade plan", "detail": str(e)})


# ─────────────────────────────────────────────
#  JOB MONITORING
# ─────────────────────────────────────────────

@router.get("/jobs")
async def list_jobs(
    status: str = None,
    limit: int = 50,
    conn=Depends(get_db),
    _=Depends(require_super_admin)
):
    try:
        if limit < 1 or limit > 500:
            raise HTTPException(status_code=400, detail={"success": False, "error": "limit must be between 1 and 500"})

        if status:
            rows = await conn.fetch("""
                SELECT pj.id, pj.user_id, pj.website_url, pj.status,
                       pj.stage, pj.progress, pj.retry_count,
                       pj.created_at, pj.updated_at,
                       u.email
                FROM core_tables.pipeline_jobs pj
                LEFT JOIN core_auth_table.auth_user u ON u.user_id = pj.user_id
                WHERE pj.status = $1
                ORDER BY pj.created_at DESC
                LIMIT $2
            """, status, limit)
        else:
            rows = await conn.fetch("""
                SELECT pj.id, pj.user_id, pj.website_url, pj.status,
                       pj.stage, pj.progress, pj.retry_count,
                       pj.created_at, pj.updated_at,
                       u.email
                FROM core_tables.pipeline_jobs pj
                LEFT JOIN core_auth_table.auth_user u ON u.user_id = pj.user_id
                ORDER BY pj.created_at DESC
                LIMIT $1
            """, limit)

        return {"success": True, "total": len(rows), "jobs": [dict(r) for r in rows]}
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("LIST JOBS DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("LIST JOBS ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch jobs", "detail": str(e)})


@router.get("/jobs/stats")
async def job_stats(conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        row = await conn.fetchrow("""
            SELECT
                COUNT(*) FILTER (WHERE status = 'pending')    AS pending,
                COUNT(*) FILTER (WHERE status = 'processing') AS processing,
                COUNT(*) FILTER (WHERE status = 'completed')  AS completed,
                COUNT(*) FILTER (WHERE status = 'failed')     AS failed,
                COUNT(*)                                       AS total
            FROM core_tables.pipeline_jobs
            WHERE created_at > NOW() - INTERVAL '24 hours'
        """)
        return {"success": True, "last_24h": dict(row)}
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("JOB STATS DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("JOB STATS ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch job stats", "detail": str(e)})


@router.patch("/jobs/{job_id}/cancel")
async def cancel_job(job_id: str, conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        result = await conn.execute("""
            UPDATE core_tables.pipeline_jobs
            SET status = 'failed', stage = 'cancelled_by_admin', updated_at = NOW()
            WHERE id = $1 AND status IN ('pending', 'processing')
        """, job_id)
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail={"success": False, "error": "Job not found or already completed"})
        return {"success": True, "job_id": job_id, "status": "cancelled"}
    except HTTPException:
        raise
    except asyncpg.InvalidTextRepresentationError:
        raise HTTPException(status_code=400, detail={"success": False, "error": "Invalid job_id format"})
    except asyncpg.PostgresError as e:
        print("CANCEL JOB DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("CANCEL JOB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to cancel job", "detail": str(e)})


# ─────────────────────────────────────────────
#  SALES ANALYTICS
# ─────────────────────────────────────────────

@router.get("/sales/summary")
async def sales_summary(conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        rows = await conn.fetch("""
            WITH periods AS (
                SELECT
                    sp.plan_name,
                    cp.amount,
                    cp.created_at,
                    DATE_TRUNC('week',  CURRENT_DATE) AS this_week_start,
                    DATE_TRUNC('week',  CURRENT_DATE) - INTERVAL '7 days'  AS prev_week_start,
                    DATE_TRUNC('month', CURRENT_DATE) AS this_month_start,
                    DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AS prev_month_start
                FROM core_auth_table.subscription_plans sp
                JOIN core_auth_table.company_subscription_payments cp
                    ON sp.plan_id = cp.plan_id
                WHERE cp.payment_status = 'paid'
            )
            SELECT
                plan_name,
                COUNT(*)    FILTER (WHERE created_at >= this_week_start)                                               AS this_week_count,
                COALESCE(SUM(amount) FILTER (WHERE created_at >= this_week_start), 0)                                  AS this_week_revenue,
                COUNT(*)    FILTER (WHERE created_at >= prev_week_start AND created_at < this_week_start)              AS prev_week_count,
                COALESCE(SUM(amount) FILTER (WHERE created_at >= prev_week_start AND created_at < this_week_start), 0) AS prev_week_revenue,
                COUNT(*)    FILTER (WHERE created_at >= this_month_start)                                              AS this_month_count,
                COALESCE(SUM(amount) FILTER (WHERE created_at >= this_month_start), 0)                                 AS this_month_revenue,
                COUNT(*)    FILTER (WHERE created_at >= prev_month_start AND created_at < this_month_start)            AS prev_month_count,
                COALESCE(SUM(amount) FILTER (WHERE created_at >= prev_month_start AND created_at < this_month_start), 0) AS prev_month_revenue
            FROM periods
            GROUP BY plan_name
            ORDER BY plan_name
        """)

        plans = [dict(r) for r in rows]

        def _sum(key):
            return sum(r[key] for r in plans)

        return {
            "success": True,
            "plans": plans,
            "totals": {
                "this_week":  {"count": _sum("this_week_count"),  "revenue": _sum("this_week_revenue")},
                "prev_week":  {"count": _sum("prev_week_count"),  "revenue": _sum("prev_week_revenue")},
                "this_month": {"count": _sum("this_month_count"), "revenue": _sum("this_month_revenue")},
                "prev_month": {"count": _sum("prev_month_count"), "revenue": _sum("prev_month_revenue")},
            }
        }
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("SALES SUMMARY DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("SALES SUMMARY ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch sales summary", "detail": str(e)})


# ─────────────────────────────────────────────
#  DATA EXPORT REQUESTS (GDPR)
# ─────────────────────────────────────────────

@router.get("/export-requests")
async def list_export_requests(conn=Depends(get_db), _=Depends(require_super_admin)):
    try:
        rows = await conn.fetch("""
            SELECT der.id, der.user_id, der.status, der.requested_at, der.processed_at,
                   u.email, u.full_name
            FROM core_auth_table.data_export_requests der
            LEFT JOIN core_auth_table.auth_user u ON u.user_id = der.user_id
            ORDER BY der.requested_at DESC
        """)
        return {"success": True, "total": len(rows), "requests": [dict(r) for r in rows]}
    except HTTPException:
        raise
    except asyncpg.UndefinedTableError:
        raise HTTPException(status_code=500, detail={"success": False, "error": "data_export_requests table does not exist. Run the migration to create it."})
    except asyncpg.PostgresError as e:
        print("EXPORT REQUESTS DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("EXPORT REQUESTS ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to fetch export requests", "detail": str(e)})


@router.patch("/export-requests/{request_id}/complete")
async def complete_export_request(
    request_id: str,
    conn=Depends(get_db),
    _=Depends(require_super_admin)
):
    try:
        result = await conn.execute("""
            UPDATE core_auth_table.data_export_requests
            SET status = 'completed', processed_at = NOW()
            WHERE id = $1
        """, request_id)
        if result == "UPDATE 0":
            raise HTTPException(status_code=404, detail={"success": False, "error": "Export request not found"})
        return {"success": True, "request_id": request_id, "status": "completed"}
    except HTTPException:
        raise
    except asyncpg.InvalidTextRepresentationError:
        raise HTTPException(status_code=400, detail={"success": False, "error": "Invalid request_id format"})
    except asyncpg.PostgresError as e:
        print("COMPLETE EXPORT DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("COMPLETE EXPORT ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to complete export request", "detail": str(e)})


# ─────────────────────────────────────────────
#  OWNER ONLY — assign / revoke super admin
# ─────────────────────────────────────────────

async def require_owner(current_user=Depends(get_current_user), conn=Depends(get_db)):
    try:
        user_id = current_user["user_id"]
        row = await conn.fetchrow(
            "SELECT role FROM core_auth_table.auth_user WHERE user_id = $1", user_id
        )
        if not row or row["role"] != "super_admin":
            raise HTTPException(status_code=403, detail={"success": False, "error": "Owner access only"})
        return current_user
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        raise HTTPException(status_code=500, detail={"success": False, "error": "Auth check failed", "detail": str(e)})


@router.post("/owner/assign-super-admin")
async def assign_super_admin(
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_owner)
):
    try:
        email = body.get("email")
        if not email:
            raise HTTPException(status_code=400, detail={"success": False, "error": "email is required"})

        row = await conn.fetchrow(
            "SELECT user_id, role FROM core_auth_table.auth_user WHERE email = $1", email
        )
        if not row:
            raise HTTPException(status_code=404, detail={"success": False, "error": f"No user found with email: {email}"})

        if row["role"] == "super_admin":
            raise HTTPException(status_code=409, detail={"success": False, "error": f"{email} is already a super_admin"})

        await conn.execute(
            "UPDATE core_auth_table.auth_user SET role = 'super_admin', updated_at = NOW() WHERE user_id = $1",
            row["user_id"]
        )
        return {"success": True, "message": f"{email} is now a super_admin", "user_id": str(row["user_id"])}
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("ASSIGN SUPER ADMIN DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("ASSIGN SUPER ADMIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to assign super admin", "detail": str(e)})


@router.post("/owner/revoke-super-admin")
async def revoke_super_admin(
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_owner)
):
    try:
        email = body.get("email")
        if not email:
            raise HTTPException(status_code=400, detail={"success": False, "error": "email is required"})

        row = await conn.fetchrow(
            "SELECT user_id, role FROM core_auth_table.auth_user WHERE email = $1", email
        )
        if not row:
            raise HTTPException(status_code=404, detail={"success": False, "error": f"No user found with email: {email}"})

        if row["role"] != "super_admin":
            raise HTTPException(status_code=409, detail={"success": False, "error": f"{email} is not a super_admin"})

        await conn.execute(
            "UPDATE core_auth_table.auth_user SET role = 'user', updated_at = NOW() WHERE user_id = $1",
            row["user_id"]
        )
        return {"success": True, "message": f"{email} role reverted to user", "user_id": str(row["user_id"])}
    except HTTPException:
        raise
    except asyncpg.PostgresError as e:
        print("REVOKE SUPER ADMIN DB ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Database error", "detail": str(e)})
    except Exception as e:
        print("REVOKE SUPER ADMIN ERROR:", str(e))
        raise HTTPException(status_code=500, detail={"success": False, "error": "Failed to revoke super admin", "detail": str(e)})
