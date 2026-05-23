"""
modules/marketing_kit/keyword_intel.py
----------------------------------------
Sub-module 1 — Keyword Intelligence

Flow:
  1. Build seed keywords from product data (product name, category, certs)
  2. Call Google Ads KeywordPlanIdeaService (English seeds) → raw volume + competition
  3. Pass raw keyword list to GPT-4o-mini → classify into 2 English buckets
  4. Multilingual (separate flow):
       a. GPT-4o-mini generates 15 candidate keywords in target language
       b. Feed those as seeds to Ads API (language-switched call)
       c. Match API response back to GPT candidates by text similarity
       d. Enrich matched keywords with real volume + competition data
       e. Unmatched GPT keywords kept with volume=null (GPT quality, no data)
  5. Return KeywordResult with 3 typed lists, each up to 10 items

Buckets:
  - high_volume_buyer_intent  : high volume (≥500/mo), buyer-intent phrasing
  - low_competition_gaps      : competition LOW + gap opportunity vs big brands
  - multilingual              : per target_country language, 10 keywords

Config required in config.py:
  GOOGLE_ADS = {
      "yaml_path": "/path/to/google-ads.yaml",
      "customer_id": "YOUR_CUSTOMER_ID",
      "max_keywords_per_seed": 50,
      "language_constant": "languageConstants/1000",   # English default
  }

DB table: product_info.keyword_intelligence
  product_id, target_country, high_volume_buyer_intent (jsonb),
  low_competition_gaps (jsonb), multilingual (jsonb), created_at
"""

import asyncio
import json
import re
from dataclasses import dataclass, field
from typing import Optional
import time
from modules.marketing_kit.keyword_prompt import CLASSIFY_PROMPT, MULTILINGUAL_PROMPT
from input_pipeline.config import MARKETING_KIT
from modules.base_module import BaseModule

# ── country → language constant + ISO code ──────────────────────────────────
# Legacy single-language map (kept for v1 backwards compat)
COUNTRY_LANGUAGE_MAP = {
    "Germany":        {"constant": "languageConstants/1001", "name": "German",     "iso": "de"},
    "France":         {"constant": "languageConstants/1002", "name": "French",     "iso": "fr"},
    "Spain":          {"constant": "languageConstants/1003", "name": "Spanish",    "iso": "es"},
    "Italy":          {"constant": "languageConstants/1004", "name": "Italian",    "iso": "it"},
    "Netherlands":    {"constant": "languageConstants/1010", "name": "Dutch",      "iso": "nl"},
    "Japan":          {"constant": "languageConstants/1005", "name": "Japanese",   "iso": "ja"},
    "South Korea":    {"constant": "languageConstants/1012", "name": "Korean",     "iso": "ko"},
    "Brazil":         {"constant": "languageConstants/1014", "name": "Portuguese", "iso": "pt"},
    "United States":  {"constant": "languageConstants/1000", "name": "English",    "iso": "en"},
    "United Kingdom": {"constant": "languageConstants/1000", "name": "English",    "iso": "en"},
    "Australia":      {"constant": "languageConstants/1000", "name": "English",    "iso": "en"},
    "Canada":         {"constant": "languageConstants/1000", "name": "English",    "iso": "en"},
}
DEFAULT_LANGUAGE = {"constant": "languageConstants/1000", "name": "English", "iso": "en"}

_EN = {"constant": "languageConstants/1000", "name": "English",    "iso": "en"}
_DE = {"constant": "languageConstants/1001", "name": "German",     "iso": "de"}
_FR = {"constant": "languageConstants/1002", "name": "French",     "iso": "fr"}
_ES = {"constant": "languageConstants/1003", "name": "Spanish",    "iso": "es"}
_IT = {"constant": "languageConstants/1004", "name": "Italian",    "iso": "it"}
_JA = {"constant": "languageConstants/1005", "name": "Japanese",   "iso": "ja"}
_NL = {"constant": "languageConstants/1010", "name": "Dutch",      "iso": "nl"}
_KO = {"constant": "languageConstants/1012", "name": "Korean",     "iso": "ko"}
_PT = {"constant": "languageConstants/1014", "name": "Portuguese", "iso": "pt"}
_AR = {"constant": "languageConstants/1019", "name": "Arabic",     "iso": "ar"}
_ZH = {"constant": "languageConstants/1017", "name": "Chinese",    "iso": "zh"}

# Multi-language map used by v2 — generates keywords in every listed language,
# enriches each with Ads API, then picks the top by search volume.
COUNTRY_LANGUAGES_MAP: dict[str, list[dict]] = {
    # Pure English markets — only one language needed
    "United States":    [_EN],
    "United Kingdom":   [_EN],
    "Australia":        [_EN],
    "Canada":           [_EN],
    # Single primary + English fallback
    "Germany":          [_DE, _EN],
    "France":           [_FR, _EN],
    "Spain":            [_ES, _EN],
    "Italy":            [_IT, _EN],
    "Netherlands":      [_NL, _EN],
    "Japan":            [_JA, _EN],
    "South Korea":      [_KO, _EN],
    "Brazil":           [_PT, _EN],
    "China":            [_ZH, _EN],
    "UAE":              [_AR, _EN],
    "Saudi Arabia":     [_AR, _EN],
    "Middle East":      [_AR, _EN],
    # Regional targets — top 3 languages
    "Europe":           [_DE, _FR, _EN],
    "Southeast Asia":   [_EN],
    "Latin America":    [_ES, _PT],
}
DEFAULT_LANGUAGES: list[dict] = [_EN]


# ── Data models ──────────────────────────────────────────────────────────────

@dataclass
class KeywordItem:
    keyword: str
    search_volume: Optional[int]          # avg monthly searches
    competition: Optional[str]            # "Low" / "Medium" / "High"
    competition_index: Optional[int]      # 0-100
    gap: Optional[str] = None             # "High" / "Low" / None — set by GPT classifier


@dataclass
class MultilingualKeyword:
    keyword: str
    language: str                         # e.g. "German"
    search_volume: Optional[int]
    competition: Optional[str]
    competition_index: Optional[int] = None  # added for Ads enrichment
    gap: Optional[str] = None


@dataclass
class KeywordResult:
    success: bool
    product_id: str
    target_country: str
    high_volume_buyer_intent: list[KeywordItem] = field(default_factory=list)
    low_competition_gaps: list[KeywordItem]     = field(default_factory=list)
    multilingual: list[MultilingualKeyword]     = field(default_factory=list)
    error: Optional[str] = None

    def to_db_row(self) -> dict:
        return {
            "product_id":                self.product_id,
            "target_country":            self.target_country,
            "high_volume_buyer_intent":  [_kw_to_dict(k) for k in self.high_volume_buyer_intent],
            "low_competition_gaps":      [_kw_to_dict(k) for k in self.low_competition_gaps],
            "multilingual":              [_ml_to_dict(k) for k in self.multilingual],
        }


def _kw_to_dict(k: KeywordItem) -> dict:
    return {
        "keyword":           k.keyword,
        "search_volume":     k.search_volume,
        "competition":       k.competition,
        "competition_index": k.competition_index,
        "gap":               k.gap,
    }


def _ml_to_dict(k: MultilingualKeyword) -> dict:
    return {
        "keyword":           k.keyword,
        "language":          k.language,
        "search_volume":     k.search_volume,
        "competition":       k.competition,
        "competition_index": k.competition_index,
        "gap":               k.gap,
    }


# ── GPT classification prompt ────────────────────────────────────────────────
# ── JSON parse helper ────────────────────────────────────────────────────────

def _extract_json(text: str) -> dict:
    """
    Robustly extracts a JSON object from GPT output.
    Handles markdown fences, leading/trailing prose, and whitespace.
    Raises json.JSONDecodeError if no valid JSON object is found.
    """
    # Strip markdown code fences first
    text = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()
    # Find the outermost {...} block
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise json.JSONDecodeError("No JSON object found", text, 0)
    return json.loads(match.group())


# ── Main module class ─────────────────────────────────────────────────────────

class KeywordIntelModule(BaseModule):
    """
    Fetches real keyword data from Google Ads API, then uses GPT-4o-mini
    to classify into buckets and generate multilingual variants.

    Usage:
        from modules.marketing_kit.keyword_intel import KeywordIntelModule
        result = await KeywordIntelModule().run(inp)
    """

    # ── Rate-limit retry helper ──────────────────────────────────────────────

    def _ads_call_with_retry(self, service, request, seed: str, max_retries: int = 3):
        """
        Calls service.generate_keyword_ideas(request) with retry on 429.
        Reads the wait time from the error message ("Retry in N seconds"),
        defaults to 35 s if not found. Raises on the final attempt.
        """
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
                    print(f"  ⏳ [keyword_intel] Rate limited on '{seed}' — "
                          f"waiting {wait}s (attempt {attempt + 1}/{max_retries})...")
                    time.sleep(wait)
                else:
                    raise

    # ── Google Ads API fetch ─────────────────────────────────────────────────

    def _fetch_from_ads_api(
        self,
        product_name: str,
        language_constant: str,
        yaml_path: str,
        customer_id: str,
        max_results: int = 200,
    ) -> list[dict]:
        """
        Single Google Ads API call using product name as seed.
        Passes a small set of combined seeds in one request — the API
        returns ideas for all of them together, so this is always 1 call.
        Returns raw keyword dicts with volume + competition data.
        Called via asyncio.to_thread to avoid blocking.
        """
        try:
            from google.ads.googleads.client import GoogleAdsClient
        except ImportError:
            raise ImportError(
                "google-ads package not installed. "
                "Run: pip install google-ads"
            )

        client  = GoogleAdsClient.load_from_storage(yaml_path)
        service = client.get_service("KeywordPlanIdeaService")
        COMPETITION_MAP = {0: "Unknown", 1: "Low", 2: "Medium", 3: "High"}

        name = product_name.lower()
        combined_seeds = [name, f"{name} supplier", f"bulk {name}", f"{name} manufacturer"]

        request = client.get_type("GenerateKeywordIdeasRequest")
        request.customer_id = customer_id
        request.language    = language_constant
        request.keyword_seed.keywords.extend(combined_seeds)

        response = self._ads_call_with_retry(service, request, name)

        raw_kws = []
        for idea in response:
            text    = idea.text.strip().lower()
            metrics = idea.keyword_idea_metrics
            raw_kws.append({
                "keyword":           text,
                "search_volume":     int(metrics.avg_monthly_searches) if metrics else None,
                "competition":       COMPETITION_MAP.get(
                                         int(metrics.competition) if metrics else 0, "Unknown"
                                     ),
                "competition_index": int(metrics.competition_index) if metrics else None,
            })
            if len(raw_kws) >= max_results:
                break

        raw_kws.sort(key=lambda x: x["search_volume"] or 0, reverse=True)
        # print(raw_kws)
        return raw_kws

    # ── GPT classification ───────────────────────────────────────────────────

    B2B_TRIGGERS = {
        "supplier", "wholesale", "bulk", "manufacturer", "exporter",
        "b2b", "private label", "oem", "distributor", "trade", "import",
        "certified", "organic", "factory", "source", "procurement",
    }

    def _prefilter_for_gpt(self, raw_kws: list[dict]) -> list[dict]:
        """
        Pre-filter raw keywords before sending to GPT.
        Two pools:
          - b2b_pool  : keywords containing a B2B trigger word (all kept)
          - high_vol  : remaining keywords with volume ≥ 500 (top 30 by volume)
        Combined and capped at 80 so GPT gets a focused, manageable list.
        """
        b2b_pool  = [k for k in raw_kws
                     if any(t in k["keyword"].lower() for t in self.B2B_TRIGGERS)]
        high_vol  = [k for k in raw_kws
                     if k not in b2b_pool and (k.get("search_volume") or 0) >= 500]
        high_vol.sort(key=lambda x: x.get("search_volume") or 0, reverse=True)
        combined  = b2b_pool + high_vol[:30]
        print(f"     → pre-filter: {len(b2b_pool)} B2B-trigger + {min(len(high_vol),30)} high-vol = {len(combined)} sent to GPT")
        return combined[:80]

    async def _classify_keywords(self, raw_kws: list[dict], inp) -> tuple[list, list]:
        """
        Pass raw keywords to GPT-4o-mini → returns (buyer_intent, gap_keywords).
        """
        filtered = self._prefilter_for_gpt(raw_kws)
        prompt = CLASSIFY_PROMPT.format(
            product_name=inp.product_name,
            category=inp.category,
            certifications=", ".join(inp.certifications or []),
            business_type=inp.business_type,
            target_country=inp.target_country,
            raw_keywords_json=json.dumps(filtered, indent=2),
        )

        client = self._get_openai()
        try:
            resp = await client.chat.completions.create(
                model="gpt-4o-mini",
                temperature=MARKETING_KIT["keyword_classify_temp"],
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}],
            )
            raw  = resp.choices[0].message.content.strip()
            data = _extract_json(raw)

            buyer_intent = [
                KeywordItem(
                    keyword=k["keyword"],
                    search_volume=k.get("search_volume"),
                    competition=k.get("competition"),
                    competition_index=k.get("competition_index"),
                    gap=k.get("gap"),
                )
                for k in data.get("high_volume_buyer_intent", [])[:10]
            ]
            gap_kws = [
                KeywordItem(
                    keyword=k["keyword"],
                    search_volume=k.get("search_volume"),
                    competition=k.get("competition"),
                    competition_index=k.get("competition_index"),
                    gap=k.get("gap"),
                )
                for k in data.get("low_competition_gaps", [])[:10]
            ]
            return buyer_intent, gap_kws

        except Exception as e:
            print(f"  ⚠️  [keyword_intel] GPT classification error: {e}")
            # Fallback: basic rule-based split from raw data
            buyer_intent = [
                KeywordItem(k["keyword"], k.get("search_volume"),
                            k.get("competition"), k.get("competition_index"), "Low")
                for k in raw_kws[:10]
            ]
            gap_kws = [
                KeywordItem(k["keyword"], k.get("search_volume"),
                            k.get("competition"), k.get("competition_index"), "High")
                for k in raw_kws
                if k.get("competition") == "Low"
            ][:10]
            return buyer_intent, gap_kws

    # ── Multilingual: GPT generate → Ads API enrich ─────────────────────────

    async def _gpt_generate_multilingual_candidates(
        self, inp, language: str, n: int = 15
    ) -> list[str]:
        """
        Step 1: Ask GPT-4o-mini to generate N multilingual keyword candidates.
        Returns a plain list of keyword strings (no metrics yet).
        Generating more candidates (15) than needed (10) gives Ads API
        better seeds to match against.
        """
        prompt = MULTILINGUAL_PROMPT.format(
            product_name=inp.product_name,
            category=inp.category,
            certifications=", ".join(inp.certifications or []),
            target_country=inp.target_country,
            language=language,
            n=n,
        )
        client = self._get_openai()
        try:
            resp = await client.chat.completions.create(
                model="gpt-4o-mini",
                temperature=MARKETING_KIT["keyword_multilingual_temp"],
                max_tokens=1000,
                messages=[{"role": "user", "content": prompt}],
            )
            raw  = resp.choices[0].message.content.strip()
            data = _extract_json(raw)
            candidates = [k["keyword"] for k in data.get("multilingual", [])[:n]]
            print(f"     → GPT generated {len(candidates)} multilingual candidates ({language})")
            return candidates
        except json.JSONDecodeError:
            # Fallback: extract quoted strings from raw response
            candidates = re.findall(r'"([^"]{5,60})"', raw)[:n]
            print(f"  ⚠️  [keyword_intel] JSON fallback — extracted {len(candidates)} candidates via regex")
            return candidates
        except Exception as e:
            print(f"  ⚠️  [keyword_intel] GPT multilingual generation error: {e}")
            return []
    def _enrich_with_ads_api(
        self,
        candidate_keywords: list[str],
        language_constant: str,
        yaml_path: str,
        customer_id: str,
    ) -> dict[str, dict]:
        """
        Single Ads API call: all GPT multilingual candidates passed as combined
        seeds in one request. Returns a dict keyed by lowercase keyword text →
        {search_volume, competition, competition_index} for match-back.
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
        request.keyword_seed.keywords.extend(candidate_keywords)

        response = self._ads_call_with_retry(service, request, "multilingual-batch")

        metrics_by_kw: dict[str, dict] = {}
        for idea in response:
            text = idea.text.strip().lower()
            if text in metrics_by_kw:
                continue
            m = idea.keyword_idea_metrics
            metrics_by_kw[text] = {
                "search_volume":     int(m.avg_monthly_searches) if m else None,
                "competition":       COMPETITION_MAP.get(int(m.competition) if m else 0, "Unknown"),
                "competition_index": int(m.competition_index) if m else None,
            }

        return metrics_by_kw

    def _match_back(
        self,
        candidates: list[str],
        metrics_by_kw: dict[str, dict],
        language: str,
    ) -> list[MultilingualKeyword]:
        """
        Step 3: Match GPT candidates back to Ads API results.

        Matching priority:
          1. Exact match (lowercase)
          2. Partial match — candidate is a substring of an API keyword or vice versa
          3. No match — keep the GPT keyword with volume=None (quality term, no data)

        Result is sorted: matched (by volume desc) → unmatched.
        Returns top 10.
        """
        matched   = []
        unmatched = []

        for candidate in candidates:
            key = candidate.strip().lower()

            # 1. Exact match
            if key in metrics_by_kw:
                m = metrics_by_kw[key]
                matched.append(MultilingualKeyword(
                    keyword=candidate,
                    language=language,
                    search_volume=m["search_volume"],
                    competition=m["competition"],
                    competition_index=m.get("competition_index"),
                    gap="High" if (m.get("competition_index") or 100) < 35 else "Low",
                ))
                continue

            # 2. Partial match — find best overlapping API keyword
            best_api_kw = None
            for api_kw in metrics_by_kw:
                if key in api_kw or api_kw in key:
                    # Pick longest partial match (most specific)
                    if best_api_kw is None or len(api_kw) > len(best_api_kw):
                        best_api_kw = api_kw

            if best_api_kw:
                m = metrics_by_kw[best_api_kw]
                matched.append(MultilingualKeyword(
                    keyword=candidate,           # keep GPT's phrasing
                    language=language,
                    search_volume=m["search_volume"],
                    competition=m["competition"],
                    competition_index=m.get("competition_index"),
                    gap="High" if (m.get("competition_index") or 100) < 35 else "Low",
                ))
                continue

            # 3. No match — keep with no metrics
            unmatched.append(MultilingualKeyword(
                keyword=candidate,
                language=language,
                search_volume=None,
                competition=None,
                competition_index=None,
                gap=None,
            ))

        # Sort matched by volume desc, append unmatched at the end
        matched.sort(key=lambda k: k.search_volume or 0, reverse=True)
        result = matched + unmatched
        matched_count = len(matched)
        print(f"     → {matched_count}/{len(candidates)} multilingual keywords enriched with real volume")
        return result[:10]

    async def _generate_multilingual(
        self,
        inp,
        yaml_path: str,
        customer_id: str,
    ) -> list[MultilingualKeyword]:
        """
        Orchestrates the full multilingual flow:
          GPT candidates → Ads API enrich → match-back → top 10
        """
        lang_info = COUNTRY_LANGUAGE_MAP.get(inp.target_country, DEFAULT_LANGUAGE)
        language  = lang_info["name"]
        lang_const = lang_info["constant"]

        # Step 1: GPT generates candidates (async)
        candidates = await self._gpt_generate_multilingual_candidates(inp, language)
        if not candidates:
            return []

        # Step 2: Ads API enrich (blocking → thread)
        # Skip Ads enrichment for English-speaking markets since the main
        # English Ads call already covers those seeds — just return GPT results
        if lang_info["iso"] == "en":
            print(f"     → English market: skipping multilingual Ads call, returning GPT candidates")
            return [
                MultilingualKeyword(
                    keyword=c, language=language,
                    search_volume=None, competition=None,
                    competition_index=None, gap=None,
                )
                for c in candidates[:10]
            ]

        try:
            metrics_by_kw = await asyncio.to_thread(
                self._enrich_with_ads_api,
                candidates,
                lang_const,
                yaml_path,
                customer_id,
            )
        except Exception as e:
            print(f"  ⚠️  [keyword_intel] Multilingual Ads enrichment failed: {e} — returning GPT candidates only")
            return [
                MultilingualKeyword(
                    keyword=c, language=language,
                    search_volume=None, competition=None,
                    competition_index=None, gap=None,
                )
                for c in candidates[:10]
            ]

        # Step 3: Match-back
        return self._match_back(candidates, metrics_by_kw, language)

    # ── Main entry point ─────────────────────────────────────────────────────

    async def run(self, inp) -> KeywordResult:
        """
        Full keyword research run for one product × one target country.

        Args:
            inp : ModuleInput — uses product_name, category, certifications,
                  origin_country, target_country, business_type
        Returns:
            KeywordResult with 3 keyword buckets
        """
        from input_pipeline.config import GOOGLE_ADS  # lazy import

        yaml_path   = GOOGLE_ADS["yaml_path"]
        customer_id = GOOGLE_ADS["customer_id"]

        print(f"  🔑 [keyword_intel] {inp.product_name} → {inp.target_country}")

        lang_info         = COUNTRY_LANGUAGE_MAP.get(inp.target_country, DEFAULT_LANGUAGE)
        language_constant = lang_info["constant"]

        # 1. Fetch keyword data — single API call for the product name
        try:
            raw_kws = await asyncio.to_thread(
                self._fetch_from_ads_api,
                inp.product_name,
                language_constant,
                yaml_path,
                customer_id,
            )
            print(f"     → {len(raw_kws)} raw keywords from Ads API (1 call)")
        except Exception as e:
            print(f"  ❌ [keyword_intel] Ads API failed: {e}")
            return KeywordResult(
                success=False,
                product_id=inp.product_id,
                target_country=inp.target_country,
                error=str(e),
            )

        # 2. Run GPT classification + multilingual pipeline in parallel
        #    _generate_multilingual now handles its own Ads enrichment internally
        (buyer_intent, gap_kws), multilingual = await asyncio.gather(
            self._classify_keywords(raw_kws, inp),
            self._generate_multilingual(inp, yaml_path, customer_id),
        )

        print(f"     → {len(buyer_intent)} buyer-intent | "
              f"{len(gap_kws)} gaps | {len(multilingual)} multilingual")

        return KeywordResult(
            success=True,
            product_id=inp.product_id,
            target_country=inp.target_country,
            high_volume_buyer_intent=buyer_intent,
            low_competition_gaps=gap_kws,
            multilingual=multilingual,
        )