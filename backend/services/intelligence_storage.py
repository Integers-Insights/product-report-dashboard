import json
import asyncpg
import asyncio

def safe_json(data):
    try:
        json_str = json.dumps(data, ensure_ascii=False)

        # ✅ Validate JSON
        json.loads(json_str)

        return json_str
    except Exception as e:
        print("❌ JSON ERROR:", e)
        print("❌ BAD DATA:", data)
        return "[]"

def extract_emails(email_data):
    # save_marketing already builds a list under "emails" key
    if "emails" in email_data and isinstance(email_data["emails"], list):
        return email_data["emails"]

    # fallback: individual email_1 / email_2 / email_3 keys
    emails = []
    for key in ["email_1", "email_2", "email_3"]:
        e = email_data.get(key)
        if e:
            emails.append(e)
    return emails

async def upsert_overall_intelligence(conn, data: dict, user_id: str):

    scores  = data.get("scores", [])
    actions = data.get("action_cards", [])

    scores_json  = json.dumps(scores)
    actions_json = json.dumps(actions)

    print("📦 SCORES:", scores_json)
    print("📦 ACTIONS:", actions_json)

    await conn.execute(
        """
        INSERT INTO product_info.overall_intelligence_scores (
            product_id,
            overall_score,
            scores,
            scores_count,
            urgent_note,
            action_cards,
            actions_count,
            created_by,
            updated_by,
            total_elapsed_sec
        )
        VALUES ($1,$2,$3::jsonb,$4,$5,$6::jsonb,$7,$8,$8,$9)
        ON CONFLICT (product_id)
        DO UPDATE SET
            overall_score     = EXCLUDED.overall_score,
            scores            = EXCLUDED.scores,
            scores_count      = EXCLUDED.scores_count,
            urgent_note       = EXCLUDED.urgent_note,
            action_cards      = EXCLUDED.action_cards,
            actions_count     = EXCLUDED.actions_count,
            updated_at        = NOW(),
            updated_by        = EXCLUDED.updated_by,
            total_elapsed_sec = EXCLUDED.total_elapsed_sec
        """,
        data.get("product_id"),       # $1
        data.get("overall_score"),    # $2
        scores_json,                  # $3
        len(scores),                  # $4
        data.get("urgent_note"),      # $5
        actions_json,                 # $6
        len(actions),                 # $7
        user_id,                      # $8 — created_by + updated_by
        data.get("total_elapsed_sec"), # $9
    )

    print(f"✅ Saved overall intelligence for product {data.get('product_id')}")

async def upsert_price_intelligence(conn, data: dict, user_id: str):

    def safe_list(val):
        return val if isinstance(val, list) else []

    top_metrics = data.get("top_metrics") or {}

    variant_table = safe_list(data.get("variant_table"))
    cert_premiums = safe_list(data.get("cert_premiums"))

    print("📦 PRICE METRICS:", top_metrics)
    print("📦 VARIANTS:", len(variant_table))
    print("📦 CERTS:", len(cert_premiums))

    query = """
        INSERT INTO product_info.price_intelligence (
            product_id,
            top_metrics,
            variant_table,
            variants_count,
            cert_premiums,
            cert_count,
            created_by,
            updated_by
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT (product_id)
        DO UPDATE SET
            top_metrics = EXCLUDED.top_metrics,
            variant_table = EXCLUDED.variant_table,
            variants_count = EXCLUDED.variants_count,
            cert_premiums = EXCLUDED.cert_premiums,
            cert_count = EXCLUDED.cert_count,
            updated_at = NOW(),
            updated_by = EXCLUDED.updated_by
    """

    await conn.execute(
        query,
        data.get("product_id"),
        json.dumps(top_metrics),
        json.dumps(variant_table),
        len(variant_table),
        json.dumps(cert_premiums),
        len(cert_premiums),
        str(user_id),
        str(user_id)
    )

    print(f"✅ Saved price intelligence for product {data.get('product_id')}")

async def upsert_marketing_intelligence(conn, data: dict, user_id: str):

    emails = extract_emails(data)

    ads     = data.get("concepts") or []
    kw_high = data.get("high_volume_buyer_intent") or []
    kw_low  = data.get("low_competition_gaps") or []
    kw_multi = data.get("multilingual") or []
    keywords_count = len(kw_high) + len(kw_low) + len(kw_multi)

    query = """
        INSERT INTO product_info.marketing_intelligence (
            product_id,
            target_country,

            high_volume_buyer_intent,
            low_competition_gaps,
            multilingual,

            emails,
            emails_count,
            sequence_note,
            buyer_type,

            ad_concepts,
            keywords_count,
            ads_count,

            created_by,
            updated_by
        )
        VALUES (
            $1,$2,
            $3,$4,$5,
            $6,$7,$8,$9,
            $10,$11,$12,
            $13,$13
        )
        ON CONFLICT (product_id)
        DO UPDATE SET
            target_country = EXCLUDED.target_country,

            high_volume_buyer_intent = EXCLUDED.high_volume_buyer_intent,
            low_competition_gaps = EXCLUDED.low_competition_gaps,
            multilingual = EXCLUDED.multilingual,

            emails = EXCLUDED.emails,
            emails_count = EXCLUDED.emails_count,
            sequence_note = EXCLUDED.sequence_note,
            buyer_type = EXCLUDED.buyer_type,

            ad_concepts = EXCLUDED.ad_concepts,
            keywords_count = EXCLUDED.keywords_count,
            ads_count = EXCLUDED.ads_count,

            updated_at = NOW(),
            updated_by = EXCLUDED.updated_by
    """

    await conn.execute(
        query,
        data.get("product_id"),
        data.get("target_country"),

        json.dumps(kw_high),
        json.dumps(kw_low),
        json.dumps(kw_multi),

        json.dumps(emails),
        len(emails),
        data.get("sequence_note"),
        data.get("buyer_type"),

        json.dumps(ads),
        keywords_count,
        len(ads) if isinstance(ads, list) else 0,

        str(user_id)
    )

    print(f"✅ Saved marketing data for product {data.get('product_id')}")

async def upsert_variants_formats(conn, data: dict, user_id: str):

    variants = data.get("variants", [])

    if not isinstance(variants, list):
        variants = []

    print("📦 VARIANTS COUNT:", len(variants))

    query = """
        INSERT INTO product_info.variants_formats (
            product_id,
            variants,
            variants_count,
            created_by,
            updated_by
        )
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (product_id)
        DO UPDATE SET
            variants = EXCLUDED.variants,
            variants_count = EXCLUDED.variants_count,
            updated_at = NOW(),
            updated_by = EXCLUDED.updated_by
    """

    variants_json = json.dumps(variants)

    await conn.execute(
        query,
        data.get("product_id"),
        variants_json,   # ✅ FIX
        len(variants),
        str(user_id),
        str(user_id)
    )

    print(f"✅ Saved variants for product {data.get('product_id')}")


async def upsert_competitor_intelligence(conn, data: dict, user_id: str):

    competitors = data.get("competitors", [])

    if not isinstance(competitors, list):
        competitors = []

    print("📦 COMPETITORS:", competitors)

    query = """
        INSERT INTO product_info.competitor_intelligence (
            product_id,
            competitors,
            competitors_count,
            is_fallback,
            created_by,
            updated_by
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (product_id)
        DO UPDATE SET
            competitors = EXCLUDED.competitors,
            competitors_count = EXCLUDED.competitors_count,
            is_fallback = EXCLUDED.is_fallback,
            updated_at = NOW(),
            updated_by = EXCLUDED.updated_by
    """

    competitors_json = json.dumps(competitors)

    await conn.execute(
        query,
        data.get("product_id"),
        competitors_json,   # ✅ FIX
        len(competitors),
        data.get("is_fallback", False),
        str(user_id),
        str(user_id)
    )

    print(f"✅ Saved competitor data for product {data.get('product_id')}")

async def upsert_trade_intelligence(conn, data: dict, user_id: str):

    # 🔥 helper → ensure JSON safe
    def safe_json_field(val):
        try:
            return json.dumps(val)
        except:
            return None

    query = """
        INSERT INTO product_info.trade_intelligence (
            product_id,
            hs_code,
            origin_country,
            global_trade_value,
            volume_traded_globally,
            avg_global_trade_price,
            country_export_share,
            top_exporters,
            top_importers,
            export_volume_trend,
            export_pricing_commod,
            analysis_note,
            created_by,
            updated_by
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$13
        )
        ON CONFLICT (product_id)
        DO UPDATE SET
            hs_code = EXCLUDED.hs_code,
            origin_country = EXCLUDED.origin_country,
            global_trade_value = EXCLUDED.global_trade_value,
            volume_traded_globally = EXCLUDED.volume_traded_globally,
            avg_global_trade_price = EXCLUDED.avg_global_trade_price,
            country_export_share = EXCLUDED.country_export_share,
            top_exporters = EXCLUDED.top_exporters,
            top_importers = EXCLUDED.top_importers,
            export_volume_trend = EXCLUDED.export_volume_trend,
            export_pricing_commod = EXCLUDED.export_pricing_commod,
            analysis_note = EXCLUDED.analysis_note,
            updated_at = NOW(),
            updated_by = EXCLUDED.updated_by
    """

    try:
        await conn.execute(
            query,
            data.get("product_id"),
            data.get("hs_code"),
            data.get("origin_country"),

            safe_json_field(data.get("global_trade_value")),
            safe_json_field(data.get("volume_traded_globally")),
            safe_json_field(data.get("avg_global_trade_price")),

            safe_json_field(data.get("country_export_share")),
            safe_json_field(data.get("top_exporters")),
            safe_json_field(data.get("top_importers")),

            safe_json_field(data.get("export_volume_trend")),
            safe_json_field(data.get("export_pricing_commod")),

            data.get("analysis_note"),

            str(user_id)
        )

        print(f"✅ Saved trade intelligence for product {data.get('product_id')}")

    except Exception as e:
        print("❌ Trade DB insert failed:", str(e))
        print("❌ DATA:", data)

# =====================================================
# 🏭 B2B
# =====================================================
async def upsert_b2b_buyer_intelligence(conn, data: dict, user_id: str):

    buyers = data.get("buyers", [])

    cleaned = []
    for b in buyers:
        if not isinstance(b, dict):
            continue
        raw_country = str(b.get("country") or "")
        cleaned.append({
            "name":            str(b.get("name")                          or ""),
            "type":            str(b.get("buyer_type") or b.get("type")   or ""),
            "country":         "" if raw_country in ("None", "none", "null") else raw_country,
            "contact":         str(b.get("website")  or b.get("contact")  or ""),
            "notes":           str(b.get("notes")                         or ""),
            "sources":         b.get("sources") if isinstance(b.get("sources"), list) else [],
            "relevance_score": b.get("relevance_score"),
        })

    buyers_json        = json.dumps(cleaned,                    ensure_ascii=False)
    target_country_json = json.dumps(data.get("target_country")) if data.get("target_country") is not None else "null"

    query = """
        INSERT INTO product_info.b2b_buyer_intelligence (
            product_id, product_name, target_country,
            buyers, buyers_count, is_fallback,
            created_by, updated_by
        )
        VALUES ($1, $2, $3::jsonb, $4::jsonb, $5, $6, $7, $7)
        ON CONFLICT (product_id) DO UPDATE SET
            product_name   = EXCLUDED.product_name,
            target_country = EXCLUDED.target_country,
            buyers         = EXCLUDED.buyers,
            buyers_count   = EXCLUDED.buyers_count,
            is_fallback    = EXCLUDED.is_fallback,
            updated_by     = EXCLUDED.updated_by,
            updated_at     = NOW()
    """

    uid = data.get("user_id") or user_id

    if isinstance(conn, asyncpg.Pool):
        async with conn.acquire() as c:
            await c.execute(query,
                data.get("product_id"),
                data.get("product_name"),
                target_country_json,
                buyers_json,
                len(cleaned),
                bool(data.get("is_fallback", False)),
                uid,
            )
    else:
        await conn.execute(query,
            data.get("product_id"),
            data.get("product_name"),
            target_country_json,
            buyers_json,
            len(cleaned),
            bool(data.get("is_fallback", False)),
            uid,
        )

    print(f"✅ B2B upserted: {len(cleaned)} buyers for product {data.get('product_id')}")


# =====================================================
# 🛍️  B2C
# =====================================================
async def upsert_b2c_buyer_intelligence(conn, data: dict, user_id: str):

    consumer_profile = data.get("consumer_profile") or {}
    EXCLUDE_FIELDS = {"country", "analysis_note"}
    consumer_profile = {
        k: v for k, v in consumer_profile.items()
        if k not in EXCLUDE_FIELDS
    }
    # consumer_profile may be a nested object or already a dict from .to_dict()
    # terminal output maps to these keys:
    purchase_channels = consumer_profile.pop("purchase_channels", {})
    label_preferences = consumer_profile.pop("label_preferences", {})
    leading_brands    = consumer_profile.pop("leading_brands",    [])
    market_gap        = consumer_profile.pop("market_gap",        None)

    target_country_json   = json.dumps(data.get("target_country")) if data.get("target_country") is not None else "null"
    consumer_profile_json = json.dumps(consumer_profile,  ensure_ascii=False)
    purchase_channels_json = json.dumps(purchase_channels, ensure_ascii=False)
    label_preferences_json = json.dumps(label_preferences, ensure_ascii=False)
    leading_brands_json    = json.dumps(leading_brands,    ensure_ascii=False)

    query = """
        INSERT INTO product_info.b2c_buyer_intelligence (
            product_id, product_name, target_country,
            consumer_profile, purchase_channels, label_preferences,
            leading_brands, market_gap,
            created_by, updated_by
        )
        VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8, $9, $9)
        ON CONFLICT (product_id) DO UPDATE SET
            product_name       = EXCLUDED.product_name,
            target_country     = EXCLUDED.target_country,
            consumer_profile   = EXCLUDED.consumer_profile,
            purchase_channels  = EXCLUDED.purchase_channels,
            label_preferences  = EXCLUDED.label_preferences,
            leading_brands     = EXCLUDED.leading_brands,
            market_gap         = EXCLUDED.market_gap,
            updated_by         = EXCLUDED.updated_by,
            updated_at         = NOW()
    """

    uid = data.get("user_id") or user_id

    if isinstance(conn, asyncpg.Pool):
        async with conn.acquire() as c:
            await c.execute(query,
                data.get("product_id"),
                data.get("product_name"),
                target_country_json,
                consumer_profile_json,
                purchase_channels_json,
                label_preferences_json,
                leading_brands_json,
                market_gap,
                uid,
            )
    else:
        await conn.execute(query,
            data.get("product_id"),
            data.get("product_name"),
            target_country_json,
            consumer_profile_json,
            purchase_channels_json,
            label_preferences_json,
            leading_brands_json,
            market_gap,
            uid,
        )

    print(f"✅ B2C upserted for product {data.get('product_id')}")


# =====================================================
# 🔀 ROUTER — replaces upsert_buyer_intelligence
# =====================================================
async def upsert_buyer_intelligence(conn, data: dict, user_id: str):
    buyer_type = str(data.get("buyer_type") or "").upper()
    print(f"🔀 [upsert_buyer_intelligence] routing → buyer_type='{buyer_type}'")
    if buyer_type == "B2B":
        await upsert_b2b_buyer_intelligence(conn, data, user_id)
    elif buyer_type == "B2C":
        await upsert_b2c_buyer_intelligence(conn, data, user_id)
    elif buyer_type == "BOTH":
        await asyncio.gather(
            upsert_b2b_buyer_intelligence(conn, data,                  user_id),
            upsert_b2c_buyer_intelligence(conn, data,                  user_id),
        )
    else:
        print(f"⚠️  Unknown buyer_type '{buyer_type}' — skipping upsert")

async def upsert_market_intelligence(conn, product_id, rows, user_id):

    query = """
        INSERT INTO product_info.market_intelligence (
            product_id,
            country,
            demand_growth,
            import_volume,
            matched_buyers,
            peak_procurement,
            primary_channel,
            cert_require,
            cert_gap,
            analysis_note,
            country_and_score,
            created_by,
            updated_by,
            updated_at
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12,NOW()
        )
        ON CONFLICT (product_id, country)
        DO UPDATE SET
            demand_growth     = EXCLUDED.demand_growth,
            import_volume     = EXCLUDED.import_volume,
            matched_buyers    = EXCLUDED.matched_buyers,
            peak_procurement  = EXCLUDED.peak_procurement,
            primary_channel   = EXCLUDED.primary_channel,
            cert_require      = EXCLUDED.cert_require,
            cert_gap          = EXCLUDED.cert_gap,
            analysis_note     = EXCLUDED.analysis_note,
            country_and_score = EXCLUDED.country_and_score,
            updated_at        = NOW(),
            updated_by        = EXCLUDED.updated_by
    """
    

    def safe_json(val):
        try:
            return json.dumps(val, ensure_ascii=False)
        except:
            return "{}"

    for r in rows:
        try:
            if not isinstance(r, dict):
                r = getattr(r, "data", {})

            cas = r.get("country_and_score")
            print(f"🔍 upsert: country={r.get('country')} | cas type={type(cas)} | cas={cas}")
            await conn.execute(
                    query,
                    product_id,                              # $1
                    r.get("country"),                        # $2
                    safe_json(r.get("demand_growth")),       # $3
                    safe_json(r.get("import_volume")),       # $4
                    safe_json(r.get("matched_buyers")),      # $5
                    safe_json(r.get("peak_procurement")),    # $6
                    safe_json(r.get("primary_channel")),     # $7
                    safe_json(r.get("cert_require", [])),    # $8
                    safe_json(r.get("cert_gap", [])),        # $9
                    r.get("analysis_note"),                  # $10 ← TEXT matches INSERT position
                    safe_json(r.get("country_and_score")),   # $11 ← JSONB matches INSERT position
                    user_id,                                 # $12
                )

        except Exception as e:
            print("❌ Market intelligence insert failed:", e)