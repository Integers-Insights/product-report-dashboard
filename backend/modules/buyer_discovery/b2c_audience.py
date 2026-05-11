"""
modules/buyer_discovery/b2c_audience.py
-----------------------------------------
B2C Audience Discovery — generates a detailed consumer profile for any
product in a target country.

Instead of a list of buyer companies, this module answers:
  - Who is the end consumer? (age, gender, income, lifestyle, motivation)
  - Where do they buy? (online, offline, social commerce)
  - What do they care about on the label? (certs, claims, format, price)
  - Which brands are winning with this consumer? (from Sonar real-time data)
  - What market gap exists for the company?

Flow:
  Step 1a  GPT-4o (temp 0.4) → full consumer profile from training knowledge
           (all fields except leading_brands — GPT has excellent consumer data)
  Step 1b  Sonar (concurrent with 1a) → real-time leading brands in target country
  Step 2   GPT-4o-mini → structure Sonar brands into LeadingBrand list + market gap

Steps 1a and 1b run concurrently via asyncio.gather.

Returns B2CDiscoveryResult containing ConsumerProfile.
"""

import json
import asyncio

from modules.base_module import BaseModule, ModuleInput, call_openai
from modules.buyer_discovery.models import (
    ConsumerSegment,
    PurchaseChannels,
    LabelPreferences,
    LeadingBrand,
    ConsumerProfile,
    B2CDiscoveryResult,
)


# ─────────────────────────────────────────────
#  PROMPT 1 — CONSUMER PROFILE (GPT training knowledge)
#  Uses gpt-4o at temp=0.4 for creative but grounded output.
#  Does NOT ask for leading_brands — Sonar handles that.
# ─────────────────────────────────────────────

CONSUMER_PROFILE_PROMPT = """
You are a B2C consumer intelligence expert helping a company understand
who buys their product in a foreign market.

Product         : {product_name}
Category        : {category}
Company origin  : {origin_country}
Target market   : {target_country}
Certifications  : {certifications}

Generate a detailed consumer profile for this product in {target_country}.
Use your knowledge of consumer behavior, product trends, and retail dynamics
in this market. Be specific — generic answers are not useful.

Return ONLY valid JSON with this exact structure:

{{
  "consumer_segment": {{
    "age_group":           "e.g. 25-40 year old health-conscious professionals",
    "gender_skew":         "female-skewed | male-skewed | neutral",
    "income_bracket":      "e.g. upper-middle class, willing to spend $25-45 on supplements",
    "lifestyle_tags":      ["fitness-focused", "vegan", "clean label", "Ayurveda-curious"],
    "purchase_motivation": ["preventive health", "sports performance", "beauty from within"]
  }},
  "purchase_channels": {{
    "online":          ["Amazon", "iHerb", "brand D2C websites", "pharmacy e-stores"],
    "offline":         ["pharmacy chains", "health food stores", "supermarkets", "gyms"],
    "social_commerce": ["Instagram shops", "TikTok Shop", "Facebook Marketplace"]
  }},
  "label_preferences": {{
    "certifications":    ["USDA Organic", "Non-GMO", "Vegan", "Halal"],
    "key_claims":        ["clinically studied", "bioavailable", "standardized extract"],
    "preferred_formats": ["capsule", "gummy", "powder sachet", "liquid shot"],
    "price_sensitivity": "e.g. $15-25 sweet spot for daily supplements in this market"
  }},
  "market_gap": "2-3 sentences describing what gap exists that this company can fill — certifications missing from top brands, underserved formats, unmet consumer need, or positioning opportunity specific to a {origin_country}-based supplier"
}}

Rules:
- Be country-specific — US consumer behavior differs from German, Southeast Asian, Middle Eastern
- lifestyle_tags: 3-5 tags
- purchase_motivation: 2-4 motivations
- online/offline/social_commerce: 3-5 entries each (name real platforms in {target_country})
- certifications: what consumers in {target_country} actually look for
- preferred_formats: ranked by popularity in {target_country}
- market_gap must reference the product specifically and be actionable
"""


# ─────────────────────────────────────────────
#  PROMPT 2 — SONAR BRANDS QUERY
# ─────────────────────────────────────────────

BRANDS_SONAR_QUERY = """
What are the top 5-7 consumer brands selling {product_name} ({category})
in {target_country}? Include:
- Which online platforms they dominate (Amazon, iHerb, local platforms)
- Their positioning (premium organic, affordable daily wellness, sports-focused)
- Any certifications or claims they lead with
- Approximate price range per unit
Focus on brands available to consumers in {target_country} as of 2024-2025.
"""


# ─────────────────────────────────────────────
#  PROMPT 3 — STRUCTURE SONAR BRANDS OUTPUT
# ─────────────────────────────────────────────

BRANDS_EXTRACTION_PROMPT = """
Extract structured brand intelligence from the research text below.

Product      : {product_name}
Target market: {target_country}
Company from : {origin_country}

Research text:
---
{sonar_response}
---

Extract each brand mentioned and structure them.

Return ONLY valid JSON, no explanation:
{{
  "leading_brands": [
    {{
      "name":        "exact brand name",
      "positioning": "one phrase — e.g. premium organic, affordable daily wellness",
      "website":     "domain only e.g. gardenoflife.com — or null if not mentioned",
      "notes":       "one sentence — which platform they dominate, price range, certifications"
    }}
  ],
  "updated_market_gap": "optional — if Sonar reveals a specific gap a {origin_country}-based company could fill, describe it. Otherwise null."
}}

Rules:
- Max 7 brands
- Only include brands the research text explicitly mentions
- positioning must be concise (3-6 words)
- website: domain only, no https://
"""


# ─────────────────────────────────────────────
#  MODULE CLASS
# ─────────────────────────────────────────────

class B2CAudienceModule(BaseModule):
    """
    Generates a full B2C consumer profile for a product in a target market.

    Uses GPT-4o for consumer profiling (training data is excellent for this)
    and Sonar for real-time brand intelligence.

    Usage:
        result = await B2CAudienceModule().run(inp)
    """
    def module_name(self) -> str:
        return "buyer_discovery"
    # ── Step 1a: GPT consumer profile (training knowledge) ───────────────────

    async def _generate_profile(self, inp: ModuleInput) -> dict | None:
        """
        Calls GPT-4o to generate consumer segment, purchase channels,
        label preferences, and market gap from training data.
        Returns raw dict or None on failure.
        """
        prompt = CONSUMER_PROFILE_PROMPT.format(
            product_name=inp.product_name,
            category=inp.category,
            origin_country=inp.origin_country,
            target_country=inp.target_country,
            certifications=inp.cert_string() or "none specified",
        )

        system = (
            "You are a B2C consumer intelligence expert. "
            "Return only valid JSON. No markdown, no explanation."
        )
        try:
            raw = await call_openai(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user",   "content": prompt},
                ],
                max_tokens=1200,
                temperature=0.4,
                call_type="b2c_consumer_profile",
                module="b2c_audience",
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=getattr(inp, "product_id", None),
                response_format={"type": "json_object"},
            )
            if raw is None:
                raise ValueError("call_openai returned None")
            data = json.loads(raw)
            print(f"     → GPT-4o profile generated ({len(raw)} chars)")
            return data
        except Exception as e:
            print(f"  ⚠️  [b2c_audience] GPT profile generation failed: {e}")
            return None

    # ── Step 1b: Sonar brand intelligence ────────────────────────────────────

    async def _sonar_brands(self, inp: ModuleInput) -> str | None:
        """Sonar real-time search for leading brands in the target market."""
        query = BRANDS_SONAR_QUERY.format(
            product_name=inp.product_name,
            category=inp.category,
            target_country=inp.target_country,
        ).strip()
        text = await self._call_sonar_with_deflection_retry(query, "b2c_brands")
        if text:
            print(f"     → Sonar brands: {len(text)} chars")
        return text

    # ── Step 2: Structure Sonar brands ───────────────────────────────────────

    async def _extract_brands(
        self,
        sonar_text: str,
        inp: ModuleInput,
    ) -> tuple[list[dict], str | None]:
        """
        GPT-mini extracts structured brand list + optional updated market gap
        from Sonar's brand research text.
        Returns (brands_list, updated_gap_or_none).
        """
        prompt = BRANDS_EXTRACTION_PROMPT.format(
            product_name=inp.product_name,
            target_country=inp.target_country,
            origin_country=inp.origin_country,
            sonar_response=sonar_text[:3000],
        )
        data = await self._extract_structured(prompt)
        if not data:
            return [], None

        brands    = data.get("leading_brands", [])
        sonar_gap = data.get("updated_market_gap")
        print(f"     → {len(brands)} leading brands extracted from Sonar")
        return brands, sonar_gap

    # ── Assemble ConsumerProfile from raw dicts ───────────────────────────────

    @staticmethod
    def _build_profile(
        profile_data:   dict,
        brand_list:     list[dict],
        sonar_gap:      str | None,
        target_country: str,
    ) -> ConsumerProfile:
        """
        Converts raw GPT dicts into typed ConsumerProfile dataclass.
        Sonar gap overrides GPT gap only if Sonar found something more specific.
        """
        seg_raw  = profile_data.get("consumer_segment", {})
        chan_raw = profile_data.get("purchase_channels", {})
        lab_raw  = profile_data.get("label_preferences", {})

        segment = ConsumerSegment(
            age_group=           seg_raw.get("age_group"),
            gender_skew=         seg_raw.get("gender_skew"),
            income_bracket=      seg_raw.get("income_bracket"),
            lifestyle_tags=      seg_raw.get("lifestyle_tags", []),
            purchase_motivation= seg_raw.get("purchase_motivation", []),
        )

        channels = PurchaseChannels(
            online=          chan_raw.get("online", []),
            offline=         chan_raw.get("offline", []),
            social_commerce= chan_raw.get("social_commerce", []),
        )

        labels = LabelPreferences(
            certifications=    lab_raw.get("certifications", []),
            key_claims=        lab_raw.get("key_claims", []),
            preferred_formats= lab_raw.get("preferred_formats", []),
            price_sensitivity= lab_raw.get("price_sensitivity"),
        )

        brands = [
            LeadingBrand(
                name=        b.get("name", ""),
                positioning= b.get("positioning"),
                website=     b.get("website"),
                notes=       b.get("notes"),
            )
            for b in brand_list
            if b.get("name")
        ]

        # Sonar gap takes priority if it found something more specific
        market_gap = sonar_gap or profile_data.get("market_gap")

        return ConsumerProfile(
            consumer_segment=  segment,
            purchase_channels= channels,
            label_preferences= labels,
            leading_brands=    brands,
            market_gap=        market_gap,
            country=           target_country,
        )

    # ── Main entry point ─────────────────────────────────────────────────────

    async def run(self, inp: ModuleInput) -> B2CDiscoveryResult:
        """
        Generate a B2C consumer profile for inp.product_name in inp.target_country.

        Steps 1a (GPT profile) and 1b (Sonar brands) run concurrently.
        Step 2 (brand structuring) runs after Sonar returns.

        Args:
            inp : ModuleInput
        Returns:
            B2CDiscoveryResult with ConsumerProfile
        """
        print(f"\n  🛍️  [b2c_audience] {inp.product_name} → {inp.target_country}")

        # Steps 1a + 1b run concurrently
        profile_data, sonar_text = await asyncio.gather(
            self._generate_profile(inp),
            self._sonar_brands(inp),
        )

        if not profile_data:
            return B2CDiscoveryResult(
                success=False,
                product_id=inp.product_id,
                product_name=inp.product_name,
                target_country=inp.target_country,
                error="GPT consumer profile generation failed",
            )

        # Step 2 — structure brands from Sonar (skip if Sonar failed)
        brand_list: list[dict] = []
        sonar_gap:  str | None  = None

        if sonar_text:
            brand_list, sonar_gap = await self._extract_brands(sonar_text, inp)
        else:
            print("  ⚠️  [b2c_audience] Sonar brands call failed — profile will have no leading_brands")

        # Assemble typed ConsumerProfile
        profile = self._build_profile(
            profile_data=   profile_data,
            brand_list=     brand_list,
            sonar_gap=      sonar_gap,
            target_country= inp.target_country,
        )

        print(f"     → Profile complete: {len(profile.leading_brands)} brands | "
              f"gap: {'yes' if profile.market_gap else 'no'}")

        return B2CDiscoveryResult(
            success=True,
            product_id=inp.product_id,
            product_name=inp.product_name,
            target_country=inp.target_country,
            consumer_profile=profile,
        )
