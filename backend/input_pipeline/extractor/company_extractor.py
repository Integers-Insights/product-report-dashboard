"""
extractor/company_extractor.py
--------------------------------
Takes CrawledPages classified as ABOUT or CONTACT and extracts
structured company data using an LLM.

Responsibilities:
    - Merge content from multiple pages (about + contact) before extraction
      so the LLM sees the full picture in one call
    - Call the LLM with retry logic
    - Parse and validate the JSON response
    - Map the response to a CompanyData model
    - Provide a to_preference_patch() dict for DB upsert

Key difference from product_extractor:
    - We may have MULTIPLE pages to extract from (about page + contact page
      + certifications page) — these get merged into one extraction call
    - Output is ONE CompanyData per website, not one per page
    - All fields are optional — partial data is still useful

Usage:
    from input_pipeline.extractor.company_extractor import extract_company

    # Pass all about/contact pages together
    company = await extract_company(pages, website_url="https://example.com")
    # returns CompanyData
"""

import json
import asyncio
from typing import List, Optional, Tuple
from input_pipeline.models.page import CrawledPage, PageType
from input_pipeline.models.company import CompanyData
from input_pipeline.extractor.prompts import get_prompt
from input_pipeline.config import LLM, CLEANER
from modules.base_module import call_openai


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

async def extract_company(
    pages:       List[CrawledPage],
    website_url: str = "",
) -> CompanyData:
    """
    Extracts structured company data from one or more about/contact pages.

    Multiple pages are merged into a single LLM call so the model
    sees all available company information at once — this produces
    better results than calling once per page and merging later.

    Args:
        pages:       List of CrawledPage classified as ABOUT or CONTACT.
                     Can also include HOME page as a supplementary source.
        website_url: Root URL of the website (used as fallback source)

    Returns:
        CompanyData — always returned, never raises.
        If no usable pages are provided, returns an empty CompanyData.
    """
    # ── Filter to pages with actual content ─────
    usable = [p for p in pages if p.clean_text and not p.error]

    if not usable:
        return CompanyData(
            website_url=website_url,
            extraction_notes="no usable about/contact pages found",
        )

    # ── Merge content from all pages ─────────────
    merged_text, source_urls = _merge_page_contents(usable)

    if not merged_text.strip():
        return CompanyData(
            website_url=website_url,
            extracted_from_urls=source_urls,
            extraction_notes="merged content was empty",
        )

    # ── Build prompt ─────────────────────────────
    prompt = get_prompt("company_extraction")

    # Use the first about page URL as primary source, fall back to website_url
    primary_url = source_urls[0] if source_urls else website_url
    primary_title = usable[0].title if usable else ""

    user_message = prompt["user"].format(
        source_url=primary_url,
        page_title=primary_title,
        clean_text=merged_text,
    )

    # ── Call LLM ─────────────────────────────────
    raw_response = await call_openai(
        model=LLM["extraction_model"],
        messages=[
            {"role": "system", "content": prompt["system"]},
            {"role": "user",   "content": user_message},
        ],
        max_tokens=LLM["extraction_max_tokens"],
        temperature=LLM["extraction_temperature"],
        call_type="company_extraction",
        module="company_extractor",
        response_format={"type": "json_object"},
    )

    if raw_response is None:
        return CompanyData(
            website_url=website_url,
            extracted_from_urls=source_urls,
            extraction_notes="LLM call failed after retries",
        )

    return _parse_response(raw_response, website_url, source_urls)


# ─────────────────────────────────────────────
#  PAGE CONTENT MERGING
# ─────────────────────────────────────────────

def _merge_page_contents(pages: List[CrawledPage]) -> Tuple[str, List[str]]:
    """
    Merges clean_text from multiple pages into a single string
    for a unified LLM extraction call.

    Strategy:
    - Sort pages: ABOUT first, then CONTACT, then HOME, then others
    - Add a clear section header before each page's content
    - Respect the max_chars limit — truncate merged content if needed
    - Collect source URLs for tracking

    Returns:
        (merged_text, source_urls)
    """
    # Sort by page type priority
    PAGE_TYPE_PRIORITY = {
        PageType.ABOUT:   0,
        PageType.CONTACT: 1,
        PageType.HOME:    2,
    }

    # Pages without page_type attribute default to lowest priority
    sorted_pages = sorted(
        pages,
        key=lambda p: PAGE_TYPE_PRIORITY.get(
            getattr(p, "page_type", None), 3
        ),
    )

    sections    = []
    source_urls = []
    total_chars = 0
    max_chars   = CLEANER["max_chars_for_extraction"]

    for page in sorted_pages:
        if total_chars >= max_chars:
            break

        source_urls.append(page.url)

        # How many chars we can still add
        remaining = max_chars - total_chars

        # Section header makes it clear to LLM where each page starts
        header  = f"\n\n--- PAGE: {page.title or page.url} ---\n"
        content = page.clean_text[:remaining - len(header)]

        section = header + content
        sections.append(section)
        total_chars += len(section)

    return "".join(sections).strip(), source_urls



# ─────────────────────────────────────────────
#  RESPONSE PARSING
# ─────────────────────────────────────────────

def _parse_response(
    raw:         str,
    website_url: str,
    source_urls: List[str],
) -> CompanyData:
    """
    Parses LLM JSON response into a CompanyData model.

    Args:
        raw:         Raw string from LLM
        website_url: Root website URL for fallback
        source_urls: Pages that were used for extraction

    Returns:
        CompanyData — never raises
    """
    cleaned = _clean_json_string(raw)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"  ⚠️  JSON parse failed for {website_url}: {e}")
        return CompanyData(
            website_url=website_url,
            extracted_from_urls=source_urls,
            extraction_notes=f"JSON parse error: {str(e)[:80]}",
        )

    # ── Always set tracking fields ───────────────
    data["website_url"]          = website_url
    data["extracted_from_urls"]  = source_urls

    # ── Sanitise ─────────────────────────────────
    data = _sanitise_extracted_data(data)

    # ── Build CompanyData via Pydantic ───────────
    try:
        return CompanyData(**data)
    except Exception as e:
        print(f"  ⚠️  CompanyData validation failed for {website_url}: {e}")
        return CompanyData(
            website_url=website_url,
            extracted_from_urls=source_urls,
            extraction_notes=f"Validation error: {str(e)[:80]}",
        )


def _sanitise_extracted_data(data: dict) -> dict:
    """
    Cleans LLM output before passing to Pydantic:
    - "null" strings → None
    - Empty strings → None
    - List fields enforced as lists
    - founded_year coerced to int or None
    """
    LIST_FIELDS = {
        "industries_served",
        "export_markets",
        "certifications",
        "regulatory_approvals",
        "extracted_from_urls",
    }

    sanitised = {}
    for key, value in data.items():

        # String "null" → None
        if value == "null" or value == "None":
            sanitised[key] = None
            continue

        # Empty string → None (except extraction_notes)
        if isinstance(value, str) and value.strip() == "" \
                and key != "extraction_notes":
            sanitised[key] = None
            continue

        # Strip whitespace from strings
        if isinstance(value, str):
            sanitised[key] = value.strip()
            continue

        # Enforce list fields
        if key in LIST_FIELDS:
            if value is None:
                sanitised[key] = []
            elif isinstance(value, str):
                sanitised[key] = [v.strip() for v in value.split(",") if v.strip()]
            elif isinstance(value, list):
                sanitised[key] = [
                    str(item).strip() for item in value
                    if item and str(item).strip()
                ]
            else:
                sanitised[key] = []
            continue

        # Coerce founded_year to int
        if key == "founded_year":
            try:
                sanitised[key] = int(value) if value else None
            except (ValueError, TypeError):
                sanitised[key] = None
            continue

        sanitised[key] = value

    return sanitised


def _clean_json_string(raw: str) -> str:
    """
    Strips markdown fences and whitespace from LLM JSON output.
    """
    cleaned = raw.strip().lstrip("\ufeff")

    if cleaned.startswith("```"):
        lines = [l for l in cleaned.split("\n") if not l.strip().startswith("```")]
        cleaned = "\n".join(lines)

    return cleaned.strip()