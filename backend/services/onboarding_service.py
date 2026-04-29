import json
import uuid 
from utils.company_utils import get_company_id
from utils.service import get_current_user
from fastapi import Depends,HTTPException
from db.database import get_db

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

async def upsert_company_for_user(conn, user_id: str, data):
    # 1️⃣ Check if company already exists
    row = await conn.fetchrow("""
        SELECT companies_other_id
        FROM core_auth_table.auth_user
        WHERE user_id = $1
    """, user_id)

    company_id = row["companies_other_id"] if row else None

    # Update full_name if provided
    if data.full_name:
        await conn.execute("""
            UPDATE core_auth_table.auth_user
            SET full_name = $1
            WHERE user_id = $2
        """, data.full_name, user_id)

    # =====================================================
    # 🟢 CASE 1: COMPANY EXISTS → UPDATE
    # =====================================================
    if company_id:
        await conn.execute("""
            UPDATE core_tables.companies_other
            SET
                name = $1,
                headquarters_country = $2,
                industry = $3,
                company_type = $4,
                years_in_industry = $5,
                website = $6,
                updated_at = NOW()
            WHERE id = $7
        """,
            data.company_name,
            data.headquarters_country,
            data.industry,
            data.company_type,
            data.years_in_industry,
            data.website,
            company_id
        )

        return company_id

    # =====================================================
    # 🔵 CASE 2: NO COMPANY → CREATE + MAP
    # =====================================================
    new_company = await conn.fetchrow("""
        INSERT INTO core_tables.companies_other (
            id,
            name,
            headquarters_country,
            industry,
            company_type,
            years_in_industry,
            website,
            created_at
        )
        VALUES (
            gen_random_uuid(),
            $1,$2,$3,$4,$5,$6,
            NOW()
        )
        RETURNING id
    """,
        data.company_name,
        data.headquarters_country,
        data.industry,
        data.company_type,
        data.years_in_industry,
        data.website
    )

    new_company_id = new_company["id"]

    # 🔗 Map company to user
    await conn.execute("""
        UPDATE core_auth_table.auth_user
        SET companies_other_id = $1
        WHERE user_id = $2
    """, new_company_id, user_id)

    return new_company_id

async def update_step2(conn, user_id, company_id, data):

    query = """
    INSERT INTO product_info.company_preferences
    (
        company_id,
        product_type,
        sales_intent,
        buyer_type,
        price_positioning,
        created_by,
        updated_by
    )
    VALUES ($1,$2,$3,$4,$5,$6,$6)

    ON CONFLICT (company_id)
    DO UPDATE SET
        product_type = EXCLUDED.product_type,
        sales_intent = EXCLUDED.sales_intent,
        buyer_type = EXCLUDED.buyer_type,
        price_positioning = EXCLUDED.price_positioning,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
    """

    # ✅ Ensure correct type for TEXT[]
    if data.price_positioning is None:
        price_positioning = None
    elif isinstance(data.price_positioning, list):
        price_positioning = data.price_positioning
    else:
        # Convert single value to list
        price_positioning = [data.price_positioning]

    await conn.execute(
        query,
        company_id,
        data.product_type,
        data.sales_intent,
        data.buyer_type,
        price_positioning,  # ✅ FIXED
        user_id
    )

async def update_step3(conn, user_id, company_id, data):

    certifications_json = None

    if data.certifications:
        certifications_json = json.dumps(
            data.certifications.dict(exclude_none=True)
        )

    query = """
    INSERT INTO product_info.company_preferences
    (
        company_id,
        primary_goal,
        certifications,
        referral_source,
        onboarding_completed,
        created_by,
        updated_by
    )
    VALUES ($1,$2,$3,$4,TRUE,$5,$5)

    ON CONFLICT (company_id)
    DO UPDATE SET
        primary_goal = EXCLUDED.primary_goal,
        certifications = EXCLUDED.certifications,
        referral_source = EXCLUDED.referral_source,
        onboarding_completed = TRUE,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
    """
    if data.primary_goal is None:
        primary_goal = None
    elif isinstance(data.primary_goal, list):
        primary_goal = ", ".join(data.primary_goal)
    else:
        primary_goal = str(data.primary_goal)

    await conn.execute(
        query,
        company_id,
        primary_goal,
        certifications_json,
        data.referral_source,
        user_id
    )
        # ✅ Update core_auth_table
    update_auth_query = """
            UPDATE core_auth_table.auth_user
            SET is_submitted = TRUE
            WHERE user_id = $1
    """
    await conn.execute(update_auth_query, user_id)


async def ensure_onboarding_completed(
    current_user = Depends(get_current_user),
    conn = Depends(get_db)
):
    user_id = current_user["user_id"]

    company_id = await resolve_company_id(conn, user_id)

    data = await conn.fetchrow("""
        SELECT onboarding_completed
        FROM product_info.company_preferences
        WHERE company_id = $1 AND onboarding_completed=TRUE
    """, company_id)

    if not data:
        raise HTTPException(400, "Company not found")

    if not data["onboarding_completed"]:
        raise HTTPException(
            status_code=403,
            detail={
                "message": "Complete onboarding first",
                "current_step": data["onboarding_step"]
            }
        )

    return True

async def upsert_company_metadata(conn, user_id, data):

    # 🔥 OPTION 1: get from user_id
    company_id = None

    if user_id:
        user = await conn.fetchrow(
            """
            SELECT companies_other_id
            FROM core_auth_table.auth_user
            WHERE user_id = $1
            """,
            user_id
        )
 
        if user:
            company_id = user["companies_other_id"]

    # 🔥 OPTION 2: fallback from company_name
    if not company_id:
        company = await conn.fetchrow(
            """
            SELECT id
            FROM core_tables.companies_other
            WHERE LOWER(name) = LOWER($1)
            """,
            data.get("company_name")
        )

        if not company:
            raise Exception("Company not found")

        company_id = company["id"]
    # =========================
    # 2️⃣ UPDATE CORE TABLE
    # =========================
    await conn.execute(
        """
        UPDATE core_tables.companies_other
        SET
            founded_year = COALESCE($1, founded_year),
            legal_name = COALESCE($2, legal_name),
            updated_at = NOW()
        WHERE id = $3
        """,
        data.get("founded_year"),
        data.get("company_name"),
        company_id
    )

    # =========================
    # 3️⃣ UPSERT METADATA
    # =========================
    await conn.execute(
        """
        INSERT INTO core_tables.company_metadata (
            company_id,
            tagline,
            city,
            address,
            business_type,
            industries_served,
            export_markets,
            manufacturing_capacity,
            annual_turnover,
            employee_count,
            contact_email,
            contact_phone,
            linkedin_url,
            extracted_from_urls,
            extraction_notes
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
        )

        ON CONFLICT (company_id)
        DO UPDATE SET
        tagline = COALESCE(company_metadata.tagline, EXCLUDED.tagline),
        city = COALESCE(company_metadata.city, EXCLUDED.city),
        address = COALESCE(company_metadata.address, EXCLUDED.address),
        business_type = COALESCE(company_metadata.business_type, EXCLUDED.business_type),
        industries_served = COALESCE(company_metadata.industries_served, EXCLUDED.industries_served),
        export_markets = COALESCE(company_metadata.export_markets, EXCLUDED.export_markets),
        manufacturing_capacity = COALESCE(company_metadata.manufacturing_capacity, EXCLUDED.manufacturing_capacity),
        annual_turnover = COALESCE(company_metadata.annual_turnover, EXCLUDED.annual_turnover),
        employee_count = COALESCE(company_metadata.employee_count, EXCLUDED.employee_count),
        contact_email = COALESCE(company_metadata.contact_email, EXCLUDED.contact_email),
        contact_phone = COALESCE(company_metadata.contact_phone, EXCLUDED.contact_phone),
        linkedin_url = COALESCE(company_metadata.linkedin_url, EXCLUDED.linkedin_url),
        extracted_from_urls = EXCLUDED.extracted_from_urls,
        extraction_notes = EXCLUDED.extraction_notes,
        updated_at = NOW()
        """,
        company_id,
        data.get("tagline"),
        data.get("city"),
        data.get("address"),
        data.get("business_type"),
        data.get("industries_served"),
        data.get("export_markets"),
        data.get("manufacturing_capacity"),
        data.get("annual_turnover"),
        data.get("employee_count"),
        data.get("contact_email"),
        data.get("contact_phone"),
        data.get("linkedin_url"),
        data.get("extracted_from_urls"),
        data.get("extraction_notes")
    )

async def upsert_research_preferences(conn, user_id: str, data):
    try:
        # ✅ FIX: convert Pydantic → dict
        certifications_json = None

        if data.certifications:
            try:
                if hasattr(data.certifications, "dict"):
                    certifications_json = json.dumps(data.certifications.dict(exclude_none=True))
                elif isinstance(data.certifications, (dict, list)):
                    certifications_json = json.dumps(data.certifications)
                elif isinstance(data.certifications, str):
                    certifications_json = json.dumps({"value": data.certifications})
            except Exception:
                certifications_json = None

        query = """
        INSERT INTO core_tables.user_research_preferences (
            user_id,
            goals,
            buyer_type,
            price_positioning,
            monthly_supply_capacity,
            target_country,
            certifications
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)

        ON CONFLICT (user_id)
        DO UPDATE SET
            goals = EXCLUDED.goals,
            buyer_type=EXCLUDED.buyer_type,
            price_positioning = EXCLUDED.price_positioning,
            monthly_supply_capacity = EXCLUDED.monthly_supply_capacity,
            target_country = EXCLUDED.target_country,
            certifications = EXCLUDED.certifications,
            updated_at = NOW()
        """

        target_country = data.target_country
        if isinstance(target_country, list):
            target_country = json.dumps(target_country)

        price_positioning = data.price_positioning
        if isinstance(price_positioning, list):
            price_positioning = json.dumps(price_positioning)

        await conn.execute(
            query,
            user_id,
            data.goals,
            data.buyer_type,
            price_positioning,
            data.monthly_supply_capacity,
            target_country,
            certifications_json
        )

    except Exception as e:
        print("UPSERT PREFERENCES ERROR:", str(e))
        raise

async def insert_selected_products(conn, user_id, company_id, products):

    query = """
        INSERT INTO product_info.product_master (
            id,
            company_id,
            product_name,
            category,
            subcategory,
            description,
            packaging,
            certifications,
            moq,
            hs_code,
            ingredients_materials,
            specifications,
            variants,
            images,
            monthly_capacity,
            source_url,
            confidence_score,
            confidence_tier,
            extraction_notes,
            is_ready,
            is_selected,
            created_by,
            data_source
        )
        VALUES (
            gen_random_uuid(),
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,
            $19,$20,$21,$22
        )
    """

    for p in products:
        await conn.execute(
            query,
            company_id,
            p.product_name,
            p.category,
            p.subcategory,
            p.description,
            p.packaging,
            p.certifications or [],   # ✅ FIX
            p.moq,
            p.hs_code,
            json.dumps(p.ingredients) if p.ingredients else None,
            json.dumps(p.specifications or {}),   # ✅ FIX
            p.variants or [],         # ✅ FIX
            p.images or [],           # ✅ FIX
            p.monthly_capacity,
            p.source_url,
            p.confidence_score,
            p.confidence_tier,
            p.extraction_notes,
            True,
            True,
            user_id,
            "pipeline"
        )

import json

async def insert_selected_products_v2(conn, user_id, company_id, rows, job_id):

    query = """
        INSERT INTO product_info.product_master (
            id,
            company_id,
            product_name,
            category,
            subcategory,
            description,
            packaging,
            certifications,
            moq,
            hs_code,
            ingredients_materials,
            specifications,
            variants,
            images,
            monthly_capacity,
            source_url,
            confidence_score,
            confidence_tier,
            extraction_notes,
            is_ready,
            is_selected,
            created_by,
            data_source,
            job_id
        )
        VALUES (
            gen_random_uuid(),
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,$19,
            $20,$21,$22,$23
        )
        ON CONFLICT (company_id, product_name, created_by) DO NOTHING
    """

    inserted_count = 0

    for r in rows:
        raw = r["product_data"]
        p = json.loads(raw) if isinstance(raw, str) else raw
        base_name = p.get("product_name") or "Untitled Product"

        # Make product_name unique within this company+user scope
        product_name = base_name
        counter = 1
        while True:
            exists = await conn.fetchval("""
                SELECT 1 FROM product_info.product_master
                WHERE company_id = $1 AND product_name = $2 AND created_by = $3
                LIMIT 1
            """, company_id, product_name, user_id)
            if not exists:
                break
            counter += 1
            product_name = f"{base_name} ({counter})"

        await conn.execute(
            query,
            company_id,                          # $1
            product_name,                        # $2
            p.get("category"),                   # $3
            p.get("subcategory"),                # $4
            p.get("description"),                # $5
            p.get("packaging"),                  # $6
            p.get("certifications", []),         # $7
            p.get("moq"),                        # $8
            p.get("hs_code"),                    # $9
            json.dumps(p.get("ingredients")) if p.get("ingredients") else None,  # $10
            json.dumps(p.get("specifications") or {}),  # $11
            p.get("variants", []),               # $12
            p.get("images", []),                 # $13
            p.get("monthly_capacity"),           # $14
            p.get("source_url"),                 # $15
            p.get("confidence_score"),           # $16
            p.get("confidence_tier"),            # $17
            p.get("extraction_notes"),           # $18
            True,                                # $19 → is_ready
            True,                                # $20 → is_selected
            user_id,                             # $21 → created_by
            "pipeline",                          # $22 → data_source
            job_id                               # $23 → job_id
        )

        inserted_count += 1

    return inserted_count

async def update_product_status_to_processing(conn, user_id, company_id):
    query = """
        UPDATE product_info.product_master
        SET status = 'processing',
            updated_at = NOW(),
            updated_by = $1
        WHERE company_id = $2
        AND is_selected = TRUE
        AND (status IS NULL OR status='pending')
    """

    await conn.execute(query, user_id, company_id)

async def store_pipeline_temp(conn, user_id, job_id, products):
    for p in products:

        # 🔥 HANDLE BOTH CASES
        if isinstance(p, dict):
            product_data = p
        else:
            product_data = p.__dict__

        await conn.execute("""
            INSERT INTO product_info.pipeline_temp_products (
                id,
                user_id,
                job_id,
                product_data,
                is_selected,
                status,
                created_at,
                updated_at
            )
            VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
        """,
            str(uuid.uuid4()),
            user_id,
            job_id,
            json.dumps(product_data, default=str),
            False,
            'pending'
        )