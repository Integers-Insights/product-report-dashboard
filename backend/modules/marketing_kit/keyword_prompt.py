CLASSIFY_PROMPT = """
You are a B2B export keyword strategist. Given a list of raw keywords with their 
search volumes and competition levels, classify them into 2 buckets and mark gaps.

Product: {product_name}
Category: {category}
Certifications: {certifications}
Exporter: India-based {business_type}
Target market: {target_country}

Raw keywords (JSON array):
{raw_keywords_json}

Task:
1. Select up to 10 keywords for "high_volume_buyer_intent":
   - Must have buyer intent phrasing (supplier, wholesale, bulk, manufacturer, 
     exporter, B2B, private label, certified, OEM)
   - Prefer search_volume ≥ 5/mo
   - Set gap = "High" if competition_index < 40 AND volume ≥ 5, else "Low"

2. Select up to 10 keywords for "low_competition_gaps":
   - competition must be "Low" OR competition_index < 35
   - Should be keywords large Western brands likely ignore
   - Must still have real buyer relevance
   - Set gap = "High" always for this bucket

3. A keyword can appear in BOTH buckets if it qualifies for both.

Return ONLY valid JSON, no explanation:
{{
  "high_volume_buyer_intent": [
    {{
      "keyword": "...",
      "search_volume": integer or null,
      "competition": "Low|Medium|High",
      "competition_index": integer or null,
      "gap": "High|Low"
    }}
  ],
  "low_competition_gaps": [ ... same structure ... ]
}}
"""

# ── GPT generation prompts ───────────────────────────────────────────────────

BUYER_INTENT_PROMPT = """
You are a B2B export keyword strategist for Indian exporters.

Product      : {product_name}
Category     : {category}
Certifications: {certifications}
Business type: {business_type}
Target market: {target_country}

Generate exactly 15 English keywords that a procurement manager, importer, or \
sourcing manager in {target_country} would search when actively looking to BUY \
or SOURCE this product.

Focus on:
- Supplier / bulk / wholesale / manufacturer / exporter phrasing
- Certification-specific searches (e.g. "organic turmeric supplier", "GMP certified curcumin")
- B2B sourcing intent (OEM, private label, trade, import)
- Volume/specification searches (e.g. "bulk turmeric powder 25kg")
- India-origin specific terms where relevant

DO NOT include search volume — that will be fetched from real data.
Return ONLY valid JSON:
{{
  "buyer_intent": [
    {{ "keyword": "..." }}
  ]
}}
"""

GAP_KEYWORDS_PROMPT = """
You are a B2B export keyword strategist for Indian exporters.

Product      : {product_name}
Category     : {category}
Certifications: {certifications}
Business type: {business_type}
Target market: {target_country}

Generate exactly 15 English niche/long-tail keywords where large Western brands \
are unlikely to be advertising. These are gap opportunities for a smaller Indian exporter.

Focus on:
- Highly specific product variants or specs (e.g. "turmeric extract 95 curcuminoids bulk")
- Niche buyer segments (e.g. "ayurvedic turmeric manufacturer for supplements")
- Certification + product combos that big brands skip
- Smaller volume, higher specificity searches
- Region + product + spec combos (e.g. "turmeric powder kosher certified supplier")

DO NOT include search volume — that will be fetched from real data.
Return ONLY valid JSON:
{{
  "gap_keywords": [
    {{ "keyword": "..." }}
  ]
}}
"""

MULTILINGUAL_PROMPT = """
You are a multilingual B2B keyword researcher.

Product      : {product_name}
Category     : {category}
Certifications: {certifications}
Target country: {target_country}
Target language: {language}

Generate exactly 10 high-value B2B buyer-intent keywords in {language} that a \
procurement manager or importer in {target_country} would search when sourcing \
this product. Prioritise terms most likely to have real search volume.

Mix of:
- Direct product terms in {language}
- Supplier / wholesale / bulk / certified variants in {language}
- Certification-specific terms (translate cert names where natural)
- 2-3 niche long-tail phrases that large Western suppliers likely don't target

DO NOT include search volume — that will be fetched from real data.
Return ONLY valid JSON:
{{
  "multilingual": [
    {{ "keyword": "..." }}
  ]
}}
"""
