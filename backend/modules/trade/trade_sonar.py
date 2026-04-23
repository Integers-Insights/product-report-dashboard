"""
modules/trade/trade_sonar.py
-----------------------------
Sonar + GPT functions for trade intelligence.
Used by trade_intel.py.

Three public async functions:
    fetch_global_overview(inp, company_id, report_id)
        → Sonar search + GPT extraction
        → {global_trade_value, volume_traded_globally, avg_global_trade_price}

    fetch_country_names(inp, company_id, report_id)
        → Sonar search + GPT extraction
        → {country_export_share, top_exporter_names, top_importer_names}
          (names only — Comtrade fetches the actual volumes)

    fetch_pricing_gpt(inp, company_id, report_id)
        → GPT training knowledge only, no Sonar
        → {export_pricing_commod}
"""

import json
from modules.base_module import call_sonar, call_openai
from input_pipeline.config import LLM
from modules.trade.trade_prompts import (
    QUERY_GLOBAL_OVERVIEW,  EXTRACT_GLOBAL_OVERVIEW,
    QUERY_COUNTRY_NAMES,    EXTRACT_COUNTRY_NAMES,
    PRICING_GPT_PROMPT,
)

MODULE = "trade_intel"


# ─────────────────────────────────────────────
#  FETCH GLOBAL OVERVIEW
# ─────────────────────────────────────────────

async def fetch_global_overview(inp, company_id, report_id) -> dict:
    """
    Sonar: global trade value (USD), volume (MT), avg price/kg — with YoY.
    Returns dict with keys: global_trade_value, volume_traded_globally, avg_global_trade_price.
    Returns {} on failure.
    """
    hs   = inp.hs_code or "unknown"
    prod = inp.product_name

    query = QUERY_GLOBAL_OVERVIEW.format(product_name=prod, hs_code=hs).strip()

    sonar_text = await call_sonar(
        query,
        call_type="trade_global_overview",
        module=MODULE,
        company_id=company_id,
        report_id=report_id,
        product_id=inp.product_id,
    )
    if not sonar_text:
        print("  ⚠️  [trade_sonar] Global overview Sonar call returned nothing")
        return {}

    prompt = EXTRACT_GLOBAL_OVERVIEW.format(
        product_name=prod,
        hs_code=hs,
        sonar_response=sonar_text,
    ).strip()

    raw = await call_openai(
        model=LLM["extraction_model"],
        messages=[{"role": "user", "content": prompt}],
        max_tokens=400,
        temperature=0.0,
        call_type="trade_extract_overview",
        module=MODULE,
        company_id=company_id,
        report_id=report_id,
        product_id=inp.product_id,
        response_format={"type": "json_object"},
    )

    try:
        return json.loads(raw) if raw else {}
    except Exception:
        return {}


# ─────────────────────────────────────────────
#  FETCH COUNTRY NAMES
# ─────────────────────────────────────────────

async def fetch_country_names(inp, company_id, report_id) -> dict:
    """
    Sonar: top 5 exporter names, top 5 importer names, origin country share %.
    Returns dict with keys: country_export_share, top_exporter_names, top_importer_names.
    Returns {} on failure.
    """
    hs   = inp.hs_code or "unknown"
    prod = inp.product_name
    orig = inp.origin_country

    query = QUERY_COUNTRY_NAMES.format(
        product_name=prod,
        hs_code=hs,
        origin_country=orig,
    ).strip()

    sonar_text = await call_sonar(
        query,
        call_type="trade_country_names",
        module=MODULE,
        company_id=company_id,
        report_id=report_id,
        product_id=inp.product_id,
    )
    if not sonar_text:
        print("  ⚠️  [trade_sonar] Country names Sonar call returned nothing")
        return {}

    prompt = EXTRACT_COUNTRY_NAMES.format(
        product_name=prod,
        hs_code=hs,
        origin_country=orig,
        sonar_response=sonar_text,
    ).strip()

    raw = await call_openai(
        model=LLM["extraction_model"],
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.0,
        call_type="trade_extract_country_names",
        module=MODULE,
        company_id=company_id,
        report_id=report_id,
        product_id=inp.product_id,
        response_format={"type": "json_object"},
    )

    try:
        return json.loads(raw) if raw else {}
    except Exception:
        return {}


# ─────────────────────────────────────────────
#  FETCH PRICING (GPT ONLY)
# ─────────────────────────────────────────────

async def fetch_pricing_gpt(inp, company_id, report_id) -> dict:
    """
    GPT training knowledge: commodity vs certified FOB price ranges from origin country.
    No Sonar call — GPT has reliable pricing knowledge for commodity markets.
    Returns dict with key: export_pricing_commod.
    Returns {} on failure.
    """
    prompt = PRICING_GPT_PROMPT.format(
        product_name=inp.product_name,
        hs_code=inp.hs_code or "unknown",
        origin_country=inp.origin_country,
        business_type=getattr(inp, "business_type", "Exporter"),
        certifications=inp.cert_string() if hasattr(inp, "cert_string") else "",
        price_positioning=getattr(inp, "price_positioning", "standard"),
    ).strip()

    raw = await call_openai(
        model=LLM["extraction_model"],
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.0,
        call_type="trade_pricing_gpt",
        module=MODULE,
        company_id=company_id,
        report_id=report_id,
        product_id=inp.product_id,
        response_format={"type": "json_object"},
    )

    try:
        return json.loads(raw) if raw else {}
    except Exception:
        return {}
