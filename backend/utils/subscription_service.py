import uuid
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from typing import Optional


# How many items to show per list field inside each module, per plan.
# Fields not listed here are shown in full.
# -1 means unlimited.
PLAN_MODULE_LIMITS = {
    "trial": {
        "buyers_intelligence": {"buyers": 1},
        "price_intelligence":{"variant_table":2},
        "market_intelligence":{"market_info":1}
    },
    "basic": {
        "buyers_intelligence": {"buyers": 5},
        "price_intelligence":{"variant_table":4},
        "market_intelligence":{"market_info":4},
        "trade_intelligence":{"top_exporters":2,"top_importers":2}
    },
    # pro: no limits — all data shown
}

MASK_PLACEHOLDER = {"masked": True, "message": "Upgrade your plan to see more"}

# Fields to hide (replace with FIELD_MASK_PLACEHOLDER) inside each item of a list.
# Structure: { plan: { module_key: { list_field: [fields_to_mask] } } }
PLAN_MODULE_FIELD_MASKS = {
    "trial": {
        "variants": {
            "variants_info": ["moq", "price_range"],
        },
    },
    "basic": {
        "variants": {
            "variants_info": ["moq", "price_range"],
        },
    },
    # pro: no field masks
}

FIELD_MASK_PLACEHOLDER = "Upgrade to unlock"

# Show latest N items with full data; mask specific fields in older items.
# Structure: { plan: { module_key: { list_field: { show_latest, sort_by, mask_fields } } } }
PLAN_MODULE_LATEST_MASKS = {
    "basic": {
        "trade_intelligence": {
            "export_volume_trend": {
                "show_latest": 2,
                "sort_by": "year",
                "mask_fields": ["volume_mt", "yoy_growth"],
            }
        }
    }
}


PLAN_CONFIG = {

    "trial": {
        "modules": [
            "product",
            "overview",
            "variants",
            "price_intelligence",
            "buyers_intelligence",
            "market_intelligence"
        ],
        "daily_query_limit": 5,
        "user_limit": 1,
         "concurrent_job_limit": 1,
    },
    "basic": {
        "modules": [
            "product",
            "overview",
            "variants",
            "price_intelligence",
            "buyers_intelligence",
            "trade_intelligence",
            "market_intelligence",
        ],
        "daily_query_limit":   10,
        "product_limit_per_day": 10,   # max products per day (no daily query reset)
        "limit_type":          "monthly",  # enforce against billing-cycle pool
        "user_limit":          1,
        "yearly_discount":     "2_months_free",
        "concurrent_job_limit": 2
    },
    "pro": {
        "modules": "all",
        "daily_query_limit":   50,
        "product_limit_per_day": 50,   # max products per day (no daily query reset)
        "limit_type":          "monthly",  # enforce against billing-cycle pool
        "user_limit":          3,
        "yearly_discount":     "2_months_free",
        "concurrent_job_limit": 3,
    },
}


def _utcnow() -> datetime:
    """Timezone-naive UTC now — safe for asyncpg TIMESTAMP WITHOUT TIME ZONE columns."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


# =========================================================
# GET PLAN NAME
# Returns the active plan name from DB.
# Returns None if no active subscription found.
# Trial plan is assigned at login — not defaulted here.
# =========================================================

async def check_concurrent_job_limit(conn, company_id: str, user_id: str):
    """Check if user has hit concurrent pipeline job limit for their plan."""
    
    plan_name = await get_company_plan(conn, company_id)
    plan_cfg  = PLAN_CONFIG.get(plan_name or "trial", {})
    limit     = plan_cfg.get("concurrent_job_limit", 1)

    # count active jobs for this user
    active_jobs = await conn.fetchval("""
        SELECT COUNT(*)
        FROM core_tables.pipeline_jobs
        WHERE user_id = $1
          AND status IN ('pending', 'processing', 'running')
    """, user_id)

    if active_jobs >= limit:
        raise HTTPException(
            status_code=429,
            detail={
                "success": False,
                "error":   "CONCURRENT_JOB_LIMIT",
                "active":  active_jobs,
                "limit":   limit,
                "plan":    plan_name,
                "message": f"You already have {active_jobs} job(s) running. "
                           f"Your {plan_name} plan allows {limit} concurrent job(s). "
                           f"Please wait for them to complete or upgrade your plan."
            }
        )

async def get_company_plan(conn, company_id: str) -> Optional[str]:
    if not company_id:
        return None

    row = await conn.fetchrow("""
        SELECT sp.plan_name
        FROM core_auth_table.company_subscriptions cs
        JOIN core_auth_table.subscription_plans sp ON cs.plan_id = sp.plan_id
        WHERE cs.company_id = $1
          AND cs.status = 'active'
        ORDER BY cs.created_at DESC
        LIMIT 1
    """, company_id)

    return row["plan_name"] if row else None


# =========================================================
# ASSIGN TRIAL PLAN ON FIRST LOGIN
# Call this after a user successfully logs in / registers
# if they have no active subscription yet.
# =========================================================
async def assign_trial_plan_if_needed(conn, company_id: str, trial_days: Optional[int] = None):
    """
    Assigns the trial plan to a company if they have no active subscription.
    trial_days: if set, the subscription will expire after this many days.
                Leave None for no expiry (e.g. Google login / step-1 onboarding).
    """
    if not company_id:
        return

    # Check if already has an active subscription
    existing = await conn.fetchrow("""
        SELECT 1 FROM core_auth_table.company_subscriptions
        WHERE company_id = $1 AND status = 'active'
        LIMIT 1
    """, company_id)

    if existing:
        return  # already has a plan

    trial_plan = await conn.fetchrow("""
        SELECT plan_id FROM core_auth_table.subscription_plans
        WHERE plan_name = 'trial' AND status = 'active'
        LIMIT 1
    """)

    if not trial_plan:
        return  # trial plan not configured in DB

    start_date = _utcnow()
    end_date   = (start_date + timedelta(days=trial_days)) if trial_days else None

    await conn.execute("""
        INSERT INTO core_auth_table.company_subscriptions
        (subscription_id, company_id, plan_id, billing_cycle, status, start_date, end_date, source, created_at)
        VALUES ($1, $2, $3, NULL, 'active', $4, $5, 'auto_trial', NOW())
    """,
        str(uuid.uuid4()),
        company_id,
        str(trial_plan["plan_id"]),
        start_date,
        end_date,
    )


# =========================================================
# CHECK PRODUCT LIMIT
# No plan currently enforces a product count limit.
# Kept for forward-compatibility if a plan adds "products" key.
# =========================================================
async def check_product_limit(conn, company_id: str, plan_name: str):
    config = PLAN_CONFIG.get(plan_name, {})
    limit  = config.get("products", -1)

    if limit == -1:
        return  # unlimited

    row = await conn.fetchrow("""
        SELECT COUNT(*) AS total
        FROM product_info.product_master
        WHERE company_id = $1
    """, company_id)

    total = row["total"] or 0

    if total >= limit:
        raise HTTPException(
            status_code=403,
            detail=f"Product limit reached ({total}/{limit}). Upgrade your plan to add more products."
        )


# =========================================================
# IS MODULE ALLOWED
# =========================================================
def is_module_allowed(plan_name: str, module: str) -> bool:
    config  = PLAN_CONFIG.get(plan_name, {})
    modules = config.get("modules", [])

    if modules == "all":
        return True

    return module in modules


# =========================================================
# APPLY MODULE DATA MASKING (partial data within allowed modules)
# Masks list items beyond the per-plan limit for each module field.
# =========================================================
def _apply_list_mask(items: list, max_visible: int) -> list:
    if max_visible == -1:
        return items
    visible = items[:max_visible]
    masked  = [MASK_PLACEHOLDER] * max(0, len(items) - max_visible)
    return visible + masked


def _mask_module_data(module_key: str, module_data: dict, plan_name: str) -> dict:
    """
    Applies two kinds of masking to an allowed module:

    1. List-item masking (PLAN_MODULE_LIMITS):
       Limits how many items are visible in a list field.
       Extra items replaced with MASK_PLACEHOLDER.

    2. Field-level masking (PLAN_MODULE_FIELD_MASKS):
       Hides specific fields inside each object of a list.
       Masked fields replaced with FIELD_MASK_PLACEHOLDER.
    """
    if not isinstance(module_data, dict):
        return module_data

    result = dict(module_data)

    # ── 1. List-item masking ─────────────────────────────────────────────────
    limits = PLAN_MODULE_LIMITS.get(plan_name, {}).get(module_key)
    if limits:
        for field, max_visible in limits.items():
            # Top-level list field
            if field in result:
                if isinstance(result[field], list):
                    result[field] = _apply_list_mask(result[field], max_visible)
                continue
            # Nested inside a top-level dict value (e.g. trade_info → top_exporters)
            for top_key, top_value in result.items():
                if isinstance(top_value, dict) and field in top_value:
                    if isinstance(top_value[field], list):
                        top_value = dict(top_value)
                        top_value[field] = _apply_list_mask(top_value[field], max_visible)
                        result[top_key] = top_value
                    continue
                # Nested inside a top-level list of dicts
                if not isinstance(top_value, list):
                    continue
                updated_rows = []
                for row in top_value:
                    if isinstance(row, dict) and field in row and isinstance(row[field], list):
                        row = dict(row)
                        row[field] = _apply_list_mask(row[field], max_visible)
                    updated_rows.append(row)
                result[top_key] = updated_rows

    # ── 2. Field-level masking ───────────────────────────────────────────────
    field_masks = PLAN_MODULE_FIELD_MASKS.get(plan_name, {}).get(module_key)
    if field_masks:
        for list_field, fields_to_mask in field_masks.items():

            def _mask_list(items):
                masked = []
                for item in items:
                    if isinstance(item, dict):
                        item = dict(item)
                        for f in fields_to_mask:
                            if f in item:
                                item[f] = FIELD_MASK_PLACEHOLDER
                    masked.append(item)
                return masked

            # Top-level list
            if list_field in result and isinstance(result[list_field], list):
                result[list_field] = _mask_list(result[list_field])
                continue

            # Nested inside a top-level dict value (e.g. trade_info → export_volume_trend)
            for top_key, top_value in result.items():
                if isinstance(top_value, dict) and list_field in top_value:
                    if isinstance(top_value[list_field], list):
                        top_value = dict(top_value)
                        top_value[list_field] = _mask_list(top_value[list_field])
                        result[top_key] = top_value
                    break

    # ── 3. Latest-N masking (show newest N items fully, mask fields in older ones) ──
    latest_masks = PLAN_MODULE_LATEST_MASKS.get(plan_name, {}).get(module_key)
    if latest_masks:
        for list_field, cfg in latest_masks.items():
            show_latest  = cfg.get("show_latest", 2)
            sort_by      = cfg.get("sort_by")
            mask_fields  = cfg.get("mask_fields", [])

            # Find the list — top-level or inside a nested dict
            items      = result.get(list_field)
            parent_key = None
            if items is None:
                for top_key, top_value in result.items():
                    if isinstance(top_value, dict) and list_field in top_value:
                        items      = top_value[list_field]
                        parent_key = top_key
                        break

            if not isinstance(items, list):
                continue

            # Sort so latest entries are last, then mask all but the last N
            if sort_by:
                try:
                    items = sorted(items, key=lambda x: x.get(sort_by, 0) if isinstance(x, dict) else 0)
                except Exception:
                    pass

            cutoff     = max(0, len(items) - show_latest)
            new_items  = []
            for idx, item in enumerate(items):
                if idx < cutoff and isinstance(item, dict):
                    item = dict(item)
                    for f in mask_fields:
                        if f in item:
                            item[f] = FIELD_MASK_PLACEHOLDER
                new_items.append(item)

            if parent_key:
                parent = dict(result[parent_key])
                parent[list_field] = new_items
                result[parent_key] = parent
            else:
                result[list_field] = new_items

    return result


# =========================================================
# APPLY PLAN VISIBILITY (filter intelligence response)
# =========================================================
def apply_plan_visibility(response_data: dict, plan_name: str) -> dict:
    plan_config     = PLAN_CONFIG.get(plan_name or "", {})
    allowed_modules = plan_config.get("modules", [])

    if allowed_modules == "all":
        # pro/enterprise: still apply data masking if configured
        return {
            key: _mask_module_data(key, value, plan_name)
            for key, value in response_data.items()
        }

    filtered = {}
    for key, value in response_data.items():
        if key in allowed_modules:
            filtered[key] = _mask_module_data(key, value, plan_name)
        else:
            filtered[key] = {
                "locked": True,
                "message": "Upgrade your plan to unlock this intelligence",
            }

    return filtered


# =========================================================
# APPLY TRIAL VISIBILITY (lock products beyond count limit)
# Currently a pass-through — no plan enforces a products count.
# =========================================================
def apply_trial_visibility(products: list, plan_name: str) -> list:
    config = PLAN_CONFIG.get(plan_name or "", {})
    limit  = config.get("products", -1)

    if limit == -1:
        return products

    result = []
    for index, product in enumerate(products):
        if index < limit:
            item = dict(product)
            item["locked"] = False
            result.append(item)
        else:
            result.append({
                "product_id":   product.get("product_id"),
                "product_name": product.get("product_name"),
                "locked":       True,
                "message":      "Upgrade your plan to unlock more products",
            })

    return result


# =========================================================
# CHECK + HANDLE SUBSCRIPTION EXPIRY (auto-downgrade to trial)
# =========================================================
async def check_and_handle_subscription_expiry(conn, company_id: str):
    if not company_id:
        return

    sub = await conn.fetchrow("""
        SELECT subscription_id, end_date
        FROM core_auth_table.company_subscriptions
        WHERE company_id = $1
          AND status = 'active'
        ORDER BY created_at DESC
        LIMIT 1
    """, company_id)

    if not sub:
        return

    end_date = sub["end_date"]

    if not end_date or end_date >= _utcnow():
        return

    # Expire current subscription
    await conn.execute("""
        UPDATE core_auth_table.company_subscriptions
        SET status = 'expired', updated_at = NOW()
        WHERE subscription_id = $1
    """, str(sub["subscription_id"]))

    # If another active subscription already exists, leave it alone
    existing = await conn.fetchrow("""
        SELECT 1 FROM core_auth_table.company_subscriptions
        WHERE company_id = $1 AND status = 'active'
        LIMIT 1
    """, company_id)

    if existing:
        return

    # Auto-downgrade to trial
    trial_plan = await conn.fetchrow("""
        SELECT plan_id FROM core_auth_table.subscription_plans
        WHERE plan_name = 'trial' AND status = 'active'
        LIMIT 1
    """)

    if not trial_plan:
        return

    await conn.execute("""
        INSERT INTO core_auth_table.company_subscriptions
        (subscription_id, company_id, plan_id, billing_cycle, status, start_date, source, created_at)
        VALUES ($1, $2, $3, NULL, 'active', $4, 'auto_downgrade', NOW())
    """,
        str(uuid.uuid4()),
        company_id,
        str(trial_plan["plan_id"]),
        _utcnow(),
    )


# =========================================================
# UPGRADE PLAN
# =========================================================
async def upgrade_company_plan(
    conn,
    company_id: str,
    plan_name: str,
    billing_cycle: Optional[str] = None,
    duration_days: Optional[int] = None,
    source: str = "manual_upgrade",
) -> dict:
    if not company_id:
        raise HTTPException(status_code=400, detail="Invalid company_id")

    plan = await conn.fetchrow("""
        SELECT plan_id, plan_name
        FROM core_auth_table.subscription_plans
        WHERE plan_name = $1 AND status = 'active'
        LIMIT 1
    """, plan_name)

    if not plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")

    # Expire all existing active subscriptions
    await conn.execute("""
        UPDATE core_auth_table.company_subscriptions
        SET status = 'expired', updated_at = NOW()
        WHERE company_id = $1 AND status = 'active'
    """, company_id)

    start_date = _utcnow()
    end_date   = None

    if plan_name != "enterprise":
        if duration_days:
            end_date = start_date + timedelta(days=duration_days)
        elif billing_cycle == "monthly":
            end_date = start_date + timedelta(days=30)
        elif billing_cycle == "yearly":
            end_date = start_date + timedelta(days=365)

    subscription_id = str(uuid.uuid4())

    await conn.execute("""
        INSERT INTO core_auth_table.company_subscriptions
        (subscription_id, company_id, plan_id, billing_cycle, status, start_date, end_date, source, created_at)
        VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, NOW())
    """,
        subscription_id,
        company_id,
        str(plan["plan_id"]),
        billing_cycle,
        start_date,
        end_date,
        source,
    )

    return {
        "subscription_id": subscription_id,
        "company_id":      company_id,
        "new_plan":        plan_name,
        "billing_cycle":   billing_cycle,
        "start_date":      start_date,
        "end_date":        end_date,
        "status":          "active",
    }


# =========================================================
# INCREMENT MODULE USAGE  (daily reset, no rollover)
# query_limit comes from subscription_plans.query_limit.
# enterprise / NULL / -1  →  unlimited (skip check).
# Requires: company_usage table has usage_date DATE column.
#   ALTER TABLE core_auth_table.company_usage
#   ADD COLUMN IF NOT EXISTS usage_date DATE;
# =========================================================
async def check_and_increment_usage(conn, company_id: str, module_code: str):
    now   = datetime.now(timezone.utc)
    today = now.date()

    # 1. Active subscription + plan details
    subscription = await conn.fetchrow("""
        SELECT sp.plan_name, sp.query_limit, cs.end_date, cs.start_date
        FROM core_auth_table.company_subscriptions cs
        JOIN core_auth_table.subscription_plans sp ON cs.plan_id = sp.plan_id
        WHERE cs.company_id = $1 AND cs.status = 'active'
        ORDER BY cs.created_at DESC LIMIT 1
    """, company_id)

    if not subscription:
        raise HTTPException(status_code=402, detail="No active subscription")

    plan_name        = subscription["plan_name"]
    query_limit      = subscription["query_limit"]
    subscription_end = subscription["end_date"]
    start_date       = subscription["start_date"]

    # unlimited plans (query_limit = -1 or None) → skip all checks
    if query_limit is None or query_limit == -1:
        return

    plan_cfg   = PLAN_CONFIG.get(plan_name, {})
    limit_type = plan_cfg.get("limit_type", "daily")   # "daily" for trial, "monthly" for basic/pro

    # ── TRIAL: daily reset logic ──────────────────────────────────────────────
    if limit_type == "daily":
        usage = await conn.fetchrow("""
            SELECT COALESCE(SUM(usage_count), 0) AS total_used
            FROM core_auth_table.company_usage
            WHERE company_id = $1
              AND usage_date = $2
              AND module_code NOT LIKE 'addon_%'
        """, company_id, today)
        total_used_today = int(usage["total_used"]) if usage else 0

        if total_used_today < query_limit:
            await _record_free_usage(conn, company_id, module_code, today, now)
            return {"type": "free", "company_id": company_id, "module_code": module_code, "date": today}

        # Daily limit hit → try add-on
        return await _consume_addon(conn, company_id, module_code, today, now,
                                    subscription_end, total_used_today, query_limit,
                                    error_key="daily_limit_reached",
                                    message=f"Daily limit of {query_limit} queries reached. Resets tomorrow or purchase add-on credits.")

    # ── BASIC / PRO: monthly pool, no daily reset ─────────────────────────────
    start_date_only = start_date.date() if hasattr(start_date, "date") else start_date
    monthly_limit   = query_limit * max((subscription_end.date() - start_date_only).days, 1) \
                      if (subscription_end and start_date) else query_limit * 30

    # a) Daily product cap (how many products can run per day)
    product_limit_per_day = plan_cfg.get("product_limit_per_day", -1)
    if product_limit_per_day != -1 and module_code == "product_intelligence":
        products_today = await conn.fetchrow("""
            SELECT COALESCE(SUM(usage_count), 0) AS total
            FROM core_auth_table.company_usage
            WHERE company_id = $1
              AND module_code = 'product_intelligence'
              AND usage_date = $2
        """, company_id, today)
        products_used_today = int(products_today["total"]) if products_today else 0

        if products_used_today >= product_limit_per_day:
            raise HTTPException(
                status_code=402,
                detail={
                    "error":   "daily_product_limit_reached",
                    "used":    products_used_today,
                    "limit":   product_limit_per_day,
                    "message": f"Daily product limit of {product_limit_per_day} reached. Resets tomorrow.",
                }
            )

    # b) Monthly pool check
    usage_month = await conn.fetchrow("""
        SELECT COALESCE(SUM(usage_count), 0) AS total_used
        FROM core_auth_table.company_usage
        WHERE company_id = $1
          AND usage_date >= $2
          AND module_code NOT LIKE 'addon_%'
    """, company_id, start_date_only)
    total_used_month = int(usage_month["total_used"]) if usage_month else 0

    if total_used_month < monthly_limit:
        await _record_free_usage(conn, company_id, module_code, today, now)
        return {"type": "free", "company_id": company_id, "module_code": module_code, "date": today}

    # Monthly pool exhausted → try add-on
    return await _consume_addon(conn, company_id, module_code, today, now,
                                subscription_end, total_used_month, monthly_limit,
                                error_key="monthly_limit_reached",
                                message=f"Monthly query limit of {monthly_limit} reached. Purchase add-on credits to continue.")


async def _record_free_usage(conn, company_id: str, module_code: str, today, now):
    """Insert or increment a free usage row for today."""
    existing = await conn.fetchrow("""
        SELECT id FROM core_auth_table.company_usage
        WHERE company_id = $1 AND module_code = $2 AND usage_date = $3
    """, company_id, module_code, today)

    if existing is None:
        await conn.execute("""
            INSERT INTO core_auth_table.company_usage
            (id, company_id, module_code, usage_count, carry_forward, month, year, usage_date)
            VALUES ($1,$2,$3,1,0,$4,$5,$6)
        """, str(uuid.uuid4()), company_id, module_code, now.month, now.year, today)
    else:
        await conn.execute("""
            UPDATE core_auth_table.company_usage
            SET usage_count = usage_count + 1
            WHERE company_id = $1 AND module_code = $2 AND usage_date = $3
        """, company_id, module_code, today)


async def _consume_addon(conn, company_id, module_code, today, now,
                         subscription_end, used, limit, error_key, message):
    """Try to deduct 1 add-on credit; raise 402 if none available."""
    addon = await conn.fetchrow("""
        SELECT id, credits, credits_used
        FROM core_auth_table.company_addon_purchases
        WHERE company_id = $1
          AND payment_status = 'paid'
          AND credits > credits_used
          AND ($2::timestamptz IS NULL OR created_at <= $2::timestamptz)
        ORDER BY created_at ASC
        LIMIT 1
    """, company_id, subscription_end)

    if not addon:
        raise HTTPException(
            status_code=402,
            detail={
                "error":           error_key,
                "used":            used,
                "limit":           limit,
                "message":         message,
                "addon_available": False,
            }
        )

    await conn.execute("""
        UPDATE core_auth_table.company_addon_purchases
        SET credits_used = credits_used + 1
        WHERE id = $1
    """, addon["id"])

    addon_key = f"addon_{module_code}"
    try:
        existing = await conn.fetchrow("""
            SELECT id FROM core_auth_table.company_usage
            WHERE company_id = $1 AND module_code = $2 AND usage_date = $3
        """, company_id, addon_key, today)

        if existing is None:
            await conn.execute("""
                INSERT INTO core_auth_table.company_usage
                (id, company_id, module_code, usage_count, carry_forward, month, year, usage_date)
                VALUES ($1, $2, $3, 1, 0, $4, $5, $6)
            """, str(uuid.uuid4()), company_id, addon_key, now.month, now.year, today)
        else:
            await conn.execute("""
                UPDATE core_auth_table.company_usage
                SET usage_count = usage_count + 1
                WHERE id = $1
            """, existing["id"])
        print(f"✅ Addon usage tracked: {addon_key} | date: {today}")
    except Exception as e:
        print(f"⚠️ Addon usage tracking failed: {e}")

    return {
        "type":        "addon",
        "company_id":  company_id,
        "addon_id":    addon["id"],
        "module_code": addon_key,
        "date":        today,
    }


# =========================================================
# REVOKE USAGE — undo a query charge on technical failure
# =========================================================
async def revoke_usage(conn, token: dict):
    """
    Reverses a usage charge recorded by check_and_increment_usage.
    Call this when a module fails due to network/technical error (not limit).
    """
    if not token:
        return

    try:
        if token["type"] == "free":
            # Decrement free query counter; remove row if it reaches 0
            await conn.execute("""
                UPDATE core_auth_table.company_usage
                SET usage_count = GREATEST(usage_count - 1, 0)
                WHERE company_id = $1 AND module_code = $2 AND usage_date = $3
            """, token["company_id"], token["module_code"], token["date"])
            # Clean up zero-count rows
            await conn.execute("""
                DELETE FROM core_auth_table.company_usage
                WHERE company_id = $1 AND module_code = $2 AND usage_date = $3
                  AND usage_count = 0
            """, token["company_id"], token["module_code"], token["date"])
            print(f"↩️ Revoked free query: {token['module_code']} for {token['company_id']}")

        elif token["type"] == "addon":
            # Restore the addon credit
            await conn.execute("""
                UPDATE core_auth_table.company_addon_purchases
                SET credits_used = GREATEST(credits_used - 1, 0)
                WHERE id = $1
            """, token["addon_id"])
            # Decrement the addon usage tracking row
            await conn.execute("""
                UPDATE core_auth_table.company_usage
                SET usage_count = GREATEST(usage_count - 1, 0)
                WHERE company_id = $1 AND module_code = $2 AND usage_date = $3
            """, token["company_id"], token["module_code"], token["date"])
            await conn.execute("""
                DELETE FROM core_auth_table.company_usage
                WHERE company_id = $1 AND module_code = $2 AND usage_date = $3
                  AND usage_count = 0
            """, token["company_id"], token["module_code"], token["date"])
            print(f"↩️ Revoked addon credit: addon_id={token['addon_id']} for {token['company_id']}")

    except Exception as e:
        print(f"⚠️ revoke_usage failed: {e}")