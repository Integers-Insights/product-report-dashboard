"""
models/page.py
--------------
Pydantic models representing a page at each stage of the pipeline.

Stages:
    RawPage        → straight out of Playwright (html + metadata)
    CrawledPage    → after content cleaning (clean text extracted)
    ClassifiedPage → after classification (page_type assigned)
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


# ─────────────────────────────────────────────
#  PAGE TYPE ENUM
# ─────────────────────────────────────────────

class PageType(str, Enum):
    """
    Classification of a crawled page.
    Used by both url_classifier and content_classifier.
    """
    PRODUCT  = "product"    # individual product / ingredient / service page
    CATEGORY = "category"   # listing / collection / category page
    ABOUT    = "about"      # about us / company overview / who we are
    CONTACT  = "contact"    # contact us / get in touch / locations
    HOME     = "home"       # root / homepage
    BLOG     = "blog"       # article / news / press release
    IGNORE   = "ignore"     # login, cart, cdn, static, 404, etc.


# ─────────────────────────────────────────────
#  CONFIDENCE TIER (for display in UI)
# ─────────────────────────────────────────────

class ConfidenceTier(str, Enum):
    HIGH     = "high"       # 80–100  → green dot
    MEDIUM   = "medium"     # 50–79   → orange dot, needs review
    LOW      = "low"        # 0–49    → red dot, enter manually or exclude


# ─────────────────────────────────────────────
#  RAW PAGE  (straight out of Playwright)
# ─────────────────────────────────────────────

class RawPage(BaseModel):
    """
    Output of crawler/browser.py — raw data fetched by Playwright.
    Nothing cleaned or classified yet.
    """
    url:        str
    path:       str                     # urlparse(url).path
    title:      str = ""
    html:       str    
    inner_text: str = ""                 # full raw HTML
    depth:      int = 0                 # crawl depth from start_url
    status:     int = 200               # HTTP status code if available
    error:      Optional[str] = None    # set if page fetch failed


# ─────────────────────────────────────────────
#  CRAWLED PAGE  (after content cleaning)
# ─────────────────────────────────────────────

class CrawledPage(BaseModel):
    """
    Output of cleaner/content_cleaner.py.
    Raw HTML has been processed into clean readable text.
    """
    url:        str
    path:       str
    title:      str = ""
    depth:      int = 0
    clean_text: str = ""                # trafilatura-cleaned text
    snippet:    str = ""                # first 300 chars, for quick display
    word_count: int = 0                 # rough signal of content richness
    error:      Optional[str] = None


# ─────────────────────────────────────────────
#  CLASSIFIED PAGE  (after classification)
# ─────────────────────────────────────────────

class ClassifiedPage(BaseModel):
    """
    Output of classifier/ stage.
    Extends CrawledPage with page_type and classification confidence.
    """
    url:                str
    path:               str
    title:              str = ""
    depth:              int = 0
    clean_text:         str = ""
    snippet:            str = ""
    word_count:         int = 0
    error:              Optional[str] = None

    # Classification fields
    page_type:          PageType = PageType.IGNORE
    type_confidence:    float = Field(
                            default=0.0,
                            ge=0.0,
                            le=1.0,
                            description="0.0–1.0, how confident the classifier is"
                        )
    classified_by:      str = "url_rule"    # "url_rule" | "content_signal" | "llm"
    #if no value is provided it will default take "url_rule"

    @classmethod

    def from_crawled(
        cls, page: CrawledPage, page_type: PageType, confidence: float, classified_by: str = "url_rule",) -> "ClassifiedPage":
        """
        Convenience constructor: promote a CrawledPage to ClassifiedPage
        after classification is done.
        """
        return cls(
            **page.model_dump(),
            page_type=page_type,
            type_confidence=confidence,
            classified_by=classified_by,
        )
    
    # this just maps filled values from CrawledPage into ClassifiedPage with additional details like page_type,type_confidence and classified_by