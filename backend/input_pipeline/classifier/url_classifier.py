"""
classifier/url_classifier.py
-----------------------------
Classifies a URL into a PageType using rule-based heuristics.
No LLM, no HTML needed — purely from the URL string itself.

Classification priority (first match wins):
    1. IGNORE   — matches skip patterns or is a static asset
    2. HOME     — is the root URL
    3. CATEGORY — matches category URL signals OR has "categor" path segment
                  (MUST be before PRODUCT — /product-category/ contains "product")
    4. PRODUCT  — matches product URL signals
    5. ABOUT    — matches about URL signals
    6. CONTACT  — matches contact URL signals
    7. PRODUCT  — deep path heuristic (depth >= 2, no other match)
    8. IGNORE   — fallback
"""

from urllib.parse import urlparse
from dataclasses import dataclass

from input_pipeline.models.page import PageType
from input_pipeline.config import (
    SKIP_PATTERNS,
    PRODUCT_URL_SIGNALS,
    CATEGORY_URL_SIGNALS,
    ABOUT_URL_SIGNALS,
    CONTACT_URL_SIGNALS,
)


# ─────────────────────────────────────────────
#  RESULT DATACLASS
# ─────────────────────────────────────────────

@dataclass
class ClassificationResult:
    """
    Output of classify_url().
    Carries the page type, confidence, and what rule triggered it.
    """
    page_type:    PageType
    confidence:   float       # 0.0 – 1.0
    reason:       str         # human-readable explanation
    should_crawl: bool        # convenience flag for orchestrator


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

def classify_url(url: str, base_url: str = "") -> ClassificationResult:
    """
    Classifies a URL into a PageType using URL-pattern rules only.
    """
    parsed   = urlparse(url.lower())
    path     = parsed.path.rstrip("/")
    path_low = path.lower()

    # ── 1. IGNORE ───────────────────────────────
    if _matches_skip(url):
        return ClassificationResult(
            page_type=PageType.IGNORE,
            confidence=1.0,
            reason="matched skip pattern",
            should_crawl=False,
        )

    # ── 2. HOME ─────────────────────────────────
    if _is_homepage(url, base_url, path):
        return ClassificationResult(
            page_type=PageType.HOME,
            confidence=1.0,
            reason="root path",
            should_crawl=True,
        )

    # ── 3. CATEGORY — BEFORE product check ──────
    # Critical ordering: /product-category/energy contains the word "product"
    # as a substring. If we check product signals first, it incorrectly wins.
    # We check for "categor" in any individual path segment (not full path)
    # to catch /product-category/, /collections/, /shop/category/ etc.
    path_segments     = [s for s in path_low.split("/") if s]

    # ── Shopify nested product URL override ──────
    # /collections/bags/products/royal-handbag  →  PRODUCT  (not category)
    # Even though "collections" is in the path, the presence of a slug after
    # "products" makes it a product detail page, not a listing.
    if "products" in path_segments:
        products_idx = path_segments.index("products")
        if products_idx < len(path_segments) - 1:   # slug exists after "products"
            depth      = _path_depth(path)
            return ClassificationResult(
                page_type=PageType.PRODUCT,
                confidence=0.92,
                reason="nested product URL (/collections/*/products/slug)",
                should_crawl=True,
            )

    has_category_seg  = any(
                "categor" in seg or
                # Bare /products listing page → category.
                # /products/some-slug → product page, NOT category.
                (seg == "products" and len(path_segments) == 1)
                for seg in path_segments)
    category_hits     = _count_signal_hits(path_low, CATEGORY_URL_SIGNALS)

    if has_category_seg or category_hits > 0:
        return ClassificationResult(
            page_type=PageType.CATEGORY,
            confidence=0.90,
            reason=f"category signal (segment={has_category_seg}, hits={category_hits})",
            should_crawl=True,
        )

    # ── 4. PRODUCT ──────────────────────────────
    product_hits = _count_signal_hits(path_low, PRODUCT_URL_SIGNALS)
    if product_hits > 0:
        depth      = _path_depth(path)
        confidence = min(0.95, 0.75 + (0.1 * product_hits) + (0.05 * min(depth, 2)))
        return ClassificationResult(
            page_type=PageType.PRODUCT,
            confidence=confidence,
            reason=f"product URL signal ({product_hits} hits, depth {depth})",
            should_crawl=True,
        )

    # ── 5. ABOUT ────────────────────────────────
    about_hits = _count_signal_hits(path_low, ABOUT_URL_SIGNALS)
    if about_hits > 0:
        return ClassificationResult(
            page_type=PageType.ABOUT,
            confidence=0.85,
            reason=f"about URL signal ({about_hits} hits)",
            should_crawl=True,
        )

    # ── 6. CONTACT ──────────────────────────────
    contact_hits = _count_signal_hits(path_low, CONTACT_URL_SIGNALS)
    if contact_hits > 0:
        return ClassificationResult(
            page_type=PageType.CONTACT,
            confidence=0.85,
            reason=f"contact URL signal ({contact_hits} hits)",
            should_crawl=True,
        )

    # ── 7. PRODUCT — deep path heuristic ────────
    depth = _path_depth(path)
    if depth >= 2:
        return ClassificationResult(
            page_type=PageType.PRODUCT,
            confidence=0.55,
            reason=f"deep path heuristic (depth {depth}, no signal match)",
            should_crawl=True,
        )

    # ── 8. IGNORE — fallback ────────────────────
    return ClassificationResult(
        page_type=PageType.IGNORE,
        confidence=0.5,
        reason="no matching signal, shallow path",
        should_crawl=False,
    )


def should_crawl_url(url: str, base_url: str = "") -> bool:
    """Quick boolean — should we crawl this URL at all?"""
    return classify_url(url, base_url).should_crawl


def get_crawl_depth_budget(page_type: PageType, config_depth_budget: dict) -> int:
    """Returns max crawl depth for a given page type from config."""
    return config_depth_budget.get(page_type.value, 0)


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _matches_skip(url: str) -> bool:
    url_low = url.lower()
    return any(pattern in url_low for pattern in SKIP_PATTERNS)


def _is_homepage(url: str, base_url: str, path: str) -> bool:
    if base_url and url.rstrip("/").lower() == base_url.rstrip("/").lower():
        return True
    if path in ("", "/", ""):
        return True
    return False


def _count_signal_hits(path: str, signals: list[str]) -> int:
    return sum(1 for signal in signals if signal in path)


def _path_depth(path: str) -> int:
    return len([seg for seg in path.split("/") if seg])