"""
modules/marketing_kit/keyword_intel_v2.py
------------------------------------------
Sub-module 1 — Keyword Intelligence (v2 — GPT-first)

Difference from v1:
  v1 flow: Ads API seeds → 200 raw keywords → GPT classifies
  v2 flow: GPT generates targeted keywords → Ads API enriches with real volume

Why v2:
  - Ads API seed expansion is broad and noisy — 200 keywords, mostly irrelevant
  - GPT already knows buyer intent; it doesn't need Ads API to surface good keywords
  - Ads API's real value is volume + competition index, not discovery
  - Result: fewer but more relevant keywords, with real volume data attached

Flow:
  1. GPT generates 3 lists in parallel (1 call each):
       a. 15 English buyer-intent keywords
       b. 15 English low-competition gap keywords
       c. 15 multilingual keywords in target country language
  2. All 30 English keywords → ONE Ads API call → volume + competition
  3. All 15 multilingual keywords → ONE Ads API call → volume + competition
     (skip if English-speaking market)
  4. Match-back: GPT keyword ← Ads API result (exact → partial → unmatched)
  5. Return KeywordResult — same format as v1

Input/output: identical to keyword_intel.py — drop-in replacement.
DB table: product_info.keyword_intelligence (unchanged)
"""

import asyncio
import json
import re
import time
from dataclasses import dataclass, field
from typing import Optional

from input_pipeline.config import MARKETING_KIT
from modules.base_module import BaseModule, call_openai

from modules.marketing_kit.keyword_prompt import BUYER_INTENT_PROMPT, GAP_KEYWORDS_PROMPT, MULTILINGUAL_PROMPT
# Re-use the same country→language map and data models from v1
from modules.marketing_kit.keyword_intel import (
    COUNTRY_LANGUAGE_MAP,
    DEFAULT_LANGUAGE,
    KeywordItem,
    MultilingualKeyword,
    KeywordResult,
    _kw_to_dict,
    _ml_to_dict,
    _extract_json,
)


# ── Module class ──────────────────────────────────────────────────────────────

class KeywordIntelModule(BaseModule):
    """
    Keyword Intelligence v2 — GPT-first approach.
    GPT generates targeted keyword lists, Ads API enriches with real volume.

    Drop-in replacement for keyword_intel.py — same class name, same run() signature,
    same KeywordResult output.

    Usage:
        from modules.marketing_kit.keyword_intel_v2 import KeywordIntelModule
        result = await KeywordIntelModule().run(inp)
    """

    # ── Rate-limit retry (same as v1) ────────────────────────────────────────

    def _ads_call_with_retry(self, service, request, seed: str, max_retries: int = 3):
        for attempt in range(max_retries):
            try:
                return service.generate_keyword_ideas(request=request)
            except Exception as e:
                err_str = str(e)
                is_rate_limit = (
                    "429" in err_str
                    or "Resource has been exhausted" in err_str
                    or "Too many requests" in err_str
                )
                if is_rate_limit and attempt < max_retries - 1:
                    match = re.search(r"Retry in (\d+) seconds", err_str)
                    wait  = int(match.group(1)) + 5 if match else 35
                    print(f"  ⏳ [keyword_intel_v2] Rate limited on '{seed}' — "
                          f"waiting {wait}s (attempt {attempt + 1}/{max_retries})...")
                    time.sleep(wait)
                else:
                    raise

    # ── Step 1: GPT generates keyword candidates ─────────────────────────────

    async def _gpt_buyer_intent(self, inp) -> list[str]:
        prompt = BUYER_INTENT_PROMPT.format(
            product_name=  inp.product_name,
            category=      inp.category,
            certifications=", ".join(inp.certifications or []),
            business_type= inp.business_type,
            target_country=inp.target_country,
        )
        try:
            raw = await call_openai(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.3,
                call_type="keyword_buyer_intent",
                module="keyword_intel",
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=getattr(inp, "product_id", None),
            )
            data = _extract_json(raw.strip() if raw else "")
            kws  = [k["keyword"] for k in data.get("buyer_intent", [])[:15]]
            print(f"     → GPT buyer-intent: {len(kws)} keywords generated")
            return kws
        except Exception as e:
            print(f"  ⚠️  [keyword_intel_v2] GPT buyer-intent failed: {e}")
            return []

    async def _gpt_gap_keywords(self, inp) -> list[str]:
        prompt = GAP_KEYWORDS_PROMPT.format(
            product_name=  inp.product_name,
            category=      inp.category,
            certifications=", ".join(inp.certifications or []),
            business_type= inp.business_type,
            target_country=inp.target_country,
        )
        try:
            raw = await call_openai(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.3,
                call_type="keyword_gap",
                module="keyword_intel",
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=getattr(inp, "product_id", None),
            )
            data = _extract_json(raw.strip() if raw else "")
            kws  = [k["keyword"] for k in data.get("gap_keywords", [])[:15]]
            print(f"     → GPT gap keywords: {len(kws)} keywords generated")
            return kws
        except Exception as e:
            print(f"  ⚠️  [keyword_intel_v2] GPT gap keywords failed: {e}")
            return []

    async def _gpt_multilingual(self, inp, language: str) -> list[str]:
        prompt = MULTILINGUAL_PROMPT.format(
            product_name=  inp.product_name,
            category=      inp.category,
            certifications=", ".join(inp.certifications or []),
            target_country=inp.target_country,
            language=      language,
        )
        try:
            raw = await call_openai(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.3,
                call_type="keyword_multilingual",
                module="keyword_intel",
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=getattr(inp, "product_id", None),
            )
            data = _extract_json(raw.strip() if raw else "")
            kws  = [k["keyword"] for k in data.get("multilingual", [])[:15]]
            print(f"     → GPT multilingual ({language}): {len(kws)} keywords generated")
            return kws
        except Exception as e:
            print(f"  ⚠️  [keyword_intel_v2] GPT multilingual failed: {e}")
            return []

    # ── Step 2: Ads API — batch enrich ──────────────────────────────────────

    def _ads_enrich_batch(
        self,
        keywords:          list[str],
        language_constant: str,
        yaml_path:         str,
        customer_id:       str,
    ) -> dict[str, dict]:
        """
        Single Ads API call: all keywords passed as combined seeds.
        Returns dict keyed by lowercase keyword → {search_volume, competition, competition_index}.
        """
        try:
            from google.ads.googleads.client import GoogleAdsClient
        except ImportError:
            raise ImportError("google-ads not installed. Run: pip install google-ads")

        client  = GoogleAdsClient.load_from_storage(yaml_path)
        service = client.get_service("KeywordPlanIdeaService")
        COMPETITION_MAP = {0: "Unknown", 1: "Low", 2: "Medium", 3: "High"}

        request = client.get_type("GenerateKeywordIdeasRequest")
        request.customer_id = customer_id
        request.language    = language_constant
        request.keyword_seed.keywords.extend([kw.lower() for kw in keywords])

        response = self._ads_call_with_retry(service, request, "gpt-batch")

        metrics: dict[str, dict] = {}
        for idea in response:
            text = idea.text.strip().lower()
            if text in metrics:
                continue
            m = idea.keyword_idea_metrics
            metrics[text] = {
                "search_volume":     int(m.avg_monthly_searches) if m else None,
                "competition":       COMPETITION_MAP.get(int(m.competition) if m else 0, "Unknown"),
                "competition_index": int(m.competition_index) if m else None,
            }

        print(f"     → Ads API returned {len(metrics)} keyword metrics")
        return metrics

    # ── Step 3: Match-back ───────────────────────────────────────────────────

    def _match_back_english(
        self,
        keywords: list[str],
        metrics:  dict[str, dict],
        bucket:   str,          # "buyer_intent" or "gap"
    ) -> list[KeywordItem]:
        """
        Matches GPT-generated English keywords to Ads API metrics.
        Unmatched keywords are kept with volume=None — quality intent matters more than data.
        """
        matched   = []
        unmatched = []

        for kw in keywords:
            key = kw.strip().lower()
            m   = metrics.get(key)

            # Exact match
            if m:
                matched.append(KeywordItem(
                    keyword=          kw,
                    search_volume=    m["search_volume"],
                    competition=      m["competition"],
                    competition_index=m.get("competition_index"),
                    gap="High" if (m.get("competition_index") or 100) < 40 else "Low",
                ))
                continue

            # Partial match
            best = None
            for api_kw in metrics:
                if key in api_kw or api_kw in key:
                    if best is None or len(api_kw) > len(best):
                        best = api_kw
            if best:
                m = metrics[best]
                matched.append(KeywordItem(
                    keyword=          kw,
                    search_volume=    m["search_volume"],
                    competition=      m["competition"],
                    competition_index=m.get("competition_index"),
                    gap="High" if (m.get("competition_index") or 100) < 40 else "Low",
                ))
                continue

            # No match — keep with no metrics
            unmatched.append(KeywordItem(
                keyword=kw, search_volume=None,
                competition=None, competition_index=None,
                gap="High" if bucket == "gap" else None,
            ))

        matched.sort(key=lambda k: k.search_volume or 0, reverse=True)
        result = matched + unmatched

        print(f"     → {bucket}: {len(matched)}/{len(keywords)} enriched with real volume")
        return result[:10]

    def _match_back_multilingual(
        self,
        keywords: list[str],
        metrics:  dict[str, dict],
        language: str,
    ) -> list[MultilingualKeyword]:
        """Same match-back logic for multilingual keywords."""
        matched   = []
        unmatched = []

        for kw in keywords:
            key = kw.strip().lower()
            m   = metrics.get(key)

            if m:
                matched.append(MultilingualKeyword(
                    keyword=          kw,
                    language=         language,
                    search_volume=    m["search_volume"],
                    competition=      m["competition"],
                    competition_index=m.get("competition_index"),
                    gap="High" if (m.get("competition_index") or 100) < 35 else "Low",
                ))
                continue

            best = None
            for api_kw in metrics:
                if key in api_kw or api_kw in key:
                    if best is None or len(api_kw) > len(best):
                        best = api_kw
            if best:
                m = metrics[best]
                matched.append(MultilingualKeyword(
                    keyword=          kw,
                    language=         language,
                    search_volume=    m["search_volume"],
                    competition=      m["competition"],
                    competition_index=m.get("competition_index"),
                    gap="High" if (m.get("competition_index") or 100) < 35 else "Low",
                ))
                continue

            unmatched.append(MultilingualKeyword(
                keyword=kw, language=language,
                search_volume=None, competition=None,
                competition_index=None, gap=None,
            ))

        matched.sort(key=lambda k: k.search_volume or 0, reverse=True)
        result = matched + unmatched
        print(f"     → multilingual: {len(matched)}/{len(keywords)} enriched with real volume")
        return result[:10]

    # ── Main entry point ─────────────────────────────────────────────────────

    async def run(self, inp) -> KeywordResult:
        """
        Full keyword research run — GPT-first approach.

        Args:
            inp : ModuleInput
        Returns:
            KeywordResult — same format as keyword_intel.py v1
        """
        from input_pipeline.config import GOOGLE_ADS

        yaml_path   = GOOGLE_ADS["yaml_path"]
        customer_id = GOOGLE_ADS["customer_id"]

        lang_info  = COUNTRY_LANGUAGE_MAP.get(inp.target_country, DEFAULT_LANGUAGE)
        language   = lang_info["name"]
        lang_const = lang_info["constant"]
        en_const   = "languageConstants/1000"

        print(f"  🔑 [keyword_intel_v2] {inp.product_name} → {inp.target_country} ({language})")

        # ── Step 1: Generate all keyword lists in parallel (3 GPT calls) ─────
        buyer_kws, gap_kws, ml_kws = await asyncio.gather(
            self._gpt_buyer_intent(inp),
            self._gpt_gap_keywords(inp),
            self._gpt_multilingual(inp, language),
        )

        if not buyer_kws and not gap_kws:
            print(f"  ❌ [keyword_intel_v2] GPT returned no keywords")
            return KeywordResult(
                success=False,
                product_id=inp.product_id,
                target_country=inp.target_country,
                error="GPT keyword generation returned no results",
            )

        # ── Step 2: Ads API enrichment ────────────────────────────────────────
        # English batch: buyer-intent + gap + multilingual (if English market) in one call
        if lang_info["iso"] == "en":
            # For English markets, multilingual keywords are also English — enrich together
            all_english = list(dict.fromkeys(buyer_kws + gap_kws + ml_kws))
        else:
            all_english = list(dict.fromkeys(buyer_kws + gap_kws))

        try:
            english_metrics = await asyncio.to_thread(
                self._ads_enrich_batch,
                all_english,
                en_const,
                yaml_path,
                customer_id,
            )
        except Exception as e:
            print(f"  ⚠️  [keyword_intel_v2] English Ads enrichment failed: {e} — using GPT keywords only")
            english_metrics = {}

        # Multilingual Ads batch — always run for non-English markets
        ml_metrics: dict[str, dict] = {}
        if lang_info["iso"] != "en" and ml_kws:
            try:
                ml_metrics = await asyncio.to_thread(
                    self._ads_enrich_batch,
                    ml_kws,
                    lang_const,
                    yaml_path,
                    customer_id,
                )
            except Exception as e:
                print(f"  ⚠️  [keyword_intel_v2] Multilingual Ads enrichment failed: {e} — using GPT keywords only")

        # ── Step 3: Match-back ────────────────────────────────────────────────
        buyer_intent_items = self._match_back_english(buyer_kws, english_metrics, "buyer_intent")
        gap_items          = self._match_back_english(gap_kws,   english_metrics, "gap")

        if lang_info["iso"] == "en":
            # English market: match multilingual against the same english_metrics batch
            multilingual_items = self._match_back_multilingual(ml_kws, english_metrics, language)
        else:
            multilingual_items = self._match_back_multilingual(ml_kws, ml_metrics, language)

        print(f"     → Final: {len(buyer_intent_items)} buyer-intent | "
              f"{len(gap_items)} gaps | {len(multilingual_items)} multilingual")

        return KeywordResult(
            success=True,
            product_id=inp.product_id,
            target_country=inp.target_country,
            high_volume_buyer_intent=buyer_intent_items,
            low_competition_gaps=gap_items,
            multilingual=multilingual_items,
        )
