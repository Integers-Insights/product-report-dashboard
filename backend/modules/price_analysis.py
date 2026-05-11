"""
modules/price_analysis.py
--------------------------
Module — Price Analysis Intelligence

Uses variants already discovered by variants_formats module as input.
Enriches them with margin estimates, market positioning, and cert premiums.

Flow (3 Sonar + 3 GPT calls):
  1. Sonar call 1 → top metrics: market_range, est_gross_margin, cert_premium_overall
     GPT-4o-mini  → extracts 3 structured stat cards

  2. Sonar call 2 → variant pricing table: margin_est + position per variant
     GPT-4o-mini  → extracts rows (variant_name, market_price, margin_est, position)
     Variants list comes from VariantsFormatsResult — no re-discovery needed

  3. Sonar call 3 → cert premiums: per certification → premium % over non-certified avg
     GPT-4o-mini  → extracts list of {cert_name, premium_pct, context}

Output:
  top_metrics     : market_range, gross_margin, cert_premium_overall
  variant_table   : list of rows (variant_name, market_price, margin_est, position, tag)
  cert_premiums   : list of {cert_name, premium_pct, vs_label, context}

DB table: product_info.price_analysis
  product_id, top_metrics (jsonb), variant_table (jsonb), cert_premiums (jsonb)
"""

import asyncio
import json

from dataclasses import dataclass, field
from typing import Optional
from modules.base_module import BaseModule


# ─────────────────────────────────────────────
#  DATA MODELS
# ─────────────────────────────────────────────

@dataclass
class TopMetrics:
    market_range:          Optional[str]   # e.g. "$8–$16/kg"
    market_range_label:    Optional[str]   # e.g. "Organic certified tier"
    gross_margin:          Optional[str]   # e.g. "30–45%"
    gross_margin_label:    Optional[str]   # e.g. "Strong — cert justified"
    cert_premium_overall:  Optional[str]   # e.g. "+40%"
    cert_premium_label:    Optional[str]   # e.g. "Over non-organic avg"


@dataclass
class VariantPriceRow:
    variant_name:   str
    tag:            Optional[str]   # from variants_formats: "your_product"|"gap"|"in_market"|"emerging"
    market_price:   Optional[str]   # e.g. "$8–$16/kg"
    margin_est:     Optional[str]   # e.g. "30–45%"
    position:       Optional[str]   # e.g. "Mid range" | "Uncontested" | "Opportunity" | "Easy upsell" | "Race to bottom"
    position_flag:  Optional[str]   # e.g. "star" | "gap" | "warning" — UI hint


@dataclass
class CertPremium:
    cert_name:    str
    premium_pct:  Optional[str]   # e.g. "+40%"
    vs_label:     Optional[str]   # e.g. "vs uncertified avg"
    context:      Optional[str]   # e.g. "GMP certified"


@dataclass
class PriceAnalysisResult:
    success:       bool
    product_id:    str
    top_metrics:   Optional[TopMetrics]         = None
    variant_table: list[VariantPriceRow]        = field(default_factory=list)
    cert_premiums: list[CertPremium]            = field(default_factory=list)
    error:         Optional[str]                = None

    def to_db_row(self) -> dict:
        def _tm(t: TopMetrics) -> dict:
            return {
                "market_range":         t.market_range,
                "market_range_label":   t.market_range_label,
                "gross_margin":         t.gross_margin,
                "gross_margin_label":   t.gross_margin_label,
                "cert_premium_overall": t.cert_premium_overall,
                "cert_premium_label":   t.cert_premium_label,
            } if t else {}

        return {
            "product_id":    self.product_id,
            "top_metrics":   _tm(self.top_metrics),
            "variant_table": [
                {
                    "variant_name":  v.variant_name,
                    "tag":           v.tag,
                    "market_price":  v.market_price,
                    "margin_est":    v.margin_est,
                    "position":      v.position,
                    "position_flag": v.position_flag,
                }
                for v in self.variant_table
            ],
            "cert_premiums": [
                {
                    "cert_name":   c.cert_name,
                    "premium_pct": c.premium_pct,
                    "vs_label":    c.vs_label,
                    "context":     c.context,
                }
                for c in self.cert_premiums
            ],
        }


# ─────────────────────────────────────────────
#  PROMPT 1 — TOP METRICS SONAR QUERY
# ─────────────────────────────────────────────

# TOP_METRICS_QUERY = """
# What is the current B2B FOB price range, typical gross margin %, and certification
# premium for {product_name} ({category}) exported from {origin_country} to {target_country}?
# Certifications held: {certifications}.
# """
TOP_METRICS_QUERY = """
What is the current B2B FOB price range, typical gross margin %, and certification
premium for {product_name}.
"""

TOP_METRICS_EXTRACTION = """
Extract the 3 pricing metrics from the research below.

Product: {product_name}
Origin: {origin_country}
Target: {target_country}

Research:
---
{sonar_response}
---

Return ONLY valid JSON:
{{
  "market_range":         "string or null — e.g. '$8–$16/kg'",
  "market_range_label":  "string or null — e.g. 'Organic certified tier'",
  "gross_margin":         "string or null — e.g. '30–45%'",
  "gross_margin_label":  "string or null — e.g. 'Strong — cert justified'",
  "cert_premium_overall": "string or null — e.g. '+40%'",
  "cert_premium_label":   "string or null — e.g. 'Over non-organic avg'"
}}
"""


# ─────────────────────────────────────────────
#  PROMPT 2 — VARIANT TABLE SONAR QUERY
# ─────────────────────────────────────────────

VARIANT_TABLE_QUERY = """
What is the estimated gross margin for each of these
{product_name} variants: {variant_list_inline}
"""

VARIANT_TABLE_EXTRACTION = """
Extract gross margin and market position for each variant from the research below.

Variants (use exact names): {variant_names}

Research:
---
{sonar_response}
---

Return ONLY valid JSON:
{{
  "variants": [
    {{
      "variant_name":  "exact name from list above",
      "margin_est":    "string or null — e.g. '30–45%'",
      "position":      "Mid range | Uncontested | Opportunity | Easy upsell | Race to bottom | Premium — or null",
      "position_flag": "star | gap | neutral | upsell | warning | premium — or null"
    }}
  ]
}}

position_flag: star=Mid range, gap=Uncontested, neutral=Opportunity,
upsell=Easy upsell, warning=Race to bottom, premium=Premium.
Include ALL variants even if fields are null. variant_name must match exactly.
"""


# ─────────────────────────────────────────────
#  VARIANT TABLE — GPT-ONLY ESTIMATION
#
#  No Sonar call — GPT estimates margin from known manufacturing cost
#  structure in origin_country + market price from variants module.
#  Margin need not be exact — directionally accurate is enough.
# ─────────────────────────────────────────────

VARIANT_TABLE_GPT_PROMPT = """
You are a B2B export pricing analyst. Estimate gross margin % and market position
for each product variant below.

Product: {product_name}
Exporter country: {origin_country} (use your knowledge of typical manufacturing,
labour, raw material, certification, and logistics costs for {origin_country} exporters)
Target market: {target_country}
Price positioning: {price_positioning}

Variants with their market prices:
{variants_json}

For each variant:
1. Estimate gross margin % — based on the market price vs typical {origin_country}
   production cost for that variant type. Be specific (e.g. "32–40%"), not vague.
2. Assign market position — choose one:
   - "Mid range"      : competitive pricing, moderate margin, established market
   - "Uncontested"    : gap in market, few competitors, strong entry opportunity
   - "Opportunity"    : active market but room to differentiate
   - "Easy upsell"    : natural add-on to existing buyer relationships
   - "Race to bottom" : commoditized, margin-squeezed, avoid or benchmark only
   - "Premium"        : top-tier pricing, high margin, cert or spec dependent

Return ONLY valid JSON:
{{
  "variants": [
    {{
      "variant_name":  "exact name from input",
      "margin_est":    "e.g. '32–40%'",
      "position":      "one of the 6 labels above",
      "position_flag": "star | gap | neutral | upsell | warning | premium"
    }}
  ]
}}

position_flag: star=Mid range, gap=Uncontested, neutral=Opportunity,
upsell=Easy upsell, warning=Race to bottom, premium=Premium.
Include ALL variants. Never return null for margin_est — always estimate.
"""


# ─────────────────────────────────────────────
#  PROMPT 3 — CERT PREMIUMS SONAR QUERY
# ─────────────────────────────────────────────

CERT_PREMIUM_QUERY = """
What % price premium do {certifications} certifications command for {product_name}
in the {target_country} B2B market compared to non-certified commodity grade?
"""

CERT_PREMIUM_EXTRACTION = """
Extract certification premium data from the research below.

Certifications to extract: {certifications}

Research:
---
{sonar_response}
---

Return ONLY valid JSON:
{{
  "cert_premiums": [
    {{
      "cert_name":   "certification name",
      "premium_pct": "string or null — e.g. '+40%'",
      "vs_label":    "string or null — e.g. 'vs uncertified avg'",
      "context":     "string or null — one sentence why buyers pay this"
    }}
  ]
}}

Include all certifications. Set fields to null if not found — never guess.
"""


# ─────────────────────────────────────────────
#  MODULE CLASS
# ─────────────────────────────────────────────

class PriceAnalysisModule(BaseModule):
    """
    Generates pricing intelligence by combining variants_formats output
    with fresh Sonar data on margins, positioning, and cert premiums.

    Usage:
        from modules.variants_formats import VariantsFormatsResult
        result = await PriceAnalysisModule().run(inp, variants_result)
    """
    def module_name(self) -> str:
        return "price_analysis" 

    # ── Shared helpers — thin wrappers over inherited BaseModule methods ─────

    async def _sonar(self, query: str) -> str | None:
        return await self._call_sonar_with_deflection_retry(query, "price_analysis")

    async def _extract(self, prompt: str) -> dict:
        return await self._extract_structured(prompt) or {}

    # ── Step 1: Top metrics ──────────────────────────────────────────────────

    async def _get_top_metrics(self, inp) -> Optional[TopMetrics]:
        query = TOP_METRICS_QUERY.format(
            product_name=    inp.product_name,
            category=        inp.category,
            origin_country=  inp.origin_country,
            target_country=  inp.target_country,
            certifications=  ", ".join(inp.certifications or []),
        ).strip()

        sonar_text = await self._call_sonar_with_deflection_retry(query)
        if not sonar_text:
            return None

        prompt = TOP_METRICS_EXTRACTION.format(
            product_name=   inp.product_name,
            origin_country= inp.origin_country,
            target_country= inp.target_country,
            sonar_response= sonar_text[:2500],
        )
        data = await self._extract(prompt)
        if not data:
            return None

        print(f"     → Top metrics: market_range={data.get('market_range')} "
              f"margin={data.get('gross_margin')} "
              f"cert_premium={data.get('cert_premium_overall')}")

        return TopMetrics(
            market_range=         data.get("market_range"),
            market_range_label=   data.get("market_range_label"),
            gross_margin=         data.get("gross_margin"),
            gross_margin_label=   data.get("gross_margin_label"),
            cert_premium_overall= data.get("cert_premium_overall"),
            cert_premium_label=   data.get("cert_premium_label"),
        )

    # ── Step 2: Variant pricing table ────────────────────────────────────────

    async def _get_variant_table(self, inp, variants: list) -> list[VariantPriceRow]:
        """
        Estimates margin + position for each variant using GPT only.
        Price is taken from variants_formats — not fetched here.
        Sonar call commented out — GPT estimation is sufficient for margin %.
        """
        if not variants:
            return []

        # # ── Sonar call (commented out — GPT estimation used instead) ──────────
        # variant_list_inline = ", ".join(v.variant_name for v in variants)
        # query = VARIANT_TABLE_QUERY.format(
        #     product_name=       inp.product_name,
        #     origin_country=     inp.origin_country,
        #     target_country=     inp.target_country,
        #     variant_list_inline=variant_list_inline,
        # ).strip()
        # sonar_text = await self._sonar(query)
        # prompt = VARIANT_TABLE_EXTRACTION.format(
        #     variant_names= json.dumps([v.variant_name for v in variants]),
        #     sonar_response=sonar_text[:2500],
        # )

        # ── GPT-only estimation ───────────────────────────────────────────────
        variants_json = json.dumps([
            {"variant_name": v.variant_name, "market_price": v.price_range or "unknown"}
            for v in variants
        ], indent=2)

        prompt = VARIANT_TABLE_GPT_PROMPT.format(
            product_name=     inp.product_name,
            origin_country=   inp.origin_country,
            target_country=   inp.target_country,
            price_positioning=getattr(inp, "price_positioning", "Standard"),
            variants_json=    variants_json,
        )
        data = await self._extract_structured(prompt) or {}

        extracted_map = {
            row["variant_name"]: row
            for row in data.get("variants", [])
        }

        rows = []
        for v in variants:
            ex = extracted_map.get(v.variant_name, {})
            rows.append(VariantPriceRow(
                variant_name=  v.variant_name,
                tag=           v.tag,
                market_price=  v.price_range,
                margin_est=    ex.get("margin_est"),
                position=      ex.get("position"),
                position_flag= ex.get("position_flag"),
            ))

        populated = sum(1 for r in rows if r.margin_est)
        print(f"     → Variant table: {populated}/{len(rows)} rows with margin estimate")
        return rows

    # ── Step 3: Cert premiums ────────────────────────────────────────────────

    async def _get_cert_premiums(self, inp) -> list[CertPremium]:
        if not inp.certifications:
            return []

        query = CERT_PREMIUM_QUERY.format(
            product_name=   inp.product_name,
            category=       inp.category,
            origin_country= inp.origin_country,
            target_country= inp.target_country,
            certifications= ", ".join(inp.certifications),
        ).strip()

        sonar_text = await self._call_sonar_with_deflection_retry(query)
        if not sonar_text:
            return []

        prompt = CERT_PREMIUM_EXTRACTION.format(
            certifications= ", ".join(inp.certifications),
            sonar_response= sonar_text[:2500],
        )
        data = await self._extract(prompt)

        premiums = [
            CertPremium(
                cert_name=   c.get("cert_name", ""),
                premium_pct= c.get("premium_pct"),
                vs_label=    c.get("vs_label"),
                context=     c.get("context"),
            )
            for c in data.get("cert_premiums", [])
            if c.get("cert_name")
        ]
        print(f"     → Cert premiums: {len(premiums)} certs enriched")
        return premiums

    # ── Main entry point ─────────────────────────────────────────────────────

    async def run(self, inp, variants_result) -> PriceAnalysisResult:
        """
        Run full price analysis.

        Args:
            inp             : ModuleInput
            variants_result : VariantsFormatsResult from variants_formats module
                              Pass None to run with empty variant table.
        Returns:
            PriceAnalysisResult
        """
        print(f"\n  💰 [price_analysis] {inp.product_name} → {inp.target_country}")

        # Extract variants list from variants_formats result
        variants = []
        if variants_result and variants_result.success:
            variants = variants_result.variants
            print(f"     → Using {len(variants)} variants from variants_formats")
        else:
            print(f"  ⚠️  [price_analysis] No variants_formats result — variant table will be empty")

        # Run all 3 Sonar calls in parallel
        top_metrics, variant_rows, cert_premiums = await asyncio.gather(
            self._get_top_metrics(inp),
            self._get_variant_table(inp, variants),
            self._get_cert_premiums(inp),
        )

        return PriceAnalysisResult(
            success=       True,
            product_id=    inp.product_id,
            top_metrics=   top_metrics,
            variant_table= variant_rows,
            cert_premiums= cert_premiums,
        )