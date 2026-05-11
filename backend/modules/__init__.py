"""
modules/
--------
INTRADE24 Intelligence Modules — Phase 2

Each module takes product + company data and runs
real-time research via Perplexity Sonar.

Modules:
    1. MarketDemandModule    — demand, buyers, channels per country
    2. KeywordIntelModule    — keywords + multilingual terms (coming)
    3. BuyerDiscoveryModule  — verified buyer lists (coming)
    4. TradeIntelModule      — HS codes, trade volumes (coming)
    5. CompetitorIntelModule — competitor analysis (coming)
    6. MarketingEngineModule — GTM content generation (coming)
"""

from modules.market_demand import MarketDemandModule, ModuleInput, ModuleResult