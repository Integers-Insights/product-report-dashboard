"""
modules/buyer_discovery/router.py
-----------------------------------
BuyerDiscoveryRouter — dispatches to B2B, B2C, or both modules
based on inp.buyer_type.

  buyer_type = "B2B"  → runs B2BBuyersModule only  (Apollo org search)
  buyer_type = "B2C"  → runs B2CAudienceModule only (GPT + Sonar consumer profile)
  buyer_type = "Both" → runs both concurrently via asyncio.gather

Always returns CombinedBuyerResult so module_runner and downstream
consumers have a single predictable type to handle.
"""

import asyncio

from modules.base_module import BaseModule, ModuleInput
from modules.buyer_discovery.models import (
    BuyerDiscoveryResult,
    B2CDiscoveryResult,
    CombinedBuyerResult,
)
from modules.buyer_discovery.b2b_buyers  import B2BBuyersModule
from modules.buyer_discovery.b2c_audience import B2CAudienceModule


class BuyerDiscoveryRouter(BaseModule):
    """
    Single entry point for all buyer discovery.

    Reads inp.buyer_type and routes to the correct sub-module(s).
    Both sub-modules run concurrently when buyer_type == "Both".

    Usage:
        result = await BuyerDiscoveryRouter().run(inp)
        # result.b2b  → BuyerDiscoveryResult | None
        # result.b2c  → B2CDiscoveryResult   | None
    """

    async def run(self, inp: ModuleInput) -> CombinedBuyerResult:
        buyer_type = (inp.buyer_type or "B2B").strip().upper()

        print(f"\n  🔀 [buyer_discovery] routing → buyer_type={buyer_type!r}")

        if buyer_type == "B2B":
            b2b = await B2BBuyersModule().run(inp)
            return CombinedBuyerResult(
                success=b2b.success,
                buyer_type="B2B",
                b2b=b2b,
                b2c=None,
                error=b2b.error if not b2b.success else None,
            )

        elif buyer_type == "B2C":
            b2c = await B2CAudienceModule().run(inp)
            return CombinedBuyerResult(
                success=b2c.success,
                buyer_type="B2C",
                b2b=None,
                b2c=b2c,
                error=b2c.error if not b2c.success else None,
            )

        elif buyer_type == "BOTH":
            b2b_result, b2c_result = await asyncio.gather(
                B2BBuyersModule().run(inp),
                B2CAudienceModule().run(inp),
            )
            success = b2b_result.success or b2c_result.success
            errors  = []
            if not b2b_result.success:
                errors.append(f"B2B: {b2b_result.error}")
            if not b2c_result.success:
                errors.append(f"B2C: {b2c_result.error}")

            return CombinedBuyerResult(
                success=    success,
                buyer_type= "Both",
                b2b=        b2b_result,
                b2c=        b2c_result,
                error=      " | ".join(errors) if errors else None,
            )

        else:
            # Unknown buyer_type — default to B2B and warn
            print(f"  ⚠️  [buyer_discovery] Unknown buyer_type={buyer_type!r} — defaulting to B2B")
            b2b = await B2BBuyersModule().run(inp)
            return CombinedBuyerResult(
                success=    b2b.success,
                buyer_type= "B2B",
                b2b=        b2b,
                b2c=        None,
                error=      b2b.error if not b2b.success else None,
            )
