"""
test_preprocessing.py
Tests for input_preprocessing — product name cleaning and HS code detection.

Run from backend/:          python testing/test_preprocessing.py
Run from backend/testing/:  python test_preprocessing.py

Tweak TEST_CASES below to test different products.
"""

import asyncio
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from modules.input_preprocessing import clean_product_name, find_hs_code, preprocess_module_input
from modules.base_module import ModuleInput


# ─────────────────────────────────────────────
#  TEST CASES
#  Add / edit entries here to test different products.
#  Leave hs_code empty ("") to test auto-detection.
#  Provide hs_code to skip detection and only test name cleaning.
# ─────────────────────────────────────────────

TEST_CASES = [
    {
        "raw_name":    "AADAR Ayurveda Pure Himalayan Shilajit - Finest Resin (15 g)",
        "company":     "AADAR",
        "category":    "nutraceuticals",
        "hs_code":     "",          # leave empty → auto-detect
        "expected_hs": "130290",    # what you expect GPT to return (for comparison)
    },
    {
        "raw_name":    "Organic Turmeric Powder 500g - Export Grade",
        "company":     "",
        "category":    "spices",
        "hs_code":     "",
        "expected_hs": "091030",
    },
    # {
    #     "raw_name":    "Encapsulated Charcoal Dissolving Beads - 30 capsules",
    #     "company":     "",
    #     "category":    "cosmetics",
    #     "hs_code":     "",
    #     "expected_hs": "",          # unsure — leave blank
    # },
    # {
    #     "raw_name":    "Castor Oil Cold Pressed 1L (Ricinus Communis)",
    #     "company":     "",
    #     "category":    "vegetable oils",
    #     "hs_code":     "150790",    # known code — only tests name cleaning
    #     "expected_hs": "150790",
    # },
    # {
    #     "raw_name":    "Ayurveda Performance Capsule",
    #     "company":     "aadar",
    #     "category":    "herbal supplements",
    #     "hs_code":     "",
    #     "expected_hs": "300490",
    # },
]


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _hs_match(actual: str, expected: str) -> str:
    if not expected:
        return "—  (no expectation set)"
    if actual == expected:
        return f"✅  matches expected {expected}"
    if actual[:4] == expected[:4]:
        return f"⚠️  chapter match but different subheading (got {actual}, expected {expected})"
    return f"❌  mismatch (got {actual}, expected {expected})"


# ─────────────────────────────────────────────
#  INDIVIDUAL FUNCTION TESTS
# ─────────────────────────────────────────────

async def test_name_cleaning():
    print("\n" + "=" * 60)
    print("  TEST 1 — Product Name Cleaning")
    print("=" * 60)

    for case in TEST_CASES:
        raw  = case["raw_name"]
        comp = case["company"]
        cleaned = await clean_product_name(raw, comp)
        changed = "changed" if cleaned != raw else "unchanged"
        print(f"\n  Raw     : {raw}")
        print(f"  Cleaned : {cleaned}  [{changed}]")


async def test_hs_detection():
    print("\n" + "=" * 60)
    print("  TEST 2 — HS Code Detection (GPT)")
    print("=" * 60)

    for case in TEST_CASES:
        name     = case["raw_name"]
        category = case["category"]
        expected = case["expected_hs"]

        result = await find_hs_code(name, category)

        print(f"\n  Product  : {name}")
        print(f"  Category : {category}")
        print(f"  HS code  : {result or '(none returned)'}")
        print(f"  Check    : {_hs_match(result, expected)}")


# ─────────────────────────────────────────────
#  FULL PIPELINE TEST — preprocess_module_input
# ─────────────────────────────────────────────

async def test_full_pipeline():
    print("\n" + "=" * 60)
    print("  TEST 3 — Full preprocess_module_input()")
    print("=" * 60)

    for case in TEST_CASES:
        inp = ModuleInput(
            product_id="test-00000000-0000-0000-0000-000000000001",
            product_name=case["raw_name"],
            category=case["category"],
            hs_code=case["hs_code"],
            description="",
            certifications=[],
            origin_country="India",
            target_country=["United States"],
            company_name=case["company"],
            business_type="Manufacturer & Exporter",
            price_positioning="Standard",
            moq="",
            buyer_type="B2B",
        )

        print(f"\n  ── Input ──")
        print(f"  raw name : {inp.product_name}")
        print(f"  hs_code  : {inp.hs_code or '(empty — will auto-detect)'}")

        await preprocess_module_input(inp)

        print(f"  ── Output ──")
        print(f"  name     : {inp.product_name}")
        print(f"  hs_code  : {inp.hs_code or '(not found)'}")
        print(f"  check    : {_hs_match(inp.hs_code, case['expected_hs'])}")


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

async def main():
    print("\n" + "=" * 60)
    print("  Input Preprocessing Test")
    print("=" * 60)
    print(f"  Running {len(TEST_CASES)} test cases across 3 tests")

    await test_name_cleaning()
    await test_hs_detection()
    # await test_full_pipeline()

    print("\n" + "=" * 60)
    print("  Done")
    print("=" * 60)


asyncio.run(main())
