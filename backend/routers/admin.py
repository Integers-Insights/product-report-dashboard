import os
from fastapi import APIRouter, Depends, HTTPException
from db.database import get_db
from utils.service import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

SUPER_ADMIN_EMAIL = os.getenv("SUPER_ADMIN_EMAIL", "")


async def require_super_admin(current_user=Depends(get_current_user), conn=Depends(get_db)):
    user_id = current_user["user_id"]
    row = await conn.fetchrow(
        "SELECT role FROM core_auth_table.auth_user WHERE user_id = $1", user_id
    )
    if not row or row["role"] != "super_admin":
        raise HTTPException(status_code=403, detail={"success": False, "error": "Super admin access only"})
    return current_user


# ─────────────────────────────────────────────
#  USER MANAGEMENT
# ─────────────────────────────────────────────

@router.get("/users/by-country")
async def users_by_country(conn=Depends(get_db), _=Depends(require_super_admin)):
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
        where u.role='admin' or u.role='member' 
        GROUP BY country
        ORDER BY total_users DESC
    """)
    return {
        "success": True,
        "total_countries": len(rows),
        "countries": [dict(r) for r in rows]
    }


@router.get("/users")
async def list_users(conn=Depends(get_db), _=Depends(require_super_admin)):
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
        where u.role='admin' or u.role='member' 
        ORDER BY u.created_at DESC
    """)
    return {"success": True, "total": len(rows), "users": [dict(r) for r in rows]}


@router.get("/users/{user_id}")
async def get_user(user_id: str, conn=Depends(get_db), _=Depends(require_super_admin)):
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
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True, "user": dict(row)}


@router.patch("/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_super_admin)
):
    status = body.get("status")
    if status not in ("active", "inactive", "pending_verification"):
        raise HTTPException(status_code=400, detail="Invalid status. Use: active, inactive, pending_verification")
    await conn.execute(
        "UPDATE core_auth_table.auth_user SET status = $1, updated_at = NOW() WHERE user_id = $2",
        status, user_id
    )
    return {"success": True, "user_id": user_id, "status": status}


# ─────────────────────────────────────────────
#  SUBSCRIPTION MANAGEMENT
# ─────────────────────────────────────────────

@router.get("/subscriptions")
async def list_subscriptions(conn=Depends(get_db), _=Depends(require_super_admin)):
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


@router.post("/subscriptions/upgrade")
async def admin_upgrade_plan(
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_super_admin)
):
    from utils.subscription_service import upgrade_company_plan
    company_id   = body.get("company_id")
    plan_name    = body.get("plan_name")
    billing_cycle = body.get("billing_cycle")
    duration_days = body.get("duration_days")

    if not company_id or not plan_name:
        raise HTTPException(status_code=400, detail="company_id and plan_name required")

    result = await upgrade_company_plan(
        conn, company_id, plan_name,
        billing_cycle=billing_cycle,
        duration_days=duration_days,
        source="admin_override"
    )
    return {"success": True, **result}


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


@router.get("/jobs/stats")
async def job_stats(conn=Depends(get_db), _=Depends(require_super_admin)):
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


@router.patch("/jobs/{job_id}/cancel")
async def cancel_job(job_id: str, conn=Depends(get_db), _=Depends(require_super_admin)):
    result = await conn.execute("""
        UPDATE core_tables.pipeline_jobs
        SET status = 'failed', stage = 'cancelled_by_admin', updated_at = NOW()
        WHERE id = $1 AND status IN ('pending', 'processing')
    """, job_id)
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Job not found or already completed")
    return {"success": True, "job_id": job_id, "status": "cancelled"}


# ─────────────────────────────────────────────
#  SALES ANALYTICS
# ─────────────────────────────────────────────

@router.get("/sales/summary")
async def sales_summary(conn=Depends(get_db), _=Depends(require_super_admin)):

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

            -- current week
            COUNT(*)    FILTER (WHERE created_at >= this_week_start)                                          AS this_week_count,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= this_week_start), 0)                            AS this_week_revenue,

            -- previous week
            COUNT(*)    FILTER (WHERE created_at >= prev_week_start AND created_at < this_week_start)        AS prev_week_count,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= prev_week_start AND created_at < this_week_start), 0) AS prev_week_revenue,

            -- current month
            COUNT(*)    FILTER (WHERE created_at >= this_month_start)                                        AS this_month_count,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= this_month_start), 0)                          AS this_month_revenue,

            -- previous month
            COUNT(*)    FILTER (WHERE created_at >= prev_month_start AND created_at < this_month_start)      AS prev_month_count,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= prev_month_start AND created_at < this_month_start), 0) AS prev_month_revenue

        FROM periods
        GROUP BY plan_name
        ORDER BY plan_name
    """)

    plans = [dict(r) for r in rows]

    # totals across all plans
    def _sum(key): return sum(r[key] for r in plans)

    return {
        "success": True,
        "plans": plans,
        "totals": {
            "this_week":   {"count": _sum("this_week_count"),   "revenue": _sum("this_week_revenue")},
            "prev_week":   {"count": _sum("prev_week_count"),   "revenue": _sum("prev_week_revenue")},
            "this_month":  {"count": _sum("this_month_count"),  "revenue": _sum("this_month_revenue")},
            "prev_month":  {"count": _sum("prev_month_count"),  "revenue": _sum("prev_month_revenue")},
        }
    }


# ─────────────────────────────────────────────
#  DATA EXPORT REQUESTS (GDPR)
# ─────────────────────────────────────────────

@router.get("/export-requests")
async def list_export_requests(conn=Depends(get_db), _=Depends(require_super_admin)):
    rows = await conn.fetch("""
        SELECT der.id, der.user_id, der.status, der.requested_at, der.processed_at,
               u.email, u.full_name
        FROM core_auth_table.data_export_requests der
        LEFT JOIN core_auth_table.auth_user u ON u.user_id = der.user_id
        ORDER BY der.requested_at DESC
    """)
    return {"success": True, "total": len(rows), "requests": [dict(r) for r in rows]}


@router.patch("/export-requests/{request_id}/complete")
async def complete_export_request(
    request_id: str,
    conn=Depends(get_db),
    _=Depends(require_super_admin)
):
    result = await conn.execute("""
        UPDATE core_auth_table.data_export_requests
        SET status = 'completed', processed_at = NOW()
        WHERE id = $1
    """, request_id)
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Export request not found")
    return {"success": True, "request_id": request_id, "status": "completed"}


# ─────────────────────────────────────────────
#  OWNER ONLY — assign / revoke super admin
# ─────────────────────────────────────────────

async def require_owner(current_user=Depends(get_current_user), conn=Depends(get_db)):
    user_id = current_user["user_id"]
    row = await conn.fetchrow(
        "SELECT role FROM core_auth_table.auth_user WHERE user_id = $1", user_id
    )
    if not row or row["role"] != "super_admin":
        raise HTTPException(status_code=403, detail={"success": False, "error": "Owner access only"})
    return current_user


@router.post("/owner/assign-super-admin")
async def assign_super_admin(
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_owner)
):
    email = body.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="email is required")

    row = await conn.fetchrow(
        "SELECT user_id, role FROM core_auth_table.auth_user WHERE email = $1", email
    )
    if not row:
        raise HTTPException(status_code=404, detail=f"No user found with email: {email}")

    await conn.execute(
        "UPDATE core_auth_table.auth_user SET role = 'super_admin', updated_at = NOW() WHERE user_id = $1",
        row["user_id"]
    )
    return {"success": True, "message": f"{email} is now a super_admin", "user_id": str(row["user_id"])}


@router.post("/owner/revoke-super-admin")
async def revoke_super_admin(
    body: dict,
    conn=Depends(get_db),
    _=Depends(require_owner)
):
    email = body.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="email is required")

    row = await conn.fetchrow(
        "SELECT user_id, role FROM core_auth_table.auth_user WHERE email = $1", email
    )
    if not row:
        raise HTTPException(status_code=404, detail=f"No user found with email: {email}")

    await conn.execute(
        "UPDATE core_auth_table.auth_user SET role = 'user', updated_at = NOW() WHERE user_id = $1",
        row["user_id"]
    )
    return {"success": True, "message": f"{email} role reverted to user", "user_id": str(row["user_id"])}
