"""
classifier/content_classifier.py
----------------------------------
Confirms or overrides a URL classification using the actual HTML
content of a fetched page.

This runs AFTER the page has been fetched and cleaned.
It uses content signals (text patterns found in the page body)
to either:
    - Confirm what url_classifier already decided (raises confidence)
    - Override a low-confidence URL classification
    - Downgrade a false positive (e.g. URL says "products" but page
      is actually a category listing)

Classification priority:
    1. If url_classifier confidence >= 0.85 → trust it, just confirm
    2. If url_classifier confidence < 0.85  → run content checks, may override
    3. Always downgrade PRODUCT → CATEGORY if listing signals found in content

Usage:
    from input_pipeline.classifier.content_classifier import confirm_classification

    result = confirm_classification(
        url_result=url_classify_result,
        clean_text=page_clean_text,
        html=raw_html,
    )
"""

from bs4 import BeautifulSoup
from dataclasses import dataclass
from typing import List
from input_pipeline.models.page import PageType
from input_pipeline.classifier.url_classifier import ClassificationResult
from input_pipeline.config import (
    PRODUCT_CONTENT_SIGNALS,
    PRODUCT_CONTENT_SIGNAL_THRESHOLD,
    ABOUT_CONTENT_SIGNALS,
    ABOUT_CONTENT_SIGNAL_THRESHOLD,
)


# ─────────────────────────────────────────────
#  CONTENT LISTING SIGNALS
#  (confirms a page is a category, not a product)
# ─────────────────────────────────────────────

LISTING_CONTENT_SIGNALS: List[str] = [
    "sort by", "filter by", "showing results",
    "view all", "load more", "next page",
    "products found", "items found",
    "refine search", "all categories",
    "showing", "of", "results",         # "Showing 1–12 of 48 results"
]

LISTING_CONTENT_SIGNAL_THRESHOLD: int = 2

# Contact page content signals
CONTACT_CONTENT_SIGNALS: List[str] = [
    "get in touch", "send us a message", "write to us",
    "phone", "email us", "our address",
    "fill in the form", "contact form",
    "reach us", "drop us a line",
]

CONTACT_CONTENT_SIGNAL_THRESHOLD: int = 2

# Confidence boost when content confirms URL classification
CONTENT_CONFIRM_BOOST: float = 0.08

# Confidence cap after content confirmation
MAX_CONFIDENCE: float = 0.98


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

def confirm_classification(
    url_result:  ClassificationResult,
    clean_text:  str,
    html:        str = "",
) -> ClassificationResult:
    """
    Takes the URL classifier's result and the page's clean text,
    then confirms or overrides the classification using content signals.

    Args:
        url_result:  Output of url_classifier.classify_url()
        clean_text:  trafilatura-cleaned text of the page
        html:        Raw HTML (optional, used for structural checks)

    Returns:
        A new ClassificationResult — either confirmed, boosted,
        or overridden based on what's actually on the page.
    """
    text_low = clean_text.lower()

    # ── High confidence URL result — just confirm ──
    # If URL classifier is already very confident, don't override.
    # Still run a quick listing-signal check to catch false positives.
    if url_result.confidence >= 0.85:
        if url_result.page_type == PageType.PRODUCT:
            # Only override a high-confidence product URL if listing signals
            # are STRONG (threshold=4, not the default 2).
            # Reason: product pages on many sites still contain nav/footer
            # text with words like "showing", "results" etc. We need a
            # stronger signal to override a confident URL classification.
            listing_hits = _count_hits(text_low, LISTING_CONTENT_SIGNALS)
            if listing_hits >= 4:
                return ClassificationResult(
                    page_type=PageType.CATEGORY,
                    confidence=0.80,
                    reason=f"URL said product but content has strong listing signals ({listing_hits} hits)",
                    should_crawl=True,
                )
        return url_result  # trust the URL classifier

    # ── Low/medium confidence — run full content checks ──
    return _classify_by_content(url_result, text_low, html)


# ─────────────────────────────────────────────
#  CONTENT-BASED CLASSIFICATION
# ─────────────────────────────────────────────

def _classify_by_content(
    url_result: ClassificationResult,
    text_low:   str,
    html:       str,
) -> ClassificationResult:
    """
    Runs all content signal checks and returns the best classification.
    Used when URL classifier confidence is below 0.85.
    """

    # ── Check for listing/category page first ────────
    # This takes priority — we never want to extract a listing page
    # as a product page (it would produce garbage extraction output)
    if _is_listing_page(text_low):
        return ClassificationResult(
            page_type=PageType.CATEGORY,
            confidence=0.82,
            reason="content has listing signals (sort/filter/showing results)",
            should_crawl=True,
        )

    # ── Check product content signals ────────────────
    product_hits = _count_hits(text_low, PRODUCT_CONTENT_SIGNALS)
    if product_hits >= PRODUCT_CONTENT_SIGNAL_THRESHOLD:
        confidence = _compute_confidence(
            base=url_result.confidence,
            hits=product_hits,
            threshold=PRODUCT_CONTENT_SIGNAL_THRESHOLD,
            max_hits=8,
        )
        # Extra boost if URL also had a product signal
        if url_result.page_type == PageType.PRODUCT:
            confidence = min(MAX_CONFIDENCE, confidence + CONTENT_CONFIRM_BOOST)
            reason = f"URL + content both confirm product ({product_hits} content hits)"
        else:
            reason = f"content overrides URL → product ({product_hits} content hits)"

        return ClassificationResult(
            page_type=PageType.PRODUCT,
            confidence=confidence,
            reason=reason,
            should_crawl=True,
        )

    # ── Check about page content signals ─────────────
    about_hits = _count_hits(text_low, ABOUT_CONTENT_SIGNALS)
    if about_hits >= ABOUT_CONTENT_SIGNAL_THRESHOLD:
        confidence = _compute_confidence(
            base=url_result.confidence,
            hits=about_hits,
            threshold=ABOUT_CONTENT_SIGNAL_THRESHOLD,
            max_hits=6,
        )
        if url_result.page_type == PageType.ABOUT:
            confidence = min(MAX_CONFIDENCE, confidence + CONTENT_CONFIRM_BOOST)
            reason = f"URL + content both confirm about ({about_hits} content hits)"
        else:
            reason = f"content overrides URL → about ({about_hits} content hits)"

        return ClassificationResult(
            page_type=PageType.ABOUT,
            confidence=confidence,
            reason=reason,
            should_crawl=True,
        )

    # ── Check contact page content signals ───────────
    contact_hits = _count_hits(text_low, CONTACT_CONTENT_SIGNALS)
    if contact_hits >= CONTACT_CONTENT_SIGNAL_THRESHOLD:
        if url_result.page_type == PageType.CONTACT:
            reason = f"URL + content both confirm contact ({contact_hits} hits)"
        else:
            reason = f"content overrides URL → contact ({contact_hits} hits)"

        return ClassificationResult(
            page_type=PageType.CONTACT,
            confidence=0.82,
            reason=reason,
            should_crawl=True,
        )

    # ── Structural HTML check for product page ────────
    # Some product pages have very little text but have
    # structural elements like specification tables or price tags
    if html and _has_product_structure(html):
        return ClassificationResult(
            page_type=PageType.PRODUCT,
            confidence=0.65,
            reason="HTML structure suggests product page (table/price elements)",
            should_crawl=True,
        )

    # ── No strong content signals — fall back to URL result ──
    # Keep URL classification but lower confidence since content
    # didn't confirm it
    return ClassificationResult(
        page_type=url_result.page_type,
        confidence=max(0.3, url_result.confidence - 0.15),
        reason=f"content inconclusive, keeping URL result with reduced confidence",
        should_crawl=url_result.should_crawl,
    )


# ─────────────────────────────────────────────
#  STRUCTURAL HTML CHECK
# ─────────────────────────────────────────────

def _has_product_structure(html: str) -> bool:
    """
    Checks for HTML structural elements that suggest a product page
    even when clean text is sparse.

    Looks for:
    - Tables with specification-like content
    - Elements with price-related class names
    - Schema.org Product markup
    """
    soup = BeautifulSoup(html, "html.parser")

    # Schema.org Product markup — definitive signal
    schema_tags = soup.find_all(
        attrs={"itemtype": lambda v: v and "schema.org/Product" in v}
    )
    if schema_tags:
        return True

    # Price-related class names in any element
    PRICE_CLASSES = ["price", "product-price", "offer-price", "unit-price"]
    for cls in PRICE_CLASSES:
        if soup.find(class_=lambda c: c and cls in c.lower()):
            return True

    # Specification table — common on B2B product pages
    tables = soup.find_all("table")
    for table in tables:
        table_text = table.get_text(separator=" ").lower()
        spec_keywords = ["specification", "purity", "moisture", "hs code", "packaging"]
        if sum(1 for kw in spec_keywords if kw in table_text) >= 2:
            return True

    return False


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _is_listing_page(text_low: str) -> bool:
    """
    Returns True if the page text has enough signals to be
    identified as a listing / category page.
    """
    hits = _count_hits(text_low, LISTING_CONTENT_SIGNALS)
    return hits >= LISTING_CONTENT_SIGNAL_THRESHOLD


def _count_hits(text: str, signals: List[str]) -> int:
    """Counts how many signals from the list appear in the text."""
    return sum(1 for s in signals if s in text)


def _compute_confidence(
    base:       float,
    hits:       int,
    threshold:  int,
    max_hits:   int,
) -> float:
    """
    Computes a confidence score based on:
    - base:      Starting confidence from URL classifier
    - hits:      Number of content signal hits found
    - threshold: Minimum hits needed to trigger this type
    - max_hits:  Hit count at which we reach maximum confidence

    Scales linearly from base → 0.92 as hits go from threshold → max_hits.
    """
    if hits <= threshold:
        return min(MAX_CONFIDENCE, base + 0.10)

    scale      = min(1.0, (hits - threshold) / max(1, max_hits - threshold))
    confidence = base + 0.10 + (scale * 0.25)
    return min(MAX_CONFIDENCE, confidence)