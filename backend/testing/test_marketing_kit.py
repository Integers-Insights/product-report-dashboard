"""
test_marketing_kit.py
----------------------
Test runner for all 3 Marketing Kit sub-modules.

Run all:       python test_marketing_kit.py
Run one:       python test_marketing_kit.py keywords
               python test_marketing_kit.py emails
               python test_marketing_kit.py ads

NOTE: Set GOOGLE_ADS config in config.py before running keywords test.
      Email + ads tests only need OPENAI_API_KEY in .env.
"""

import asyncio
import json
import sys
sys.path.insert(0, ".")

from modules.base_module import ModuleInput
# from modules.marketing_kit.keyword_intel import KeywordIntelModule
from modules.marketing_kit.keyword_intel_v2 import KeywordIntelModule
from modules.marketing_kit.email_sequence import EmailSequenceModule
from modules.marketing_kit.ad_concepts import AdConceptsModule

# ── Shared test input ────────────────────────────────────────────────────────

INP = ModuleInput(
    product_id="7b91d4e2-8c3f-4a7b-b1d2-5f8c91a6e321",
    product_name="Turmeric",
    category="Spices & Botanicals",
    hs_code="091030",
    description=(
        "Premium organic turmeric powder with guaranteed 95% curcuminoids, "
        "sourced from Erode, India. GMP facility, USDA Organic and FSSAI certified. "
        "Used in nutraceuticals, food manufacturing, and Ayurvedic formulations."
    ),
    certifications=["USDA Organic", "GMP", "FSSAI", "Kosher"],
    origin_country="India",
    target_country="France",
    company_name="GreenLeaf Exports",
    business_type="Manufacturer & Exporter",
    price_positioning="Premium",
    moq="500 kg",
    buyer_type="B2B",
)


# ── Individual test functions ────────────────────────────────────────────────

async def test_keywords():
    print("\n" + "=" * 55)
    print("  Testing Keyword Intelligence Module")
    print("=" * 55)

    module = KeywordIntelModule()
    result = await module.run(INP)

    print(f"\nSuccess      : {result.success}")
    if not result.success:
        print(f"Error        : {result.error}")
        return

    print(f"Buyer intent : {len(result.high_volume_buyer_intent)} keywords")
    print(f"Gap keywords : {len(result.low_competition_gaps)} keywords")
    print(f"Multilingual : {len(result.multilingual)} keywords ({INP.target_country})")

    print("\n--- High-Volume Buyer Intent ---")
    for k in result.high_volume_buyer_intent:
        gap_tag = f" [Gap: {k.gap}]" if k.gap else ""
        print(f"  {k.keyword:<45} {str(k.search_volume or '?'):>8}/mo  "
              f"{(k.competition or '?'):>7}  CI:{k.competition_index or '?'}{gap_tag}")

    print("\n--- Low-Competition Gaps ---")
    for k in result.low_competition_gaps:
        print(f"  {k.keyword:<45} {str(k.search_volume or '?'):>8}/mo  "
              f"{(k.competition or '?'):>7}  CI:{k.competition_index or '?'}  [Gap: {k.gap}]")

    print("\n--- Multilingual ---")
    for k in result.multilingual:
        gap_tag = f"  [Gap: {k.gap}]" if k.gap else ""
        print(f"  [{k.language}] {k.keyword}{gap_tag}")

    # print("\n--- DB Row ---")
    # print(json.dumps(result.to_db_row(), indent=2, default=str))


async def test_emails():
    print("\n" + "=" * 55)
    print("  Testing Email Sequence Module")
    print("=" * 55)

    module = EmailSequenceModule()
    result = await module.run(INP)

    print(f"\nSuccess      : {result.success}")
    if not result.success:
        print(f"Error        : {result.error}")
        return

    print(f"Sequence note: {result.sequence_note}")
    print(f"Emails       : {len(result.emails)}")

    for email in result.emails:
        print(f"\n{'─'*55}")
        print(f"  EMAIL {result.emails.index(email)+1} · SEND DAY {email.send_day} · {email.type_label}")
        print(f"  Goal   : {email.goal}")
        print(f"  Subject: {email.subject}")
        print(f"  Body   :\n{email.body}")
        print(f"  Tiles  : {' | '.join(email.tiles)}")

    # print("\n--- DB Row ---")
    # print(json.dumps(result.to_db_row(), indent=2, default=str))


async def test_ads():
    print("\n" + "=" * 55)
    print("  Testing Ad Concepts Module")
    print("=" * 55)

    module = AdConceptsModule()
    result = await module.run(INP)

    print(f"\nSuccess   : {result.success}")
    if not result.success:
        print(f"Error     : {result.error}")
        return

    print(f"Concepts  : {len(result.concepts)}")

    for i, c in enumerate(result.concepts, 1):
        print(f"\n{'─'*55}")
        print(f"  [{i}] {c.market} · {c.angle}  [{c.border_color}]")
        print(f"  Hook : \"{c.hook}\"")
        print(f"  Why  : {c.description}")
        print(f"  Tiles: {' | '.join(c.tiles)}")

    # print("\n--- DB Row ---")
    # print(json.dumps(result.to_db_row(), indent=2, default=str))


# ── Entry point ──────────────────────────────────────────────────────────────

async def main():
    arg = sys.argv[1].lower() if len(sys.argv) > 1 else "all"
    print(arg)
    if arg in ("keywords", "kw"):
        await test_keywords()
    elif arg in ("emails", "email"):
        await test_emails()
    elif arg in ("ads", "ad"):
        await test_ads()
    else:
        # Run emails + ads by default (no Ads API needed)
        # Add keywords only if explicitly requested (needs GOOGLE_ADS config)
        await test_emails()
        await test_ads()


asyncio.run(main())