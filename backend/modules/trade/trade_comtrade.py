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

COMTRADE_API_KEY = os.getenv("COMTRADE_API_KEY", "6cd03a973c53469c9fbf057ac6cc9e1d")
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
            if not entry.get("isGroup", False)
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

def _sync_fetch(hs_code: str, reporter_code: str, flow: str, period: str) -> dict:
    """Synchronous Comtrade API call. Always run via run_in_executor."""
    params = {
        "cmdCode":       hs_code,
        "reporterCode":  reporter_code,
        "partnerCode":   "0",
        "flowCode":      flow,
        "period":        period,
        "aggregateBy":   "cmdCode",
        "format":        "JSON",
        "maxRecords":    50000,
    }
    headers = {"Ocp-Apim-Subscription-Key": COMTRADE_API_KEY}
    r = requests.get(BASE_URL, params=params, headers=headers, timeout=30)
    r.raise_for_status()
    return r.json()


def _aggregate(data: dict) -> dict:
    """Sums primaryValue and qty/netWgt across all rows in a Comtrade response."""
    total_value = 0.0
    total_qty   = 0.0
    for row in data.get("data", []):
        total_value += row.get("primaryValue", 0) or 0
        qty = row.get("qty") or row.get("netWgt") or 0
        total_qty += qty
    avg_price = total_value / total_qty if total_qty else 0.0
    return {
        "value_usd": total_value,
        "volume_mt":  total_qty,
        "avg_price":  avg_price,
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
        years = [2020, 2021, 2022, 2023, 2024]

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
