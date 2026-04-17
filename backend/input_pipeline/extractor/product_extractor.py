"""
extractor/product_extractor.py
--------------------------------
Takes a CrawledPage classified as PRODUCT and extracts structured
product data using an LLM.

Responsibilities:
    - Build the extraction prompt from the page content
    - Call the LLM with retry logic
    - Parse and validate the JSON response
    - Map the response to a ProductData model
    - Handle partial extractions gracefully (never crash on bad LLM output)

This module does NOT score confidence — that happens in scorer/.
It just extracts. The confidence scorer runs after.

Usage:
    from input_pipeline.extractor.product_extractor import extract_product

    product = await extract_product(crawled_page)
    # returns ProductData with fields populated from LLM
"""

import json
import asyncio

from input_pipeline.models.page import CrawledPage
from input_pipeline.models.product import ProductData
from input_pipeline.extractor.prompts import get_prompt
from input_pipeline.config import LLM
from modules.base_module import call_openai


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

async def extract_product(page: CrawledPage) -> ProductData:
    """
    Extracts structured product data from a cleaned product page.

    Args:
        page: CrawledPage with clean_text populated

    Returns:
        ProductData — always returned, never raises.
        On LLM failure, returns a minimal ProductData with
        product_name taken from page title and error in extraction_notes.
    """
    if not page.clean_text:
        return _empty_product(page, reason="empty clean_text")

    prompt = get_prompt("product_extraction")

    user_message = prompt["user"].format(
        source_url=page.url,
        page_title=page.title or "",
        clean_text=page.clean_text,
    )

    raw_response = await call_openai(
        model=LLM["extraction_model"],
        messages=[
            {"role": "system", "content": prompt["system"]},
            {"role": "user",   "content": user_message},
        ],
        max_tokens=LLM["extraction_max_tokens"],
        temperature=LLM["extraction_temperature"],
        call_type="product_extraction",
        module="product_extractor",
        response_format={"type": "json_object"},
    )

    if raw_response is None:
        return _empty_product(page, reason="LLM call failed after retries")

    return _parse_response(raw_response, page)


async def extract_products_batch(
    pages: list[CrawledPage],
    concurrency: int = 3,
) -> list[ProductData]:
    """
    Extracts products from multiple pages with controlled concurrency.

    Args:
        pages:       List of CrawledPage classified as PRODUCT
        concurrency: Max simultaneous LLM calls

    Returns:
        List of ProductData in same order as input pages.
    """
    semaphore = asyncio.Semaphore(concurrency)

    async def _extract_with_semaphore(page: CrawledPage) -> ProductData:
        async with semaphore:
            return await extract_product(page)

    tasks = [_extract_with_semaphore(p) for p in pages]
    return await asyncio.gather(*tasks)



# ─────────────────────────────────────────────
#  RESPONSE PARSING
# ─────────────────────────────────────────────

def _parse_response(raw: str, page: CrawledPage) -> ProductData:
    """
    Parses the LLM JSON response into a ProductData model.

    Handles:
    - Valid JSON → maps to ProductData
    - JSON with extra/missing fields → Pydantic handles gracefully
    - Invalid JSON → returns minimal ProductData with error note
    - Partial extractions → keeps whatever was extracted

    Args:
        raw:  Raw string from LLM
        page: Source CrawledPage (used for fallback values)

    Returns:
        ProductData — never raises
    """
    # ── Clean up common LLM JSON issues ─────────
    cleaned = _clean_json_string(raw)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"  ⚠️  JSON parse failed for {page.url}: {e}")
        return _empty_product(page, reason=f"JSON parse error: {str(e)[:80]}")

    # ── Ensure source_url is always set ─────────
    data["source_url"] = page.url
    data["page_title"] = page.title or ""

    # ── Sanitise fields ──────────────────────────
    data = _sanitise_extracted_data(data)

    # ── Build ProductData via Pydantic ───────────
    # Pydantic will ignore unknown fields and use defaults for missing ones
    try:
        product = ProductData(**data)
        return product
    except Exception as e:
        print(f"  ⚠️  ProductData validation failed for {page.url}: {e}")
        # Last resort — build a minimal product from whatever we have
        return ProductData(
            product_name=data.get("product_name") or page.title or "Unknown Product",
            description=data.get("description") or "",
            source_url=page.url,
            page_title=page.title or "",
            extraction_notes=f"Validation error: {str(e)[:80]}",
        )


def _sanitise_extracted_data(data: dict) -> dict:
    """
    Cleans up common LLM output issues before passing to Pydantic:
    - Converts "null" strings to None
    - Ensures list fields are actually lists
    - Strips whitespace from string fields
    - Removes empty string values (treat as null)
    """
    LIST_FIELDS = {"certifications", "variants", "images"}
    DICT_FIELDS = {"specifications"}

    sanitised = {}
    for key, value in data.items():

        # String "null" → None
        if value == "null" or value == "None":
            sanitised[key] = None
            continue

        # Empty string → None (except extraction_notes)
        if isinstance(value, str) and value.strip() == "" and key != "extraction_notes":
            sanitised[key] = None
            continue

        # Strip whitespace from strings
        if isinstance(value, str):
            sanitised[key] = value.strip()
            continue

        # Ensure list fields are lists
        if key in LIST_FIELDS:
            if value is None:
                sanitised[key] = []
            elif isinstance(value, str):
                # Sometimes LLM returns a comma-separated string instead of array
                sanitised[key] = [v.strip() for v in value.split(",") if v.strip()]
            elif isinstance(value, list):
                # Clean each item in the list
                sanitised[key] = [
                    str(item).strip() for item in value
                    if item and str(item).strip()
                ]
            else:
                sanitised[key] = []
            continue

        # Ensure dict fields are dicts
        if key in DICT_FIELDS:
            if not isinstance(value, dict):
                sanitised[key] = None
            else:
                sanitised[key] = value
            continue

        sanitised[key] = value

    return sanitised


def _clean_json_string(raw: str) -> str:
    """
    Cleans common LLM JSON formatting issues:
    - Strips markdown code fences (```json ... ```)
    - Strips leading/trailing whitespace
    - Removes BOM characters
    """
    cleaned = raw.strip()

    # Strip BOM
    cleaned = cleaned.lstrip("\ufeff")

    # Strip markdown fences — even though we use json_object mode,
    # some models still wrap in fences occasionally
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # Remove first line (```json) and last line (```)
        lines = [l for l in lines if not l.strip().startswith("```")]
        cleaned = "\n".join(lines)

    return cleaned.strip()


# ─────────────────────────────────────────────
#  FALLBACK CONSTRUCTOR
# ─────────────────────────────────────────────

def _empty_product(page: CrawledPage, reason: str) -> ProductData:
    """
    Returns a minimal ProductData when extraction fails.
    Uses the page title as product_name if available.
    Sets extraction_notes so the confidence scorer knows why it's empty.
    """
    return ProductData(
        product_name=page.title or "Unknown Product",
        description="",
        source_url=page.url,
        page_title=page.title or "",
        extraction_notes=f"Extraction failed: {reason}",
    )