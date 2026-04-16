"""
test_market_module.py
Quick test for the Market Demand Intelligence module.

Run: python test_market_module.py
"""
import asyncio
import json
import sys
sys.path.insert(0, ".")
from typing import Optional
from modules.market_demand import MarketDemandModule, ModuleInput


async def main():
    module = MarketDemandModule()

    # Sample input — replace with real product_id and data from your DB
    inp = ModuleInput(
        product_id="0f24c2b0-061d-43f0-a652-95d0e06392a4",
        product_name="activate charcoal",
        category="personal care",
        hs_code="0910.30",
        description="Activated charcoal is a fine, black, odorless, and tasteless powder processed from carbon-rich materials (like coconut shells or peat) to be highly porous. It works via adsorption, binding toxins and drugs to its surface to prevent absorption in the body, making it a primary emergency treatment for poisoning and drug overdoses",
        certifications=["GMP", "USDA Organic", "FSSAI"],
        origin_country="India",
        target_country="Global",   # will be overridden per country
        company_name="Umang Encapsulation",
        business_type="Manufacturer",
        price_positioning="Mid-range",
        moq="250 kg",
        buyer_type="B2B",
    )

    print("=" * 55)
    print("  Testing Market Demand Module")
    print("=" * 55)

    # # Test 1: Single country
    # print("\n--- Test 1: Single country (United States) ---")
    # result = await module.run(inp)

    # print(f"\nSuccess     : {result.success}")
    # print(f"Field count : {result.field_count()}/7")
    # print(f"\nExtracted data:")
    # print(json.dumps(result.data, indent=2))

    # Test 2: Full run with country discovery
    print("\n--- Test 2: Country discovery + all markets ---")
    results = await module.run_all_countries(inp, concurrency=2)

    print(f"\n{len(results)} qualified countries:")
    for r in results:
        db_row = MarketDemandModule.to_db_row(r, inp.product_id)
        print(f"\n  🌍 {r.target_country} ({r.field_count()}/8 fields)")
        print(f"     Demand growth : {r.data.get('demand_growth')}")
        print(f"     Import volume : {r.data.get('import_volume')}")
        print(f"     Buyers        : {r.data.get('matched_buyers')}")
        print(f"     Seasonality   : {r.data.get('peak_procurement')}")
        print(f"     Channel       : {r.data.get('primary_channel')}")
        print(f"     Required Cert : {r.data.get('cert_require')}")
        # print(f"     Cert Gap      : {r.data.get('cert_gap')}")
        print(f"     Analysis      : {str(r.data.get('analysis_note'))}")

asyncio.run(main())