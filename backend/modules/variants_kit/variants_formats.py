"""
modules/variants_formats.py
-----------------------------
Module — Variants & Formats Intelligence

Discovers trending product variants/formats from Sonar (real market data),
then structures, tags, scores, and annotates them.

Flow (v2 — Sonar-first, 5 LLM calls total):
  1. Sonar       → ONE call: discovers 6 trending variants AND returns all 6
                   field values per variant in a single research response
  2. GPT-4o-mini → extracts structured 6×6 fields from Sonar response
  3. Fuzzy       → matches best variant to inp.product_name → "your_product"
  4. GPT-4o-mini → tags remaining 5 + scores all 6 (one batch call)
  5. GPT-4o      → analysis_note for all 6 (one batch call)

Why Sonar-first over GPT-first:
  - Sonar knows what buyers are ACTUALLY searching for right now
  - Variants with no real market data simply won't appear in Sonar response
  - Natural self-filtering — no hallucinated non-trending variants
  - 5 calls vs 14 in v1, ~3-4s wall clock vs ~10-12s

DB table: product_info.variants_formats
  One row per product. variants stored as jsonb array of up to 6 objects.
"""

import asyncio
import json
import re
from dataclasses import dataclass, field
from difflib import SequenceMatcher
from typing import Optional
from modules.variants_kit.variants_prompts import (
    ANALYSIS_NOTE_PROMPT, TAG_AND_SCORE_PROMPT, BULK_EXTRACTION_PROMPT,
    SONAR_VARIANT_DISCOVERY_QUERY, VARIANT_NAMES_EXTRACTION_PROMPT,
    SONAR_MARKET_DATA_QUERY, SONAR_MARKET_DATA_RETRY_QUERY,
    SONAR_DEFLECTION_PHRASES, GPT_FALLBACK_PROMPT,
    GPT_VARIANT_NAMES_PROMPT,
)
from modules.base_module import BaseModule, call_openai


# ─────────────────────────────────────────────
#  DATA MODELS
# ─────────────────────────────────────────────

@dataclass
class VariantData:
    variant_name:      str
    tag:               str            # "your_product" | "gap" | "in_market" | "emerging"
    opportunity_score: Optional[int]  # 1–10
    key_spec:          Optional[str]
    price_range:       Optional[str]
    moq:               Optional[str]
    buyer_demand:      Optional[str]  # "High" | "Medium" | "Emerging" | "Low"
    matched_buyers:    Optional[str]
    lead_time:         Optional[str]
    analysis_note:     Optional[str]


@dataclass
class VariantsFormatsResult:
    success:    bool
    product_id: str
    variants:   list[VariantData] = field(default_factory=list)
    error:      Optional[str]     = None

    def field_count(self) -> int:
        """Count variants with ≥4 of 7 data fields populated."""
        return sum(
            1 for v in self.variants
            if sum(1 for f in [v.key_spec, v.price_range, v.moq,
                               v.buyer_demand, v.matched_buyers, v.lead_time,
                               v.analysis_note] if f) >= 4
        )

    def to_db_row(self) -> dict:
        return {
            "product_id": self.product_id,
            "variants": [
                {
                    "variant_name":      v.variant_name,
                    "tag":               v.tag,
                    "opportunity_score": v.opportunity_score,
                    "key_spec":          v.key_spec,
                    "price_range":       v.price_range,
                    "moq":               v.moq,
                    "buyer_demand":      v.buyer_demand,
                    "matched_buyers":    v.matched_buyers,
                    "lead_time":         v.lead_time,
                    "analysis_note":     v.analysis_note,
                }
                for v in self.variants
            ],
        }


# ─────────────────────────────────────────────
#  FUZZY MATCH HELPER
# ─────────────────────────────────────────────

def _fuzzy_match_score(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def _find_your_product_idx(variant_names: list[str], product_name: str) -> int:
    scores = [_fuzzy_match_score(name, product_name) for name in variant_names]
    best   = scores.index(max(scores))
    return best if scores[best] >= 0.2 else 0


# ─────────────────────────────────────────────
#  MODULE CLASS
# ─────────────────────────────────────────────

class VariantsFormatsModule(BaseModule):
    """
    Discovers, researches, and scores product variants for B2B export intelligence.
    v2: Sonar-first single discovery call — 5 LLM calls total.

    Usage:
        result = await VariantsFormatsModule().run(inp)
    """
    def module_name(self) -> str:
        return "variants_formats"
    # ── Step 1a: Sonar — discover variant names ──────────────────────────────

    async def _sonar_discover_variants(self, inp) -> str | None:
        """Short Sonar call — finds what variants exist, nothing else."""
        query = SONAR_VARIANT_DISCOVERY_QUERY.format(
            product_name=inp.product_name,
            category=inp.category,
            origin_country=inp.origin_country,
            target_country=getattr(inp, "target_country", "global B2B markets"),
        ).strip()
        text = await self._call_sonar(query)
        # print(f"     → the sonar result for variants name {text}")
        if text:
            print(f"     → Sonar call 1 (discovery): {len(text)} chars")
        return text

    # ── Step 1b: GPT — extract clean name list ───────────────────────────────

    async def _extract_variant_names(self, sonar_text: str, inp) -> list[str]:
        names=[]
        """GPT pulls just the variant names from Sonar call 1 response."""
        prompt = VARIANT_NAMES_EXTRACTION_PROMPT.format(
            product_name=inp.product_name,
            sonar_response=sonar_text[:2000],
        )
        data  = await self._extract_structured(prompt)
        names = [n for n in (data or {}).get("variant_names", []) if isinstance(n, str) and n.strip()]
        print(f"     → {len(names)} variant names extracted: {', '.join(names)}")
        return names

    # ── Step 1c: GPT — generate variant names when Sonar returns < 3 ────────

    async def _gpt_generate_variant_names(self, existing: list[str], inp) -> list[str]:
        """
        GPT fallback for variant name generation.
        Runs when Sonar discovery returns 0 or fewer than 3 names.
        Merges with any names already found so there are no duplicates.
        """
        target = getattr(inp, "target_country", "global B2B markets")
        if isinstance(target, list):
            target = ", ".join(target)

        prompt = GPT_VARIANT_NAMES_PROMPT.format(
            product_name=inp.product_name,
            category=inp.category,
            origin_country=inp.origin_country,
            target_country=target,
            existing_names=", ".join(existing) if existing else "none",
        )
        data  = await self._extract_structured(prompt)
        names = [n for n in (data or {}).get("variant_names", []) if isinstance(n, str) and n.strip()]

        # Merge: existing first, then GPT additions (deduplicated)
        existing_lower = {n.lower() for n in existing}
        merged = list(existing) + [n for n in names if n.lower() not in existing_lower]
        print(f"     → GPT generated {len(names)} variant names → total {len(merged)}: {', '.join(merged)}")
        return merged[:6]

    # ── Step 2a: Sonar — market data for known variants ──────────────────────

    @staticmethod
    def _sonar_deflected(text: str) -> bool:
        """Returns True if Sonar gave up instead of returning real data."""
        lower = text.lower()
        return sum(1 for phrase in SONAR_DEFLECTION_PHRASES if phrase in lower) >= 2

    async def _sonar_get_market_data(self, variant_names: list[str], inp) -> str | None:
        """
        Sonar call 2 — gets pricing/demand/spec data for each variant.
        Detects Sonar deflection and retries once with a simpler query.
        """
        target_country = getattr(inp, "target_country", "global B2B markets")
        variant_list   = "\n".join(f"- {n}" for n in variant_names)

        query = SONAR_MARKET_DATA_QUERY.format(
            product_name=inp.product_name,
            origin_country=inp.origin_country,
            target_country=target_country,
            variant_list=variant_list,
        ).strip()

        text = await self._call_sonar_with_deflection_retry(query,"variants")
        if text:
            print(f"     → Sonar: {len(text)} chars")
        return text

        # if self._sonar_deflected(text):
        #     print(f"  ⚠️  [variants] Sonar deflected on market data — retrying...")
        #     retry_query = SONAR_MARKET_DATA_RETRY_QUERY.format(
        #         product_name=inp.product_name,
        #         origin_country=inp.origin_country,
        #         target_country=target_country,
        #         variant_list_inline=", ".join(variant_names),
        #     ).strip()
        #     text = await self._call_sonar(retry_query)
        #     if text:
        #         print(f"     → Sonar call 2 retry: {len(text)} chars")
        # else:
        #     print(f"     → Sonar call 2 (market data): {len(text)} chars")

        # return text

    # ── Step 2b: GPT — extract structured fields ─────────────────────────────

    async def _gpt_fill_missing_fields(self, extracted: list[dict], inp) -> list[dict]:
        """
        GPT fallback for null fields — uses training data at temp=0.0.
        Runs ONE batch call covering all variants at once.
        matched_buyers is always kept null (requires real-time data).
        Always runs — Sonar data is sparse enough that GPT fill is needed.
        """
        FILLABLE = ["key_spec", "price_range", "moq", "buyer_demand", "lead_time"]

        null_count = sum(
            sum(1 for f in FILLABLE if not v.get(f))
            for v in extracted
        )
        if null_count == 0:
            return extracted

        target = getattr(inp, "target_country", "global B2B markets")
        if isinstance(target, list):
            target = ", ".join(target)

        print(f"     → GPT fallback: filling {null_count} null fields across {len(extracted)} variants")

        prompt = GPT_FALLBACK_PROMPT.format(
            product_name=inp.product_name,
            category=inp.category,
            origin_country=inp.origin_country,
            target_country=target,
            variants_json=json.dumps(
                [{k: v.get(k) for k in ["variant_name", *FILLABLE, "matched_buyers"]}
                 for v in extracted],
                indent=2,
            ),
        )

        try:
            raw = await call_openai(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1200,
                temperature=0.0,
                call_type="variants_gpt_fill",
                module="variants_formats",
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=getattr(inp, "product_id", None),
                response_format={"type": "json_object"},
            )
            filled   = json.loads(raw).get("variants", []) if raw else []
            fill_map = {v["variant_name"]: v for v in filled}

            merged = []
            for v in extracted:
                gpt_v  = fill_map.get(v["variant_name"], {})
                result = dict(v)
                for f in FILLABLE:
                    if not result.get(f) and gpt_v.get(f):
                        result[f] = gpt_v[f]
                result["matched_buyers"] = v.get("matched_buyers")
                merged.append(result)

            for v in merged:
                n = sum(1 for f in [*FILLABLE, "matched_buyers"] if v.get(f))
                print(f"       · {v['variant_name'][:48]:<48}  {n}/6 fields (after GPT fill)")

            return merged

        except Exception as e:
            print(f"  ⚠️  [variants] GPT fallback failed: {e}")
            return extracted

    async def _extract_all_variants(self, sonar_text: str, inp) -> list[dict]:
        """GPT-4o-mini structures Sonar call 2 response into 6×6 fields."""
        prompt = BULK_EXTRACTION_PROMPT.format(
            category=inp.category,
            origin_country=inp.origin_country,
            sonar_response=sonar_text[:3500],
        )
        data     = await self._extract_structured(prompt)
        variants = (data or {}).get("variants", [])[:6]
        print(f"     → {len(variants)} variants structured")
        for v in variants:
            n = sum(1 for k, val in v.items() if k != "variant_name" and val)
            print(f"       · {v['variant_name'][:48]:<48}  {n}/6 fields")
        return variants

    # ── Step 3+4: Tag + score (one batch call) ───────────────────────────────

    async def _tag_and_score(
        self, extracted: list[dict], your_product_idx: int, inp
    ) -> list[dict]:
        prompt = TAG_AND_SCORE_PROMPT.format(
            product_name=inp.product_name,
            certifications=", ".join(inp.certifications or []),
            target_markets=getattr(inp, "target_country", "global"),
            variants_json=json.dumps(
                [{"index": i, **v} for i, v in enumerate(extracted)], indent=2
            ),
            your_product_idx=your_product_idx,
        )
        try:
            raw = await call_openai(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.0,
                call_type="variants_tag_score",
                module="variants_formats",
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=getattr(inp, "product_id", None),
            )
            if raw is None:
                raise ValueError("call_openai returned None")
            raw  = raw.strip()
            raw  = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
            data = json.loads(raw)

            tag_map = {t["variant_name"]: t for t in data.get("tagged", [])}
            # Lock the fuzzy-matched variant as your_product regardless of GPT
            yp_name = extracted[your_product_idx]["variant_name"]
            if yp_name in tag_map:
                tag_map[yp_name]["tag"] = "your_product"

            return [
                tag_map.get(v["variant_name"], {"tag": "in_market", "opportunity_score": 5})
                for v in extracted
            ]
        except Exception as e:
            print(f"  ⚠️  [variants] Tag/score error: {e}")
            return [
                {
                    "tag": "your_product" if i == your_product_idx else "in_market",
                    "opportunity_score": 8 if i == your_product_idx else 5,
                }
                for i in range(len(extracted))
            ]

    # ── Step 5: Analysis notes (one batch call) ──────────────────────────────

    async def _generate_analysis_notes(
        self, extracted: list[dict], tag_data: list[dict], inp
    ) -> dict[str, str]:
        combined = [
            {"variant_name": v["variant_name"],
             "tag": td.get("tag"), "opp_score": td.get("opportunity_score"), **v}
            for v, td in zip(extracted, tag_data)
        ]
        prompt = ANALYSIS_NOTE_PROMPT.format(
            company_name=inp.company_name,
            origin_country=inp.origin_country,
            business_type=inp.business_type,
            product_name=inp.product_name,
            certifications=", ".join(inp.certifications or []),
            variants_json=json.dumps(combined, indent=2),
        )
        try:
            raw = await call_openai(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1500,
                temperature=0.7,
                call_type="variants_analysis_notes",
                module="variants_formats",
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=getattr(inp, "product_id", None),
            )
            if raw is None:
                raise ValueError("call_openai returned None")
            raw  = raw.strip()
            raw  = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
            data = json.loads(raw)
            return {n["variant_name"]: n["analysis_note"] for n in data.get("notes", [])}
        except Exception as e:
            print(f"  ⚠️  [variants] Analysis note error: {e}")
            return {}

    # ── Main entry point ─────────────────────────────────────────────────────

    async def run(self, inp) -> VariantsFormatsResult:
        """
        Full variants & formats run for one product.
        6 LLM calls: 2 Sonar + 2 GPT extract + 1 tag/score + 1 notes.
        Sonar call 1 finds variants, call 2 gets market data for that list.

        Args:
            inp : ModuleInput
        Returns:
            VariantsFormatsResult with up to 6 VariantData objects
        """
        print(f"\n  📦 [variants_formats] {inp.product_name}")

        # Step 1a — Sonar discovers what variants exist
        discovery_text = await self._sonar_discover_variants(inp)

        # Step 1b — GPT extracts variant names from Sonar response (if any)
        if discovery_text:
            variant_names = await self._extract_variant_names(discovery_text, inp)
        else:
            print(f"  ⚠️  [variants] Sonar discovery returned nothing — GPT generating variants")
            variant_names = []

        # Step 1c — GPT generates variant names if Sonar returned fewer than 3
        if len(variant_names) < 3:
            print(f"  ⚠️  [variants] Only {len(variant_names)} names from Sonar — GPT generating variants")
            variant_names = await self._gpt_generate_variant_names(variant_names, inp)

        if not variant_names:
            return VariantsFormatsResult(
                success=False, product_id=inp.product_id,
                error="Could not generate variant names"
            )

        # Step 2a — Sonar gets market data for the known variant list
        market_text = await self._sonar_get_market_data(variant_names, inp)

        # Step 2b — GPT structures Sonar response; if Sonar empty, start with empty list
        if market_text:
            extracted = await self._extract_all_variants(market_text, inp)
        else:
            print(f"  ⚠️  [variants] Sonar market data empty — GPT will generate all fields")
            extracted = []

        # Pad: add empty stubs for any variant names Sonar didn't cover
        extracted_names = {v["variant_name"].lower() for v in extracted}
        for name in variant_names:
            if name.lower() not in extracted_names:
                extracted.append({"variant_name": name})
        print(f"     → {len(extracted)} variants going into GPT fill ({len(extracted) - len(extracted_names)} stubs added)")

        # Step 2c — GPT fills null fields using training knowledge (matched_buyers stays null)
        extracted = await self._gpt_fill_missing_fields(extracted, inp)

        # Step 3 — Fuzzy match to identify "your_product" (no LLM)
        variant_names    = [v["variant_name"] for v in extracted]
        your_product_idx = _find_your_product_idx(variant_names, inp.product_name)
        print(f"     → 'Your product' → '{variant_names[your_product_idx]}'")

        # Step 4+5 — Tag/score + analysis notes in parallel (2 GPT calls)
        tag_data, notes_map = await asyncio.gather(
            self._tag_and_score(extracted, your_product_idx, inp),
            self._generate_analysis_notes(extracted, [{}] * len(extracted), inp),
        )

        # Assemble final VariantData list
        variants = []
        for i, v in enumerate(extracted):
            td = tag_data[i] if i < len(tag_data) else {}
            variants.append(VariantData(
                variant_name=      v["variant_name"],
                tag=               td.get("tag", "in_market"),
                opportunity_score= td.get("opportunity_score"),
                key_spec=          v.get("key_spec"),
                price_range=       v.get("price_range"),
                moq=               v.get("moq"),
                buyer_demand=      v.get("buyer_demand"),
                matched_buyers=    v.get("matched_buyers"),
                lead_time=         v.get("lead_time"),
                analysis_note=     notes_map.get(v["variant_name"]),
            ))

        rich = sum(1 for v in variants if v.key_spec or v.price_range)
        print(f"     → {rich}/{len(variants)} variants with data  "
              f"| your_product: '{variant_names[your_product_idx]}'")

        return VariantsFormatsResult(
            success=True,
            product_id=inp.product_id,
            variants=variants,
        )