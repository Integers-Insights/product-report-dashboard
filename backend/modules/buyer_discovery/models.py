"""
modules/buyer_discovery/models.py
-----------------------------------
Shared data models for B2B and B2C buyer discovery.

B2B models  → BuyerEntry, BuyerDiscoveryResult
B2C models  → ConsumerSegment, PurchaseChannels, LabelPreferences,
               LeadingBrand, ConsumerProfile, B2CDiscoveryResult
Unified     → CombinedBuyerResult  (router always returns this)
"""

from dataclasses import dataclass, field
from typing import Optional


# ─────────────────────────────────────────────
#  B2B MODELS
# ─────────────────────────────────────────────

@dataclass
class BuyerEntry:
    """One B2B buyer company."""
    name:            str
    country:         str
    website:         Optional[str] = None
    buyer_type:      Optional[str] = None   # supplement_brand | food_manufacturer | etc.
    notes:           Optional[str] = None   # sourcing volume, frequency, product use
    relevance_score: Optional[int] = None   # 1-10 from GPT ranking

    def to_dict(self) -> dict:
        return {
            "name":            self.name,
            "country":         self.country,
            "website":         self.website,
            "buyer_type":      self.buyer_type,
            "notes":           self.notes,
            "relevance_score": self.relevance_score,
        }


@dataclass
class BuyerDiscoveryResult:
    """Result from the B2B buyer discovery module."""
    success:        bool
    product_id:     str
    product_name:   str
    target_country: str
    buyers:         list[BuyerEntry] = field(default_factory=list)
    sonar_raw:      Optional[str]    = None
    error:          Optional[str]    = None

    def count(self) -> int:
        return len(self.buyers)

    def is_fallback(self) -> bool:
        return len(self.buyers) < 6

    def to_db_row(self) -> dict:
        return {
            "product_id":     self.product_id,
            "product_name":   self.product_name,
            "target_country": self.target_country,
            "buyers":         [b.to_dict() for b in self.buyers],
            "is_fallback":    self.is_fallback(),
        }


# ─────────────────────────────────────────────
#  B2C MODELS
# ─────────────────────────────────────────────

@dataclass
class ConsumerSegment:
    """Who is the end consumer."""
    age_group:           Optional[str]      = None   # "25-35 year old wellness enthusiasts"
    gender_skew:         Optional[str]      = None   # "female-skewed" | "neutral" | "male-skewed"
    income_bracket:      Optional[str]      = None   # "premium health store buyer"
    lifestyle_tags:      list[str]          = field(default_factory=list)  # ["vegan", "fitness-focused"]
    purchase_motivation: list[str]          = field(default_factory=list)  # ["preventive health"]

    def to_dict(self) -> dict:
        return {
            "age_group":           self.age_group,
            "gender_skew":         self.gender_skew,
            "income_bracket":      self.income_bracket,
            "lifestyle_tags":      self.lifestyle_tags,
            "purchase_motivation": self.purchase_motivation,
        }


@dataclass
class PurchaseChannels:
    """Where the consumer buys."""
    online:          list[str] = field(default_factory=list)  # ["Amazon", "iHerb"]
    offline:         list[str] = field(default_factory=list)  # ["pharmacy chains"]
    social_commerce: list[str] = field(default_factory=list)  # ["TikTok Shop"]

    def to_dict(self) -> dict:
        return {
            "online":          self.online,
            "offline":         self.offline,
            "social_commerce": self.social_commerce,
        }


@dataclass
class LabelPreferences:
    """What the consumer cares about on the label."""
    certifications:    list[str]      = field(default_factory=list)  # ["USDA Organic"]
    key_claims:        list[str]      = field(default_factory=list)  # ["clinically studied"]
    preferred_formats: list[str]      = field(default_factory=list)  # ["capsule", "gummy"]
    price_sensitivity: Optional[str]  = None  # "$15-25 sweet spot in the US"

    def to_dict(self) -> dict:
        return {
            "certifications":    self.certifications,
            "key_claims":        self.key_claims,
            "preferred_formats": self.preferred_formats,
            "price_sensitivity": self.price_sensitivity,
        }


@dataclass
class LeadingBrand:
    """One dominant B2C brand in the target market."""
    name:        str
    positioning: Optional[str] = None   # "premium organic, USDA certified"
    website:     Optional[str] = None
    notes:       Optional[str] = None   # "dominates iHerb in this category"

    def to_dict(self) -> dict:
        return {
            "name":        self.name,
            "positioning": self.positioning,
            "website":     self.website,
            "notes":       self.notes,
        }


@dataclass
class ConsumerProfile:
    """Full B2C consumer intelligence profile."""
    consumer_segment:  ConsumerSegment
    purchase_channels: PurchaseChannels
    label_preferences: LabelPreferences
    leading_brands:    list[LeadingBrand] = field(default_factory=list)
    market_gap:        Optional[str]      = None   # opportunity for the exporter
    analysis_note:     Optional[str]      = None   # GPT analyst summary
    country:           str                = ""

    def to_dict(self) -> dict:
        return {
            "consumer_segment":  self.consumer_segment.to_dict(),
            "purchase_channels": self.purchase_channels.to_dict(),
            "label_preferences": self.label_preferences.to_dict(),
            "leading_brands":    [b.to_dict() for b in self.leading_brands],
            "market_gap":        self.market_gap,
            "analysis_note":     self.analysis_note,
            "country":           self.country,
        }


@dataclass
class B2CDiscoveryResult:
    """Result from the B2C audience discovery module."""
    success:          bool
    product_id:       str
    product_name:     str
    target_country:   str
    consumer_profile: Optional[ConsumerProfile] = None
    error:            Optional[str]             = None

    def to_db_row(self) -> dict:
        return {
            "product_id":       self.product_id,
            "product_name":     self.product_name,
            "target_country":   self.target_country,
            "consumer_profile": self.consumer_profile.to_dict() if self.consumer_profile else None,
        }


# ─────────────────────────────────────────────
#  COMBINED RESULT  (router always returns this)
# ─────────────────────────────────────────────

@dataclass
class CombinedBuyerResult:
    """
    Unified return type from BuyerDiscoveryRouter.

    buyer_type  "B2B"  → b2b populated, b2c is None
    buyer_type  "B2C"  → b2c populated, b2b is None
    buyer_type  "Both" → both populated
    """
    success:    bool
    buyer_type: str                              # "B2B" | "B2C" | "Both"
    b2b:        Optional[BuyerDiscoveryResult]  = None
    b2c:        Optional[B2CDiscoveryResult]    = None
    error:      Optional[str]                   = None
