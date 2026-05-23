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
        "price_intelligence":{"variants":1},
        "market_intelligence":{"market_info":1},
        "variants":{"variants_info":1},
        "trade_intelligence":{"top_exporters":1,"top_importers":1,"export_volume_trend":1},
        "competitor_intelligence":{"competitors":2}
    },
    "basic": {
        "buyers_intelligence": {"buyers": 6},
        "price_intelligence":{"variants":4},
        "market_intelligence":{"market_info":4},
        "trade_intelligence":{"top_exporters":3,"top_importers":3,"export_volume_trend":5},
        "variants":{"variants_info":4},
        "competitor_intelligence":{"competitors":6}
        
    },
    # pro: no limits — all data shown
}

MASK_PLACEHOLDER = {"masked": True, "message": "Upgrade your plan to see more"}

MODULE_LOCK_MESSAGE = "Upgrade your plan to unlock this intelligence"

# When a module is not included in a plan, return this structure instead of a
# flat {"masked": True} so the frontend can still access the expected keys.
MODULE_LOCKED_STRUCTURE = {
    "competitor_intelligence": {
        "competitors": [{"masked": True, "message": MODULE_LOCK_MESSAGE}],
    },
    "trade_intelligence": {
        "trade_info": {"masked": True, "message": MODULE_LOCK_MESSAGE},
    },
    "marketing_intelligence": {
        "marketing_info": {"masked": True, "message": MODULE_LOCK_MESSAGE},
    },
}

# Fields to hide (replace with FIELD_MASK_PLACEHOLDER) inside each item of a list.
# Structure: { plan: { module_key: { list_field: [fields_to_mask] } } }
PLAN_MODULE_FIELD_MASKS = {
    "trial": {
        "variants": {
            "variants_info": ["moq", "price_range"],
        },
    },
    # "basic": {
    #     "variants": {
    #         "variants_info": ["moq", "price_range"],
    #     },
    # },
    # pro: no field masks
}

FIELD_MASK_PLACEHOLDER = "Upgrade to unlock"

# For buyers_intelligence b2c: which top-level b2c fields to show per plan.
# Fields not listed are replaced with FIELD_MASK_PLACEHOLDER.
# None entry = show all (pro / basic).
PLAN_B2C_VISIBLE_FIELDS = {
    "trial": ["consumer_profile"],   # only consumer_profile shown; rest masked
    # basic / pro: no restriction
}

# Within consumer_profile, which keys to keep for each plan.
PLAN_B2C_CONSUMER_PROFILE_KEYS = {
    "trial": ["consumer_segment"],   # only consumer_segment; rest masked
}

PLAN_CONFIG = {

    "trial": {
        "modules": [
            "product",
            "overview",
            "variants",
            "price_intelligence",
            "buyers_intelligence",
            "market_intelligence",
            "competitor_intelligence",
            "marketing_intelligence",
            "trade_intelligence"
        ],
        "daily_query_limit": 5,
        "limit_type": "total",   # no daily reset — once used up, must upgrade
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
            "competitor_intelligence",
            "marketing_intelligence"
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

    # Single query: skip if active plan exists, pull trial plan_id, insert — all at once
    await conn.execute("""
        INSERT INTO core_auth_table.company_subscriptions
        (subscription_id, company_id, plan_id, billing_cycle, status, start_date, end_date, source, created_at)
        SELECT
            $1, $2, sp.plan_id, NULL, 'active',
            NOW(),
            CASE WHEN $3::int IS NOT NULL THEN NOW() + ($3 * INTERVAL '1 day') ELSE NULL END,
            'auto_trial', NOW()
        FROM core_auth_table.subscription_plans sp
        WHERE sp.plan_name = 'trial' AND sp.status = 'active'
          AND NOT EXISTS (
              SELECT 1 FROM core_auth_table.company_subscriptions
              WHERE company_id = $2 AND status = 'active'
          )
        LIMIT 1
    """,
        str(uuid.uuid4()),
        company_id,
        trial_days,
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
        # ── buyers_intelligence: buyers live at b2b.buyers (2 levels deep) ──
        if module_key == "buyers_intelligence":
            max_buyers = limits.get("buyers", -1)
            if max_buyers != -1:
                b2b = result.get("b2b")
                if isinstance(b2b, dict) and isinstance(b2b.get("buyers"), list):
                    b2b_copy = dict(b2b)
                    b2b_copy["buyers"] = _apply_list_mask(b2b_copy["buyers"], max_buyers)
                    result["b2b"] = b2b_copy
        else:
            for field, max_visible in limits.items():
                # Top-level list field
                if field in result:
                    if isinstance(result[field], list):
                        result[field] = _apply_list_mask(result[field], max_visible)
                    continue
                # Nested inside a top-level dict value (e.g. trade_info → top_exporters)
                for top_key, top_value in list(result.items()):
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

    # ── b2c field masking (plan-level restriction on b2c fields) ─────────────
    if module_key == "buyers_intelligence":
        visible_b2c = PLAN_B2C_VISIBLE_FIELDS.get(plan_name)
        if visible_b2c is not None:   # None means no restriction for this plan
            b2c = result.get("b2c")
            if isinstance(b2c, dict):
                b2c_copy = {}
                for field, value in b2c.items():
                    if field not in visible_b2c:
                        b2c_copy[field] = FIELD_MASK_PLACEHOLDER
                    elif field == "consumer_profile":
                        allowed_keys = PLAN_B2C_CONSUMER_PROFILE_KEYS.get(plan_name)
                        if allowed_keys is not None and isinstance(value, dict):
                            masked_profile = {
                                k: (v if k in allowed_keys else FIELD_MASK_PLACEHOLDER)
                                for k, v in value.items()
                            }
                            b2c_copy[field] = masked_profile
                        else:
                            b2c_copy[field] = value
                    else:
                        b2c_copy[field] = value
                result["b2c"] = b2c_copy

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

    return result


# Fields that are always returned as-is, regardless of plan.
ALWAYS_VISIBLE_KEYS = {"urgent_note", "actions"}


# =========================================================
# APPLY PLAN VISIBILITY (filter intelligence response)
# =========================================================
def apply_plan_visibility(response_data: dict, plan_name: str) -> dict:
    plan_config     = PLAN_CONFIG.get(plan_name or "", {})
    allowed_modules = plan_config.get("modules", [])

    if allowed_modules == "all":
        # pro/enterprise: still apply data masking if configured
        return {
            key: (value if key in ALWAYS_VISIBLE_KEYS else _mask_module_data(key, value, plan_name))
            for key, value in response_data.items()
        }

    filtered = {}
    for key, value in response_data.items():
        if key in ALWAYS_VISIBLE_KEYS:
            filtered[key] = value
        elif key in allowed_modules:
            filtered[key] = _mask_module_data(key, value, plan_name)
        else:
            # Use module-specific locked structure so the frontend still gets
            # the expected keys (e.g. competitors: [{masked: true}] instead of
            # a flat masked object at the module level).
            filtered[key] = MODULE_LOCKED_STRUCTURE.get(key) or {
                "masked": True,
                "message": MODULE_LOCK_MESSAGE,
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
            item["masked"] = False
            result.append(item)
        else:
            result.append({
                "product_id":   product.get("product_id"),
                "product_name": product.get("product_name"),
                "masked":       True,
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
# ENSURE ACTIVE SUBSCRIPTION (merged expiry-check + trial-assign)
# Replaces calling check_and_handle_subscription_expiry then
# assign_trial_plan_if_needed separately in login — saves 1 DB round-trip
# on the happy path (active, non-expired subscription).
# =========================================================
async def ensure_active_subscription(conn, company_id: str):
    """
    Single entry point for login:
      1. Fetch the active subscription (1 query).
      2. If expired → mark expired, then fall through to trial assignment.
      3. If no active sub (or just expired) → assign trial via assign_trial_plan_if_needed.
      4. If active and not expired → return immediately (1 query total).
    """
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

    if sub:
        end_date = sub["end_date"]
        if not end_date or end_date >= _utcnow():
            return  # active and not expired — done in 1 query

        # Expire it
        await conn.execute("""
            UPDATE core_auth_table.company_subscriptions
            SET status = 'expired', updated_at = NOW()
            WHERE subscription_id = $1
        """, str(sub["subscription_id"]))

    # Assign trial if still no active sub (handles: never had one + just-expired).
    # assign_trial_plan_if_needed checks for another active sub internally,
    # so it's safe even if they bought a new plan after the expired one.
    await assign_trial_plan_if_needed(conn, company_id)


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
async def check_and_increment_usage(conn, company_id: str, module_code: str, count: int = 1):
    now   = datetime.now(timezone.utc)
    today = now.date()

    # 1. Active subscription + plan details
    subscription = await conn.fetchrow("""
        SELECT sp.plan_name, sp.query_limit, cs.end_date, cs.start_date, cs.billing_cycle
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
    billing_cycle    = subscription["billing_cycle"] or "monthly"

    # unlimited plans (query_limit = -1 or None) → skip all checks
    if query_limit is None or query_limit == -1:
        return

    plan_cfg   = PLAN_CONFIG.get(plan_name, {})
    limit_type = plan_cfg.get("limit_type", "daily")   # "daily" for trial, "monthly" for basic/pro

    # ── TRIAL: total (lifetime) limit — no daily reset ───────────────────────
    if limit_type == "total":
        start_date_only = start_date.date() if hasattr(start_date, "date") else start_date
        usage = await conn.fetchrow("""
            SELECT COALESCE(SUM(usage_count), 0) AS total_used
            FROM core_auth_table.company_usage
            WHERE company_id = $1
              AND usage_date >= $2
              AND module_code NOT LIKE 'addon_%'
        """, company_id, start_date_only)
        total_used = int(usage["total_used"]) if usage else 0

        if total_used < query_limit:
            await _record_free_usage(conn, company_id, module_code, today, now, count=count)
            return {"type": "free", "company_id": company_id, "module_code": module_code, "date": today}

        # Lifetime limit hit → try add-on, else prompt upgrade
        return await _consume_addon(conn, company_id, module_code, today, now,
                                    subscription_end, total_used, query_limit,
                                    error_key="query_limit_reached",
                                    message=f"Your trial limit of {query_limit} queries has been used. Upgrade to a paid plan to continue.")

    # ── TRIAL (legacy daily): daily reset logic ───────────────────────────────
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
            await _record_free_usage(conn, company_id, module_code, today, now, count=count)
            return {"type": "free", "company_id": company_id, "module_code": module_code, "date": today}

        # Daily limit hit → try add-on
        return await _consume_addon(conn, company_id, module_code, today, now,
                                    subscription_end, total_used_today, query_limit,
                                    error_key="daily_limit_reached",
                                    message=f"Daily limit of {query_limit} queries reached. Resets tomorrow or purchase add-on credits.")

    # ── BASIC / PRO: subscription pool — query_limit is the total for the period
    # monthly: total = query_limit  |  yearly: total = query_limit * 12
    start_date_only = start_date.date() if hasattr(start_date, "date") else start_date
    monthly_limit   = query_limit * 12 if billing_cycle == "yearly" else query_limit

    # Pool check — count all usage since subscription start
    usage_month = await conn.fetchrow("""
        SELECT COALESCE(SUM(usage_count), 0) AS total_used
        FROM core_auth_table.company_usage
        WHERE company_id = $1
          AND usage_date >= $2
          AND module_code NOT LIKE 'addon_%'
    """, company_id, start_date_only)
    total_used_month = int(usage_month["total_used"]) if usage_month else 0

    if total_used_month < monthly_limit:
        await _record_free_usage(conn, company_id, module_code, today, now, count=count)
        return {"type": "free", "company_id": company_id, "module_code": module_code, "date": today}

    # Monthly pool exhausted → try add-on
    return await _consume_addon(conn, company_id, module_code, today, now,
                                subscription_end, total_used_month, monthly_limit,
                                error_key="monthly_limit_reached",
                                message=f"Monthly query limit of {monthly_limit} reached. Purchase add-on credits to continue.")


async def _record_free_usage(conn, company_id: str, module_code: str, today, now, count: int = 1):
    """Insert or increment a free usage row for today (single UPSERT).
    Requires: UNIQUE INDEX on (company_id, module_code, usage_date).
    """
    await conn.execute("""
        INSERT INTO core_auth_table.company_usage
            (id, company_id, module_code, usage_count, carry_forward, month, year, usage_date)
        VALUES ($1, $2, $3, $4, 0, $5, $6, $7)
        ON CONFLICT (company_id, module_code, usage_date)
        DO UPDATE SET usage_count = core_auth_table.company_usage.usage_count + EXCLUDED.usage_count
    """, str(uuid.uuid4()), company_id, module_code, count, now.month, now.year, today)


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


# ─────────────────────────────────────────────────────────────────────────────
#  COUPON HELPERS
# ─────────────────────────────────────────────────────────────────────────────

async def validate_coupon(conn, code: str, plan_name: str, original_amount: float) -> dict:
    """
    Validate a coupon code and return discount details.
    Raises HTTPException on any validation failure.
    Returns dict with: coupon_id, discount_type, discount_value, discount_amount, final_amount
    """
    now = datetime.now(timezone.utc)

    row = await conn.fetchrow("""
        SELECT id, code, discount_type, discount_value,
               max_uses, used_count, min_order_amount,
               valid_from, valid_until, applicable_plans, is_active
        FROM core_auth_table.coupon_codes
        WHERE UPPER(code) = UPPER($1)
    """, code)

    if not row:
        raise HTTPException(status_code=404, detail={"success": False, "error": "Invalid coupon code"})

    if not row["is_active"]:
        raise HTTPException(status_code=400, detail={"success": False, "error": "This coupon is no longer active"})

    if row["max_uses"] != -1 and row["used_count"] >= row["max_uses"]:
        raise HTTPException(status_code=400, detail={"success": False, "error": "This coupon has reached its usage limit"})

    if row["valid_from"] and now < row["valid_from"]:
        raise HTTPException(status_code=400, detail={"success": False, "error": "This coupon is not yet valid"})

    if row["valid_until"] and now > row["valid_until"]:
        raise HTTPException(status_code=400, detail={"success": False, "error": "This coupon has expired"})

    if row["applicable_plans"] and plan_name.lower() not in [p.lower() for p in row["applicable_plans"]]:
        raise HTTPException(status_code=400, detail={"success": False, "error": f"This coupon is not valid for the {plan_name} plan"})

    if original_amount < float(row["min_order_amount"]):
        raise HTTPException(status_code=400, detail={
            "success": False,
            "error": f"Minimum order amount of ₹{row['min_order_amount']} required for this coupon"
        })

    # Calculate discount
    if row["discount_type"] == "percentage":
        discount_amount = round(original_amount * float(row["discount_value"]) / 100, 2)
    else:  # flat
        discount_amount = min(float(row["discount_value"]), original_amount)

    final_amount = max(round(original_amount - discount_amount, 2), 0)

    return {
        "coupon_id":      str(row["id"]),
        "code":           row["code"],
        "discount_type":  row["discount_type"],
        "discount_value": float(row["discount_value"]),
        "discount_amount": discount_amount,
        "final_amount":   final_amount,
    }


async def increment_coupon_usage(conn, coupon_id: str):
    """Atomically increment used_count. Call only after Razorpay order is created."""
    await conn.execute("""
        UPDATE core_auth_table.coupon_codes
        SET used_count = used_count + 1, updated_at = NOW()
        WHERE id = $1
    """, coupon_id)