# """
# module_runner.py
# -----------------
# Runs all 6 intelligence modules in parallel via asyncio.gather.
# Tracks per-module status so Streamlit can show live progress.

# Usage:
#     runner = ModuleRunner(status_callback=my_callback)
#     results = await runner.run_all(inp)

# Status callback receives: (module_name, status, result_or_error)
#   status: "running" | "done" | "failed"
# """

# import asyncio
# import traceback
# from dataclasses import dataclass, field
# from typing import Callable, Optional, Any,List,Dict

# from modules.market_demand      import MarketDemandModule
# from modules.trade_intel        import TradeIntelModule
# from modules.buyer_discovery    import BuyerDiscoveryModule
# from modules.variants_kit.variants_formats   import VariantsFormatsModule
# from modules.competitor_discovery import CompetitorDiscoveryModule
# from modules.marketing_kit.keyword_intel  import KeywordIntelModule
# from modules.marketing_kit.email_sequence import EmailSequenceModule
# from modules.marketing_kit.ad_concepts    import AdConceptsModule


# # ─────────────────────────────────────────────
# #  MODULE STATUS
# # ─────────────────────────────────────────────

# @dataclass
# class ModuleStatus:
#     name:    str
#     status:  str = "pending"   # pending | running | done | failed
#     result:  Any = None
#     error:   Optional[str] = None
#     elapsed: Optional[float] = None   # seconds


# @dataclass
# class RunnerResult:
#     """Holds all 6 module results + marketing kit sub-results."""
#     market_demand:         Optional[Any] = None
#     trade_intel:           Optional[Any] = None
#     buyer_discovery:       Optional[Any] = None
#     variants_formats:      Optional[Any] = None
#     competitor_discovery:  Optional[Any] = None
#     keyword_intel:         Optional[Any] = None
#     email_sequence:        Optional[Any] = None
#     ad_concepts:           Optional[Any] = None
#     statuses:              dict[str, ModuleStatus] = field(default_factory=dict)

#     def all_done(self) -> bool:
#         return all(s.status in ("done", "failed")
#                    for s in self.statuses.values())

#     def summary(self) -> dict:
#         return {
#             name: {"status": s.status, "elapsed": s.elapsed, "error": s.error}
#             for name, s in self.statuses.items()
#         }


# # ─────────────────────────────────────────────
# #  MODULE RUNNER
# # ─────────────────────────────────────────────

# MODULE_NAMES = [
#     "market_demand",
#     "trade_intel",
#     "buyer_discovery",
#     "variants_formats",
#     "competitor_discovery",
#     "keyword_intel",
#     "email_sequence",
#     "ad_concepts",
# ]


# class ModuleRunner:
#     """
#     Runs all intelligence modules in parallel.
#     Calls status_callback(name, status, result_or_none) on each state change
#     so Streamlit can update its UI in real time.

#     Args:
#         status_callback : callable(name: str, status: str, data: Any)
#                           Called on "running", "done", "failed"
#         skip_keywords   : skip keyword_intel if Google Ads not configured
#     """

#     def __init__(
#         self,
#         status_callback: Optional[Callable] = None,
#         skip_keywords: bool = False,
#     ):
#         self.callback      = status_callback or (lambda *a: None)
#         self.skip_keywords = skip_keywords

#     def _update(self, result: RunnerResult, name: str,
#                 status: str, data: Any = None, error: str = None,
#                 elapsed: float = None):
#         """Update status dict and fire callback."""
#         s         = result.statuses[name]
#         s.status  = status
#         s.error   = error
#         s.elapsed = elapsed
#         if status == "done":
#             s.result = data
#         self.callback(name, status, data or error)

#     async def _run_one(
#         self, result: RunnerResult, name: str, coro
#     ):
#         """Wraps a module coroutine with timing + status updates."""
#         import time
#         self._update(result, name, "running")
#         t0 = time.monotonic()
#         try:
#             res = await coro
#             elapsed = round(time.monotonic() - t0, 1)
#             self._update(result, name, "done", data=res, elapsed=elapsed)
#             return res
#         except Exception as e:
#             elapsed = round(time.monotonic() - t0, 1)
#             err = f"{type(e).__name__}: {str(e)[:120]}"
#             self._update(result, name, "failed", error=err, elapsed=elapsed)
#             traceback.print_exc()
#             return None

#     async def run_all(self, inp) -> RunnerResult:
#         """
#         Run all modules in parallel. Returns RunnerResult with all outputs.

#         Market kit (keyword/email/ads) runs alongside the other 5.
#         keyword_intel is skipped if skip_keywords=True.
#         """
#         result = RunnerResult(
#             statuses={name: ModuleStatus(name=name) for name in MODULE_NAMES}
#         )

#         # Build coroutines
#         coros = {
#             "market_demand":        MarketDemandModule().run(inp),
#             "trade_intel":          TradeIntelModule().run(inp),
#             "buyer_discovery":      BuyerDiscoveryModule().run(inp),
#             "variants_formats":     VariantsFormatsModule().run(inp),
#             "competitor_discovery": CompetitorDiscoveryModule().run(inp),
#             # "keyword_intel"       : KeywordIntelModule().run(inp),
#             "email_sequence":       EmailSequenceModule().run(inp),
#             "ad_concepts":          AdConceptsModule().run(inp),
#         }

#         if not self.skip_keywords:
#             coros["keyword_intel"] = KeywordIntelModule().run(inp)
#         else:
#             result.statuses["keyword_intel"].status = "failed"
#             result.statuses["keyword_intel"].error  = "Skipped — Google Ads not configured"
#             self.callback("keyword_intel", "failed", "Skipped")

#         # Run all in parallel
#         tasks = [
#             self._run_one(result, name, coro)
#             for name, coro in coros.items()
#         ]
#         outputs = await asyncio.gather(*tasks, return_exceptions=False)

#         # Map outputs back to result fields
#         name_list = List(coros.keys())
#         for name, output in zip(name_list, outputs):
#             setattr(result, name, output)

#         print(f"\n{'─'*50}")
#         for name, s in result.statuses.items():
#             icon = "✅" if s.status == "done" else "❌"
#             print(f"  {icon} {name:<25} {s.elapsed or '—'}s")

#         return result

# import asyncio
# import traceback
# from dataclasses import dataclass, field
# from typing import Callable, Optional, Any,Dict

# from modules.market_demand import MarketDemandModule
# from modules.trade_intel import TradeIntelModule
# from modules.buyer_discovery import BuyerDiscoveryModule
# from modules.variants_kit.variants_formats import VariantsFormatsModule
# from modules.competitor_discovery import CompetitorDiscoveryModule
# from modules.marketing_kit.keyword_intel import KeywordIntelModule
# from modules.marketing_kit.email_sequence import EmailSequenceModule
# from modules.marketing_kit.ad_concepts import AdConceptsModule


# # ─────────────────────────────────────────────
# #  MODULE STATUS
# # ─────────────────────────────────────────────

# @dataclass
# class ModuleStatus:
#     name: str
#     status: str = "pending"
#     result: Any = None
#     error: Optional[str] = None
#     elapsed: Optional[float] = None


# @dataclass
# class RunnerResult:
#     market_demand: Optional[Any] = None
#     trade_intel: Optional[Any] = None
#     buyer_discovery: Optional[Any] = None
#     variants_formats: Optional[Any] = None
#     competitor_discovery: Optional[Any] = None
#     keyword_intel: Optional[Any] = None
#     email_sequence: Optional[Any] = None
#     ad_concepts: Optional[Any] = None
#     statuses: Dict[str, ModuleStatus] = field(default_factory=dict)

#     def all_done(self) -> bool:
#         return all(s.status in ("done", "failed") for s in self.statuses.values())

#     def summary(self) -> dict:
#         return {
#             name: {
#                 "status": s.status,
#                 "elapsed": s.elapsed,
#                 "error": s.error
#             }
#             for name, s in self.statuses.items()
#         }


# # ─────────────────────────────────────────────
# #  MODULE RUNNER
# # ─────────────────────────────────────────────

# MODULE_NAMES = [
#     "market_demand",
#     "trade_intel",
#     "buyer_discovery",
#     "variants_formats",
#     "competitor_discovery",
#     "keyword_intel",
#     "email_sequence",
#     "ad_concepts",
# ]


# class ModuleRunner:

#     def __init__(
#         self,
#         status_callback: Optional[Callable] = None,
#         skip_keywords: bool = False,
#     ):
#         self.callback = status_callback or (lambda *a: None)
#         self.skip_keywords = skip_keywords

#     def _update(self, result, name, status, data=None, error=None, elapsed=None):
#         s = result.statuses[name]
#         s.status = status
#         s.error = error
#         s.elapsed = elapsed

#         if status == "done":
#             s.result = data

#         self.callback(name, status, data or error)

#     async def _run_one(self, result, name, coro):
#         import time

#         self._update(result, name, "running")
#         t0 = time.monotonic()

#         try:
#             res = await coro
#             elapsed = round(time.monotonic() - t0, 1)

#             self._update(result, name, "done", data=res, elapsed=elapsed)
#             return res

#         except Exception as e:
#             elapsed = round(time.monotonic() - t0, 1)
#             err = f"{type(e).__name__}: {str(e)[:120]}"

#             self._update(result, name, "failed", error=err, elapsed=elapsed)

#             print(f"\n❌ ERROR in {name}")
#             traceback.print_exc()

#             return None

#     async def run_all(self, inp) -> RunnerResult:

#         result = RunnerResult(
#             statuses={name: ModuleStatus(name=name) for name in MODULE_NAMES}
#         )

#         # =========================================================
#         # BUILD COROUTINES
#         # =========================================================
#         coros = {
#             "market_demand": MarketDemandModule().run_all_countries(inp),
#             "trade_intel": TradeIntelModule().run(inp),
#             "buyer_discovery": BuyerDiscoveryModule().run(inp),
#             "variants_formats": VariantsFormatsModule().run(inp),
#             "competitor_discovery": CompetitorDiscoveryModule().run(inp),
#             "email_sequence": EmailSequenceModule().run(inp),
#             "ad_concepts": AdConceptsModule().run(inp),
#         }

#         if not self.skip_keywords:
#             coros["keyword_intel"] = KeywordIntelModule().run(inp)
#         else:
#             result.statuses["keyword_intel"].status = "failed"
#             result.statuses["keyword_intel"].error = "Skipped — Google Ads not configured"
#             self.callback("keyword_intel", "failed", "Skipped")

#         # =========================================================
#         # RUN IN PARALLEL (SAFE)
#         # =========================================================
#         tasks = [
#             self._run_one(result, name, coro)
#             for name, coro in coros.items()
#         ]

#         outputs = await asyncio.gather(*tasks, return_exceptions=True)

#         # =========================================================
#         # SAFE MAPPING (CRITICAL FIX)
#         # =========================================================
#         name_list = list(coros.keys())

#         for name, output in zip(name_list, outputs):
#             if isinstance(output, Exception):
#                 print(f"❌ Engine crash at mapping: {name} → {str(output)}")
#                 setattr(result, name, None)
#             else:
#                 setattr(result, name, output)

#         # =========================================================
#         # FINAL SUMMARY PRINT
#         # =========================================================
#         print(f"\n{'─'*50}")
#         for name, s in result.statuses.items():
#             icon = "✅" if s.status == "done" else "❌"
#             print(f"  {icon} {name:<25} {s.elapsed or '—'}s")

#         return result





import asyncio
import traceback
from dataclasses import dataclass, field
from typing import Callable, Optional, Any, Dict

# Core modules
from modules.market_demand import MarketDemandModule
from modules.trade_intel import TradeIntelModule
from modules.buyer_discovery.router    import BuyerDiscoveryRouter
from modules.variants_kit.variants_formats import VariantsFormatsModule
from modules.competitor_discovery import CompetitorDiscoveryModule
from modules.input_preprocessing import preprocess_module_input
# Marketing kit
# from modules.marketing_kit.keyword_intel import KeywordIntelModule
from modules.marketing_kit.keyword_intel_v2 import KeywordIntelModule
from modules.marketing_kit.email_sequence import EmailSequenceModule
from modules.marketing_kit.ad_concepts import AdConceptsModule

# New modules
from modules.price_analysis import PriceAnalysisModule
from modules.scoring_engine import ScoringEngine


# ─────────────────────────────────────────────
#  MODULE STATUS
# ─────────────────────────────────────────────

@dataclass
class ModuleStatus:
    name: str
    status: str = "pending"
    result: Any = None
    error: Optional[str] = None
    elapsed: Optional[float] = None


@dataclass
class RunnerResult:
    market_demand: Optional[Any] = None
    trade_intel: Optional[Any] = None
    buyer_discovery: Optional[Any] = None
    variants_formats: Optional[Any] = None
    competitor_discovery: Optional[Any] = None
    keyword_intel: Optional[Any] = None
    email_sequence: Optional[Any] = None
    ad_concepts: Optional[Any] = None
    price_analysis: Optional[Any] = None
    scoring: Optional[Any] = None
    statuses: Dict[str, ModuleStatus] = field(default_factory=dict)

    def all_done(self) -> bool:
        return all(s.status in ("done", "failed") for s in self.statuses.values())

    def summary(self) -> dict:
        return {
            name: {
                "status": s.status,
                "elapsed": s.elapsed,
                "error": s.error
            }
            for name, s in self.statuses.items()
        }


# ─────────────────────────────────────────────
#  MODULE RUNNER
# ─────────────────────────────────────────────

MODULE_NAMES = [
    "market_demand",
    "trade_intel",
    "buyer_discovery",
    "variants_formats",
    "competitor_discovery",
    "keyword_intel",
    "email_sequence",
    "ad_concepts",
    "price_analysis",
    "scoring",
]


class ModuleRunner:

    def __init__(
        self,
        status_callback: Optional[Callable] = None,
        skip_keywords: bool = False,
    ):
        self.callback = status_callback or (lambda *a: None)
        self.skip_keywords = skip_keywords

    def _update(self, result, name, status, data=None, error=None, elapsed=None):
        s = result.statuses[name]
        s.status = status
        s.error = error
        s.elapsed = elapsed

        if status == "done":
            s.result = data

        self.callback(name, status, data or error)

    async def _run_one(self, result, name, coro):
        import time

        self._update(result, name, "running")
        t0 = time.monotonic()

        try:
            res = await coro
            elapsed = round(time.monotonic() - t0, 1)

            self._update(result, name, "done", data=res, elapsed=elapsed)
            return res

        except Exception as e:
            elapsed = round(time.monotonic() - t0, 1)
            err = f"{type(e).__name__}: {str(e)[:120]}"

            self._update(result, name, "failed", error=err, elapsed=elapsed)

            print(f"\n❌ ERROR in {name}")
            traceback.print_exc()

            return None

    async def run_all(self, inp) -> RunnerResult:
        inp = await preprocess_module_input(inp)
        result = RunnerResult(
            statuses={name: ModuleStatus(name=name) for name in MODULE_NAMES}
        )

        # =========================================================
        # STAGE 1: PARALLEL MODULES (SAFE)
        # =========================================================
        coros = {
            "market_demand": MarketDemandModule().run_all_countries(inp),
            "trade_intel": TradeIntelModule().run(inp),
            "buyer_discovery": BuyerDiscoveryRouter().run(inp),
            "variants_formats": VariantsFormatsModule().run(inp),
            "competitor_discovery": CompetitorDiscoveryModule().run(inp),
            "email_sequence": EmailSequenceModule().run(inp),
            "ad_concepts": AdConceptsModule().run(inp),
        }

        tasks = [
            self._run_one(result, name, coro)
            for name, coro in coros.items()
        ]

        outputs = await asyncio.gather(*tasks, return_exceptions=True)

        # Safe mapping
        for name, output in zip(coros.keys(), outputs):
            if isinstance(output, Exception):
                setattr(result, name, None)
            else:
                setattr(result, name, output)

        # =========================================================
        # STAGE 2: SEQUENTIAL MODULES (DEPENDENCIES)
        # =========================================================

        # Keyword intel (optional)
        if not self.skip_keywords:
            kw = await self._run_one(
                result, "keyword_intel", KeywordIntelModule().run(inp)
            )
            result.keyword_intel = kw
        else:
            result.statuses["keyword_intel"].status = "failed"
            result.statuses["keyword_intel"].error = "Skipped — Google Ads not configured"
            self.callback("keyword_intel", "failed", "Skipped")

        # Price analysis (depends on variants)
        pa = await self._run_one(
            result,
            "price_analysis",
            PriceAnalysisModule().run(inp, result.variants_formats)
        )
        result.price_analysis = pa

        # Scoring (final step)
        sc = await self._run_one(
            result,
            "scoring",
            ScoringEngine().score(inp, result)
        )
        result.scoring = sc

        # =========================================================
        # FINAL SUMMARY
        # =========================================================
        print(f"\n{'─'*50}")
        for name, s in result.statuses.items():
            icon = "✅" if s.status == "done" else "❌"
            print(f"  {icon} {name:<25} {s.elapsed or '—'}s")

        return result
