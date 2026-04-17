"""
scorer/confidence_scorer.py
-----------------------------
Computes a confidence score (0–100) for an extracted ProductData record
based on field presence and basic value quality checks.

This is the RULE-BASED scorer — fast, deterministic, no LLM needed.
It runs on every product immediately after extraction.

The semantic scorer (scorer/semantic_scorer.py) runs after this
and may adjust the score for ambiguous cases.

Scoring logic:
    - Start at 100
    - Deduct points for each missing or low-quality field
    - Field weights come from CONFIDENCE_FIELD_WEIGHTS in config.py
    - Additional penalties for specific quality issues
    - Map final score to ConfidenceTier (high/medium/low)

Output is written back into the ProductData model:
    product.confidence_score  → int 0–100
    product.confidence_tier   → ConfidenceTier enum
    product.missing_fields    → list[MissingFieldDetail]

Usage:
    from input_pipeline.scorer.confidence_scorer import score_product

    scored_product = score_product(product)
    # returns same ProductData with confidence fields populated
"""

from input_pipeline.models.product import ProductData, MissingFieldDetail
from input_pipeline.models.page import ConfidenceTier
from input_pipeline.config import CONFIDENCE_FIELD_WEIGHTS, CONFIDENCE_THRESHOLDS

from typing import List,Dict
# ─────────────────────────────────────────────
#  ADDITIONAL QUALITY PENALTIES
#  Applied on top of the field-presence deductions
# ─────────────────────────────────────────────

QUALITY_PENALTIES: List[dict] = [
    {
        "name":    "extraction_failed",
        "penalty": 40,
        "check":   lambda p: "extraction failed" in (p.extraction_notes or "").lower(),
        "message": "Extraction failed — page could not be processed",
    },
    {
        "name":    "json_parse_error",
        "penalty": 30,
        "check":   lambda p: "json parse error" in (p.extraction_notes or "").lower(),
        "message": "LLM returned invalid JSON — data may be incomplete",
    },
    {
        "name":    "product_name_is_url",
        "penalty": 20,
        "check":   lambda p: bool(
            p.product_name and (
                p.product_name.startswith("http") or
                p.product_name.startswith("/")
            )
        ),
        "message": "Product name looks like a URL — extraction likely failed",
    },
    {
        "name":    "description_too_short",
        "penalty": 10,
        "check":   lambda p: bool(
            p.description and len(p.description.strip()) < 30
        ),
        "message": "Description is too short to be useful (< 30 chars)",
    },
    {
        "name":    "product_name_too_short",
        "penalty": 10,
        "check":   lambda p: bool(
            p.product_name and len(p.product_name.strip()) < 3
        ),
        "message": "Product name is too short (< 3 chars)",
    },
    {
        "name":    "no_certifications_nutraceutical",
        "penalty": 2,
        "check":   lambda p: bool(
            p.category and
            "nutraceutical" in p.category.lower() and
            not p.certifications
        ),
        "message": "Nutraceutical product has no certifications — unusual",
    },
    {
        "name":    "price_unparseable",
        "penalty": 5,
        "check":   lambda p: bool(
            p.price and
            len(p.price) > 100     # absurdly long price string = garbage
        ),
        "message": "Price field is unusually long — may be garbled",
    },
]


# ─────────────────────────────────────────────
#  FIELD PRESENCE SUGGESTIONS
#  Shown to user in the "Review & Update" panel
# ─────────────────────────────────────────────

FIELD_SUGGESTIONS: Dict[str, str] = {
    "product_name":     "Enter the product name as it should appear in reports",
    "description":      "Add a product description (2–3 sentences minimum)",
    "category":         "Select or type the product category (e.g. Nutraceutical, Spice)",
    "price":            "Add your FOB price (e.g. $8.50/kg FOB Mumbai)",
    "packaging":        "Describe packaging options (e.g. 500g pouches, 25kg bulk bags)",
    "certifications":   "List all certifications (e.g. GMP, USDA Organic, ISO 9001)",
    "moq":              "Add minimum order quantity (e.g. 500 kg)",
    "hs_code":          "Add the HS/HSN code for this product (e.g. 0910.30)",
    "ingredients":      "List the key ingredients or composition",
    "images":           "Add product image URLs for better buyer matching",
    "specifications":   "Add technical specifications if available",
}


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

def score_product(product: ProductData) -> ProductData:
    """
    Computes confidence score for a ProductData record and
    writes the results back into the model.

    Args:
        product: ProductData from product_extractor.py

    Returns:
        Same ProductData with confidence_score, confidence_tier,
        and missing_fields populated. Input is not mutated —
        a new ProductData is returned.
    """
    score         = 100
    missing       = []
    applied_quals = []

    # ── Step 1: Field presence deductions ───────
    for field_name, weight in CONFIDENCE_FIELD_WEIGHTS.items():
        field_value = getattr(product, field_name, None)

        if _is_field_missing(field_name, field_value):
            score -= weight
            missing.append(MissingFieldDetail(
                field=field_name,
                penalty=weight,
                suggestion=FIELD_SUGGESTIONS.get(field_name, ""),
            ))

    # ── Step 2: Quality penalties ────────────────
    for penalty_def in QUALITY_PENALTIES:
        try:
            if penalty_def["check"](product):
                score -= penalty_def["penalty"]
                applied_quals.append(penalty_def["message"])
        except Exception:
            pass    # never let a penalty check crash the scorer

    # ── Step 3: Clamp to 0–100 ──────────────────
    score = max(0, min(100, score))

    # ── Step 4: Map to tier ──────────────────────
    tier = _score_to_tier(score)

    # ── Step 5: Build extraction notes ──────────
    notes = product.extraction_notes or ""
    if applied_quals:
        quality_note = " | ".join(applied_quals)
        notes = f"{notes} | {quality_note}".strip(" |")

    # ── Return updated ProductData ───────────────
    return product.model_copy(update={
        "confidence_score":  score,
        "confidence_tier":   tier,
        "missing_fields":    missing,
        "extraction_notes":  notes,
    })


def score_products(products: List[ProductData]) -> List[ProductData]:
    """
    Batch version — scores a list of products.
    Returns list in same order, each with confidence fields populated.
    """
    return [score_product(p) for p in products]


# ─────────────────────────────────────────────
#  SCORE SUMMARY (for logging / debugging)
# ─────────────────────────────────────────────

def get_score_summary(product: ProductData) -> dict:
    """
    Returns a human-readable summary of the scoring result.
    Useful for debugging and logging.

    Example output:
    {
        "product_name": "Organic Turmeric Powder",
        "score": 82,
        "tier": "high",
        "missing_fields": ["hs_code", "ingredients"],
        "total_penalty": 18,
        "quality_issues": []
    }
    """
    missing_names   = [m.field for m in product.missing_fields]
    total_penalty   = sum(m.penalty for m in product.missing_fields)

    return {
        "product_name":  product.get_display_name(),
        "score":         product.confidence_score,
        "tier":          product.confidence_tier.value,
        "missing_fields": missing_names,
        "total_penalty": total_penalty,
        "source_url":    product.source_url,
    }


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _is_field_missing(field_name: str, value) -> bool:
    """
    Determines if a field should be considered missing for scoring.

    Rules:
    - None → missing
    - Empty string → missing
    - Empty list → missing (for list fields)
    - Whitespace-only string → missing
    """
    if value is None:
        return True
    if isinstance(value, str) and value.strip() == "":
        return True
    if isinstance(value, List) and len(value) == 0:
        return True
    return False


def _score_to_tier(score: int) -> ConfidenceTier:
    """
    Maps a numeric score to a ConfidenceTier enum value.

    Thresholds from config.py:
        60–100 → HIGH   (green dot)
        40–59  → MEDIUM (orange dot, needs review)
        0–39   → LOW    (red dot, enter manually or exclude)
    """
    if score >= CONFIDENCE_THRESHOLDS["high"]:
        return ConfidenceTier.HIGH
    if score >= CONFIDENCE_THRESHOLDS["medium"]:
        return ConfidenceTier.MEDIUM
    return ConfidenceTier.LOW