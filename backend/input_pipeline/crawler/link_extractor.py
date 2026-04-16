"""
crawler/link_extractor.py
--------------------------
Extracts and scores internal links from a crawled page's HTML.

Responsibilities:
    - Parse all <a href> tags from raw HTML
    - Filter out external links, noise, and skip patterns
    - Score each link by how likely it leads to a product page
    - Deduplicate and normalise URLs

Nothing about fetching pages or classifying page types lives here.
This module only deals with link discovery from already-fetched HTML.

Usage:
    from input_pipeline.crawler.link_extractor import extract_links

    links = extract_links(html, base_url="https://example.com")
    # returns list[ExtractedLink] sorted by score descending
"""

import re
from urllib.parse import urlparse, urljoin, urlunparse
from bs4 import BeautifulSoup
from dataclasses import dataclass, field
from typing import List,Optional,Tuple

from input_pipeline.config import (
    SKIP_PATTERNS,
    PRODUCT_URL_SIGNALS,
    CATEGORY_URL_SIGNALS,
    ABOUT_URL_SIGNALS,
    CONTACT_URL_SIGNALS,
)


# ─────────────────────────────────────────────
#  DATA CLASS
# ─────────────────────────────────────────────

@dataclass
class ExtractedLink:
    """
    A single internal link found on a page, with scoring metadata.
    Passed to the orchestrator to decide crawl priority.
    """
    url:        str
    path:       str
    link_text:  str
    score:      int         # higher = more likely product-related
    hint:       str = ""    # what signal gave it the score e.g. "product_url"


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

def extract_links(html: str, base_url: str) -> List[ExtractedLink]:
    """
    Extracts all valid internal links from a page's HTML.

    Args:
        html:     Raw HTML string of the page
        base_url: The URL this HTML was fetched from (used for resolving
                  relative hrefs and filtering external links)

    Returns:
        List of ExtractedLink sorted by score descending.
        Higher-scored links (likely product pages) come first,
        so the BFS crawler processes them with higher priority.
    """
    parsed_base  = urlparse(base_url)
    base_domain  = parsed_base.netloc
    base_scheme  = parsed_base.scheme

    soup   = BeautifulSoup(html, "html.parser")
    seen   = set()
    links  = []

    for a_tag in soup.find_all("a", href=True):
        href      = a_tag["href"].strip()
        link_text = a_tag.get_text(strip=True).lower()[:80]  # cap text length

        # ── Resolve and validate URL ────────────────
        full_url = _resolve_url(href, base_scheme, base_domain)
        if not full_url:
            continue

        # ── Filter external links ───────────────────
        if urlparse(full_url).netloc != base_domain:
            continue

        # ── Normalise (strip fragments, trailing slash) ──
        full_url = _normalise_url(full_url)

        # ── Skip noise patterns ─────────────────────
        if _should_skip(full_url, link_text):
            continue

        # ── Deduplicate ─────────────────────────────
        if full_url in seen:
            continue
        seen.add(full_url)

        # ── Score the link ──────────────────────────
        score, hint = _score_link(full_url, link_text)

        links.append(ExtractedLink(
            url=full_url,
            path=urlparse(full_url).path,
            link_text=link_text,
            score=score,
            hint=hint,
        ))

    # Sort: highest score first so BFS processes product-likely pages first
    links.sort(key=lambda x: x.score, reverse=True)
    return links


# ─────────────────────────────────────────────
#  URL HELPERS
# ─────────────────────────────────────────────

def _resolve_url(href: str, base_scheme: str, base_domain: str) -> Optional[str]:
    """
    Resolves a raw href into a full absolute URL.
    Returns None if the href is unsupported or invalid.
    """
    # Skip non-HTTP protocols immediately
    UNSUPPORTED_PREFIXES = (
        "mailto:", "tel:", "javascript:", "whatsapp:",
        "data:", "ftp:", "#",
    )
    if any(href.startswith(p) for p in UNSUPPORTED_PREFIXES):
        return None

    if href.startswith("//"):
        return f"{base_scheme}:{href}"

    if href.startswith("/"):
        return f"{base_scheme}://{base_domain}{href}"

    if href.startswith("http"):
        return href

    # Relative path — skip (too ambiguous without knowing current page path)
    return None


def _normalise_url(url: str) -> str:
    """
    Normalises a URL for deduplication:
    - Strips URL fragments (#section)
    - Strips trailing slashes
    - Strips common tracking params (utm_*, ref, etc.)
    """
    parsed = urlparse(url)

    # Strip fragment
    clean = urlunparse((
        parsed.scheme,
        parsed.netloc,
        parsed.path.rstrip("/"),
        parsed.params,
        _strip_tracking_params(parsed.query),
        "",     # no fragment
    ))
    return clean


def _strip_tracking_params(query: str) -> str:
    """
    Removes known tracking / session query params that create
    duplicate URLs for the same content.
    """
    if not query:
        return ""

    TRACKING_PARAMS = {
        "utm_source", "utm_medium", "utm_campaign", "utm_term",
        "utm_content", "ref", "referrer", "source", "fbclid",
        "gclid", "mc_cid", "mc_eid", "sessionid", "_ga",
    }

    kept = []
    for part in query.split("&"):
        key = part.split("=")[0].lower()
        if key not in TRACKING_PARAMS:
            kept.append(part)

    return "&".join(kept)


# ─────────────────────────────────────────────
#  SKIP FILTER
# ─────────────────────────────────────────────

def _should_skip(url: str, link_text: str) -> bool:
    """
    Returns True if this URL should be excluded from crawling entirely.
    Checks both the URL path and the link text against SKIP_PATTERNS.
    """
    url_lower  = url.lower()
    text_lower = link_text.lower()

    return any(
        pattern in url_lower or pattern in text_lower
        for pattern in SKIP_PATTERNS
    )


# ─────────────────────────────────────────────
#  SCORING
# ─────────────────────────────────────────────

def _score_link(url: str, link_text: str) -> Tuple[int, str]:
    """
    Scores a link by how likely it is to lead to a product page.

    Scoring tiers:
        3 pts — strong product URL signal
        2 pts — category URL signal (may contain product links inside)
        1 pt  — about / contact signal
        0     — no signal, but still a valid internal link

    Returns:
        (score, hint) where hint describes what gave it the score
    """
    path      = urlparse(url).path.lower()
    combined  = f"{path} {link_text}"

    # ── Product signals (highest priority) ──────
    if any(signal in combined for signal in PRODUCT_URL_SIGNALS):
        # Extra point if BOTH the path AND link text have product signals
        # e.g. path=/products/turmeric AND text="Organic Turmeric Powder"
        path_hit = any(s in path        for s in PRODUCT_URL_SIGNALS)
        text_hit = any(s in link_text   for s in PRODUCT_URL_SIGNALS)
        score    = 3 + (1 if path_hit and text_hit else 0)
        return score, "product_url"

    # ── Category signals ─────────────────────────
    if any(signal in combined for signal in CATEGORY_URL_SIGNALS):
        return 2, "category_url"

    # ── About signals ────────────────────────────
    if any(signal in combined for signal in ABOUT_URL_SIGNALS):
        return 1, "about_url"

    # ── Contact signals ──────────────────────────
    if any(signal in combined for signal in CONTACT_URL_SIGNALS):
        return 1, "contact_url"

    # ── URL depth heuristic ──────────────────────
    # Deeper paths are more likely to be individual pages (not homepages)
    path_depth = len([p for p in path.split("/") if p])
    if path_depth >= 2:
        return 1, "deep_path"

    return 0, "no_signal"