# import asyncio
# import json
# from modules.market_demand import MarketDemandModule
# from services.module_data_service import fetch_module_inputs, build_module_inputs
# from db.database import get_db,get_pool
# import traceback

# sem=asyncio.Semaphore(5)

# async def run_market_intelligence(conn, company_id, user_id):

#     # =========================================================
#     # 🔄 0. UPDATE STATUS → PROCESSING
#     # =========================================================
#     await conn.execute("""
#         UPDATE product_info.product_master
#         SET status = 'market_processing',
#             updated_at = NOW()
#         WHERE company_id = $1
#         AND is_selected = TRUE
#     """, company_id)

#     # =========================================================
#     # 1️⃣ FETCH ONLY SELECTED PRODUCTS
#     # =========================================================
#     rows = await conn.fetch("""
#         SELECT 
#             pm.id as product_id,
#             pm.product_name,
#             pm.category,
#             pm.hs_code,
#             pm.description,
#             pm.moq,
#             pm.certifications,
#             co.name as company_name,
#             co.headquarters_country,
#             co.company_type,
#             cr.price_positioning,
#             cr.buyer_type
#         FROM product_info.product_master pm
#         JOIN core_tables.companies_other co
#             ON pm.company_id = co.id
#         LEFT JOIN product_info.company_preferences cr
#             ON cr.company_id = co.id
#         WHERE pm.company_id = $1
#         AND pm.is_selected = TRUE
#     """, company_id)

#     if not rows:
#         print("⚠️ No selected products found")
#         return

#     inputs = build_module_inputs(rows)
#     module = MarketDemandModule()

#     print(f"🚀 Running Market Intelligence for {len(inputs)} products")

#     # =========================================================
#     # 2️⃣ PROCESS PRODUCTS (PARALLEL + SAFE)
#     # =========================================================
#     async def process_product(inp):
#             try:
#                 print(f"\n🔬 Processing: {inp.product_name}")

#                 results = await module.run_all_countries(inp)

#                 return (inp.product_id, results)

#             except Exception:
#                 print(f"❌ Failed: {inp.product_name}")
#                 traceback.print_exc()   # 🔥 FULL ERROR TRACE
#                 return (inp.product_id, [])

#     outputs = await asyncio.gather(
#         *[process_product(inp) for inp in inputs],
#         return_exceptions=True
#     )

#     # =========================================================
#     # 3️⃣ STORE RESULTS (SAFE UNPACK FIX)
#     # =========================================================
#     total_rows = 0

#     for out in outputs:

#         # ✅ HANDLE GATHER EXCEPTIONS
#         if isinstance(out, Exception):
#             print(f"❌ Gather exception: {str(out)}")
#             continue

#         product_id, results = out

#         if not results:
#             continue

#         for res in results:
#             try:
#                 row = MarketDemandModule.to_db_row(res, product_id)

#                 await conn.execute("""
#                     INSERT INTO product_info.market_intelligence (
#                         id,
#                         product_id,
#                         country,
#                         country_and_score,
#                         demand_growth,
#                         import_volume,
#                         matched_buyers,
#                         peak_procurement,
#                         primary_channel,
#                         cert_require,
#                         cert_gap,
#                         analysis_note,
#                         created_at,
#                         created_by
#                     )
#                     VALUES (
#                         gen_random_uuid(),
#                         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
#                         NOW(),
#                         $12
#                     )
#                     ON CONFLICT (product_id, country)
#                     DO UPDATE SET
#                         demand_growth = EXCLUDED.demand_growth,
#                         import_volume = EXCLUDED.import_volume,
#                         matched_buyers = EXCLUDED.matched_buyers,
#                         peak_procurement = EXCLUDED.peak_procurement,
#                         primary_channel = EXCLUDED.primary_channel,
#                         cert_require = EXCLUDED.cert_require,
#                         cert_gap = EXCLUDED.cert_gap,
#                         analysis_note = EXCLUDED.analysis_note,
#                         updated_at = NOW()
#                 """,
#                     row["product_id"],
#                     row["country"],
#                     json.dumps(row["country_and_score"]),
#                     json.dumps(row["demand_growth"]),
#                     json.dumps(row["import_volume"]),
#                     json.dumps(row["matched_buyers"]),
#                     json.dumps(row["peak_procurement"]),
#                     json.dumps(row["primary_channel"]),
#                     json.dumps(row["cert_require"]),
#                     json.dumps(row["cert_gap"]),
#                     row["analysis_note"],
#                     user_id
#                 )

#                 total_rows += 1

#             except Exception:
#                 print(f"❌ DB insert failed for {product_id}")
#                 traceback.print_exc()

#     print(f"✅ Stored {total_rows} market intelligence rows")

#     # =========================================================
#     # ✅ 4. UPDATE STATUS → COMPLETED
#     # =========================================================
#     await conn.execute("""
#         UPDATE product_info.product_master
#         SET status = 'market_completed',
#             updated_at = NOW()
#         WHERE company_id = $1
#         AND is_selected = TRUE
#     """, company_id)

#     print("✅ Market Intelligence Completed")

#     # =========================================================
#     # 🚀 5. TRIGGER NEXT ENGINE
#     # =========================================================
#     asyncio.create_task(trigger_next_engine(company_id))


# async def trigger_next_engine(company_id):
#     await asyncio.sleep(5)  # delay

#     pool = get_pool()

#     async with pool.acquire() as conn:
#         await conn.execute("""
#             UPDATE product_info.product_master
#             SET status = 'next_engine_processing',
#                 updated_at = NOW()
#             WHERE company_id = $1
#             AND is_selected = TRUE
#         """, company_id)

#         print("🚀 Next Intelligence Started")

# async def trigger_market_intelligence(company_id, user_id, products):
#     pool = get_pool()

#     async with pool.acquire() as conn:
#         try:
#             await run_market_intelligence(
#                 conn=conn,
#                 company_id=company_id,
#                 user_id=user_id,
#             )
#         except Exception:
#             print("❌ Engine failed")
#             traceback.print_exc()

import asyncio
import traceback
from modules.base_module import ModuleInput
from module_runner import ModuleRunner
from services.module_data_service import build_module_inputs
from db.database import get_pool
from schemas.onbording_schema import IntelligenceRequest
import uuid
from services.intelligence_storage import *
from modules.trade_intel import TradeIntelModule

# Global semaphore: max 10 products processed concurrently across ALL users
_SEM = asyncio.Semaphore(10)

def _safe_dict(obj) -> dict:
    """Convert a dataclass/result object to dict, handling None."""
    if obj is None:
        return {}
    if hasattr(obj, "to_db_row"):
        return obj.to_db_row()
    if hasattr(obj, "__dict__"):
        return {k: v for k, v in obj.__dict__.items() if not k.startswith("_")}
    return {}


def _serialise_result(result, request: IntelligenceRequest) -> dict:
    """
    Builds the full response payload from RunnerResult.
    Each module section includes: success, error, data (all fields).
    """

    def _module_block(name: str, obj) -> dict:
        status = result.statuses.get(name)
        block = {
            "success": status.status == "done" if status else False,
            "elapsed_seconds": status.elapsed if status else None,
            "error":   status.error if status else None,
        }
        if obj is None:
            return block

        # Variants formats — has .variants list
        if name == "variants_formats" and hasattr(obj, "variants"):
            block["data"] = {
                "product_id": obj.product_id,
                "variants": [
                    {
                        "variant_name":      v.variant_name,
                        "tag":               v.tag,
                        "opportunity_score": v.opportunity_score,
                        "key_spec":          v.key_spec,
                        "price_range":       v.price_range,
                        "moq":               v.moq,
                        "buyer_demand":      v.buyer_demand,
                        "matched_buyers":    v.matched_buyers,
                        "lead_time":         v.lead_time,
                        "analysis_note":     v.analysis_note,
                    }
                    for v in obj.variants
                ],
            }
            return block

        # Buyer discovery — has .buyers list
        if name == "buyer_discovery":
            buyer_type = str(getattr(obj, "buyer_type", "") or "").upper().strip()
            block["buyer_type"] = buyer_type

            if buyer_type == "B2B":
                b2b = getattr(obj, "b2b", None)
                if b2b and b2b.success:
                    block["data"] = {
                        "b2b": {
                            "product_id":     b2b.product_id,
                            "target_country": b2b.target_country,
                            "is_fallback":    b2b.is_fallback(),
                            "buyers":         [b.to_dict() for b in b2b.buyers],
                        }
                    }

            elif buyer_type == "B2C":
                b2c = getattr(obj, "b2c", None)
                if b2c and b2c.success:
                    block["data"] = {
                        "b2c": {
                            "product_id":       b2c.product_id,
                            "target_country":   b2c.target_country,
                            "consumer_profile": b2c.consumer_profile.to_dict() if b2c.consumer_profile else {},
                        }
                    }

            elif buyer_type == "BOTH":
                b2b = getattr(obj, "b2b", None)
                b2c = getattr(obj, "b2c", None)
                block["data"] = {
                    "b2b": {
                        "product_id":     b2b.product_id,
                        "target_country": b2b.target_country,
                        "is_fallback":    b2b.is_fallback(),
                        "buyers":         [b.to_dict() for b in b2b.buyers],
                    } if b2b and b2b.success else None,
                    "b2c": {
                        "product_id":       b2c.product_id,
                        "target_country":   b2c.target_country,
                        "consumer_profile": b2c.consumer_profile.to_dict() if b2c.consumer_profile else {},
                    } if b2c and b2c.success else None,
                }

            return block

        # Competitor discovery — has .competitors list
        if name == "competitor_discovery" and hasattr(obj, "competitors"):
            block["data"] = {
                "product_id":   obj.product_id,
                "is_fallback":  obj.is_fallback(),
                "competitors":  [c.to_dict() for c in obj.competitors],
            }
            return block

        # Keyword intel — has 3 keyword lists
        if name == "keyword_intel" and hasattr(obj, "high_volume_buyer_intent"):
            def _kw(k):
                d = {"keyword": k.keyword, "search_volume": k.search_volume,
                     "competition": k.competition, "competition_index": getattr(k, "competition_index", None),
                     "gap": k.gap}
                if hasattr(k, "language"):
                    d["language"] = k.language
                return d
            block["data"] = {
                "product_id":               obj.product_id,
                "target_country":           obj.target_country,
                "high_volume_buyer_intent": [_kw(k) for k in obj.high_volume_buyer_intent],
                "low_competition_gaps":     [_kw(k) for k in obj.low_competition_gaps],
                "multilingual":             [_kw(k) for k in obj.multilingual],
            }
            return block

        # Email sequence — has .emails list
        if name == "email_sequence" and hasattr(obj, "emails"):
            block["data"] = {
                "product_id":     obj.product_id,
                "target_country": obj.target_country,
                "buyer_type":     obj.buyer_type,
                "sequence_note":  obj.sequence_note,
                "emails": [
                    {
                        "send_day":   e.send_day,
                        "type_label": e.type_label,
                        "goal":       e.goal,
                        "subject":    e.subject,
                        "body":       e.body,
                        "tiles":      e.tiles,
                    }
                    for e in obj.emails
                ],
            }
            return block

        # Ad concepts — has .concepts list
        if name == "ad_concepts" and hasattr(obj, "concepts"):
            block["data"] = {
                "product_id":     obj.product_id,
                "target_country": obj.target_country,
                "concepts": [
                    {
                        "market":       c.market,
                        "angle":        c.angle,
                        "hook":         c.hook,
                        "description":  c.description,
                        "tiles":        c.tiles,
                        "border_color": c.border_color,
                    }
                    for c in obj.concepts
                ],
            }
            return block

        # Market demand + trade intel — have .data dict
        if hasattr(obj, "data") and isinstance(obj.data, dict):
            block["data"] = obj.data
            return block

        # Fallback
        block["data"] = _safe_dict(obj)
        return block

    return {
        "run_id":       str(uuid.uuid4()),
        "product_id":   request.product_id,
        "product_name": request.product_name,
        "target_country": request.target_country,
        "summary":      result.summary(),
        "modules": {
            "market_demand":        _module_block("market_demand",        result.market_demand),
            "trade_intel":          _module_block("trade_intel",          result.trade_intel),
            "buyer_discovery":      _module_block("buyer_discovery",      result.buyer_discovery),
            "variants_formats":     _module_block("variants_formats",     result.variants_formats),
            "competitor_discovery": _module_block("competitor_discovery", result.competitor_discovery),
            "keyword_intel":        _module_block("keyword_intel",        result.keyword_intel),
            "email_sequence":       _module_block("email_sequence",       result.email_sequence),
            "ad_concepts":          _module_block("ad_concepts",          result.ad_concepts),
        },
    }

async def run_intelligence_for_company(conn, company_id: str, job_id: str):
    """
    Runs intelligence ONLY for products of current job
    and returns SERIALISED output
    """

    try:
        print(f"🚀 Running intelligence | company: {company_id} | job: {job_id}")

        # =========================================================
        # ✅ 1. FETCH INPUT DATA (FILTERED BY JOB)
        # =========================================================
        rows = await conn.fetch("""
        SELECT
                pm.id as product_id,
                pm.product_name,
                pm.category,
                pm.hs_code,
                pm.description,
                pm.moq,
                pm.certifications,
                pm.company_id,
                pm.created_by,
                co.name                  AS company_name,
                co.headquarters_country,
                co.company_type,
                ur.buyer_type,
                ur.price_positioning
            FROM product_info.product_master pm
            LEFT JOIN core_tables.companies_other co
                ON co.id = pm.company_id
            LEFT JOIN product_info.company_preferences cp
                ON cp.company_id = pm.company_id
            left join core_tables.user_research_preferences ur
                on ur.user_id = pm.created_by
            WHERE pm.company_id = $1
            AND pm.job_id = $2
        """, company_id, job_id)

        if not rows:
            print("❌ No products found for this job")
            return {
                "success": False,
                "message": "No products found for this job"
            }

        # Real user_id — all products in a job belong to the same user
        user_id = str(rows[0]["created_by"])
        print(f"✅ Found {len(rows)} products for job | user_id: {user_id}")

        user_id = str(rows[0]["created_by"])
        print(f"✅ Found {len(rows)} products for job | user_id: {user_id}")

        # ✅ debug — confirm what's in DB
        prefs = await conn.fetchrow("""
            SELECT user_id, buyer_type
            FROM core_tables.user_research_preferences
            WHERE user_id = $1
        """, user_id)

        print(f"🔍 prefs row: {dict(prefs) if prefs else None}")  # ← add this

        buyer_type = str(prefs["buyer_type"]).upper().strip() if prefs else "B2B"
        print(f"📋 buyer_type from preferences: '{buyer_type}'")

        # =========================================================
        # ✅ 2. BUILD INPUTS
        # =========================================================
        inputs = build_module_inputs(rows)

        # Status callback — writes current running engine to product_master
        # so the dashboard can show exactly which engine is active
        def _engine_status_cb(name, status, data):
            if status == "running":
                async def _write():
                    try:
                        _p = get_pool()
                        async with _p.acquire() as _c:
                            # Find product being processed by matching name in inputs
                            # We update all products in this run (they run concurrently)
                            for _inp in inputs:
                                await _c.execute("""
                                    UPDATE product_info.product_master
                                    SET current_engine = $1, updated_at = NOW()
                                    WHERE id = $2
                                """, name, _inp.product_id)
                    except Exception:
                        pass
                asyncio.create_task(_write())

        runner = ModuleRunner(status_callback=_engine_status_cb)

        # Serialises the usage check across concurrently running products in this
        # job so two products can't both read "0 used today" simultaneously and
        # both slip past the daily product cap.
        _usage_lock = asyncio.Lock()

        # =========================================================
        # 🚀 3. RUN PARALLEL
        # =========================================================
        async def run_single(inp):
            import traceback
            from utils.subscription_service import check_and_increment_usage, revoke_usage
            from fastapi import HTTPException as FastAPIHTTPException

            # =================================================
            # ✅ STEP 0: MARK PROCESSING + CHECK QUERY LIMIT
            # (usage check is serialised via _usage_lock so concurrent
            #  products don't both read stale counts)
            # =================================================

            # Reset status so dashboard correctly shows engines running
            try:
                _pool = get_pool()
                async with _pool.acquire() as _sc:
                    await _sc.execute("""
                        UPDATE product_info.product_master
                        SET status = 'intelligence_processing', updated_at = NOW()
                        WHERE id = $1
                    """, inp.product_id)
            except Exception as _se:
                print(f"⚠️ Could not set intelligence_processing for {inp.product_id}: {_se}")

            usage_token = None
            try:
                async with _usage_lock:  # serialise: read-then-write is atomic per job
                    _pool = get_pool()
                    async with _pool.acquire() as _usage_conn:
                        usage_token = await check_and_increment_usage(_usage_conn, company_id, "product_intelligence")
            except FastAPIHTTPException as limit_err:
                detail = limit_err.detail if isinstance(limit_err.detail, dict) else {}
                error_key = detail.get("error", "limit_reached")

                if error_key == "daily_product_limit_reached":
                    msg = detail.get("message", "Daily product limit reached. Resets tomorrow.")
                    print(f"🚫 {msg} | product: {inp.product_id}")
                elif error_key == "monthly_limit_reached":
                    msg = detail.get("message", "Monthly query limit reached. Purchase add-on credits to continue.")
                    print(f"🚫 {msg} | product: {inp.product_id}")
                else:
                    msg = detail.get("message", "Query limit reached. Resets tomorrow or purchase add-on credits.")
                    print(f"🚫 {msg} | product: {inp.product_id}")

                return {
                    "product_id": inp.product_id,
                    "success":    False,
                    "error":      error_key,
                    "message":    msg,
                }
            except Exception as usage_err:
                print(f"⚠️ Usage check error: {usage_err}")

            # =================================================
            # 🚀 STEP 1: RUN PIPELINE (semaphore limits global concurrency)
            # =================================================
            async with _SEM:
                try:
                    result = await asyncio.wait_for(
                        runner.run_all(inp),
                        timeout=300
                    )
                    print(f"✅ RUN SUCCESS for product {inp.product_id}")
                    if inp.hs_code:
                        try:
                            pool = get_pool()
                            async with pool.acquire() as _hc:
                                await _hc.execute("""
                                    UPDATE product_info.product_master
                                    SET hs_code    = $1,
                                        updated_at = NOW()
                                    WHERE id = $2
                                    AND (hs_code IS NULL OR hs_code = '')
                                """, inp.hs_code, inp.product_id)
                            print(f"✅ hs_code '{inp.hs_code}' saved for product {inp.product_id}")
                        except Exception as e:
                            print(f"⚠️  hs_code update failed for {inp.product_id}: {e}")
                except Exception as e:
                    print(f"❌ RUN FAILED for product {inp.product_id}: {str(e)}")
                    traceback.print_exc()
                    # Revoke the query charge — technical/network failure, not user's fault
                    if usage_token:
                        try:
                            _pool = get_pool()
                            async with _pool.acquire() as _rev_conn:
                                await revoke_usage(_rev_conn, usage_token)
                        except Exception as rev_err:
                            print(f"⚠️ revoke_usage failed: {rev_err}")
                    return {
                        "product_id": inp.product_id,
                        "success":    False,
                        "error":      "technical_error",
                        "message":    "Module failed due to a technical error. Your query has been refunded.",
                    }

            # =================================================
            # 🔍 DEBUG MODULE STATUS
            # =================================================
            print("📦 MODULE STATUS:")
            for mod in [
                "buyer_discovery", "market_demand", "trade_intel",
                "competitor_discovery", "variants_formats", "keyword_intel",
                "email_sequence", "ad_concepts", "price_analysis", "scoring"
            ]:
                obj = getattr(result, mod, None)
                print(f"{mod}: {'✅' if obj else '❌'}")

            # =================================================
            # 🛠️ DB SAVES — each product gets its OWN connection
            #    from the pool so concurrent products don't clash.
            #    Saves are sequential within one connection (asyncpg
            #    does not allow concurrent queries on the same conn).
            # =================================================
            pool = get_pool()
            async with pool.acquire() as pc:

                async def safe_insert(label, func):
                    try:
                        await func()
                        print(f"✅ {label} saved")
                    except Exception as e:
                        print(f"❌ {label} failed:", str(e))

                async def save_buyer():
                    obj = getattr(result, "buyer_discovery", None)
                    if not obj or not obj.success:
                        return

                    buyer_type = str(obj.buyer_type or "").upper().strip()
                    print(f"🔀 [save_buyer] routing → buyer_type='{buyer_type}'")

                    if buyer_type == "B2B":
                        if obj.b2b and obj.b2b.success:
                            await upsert_b2b_buyer_intelligence(pc, obj.b2b.to_db_row(), user_id)

                    elif buyer_type == "B2C":
                        if obj.b2c and obj.b2c.success:
                            await upsert_b2c_buyer_intelligence(pc, obj.b2c.to_db_row(), user_id)

                    elif buyer_type == "BOTH":
                        print(f"🔍 b2b: {obj.b2b} | success={getattr(obj.b2b, 'success', None)} | buyers={len(getattr(obj.b2b, 'buyers', []))}")
                        print(f"🔍 b2c: {obj.b2c} | success={getattr(obj.b2c, 'success', None)}")

                        if obj.b2b and obj.b2b.success:
                            await upsert_b2b_buyer_intelligence(pc, obj.b2b.to_db_row(), user_id)
                            print(f"✅ B2B saved")
                        else:
                            print(f"⚠️ B2B skipped — b2b={obj.b2b} | success={getattr(obj.b2b, 'success', None)}")

                        if obj.b2c and obj.b2c.success:
                            await upsert_b2c_buyer_intelligence(pc, obj.b2c.to_db_row(), user_id)
                            print(f"✅ B2C saved")
                        else:
                            print(f"⚠️ B2C skipped — b2c={obj.b2c} | success={getattr(obj.b2c, 'success', None)}")

                    else:
                        print(f"⚠️  [save_buyer] Unknown buyer_type='{buyer_type}' — skipping")

                async def save_trade():
                    obj = getattr(result, "trade_intel", None)
                    if obj and obj.success:
                        data = TradeIntelModule.to_db_row(obj, inp.product_id, inp)
                        await upsert_trade_intelligence(pc, data, user_id)

                async def save_competitor():
                    obj = getattr(result, "competitor_discovery", None)
                    if obj and obj.success:
                        await upsert_competitor_intelligence(pc, obj.to_db_row(), user_id)

                async def save_variants():
                    obj = getattr(result, "variants_formats", None)
                    if obj and obj.success:
                        await upsert_variants_formats(pc, obj.to_db_row(), user_id)

                async def save_market():
                    from modules.market_demand import MarketDemandModule
                    market_obj = getattr(result, "market_demand", None)
                    market_rows = []

                    if isinstance(market_obj, list):
                        market_rows = [
                            MarketDemandModule.to_db_row(r, inp.product_id, inp)
                            for r in market_obj if r.success
                        ]
                        # ✅ debug
                        for row in market_rows:
                            print(f"🔍 saving: country={row.get('country')} | country_and_score={row.get('country_and_score')}")

                    if market_rows:
                        await upsert_market_intelligence(
                            conn=pc,
                            product_id=inp.product_id,
                            rows=market_rows,
                            user_id=user_id
                        )

                async def save_marketing():
                    marketing_data = {
                        "product_id": inp.product_id,
                        "target_country": inp.target_country
                    }
                    kw = getattr(result, "keyword_intel", None)
                    if kw and kw.success:
                        marketing_data.update(kw.to_db_row())
                    email = getattr(result, "email_sequence", None)
                    if email and email.success:
                        ed = email.to_db_row()
                        emails = [ed.get(k) for k in ["email_1", "email_2", "email_3"] if ed.get(k)]
                        print(f"📧 EMAILS ({len(emails)}):")
                        for i, em in enumerate(emails, 1):
                            print(f"  Email {i} | Day {em.get('send_day')} | {em.get('type_label')} | Subject: {em.get('subject')}")
                        marketing_data["emails"] = emails
                        marketing_data["sequence_note"] = ed.get("sequence_note")
                        marketing_data["buyer_type"] = ed.get("buyer_type")
                    ads = getattr(result, "ad_concepts", None)
                    if ads and ads.success:
                        marketing_data["concepts"] = ads.to_db_row().get("concepts")
                    if any([
                        marketing_data.get("emails"),
                        marketing_data.get("concepts"),
                        marketing_data.get("high_volume_buyer_intent")
                    ]):
                        await upsert_marketing_intelligence(pc, marketing_data, user_id)

                async def save_price():
                    obj = getattr(result, "price_analysis", None)
                    if obj and obj.success:
                        await upsert_price_intelligence(pc, obj.to_db_row(), user_id)

                async def save_overall():
                    obj = getattr(result, "scoring", None)
                    if obj and obj.success:
                        await upsert_overall_intelligence(pc, obj.to_db_row(), user_id)

                # Sequential saves on the dedicated connection
                await safe_insert("buyer",      save_buyer)
                await safe_insert("trade",      save_trade)
                await safe_insert("competitor", save_competitor)
                await safe_insert("variants",   save_variants)
                await safe_insert("market",     save_market)
                await safe_insert("marketing",  save_marketing)
                await safe_insert("price",      save_price)
                await safe_insert("overall",    save_overall)

                # ✅ Mark product as intelligence completed
                try:
                    await pc.execute("""
                        UPDATE product_info.product_master
                        SET status = 'intelligence_completed',
                            updated_at = NOW()
                        WHERE id = $1
                    """, inp.product_id)
                    print(f"✅ status → intelligence_completed for {inp.product_id}")
                except Exception as e:
                    print(f"❌ Failed to mark intelligence_completed for {inp.product_id}: {e}")

            # =================================================
            # 📦 SERIALISE RESPONSE
            # =================================================
            fake_request = type("Req", (), {
                "product_id": inp.product_id,
                "product_name": inp.product_name,
                "target_country": inp.target_country
            })()

            serialised = _serialise_result(result, fake_request)

            return {
                "product_id": inp.product_id,
                "success": True,
                "data": serialised
            }

        results = await asyncio.gather(*[run_single(i) for i in inputs])

        print(f"✅ Intelligence completed for job: {job_id}")

        return {
            "success": True,
            "job_id": job_id,
            "total_products": len(inputs),
            "results": results
        }

    except Exception as e:
        traceback.print_exc()
        return {
            "success": False,
            "job_id": job_id,
            "message": str(e)
        }
    
async def run_intelligence_for_products(conn, products: list, company_meta: dict):
    runner = ModuleRunner()

    async def run_single(p):
        try:
            inp = ModuleInput(
                product_id=str(p["id"]),
                product_name=p["product_name"],
                category=p.get("category", ""),
                hs_code=p.get("hs_code", ""),
                description=p.get("description", ""),
                certifications=p.get("certifications") or [],
                origin_country=company_meta.get("country", "India"),
                target_country="United States",
                company_name=company_meta.get("company_name", ""),
                business_type=company_meta.get("business_type", ""),
                price_positioning="Standard",
                moq="",
                buyer_type="B2B",
            )

            result = await runner.run_all(inp)

            return {"product_id": p["id"], "success": True, "data": result}

        except Exception as e:
            return {"product_id": p["id"], "success": False, "error": str(e)}

    return await asyncio.gather(*[run_single(p) for p in products])

async def run_intelligence_background(company_id: str, job_id: str):
    pool = get_pool()  # returns the Pool object (sync)

    async with pool.acquire() as conn:
        try:
            await run_intelligence_for_company(conn, company_id, job_id)
        except Exception:
            traceback.print_exc()