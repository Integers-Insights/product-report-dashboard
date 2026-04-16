"""
modules/trade_intel.py
-----------------------
Module 4 — Trade Intelligence

Researches global trade data for a product from the exporter's origin country.
One Sonar call per product (not per country like market_demand).

Output — one DB row per product:
    hs_code                  → HS code used for research
    origin_country           → dynamic — which country's export data to show
    global_trade_value       → global trade value + YoY growth
    volume_traded_globally   → global volume in MT + YoY growth
    avg_global_trade_price   → avg price per kg + context (commodity vs organic)
    country_export_share     → origin country's % share of global exports
    top_exporters            → top exporting countries with volumes + share
    top_importers            → top importing countries with volumes + growth
    export_volume_trend      → origin country's export trend (last 4 years)
    export_pricing_commod    → commodity vs certified pricing comparison
    analysis_note            → generated insight (what this means for the exporter)

DB table: product_info.trade_intelligence
One row per product.
"""

from modules.base_module import BaseModule, ModuleInput, ModuleResult


# ─────────────────────────────────────────────
#  SONAR RESEARCH QUERY
# ─────────────────────────────────────────────

TRADE_RESEARCH_QUERY = """
Provide global trade data for {category} — specifically HS code {hs_code} 
({product_name} and similar products) — with a focus on {origin_country} 
as an exporting country. Use WITS(world integrated trade solution) ITC Trade Map, UN Comtrade, or DGFT data as refernce.

Use these sources in order of preference:
1. WITS World Bank — https://wits.worldbank.org/trade/comtrade/en/country/ALL/year/2024/tradeflow/Exports/partner/WLD/product/{hs_code}
2. ITC Trade Map — https://www.trademap.org/tradestat/Product_SelProductCountry.aspx?nvpm=1|||{hs_code}
3. UN Comtrade — https://comtradeplus.un.org/TradeFlow?Frequency=A&Flows=X&CommodityCodes={hs_code}&Partners=0&Reporters=all&period=2024&AggregateBy=none
4. DGFT India — https://www.dgft.gov.in (for India-specific export data)

I need estimates for 2022-2024. If exact figures for the sub-category are 
unavailable, provide the best available data for the HS chapter or broader 
category and note the scope.
 
1. GLOBAL TRADE VALUE
   - Total global import/export value in USD (2023 or 2024)
   - Year-over-year growth rate
 
2. GLOBAL VOLUME TRADED
   - Total volume traded globally (metric tons, 2023 or 2024)
   - Year-over-year growth
 
3. AVERAGE TRADE PRICE (FOB from {origin_country})
   - Average price per kg for standard/commodity grade
   - Average price per kg for certified/organic/premium grade
   - What drives the premium (certifications, craftsmanship, etc.)
 
4. {origin_country} EXPORT SHARE
   - {origin_country}'s share (%) of global exports for HS {hs_code}{product_name}
   - Trend over the past 3 years (growing / stable / declining)
 
5. TOP EXPORTING COUNTRIES
   - Top 4-5 countries by export value (USD) or volume (MT) in 2023-2024 for {hs_code}
   - Each country's approximate percentage share
 
6. TOP IMPORTING COUNTRIES
   - Top 5 countries by import value or volume in 2023-2024
   - Year-over-year growth for each
 
7. {origin_country} EXPORT VOLUME TREND
   - Annual export values or volumes from {origin_country} for 2021, 2022, 2023, 2024
   - Year-over-year growth %
 
8. PRICING TIERS (FOB from {origin_country})
   - Commodity/standard price range (USD/kg)
   - Certified/organic/handcrafted price range (USD/kg)
 
Exporter context: {origin_country}-based {business_type}, 
certifications: {certifications}, price positioning: {price_positioning}.
 
Provide real numbers wherever available. Use ranges or estimates rather 
than declining to answer — note confidence level if data is partial.
"""


# ─────────────────────────────────────────────
#  EXTRACTION PROMPT
# ─────────────────────────────────────────────

EXTRACTION_PROMPT = """
Extract structured trade intelligence data from the research below.

Product: {product_name}
HS Code: {hs_code}
Origin country: {origin_country}

Research text:
{sonar_response}

Return a JSON object with EXACTLY these fields:

{{
  "global_trade_value": {{
    "value_usd": "string or null — e.g. '$840M' or '$1.2B'",
    "year": integer or null,
    "yoy_growth": "string or null — e.g. '+11%'"
  }},
  "volume_traded_globally": {{
    "value_mt": "string or null — e.g. '320000' or '320K'",
    "year": integer or null,
    "yoy_growth": "string or null — e.g. '+8%'"
  }},
  "avg_global_trade_price": {{
    "price_per_kg": "string or null — e.g. '$2.63/kg'",
    "context": "string or null — e.g. 'Commodity avg, non-certified'"
  }},
  "country_export_share": {{
    "country": "{origin_country}",
    "share_pct": "string or null — e.g. '12%'",
    "trend": "string or null — e.g. 'Growing from 9% in 2021'"
  }},
  "top_exporters": [
    {{
      "country": "string",
      "trad_value": "string or null",
      "share_pct": "string or null"
    }}
  ],
  "top_importers": [
    {{
      "country": "string",
      "volume_mt": "string or null",
      "yoy_growth": "string or null"
    }}
  ],
  "export_volume_trend": [
    {{
      "year": integer,
      "volume_mt": "string or null — e.g. '148K MT' or '148000 MT'",
      "yoy_growth": "string or null — e.g. '+14%'",
      "label": "string or null — e.g. 'Baseline' for first year"
    }}
  ],
  "export_pricing_commod": {{
    "commodity": {{
      "price_range": "string or null — e.g. '$1.20-$2.80/kg FOB'",
      "context": "string or null — e.g. 'High volume, race-to-bottom pricing'"
    }},
    "certified": {{
      "price_range": "string or null — e.g. '$8-$16/kg FOB'",
      "context": "string or null — e.g. '5-7x commodity floor'"
    }}
  }}
}}

Rules:
- top_exporters and top_importers: up to 5 entries each
- export_volume_trend: 4 entries (2021-2024) — use null values if year data missing
- NEVER guess or hallucinate numbers — use null if data was not in the research
- Year fields must be integers. All other numeric values stay as strings.
- Do not include any explanation outside the JSON object.

"""


# ─────────────────────────────────────────────
#  TRADE INTEL MODULE
# ─────────────────────────────────────────────

class TradeIntelModule(BaseModule):
    """
    Module 4 — Trade Intelligence

    One Sonar call per product.
    Returns a single ModuleResult with all global + origin trade data.
    """

    def module_name(self) -> str:
        return "trade_intel"

    def build_query(self, inp: ModuleInput) -> str:
        
        return TRADE_RESEARCH_QUERY.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            origin_country=inp.origin_country,
            category=inp.category,
            business_type=inp.business_type,
            certifications=inp.cert_string(),
            price_positioning=getattr(inp, "price_positioning", "standard")
        ).strip()

    def build_extraction_prompt(self, inp: ModuleInput, sonar_response: str) -> str:
        # print(sonar_response)
        return EXTRACTION_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            origin_country=inp.origin_country,
            sonar_response=sonar_response,
        ).strip()

    def empty_result(self) -> dict:
        return {
            "global_trade_value":     None,
            "volume_traded_globally": None,
            "avg_global_trade_price": None,
            "country_export_share":   None,
            "top_exporters":          None,
            "top_importers":          None,
            "export_volume_trend":    None,
            "export_pricing_commod":  None,
        }

    # ── DB row builder ───────────────────────────────

    @staticmethod
    def to_db_row(result: ModuleResult, product_id: str, inp: ModuleInput) -> dict:
        """
        Maps ModuleResult to trade_intelligence table columns.
        One row per product.
        """
        d = result.data
        return {
            "product_id":             product_id,
            "hs_code":                inp.hs_code or "",
            "origin_country":         inp.origin_country,
            "global_trade_value":     d.get("global_trade_value"),
            "volume_traded_globally": d.get("volume_traded_globally"),
            "avg_global_trade_price": d.get("avg_global_trade_price"),
            "country_export_share":   d.get("country_export_share"),
            "top_exporters":          d.get("top_exporters"),
            "top_importers":          d.get("top_importers"),
            "export_volume_trend":    d.get("export_volume_trend"),
            "export_pricing_commod":  d.get("export_pricing_commod"),
            "analysis_note":          d.get("analysis_note"),
        }