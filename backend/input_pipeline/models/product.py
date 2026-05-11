"""
models/product.py
-----------------
Pydantic model for a structured product extracted from a product page.
This maps directly to the product_info.product_master DB table.

Confidence score + tier are included here because they travel
with the product through the pipeline and are saved to DB.
"""

from typing import Optional
from pydantic import BaseModel, Field
from .page import ConfidenceTier
from typing import Optional, Dict, List


# ─────────────────────────────────────────────
#  MISSING FIELDS DETAIL
# ─────────────────────────────────────────────

class MissingFieldDetail(BaseModel):
    """
    Tracks exactly which fields are missing and their score penalty.
    Used to render the 'Review & Update' prompt in the UI.
    """
    field:       str
    penalty:     int        # how many points this missing field costs
    suggestion:  str = ""   # optional hint for the user


# ─────────────────────────────────────────────
#  PRODUCT DATA
# ─────────────────────────────────────────────

class ProductData(BaseModel):
    """
    Structured product data extracted by extractor/product_extractor.py.

    Fields marked Optional are ones the LLM may not find on the page —
    their absence directly affects the confidence score.

    Required fields (LLM must always attempt these):
        product_name, description, source_url

    High-value optional fields (missing = significant penalty):
        category, price, packaging, certifications, moq

    Low-value optional fields (missing = minor penalty):
        hs_code, ingredients, images, specifications
    """

    # ── Core (always expected) ──────────────────
    product_name:       Optional[str]   = None
    description:        Optional[str]   = None
    source_url:         str

    # ── High value ──────────────────────────────
    category:           Optional[str]   = None
    subcategory:        Optional[str]   = None
    price:              Optional[str]   = None      # raw string e.g. "$8.50/kg FOB Mumbai"
    packaging:          Optional[str]   = None      # e.g. "500g pouches, 25kg bulk bags"
    certifications:     List[str]       = Field(default_factory=list)
    moq:                Optional[str]   = None      # e.g. "500 kg"

    # ── Medium value ────────────────────────────
    hs_code:            Optional[str]   = None
    ingredients:        Optional[str]   = None
    specifications:     Optional[Dict]  = None      # key-value tech specs if present
    variants:           List[str]       = Field(default_factory=list)

    # ── Low value / enrichment ──────────────────
    images:             List[str]       = Field(default_factory=list)   # image URLs
    page_title:         str             = ""
    monthly_capacity:   Optional[str]   = None

    # ── Confidence (set by scorer, not extractor) ──
    confidence_score:   int             = Field(
                            default=0,
                            ge=0,
                            le=100,
                            description="0-100 overall extraction confidence"
                        )
    confidence_tier:    ConfidenceTier  = ConfidenceTier.LOW
    missing_fields:     List[MissingFieldDetail] = Field(default_factory=list)
    extraction_notes:   str             = ""        # LLM self-notes on extraction quality

    def get_display_name(self) -> str:
        """Returns product_name, falling back to page_title or source_url path."""
        if self.product_name:
            return self.product_name
        if self.page_title:
            return self.page_title
        return self.source_url

    def is_ready_for_analysis(self) -> bool:
        """
        True if the product has enough data to run the intelligence engine.
        Minimum bar: name + description + category.
        """
        return bool(
            self.product_name
            and self.description
            and self.category
            and self.confidence_score >= 50
        )