"""
modules/buyer_discovery/b2b_buyers.py
---------------------------------------
B2B Buyer Discovery via Apollo.io organization search.

Replaces the old Sonar-based buyer discovery with real company data
from Apollo's API.

Flow:
  1. GPT        → generates 3 targeted keyword sets from product context
  2. Apollo API → org search per keyword set (concurrent, deduped)
  3. GPT        → ranks results, assigns buyer_type + sourcing notes

Returns BuyerDiscoveryResult — same shape as the old module, drop-in compatible.

Requirements:
  APOLLO_API_KEY in .env
"""

import json
import os
import asyncio
import httpx

from dotenv import load_dotenv
from modules.base_module import BaseModule, ModuleInput
from modules.buyer_discovery.models import BuyerEntry, BuyerDiscoveryResult

load_dotenv()

APOLLO_BASE    = "https://api.apollo.io/api/v1"
APOLLO_API_KEY = os.getenv("APOLLO_API_KEY", "")


# ─────────────────────────────────────────────
#  PROMPT 1 — KEYWORD GENERATION
# ─────────────────────────────────────────────

KEYWORD_GEN_PROMPT = """
You are helping search Apollo.io's company database to find B2B buyers.

Product: {product_name}
Category: {category}
Target country: {target_country}

Generate 3 keyword sets to find companies that manufacture with, import,
or actively source this product. Each set should target a different buyer segment.

Rules:
- Keywords must match how companies tag/describe themselves on Apollo
- Each set: 2-3 words max, specific and distinct from the other sets
- Think: who USES this as a raw material or ingredient (not who resells it)

Return ONLY valid JSON:
{{
  "keyword_sets": [
    ["keyword1", "keyword2"],
    ["keyword3", "keyword4"],
    ["keyword5", "keyword6"]
  ]
}}

Example for "Turmeric Powder":
{{
  "keyword_sets": [
    ["turmeric", "herbal supplement"],
    ["curcumin", "nutraceutical manufacturer"],
    ["spice importer", "food ingredients"]
  ]
}}
"""


# ─────────────────────────────────────────────
#  PROMPT 2 — ENRICH + RANK
# ─────────────────────────────────────────────

ENRICH_AND_RANK_PROMPT = """
You are a B2B export intelligence analyst.

Product       : {product_name} ({category})
Company origin: {origin_country}
Target market : {target_country}

Companies found via Apollo.io search:
{companies_json}

For each company:
1. Assign buyer_type — one of:
   supplement_brand | food_manufacturer | retailer | cosmetics_brand |
   industrial | distributor | other

2. Write notes — one sentence: why they likely source {product_name} from {origin_country}
   and their estimated sourcing relevance (volume, use case, frequency)

3. Assign relevance_score 1–10:
   10 = confirmed importer / manufacturer that uses this product
   7–9 = strong signals (industry + keywords match well)
   5–6 = plausible but indirect signal
   <5  = unlikely — exclude

Return ONLY valid JSON, sorted by relevance_score descending:
{{
  "buyers": [
    {{
      "name":            "exact company name from Apollo",
      "country":         "{target_country}",
      "website":         "domain only e.g. naturessunshine.com — or null",
      "buyer_type":      "...",
      "notes":           "...",
      "relevance_score": 8
    }}
  ]
}}

Rules:
- Exclude any company with relevance_score < 5
- Max 10 buyers in output
- website: domain only, no https://
- notes must reference {product_name} specifically
"""


# ─────────────────────────────────────────────
#  MODULE CLASS
# ─────────────────────────────────────────────

class B2BBuyersModule(BaseModule):
    """
    Discovers real B2B buyer companies via Apollo.io organization search.

    Returns BuyerDiscoveryResult — drop-in compatible with the old
    Sonar-based BuyerDiscoveryModule.

    Usage:
        result = await B2BBuyersModule().run(inp)
    """

    # ── Step 1: GPT keyword generation ──────────────────────────────────────

    async def _generate_keywords(self, inp: ModuleInput) -> list[list[str]]:
        """
        GPT generates 3 Apollo-optimized keyword sets.
        Falls back to basic product keywords if GPT fails.
        """
        prompt = KEYWORD_GEN_PROMPT.format(
            product_name=inp.product_name,
            category=inp.category,
            target_country=inp.target_country,
        )
        data    = await self._extract_structured(prompt)
        kw_sets = (data or {}).get("keyword_sets", [])

        if not kw_sets:
            kw_sets = [
                [inp.product_name.lower(), "importer"],
                [inp.category.lower(), "manufacturer"],
                [inp.product_name.lower(), "wholesale"],
            ]
            print("  ⚠️  [b2b_buyers] GPT keyword gen failed — using basic fallback")

        print(f"     → Keyword sets: {kw_sets}")
        return kw_sets[:3]

    # ── Step 2a: Single Apollo org search ────────────────────────────────────

    async def _apollo_search_one(
        self,
        keywords: list[str],
        country:  str,
        per_page: int = 10,
    ) -> list[dict]:
        """
        Calls Apollo /organizations/search for one keyword set.
        Returns list of raw organization dicts.
        """
        if not APOLLO_API_KEY:
            raise ValueError("APOLLO_API_KEY not found in .env")

        payload = {
            "q_organization_keyword_tags":       keywords,
            "organization_locations":            [country],
            "per_page":                          per_page,
            "page":                              1,
        }

        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                f"{APOLLO_BASE}/organizations/search",
                headers={
                    "X-Api-Key":    APOLLO_API_KEY,
                    "Content-Type": "application/json",
                    "Accept":       "application/json",
                },
                json=payload,
            )

            if resp.status_code == 401:
                raise ValueError("Apollo API key invalid or expired")
            if resp.status_code == 403:
                raise ValueError(f"Apollo 403 — endpoint not on your plan. {resp.text[:300]}")
            if resp.status_code == 422:
                raise ValueError(f"Apollo 422 — bad request params. {resp.text[:300]}")
            if resp.status_code == 429:
                raise RuntimeError("Apollo rate limit hit")

            resp.raise_for_status()
            data = resp.json()

        orgs = data.get("organizations") or data.get("accounts") or []
#        print(f"     → Raw Apollo companies ({len(orgs)}):")
#        for o in orgs:
#           print(f"       · {o.get('name', '?'):<40}  {o.get('industry', '—')}")
        return orgs

    # ── Step 2b: Run all keyword sets concurrently, dedup ────────────────────

    async def _search_all(
        self,
        keyword_sets: list[list[str]],
        country:      str,
    ) -> list[dict]:
        """
        Runs Apollo searches for all keyword sets concurrently.
        Deduplicates results by lowercased company name.
        """
        tasks = [
            self._apollo_search_one(kw_set, country)
            for kw_set in keyword_sets
        ]
        batches = await asyncio.gather(*tasks, return_exceptions=True)

        seen:     set[str]   = set()
        combined: list[dict] = []

        for i, batch in enumerate(batches):
            if isinstance(batch, Exception):
                print(f"  ⚠️  [b2b_buyers] Keyword set {i+1} failed: {batch}")
                continue
            for org in batch:
                name_key = (org.get("name") or "").strip().lower()
                if name_key and name_key not in seen:
                    seen.add(name_key)
                    combined.append(org)

        print(f"     → Apollo returned {len(combined)} unique companies")
        return combined

    # ── Step 3: GPT enriches + ranks ────────────────────────────────────────

    async def _enrich_and_rank(
        self,
        orgs: list[dict],
        inp:  ModuleInput,
    ) -> list[dict]:
        """
        GPT assigns buyer_type, notes, and relevance score.
        Strips Apollo verbosity before sending — keeps only fields GPT needs.
        """
        slim = [
            {
                "name":        org.get("name"),
                "industry":    org.get("industry"),
                "description": (org.get("short_description") or "")[:200],
                "website":     org.get("website_url") or org.get("primary_domain"),
                "employees":   org.get("num_employees"),
                "city":        org.get("city"),
                "keywords":    (org.get("keywords") or [])[:8],
            }
            for org in orgs
        ]

        prompt = ENRICH_AND_RANK_PROMPT.format(
            product_name=inp.product_name,
            category=inp.category,
            origin_country=inp.origin_country,
            target_country=inp.target_country,
            companies_json=json.dumps(slim, indent=2),
        )

        data   = await self._extract_structured(prompt)
        buyers = (data or {}).get("buyers", [])
        print(f"     → {len(buyers)} buyers qualified (relevance ≥ 5)")
        return buyers[:10]

    # ── Main entry point ─────────────────────────────────────────────────────

    async def run(self, inp: ModuleInput) -> BuyerDiscoveryResult:
        """
        Apollo-powered B2B buyer discovery.

        Args:
            inp : ModuleInput with product_name, category, target_country
        Returns:
            BuyerDiscoveryResult with real Apollo company data
        """
        print(f"\n  🏭 [b2b_buyers] {inp.product_name} → {inp.target_country}")

        # Step 1 — GPT generates keyword sets
        keyword_sets = await self._generate_keywords(inp)

        # Step 2 — Apollo org search (concurrent per keyword set)
        try:
            orgs = await self._search_all(keyword_sets, inp.target_country)
        except Exception as e:
            print(f"  ❌ [b2b_buyers] Apollo API error: {e}")
            return BuyerDiscoveryResult(
                success=False,
                product_id=inp.product_id,
                product_name=inp.product_name,
                target_country=inp.target_country,
                error=f"Apollo API error: {e}",
            )

        if not orgs:
            return BuyerDiscoveryResult(
                success=False,
                product_id=inp.product_id,
                product_name=inp.product_name,
                target_country=inp.target_country,
                error="Apollo returned no companies for these keywords",
            )

        # Step 3 — GPT enriches + ranks
        ranked = await self._enrich_and_rank(orgs, inp)

        entries = [
            BuyerEntry(
                name=       b.get("name", ""),
                country=    b.get("country", inp.target_country),
                website=    b.get("website"),
                buyer_type= b.get("buyer_type"),
                notes=      b.get("notes"),
            )
            for b in ranked
            if b.get("name")
        ]

        print(f"     → Final: {len(entries)} B2B buyers via Apollo")

        return BuyerDiscoveryResult(
            success=True,
            product_id=inp.product_id,
            product_name=inp.product_name,
            target_country=inp.target_country,
            buyers=entries,
        )
