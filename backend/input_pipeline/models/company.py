"""
models/company.py
-----------------
Pydantic model for company-level data extracted from about/contact pages.
This enriches the product_info.company_preference table —
pre-filling or updating fields the user set during signup.

Note: This does NOT replace user-entered preferences.
It enriches fields that are missing or empty in the DB.
User preferences always take priority over scraped data.
"""

from typing import Optional,List
from pydantic import BaseModel, Field


# ─────────────────────────────────────────────
#  COMPANY DATA
# ─────────────────────────────────────────────

class CompanyData(BaseModel):
    """
    Structured company data extracted from about/contact pages.

    All fields are Optional — we take whatever we can find.
    The extractor will never hallucinate; if it's not on the page,
    the field stays None.
    """

    # ── Identity ────────────────────────────────
    company_name:           Optional[str]   = None
    website_url:            Optional[str]   = None
    founded_year:           Optional[int]   = None
    tagline:                Optional[str]   = None   # e.g. "Certified Organic Exporters Since 2005"

    # ── Location ────────────────────────────────
    country:                Optional[str]   = None
    city:                   Optional[str]   = None
    address:                Optional[str]   = None

    # ── Business type ───────────────────────────
    business_type:          Optional[str]   = None   # Manufacturer / Trader / Exporter / Agent
    industries_served:      List[str]       = Field(default_factory=list)

    # ── Export profile ───────────────────────────
    export_markets:         List[str]       = Field(default_factory=list)   # countries mentioned
    export_experience:      Optional[str]   = None   # e.g. "15 years of export experience"

    # ── Certifications ───────────────────────────
    certifications:         List[str]       = Field(default_factory=list)
    regulatory_approvals:   List[str]       = Field(default_factory=list)   # FDA, FSSAI, etc.

    # ── Capacity ─────────────────────────────────
    manufacturing_capacity: Optional[str]   = None   # e.g. "500 MT per month"
    annual_turnover:        Optional[str]   = None   # e.g. "$2M–$5M"
    employee_count:         Optional[str]   = None   # e.g. "50–200"

    # ── Contact ──────────────────────────────────
    contact_email:          Optional[str]   = None
    contact_phone:          Optional[str]   = None
    linkedin_url:           Optional[str]   = None

    # ── Source tracking ──────────────────────────
    extracted_from_urls:    List[str]       = Field(default_factory=list)
    extraction_notes:       str             = ""

    def to_preference_patch(self) -> dict:
        """
        Returns only the fields relevant to company_preference table
        as a dict, excluding None values.
        Used to PATCH the DB — only update fields that were actually found.
        """
        preference_fields = {
            "company_name":             self.company_name,
            "country":                  self.country,
            "business_type":            self.business_type,
            "certifications":           self.certifications or None,
            "export_markets":           self.export_markets or None,
            "manufacturing_capacity":   self.manufacturing_capacity,
            "annual_turnover":          self.annual_turnover,
        }
        # Only return fields that actually have values
        return {k: v for k, v in preference_fields.items() if v is not None}