"""
test_buyers.py
Quick test for the Buyer Discovery module (B2B, B2C, or Both).

Run from backend/testing/:  python test_buyers.py
Run from backend/:          python testing/test_buyers.py

Set TEST_MODE to "B2B", "B2C", or "Both" to control which path runs.
"""
import asyncio
import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from modules.buyer_discovery.router import BuyerDiscoveryRouter
from modules.base_module import ModuleInput

# ── Change this to "B2B", "B2C", or "Both" ──────────────────────────────────
TEST_MODE = "B2B"
# ─────────────────────────────────────────────────────────────────────────────


async def main():
    router = BuyerDiscoveryRouter()

    inp = ModuleInput(
        product_id="bb10883c-6b32-42e9-9fae-673cb7d7138c",
        product_name="Organic Turmeric Powder",
        category="Spices & Herbs",
        hs_code="091030",
        description="High-curcumin turmeric powder sourced from single-origin farms in India. "
                    "Available in food-grade and supplement-grade variants. USDA Organic and "
                    "EU Organic certified. Ideal for nutraceutical brands, food manufacturers, "
                    "and private label supplement companies.",
        certifications=["USDA Organic", "EU Organic", "FSSAI"],
        origin_country="India",
        target_country="United States",
        company_name="Spice Origins",
        business_type="Manufacturer & Exporter",
        price_positioning="Premium",
        moq="500 kg",
        buyer_type=TEST_MODE,
    )

    print("=" * 60)
    print(f"  Buyer Discovery Test — mode: {TEST_MODE}")
    print("=" * 60)
    print(f"  Product : {inp.product_name}")
    print(f"  Origin  : {inp.origin_country}")
    print(f"  Target  : {inp.target_country}")
    print("=" * 60)

    result = await router.run(inp)

    print(f"\nSuccess    : {result.success}")
    print(f"buyer_type : {result.buyer_type}")

    if result.error:
        print(f"Error      : {result.error}")

    # ── B2B output ────────────────────────────────────────────────────────────
    if result.b2b:
        b2b = result.b2b
        print(f"\n--- B2B Result ({b2b.count()} buyers) ---")
        if b2b.success:
            for i, buyer in enumerate(b2b.buyers, 1):
                print(f"\n  {i}. {buyer.name}")
                print(f"     Country    : {buyer.country}")
                print(f"     Website    : {buyer.website or '—'}")
                print(f"     Buyer type : {buyer.buyer_type or '—'}")
                print(f"     Notes      : {buyer.notes or '—'}")
        else:
            print(f"  Failed: {b2b.error}")

    # ── B2C output ────────────────────────────────────────────────────────────
    if result.b2c:
        b2c = result.b2c
        print(f"\n--- B2C Result ---")
        if b2c.success and b2c.consumer_profile:
            cp = b2c.consumer_profile
            seg = cp.consumer_segment
            print(f"\n  Consumer Segment:")
            print(f"    Age group    : {seg.age_group}")
            print(f"    Gender skew  : {seg.gender_skew}")
            print(f"    Income       : {seg.income_bracket}")
            print(f"    Lifestyle    : {', '.join(seg.lifestyle_tags)}")
            print(f"    Motivations  : {', '.join(seg.purchase_motivation)}")

            ch = cp.purchase_channels
            print(f"\n  Purchase Channels:")
            print(f"    Online       : {', '.join(ch.online)}")
            print(f"    Offline      : {', '.join(ch.offline)}")
            print(f"    Social       : {', '.join(ch.social_commerce)}")

            lp = cp.label_preferences
            print(f"\n  Label Preferences:")
            print(f"    Certs        : {', '.join(lp.certifications)}")
            print(f"    Claims       : {', '.join(lp.key_claims)}")
            print(f"    Formats      : {', '.join(lp.preferred_formats)}")
            print(f"    Price sense  : {lp.price_sensitivity}")

            if cp.leading_brands:
                print(f"\n  Leading Brands ({len(cp.leading_brands)}):")
                for b in cp.leading_brands:
                    print(f"    · {b.name:<30} {b.positioning or ''}")

            if cp.market_gap:
                print(f"\n  Market Gap : {cp.market_gap}")

            if cp.analysis_note:
                print(f"\n  Analyst Note:\n  {cp.analysis_note}")
        else:
            print(f"  Failed: {b2c.error}")

    # ── Raw JSON dump ─────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("  Raw JSON output")
    print("=" * 60)

    output = {"buyer_type": result.buyer_type, "success": result.success}
    if result.b2b:
        output["b2b"] = result.b2b.to_db_row()
    if result.b2c:
        output["b2c"] = result.b2c.to_db_row()

    print(json.dumps(output, indent=2, default=str))


asyncio.run(main())
