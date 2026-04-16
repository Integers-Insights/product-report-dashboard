async def get_company_id(conn, company_name: str):

    row = await conn.fetchrow(
        """
        SELECT id
        FROM core_tables.companies_other
        WHERE LOWER(name) = LOWER($1)
        """,
        company_name
    )

    if not row:
        raise ValueError("Company not found")

    return str(row["id"])

async def get_company_name_by_user(conn, user_id):
    row = await conn.fetchrow(
        """
        SELECT c.name
        FROM core_auth_table.auth_user u
        JOIN core_tables.companies_other c
        ON u.companies_other_id = c.id
        WHERE u.user_id = $1
        """,
        user_id
    )

    return row["name"]