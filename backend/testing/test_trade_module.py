"""
test_trade_module.py
Quick test for the Trade Intelligence module.

Run from backend/testing/:  python test_trade_module.py
Run from backend/:          python testing/test_trade_module.py
"""
import asyncio
import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from modules.trade.trade_intel import TradeIntelModule
from modules.trade.trade_comtrade import get_reporter_code
from modules.base_module import ModuleInput
from modules.input_preprocessing import preprocess_module_input


async def main():
    module = TradeIntelModule()

    # Use a raw/dirty product name and leave hs_code blank —
    # preprocess_module_input will clean the name and resolve the HS code.
    inp = ModuleInput(
        product_id="ff20d415-ad9a-40ca-9e17-377ae3aa4089",
        product_name="Dehydrated Mixed Vegetables",
        category="",
        hs_code="",
        description="Around 20% of men suffer from declining performance and stamina due to work stress, busy schedules and a fast-paced lifestyle. AADAR ayurveda understands the challenges men face in today’s world and formulated a perfect blend with the help of Ayurveda and modern science to help men improve vitality and physical strength.",
        certifications=[],
        origin_country="India",
        target_country=["Europe"],
        company_name="aadar",
        business_type="Manufacturer & Exporter",
        price_positioning="Budget",
        moq="",
        buyer_type="",
    )

    # Quick sanity check — verify reporter codes resolve before running
    print("=" * 55)
    print("  Reporter code check")
    print("=" * 55)
    for country in ["India", "China", "United States", "Germany", "Vietnam"]:
        code = get_reporter_code(country)
        status = f"✅ {code}" if code else "❌ not found"
        print(f"  {country:<20} {status}")

    print("\n" + "=" * 55)
    print("  Preprocessing Input (name clean + HS code lookup)")
    print("=" * 55)
    print(f"  Before → name={inp.product_name!r}  hs_code={inp.hs_code!r}")
    inp = await preprocess_module_input(inp)
    print(f"  After  → name={inp.product_name!r}  hs_code={inp.hs_code!r}")

    print("\n" + "=" * 55)
    print("  Testing Trade Intelligence Module")
    print("=" * 55)

    result = await module.run(inp)

    print(f"\nSuccess     : {result.success}")
    print(f"Field count : {result.field_count()}/9")

    if result.error:
        print(f"Error       : {result.error}")

    print(f"\n--- Extracted Data ---")
    print(json.dumps(result.data, indent=2, default=str))

    # print(f"\n--- DB Row ---")
    # db_row = TradeIntelModule.to_db_row(result, inp.product_id, inp)
    # print(json.dumps(db_row, indent=2, default=str))


asyncio.run(main())