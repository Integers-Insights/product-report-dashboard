from modules.base_module import ModuleInput

async def fetch_module_inputs(conn, company_id):
    rows = await conn.fetch("""
        SELECT 
            pm.id as product_id,
            pm.product_name,
            pm.category,
            pm.hs_code,
            pm.description,
            pm.moq,
            cr.certifications,
            co.name as company_name,
            co.headquarters_country,
            co.company_type,
            ur.price_positioning,
            ur.buyer_type,
            ur.target_country
        FROM core_tables.companies_other co
        LEFT JOIN product_info.company_preferences cr
            ON co.id = cr.company_id
        LEFT JOIN product_info.product_master pm
            ON pm.company_id = co.id
        left join core_tables.user_research_preferences ur
            on ur.user_id = pm.created_by
        WHERE co.id = $1
        AND pm.is_selected = TRUE
    """, company_id)

    return rows

def build_module_inputs(rows):
    inputs = []

    for r in rows:
        inp = ModuleInput(
            product_id=str(r.get("product_id")),
            product_name=r.get("product_name"),
            category=r.get("category"),
            hs_code=r.get("hs_code"),
            description=r.get("description"),
            certifications=r.get("certifications") or [],
            origin_country=r.get("headquarters_country") or " ",
            target_country=r.get("target_country"),
            company_name=r.get("company_name"),
            business_type=r.get("company_type"),
            price_positioning=r.get("price_positioning"),
            moq=r.get("moq"),
            buyer_type=r.get("buyer_type"),
        )
        inputs.append(inp)

    return inputs