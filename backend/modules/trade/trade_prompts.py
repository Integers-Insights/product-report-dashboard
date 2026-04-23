"""
modules/trade/trade_prompts.py
-------------------------------
All prompts for the Trade Intelligence module.

Sonar queries (4):
    QUERY_GLOBAL_OVERVIEW   → global trade value, volume, avg price
    QUERY_COUNTRY_SHARES    → top exporters / importers / origin share
    QUERY_ORIGIN_TREND      → origin country export volume 2021-2024
    QUERY_PRICING           → commodity vs certified FOB pricing

Extraction prompts (4, paired with Sonar queries above):
    EXTRACT_GLOBAL_OVERVIEW
    EXTRACT_COUNTRY_SHARES
    EXTRACT_ORIGIN_TREND
    EXTRACT_PRICING

GPT fallback prompts (3):
    TRADE_FALLBACK_PROMPT           → fills top-level null fields
    COUNTRY_METRICS_FALLBACK_PROMPT → fills null volume/share inside country lists
    TREND_GAPS_FALLBACK_PROMPT      → fills null volume_mt inside trend entries

Analyst note prompt (1):
    TRADE_ANALYST_NOTE_PROMPT
"""


# ─────────────────────────────────────────────
#  SONAR QUERY 1 — Global Trade Overview
# ─────────────────────────────────────────────

QUERY_GLOBAL_OVERVIEW = """
What is the total global trade value (USD), volume traded (metric tons),
and average FOB price per kg for {product_name} (HS code {hs_code}) in 2023-2024,
with year-over-year growth rates? Use ITC Trade Map, UN Comtrade, or WITS data.
"""

EXTRACT_GLOBAL_OVERVIEW = """
Extract from the research below.
Product: {product_name} | HS code: {hs_code}

Research:
{sonar_response}

Return JSON with EXACTLY these fields:
{{
  "global_trade_value": {{
    "value_usd": "string or null — e.g. '$840M' or '$1.2B'",
    "year": integer or null,
    "yoy_growth": "string or null — e.g. '+11'"
  }},
  "volume_traded_globally": {{
    "value_mt": "string or null — e.g. '320K' or '320000'",
    "year": integer or null,
    "yoy_growth": "string or null — e.g. '+8'"
  }},
  "avg_global_trade_price": {{
    "price_per_kg": "string or null — e.g. '$2.63/kg'",
    "context": "string or null — e.g. 'Commodity avg, non-certified'"
  }}
}}

Rules: set to null if not in the research. No text outside JSON.
"""


# ─────────────────────────────────────────────
#  SONAR QUERY 2 — Country Names Only
#  (Volumes/values come from UN Comtrade, not Sonar)
# ─────────────────────────────────────────────

QUERY_COUNTRY_NAMES = """
Who are the top 5 exporting countries and top 5 importing countries for
{product_name} (HS {hs_code}) in 2023-2024?
give countries and not regions
"""

EXTRACT_COUNTRY_NAMES = """
Extract from the research below.
Product: {product_name} | Origin: {origin_country}

Research:
{sonar_response}

Return JSON with EXACTLY these fields:
{{
  "top_exporter_names": ["country1", "country2", "country3", "country4", "country5"],
  "top_importer_names": ["country1", "country2", "country3", "country4", "country5"]
}}

Rules:
- top_exporter_names and top_importer_names: plain country name strings only, no data
- up to 5 names per list
- null if not found. No text outside JSON.
"""


# ─────────────────────────────────────────────
#  SONAR QUERY 3 — Origin Export Volume Trend
# ─────────────────────────────────────────────

QUERY_ORIGIN_TREND = """
What were {origin_country}'s annual export volumes for {product_name} (HS {hs_code})
for each year from 2021 to 2024, with year-over-year growth percentages?
Use DGFT, ITC Trade Map, or UN Comtrade data.
"""

EXTRACT_ORIGIN_TREND = """
Extract from the research below.
Product: {product_name} | Origin: {origin_country}

Research:
{sonar_response}

Return JSON with EXACTLY this field:
{{
  "export_volume_trend": [
    {{"year": 2021, "volume_mt": "string or null", "yoy_growth": null, "label": "Baseline"}},
    {{"year": 2022, "volume_mt": "string or null", "yoy_growth": "string or null", "label": "string "}},
    {{"year": 2023, "volume_mt": "string or null", "yoy_growth": "string or null", "label": "string "}},
    {{"year": 2024, "volume_mt": "string or null", "yoy_growth": "string or null", "label": "string "}}
  ]
}}

Rules:
- Always return all 4 year entries. Use null for volume_mt/yoy_growth if missing. No text outside JSON.
- label must ALWAYS be a non-null string for every year — never null
- assign a short 1-3 word contextual label based on your knowledge of
  what happened to this market that year , give the label according to the previous years data as well
"""


# ─────────────────────────────────────────────
#  SONAR QUERY 4 — Pricing Tiers
# ─────────────────────────────────────────────

# QUERY_PRICING = """
# What is the FOB export price range from {origin_country} for commodity-grade
# versus certified/organic {product_name} (HS {hs_code})?
# What drives the price premium for certified or premium grades?
# """

# EXTRACT_PRICING = """
# Extract from the research below.
# Product: {product_name} | Origin: {origin_country}

# Research:
# {sonar_response}

# Return JSON with EXACTLY this field:
# {{
#   "export_pricing_commod": {{
#     "commodity": {{
#       "price_range": "string or null — e.g. '$1.20-$2.80/kg FOB'",
#       "context": "string or null — e.g. 'High volume, race-to-bottom pricing'"
#     }},
#     "certified": {{
#       "price_range": "string or null — e.g. '$8-$16/kg FOB'",
#       "context": "string or null — e.g. '5-7x commodity floor'"
#     }}
#   }}
# }}

# Rules: null if not found. No text outside JSON.
# """


# ─────────────────────────────────────────────
#  GPT PROMPT — Pricing (no Sonar, training knowledge only)
# ─────────────────────────────────────────────

PRICING_GPT_PROMPT = """
You are a commodity trade pricing expert.

Based on your training knowledge, provide the typical FOB export price ranges
from {origin_country} for {product_name} (HS code: {hs_code}).

Return JSON with EXACTLY this structure:
{{
  "export_pricing_commod": {{
    "commodity": {{
      "price_range": "string or null — e.g. '$1.20-$2.80/kg FOB'",
      "context": "string or null — e.g. 'Standard grade, high volume buyers'"
    }},
    "certified": {{
      "price_range": "string or null — e.g. '$8-$16/kg FOB'",
      "context": "string or null — e.g. 'USDA Organic / fair-trade certified, 4-6x commodity'"
    }}
  }}
}}

Exporter context: {origin_country}-based {business_type},
certifications held: {certifications}, price positioning: {price_positioning}.

Rules:
- Use realistic price ranges based on actual market knowledge for {origin_country}
- If you don't have reliable data, set price_range to null — do not guess
- No text outside JSON
"""


# ─────────────────────────────────────────────
#  GPT FALLBACK — Global overview null fields
# ─────────────────────────────────────────────

GLOBAL_OVERVIEW_FALLBACK_PROMPT = """
You are a trade data analyst with deep knowledge of global commodity markets.

The following global trade data was partially extracted for {product_name} (HS {hs_code}).
Some fields are null because the real-time source had no data.

Using your training knowledge (2022-2024 data):
- Fill ONLY the null fields listed below
- Leave all non-null values exactly as-is
- If you genuinely don't know a value, keep it null

Null fields: {null_fields}

Current data:
{current_data_json}

Return the COMPLETE JSON object with the EXACT same structure.
No text outside JSON.
"""


# ─────────────────────────────────────────────
#  GPT FILL — Country name lists (top up to 5)
# ─────────────────────────────────────────────

COUNTRY_NAMES_FILL_PROMPT = """
Complete the following lists of top exporting and importing countries for
{product_name} (HS {hs_code}) to 5 countries each.

Add only the missing countries — do NOT change or remove the existing ones.
-strictly just mention countries and not regions like (european union, mea, apac)
-if existing list has regions , replace it with top countries
Current top exporters ({exp_count}/5): {exporters_json}
Current top importers ({imp_count}/5): {importers_json}

Return JSON with EXACTLY this structure:
{{
  "top_exporter_names": ["country1", "country2", ...],
  "top_importer_names": ["country1", "country2", ...]
}}

Rules:
- Keep all existing country names exactly as-is, in the same order
- Add only as many new names as needed to reach 5 in each list
- Plain country name strings only — no data, no nulls
- No text outside JSON
"""


# ─────────────────────────────────────────────
#  GPT PROMPT — Structure Comtrade trader data
# ─────────────────────────────────────────────

STRUCTURE_TRADERS_PROMPT = """
You are a trade data formatter. Convert raw Comtrade API data into clean display strings.

Product: {product_name} (HS {hs_code}) | Year: {year}

Raw exporter data (value_usd in USD, volume_mt in metric tons):
{exporters_json}

Raw importer data (value_usd in USD, volume_mt in metric tons):
{importers_json}

Return JSON with EXACTLY this structure:
{{
  "top_exporters": [
    {{
      "country": "string",
      "value_usd": "string or null — e.g. '$12.4M' or '$1.2B'",
      "volume_mt": "string or null — e.g. '18.4K MT' or '320K MT'"
    }}
  ],
  "top_importers": [
    {{
      "country": "string",
      "value_usd": "string or null — e.g. '$12.4M' or '$1.2B'",
      "volume_mt": "string or null — e.g. '18.4K MT' or '320K MT'"
    }}
  ]
}}

Rules:
- Format value_usd: use M/B suffixes for millions/billions, e.g. '$12.4M', '$1.2B'
- Format volume_mt: use K suffix for thousands, e.g. '18.4K MT', '320K MT'
- If the raw value_usd is null or 0 for a country, set both fields to null
- Keep countries in the same order as input
- No text outside JSON
"""


# ─────────────────────────────────────────────
#  GPT PROMPT — Structure Comtrade origin trend
# ─────────────────────────────────────────────

STRUCTURE_TREND_PROMPT = """
You are a trade data formatter. Convert raw Comtrade annual export data into
a clean trend array with contextual year labels.

Product: {product_name} | Origin: {origin_country}

Raw trend data (volume_mt and value_usd per year, yoy_growth already computed):
{trend_json}

Return JSON with EXACTLY this structure:
{{
  "export_volume_trend": [
    {{
      "year": integer,
      "volume_mt": "string or null — e.g. '148K MT'",
      "yoy_growth": "string or null — copy from raw as-is",
      "label": "string — always non-null, short 1-3 word label"
    }}
  ]
}}

Rules:
- Format volume_mt: use K suffix for thousands, e.g. '18.4K MT'; null if raw is null or 0
- yoy_growth: copy exactly from raw data — do not recompute
- label must ALWAYS be a non-null string for every year — never null
- assign a short 1-3 word contextual label based on your knowledge of
  what happened to this market that year , give the label according to the previous years data as well
- No text outside JSON
"""


# ─────────────────────────────────────────────
#  GPT FALLBACK 1 — Top-level null fields
#  Covers: global_trade_value, volume_traded_globally, avg_global_trade_price,
#          country_export_share, export_volume_trend, export_pricing_commod
# ─────────────────────────────────────────────

# TRADE_FALLBACK_PROMPT = """
# You are a trade intelligence analyst with deep knowledge of global commodity markets.

# The following trade data was extracted for {product_name} (HS code: {hs_code})
# with {origin_country} as the exporting country.
# Some fields are null because the real-time source had no data.

# Using your training knowledge (2022-2024 vintage — note estimates with a flag):
# - Fill ONLY the null fields listed below. Leave all non-null values exactly as-is.
# - If you genuinely don't know a value, keep it null — do not guess.
# - Never fabricate specific company names — country-level data only.

# Null fields to fill: {null_fields}

# Current data:
# {current_data_json}

# Return the COMPLETE JSON object with the EXACT same structure.
# Use the same field names and value formats already present.
# For export_volume_trend: 4 entries for years 2021, 2022, 2023, 2024.
# """


# # ─────────────────────────────────────────────
# #  GPT FALLBACK 2 — Country metric gaps
# #  Fills null trad_value / share_pct in top_exporters
# #  and null volume_mt / yoy_growth in top_importers.
# #  Never adds or removes countries.
# # ─────────────────────────────────────────────

# COUNTRY_METRICS_FALLBACK_PROMPT = """
# You are a trade data analyst. Fill in ONLY the missing numeric fields
# for the countries listed below. Do NOT add or remove countries.

# Product: {product_name} (HS {hs_code})
# Year: 2023-2024

# Current top_exporters (fill null trad_value and share_pct where missing):
# {exporters_json}

# Current top_importers (fill null volume_mt and yoy_growth where missing):
# {importers_json}

# Return JSON with EXACTLY this structure:
# {{
#   "top_exporters": [...same countries, same order, fill null trad_value/share_pct only...],
#   "top_importers": [...same countries, same order, fill null volume_mt/yoy_growth only...]
# }}

# Rules:
# - Keep every existing non-null value exactly as-is
# - Only fill fields that are currently null
# - If you don't know a value, keep it null — do not guess
# - Same country list, same order — no additions or removals
# """


# ─────────────────────────────────────────────
#  GPT FALLBACK 3 — Export volume trend gaps
#  Fills null volume_mt within existing trend entries.
#  Never changes years or non-null yoy_growth values.
# ─────────────────────────────────────────────

# TREND_GAPS_FALLBACK_PROMPT = """
# You are a trade data analyst. Fill in the missing volume_mt values
# for {origin_country}'s exports of {product_name} (HS {hs_code}).

# Current export_volume_trend (fill null volume_mt only):
# {trend_json}

# Return JSON with EXACTLY this structure:
# {{
#   "export_volume_trend": [...same 4 entries, same order, fill null volume_mt only...]
# }}

# Rules:
# - Keep every existing non-null value exactly as-is (especially yoy_growth already present)
# - Only fill volume_mt where it is null
# - Use metric ton values as strings — e.g. "148K MT" or "148000 MT"
# - If you don't know a volume_mt value, keep it null — do not guess
# - Always return all 4 year entries
# - label must ALWAYS be a non-null string for every year — never null
# - 2021 label is always "Baseline"
# - For 2022-2024, assign a short 1-3 word contextual label based on your knowledge of
#   what happened to this market that year — e.g. "Post-COVID Surge", "Record High",
#   "Supply Crunch", "Strong Growth", "Price Correction", "Steady Climb", "Export Boom"
# """


# ─────────────────────────────────────────────
#  ANALYST NOTE
# ─────────────────────────────────────────────

TRADE_ANALYST_NOTE_PROMPT = """
You are a senior export market analyst writing a brief insight for an exporter.

Product: {product_name} (HS {hs_code})
Origin: {origin_country}
Certifications: {certifications}

Trade data:
- Global trade value: {global_trade_value_usd} ({global_trade_value_yoy} YoY)
- {origin_country} export share: {export_share_pct} — {export_share_trend}
- Most recent export volume: {latest_trend_entry}
- Commodity price: {commodity_price}
- Certified price: {certified_price}

Write 2-3 sentences:
1. Lead with the single most compelling trade data point for THIS exporter
2. Explain the structural advantage or risk
3. End with one specific, actionable insight (pricing, timing, or certification leverage)

Do NOT start with "The [product] market". Be direct and specific.
Return only the analyst note — no labels, no JSON.
"""
