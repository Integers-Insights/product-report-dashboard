# ─────────────────────────────────────────────
#  SONAR CALL 1 — VARIANT DISCOVERY (names only)
#
#  Short, focused. Sonar finds what variants exist —
#  no pricing or structure asked. One job only.
# ─────────────────────────────────────────────

SONAR_VARIANT_DISCOVERY_QUERY = """
What are the main product formats and variants of {product_name} ({category})
that B2B buyers actively source from {origin_country} exporters?

Include: standard grades, certified formats, derivatives, emerging variants.
List 5-6 most commercially active variants with a brief note on each.
"""


# ─────────────────────────────────────────────
#  GPT EXTRACTION 1 — VARIANT NAMES LIST
#
#  Pulls just the names from Sonar call 1 response.
#  Clean list fed into Sonar call 2.
# ─────────────────────────────────────────────

VARIANT_NAMES_EXTRACTION_PROMPT = """
Extract the product variant and format names from the research below.

Product: {product_name}

Research:
---
{sonar_response}
---

Return ONLY valid JSON, no explanation:
{{
  "variants": ["Variant Name 1", "Variant Name 2", "Variant Name 3"]
}}

Rules:
- Maximum 6 variants
- Use clean market-ready names (e.g. "Water-Soluble Turmeric Extract 95%")
- Always include "{product_name}" or its closest named equivalent
- Names only — no specs, prices, or descriptions
"""


# ─────────────────────────────────────────────
#  SONAR CALL 2 — MARKET DATA (for known variants)
#
#  Short, focused. Sonar now has a concrete list to research.
#  Separation means call 1 discovery + call 2 data both do one job.
# ─────────────────────────────────────────────

SONAR_MARKET_DATA_QUERY = """
Current B2B sourcing data (2023-2025) for these {product_name} variants
exported from {origin_country} to {target_country}:

{variant_list}

For each variant provide:
- FOB price range in USD/kg or per unit
- MOQ (minimum order quantity)
- Buyer demand level (High / Medium / Emerging / Low)
- Estimated number of active importers/buyers
- Key technical specification buyers require
- Typical lead time from {origin_country}
"""


# ─────────────────────────────────────────────
#  SONAR CALL 2 RETRY — simpler fallback if main query deflects
#
#  Sonar sometimes deflects variant-specific queries with "data not available".
#  This retry drops the variant list and asks for category-level pricing
#  which Sonar is more likely to have indexed.
# ─────────────────────────────────────────────

SONAR_MARKET_DATA_RETRY_QUERY = """
What is the current B2B export pricing, MOQ, and demand for {product_name}
variants exported from {origin_country} to {target_country}?

Include: price per kg (FOB), minimum order quantities, buyer demand level,
key specifications buyers require, and typical lead times.
Focus on: {variant_list_inline}
"""


# ─────────────────────────────────────────────
#  DEFLECTION PHRASES — Sonar gave up instead of searching
# ─────────────────────────────────────────────

SONAR_DEFLECTION_PHRASES = [
    "do not include",
    "not available",
    "consult",
    "cannot provide",
    "no specific",
    "would need to",
    "unable to find",
    "not found in",
    "search results do not",
    "no data",
]


# ─────────────────────────────────────────────
#  GPT EXTRACTION 2 — BULK STRUCTURED DATA
#
#  Parses Sonar call 2 free-text into clean structured JSON.
# ─────────────────────────────────────────────

BULK_EXTRACTION_PROMPT = """
Extract structured market data for each product variant from the research below.

Product category: {category}
Origin country: {origin_country}

Research text:
---
{sonar_response}
---

Extract every distinct variant mentioned. Return structured fields for each.

Return ONLY valid JSON, no explanation:
{{
  "variants": [
    {{
      "variant_name": "exact name as mentioned in research",
      "key_spec": "string or null — use · separator, e.g. 'Curcuminoids ≥95% · moisture <8%'",
      "price_range": "string or null — always include unit, e.g. '$8–$16/kg'",
      "moq": "string or null — e.g. '500 kg' or '200 units'",
      "buyer_demand": "exactly: High | Medium | Emerging | Low — or null",
      "matched_buyers": "string or null — e.g. '120+ · USA, Germany, UK'",
      "lead_time": "string or null — e.g. '14–21 days'"
    }}
  ]
}}

Rules:
- Include ALL variants from the research, even if some fields are null
- Never invent or estimate data — set field to null if not in the research
- buyer_demand must be exactly: High, Medium, Emerging, or Low (or null)
- 6 variants maximum
"""


# ─────────────────────────────────────────────
#  GPT FALLBACK — fill null fields from training data
#
#  Used when Sonar extraction leaves fields null.
#  matched_buyers is always excluded — it needs real-time data.
#  temp=0.0: most statistically likely value, no creativity.
# ─────────────────────────────────────────────

GPT_FALLBACK_PROMPT = """
You are a B2B trade specialist with deep knowledge of global commodity,
ingredient, and manufactured goods markets.

For each product variant below, fill in ONLY the fields that are null
using your training knowledge. Do NOT fill "matched_buyers" — always leave it null.

Product: {product_name}
Category: {category}
Origin country: {origin_country}
Target market: {target_country}

Variants (null = missing, needs filling):
{variants_json}

Rules:
- price_range : realistic FOB USD range for this variant from {origin_country} e.g. '$8–$16/kg'
- moq         : typical B2B minimum order quantity e.g. 'x kg' or '1 MT'
- key_spec    : most commonly required spec by B2B buyers, use · separator
- buyer_demand: one of exactly — High | Medium | Emerging | Low
- lead_time   : typical production + shipping from {origin_country} e.g. 'x-x days'
- matched_buyers: ALWAYS null — never fill this field
- If you genuinely cannot estimate a field with reasonable confidence, keep it null
- Never overwrite a field that already has a value

Return ONLY valid JSON, no explanation:
{{
  "variants": [
    {{
      "variant_name": "exact name as provided",
      "key_spec": "string or null",
      "price_range": "string or null",
      "moq": "string or null",
      "buyer_demand": "High | Medium | Emerging | Low or null",
      "matched_buyers": null,
      "lead_time": "string or null"
    }}
  ]
}}
"""


# ─────────────────────────────────────────────
#  PROMPT 3 — TAG + SCORE (one batch call)
# ─────────────────────────────────────────────

TAG_AND_SCORE_PROMPT = """
You are a B2B export opportunity analyst. Tag and score these product variants
for an Indian exporter.

Seller's product: {product_name}
Certifications: {certifications}
Target markets: {target_markets}

Variants with market data:
{variants_json}

For each variant assign:

1. "tag" — one of:
   - "your_product" : already assigned to index {your_product_idx} — DO NOT change this
   - "gap"          : no or very few certified Indian suppliers — real opportunity
   - "in_market"    : buyers actively sourcing, Indian suppliers present
   - "emerging"     : growing demand but niche/early-stage market

2. "opportunity_score" — integer 1–10:
   - 9–10 : "your_product" with strong cert match, or "gap" with high demand
   - 7–8  : "in_market" with clear differentiation potential
   - 5–6  : "emerging" or "in_market" with medium demand
   - 3–4  : low demand or heavily commoditized

Return ONLY valid JSON, no explanation:
{{
  "tagged": [
    {{
      "variant_name": "...",
      "tag": "...",
      "opportunity_score": integer
    }}
  ]
}}
"""


# ─────────────────────────────────────────────
#  PROMPT 4 — ANALYSIS NOTES (one batch call)
# ─────────────────────────────────────────────

ANALYSIS_NOTE_PROMPT = """
Write a short analyst note (2–3 sentences) for each product variant below.
These appear in a B2B export intelligence dashboard.

Seller: {company_name}, {origin_country}-based {business_type}
Product: {product_name}
Certifications: {certifications}

Variants:
{variants_json}

For each note:
- State the opportunity or strategic relevance for THIS seller specifically
- Reference 1–2 data points from the extracted fields (price, demand, buyers)
- End with a clear action implication (enter / add spec / monitor / upsell)
- Tone: direct analyst-style — no fluff

Return ONLY valid JSON, no explanation:
{{
  "notes": [
    {{
      "variant_name": "...",
      "analysis_note": "..."
    }}
  ]
}}
"""
