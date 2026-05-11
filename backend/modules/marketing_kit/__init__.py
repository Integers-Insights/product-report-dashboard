"""
modules/marketing_kit/
-----------------------
Module 6 — Marketing Kit

Three sub-modules:
    keyword_intel.py   → Google Ads API keyword research (3 buckets)
    email_sequence.py  → GPT-4o 3-step email sequence writer
    ad_concepts.py     → GPT-4o ad concept generator (6 concepts)

Entry point:
    from modules.marketing_kit import MarketingKitRunner
    results = await MarketingKitRunner(inp).run_all()
"""

from modules.marketing_kit.keyword_intel_v2 import KeywordIntelModule
from modules.marketing_kit.email_sequence import EmailSequenceModule
from modules.marketing_kit.ad_concepts import AdConceptsModule

__all__ = ["KeywordIntelModule", "EmailSequenceModule", "AdConceptsModule"]