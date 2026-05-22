from typing import Dict, Any
import json
import traceback
import time
from datetime import datetime, timezone
from fastapi import HTTPException
import pandas as pd

# Simple in-memory cache: product intelligence rarely changes after pipeline runs
_cache: dict = {}
_CACHE_TTL = 300  # 5 minutes

def _cache_get(key: str):
    entry = _cache.get(key)
    if entry and (time.monotonic() - entry["ts"]) < _CACHE_TTL:
        return entry["val"]
    return None

def _cache_set(key: str, val):
    _cache[key] = {"val": val, "ts": time.monotonic()}

def invalidate_product_cache(product_id: str):
    _cache.pop(f"pi:{product_id}", None)

def _confidence_label(score) -> str:
    if score is None:
        return "Unknown"
    if score >= 71:
        return "High confidence"
    if score >= 31 and score <= 70:
        return "Medium confidence"
    if score <=30:
        return "Low confidence"

def _parse(val):
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return val
    return json.loads(val)

async def extract_user_data(conn, user_id: str) -> dict:
    """Fetch all data for a user across all tables."""

    # ── User profile ──────────────────────────────
    user = await conn.fetchrow("""
        SELECT u.user_id, u.email, u.full_name, u.phone,
               u.status, u.created_at,
               c.name AS company_name, c.headquarters_country,
               c.company_type, c.industry
        FROM core_auth_table.auth_user u
        LEFT JOIN core_tables.companies_other c
            ON c.id = u.companies_other_id
        WHERE u.user_id = $1
    """, user_id)

    # ── Products ──────────────────────────────────
    products = await conn.fetch("""
        SELECT product_name, hs_code, category,
               description, status, created_at
        FROM product_info.product_master
        WHERE created_by = $1
        ORDER BY created_at DESC
    """, user_id)

    # ── Market intelligence ───────────────────────
    market = await conn.fetch("""
        SELECT mi.country, mi.analysis_note, mi.created_at
        FROM product_info.market_intelligence mi
        JOIN product_info.product_master pm ON pm.id = mi.product_id
        WHERE pm.created_by = $1
    """, user_id)

    # ── Buyers ────────────────────────────────────
    b2b = await conn.fetch("""
        SELECT bi.buyers, bi.target_country
        FROM product_info.b2b_buyer_intelligence bi
        JOIN product_info.product_master pm ON pm.id = bi.product_id
        WHERE pm.created_by = $1
    """, user_id)

    # ── Pipeline jobs ─────────────────────────────
    jobs = await conn.fetch("""
        SELECT id, website_url, status, created_at
        FROM core_tables.pipeline_jobs
        WHERE user_id = $1
        ORDER BY created_at DESC
    """, user_id)

    return {
        "exported_at": datetime.utcnow().strftime('%d %b %Y %H:%M UTC'),
        "profile": dict(user) if user else {},
        "products": [dict(p) for p in products],
        "market_intelligence": [dict(m) for m in market],
        "b2b_buyers": [dict(b) for b in b2b],
        "pipeline_jobs": [dict(j) for j in jobs],
    }

async def get_reports(conn, user_id: str):

    try:
        rows = await conn.fetch("""
            SELECT
                pm.id                   AS product_id,
                pm.product_name,
                pm.updated_at           AS last_analyzed_at,

                -- overall
                ois.overall_score,
                ois.urgent_note         AS summary_note,

                -- market (target countries + report type label)
                mi.country              AS target_country,
                mi.primary_channel      AS report_type,

                -- keywords count
                mki.high_volume_buyer_intent AS keywords_json,

                -- buyers count
                bi.buyers_count,

                -- buyer segments count
                bi.buyers               AS buyers_json

            FROM product_info.product_master pm

            LEFT JOIN product_info.overall_intelligence_scores ois
                ON ois.product_id = pm.id

            LEFT JOIN LATERAL (
                SELECT country, primary_channel
                FROM product_info.market_intelligence
                WHERE product_id = pm.id
                  AND country IS NOT NULL
                ORDER BY created_at ASC
                LIMIT 1
            ) mi ON TRUE

            LEFT JOIN product_info.marketing_intelligence mki
                ON mki.product_id = pm.id

            LEFT JOIN product_info.buyer_intelligence bi
                ON bi.product_id = pm.id

            WHERE pm.created_by = $1
            ORDER BY pm.updated_at DESC
        """, user_id)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": "Failed to fetch reports",
            "detail": str(e),
            "code": "DB_FETCH_ERROR",
        })

    try:
        reports = []

        for row in rows:
            # keyword count
            keywords     = _parse(row["keywords_json"]) or []
            keyword_count = len(keywords) if isinstance(keywords, list) else 0

            # buyer segment count — unique buyer types inside buyers JSON
            buyers_raw = _parse(row["buyers_json"]) or []
            segments   = set(
                b.get("type") for b in buyers_raw
                if isinstance(b, dict) and b.get("type")
            )

            score = row["overall_score"]
            report_type_raw = _parse(row["report_type"]) if row["report_type"] else None
            report_type = (
                report_type_raw.get("channel")
                if isinstance(report_type_raw, dict)
                else row["report_type"]
            ) or "Market Demand + Keywords"
            reports.append({
                "product_id":     row["product_id"],
                "title":          f"{row['product_name']} — {row['target_country']} Market Intelligence"
                                  if row["target_country"]
                                  else f"{row['product_name']} — Market Intelligence",
                #"product_name":   row["product_name"],
                "target_country": row["target_country"],
                "report_type":    report_type,
                "status":         "complete",
                "last_analyzed_at": row["last_analyzed_at"].isoformat()
                                    if row["last_analyzed_at"] else None,

                # stat badges
                "score":          score,
                "keyword_count":  keyword_count,
                "buyers_count":   row["buyers_count"] or len(buyers_raw),
                "segment_count":  len(segments),

                # summary line  e.g. "Demand up 18% YoY · Strong Q2 opportunity..."
                "summary_note":   row["summary_note"],
            })

        return {
            "success":          True,
            "total_reports":    len(reports),
            "reports":          reports,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": "Failed to build reports list",
            "detail": str(e),
            "code": "BUILD_ERROR",
        })

async def fetch_product_intelligence(conn, product_id: str, user_id: str) -> Dict[str, Any]:

    cached = _cache_get(f"pi:{product_id}:{user_id}")
    if cached is not None:
        print(f"[PI] cache hit — {product_id[:8]}")
        return cached

    t0 = time.monotonic()

    try:
        # Single round-trip: all tables fetched in one CTE query
        row = await conn.fetchrow("""
            WITH prod AS (
                SELECT u.user_id, pm.product_name, pm.hs_code,
                       co.name AS company_name, co.headquarters_country,
                       ur.buyer_type, ur.price_positioning,
                       ur.monthly_supply_capacity, ur.certifications, ur.target_country
                FROM product_info.product_master pm
                JOIN core_tables.companies_other co ON co.id = pm.company_id
                JOIN core_auth_table.auth_user u ON u.companies_other_id = co.id
                JOIN core_tables.user_research_preferences ur ON ur.user_id = u.user_id
                WHERE pm.id = $1 AND pm.created_by = $2
                LIMIT 1
            )
            SELECT
                (SELECT row_to_json(p) FROM prod p LIMIT 1)                                        AS product,
                (SELECT jsonb_agg(row_to_json(m))
                    FROM product_info.market_intelligence m
                    WHERE m.product_id = $1 AND m.country IS NOT NULL)                            AS market,
                (SELECT row_to_json(b) FROM product_info.b2b_buyer_intelligence b
                    WHERE b.product_id = $1 LIMIT 1)                                              AS b2b_buyers,
                (SELECT row_to_json(c) FROM product_info.b2c_buyer_intelligence c
                    WHERE c.product_id = $1 LIMIT 1)                                              AS b2c_buyers,
                (SELECT row_to_json(t) FROM product_info.trade_intelligence t
                    WHERE t.product_id = $1 LIMIT 1)                                              AS trade,
                (SELECT row_to_json(co) FROM product_info.competitor_intelligence co
                    WHERE co.product_id = $1 LIMIT 1)                                             AS competitor,
                (SELECT row_to_json(mk) FROM product_info.marketing_intelligence mk
                    WHERE mk.product_id = $1 LIMIT 1)                                             AS marketing,
                (SELECT COALESCE(SUM(
                        CASE WHEN mk.high_volume_buyer_intent IS NOT NULL AND jsonb_typeof(mk.high_volume_buyer_intent) = 'array'
                             THEN jsonb_array_length(mk.high_volume_buyer_intent) ELSE 0 END
                      + CASE WHEN mk.low_competition_gaps IS NOT NULL AND jsonb_typeof(mk.low_competition_gaps) = 'array'
                             THEN jsonb_array_length(mk.low_competition_gaps) ELSE 0 END
                      + CASE WHEN mk.multilingual IS NOT NULL AND jsonb_typeof(mk.multilingual) = 'array'
                             THEN jsonb_array_length(mk.multilingual) ELSE 0 END
                    ), 0)
                    FROM product_info.marketing_intelligence mk
                    WHERE mk.product_id = $1)                                                     AS keywords_total,
                (SELECT jsonb_agg(row_to_json(pr))
                    FROM product_info.price_intelligence pr
                    WHERE pr.product_id = $1)                                                     AS price,
                (SELECT row_to_json(ov) FROM product_info.overall_intelligence_scores ov
                    WHERE ov.product_id = $1 LIMIT 1)                                             AS overall,
                (SELECT row_to_json(v) FROM product_info.variants_formats v
                    WHERE v.product_id = $1 LIMIT 1)                                              AS variants
        """, product_id, user_id)

        if not row or not row["product"]:
            return {"success": False, "error": "Product not found", "code": "PRODUCT_NOT_FOUND"}

        # Unpack CTE result — each column is already JSON from PostgreSQL
        # row_to_json / jsonb_agg results may come back as JSON strings — parse all
        product    = _parse(row["product"])
        market     = [_parse(m) for m in (_parse(row["market"]) or [])]
        b2b_buyers = _parse(row["b2b_buyers"])
        b2c_buyers = _parse(row["b2c_buyers"])
        trade      = _parse(row["trade"])
        competitor = _parse(row["competitor"])
        marketing = _parse(row["marketing"])
        keywords  = int(row["keywords_total"] or 0)
        price     = [_parse(p) for p in (_parse(row["price"]) or [])]
        overall    = _parse(row["overall"])
        variants   = _parse(row["variants"])

    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": "Failed to fetch intelligence data", "detail": str(e), "code": "DB_FETCH_ERROR"}

    # =====================================================
    # 🔧 TRANSFORM DATA
    # =====================================================
    try:
        price_data = []
        for p in price:
            top_metrics   = _parse(p.get("top_metrics"))   or {}
            variant_table = _parse(p.get("variant_table")) or []
            price_data.append({
                **top_metrics,
                "variants": variant_table,
            })

        market_data = []
        for m in market:
            market_data.append({
                "country":          m.get("country"),
                "demand_growth":    _parse(m.get("demand_growth")),
                "import_volume":    _parse(m.get("import_volume")),
                "matched_buyers":   _parse(m.get("matched_buyers")),
                "peak_procurement": _parse(m.get("peak_procurement")),
                "primary_channel":  _parse(m.get("primary_channel")),
                "cert_require":     _parse(m.get("cert_require")),
                "country_and_score":_parse(m.get("country_and_score")),
                "analysis_note":    m.get("analysis_note"),
            })

        marketing_data = None
        if marketing:
            marketing_data = {
                "high_volume_buyer_intent": _parse(marketing.get("high_volume_buyer_intent")),
                "low_competition_gaps":     _parse(marketing.get("low_competition_gaps")),
                "multilingual":             _parse(marketing.get("multilingual")),
                "emails":                   _parse(marketing.get("emails")),
                "sequence_note":            marketing.get("sequence_note"),
                "buyer_type":               marketing.get("buyer_type"),
                "target_country":           marketing.get("target_country"),
                "ad_concepts":              _parse(marketing.get("ad_concepts")),
                "product_name":             product.get("product_name"),
            }
        trade_data = None
        if trade:
            export_volume_trend = _parse(trade.get("export_volume_trend")) or []
            years = [r["year"] for r in export_volume_trend if isinstance(r, dict) and r.get("year")]
            trend_period = f"{min(years)}-{max(years)}" if years else None
            trade_data = {
                "product_name":           product.get("product_name"),
                "trend_period":           trend_period,
                "global_trade_value":     _parse(trade.get("global_trade_value")),
                "volume_traded_globally": _parse(trade.get("volume_traded_globally")),
                "avg_global_trade_price": _parse(trade.get("avg_global_trade_price")),
                "country_export_share":   _parse(trade.get("country_export_share")),
                "top_exporters":          _parse(trade.get("top_exporters")),
                "top_importers":          _parse(trade.get("top_importers")),
                "export_volume_trend":    _parse(trade.get("export_volume_trend")),
                "export_pricing_commod":  _parse(trade.get("export_pricing_commod")),
                "analysis_note":          trade.get("analysis_note"),
                "hs_code":                trade.get("hs_code"),
                "origin_country":         trade.get("origin_country"),
            }

        variants_data = _parse(variants.get("variants")) if variants and variants.get("variants") else []

        # replace old buyers_data block with this
        buyers_data = {
    # ✅ derive from what actually exists, not from preferences
                "buyer_type": (
                    "BOTH" if b2b_buyers and b2c_buyers else
                    "B2B"  if b2b_buyers else
                    "B2C"  if b2c_buyers else
                    None
                ),

                "b2b": {
                    "buyers":      _parse(b2b_buyers.get("buyers"))      if b2b_buyers else [],
                    "is_fallback": b2b_buyers.get("is_fallback")         if b2b_buyers else None,
                } if b2b_buyers else None,

                "b2c": {
                    "consumer_profile":  _parse(b2c_buyers.get("consumer_profile"))  if b2c_buyers else {},
                    "purchase_channels": _parse(b2c_buyers.get("purchase_channels")) if b2c_buyers else {},
                    "label_preferences": _parse(b2c_buyers.get("label_preferences")) if b2c_buyers else {},
                    "leading_brands":    _parse(b2c_buyers.get("leading_brands"))    if b2c_buyers else [],
                    "market_gap":        b2c_buyers.get("market_gap")                if b2c_buyers else None,
                } if b2c_buyers else None,
            }
        competitor_data = {
            "competitors": _parse(competitor.get("competitors")) if competitor and competitor.get("competitors") else [],
        }
        scores         = _parse(overall.get("scores"))   if overall and overall.get("scores") else []
        easy_win_count = sum(
            1 for m in market
            if m.get("country_and_score") and
            _parse(m.get("country_and_score")) and
            _parse(m.get("country_and_score")).get("tier") == "Easy Win"
        )
        b2b_count    = b2b_buyers.get("buyers_count") or 0 if b2b_buyers else 0
        b2c_count    = len(_parse(b2c_buyers.get("leading_brands")) or []) if b2c_buyers else 0
        total_buyers = b2b_count + b2c_count
        raw_certs    = _parse(product.get("certifications")) or {}
        if isinstance(raw_certs, dict):
            certifications = [
                cert
                for certs in raw_certs.values()
                for cert in (certs if isinstance(certs, list) else [])
            ]
        elif isinstance(raw_certs, list):
            certifications = raw_certs
        else:
            certifications = []
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": "Failed to parse intelligence data", "detail": str(e), "code": "PARSE_ERROR"}

    # =====================================================
    # 🔥 BUILD RESPONSE
    # =====================================================
    try:
        response = {
            "success": True,
            "product": {
                "name":                    product.get("product_name"),
                "hs_code":                 product.get("hs_code"),
                "target_country":          _parse(product.get("target_country")) or [],
                "headquarters_country":    product.get("headquarters_country"),
                "buyer_type":              product.get("buyer_type"),
                "total_buyers":            total_buyers,
                "price_positioning":       _parse(product.get("price_positioning")) or [],
                "monthly_supply_capacity": product.get("monthly_supply_capacity"),
                "certifications":          certifications,
                "market_country":          [m.get("country") for m in market[:4]],
                "score":                   overall.get("overall_score") if overall else None,
                "easy_win":                easy_win_count,
                "keywords":                keywords,
                "market_range":            price_data[0].get("market_range") if price_data else None,
                "global_trade":            trade_data["global_trade_value"].get("yoy_growth")
                                           if trade_data and trade_data.get("global_trade_value") else None,
            },
            "overview":                scores,
            "urgent_note":             overall.get("urgent_note")    if overall else None,
            "actions":                 _parse(overall.get("action_cards")) if overall and overall.get("action_cards") else [],
            "variants":                {"variants_info": variants_data},
            "market_intelligence":     {"market_info": market_data},
            "price_intelligence":      {"price_info": price_data},
            "buyers_intelligence":     buyers_data,
            "trade_intelligence":      {"trade_info": trade_data},
            "competitor_intelligence": competitor_data,
            "marketing_intelligence":  {"marketing_info": marketing_data},
        }

        _cache_set(f"pi:{product_id}:{user_id}", response)
        print(f"[PI] fetched in {(time.monotonic() - t0) * 1000:.0f}ms — {product_id[:8]}")
        return response

    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": "Failed to build response", "detail": str(e), "code": "BUILD_ERROR"}

async def get_all_products(conn, user_id: str, search: str = None, category: str = None, status: str = None):

    try:
        # =====================================================
        # 📦 ALL PRODUCTS FOR THIS USER
        # =====================================================
        filters     = ["pm.created_by = $1", "pm.status != 'inactive'"]
        query_args  = [user_id]

        if search:
            query_args.append(f"%{search.strip()}%")
            filters.append(f"pm.product_name ILIKE ${len(query_args)}")

        if category:
            query_args.append(category.strip())
            filters.append(f"pm.category = ${len(query_args)}")

        if status:
            query_args.append(status.strip())
            filters.append(f"pm.status = ${len(query_args)}")

        where_clause = " AND ".join(filters)

        products = await conn.fetch(f"""
            SELECT DISTINCT ON (pm.product_name)
                pm.id AS product_id,
                pm.product_name,
                pm.category,
                pm.status,
                pm.updated_at AS last_analyzed_at,
                co.industry,
                co.company_type,
                ur.price_positioning,
                pm.moq
            FROM product_info.product_master pm
            JOIN core_tables.companies_other co
                ON co.id = pm.company_id
            JOIN core_tables.user_research_preferences ur
                ON ur.user_id = $1
            WHERE {where_clause}
            ORDER BY pm.product_name, pm.updated_at DESC
        """, *query_args)

        if not products:
            return {
                "success": True,
                "has_run_intelligence":False,
                "total": 0,
                "products": [],
            }

        product_ids = [row["product_id"] for row in products]


        # =====================================================
        # 🎯 OVERALL SCORES — batch fetch for all products
        # =====================================================
        overall_rows = await conn.fetch("""
            SELECT product_id, overall_score, scores
            FROM product_info.overall_intelligence_scores
            WHERE product_id = ANY($1::uuid[])
        """, product_ids)

        overall_map = {row["product_id"]: row for row in overall_rows}

        # =====================================================
        # 🌍 MARKET — country_and_score per product
        # =====================================================
        market_rows = await conn.fetch("""
            SELECT product_id, country_and_score, cert_require
            FROM product_info.market_intelligence
            WHERE product_id = ANY($1::uuid[])
            AND country_and_score IS NOT NULL
        """, product_ids)

        # group by product_id → { pid: { country_and_score: [], cert_require: [] } }
        market_map: dict = {}
        for row in market_rows:
            pid  = row["product_id"]
            cas  = _parse(row["country_and_score"])
            cert = _parse(row["cert_require"])

            if pid not in market_map:
                market_map[pid] = {
                    "country_and_score": [],
                    "cert_require":      [],
                }

            if cas:
                market_map[pid]["country_and_score"].append({
                    "country": cas.get("country"),
                    "score":   cas.get("score"),
                })

            if cert:
                # cert_require is {"certifications": [...]} — extract the list
                certs = cert.get("certifications") or []
                if isinstance(certs, list):
                    market_map[pid]["cert_require"].extend(certs)
                

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": "Failed to fetch products",
            "detail": str(e),
            "code": "DB_FETCH_ERROR",
        })

    # =====================================================
    # 🔧 BUILD LIST
    # =====================================================
    try:
        result = []
        for p in products:
            pid     = p["product_id"]
            overall = overall_map.get(pid)
            score   = overall["overall_score"] if overall else None
            market_data = market_map.get(pid, {"country_and_score": [], "cert_require": []})  # ✅
            result.append({
                "product_id":              pid,
                "name":                    p["product_name"],
                "category":                p["category"],
                "status":                  p["status"],
                "industry":                p["industry"],
                "price_positioning":       list(set(market_data.get("cert_require", []))),
                "country_and_score":       market_data.get("country_and_score", []),
                "monthly_supply_capacity": p["moq"],
                "last_analyzed_at":        p["last_analyzed_at"].isoformat() if p["last_analyzed_at"] else None,
                "score":                   overall["overall_score"] if overall else None,
                "confidence_label":        _confidence_label(score),
            })

        return {
            "success": True,
            "total":    len(result),
            "products": result,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": "Failed to build products list",
            "detail": str(e),
            "code": "BUILD_ERROR",
        })

async def get_buyer_list(conn, user_id: str, search: str = None, product_name: str = None, country: str = None, buyer_type: str = None):

    try:
        # =====================================================
        # 🏭 B2B BUYERS
        # =====================================================
        b2b_rows = await conn.fetch("""
            SELECT
                bi.product_id,
                bi.buyers,
                bi.buyers_count,
                bi.target_country,
                bi.is_fallback,
                pm.product_name
            FROM product_info.b2b_buyer_intelligence bi
            JOIN product_info.product_master pm
                ON pm.id = bi.product_id
            WHERE pm.created_by = $1
              AND pm.status != 'inactive'
            ORDER BY pm.updated_at DESC
        """, user_id)

        # =====================================================
        # 🛍️ B2C BUYERS
        # =====================================================
        # b2c_rows = await conn.fetch("""
        #     SELECT
        #         bi.product_id,
        #         bi.consumer_profile,
        #         bi.purchase_channels,
        #         bi.label_preferences,
        #         bi.leading_brands,
        #         bi.market_gap,
        #         bi.target_country,
        #         pm.product_name
        #     FROM product_info.b2c_buyer_intelligence bi
        #     JOIN product_info.product_master pm
        #         ON pm.id = bi.product_id
        #     WHERE pm.created_by = $1
        #       AND pm.status != 'inactive'
        #     ORDER BY pm.updated_at DESC
        # """, user_id)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": "Failed to fetch buyer list",
            "detail": str(e),
            "code": "DB_FETCH_ERROR",
        })

    try:
        b2b_buyers = []
        total_buyers_count = 0
        # b2c_buyers = []

        # =====================================================
        # 🔧 FLATTEN B2B
        # =====================================================
        for row in b2b_rows:
            buyers            = _parse(row["buyers"]) or []
            product_name      = row["product_name"]
            product_id        = row["product_id"]
            product_name_lower = product_name.lower() if product_name else ""

            for buyer in buyers:
                if not isinstance(buyer, dict):
                    continue

                if buyer.get("masked"):
                    continue

                total_buyers_count += 1

                if (buyer.get("relevance_score") or 0) < 7:
                    continue

                raw_country = buyer.get("country") or ""
                resolved_country = raw_country if raw_country and raw_country not in ("None", "none", "null") else None
                resolved_country = resolved_country or _parse(row["target_country"])
                resolved_type    = buyer.get("type")

                # ── apply filters ────────────────────────────────────────────
                if search and not (buyer.get("name") or "").lower().__contains__(search.strip().lower()):
                    continue
                if product_name and product_name.strip().lower() != product_name_lower:
                    continue
                if country and (resolved_country or "").lower() != country.strip().lower():
                    continue
                if buyer_type and (resolved_type or "").lower() != buyer_type.strip().lower():
                    continue

                b2b_buyers.append({
                    "product_id":      product_id,
                    "product_name":    product_name,
                    "company_name":    buyer.get("name"),
                    "buyer_type":      resolved_type,
                    "country":         resolved_country,
                    "contact":         buyer.get("contact") or None,
                    "notes":           buyer.get("notes"),
                    "relevance_score": buyer.get("relevance_score"),
                    "is_fallback":     row["is_fallback"],
                })

        # =====================================================
        # 🔧 FLATTEN B2C
        # =====================================================
        # for row in b2c_rows:
        #     consumer_profile  = _parse(row["consumer_profile"])  or {}
        #     purchase_channels = _parse(row["purchase_channels"]) or {}
        #     label_preferences = _parse(row["label_preferences"]) or {}
        #     leading_brands    = _parse(row["leading_brands"])    or []

        #     b2c_buyers.append({
        #         "product_id":    row["product_id"],
        #         "product_name":  row["product_name"],
        #         "target_country": _parse(row["target_country"]),
        #         "consumer_profile":  consumer_profile,
        #         "purchase_channels": purchase_channels,
        #         "label_preferences": label_preferences,
        #         "leading_brands":    leading_brands,
        #         "market_gap":        row["market_gap"],
        #     })

        top_matches = sum(1 for b in b2b_buyers if (b.get("relevance_score") or 0) >= 7)

        return {
            "success":            True,
            "total_b2b_buyers":   total_buyers_count,
            "matched_b2b_buyers": len(b2b_buyers),
            "top_matches":        top_matches,
            "b2b":                b2b_buyers,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail={
            "success": False,
            "error": "Failed to build buyer list",
            "detail": str(e),
            "code": "BUILD_ERROR",
        })

async def fetch_all_products_overview(conn, user_id: str, job_id: str = None) -> Dict[str, Any]:
    """
    Returns overview cards for ALL products belonging to this user.
    Each card has: product_id, name, overall score, 6 dimension scores, urgent_note.
    Powers the product listing UI.
    """

    # Build job-scoped subquery clause when job_id is provided
    job_clause   = "AND job_id::text = $2" if job_id else ""
    query_args   = [user_id, job_id] if job_id else [user_id]

    try:
        # ── 1. Products (scoped to job when job_id given) ─────────────────────
        products = await conn.fetch(f"""
            SELECT pm.id, pm.product_name, pm.hs_code
            FROM product_info.product_master pm
            WHERE pm.created_by = $1 {job_clause}
            ORDER BY pm.created_at DESC
        """, *query_args)

        if not products:
            return {"success": True, "products": [], "total": 0}

        # ── 2. Bulk fetch scores ──────────────────────────────────────────────
        scores_rows = await conn.fetch(f"""
            SELECT oi.product_id, oi.overall_score, oi.scores, oi.urgent_note, oi.action_cards, oi.total_elapsed_sec
            FROM product_info.overall_intelligence_scores oi
            WHERE oi.product_id IN (
                SELECT id FROM product_info.product_master WHERE created_by = $1 {job_clause}
            )
        """, *query_args)

        # ── 3. Bulk fetch top market countries ───────────────────────────────
        market_rows = await conn.fetch(f"""
            SELECT DISTINCT ON (mi.product_id) mi.product_id, mi.country
            FROM product_info.market_intelligence mi
            WHERE mi.product_id IN (
                SELECT id FROM product_info.product_master WHERE created_by = $1 {job_clause}
            )
            AND mi.country IS NOT NULL
            ORDER BY mi.product_id, mi.created_at ASC
        """, *query_args)

        # ── 4. Bulk fetch price range ─────────────────────────────────────────
        price_rows = await conn.fetch(f"""
            SELECT pi.product_id, pi.top_metrics
            FROM product_info.price_intelligence pi
            WHERE pi.product_id IN (
                SELECT id FROM product_info.product_master WHERE created_by = $1 {job_clause}
            )
        """, *query_args)

        # ── 5. Bulk fetch keyword counts ──────────────────────────────────────
        keyword_rows = await conn.fetch(f"""
            SELECT product_id, high_volume_buyer_intent
            FROM product_info.marketing_intelligence
            WHERE product_id IN (
                SELECT id FROM product_info.product_master WHERE created_by = $1 {job_clause}
            )
        """, *query_args)

        # ── 6. Bulk fetch market counts ───────────────────────────────────────
        market_count_rows = await conn.fetch(f"""
            SELECT
                product_id,
                COUNT(*) AS market_count,
                AVG(
                    NULLIF(
                        REGEXP_REPLACE(
                            SUBSTRING(demand_growth->>'value' FROM '[0-9]+\.?[0-9]*'),
                            '[^0-9.]', '', 'g'
                        ),
                        ''
                    )::float
                ) AS avg_yoy
            FROM product_info.market_intelligence
            WHERE product_id IN (
                SELECT id FROM product_info.product_master WHERE created_by = $1 {job_clause}
            )
            AND country IS NOT NULL
            AND demand_growth->>'value' IS NOT NULL
            AND demand_growth->>'value' != ''
            GROUP BY product_id
        """, *query_args)

        # ── 7. Bulk fetch buyer counts — B2B + B2C ────────────────────────────
        b2b_buyer_rows = await conn.fetch(f"""
            SELECT bi.product_id, bi.buyers_count
            FROM product_info.b2b_buyer_intelligence bi
            WHERE bi.product_id IN (
                SELECT id FROM product_info.product_master WHERE created_by = $1 {job_clause}
            )
        """, *query_args)

        b2c_buyer_rows = await conn.fetch(f"""
            SELECT bi.product_id,
                jsonb_array_length(COALESCE(bi.leading_brands, '[]'::jsonb)) AS buyers_count
            FROM product_info.b2c_buyer_intelligence bi
            WHERE bi.product_id IN (
                SELECT id FROM product_info.product_master WHERE created_by = $1 {job_clause}
            )
        """, *query_args)

        meta = await conn.fetchrow(f"""
            SELECT MAX(updated_at) AS last_run
            FROM product_info.product_master
            WHERE created_by = $1 {job_clause}
        """, *query_args)

        # pages crawled — scoped to this job when job_id given, else all jobs
        if job_id:
            crawl_meta = await conn.fetchrow("""
                SELECT COALESCE(SUM(pages_crawled), 0) AS total_pages_crawled
                FROM core_tables.pipeline_jobs
                WHERE user_id = $1
                  AND id::text = $2
                  AND status = 'completed'
            """, user_id, job_id)
        else:
            crawl_meta = await conn.fetchrow("""
                SELECT COALESCE(SUM(pages_crawled), 0) AS total_pages_crawled
                FROM core_tables.pipeline_jobs
                WHERE user_id = $1
                  AND status = 'completed'
            """, user_id)

        pages_crawled = crawl_meta["total_pages_crawled"] if crawl_meta else 0
    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": "Failed to fetch products overview", "detail": str(e), "code": "DB_FETCH_ERROR"}

    try:
        # ── Index by product_id ───────────────────────────────────────────────
        scores_map = {str(r["product_id"]): r for r in scores_rows}
        price_map  = {str(r["product_id"]): r for r in price_rows}
        
        # ── B2B count ────────────────────────────────────────────────────
        b2b_total = sum(r["buyers_count"] or 0 for r in b2b_buyer_rows)

        # ── B2C count — count leading brands as B2C "buyers" ────────────
        b2c_total = sum(r["buyers_count"] or 0 for r in b2c_buyer_rows)

        total_buyers = b2b_total + b2c_total
        market_count_map = {str(r["product_id"]): r for r in market_count_rows}
        keyword_map = {str(r["product_id"]): _parse(r["high_volume_buyer_intent"]) or [] for r in keyword_rows}

        # ── Aggregate stats ───────────────────────────────────────────────
        total_keywords  = sum(len(v) for v in keyword_map.values())
        easy_win_markets = 0
        yoy_values = []

        for pid_str, r in market_count_map.items():
            if r["avg_yoy"]:
                yoy_values.append(float(r["avg_yoy"]))

        # easy win markets = sum of green scores across all products
        for ov in scores_map.values():
            raw = _parse(ov["scores"]) if ov["scores"] else []
            easy_win_markets += sum(1 for s in raw if s.get("color") == "green")

        avg_yoy = round(sum(yoy_values) / len(yoy_values), 1) if yoy_values else None
        # collect top market country per product
        market_map: Dict[str, str] = {}
        for r in market_rows:
            pid = str(r["product_id"])
            if pid not in market_map:
                market_map[pid] = r["country"]

        # ── Build card list ───────────────────────────────────────────────────
        cards = []
        for p in products:
            pid  = str(p["id"])
            ov   = scores_map.get(pid)
            pr   = price_map.get(pid)

            top_metrics = _parse(pr["top_metrics"]) if pr and pr["top_metrics"] else {}

            raw_scores = _parse(ov["scores"]) if ov and ov["scores"] else []
            simplified_scores = [
                {
                    "color": s.get("color"),
                    "label": s.get("label"),
                    "score": s.get("score"),
                }
                for s in raw_scores
            ]

            easy_win_count = sum(1 for s in raw_scores if s.get("color") == "green")

            cards.append({
                "product_id":   pid,
                "product_name": p["product_name"],
                "hs_code":      p["hs_code"],
                "overview": {
                    "score":        ov["overall_score"]   if ov else None,
                    "urgent_note":  ov["urgent_note"]     if ov else None,
                    "easy_win":     easy_win_count,
                    "market_range": top_metrics.get("market_range"),
                    "scores":       simplified_scores,
                },
            })

        # ── aggregate total time across all products ──────────────────────────
        all_times = [
            row["total_elapsed_sec"]
            for row in scores_map.values()
            if row and row.get("total_elapsed_sec")
        ]
        avg_time_min = round(sum(all_times) / len(all_times) / 60, 1) if all_times else None

        return {
            "success":          True,
            "total":            len(cards),
            "products_analyzed": len(cards),
            "pages_crawled":pages_crawled,
            "last_run":         meta["last_run"].strftime("%d %b %Y") if meta and meta["last_run"] else None,
            "time_taken":       f"{avg_time_min} minutes" if avg_time_min else None,
            "products":         cards,
            "summary": [
                {"key": "total_buyers",     "label": "Buyers Found",     "value": total_buyers},
                {"key": "easy_win_markets", "label": "Easy Win Markets", "value": easy_win_markets},
                {"key": "avg_yoy_demand",   "label": "Avg YoY Demand",   "value": f"+{avg_yoy}%" if avg_yoy else None},
                {"key": "total_keywords",   "label": "Keywords",         "value": total_keywords},
            ],
        }

    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": "Failed to build products overview", "detail": str(e), "code": "BUILD_ERROR"}


_STATS_SQL = """
WITH product_ids AS (
    SELECT id, created_at
    FROM product_info.product_master
    WHERE created_by = $1
),
buyer_stats AS (
    SELECT
        COALESCE(SUM(bi.buyers_count), 0)                                                        AS total,
        COALESCE(SUM(bi.buyers_count) FILTER (WHERE bi.created_at >= NOW() - INTERVAL '7 days'), 0) AS this_week
    FROM product_info.buyer_intelligence bi
    WHERE bi.product_id IN (SELECT id FROM product_ids)
),
email_stats AS (
    SELECT
        COALESCE(SUM(COALESCE(mi.emails_count, jsonb_array_length(mi.emails::jsonb))), 0)                                                         AS total,
        COALESCE(SUM(COALESCE(mi.emails_count, jsonb_array_length(mi.emails::jsonb))) FILTER (WHERE mi.updated_at >= NOW() - INTERVAL '7 days'), 0) AS this_week
    FROM product_info.marketing_intelligence mi
    WHERE mi.product_id IN (SELECT id FROM product_ids)
      AND mi.emails IS NOT NULL
      AND mi.emails::text != 'null'
)
SELECT
    (SELECT full_name FROM core_auth_table.auth_user WHERE user_id = $1)     AS full_name,
    (SELECT COUNT(*)      FROM product_ids)                                   AS products_total,
    (SELECT COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') FROM product_ids) AS products_this_week,
    (SELECT total     FROM buyer_stats)                                       AS buyers_total,
    (SELECT this_week FROM buyer_stats)                                       AS buyers_this_week,
    (SELECT total     FROM email_stats)                                       AS emails_total,
    (SELECT this_week FROM email_stats)                                       AS emails_this_week,
    (SELECT COUNT(*) FROM core_tables.pipeline_jobs
     WHERE user_id = $1 AND status = 'completed'
       AND created_at >= date_trunc('month', NOW()))                          AS reports_total
"""

_PRODUCTS_SQL = """
SELECT
    pm.id, pm.product_name, pm.created_at,
    oi.overall_score, oi.urgent_note,
    COALESCE(bi.buyers_count, 0) AS buyers_count,
    ARRAY(
        SELECT country FROM product_info.market_intelligence
        WHERE product_id = pm.id AND country IS NOT NULL
        ORDER BY created_at ASC LIMIT 3
    ) AS top_markets,
    mi_first.country
FROM product_info.product_master pm
LEFT JOIN product_info.overall_intelligence_scores oi ON oi.product_id = pm.id
LEFT JOIN product_info.buyer_intelligence bi ON bi.product_id = pm.id
LEFT JOIN LATERAL (
    SELECT country FROM product_info.market_intelligence
    WHERE product_id = pm.id AND country IS NOT NULL
    ORDER BY created_at ASC LIMIT 1
) mi_first ON TRUE
WHERE pm.created_by = $1
ORDER BY oi.overall_score DESC NULLS LAST
"""


async def fetch_dashboard_data(_conn, user_id: str) -> Dict[str, Any]:
    import asyncio
    from db.database import get_pool

    try:
        pool = get_pool()

        # Run 3 queries in parallel on separate pool connections
        async def _stats():
            async with pool.acquire() as c:
                return await c.fetchrow(_STATS_SQL, user_id)

        async def _products():
            async with pool.acquire() as c:
                return await c.fetch(_PRODUCTS_SQL, user_id)

        async def _has_run():
            async with pool.acquire() as c:
                return await c.fetchval(
                    "SELECT has_run_intelligence FROM core_auth_table.auth_user WHERE user_id = $1",
                    user_id
                )

        stats_row, products_rows, has_run_intelligence = await asyncio.gather(
            _stats(), _products(), _has_run()
        )

        # ── Stats ─────────────────────────────────────────────────────────────
        full_name         = stats_row["full_name"] or "Guest"
        products_total    = int(stats_row["products_total"]    or 0)
        products_this_week = int(stats_row["products_this_week"] or 0)
        buyers_total      = int(stats_row["buyers_total"]      or 0)
        buyers_this_week  = int(stats_row["buyers_this_week"]  or 0)
        emails_total      = int(stats_row["emails_total"]      or 0)
        emails_this_week  = int(stats_row["emails_this_week"]  or 0)
        reports_completed = int(stats_row["reports_total"]     or 0)

        # ── Opportunity hub + AI insights (split from same rows) ──────────────
        def score_label(score):
            if score is None: return "Pending"
            if score >= 75:   return "Easy Win"
            if score >= 50:   return "Less Demand"
            return "No Demand"

        opportunity_hub = []
        ai_insights     = []
        for p in products_rows:
            if len(opportunity_hub) < 10:
                opportunity_hub.append({
                    "product_id":   str(p["id"]),
                    "product_name": p["product_name"],
                    "buyers_count": p["buyers_count"],
                    "top_markets":  list(p["top_markets"]) if p["top_markets"] else [],
                    "score":        p["overall_score"],
                    "label":        score_label(p["overall_score"]),
                    "initiated_at": p["created_at"].isoformat() if p["created_at"] else None,
                })
            if p["urgent_note"] and len(ai_insights) < 4:
                ai_insights.append({
                    "product_name": p["product_name"],
                    "country":      p["country"],
                    "urgent_note":  p["urgent_note"],
                })

        return {
            "success": True,
            "full_name": full_name,
            "user_id": user_id,
            "has_run_intelligence": bool(has_run_intelligence),
            "current_datetime": datetime.now(timezone.utc).isoformat(),
            "stats": [
                {"key": "Products Tracked",  "total": products_total,    "this_week": products_this_week},
                {"key": "Buyers Discovered", "total": buyers_total,      "this_week": buyers_this_week},
                {"key": "Emails Generated",  "total": emails_total,      "this_week": emails_this_week},
                {"key": "Reports Completed", "total": reports_completed,  "period": "this billing cycle"},
            ],
            "opportunity_hub": opportunity_hub[:],
            "ai_insights":     ai_insights,
        }

    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": "Failed to fetch dashboard data", "detail": str(e)}


_ENGINE_DISPLAY = {
    "market_demand":        "Market Demand",
    "trade_intel":          "Trade Intelligence",
    "buyer_discovery":      "Buyer Discovery",
    "variants_formats":     "Variants",
    "competitor_discovery": "Competitor Discovery",
    "keyword_intel":        "Keyword Intelligence",
    "email_sequence":       "Email Sequence",
    "ad_concepts":          "Ad Concepts",
    "price_analysis":       "Price Analysis",
    "scoring":              "Scoring",
}


def _resolve_activity(j):
    job_status             = j["status"]
    job_stage              = j["stage"]
    progress               = j["progress"]
    total_products         = j["total_products"] or 0
    intel_completed_count  = j["intel_completed_count"] or 0
    intel_processing_count = j["intel_processing_count"] or 0
    current_engine_db      = j["current_engine_db"]

    if job_status == "pending":
        return "Queued", None, "Pending", 0

    if job_status == "processing":
        stage_map = {
            "starting":   ("Initializing Pipeline", "Web Crawler"),
            "crawling":   ("Website Scanning",       "Web Crawler"),
            "processing": ("Extracting Products",    "Product Extractor"),
        }
        activity, engine = stage_map.get(job_stage, ("Processing", "Pipeline"))
        return activity, engine, "In Progress", progress or 10

    if job_status == "failed":
        return "Pipeline Failed", None, "Failed", 0

    if job_status == "completed":
        if total_products == 0:
            return "Awaiting Product Selection", None, "Pending", 100
        if intel_completed_count == total_products:
            return "Analysis Complete", None, "Complete", 100
        if intel_processing_count > 0:
            engine_display = _ENGINE_DISPLAY.get(current_engine_db, current_engine_db or "Running")
            pct = int((intel_completed_count / total_products) * 100)
            return engine_display, engine_display, "In Progress", pct
        return "Ready for Analysis", None, "Pending", 100

    return "Unknown", None, "Pending", 0


async def fetch_recent_activity(conn, user_id: str) -> Dict[str, Any]:
    try:
        jobs_rows = await conn.fetch("""
            SELECT
                pj.id,
                pj.status,
                pj.stage,
                pj.progress,
                pj.created_at,

                (
                    SELECT ARRAY_AGG(tp.product_data->>'product_name'
                                     ORDER BY tp.created_at ASC)
                    FROM product_info.pipeline_temp_products tp
                    WHERE tp.job_id::text = pj.id::text
                      AND tp.user_id::text = $1
                      AND (tp.product_data->>'product_name') IS NOT NULL
                ) AS product_names,

                (
                    SELECT ARRAY_AGG(
                        COALESCE(mi.country, bi.target_country)
                        ORDER BY pm.created_at ASC
                    )
                    FROM product_info.product_master pm
                    LEFT JOIN LATERAL (
                        SELECT NULLIF(TRIM(country), '') AS country
                        FROM product_info.market_intelligence
                        WHERE product_id = pm.id AND country IS NOT NULL AND TRIM(country) != ''
                        ORDER BY created_at ASC LIMIT 1
                    ) mi ON TRUE
                    LEFT JOIN LATERAL (
                        SELECT NULLIF(TRIM(target_country::text, '"'), '') AS target_country
                        FROM product_info.buyer_intelligence
                        WHERE product_id = pm.id AND target_country IS NOT NULL
                        ORDER BY created_at ASC LIMIT 1
                    ) bi ON TRUE
                    WHERE pm.job_id::text = pj.id::text
                      AND pm.created_by::text = $1
                ) AS product_countries,

                (
                    SELECT COUNT(*) FROM product_info.product_master pm
                    WHERE pm.job_id::text = pj.id::text
                      AND pm.created_by::text = $1
                ) AS total_products,

                (
                    SELECT COUNT(*) FROM product_info.product_master pm
                    WHERE pm.job_id::text = pj.id::text
                      AND pm.created_by::text = $1
                      AND pm.status = 'intelligence_completed'
                ) AS intel_completed_count,

                (
                    SELECT COUNT(*) FROM product_info.product_master pm
                    WHERE pm.job_id::text = pj.id::text
                      AND pm.created_by::text = $1
                      AND pm.status = 'intelligence_processing'
                ) AS intel_processing_count,

                (
                    SELECT pm.current_engine
                    FROM product_info.product_master pm
                    WHERE pm.job_id::text = pj.id::text
                      AND pm.created_by::text = $1
                      AND pm.status = 'intelligence_processing'
                      AND pm.current_engine IS NOT NULL
                    ORDER BY pm.updated_at DESC
                    LIMIT 1
                ) AS current_engine_db

            FROM core_tables.pipeline_jobs pj
            WHERE pj.user_id::text = $1
            ORDER BY pj.created_at DESC
            LIMIT 5
        """, user_id)

        recent_activity = []
        for j in jobs_rows:
            names     = j["product_names"] or []
            countries = j["product_countries"] or []
            products  = [
                {"product_name": n, "country": c if c else None}
                for n, c in zip(names, countries)
            ]

            activity, engine, label, progress = _resolve_activity(j)

            recent_activity.append({
                "job_id":         str(j["id"]),
                "products":       products,
                "activity":       activity,
                "current_engine": engine,
                "label":          label,
                "progress":       progress,
                "created_at":     j["created_at"].isoformat() if j["created_at"] else None,
            })

        return {"success": True, "recent_activity": recent_activity}

    except Exception as e:
        traceback.print_exc()
        return {"success": False, "error": "Failed to fetch recent activity", "detail": str(e)}
