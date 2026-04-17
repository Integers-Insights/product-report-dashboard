"""
scorer/semantic_scorer.py
--------------------------
LLM-based semantic quality scorer that runs AFTER confidence_scorer.py.

While confidence_scorer checks field presence (is the data there?),
semantic_scorer checks field quality (is the data actually useful?).

It catches things rule-based scoring cannot:
    - Category is present but completely wrong ("General" / "Product" / "N/A")
    - Description is present but is nav text or a cookie banner
    - Page extracted text but is not actually a product page
    - Product name is the company name, not a product
    - HS code is present but is clearly wrong format

When to run:
    - Only runs on products where confidence_score is between 40–85
    - Below 40: already flagged as low, no need to spend LLM tokens
    - Above 85: already high confidence, rule-based result is trusted
    - The 40–85 band is where semantic checks add the most value

Usage:
    from input_pipeline.scorer.semantic_scorer import semantic_score_product

    product = await semantic_score_product(product)
    # returns ProductData with confidence_score adjusted by semantic check
"""

import json
import asyncio
from typing import List, Optional
from input_pipeline.models.product import ProductData
from input_pipeline.models.page import ConfidenceTier
from input_pipeline.extractor.prompts import get_prompt
from input_pipeline.config import LLM, CONFIDENCE_THRESHOLDS
from modules.base_module import call_openai


# ─────────────────────────────────────────────
#  CONSTANTS
# ─────────────────────────────────────────────

# Only run semantic scoring in this score band
SEMANTIC_SCORE_MIN: int = 40
SEMANTIC_SCORE_MAX: int = 85

# Max adjustment semantic scorer can make (up or down)
MAX_UPWARD_ADJUSTMENT:   int = 15
MAX_DOWNWARD_ADJUSTMENT: int = 25


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

async def semantic_score_product(product: ProductData) -> ProductData:
    """
    Runs semantic quality check on a product and adjusts its
    confidence score based on LLM assessment.

    Only runs if confidence_score is in the 40–85 band.
    Outside this band, returns product unchanged.

    Args:
        product: ProductData already scored by confidence_scorer

    Returns:
        ProductData with potentially adjusted confidence_score,
        confidence_tier, and extraction_notes.
    """
    # ── Skip if outside the useful band ─────────
    if not _should_run_semantic(product):
        return product

    # ── Build product summary for LLM ───────────
    product_json = _build_product_summary(product)

    prompt = get_prompt("semantic_scoring")
    user_message = prompt["user"].format(product_json=product_json)

    # ── Call LLM ─────────────────────────────────
    raw_response = await call_openai(
        model=LLM["scoring_model"],
        messages=[
            {"role": "system", "content": prompt["system"]},
            {"role": "user",   "content": user_message},
        ],
        max_tokens=LLM["scoring_max_tokens"],
        temperature=LLM["scoring_temperature"],
        call_type="semantic_scoring",
        module="semantic_scorer",
        response_format={"type": "json_object"},
    )

    if raw_response is None:
        # LLM failed — return product unchanged, don't penalise
        return product

    return _apply_semantic_result(product, raw_response)


async def semantic_score_products(
    products: List[ProductData],
    concurrency: int = 3,
) -> List[ProductData]:
    """
    Batch semantic scoring with controlled concurrency.
    Products outside the 40–85 band are returned immediately
    without making an LLM call.

    Args:
        products:    List of ProductData already rule-scored
        concurrency: Max simultaneous LLM calls

    Returns:
        List of ProductData with semantic adjustments applied.
    """
    semaphore = asyncio.Semaphore(concurrency)

    async def _score_with_semaphore(p: ProductData) -> ProductData:
        async with semaphore:
            return await semantic_score_product(p)

    tasks = [_score_with_semaphore(p) for p in products]
    return await asyncio.gather(*tasks)


# ─────────────────────────────────────────────
#  SEMANTIC RESULT APPLICATION
# ─────────────────────────────────────────────

def _apply_semantic_result(product: ProductData, raw: str) -> ProductData:
    """
    Parses LLM semantic scoring response and applies adjustments
    to the product's confidence score.

    Adjustment logic:
        - LLM returns semantic_score (0–100)
        - We compute delta = llm_score - rule_score
        - Delta is capped at MAX_UPWARD / MAX_DOWNWARD limits
        - Final score = rule_score + capped_delta
        - If is_likely_product_page=False → hard downgrade to LOW tier

    Args:
        product: ProductData with rule-based score already set
        raw:     Raw LLM response string

    Returns:
        Updated ProductData — never raises
    """
    cleaned = _clean_json_string(raw)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Can't parse — return unchanged
        return product

    semantic_score      = data.get("semantic_score", product.confidence_score)
    is_product_page     = data.get("is_likely_product_page", True)
    category_clear      = data.get("category_is_clear", True)
    description_useful  = data.get("description_is_useful", True)
    issues              = data.get("issues", [])
    suggested_category  = data.get("suggested_category")
    llm_notes           = data.get("notes", "")

    rule_score  = product.confidence_score
    new_score   = rule_score
    notes_parts = [product.extraction_notes or ""]

    # ── Hard downgrade: not a product page ───────
    if not is_product_page:
        new_score = min(rule_score, 30)
        notes_parts.append("LLM: not identified as a product page")

    else:
        # ── Compute bounded delta ────────────────
        delta = semantic_score - rule_score

        if delta > 0:
            # LLM thinks it's better than rule score → boost (capped)
            bounded_delta = min(delta, MAX_UPWARD_ADJUSTMENT)
        else:
            # LLM thinks it's worse → penalise (capped)
            bounded_delta = max(delta, -MAX_DOWNWARD_ADJUSTMENT)

        new_score = rule_score + bounded_delta

        # ── Category issue ───────────────────────
        if not category_clear:
            new_score -= 8
            notes_parts.append("LLM: category is unclear")
            if suggested_category:
                notes_parts.append(f"Suggested: {suggested_category}")

        # ── Description issue ────────────────────
        if not description_useful:
            new_score -= 5
            notes_parts.append("LLM: description not useful")

        # ── Specific issues from LLM ─────────────
        if issues:
            notes_parts.append("Issues: " + "; ".join(issues[:3]))   # cap at 3

    # ── Add LLM notes if present ─────────────────
    if llm_notes:
        notes_parts.append(f"LLM note: {llm_notes}")

    # ── Clamp final score ────────────────────────
    new_score = max(0, min(100, new_score))

    # ── Recompute tier ───────────────────────────
    new_tier = _score_to_tier(new_score)

    # ── Build final notes string ─────────────────
    final_notes = " | ".join(p for p in notes_parts if p).strip(" |")

    # ── Apply category suggestion if category was null ──
    updates = {
        "confidence_score": new_score,
        "confidence_tier":  new_tier,
        "extraction_notes": final_notes[:300],  # cap notes length
    }

    if suggested_category and not product.category:
        updates["category"] = suggested_category

    return product.model_copy(update=updates)



# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _should_run_semantic(product: ProductData) -> bool:
    """
    Returns True if this product is in the band where semantic
    scoring adds value (40–85).

    Outside this band:
        < 40: already too low, semantic check won't save it
        > 85: already high confidence, trust rule-based result
    """
    return SEMANTIC_SCORE_MIN <= product.confidence_score <= SEMANTIC_SCORE_MAX


def _build_product_summary(product: ProductData) -> str:
    """
    Builds a compact JSON summary of the product for the LLM prompt.
    Only includes fields relevant to quality assessment.
    Keeps token usage low.
    """
    summary = {
        "product_name":     product.product_name,
        "category":         product.category,
        "description":      (product.description or "")[:300],  # truncate long descriptions
        "price":            product.price,
        "packaging":        product.packaging,
        "certifications":   product.certifications,
        "moq":              product.moq,
        "hs_code":          product.hs_code,
        "source_url":       product.source_url,
        "extraction_notes": product.extraction_notes,
    }
    return json.dumps(summary, indent=2)


def _score_to_tier(score: int) -> ConfidenceTier:
    """Maps numeric score to ConfidenceTier."""
    if score >= CONFIDENCE_THRESHOLDS["high"]:
        return ConfidenceTier.HIGH
    if score >= CONFIDENCE_THRESHOLDS["medium"]:
        return ConfidenceTier.MEDIUM
    return ConfidenceTier.LOW


def _clean_json_string(raw: str) -> str:
    """Strips markdown fences and whitespace from LLM JSON output."""
    cleaned = raw.strip().lstrip("\ufeff")
    if cleaned.startswith("```"):
        lines = [l for l in cleaned.split("\n") if not l.strip().startswith("```")]
        cleaned = "\n".join(lines)
    return cleaned.strip()