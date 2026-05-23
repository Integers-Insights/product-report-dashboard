"""
modules/trade/comtrade_cache.py
--------------------------------
DB-backed cache for UN Comtrade API responses.

TTL      : 1 year  (Comtrade data is annual — safe to cache long-term)
Table    : product_info.comtrade_cache
Key      : hs_code + reporter_code + flow + period + partner_code

get_comtrade_cache → returns the cached raw API dict, or None if expired/missing
set_comtrade_cache → upserts the response with a 1-year expiry
"""

import json
import logging
from typing import Optional

log = logging.getLogger(__name__)


def _make_key(
    hs_code:       str,
    reporter_code: str,
    flow:          str,
    period:        str,
    partner_code:  str,
) -> str:
    return f"{hs_code}:{reporter_code}:{flow}:{period}:{partner_code}"


async def get_comtrade_cache(
    pool,
    hs_code:       str,
    reporter_code: str,
    flow:          str,
    period:        str,
    partner_code:  str = "0",
    product_name:  "str | None" = None,
) -> Optional[dict]:
    """Return the cached Comtrade API response, or None if missing / expired."""
    if pool is None:
        return None

    key = _make_key(hs_code, reporter_code, flow, period, partner_code)
    try:
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                SELECT data
                FROM   product_info.comtrade_cache
                WHERE  cache_key = $1
                  AND  expires_at > NOW()
                """,
                key,
            )
        if row:
            print(f"     ✅ [comtrade_cache] HIT  {key}")
            return json.loads(row["data"])
    except Exception as e:
        log.warning(f"[comtrade_cache] GET failed: {e}")

    return None


async def set_comtrade_cache(
    pool,
    hs_code:       str,
    reporter_code: str,
    flow:          str,
    period:        str,
    partner_code:  str,
    data:          dict,
    product_name:  "str | None" = None,
) -> None:
    """Upsert a Comtrade API response with a 1-year TTL."""
    if pool is None:
        return

    key = _make_key(hs_code, reporter_code, flow, period, partner_code)
    try:
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO product_info.comtrade_cache
                    (cache_key, hs_code, reporter_code, flow, period, partner_code, product_name, data, expires_at)
                VALUES
                    ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, NOW() + INTERVAL '1 year')
                ON CONFLICT (cache_key) DO UPDATE SET
                    product_name = COALESCE(EXCLUDED.product_name, product_info.comtrade_cache.product_name),
                    data         = EXCLUDED.data,
                    expires_at   = EXCLUDED.expires_at,
                    created_at   = NOW()
                """,
                key,
                hs_code,
                reporter_code,
                flow,
                period,
                partner_code,
                product_name,
                json.dumps(data),
            )
        print(f"     💾 [comtrade_cache] SET  {key}")
    except Exception as e:
        log.warning(f"[comtrade_cache] SET failed: {e}")
