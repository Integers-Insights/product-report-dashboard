"""
cleaner/content_cleaner.py
--------------------------
Converts raw HTML into clean, readable text ready for LLM extraction.

Responsibilities:
    - Strip nav, footer, scripts, ads, cookie banners
    - Extract meaningful body content using trafilatura
    - Fall back to BeautifulSoup if trafilatura returns nothing
    - Return a CrawledPage with clean_text, snippet, word_count

This module has NO knowledge of page types or what to extract.
It just cleans. The extractor decides what to do with the clean text.

Usage:
    from input_pipeline.cleaner.content_cleaner import clean_page

    crawled = clean_page(raw_page)
    # returns CrawledPage with clean_text populated
"""

import re
from bs4 import BeautifulSoup
from typing import List
import trafilatura
from trafilatura.settings import use_config as trafilatura_use_config

from input_pipeline.models.page import RawPage, CrawledPage
from input_pipeline.config import CLEANER


# ─────────────────────────────────────────────
#  TRAFILATURA CONFIG
# ─────────────────────────────────────────────

# Build a trafilatura config once at module load — not per call
_trafilatura_config = trafilatura_use_config()
_trafilatura_config.set("DEFAULT", "EXTRACTION_TIMEOUT", "30")


# ─────────────────────────────────────────────
#  HTML TAGS TO STRIP BEFORE CLEANING
#  (noise that trafilatura sometimes keeps)
# ─────────────────────────────────────────────

NOISE_TAGS: List[str] = [
    "script", "style", "noscript",
    "nav", "header", "footer",
    "aside", "advertisement",
    "iframe", "svg", "canvas",
    "form",                         # contact/subscribe forms
]

NOISE_CLASS_KEYWORDS: List[str] = [
    "cookie", "banner", "popup", "modal",
    "newsletter", "subscribe", "overlay",
    "breadcrumb", "pagination",
    "sidebar", "widget", "social",
    "share", "related", "recommend",
    "ad-", "ads-", "advert",
]


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

def clean_page(raw_page: RawPage) -> CrawledPage:
    """
    Takes a RawPage (straight from Playwright) and returns a CrawledPage
    with clean_text, snippet, and word_count populated.

    Pipeline:
        1. If page has an error or empty HTML → return empty CrawledPage
        2. Try trafilatura extraction (best quality)
        3. Fall back to BeautifulSoup stripping if trafilatura returns nothing
        4. Final cleanup (whitespace normalisation)
        5. Truncate to max_chars limit for LLM
        6. Build snippet and word_count

    Args:
        raw_page: RawPage output from browser.py

    Returns:
        CrawledPage — always returned, never raises.
        If cleaning fails, clean_text will be empty and error will be set.
    """

    # ── Guard: failed fetch ─────────────────────────
    if raw_page.error or not raw_page.html:
        return CrawledPage(
            url=raw_page.url,
            path=raw_page.path,
            title=raw_page.title,
            depth=raw_page.depth,
            clean_text="",
            snippet="",
            word_count=0,
            error=raw_page.error or "empty HTML",
        )

    # ── Stage 1: trafilatura extraction ─────────────
    clean_text = _extract_with_trafilatura(raw_page.html)

    # ── Stage 2: BeautifulSoup fallback ─────────────
    if not clean_text or len(clean_text.split()) < CLEANER["min_word_count"]:
        clean_text = _extract_with_beautifulsoup(raw_page.html)

    # ── Stage 3: still nothing? ──────────────────────
    if not clean_text or len(clean_text.split()) < CLEANER["min_word_count"]:
        return CrawledPage(
            url=raw_page.url,
            path=raw_page.path,
            title=raw_page.title,
            depth=raw_page.depth,
            clean_text="",
            snippet="",
            word_count=0,
            error=f"content too sparse (< {CLEANER['min_word_count']} words after cleaning)",
        )

    # ── Stage 4: final whitespace cleanup ───────────
    clean_text = _normalise_whitespace(clean_text)

    # ── Stage 5: truncate for LLM ───────────────────
    # Keep the most relevant content within token budget
    # Product details are almost always in the first portion of the page
    max_chars  = CLEANER["max_chars_for_extraction"]
    clean_text = clean_text[:max_chars]

    # ── Stage 6: build metadata ──────────────────────
    word_count = len(clean_text.split())
    snippet    = _build_snippet(clean_text, CLEANER["snippet_length"])

    return CrawledPage(
        url=raw_page.url,
        path=raw_page.path,
        title=raw_page.title,
        depth=raw_page.depth,
        clean_text=clean_text,
        snippet=snippet,
        word_count=word_count,
    )


def clean_pages(raw_pages: List[RawPage]) -> List[CrawledPage]:
    """
    Batch version of clean_page.
    Filters out pages that produce empty clean_text after cleaning.

    Args:
        raw_pages: List of RawPage from crawler

    Returns:
        List of CrawledPage — only pages with usable content.
        Empty/failed pages are excluded.
    """
    crawled = [clean_page(p) for p in raw_pages]
    return [p for p in crawled if p.clean_text]


# ─────────────────────────────────────────────
#  EXTRACTION STRATEGIES
# ─────────────────────────────────────────────

def _extract_with_trafilatura(html: str) -> str:
    """
    Primary extraction using trafilatura.
    Best at identifying main content and ignoring boilerplate.
    """
    try:
        trafilatura_settings = CLEANER["trafilatura"]
        result = trafilatura.extract(
            html,
            config=_trafilatura_config,
            include_tables=trafilatura_settings["include_tables"],
            include_links=trafilatura_settings["include_links"],
            no_fallback=trafilatura_settings["no_fallback"],
            favor_precision=False,  # favor recall for product pages
            deduplicate=True,
        )
        return result or ""
    except Exception:
        return ""


def _extract_with_beautifulsoup(html: str) -> str:
    """
    Fallback extraction using BeautifulSoup.
    Used when trafilatura returns nothing or too little.

    Strips known noise tags and class-based noise elements,
    then returns remaining visible text.
    """
    try:
        soup = BeautifulSoup(html, "html.parser")

        # Remove known noise tags
        for tag in soup(NOISE_TAGS):
            tag.decompose()

        # Remove elements with noise-related class names
        for element in soup.find_all(class_=True):
            classes = " ".join(element.get("class", [])).lower()
            if any(noise in classes for noise in NOISE_CLASS_KEYWORDS):
                element.decompose()

        # Get remaining text
        text = soup.get_text(separator=" ", strip=True)
        return text or ""

    except Exception:
        return ""


# ─────────────────────────────────────────────
#  TEXT HELPERS
# ─────────────────────────────────────────────

def _normalise_whitespace(text: str) -> str:
    """
    Collapses multiple spaces, tabs, and newlines into single spaces.
    Removes lines that are just punctuation or single characters.
    """
    # Collapse all whitespace sequences into a single space
    text = re.sub(r"[ \t]+", " ", text)

    # Reduce multiple newlines to max 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove lines that are just noise (single chars, pure punctuation)
    lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if len(stripped) > 3:       # skip lines with 3 or fewer chars
            lines.append(stripped)

    return "\n".join(lines).strip()


def _build_snippet(text: str, length: int) -> str:
    """
    Returns a clean snippet for UI display (Step 2 product list).
    Tries to cut at a word boundary rather than mid-word.
    """
    if len(text) <= length:
        return text

    # Cut at word boundary
    snippet = text[:length]
    last_space = snippet.rfind(" ")
    if last_space > length * 0.8:   # only cut at word boundary if not too far back
        snippet = snippet[:last_space]

    return snippet.strip() + "..."