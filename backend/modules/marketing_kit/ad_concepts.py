"""
modules/marketing_kit/ad_concepts.py
---------------------------------------
Sub-module 3 — Ad Concept Generator

Generates 6 creative B2B ad concepts per product × target country.

Each concept has:
  - market       : e.g. "US MARKET" / "GERMANY" / "SPEC-FIRST · ALL MARKETS"
  - angle        : e.g. "TRUST ANGLE" / "URGENCY ANGLE" / "SUSTAINABILITY"
  - hook         : the headline — short, punchy, in quotes
  - description  : 2-3 sentences explaining the hook's strategic logic
  - tiles        : 2-3 tags (e.g. "LinkedIn", "Cold outreach", "Hero headline")
  - border_color : UI accent color hint for the card (matches screenshot style)

Concept mix (dynamic — GPT chooses the best 6 angles for the specific product):
  GPT selects from: trust, urgency, spec-first, sustainability, science/technical,
  category challenger, FOMO, cost-efficiency, niche specialization, regulatory readiness,
  partnership/OEM, volume reliability, reformulation trigger, brand-building, etc.

At least 1 concept references the actual company name and product specifics.

DB table: product_info.ad_concepts
  product_id, target_country, concepts (jsonb — array of 6), created_at

Model: gpt-4o (temp=0.9) — highest creativity needed
"""

import json
import re
from dataclasses import dataclass, field
from typing import Optional
from input_pipeline.config import MARKETING_KIT
from modules.base_module import BaseModule


# ── Data models ──────────────────────────────────────────────────────────────

@dataclass
class AdConcept:
    market:       str          # e.g. "US MARKET"
    angle:        str          # e.g. "TRUST ANGLE"
    hook:         str          # the ad headline — punchy, in quotes in UI
    description:  str          # strategic rationale (2-3 sentences)
    tiles:        list[str]    # 2-3 tags shown in UI
    border_color: str = "blue" # UI hint: "blue" / "orange" / "green" / "purple" / "teal" / "gray"


@dataclass
class AdConceptsResult:
    success:       bool
    product_id:    str
    target_country: str
    concepts:      list[AdConcept] = field(default_factory=list)
    error:         Optional[str]   = None

    def to_db_row(self) -> dict:
        return {
            "product_id":     self.product_id,
            "target_country": self.target_country,
            "concepts": [
                {
                    "market":       c.market,
                    "angle":        c.angle,
                    "hook":         c.hook,
                    "description":  c.description,
                    "tiles":        c.tiles,
                    "border_color": c.border_color,
                }
                for c in self.concepts
            ],
        }


# ── Prompt ───────────────────────────────────────────────────────────────────

AD_CONCEPTS_PROMPT = """
You are a world-class B2B export marketing strategist. Your job is to craft 6 highly creative, \
product-specific ad concepts for an company targeting international buyers.

Exporter details:
  Company       : {company_name}
  Product       : {product_name}
  Category      : {category}
  Certifications: {certifications}
  Price tier    : {price_positioning}
  Description   : {description}
  Primary market: {target_country}

Your task:
Think deeply about this specific product and industry. What makes buyers hesitate? What do they \
actually care about? What angles would make a seasoned procurement manager stop scrolling?

Choose the 6 most powerful, industry-appropriate ad angles for THIS product. Do not follow a fixed \
template — let the product dictate the angles. Examples of angle types you might use (not exhaustive):
  Trust / proof-of-origin, Urgency / supply window, Spec-first / technical credibility,
  Sustainability / ESG compliance, Challenger / category disruption, FOMO / competitor gap,
  Cost-efficiency / ROI angle, Niche specialization, Regulatory readiness, Partnership / OEM play,
  Volume reliability / lead time, Reformulation trigger, Brand-building / memorable

Rules:
  - Every angle must feel tailor-made for {product_name} — not generic export boilerplate
  - At least 1 concept must name the company ({company_name}) specifically
  - Each hook must be punchy, ≤12 words, written as it would appear in a real LinkedIn ad
  - Description explains WHY this hook works strategically for this product (2-3 sentences max)
  - tiles: 2-3 short tags for channel + buyer type (e.g. "LinkedIn", "Cold outreach", "R&D buyers")
  - market: target geography for this concept (e.g. "{target_country}", "EU MARKETS", "ALL MARKETS")
  - angle: short label in ALL CAPS (e.g. "TRUST ANGLE", "SPEC-FIRST", "CATEGORY CHALLENGER")
  - border_color: pick the most fitting from: "blue", "orange", "green", "purple", "teal", "gray"

Return ONLY valid JSON, no explanation:
{{
  "concepts": [
    {{
      "market": "...",
      "angle": "...",
      "hook": "...",
      "description": "...",
      "tiles": ["...", "...", "..."],
      "border_color": "..."
    }}
  ]
}}
"""


# ── Module class ──────────────────────────────────────────────────────────────

class AdConceptsModule(BaseModule):
    """
    Generates 6 creative B2B ad concepts using GPT-4o.

    Usage:
        result = await AdConceptsModule().run(inp)
    """

    async def run(self, inp) -> AdConceptsResult:
        """
        Generate 6 ad concepts for one product × one target country.

        Args:
            inp : ModuleInput
        Returns:
            AdConceptsResult with 6 AdConcept objects
        """
        print(f"  🎯 [ad_concepts] {inp.product_name} → {inp.target_country}")

        prompt = AD_CONCEPTS_PROMPT.format(
            company_name=inp.company_name,
            product_name=inp.product_name,
            category=inp.category,
            certifications=", ".join(inp.certifications or []),
            price_positioning=getattr(inp, "price_positioning", "standard"),
            description=(inp.description or "")[:400],
            target_country=inp.target_country,
        )

        client = self._get_openai()
        try:
            resp = await client.chat.completions.create(
                model=MARKETING_KIT["ad_model"],
                temperature=MARKETING_KIT["ad_temp"],
                max_tokens=MARKETING_KIT["ad_max_tokens"],
                messages=[{"role": "user", "content": prompt}],
            )
            raw = resp.choices[0].message.content.strip()
            raw = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
            data = json.loads(raw)

            concepts = [
                AdConcept(
                    market=c["market"],
                    angle=c["angle"],
                    hook=c["hook"],
                    description=c["description"],
                    tiles=c.get("tiles", [])[:3],
                    border_color=c.get("border_color", "blue"),
                )
                for c in data.get("concepts", [])[:6]
            ]

            print(f"     → {len(concepts)} ad concepts generated")

            return AdConceptsResult(
                success=True,
                product_id=inp.product_id,
                target_country=inp.target_country,
                concepts=concepts,
            )

        except Exception as e:
            print(f"  ❌ [ad_concepts] GPT error: {e}")
            return AdConceptsResult(
                success=False,
                product_id=inp.product_id,
                target_country=inp.target_country,
                error=str(e),
            )