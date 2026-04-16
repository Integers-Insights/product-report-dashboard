"""
modules/buyer_discovery/__init__.py
--------------------------------------
Public API for the buyer_discovery package.

Import from here — not from sub-modules directly:

    from modules.buyer_discovery import BuyerDiscoveryRouter
    from modules.buyer_discovery import CombinedBuyerResult, BuyerEntry, ConsumerProfile
"""

from modules.buyer_discovery.models import (
    # B2B
    BuyerEntry,
    BuyerDiscoveryResult,
    # B2C
    ConsumerSegment,
    PurchaseChannels,
    LabelPreferences,
    LeadingBrand,
    ConsumerProfile,
    B2CDiscoveryResult,
    # Unified
    CombinedBuyerResult,
)
from modules.buyer_discovery.router import BuyerDiscoveryRouter

__all__ = [
    # B2B models
    "BuyerEntry",
    "BuyerDiscoveryResult",
    # B2C models
    "ConsumerSegment",
    "PurchaseChannels",
    "LabelPreferences",
    "LeadingBrand",
    "ConsumerProfile",
    "B2CDiscoveryResult",
    # Unified
    "CombinedBuyerResult",
    # Router (main entry point)
    "BuyerDiscoveryRouter",
]
