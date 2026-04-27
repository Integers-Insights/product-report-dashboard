"""
modules/trade/trade_comtrade.py
--------------------------------
UN Comtrade API client for trade intelligence.

Three public async functions used by trade_intel.py:
    get_reporter_code(country_name)  → int | None
    fetch_traders(hs_code, countries, flow, year)  → list[dict]
    fetch_origin_trend(hs_code, origin_country, years)  → list[dict]

Rate limit: free tier allows ~1 req/sec — 1.2s sleep between calls.
All HTTP calls are wrapped in run_in_executor to keep the pipeline non-blocking.
"""

import json
import asyncio
import os
import requests
from pathlib import Path

COMTRADE_API_KEY = os.getenv("COMTRADE_API_KEY")
BASE_URL = "https://comtradeapi.un.org/data/v1/get/C/A/HS"
SLEEP_SEC = 1.2

_REPORTER_MAP: "dict | None" = None


# ─────────────────────────────────────────────
#  COUNTRY CODE LOOKUP
# ─────────────────────────────────────────────

def _load_reporter_map() -> dict:
    global _REPORTER_MAP
    if _REPORTER_MAP is None:
        path = Path(__file__).parent / "reporterscode.json"
        data = json.loads(path.read_text())
        _REPORTER_MAP = {
            entry["reporterDesc"].lower(): entry["reporterCode"]
            for entry in data["results"]
        }
    return _REPORTER_MAP


_ALIASES = {
    "united states":         "usa",
    "united states of america": "usa",
    "us":                    "usa",
    "south korea":           "rep. of korea",
    "korea":                 "rep. of korea",
    "taiwan":                "china, taiwan province of",
    "russia":                "russian federation",
    "iran":                  "iran (islamic republic of)",
    "syria":                 "syrian arab republic",
    "bolivia":               "bolivia (plurinational state of)",
    "tanzania":              "united republic of tanzania",
    "czech republic":        "czechia",
    "laos":                  "lao people's dem. rep.",
    "vietnam":               "viet nam",
    "europe":                "european union",
    "eu":                    "european union",
    "russia":                "russian federation",
    "uae":                   "united arab emirates"
}


def get_reporter_code(country_name: str) -> "int | None":
    """
    Maps a country name string to a UN Comtrade reporter code.
    Checks aliases first, then exact match, then substring match.
    Returns None if no match found (country not in Comtrade).
    """
    if not country_name or not isinstance(country_name, str):
        return None
    m    = _load_reporter_map()
    name = country_name.lower().strip()

    name = _ALIASES.get(name, name)

    if name in m:
        return m[name]

    for key, code in m.items():
        if name in key or key in name:
            return code

    return None


# ─────────────────────────────────────────────
#  INTERNAL HTTP + AGGREGATION
# ─────────────────────────────────────────────

def _sync_fetch(
    hs_code:      str,
    reporter_code: str,
    flow:          str,
    period:        str,
    partner_code:  str = "0",
) -> dict:
    """Synchronous Comtrade API call. Always run via run_in_executor."""
    params = {
        "cmdCode":      hs_code,
        "reporterCode": reporter_code,
        "partnerCode":  partner_code,
        "flowCode":     flow,
        "period":       period,
        "aggregateBy":  "cmdCode",
        "motCode":      "0",    # Total modes of transport — avoids row duplication
        "customsCode":  "C00",  # Total customs procedure — avoids row duplication
        "format":       "JSON",
        "maxRecords":   50000,
    }
    headers = {"Ocp-Apim-Subscription-Key": COMTRADE_API_KEY}
    r = requests.get(BASE_URL, params=params, headers=headers, timeout=30)
    r.raise_for_status()
    return r.json()


def _aggregate(data: dict) -> dict:
    """
    Extracts SINGLE correct row (avoids duplication).
    """

    rows = data.get("data", [])
    if not rows:
        return {"value_usd": 0.0, "volume_mt": 0.0, "avg_price": 0.0}

    # 🔥 Pick the row with MAX value (this is the true total)
    best_row = max(rows, key=lambda r: r.get("primaryValue", 0) or 0)

    value = (
        best_row.get("primaryValue")
        or best_row.get("fobvalue")
        or best_row.get("cifvalue")
        or 0
    )

    qty = (
        best_row.get("qty")
        or best_row.get("netWgt")
        or best_row.get("grossWgt")
        or 0
    )

    avg_price = value / qty if qty else 0.0

    return {
        "value_usd": value,
        "volume_mt": qty,
        "avg_price": avg_price,
    }


# ─────────────────────────────────────────────
#  FETCH TOP EXPORTERS / IMPORTERS
# ─────────────────────────────────────────────

async def fetch_traders(
    hs_code:   str,
    countries: list,
    flow:      str,
    year:      str = "2023",
) -> list:
    """
    Fetches Comtrade data for a list of country names.

    Args:
        hs_code:   HS code string, e.g. "091030"
        countries: List of country name strings (from Sonar)
        flow:      "X" for exports, "M" for imports
        year:      Trade year, e.g. "2023"

    Returns:
        List of dicts: {country, value_usd, volume_mt, share_pct}
        Countries with no reporter code are included with null values.
        Calls are serialized with 1.2s sleep to respect rate limits.
    """
    loop      = asyncio.get_event_loop()
    results   = []
    total_value = 0.0
    countries = [c for c in countries if c and isinstance(c, str)]

    for country in countries:
        code = get_reporter_code(country)
        if code is None:
            print(f"     ⚠️  [comtrade] No reporter code for '{country}' — skipping")
            results.append({"country": country, "value_usd": None, "volume_mt": None})
            continue

        try:
            raw     = await loop.run_in_executor(None, _sync_fetch, hs_code, str(code), flow, year)
            metrics = _aggregate(raw)
            results.append({"country": country, "value_usd": metrics["value_usd"], "volume_mt": metrics["volume_mt"]})
            total_value += metrics["value_usd"]
            print(f"     → [comtrade] {country}: ${metrics['value_usd']:,.0f} | {metrics['volume_mt']:,.0f} MT")
        except Exception as e:
            print(f"     ⚠️  [comtrade] {country} ({year}) failed: {e}")
            results.append({"country": country, "value_usd": None, "volume_mt": None})

        await asyncio.sleep(SLEEP_SEC)

    # Add share_pct relative to total across fetched countries
    for r in results:
        if r.get("value_usd") and total_value:
            r["share_pct"] = round(r["value_usd"] / total_value * 100, 1)
        else:
            r["share_pct"] = None

    return results


# ─────────────────────────────────────────────
#  FETCH ORIGIN COUNTRY EXPORT TREND
# ─────────────────────────────────────────────

async def fetch_origin_trend(
    hs_code:        str,
    origin_country: str,
    years:          "list | None" = None,
) -> list:
    """
    Fetches annual export data for origin_country over multiple years.

    Args:
        hs_code:        HS code string
        origin_country: Country name, e.g. "India"
        years:          List of ints, defaults to [2020, 2021, 2022, 2023, 2024]

    Returns:
        List of dicts: {year, value_usd, volume_mt, yoy_growth}
        yoy_growth is computed from consecutive volume_mt values.
        Calls are serialized with 1.2s sleep to respect rate limits.
    """
    if years is None:
        years = [2019, 2020, 2021, 2022, 2023, 2024]

    code = get_reporter_code(origin_country)
    if code is None:
        print(f"  ⚠️  [comtrade] No reporter code for origin '{origin_country}'")
        return [{"year": y, "value_usd": None, "volume_mt": None, "yoy_growth": None} for y in years]

    loop     = asyncio.get_event_loop()
    entries  = []
    prev_vol: "float | None" = None

    for year in years:
        try:
            raw     = await loop.run_in_executor(None, _sync_fetch, hs_code, str(code), "X", str(year))
            metrics = _aggregate(raw)
            vol     = metrics["volume_mt"]

            yoy = None
            if prev_vol and prev_vol > 0 and vol:
                yoy_pct = round((vol - prev_vol) / prev_vol * 100, 1)
                yoy     = f"{'+' if yoy_pct >= 0 else ''}{yoy_pct}%"

            entries.append({
                "year":       year,
                "value_usd":  metrics["value_usd"],
                "volume_mt":  vol,
                "yoy_growth": yoy,
            })
            if vol:
                prev_vol = vol
            print(f"     → [comtrade] {origin_country} {year}: {vol:,.0f} MT")
        except Exception as e:
            print(f"     ⚠️  [comtrade] {origin_country} {year} failed: {e}")
            entries.append({"year": year, "value_usd": None, "volume_mt": None, "yoy_growth": None})

        await asyncio.sleep(SLEEP_SEC)

    return entries


# ─────────────────────────────────────────────
#  FETCH ORIGIN EXPORT SHARE IN TARGET MARKETS
# ─────────────────────────────────────────────

_DEFAULT_TARGET_MARKETS = [
    "United States", "Germany", "United Kingdom", "Netherlands", "Japan"
]


async def fetch_origin_export_share(
    hs_code:          str,
    origin_country:   str,
    target_countries: "list | None" = None,
    year:             str = "2023",
) -> dict:
    """
    Calculates origin_country's export share across target markets.

    For each target country:
        - Fetch that country's total imports (partner=world)
        - Fetch that country's imports from origin specifically (partner=origin_code)
        - share = origin_imports / total_imports

    Aggregated share = sum(origin_imports) / sum(total_imports) across all targets.

    Args:
        hs_code:          HS code string
        origin_country:   Exporting country, e.g. "India"
        target_countries: List of target market names; defaults to top 5 global importers
        year:             Trade year

    Returns:
        {
          "share_pct":   "64.2%",
          "per_country": [{"country": "United States", "share_pct": "71.3%"}, ...]
        }
    """
    if not target_countries:
        target_countries = _DEFAULT_TARGET_MARKETS

    origin_code = get_reporter_code(origin_country)
    if not origin_code:
        print(f"  ⚠️  [comtrade] No reporter code for origin '{origin_country}'")
        return {}

    loop                   = asyncio.get_event_loop()
    total_world_value      = 0.0
    total_origin_value     = 0.0
    per_country: list      = []

    for target in target_countries:
        target_code = get_reporter_code(target)
        if not target_code: 
            print(f"     ⚠️  [comtrade] No reporter code for target '{target}' — skipping")
            continue

        try:
            # Call 1: target country's total imports from world
            world_raw   = await loop.run_in_executor(
                None, _sync_fetch, hs_code, str(target_code), "M", year, "0"
            )
            world_m     = _aggregate(world_raw)
            await asyncio.sleep(SLEEP_SEC)

            # Call 2: target country's imports from origin specifically
            origin_raw  = await loop.run_in_executor(
                None, _sync_fetch, hs_code, str(target_code), "M", year, str(origin_code)
            )
            origin_m    = _aggregate(origin_raw)
            await asyncio.sleep(SLEEP_SEC)

            share_pct = (
                round(origin_m["value_usd"] / world_m["value_usd"] * 100, 1)
                if world_m["value_usd"] else 0.0
            )
            per_country.append({"country": target, "share_pct": share_pct})
            total_world_value  += world_m["value_usd"]
            total_origin_value += origin_m["value_usd"]

            print(f"     → [comtrade] {origin_country} share in {target}: {share_pct}%")

        except Exception as e:
            print(f"     ⚠️  [comtrade] Export share for '{target}' failed: {e}")
            await asyncio.sleep(SLEEP_SEC)

    if not total_world_value:
        return {}

    agg_share = round(total_origin_value / total_world_value * 100, 1)
    print(f"     → [comtrade] {origin_country} aggregated export share: {agg_share}%")

    return {
        "share_pct":   f"{agg_share}%",
        "per_country": per_country,
    }
