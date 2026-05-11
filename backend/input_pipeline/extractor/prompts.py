"""
extractor/prompts.py
---------------------
All LLM prompts used in the extraction stage, defined as versioned constants.

Rules for prompts in this file:
    - Every prompt is a plain string constant, no f-strings here
    - Dynamic values (product text, url, etc.) are injected by the
      extractor modules using .format() or direct concatenation
    - Each prompt has a VERSION comment — bump it when you change a prompt
      so you can track which version produced which DB records
    - Prompts are designed for temperature=0.0 (deterministic output)
    - All prompts instruct the model to return ONLY valid JSON
      with no preamble, no markdown fences, no explanation

Prompt naming convention:
    SYSTEM_<PURPOSE>   — system message (sets behaviour)
    USER_<PURPOSE>     — user message template (contains {placeholders})
"""

from typing import List,Dict
# ─────────────────────────────────────────────
#  PRODUCT EXTRACTION PROMPTS
#  VERSION: 1.0
# ─────────────────────────────────────────────

SYSTEM_PRODUCT_EXTRACTION = """
You are a precise data extraction engine for a B2B export intelligence platform.
Your job is to extract structured product information from the text content of
a manufacturer or exporter's product page.

Rules you must follow without exception:
1. Return ONLY a valid JSON object. No markdown, no explanation, no preamble.
2. If a field is not found on the page, set it to null. Never guess or hallucinate.
3. For lists (certifications, variants, images), return an empty array [] if none found.
4. Extract exactly what is written — do not rephrase or summarise descriptions.
5. For price, copy the raw text as-is (e.g. "$8.50/kg FOB Mumbai"). Do not convert.
6. For hs_code, extract the numeric code only (e.g. "0910.30"). No labels.
7. For certifications, extract each as a separate string in the array.
8. The extraction_notes field is for you to flag anything uncertain or ambiguous.
   Keep it under 100 characters. Leave empty string if everything is clear.
""".strip()


USER_PRODUCT_EXTRACTION = """
Extract product information from the following page content.

SOURCE URL: {source_url}
PAGE TITLE: {page_title}

PAGE CONTENT:
{clean_text}

Return a JSON object with exactly these fields:

{{
  "product_name": "string or null",
  "category": "string or null — e.g. Nutraceutical, Spice, Chemical, Textile",
  "subcategory": "string or null — e.g. Botanical Extract, Essential Oil",
  "description": "string or null — full product description as written on page",
  "packaging": "string or null — e.g. 500g pouches, 25kg bulk bags",
  "price": "string or null — raw price text as written, e.g. $8.50/kg FOB Mumbai",
  "hs_code": "string or null — numeric HS/HSN code only",
  "certifications": ["array of strings — e.g. GMP, USDA Organic, ISO 9001"],
  "ingredients": "string or null — composition or ingredient list",
  "moq": "string or null — minimum order quantity as written",
  "monthly_capacity": "string or null — production capacity if mentioned",
  "variants": ["array of strings — product variants, grades, or types if listed"],
  "specifications": {{"key": "value"}} or null,
  "images": ["array of image URLs found on page, empty if none"],
  "extraction_notes": "string — flag anything uncertain, max 100 chars"
}}
""".strip()


# ─────────────────────────────────────────────
#  COMPANY EXTRACTION PROMPTS
#  VERSION: 1.0
# ─────────────────────────────────────────────

SYSTEM_COMPANY_EXTRACTION = """
You are a precise data extraction engine for a B2B export intelligence platform.
Your job is to extract structured company information from the text content of
a manufacturer or exporter's About Us or Contact page.

Rules you must follow without exception:
1. Return ONLY a valid JSON object. No markdown, no explanation, no preamble.
2. If a field is not found, set it to null. Never guess or hallucinate.
3. For lists (certifications, export_markets), return [] if none found.
4. For business_type, use one of: Manufacturer, Trader, Exporter, Agent, or null.
5. For export_markets, list country names only (e.g. ["USA", "Germany", "UAE"]).
6. For annual_turnover and manufacturing_capacity, copy raw text as written.
7. extraction_notes is for flagging ambiguity. Keep under 100 characters.
""".strip()


USER_COMPANY_EXTRACTION = """
Extract company information from the following page content.

SOURCE URL: {source_url}
PAGE TITLE: {page_title}

PAGE CONTENT:
{clean_text}

Return a JSON object with exactly these fields:

{{
  "company_name": "string or null",
  "founded_year": integer or null,
  "tagline": "string or null — company tagline or one-liner if present",
  "country": "string or null — country of operation",
  "city": "string or null",
  "address": "string or null — full address if present",
  "business_type": "Manufacturer | Trader | Exporter | Agent | null",
  "industries_served": ["array of industries e.g. Nutraceuticals, Food, Pharma"],
  "export_markets": ["array of country names they export to"],
  "export_experience": "string or null — e.g. 15 years of export experience",
  "certifications": ["array of certification names"],
  "regulatory_approvals": ["array e.g. FDA Registered, FSSAI Licensed"],
  "manufacturing_capacity": "string or null — raw text as written",
  "annual_turnover": "string or null — raw text as written",
  "employee_count": "string or null — e.g. 50-200",
  "contact_email": "string or null",
  "contact_phone": "string or null",
  "linkedin_url": "string or null",
  "extraction_notes": "string — flag anything uncertain, max 100 chars"
}}
""".strip()


# ─────────────────────────────────────────────
#  SEMANTIC CONFIDENCE SCORING PROMPT
#  VERSION: 1.0
# ─────────────────────────────────────────────

SYSTEM_SEMANTIC_SCORING = """
You are a data quality assessor for a B2B export intelligence platform.
Your job is to evaluate the quality and completeness of an extracted product record
and identify specific issues that would prevent accurate market analysis.

Rules:
1. Return ONLY a valid JSON object. No markdown, no explanation, no preamble.
2. Be strict — this data will be used for real market intelligence decisions.
3. Score on a scale of 0–100 where 100 is a complete, unambiguous product record.
4. issues must be specific and actionable (what is wrong, not just "incomplete").
""".strip()


USER_SEMANTIC_SCORING = """
Assess the quality of this extracted product record.

PRODUCT DATA:
{product_json}

Evaluate and return:

{{
  "semantic_score": integer 0-100,
  "category_is_clear": true or false,
  "description_is_useful": true or false,
  "is_likely_product_page": true or false,
  "issues": [
    "list of specific quality issues found, empty array if none"
  ],
  "suggested_category": "string or null — if category is unclear, suggest one",
  "notes": "string — any additional observations, max 150 chars"
}}

Scoring guide:
  70-100: Complete record, with proper product name, good description which explains the product well
  50-69:  Usable but needs review (category unclear, description vague)
  30-49:  Poor record, significant gaps or ambiguity
  0-29:   Not a product page, or extraction failed entirely
""".strip()


# ─────────────────────────────────────────────
#  MULTI-PRODUCT PAGE PROMPT
#  VERSION: 1.0
#  Used when a page appears to list multiple products
#  (category page that slipped through)
# ─────────────────────────────────────────────

SYSTEM_MULTI_PRODUCT_DETECTION = """
You are a data extraction engine for a B2B export intelligence platform.
Your job is to determine if a page contains a single product or multiple products,
and if multiple, extract each one as a separate record.

Rules:
1. Return ONLY a valid JSON object. No markdown, no explanation, no preamble.
2. If it is a single product page, set is_multi_product to false and
   products to an array with one item.
3. If it is a listing page with multiple products, set is_multi_product to true
   and extract each product you can identify.
4. For listing pages, only extract fields that are clearly visible per product.
   Do not guess at details not shown in the listing.
5. Maximum 20 products per page.
""".strip()


USER_MULTI_PRODUCT_DETECTION = """
Analyse this page and extract product information.

SOURCE URL: {source_url}
PAGE CONTENT:
{clean_text}

Return:

{{
  "is_multi_product": true or false,
  "product_count": integer,
  "products": [
    {{
      "product_name": "string or null",
      "category": "string or null",
      "description": "string or null",
      "price": "string or null",
      "moq": "string or null",
      "certifications": [],
      "source_url": "{source_url}"
    }}
  ]
}}
""".strip()


# ─────────────────────────────────────────────
#  URL PAGE TYPE FALLBACK PROMPT
#  VERSION: 1.0
#  Used by url_classifier when heuristics are inconclusive
# ─────────────────────────────────────────────

SYSTEM_URL_TYPE_CLASSIFICATION = """
You are a URL classifier for a web crawler.
Given a URL path, classify what type of page it most likely is.
Return ONLY a valid JSON object with no explanation.
""".strip()


USER_URL_TYPE_CLASSIFICATION = """
Classify this URL path into one of the given page types.

URL: {url}

Page types:
- product: individual product, ingredient, or service detail page
- category: listing, collection, or category of multiple products
- about: company overview, who we are, our story, team, infrastructure
- contact: contact us, get in touch, enquiry, locations
- home: homepage or root page
- blog: article, news, press release
- ignore: login, cart, legal, static asset, or irrelevant page

Return:
{{
  "page_type": "one of the types above",
  "confidence": float between 0.0 and 1.0,
  "reason": "one sentence explanation"
}}
""".strip()


# ─────────────────────────────────────────────
#  PROMPT REGISTRY
#  Single place to look up any prompt by name
# ─────────────────────────────────────────────

PROMPT_REGISTRY: Dict[str, Dict[str, str]] = {
    "product_extraction": {
        "system": SYSTEM_PRODUCT_EXTRACTION,
        "user":   USER_PRODUCT_EXTRACTION,
        "version": "1.0",
    },
    "company_extraction": {
        "system": SYSTEM_COMPANY_EXTRACTION,
        "user":   USER_COMPANY_EXTRACTION,
        "version": "1.0",
    },
    "semantic_scoring": {
        "system": SYSTEM_SEMANTIC_SCORING,
        "user":   USER_SEMANTIC_SCORING,
        "version": "1.0",
    },
    "multi_product_detection": {
        "system": SYSTEM_MULTI_PRODUCT_DETECTION,
        "user":   USER_MULTI_PRODUCT_DETECTION,
        "version": "1.0",
    },
    "url_type_classification": {
        "system": SYSTEM_URL_TYPE_CLASSIFICATION,
        "user":   USER_URL_TYPE_CLASSIFICATION,
        "version": "1.0",
    },
}


def get_prompt(name: str) -> Dict[str, str]:
    """
    Retrieves a prompt pair by name from the registry.

    Args:
        name: Key from PROMPT_REGISTRY

    Returns:
        dict with 'system', 'user', and 'version' keys

    Raises:
        KeyError if prompt name not found
    """
    if name not in PROMPT_REGISTRY:
        raise KeyError(
            f"Prompt '{name}' not found. "
            f"Available prompts: {list(PROMPT_REGISTRY.keys())}"
        )
    return PROMPT_REGISTRY[name]