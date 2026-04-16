"""
modules/market_demand.py
-------------------------
Module 1 — Market Demand Intelligence

Researches export market demand for a product across multiple countries.
Uses two Sonar calls:
    Step 1: Country discovery — find top target markets for this product
    Step 2: Per-country deep research — get all 7 fields for each country

Output per country (one DB row per country):
    country_and_score   → country name + score placeholder (score set by scoring_engine later)
    demand_growth       → YoY demand growth rate
    import_volume       → import volume in MT/USD
    matched_buyers      → estimated buyer count
    peak_procurement    → best months to approach buyers
    primary_channel     → main sales channel in that market
    cert_require        → certifications required by buyers
    cert_gap            → competitor certification gaps (opportunity)
    analysis_note       → analyst paragraph

DB table: product_info.market_intelligence
One row per product * country combination.
"""

import asyncio
from modules.base_module import BaseModule, ModuleInput, ModuleResult


# ─────────────────────────────────────────────
#  COUNTRY DISCOVERY
# ─────────────────────────────────────────────

COUNTRY_DISCOVERY_PROMPT = """
Which 15 countries which use {product_name} most?
"""

COUNTRY_LIST_EXTRACTION_PROMPT = """
Extract the list of country names from the research text below.

Research:
---
{sonar_response}
---

Return ONLY valid JSON:
{{
  "countries": ["Country1", "Country2", "Country3"]
}}

Rules:
- Country names only — no regions, no blocs (e.g. "EU")
- Maximum 10 countries
- If fewer than 2 are mentioned, return only those found
"""


# ─────────────────────────────────────────────
#  PER-COUNTRY RESEARCH QUERY
# ─────────────────────────────────────────────

COUNTRY_RESEARCH_QUERY = """
What is the current import demand, volume, buyer count, peak procurement season,
primary sales channels, and certification requirements for {product_name} in {target_country}?
"""

# ─────────────────────────────────────────────
#  EXTRACTION PROMPT
# ─────────────────────────────────────────────

EXTRACTION_PROMPT = """
Extract structured market intelligence data from the research below.

Product: {product_name}
Country: {target_country}

Research text:
{sonar_response}

Return a JSON object with EXACTLY these fields:

{{
  "demand_growth": {{
    "value": "string or null — e.g. '+18%' or '-5%'",
    "period": "string or null — e.g. 'YoY'"
  }},
  "import_volume": {{
    "value": "string or null — numeric value e.g. '18400'",
    "unit": "string or null — 'MT' or 'USD million' etc",
    "year": integer or null
  }},
  "matched_buyers": {{
    "count": "string or null — e.g. '120+' or '40-60'"
  }},
  "peak_procurement": {{
    "period": "string or null — e.g. 'Oct - Jan' or 'Q4' or 'Q1 + Q3'"
  }},
  "primary_channel": {{
    "channel": "string or null — e.g. 'Contract manufacturers' or 'Online retail + distributors'"
  }},
  "cert_require": {{
    "certifications": ["array of required certification strings, empty if none found"] eg. ['GMP + USDA Organic' or 'GMP · Halal preferred']
  }},
  "cert_gap": {{
    "status": "string — 'None detected' or 'Gap detected'",
    "detail": "string or null — describe the gap opportunity if found"
  }},

}}

Rules:
- Set any field to null if the data is not in the research text
- Do not guess or hallucinate numbers
- Keep analysis_note factual and specific to the data found
"""

#   "analysis_note": "string — 2-3 sentence analyst summary of the opportunity"
# ─────────────────────────────────────────────
#  MARKET DEMAND MODULE
# ─────────────────────────────────────────────

class MarketDemandModule(BaseModule):
    """
    Module 1 — Market Demand Intelligence

    Orchestrates country discovery + per-country deep research.
    Returns list of ModuleResult — one per country that passes
    the minimum data threshold (≥ 4 of 7 fields populated).
    """

    MINIMUM_FIELDS_REQUIRED = 4
    TOTAL_FIELDS             = 7   # demand_growth, import_volume, matched_buyers,
                                   # peak_procurement, primary_channel,
                                   # cert_require, cert_gap

    def module_name(self) -> str:
        return "market_demand"

    def build_query(self, inp: ModuleInput) -> str:
        """Single-country research query."""
        return COUNTRY_RESEARCH_QUERY.format(
            product_name=inp.product_name,
            target_country=inp.target_country,
        ).strip()

    def build_extraction_prompt(self, inp: ModuleInput, sonar_response: str) -> str:
        # print(f"\n{'─'*50}")
        # print(f"  🌐 SONAR RESPONSE — {inp.target_country}")
        # print(f"{'─'*50}")
        # # print(sonar_response)
        # print(f"{'─'*50}\n")
        return EXTRACTION_PROMPT.format(
            product_name=inp.product_name,
            target_country=inp.target_country,
            sonar_response=sonar_response,
        ).strip()

    def empty_result(self) -> dict:
        return {
            "demand_growth":    None,
            "import_volume":    None,
            "matched_buyers":   None,
            "peak_procurement": None,
            "primary_channel":  None,
            "cert_require":     None,
            "cert_gap":         None,
            # "analysis_note":    None,
        }

    # ── Country discovery ────────────────────────────

    async def discover_countries(self, inp: ModuleInput) -> list[str]:
        """
        Step 1 — Find top target countries for this product.

        Makes one Sonar call with the country discovery prompt.
        Returns list of country name strings.
        Falls back to a default set if discovery fails.
        """
        print(f"\n  🌍 Discovering top markets for {inp.product_name}...")

        query = COUNTRY_DISCOVERY_PROMPT.format(
            product_name=inp.product_name,
        ).strip()

        sonar_response = await self._call_sonar_with_deflection_retry(query)
        # print(f"list of countries: {sonar_response}")

        if sonar_response is None:
            print("  ⚠️  Country discovery failed — using default markets")
            return _default_countries()

        # GPT extracts the country list from Sonar free-text
        extraction_prompt = COUNTRY_LIST_EXTRACTION_PROMPT.format(
            sonar_response=sonar_response,
        )
        extraction = await self._extract_structured(extraction_prompt)

        if extraction and isinstance(extraction.get("countries"), list):
            countries = [c for c in extraction["countries"] if isinstance(c, str)]
            if len(countries) < 5:
                print(f"  ⚠️  Only {len(countries)} countries found — padding with defaults")
                existing = set(c.lower() for c in countries)
                for c in _default_countries():
                    if c.lower() not in existing:
                        countries.append(c)
                    if len(countries) >= 9:
                        break
            print(f"  ✅ Discovered {len(countries)} markets: {', '.join(countries)}")
            return countries

        print("  ⚠️  Country list not parseable — using default markets")
        return _default_countries()

    # ── Country opportunity scoring ──────────────────

    async def _score_country(
        self,
        result: ModuleResult,
        inp:    ModuleInput,
    ) -> dict:
        """
        Calls GPT to score the market opportunity for one country.

        Uses extracted data + GPT's own knowledge of the market to produce:
            score        : int 0–100
            tier         : "Easy Win" | "Needs Work" | "Not Yet"
            tier_color   : "green" | "yellow" | "red"
            context_note : short 3–6 word summary shown under country name

        Stored back into result.data["country_score"] and returned.
        Falls back to a minimal default dict if GPT fails.
        """
        import json as _json

        prompt = f"""You are a market opportunity analyst.

Company origin  : {inp.origin_country}
Product         : {inp.product_name}
Business type   : {inp.business_type}
Certifications  : {inp.cert_string() or "none specified"}
Target market   : {result.target_country}

Extracted market intelligence for {result.target_country}:
{_json.dumps(result.data, indent=2)}

Using this data AND your knowledge of {result.target_country}'s import market for {inp.product_name},
evaluate the market opportunity score from 1–100:

  90–100 = Exceptional — very high demand, low barriers, strong buyer base
  75–89  = Easy Win    — clear opportunity, manageable entry requirements
  50–74  = Needs Work  — real potential but significant effort or time needed
  25–49  = Not Yet     — difficult market, poor timing, or weak fit right now
  0–24   = Avoid       — too competitive, wrong certifications, or negligible demand

Factors to weigh:
- Demand trajectory (growth rate, import volume trend)
- Buyer count and accessibility
- Certification match — do the company's certs satisfy this market?
- Competitive intensity and cert gaps in the market
- Ease of entry vs risk level

Return ONLY valid JSON:
{{
  "score":        82,
  "tier":         "Easy Win",
  "tier_color":   "green",
  "context_note": "3–6 word summary shown under country name in UI — e.g. '+18% YoY · high buyer density'",
}}

tier must be exactly one of: "Easy Win", "Needs Work", "Not Yet", "Avoid"
tier_color: "green" for Easy Win, "yellow" for Needs Work, "red" for Not Yet or Avoid"""

        data   = await self._extract_structured(prompt)
        scored = data or {}

        # Validate and clamp
        score = scored.get("score")
        if not isinstance(score, (int, float)):
            score = 50
        score = max(0, min(100, int(score)))

        tier = scored.get("tier") or ("Easy Win" if score >= 75 else "Needs Work" if score >= 50 else "Not Yet")
        color_map = {"Easy Win": "green", "Needs Work": "yellow", "Not Yet": "red", "Avoid": "red"}
        tier_color = scored.get("tier_color") or color_map.get(tier, "yellow")

        country_score = {
            "score":        score,
            "tier":         tier,
            "tier_color":   tier_color,
            "context_note": scored.get("context_note") or "",
            # "rationale":    scored.get("rationale") or "",
        }

        result.data["country_score"] = country_score
        print(f"     → {result.target_country}: {score}/100 — {tier}")
        return country_score

    # ── Full run — multiple countries ───────────────

    async def run_all_countries(
        self,
        base_inp: ModuleInput,
        countries: list[str] | None = None,
        concurrency: int = 2,
    ) -> list[ModuleResult]:
        """
        Runs market demand research for multiple countries in parallel.

        Args:
            base_inp:    ModuleInput with product + company data.
                         target_country will be overridden per country.
            countries:   List of countries to research.
                         If None, runs country discovery first.
            concurrency: Max parallel Sonar calls.

        Returns:
            List of ModuleResult — only countries with ≥ 4/7 fields.
        """
        # Step 1: discover countries if not provided
        if countries is None:
            countries = await self.discover_countries(base_inp)

        print(f"\n  📊 Researching {len(countries)} markets...")

        # Step 2: research each country in parallel
        semaphore = asyncio.Semaphore(concurrency)

        async def _run_one(country: str) -> ModuleResult:
            async with semaphore:
                country_inp = ModuleInput(
                    product_id=base_inp.product_id,
                    product_name=base_inp.product_name,
                    category=base_inp.category,
                    hs_code=base_inp.hs_code,
                    description=base_inp.description,
                    certifications=base_inp.certifications,
                    origin_country=base_inp.origin_country,
                    target_country=country,
                    company_name=base_inp.company_name,
                    business_type=base_inp.business_type,
                    price_positioning=base_inp.price_positioning,
                    moq=base_inp.moq,
                    buyer_type=base_inp.buyer_type,
                )
                result = await self.run(country_inp)
                if result.success:
                    await self._score_country(result, country_inp)
                return result

        tasks   = [_run_one(c) for c in countries]
        results = await asyncio.gather(*tasks)
        # print(results)

        # Step 3: filter — keep only countries with enough data
        qualified = [
            r for r in results
            if r.success and _count_populated_fields(r.data) >= self.MINIMUM_FIELDS_REQUIRED
        ]
        skipped = len(results) - len(qualified)

        print(f"\n  ✅ {len(qualified)} countries qualified "
              f"(≥{self.MINIMUM_FIELDS_REQUIRED}/7 fields)")
        if skipped:
            print(f"  ⏭  {skipped} countries skipped (insufficient data)")

        return qualified
    

    # ── DB row builder ───────────────────────────────

    @staticmethod
    def to_db_row(result: ModuleResult, product_id: str, inp: ModuleInput | None = None) -> dict:
        """
        Converts a ModuleResult into a dict ready for DB insertion.
        Maps to the market_intelligence table schema.

        Pass inp to populate hs_code and country score inline.

        Args:
            result:     ModuleResult from run()
            product_id: UUID of the product in product_master
            inp:        ModuleInput — used for hs_code (optional)
        """
        d       = result.data
        scored  = d.get("country_score") or {}   # set by _score_country in run_all_countries
        hs_code = (inp.hs_code if inp else None) or ""

        return {
            "product_id":       product_id,
            "country":          result.target_country,
            "country_and_score": {
                "country":      result.target_country,
                "score":        scored.get("score"),
                "tier":         scored.get("tier"),
                "tier_color":   scored.get("tier_color"),
                "context_note": scored.get("context_note") or "",
                # "rationale":    scored.get("rationale") or "",
                "hs_code":      hs_code,
            },
            "demand_growth":    d.get("demand_growth"),
            "import_volume":    d.get("import_volume"),
            "matched_buyers":   d.get("matched_buyers"),
            "peak_procurement": d.get("peak_procurement"),
            "primary_channel":  d.get("primary_channel"),
            "cert_require":     d.get("cert_require"),
            "cert_gap":         d.get("cert_gap"),
            "analysis_note":    d.get("analysis_note"),
        }


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _count_populated_fields(data: dict) -> int:
    """
    Counts how many of the 7 core fields have real data.
    Handles nested dicts — a field counts as populated if
    it's not None AND not an empty dict/list.
    """
    core_fields = [
        "demand_growth", "import_volume", "matched_buyers",
        "peak_procurement", "primary_channel", "cert_require", "cert_gap"
    ]
    count = 0
    for field in core_fields:
        value = data.get(field)
        if value is None:
            continue
        if isinstance(value, dict) and all(v is None for v in value.values()):
            continue
        if isinstance(value, list) and len(value) == 0:
            continue
        count += 1
    return count


def _default_countries() -> list[str]:
    """
    Fallback country list used when Sonar discovery fails.
    Based on the most common export markets for Indian manufacturers.
    """
    return [
        "United States",
        "Germany",
        "United Kingdom",
        "UAE",
        "Australia",
        "Canada",
        "Netherlands",
        "Japan",
        "India"
    ]