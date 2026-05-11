"""
modules/competitor_discovery.py
---------------------------------
Competitor Discovery — Foundation layer for competitor intelligence.

Finds top 10 global manufacturers/exporters competing with the user's product
across any market. Returns structured competitor list ready for enrichment
by the full competitor_intel module.

Flow (3 LLM calls):
  1. Sonar    → one broad query: "who are the top global manufacturers/exporters
                 of {product} competing with {origin_country} exporters?"
  2. GPT-4o-mini → extracts structured list: name + origin_country + website
  3. GPT-4o-mini → deduplicates + validates (removes resellers, vague entries)

Output per competitor:
  name           : company name (e.g. "Sabinsa Corporation")
  origin_country : country of manufacture/export (e.g. "United States")
  website        : domain if found (e.g. "sabinsa.com") — optional, for later crawling
  competitor_type: "manufacturer" | "exporter" | "vertically_integrated"
  notes          : one-line context (e.g. "Patented BCM-95 curcumin, dominant in US market")

DB table: product_info.competitor_discovery
  product_id, competitors (jsonb array), discovered_at

Extensibility:
  CompetitorEntry is designed to be the input unit for competitor_intel.py.
  Each entry's `website` field allows the intel module to crawl for:
  pricing, certifications, product specs, weaknesses, market positioning.
"""

import json
from dataclasses import dataclass, field
from typing import Optional

from modules.base_module import BaseModule


# ─────────────────────────────────────────────
#  DATA MODELS
# ─────────────────────────────────────────────

@dataclass
class CompetitorEntry:
    """
    Single competitor record. Designed as input unit for competitor_intel.py.
    Fields kept minimal but extensible — intel module will enrich each entry.
    """
    name:             str
    origin_country:   str
    website:          Optional[str] = None   # domain only, e.g. "sabinsa.com"
    competitor_type:  Optional[str] = None   # "manufacturer" | "exporter" | "vertically_integrated"
    notes:            Optional[str] = None   # one-liner context for this competitor

    def to_dict(self) -> dict:
        return {
            "name":            self.name,
            "origin_country":  self.origin_country,
            "website":         self.website,
            "competitor_type": self.competitor_type,
            "notes":           self.notes,
        }


@dataclass
class CompetitorDiscoveryResult:
    success:      bool
    product_id:   str
    product_name: str
    competitors:  list[CompetitorEntry] = field(default_factory=list)
    sonar_raw:    Optional[str]         = None   # stored for debug / re-extraction
    error:        Optional[str]         = None

    def count(self) -> int:
        return len(self.competitors)

    def is_fallback(self) -> bool:
        """True if we returned <6 competitors (sparse data scenario)."""
        return len(self.competitors) < 6

    def to_db_row(self) -> dict:
        return {
            "product_id":   self.product_id,
            "product_name": self.product_name,
            "competitors":  [c.to_dict() for c in self.competitors],
            "is_fallback":  self.is_fallback(),
        }

    def for_intel_module(self) -> list[dict]:
        """
        Returns competitor list in the format expected by competitor_intel.py.
        Each dict has all CompetitorEntry fields + product context.
        """
        return [
            {**c.to_dict(), "product_name": self.product_name,
             "product_id": self.product_id}
            for c in self.competitors
        ]


# ─────────────────────────────────────────────
#  PROMPT 1 — SONAR DISCOVERY QUERY
#
#  Broad global search — not limited to origin_country competitors.
#  Explicitly asks for manufacturers/exporters to filter resellers.
#  Asks for website to enable later crawling in competitor_intel.
# ─────────────────────────────────────────────

SONAR_COMPETITOR_QUERY = """
Who are the top 10 global manufacturers and exporters of {product_name} ({category})?
Include company name, country, website, and why each is significant in this market.
"""


# ─────────────────────────────────────────────
#  PROMPT 2 — EXTRACTION
#
#  GPT-4o-mini parses Sonar free-text into structured list.
#  Strict rules to filter out non-manufacturers.
# ─────────────────────────────────────────────

EXTRACTION_PROMPT = """
Extract a structured list of competitors from the research text below.

Product: {product_name}
User's origin country: {origin_country}

Research text:
---
{sonar_response}
---

Extract each competitor mentioned. Apply these filters:
- INCLUDE: manufacturers, producers, vertically integrated companies, direct exporters
- EXCLUDE: distributors, trading companies, brokers, resellers, marketplaces (Alibaba, etc.)
- EXCLUDE: the user's own company if mentioned ({company_name})
- EXCLUDE: any entry where you're not confident it's a real named company

Return ONLY valid JSON, no explanation:
{{
  "competitors": [
    {{
      "name": "exact company name",
      "origin_country": "country of manufacture or HQ",
      "website": "domain only e.g. sabinsa.com — or null if not mentioned",
      "competitor_type": "manufacturer | exporter | vertically_integrated",
      "notes": "one sentence — why this competitor matters in this market"
    }}
  ]
}}

Rules:
- Max 10 entries
- origin_country must be a real country name, not a region
- If website was not mentioned, set to null — do not guess domains
- notes must be specific (pricing, certs, market share) — not generic
"""


# ─────────────────────────────────────────────
#  PROMPT 3 — DEDUP + VALIDATE
#
#  Catches duplicates (same company different name spellings),
#  removes clearly wrong entries, ranks by relevance.
# ─────────────────────────────────────────────

DEDUP_VALIDATE_PROMPT = """
Review this competitor list for a {product_name} exporter from {origin_country}.

Competitor list:
{competitors_json}

Tasks:
1. DEDUPLICATE — merge entries that are clearly the same company
   (e.g. "Sabinsa" and "Sabinsa Corporation" → keep the fuller name)
2. REMOVE invalid entries:
   - Generic/vague names (e.g. "Various Indian manufacturers")
   - Distributors or resellers that slipped through
   - Any entry missing both website and meaningful notes
3. RANK by competitive threat to a {origin_country} exporter:
   - Highest threat first (same certs + strong market presence)
   - Lower threat last
4. KEEP top 10 after dedup/removal, minimum 5

Return ONLY valid JSON, no explanation:
{{
  "competitors": [
    {{
      "name": "...",
      "origin_country": "...",
      "website": "... or null",
      "competitor_type": "manufacturer | exporter | vertically_integrated",
      "notes": "..."
    }}
  ],
  "removed": ["name1", "name2"],
  "merged": ["e.g. Sabinsa + Sabinsa Corp → Sabinsa Corporation"]
}}
"""


# ─────────────────────────────────────────────
#  MODULE CLASS
# ─────────────────────────────────────────────

class CompetitorDiscoveryModule(BaseModule):
    """
    Discovers top global competitors for a product via Sonar.
    Outputs a clean, deduplicated CompetitorDiscoveryResult ready for
    enrichment by competitor_intel.py.

    Usage:
        result = await CompetitorDiscoveryModule().run(inp)
        # Feed into intel module:
        competitors = result.for_intel_module()
    """
    def module_name(self) -> str:
        return "competitor_discovery"
    # ── Step 1: Sonar discovery ──────────────────────────────────────────────

    async def _sonar_discover(self, inp) -> str | None:
        query = SONAR_COMPETITOR_QUERY.format(
            product_name=inp.product_name,
            category=inp.category,
        ).strip()
        text = await self._call_sonar_with_deflection_retry(query,"competitor_discovery")
        if text:
            print(f"     → Sonar: {len(text)} chars")
        return text

    # ── Step 2: Extract structured competitors ───────────────────────────────

    async def _extract(self, sonar_text: str, inp) -> list[dict]:
        prompt = EXTRACTION_PROMPT.format(
            product_name=inp.product_name,
            origin_country=inp.origin_country,
            company_name=inp.company_name,
            sonar_response=sonar_text[:3000],
        )
        data = await self._extract_structured(prompt)
        competitors = (data or {}).get("competitors", [])
        print(f"     → {len(competitors)} competitors extracted")
        return competitors

    # ── Step 3: Dedup + validate + rank ─────────────────────────────────────

    async def _dedup_and_validate(self, competitors: list[dict], inp) -> list[dict]:
        if len(competitors) <= 3:
            return competitors

        prompt = DEDUP_VALIDATE_PROMPT.format(
            product_name=inp.product_name,
            origin_country=inp.origin_country,
            competitors_json=json.dumps(competitors, indent=2),
        )
        data = await self._extract_structured(prompt)
        if not data:
            print(f"  ⚠️  [competitor_discovery] Dedup failed, using raw list")
            return competitors

        cleaned = data.get("competitors", competitors)
        removed = data.get("removed", [])
        merged  = data.get("merged", [])
        if removed:
            print(f"     → Removed: {removed}")
        if merged:
            print(f"     → Merged:  {merged}")
        print(f"     → {len(cleaned)} competitors after dedup/validate")
        return cleaned

    # ── Main entry point ─────────────────────────────────────────────────────

    async def run(self, inp) -> CompetitorDiscoveryResult:
        """
        Discover top global competitors for a product.

        Args:
            inp : ModuleInput
        Returns:
            CompetitorDiscoveryResult — pass .for_intel_module() to competitor_intel
        """
        print(f"\n  🔍 [competitor_discovery] {inp.product_name} | {inp.origin_country}")

        # Step 1 — Sonar discovery
        sonar_text = await self._sonar_discover(inp)
        if not sonar_text:
            return CompetitorDiscoveryResult(
                success=False, product_id=inp.product_id,
                product_name=inp.product_name,
                error="Sonar returned no data"
            )

        # Step 2 — Extract structured list
        raw_competitors = await self._extract(sonar_text, inp)
        if not raw_competitors:
            return CompetitorDiscoveryResult(
                success=False, product_id=inp.product_id,
                product_name=inp.product_name,
                error="Extraction returned no competitors"
            )

        # Step 3 — Dedup + validate + rank
        cleaned = await self._dedup_and_validate(raw_competitors, inp)

        # Enforce fallback threshold
        if len(cleaned) < 5:
            print(f"  ⚠️  Only {len(cleaned)} competitors found — sparse data (fallback mode)")

        # Build CompetitorEntry objects
        entries = [
            CompetitorEntry(
                name=            c.get("name", ""),
                origin_country=  c.get("origin_country", ""),
                website=         c.get("website"),
                competitor_type= c.get("competitor_type"),
                notes=           c.get("notes"),
            )
            for c in cleaned
            if c.get("name")          # skip any empty-name entries
        ][:10]                         # hard cap at 10

        print(f"     → Final: {len(entries)} competitors "
              f"({'fallback' if len(entries) < 6 else 'full'})")

        return CompetitorDiscoveryResult(
            success=True,
            product_id=inp.product_id,
            product_name=inp.product_name,
            competitors=entries,
            sonar_raw=sonar_text,
        )