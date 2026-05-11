"""
modules/base_module.py
-----------------------
Abstract base class for all 6 intelligence modules.

All modules share the same skeleton:
    1. Build a Sonar query from product + company inputs
    2. Call Perplexity Sonar for real-time research
    3. Call gpt-4o-mini to extract structured JSON from Sonar response
    4. Validate output
    5. Return structured result ready for DB save

Each module subclass only needs to define:
    - build_query()     → the Sonar search query
    - extract_prompt()  → the gpt-4o-mini extraction prompt
    - output_schema()   → expected JSON fields
    - db_table()        → which table to write to

Module 6 (Marketing Engine) overrides run() entirely since it
uses gpt-4o directly with no Sonar call.
"""

import json
import asyncio
from typing import Any
from openai import AsyncOpenAI
from dotenv import load_dotenv
import os

from input_pipeline.config import LLM, CACHE

load_dotenv()


# ─────────────────────────────────────────────
#  MODULE-LEVEL AI CLIENT CACHE
#  Shared by call_openai() and call_sonar() below.
#  BaseModule subclasses also use these via the helper functions.
# ─────────────────────────────────────────────

_module_openai_client: "AsyncOpenAI | None" = None
_module_sonar_client:  "AsyncOpenAI | None" = None


def _get_module_openai() -> AsyncOpenAI:
    global _module_openai_client
    if _module_openai_client is None:
        _module_openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _module_openai_client


def _get_module_sonar() -> AsyncOpenAI:
    global _module_sonar_client
    if _module_sonar_client is None:
        _module_sonar_client = AsyncOpenAI(
            api_key=os.getenv("PERPLEXITY_API_KEY"),
            base_url="https://api.perplexity.ai",
        )
    return _module_sonar_client


# ─────────────────────────────────────────────
#  AI COST TRACKING
# ─────────────────────────────────────────────

# (input_per_1M_usd, output_per_1M_usd, per_request_usd)
_MODEL_PRICING: dict[str, tuple[float, float, float]] = {
    "gpt-4o":          (2.50, 10.00, 0.0),
    "gpt-4o-mini":     (0.15,  0.60, 0.0),
    "sonar":           (1.00,  1.00, 0.005),   # Perplexity: $5 / 1000 requests + tokens
    "sonar-pro":       (3.00, 15.00, 0.005),
    "sonar-reasoning": (1.00,  5.00, 0.005),
}


async def _persist_usage(
    provider:          str,
    model:             str,
    call_type:         str,
    module:            "str | None",
    company_id:        "str | None",
    report_id:         "str | None",
    product_id:        "str | None",
    prompt_tokens:     int,
    completion_tokens: int,
) -> None:
    """Inserts one row into core_tables.ai_usage_log. Never raises."""
    rates    = _MODEL_PRICING.get(model, (1.0, 1.0, 0.0))
    cost_usd = (
        (prompt_tokens     / 1_000_000) * rates[0]
        + (completion_tokens / 1_000_000) * rates[1]
        + rates[2]
    )
    try:
        from db.database import get_pool, create_pool
        try:
            pool = get_pool()
        except RuntimeError:
            pool = await create_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO core_tables.ai_usage_log
                    (company_id, report_id, product_id, provider, model,
                     call_type, module, prompt_tokens, completion_tokens,
                     total_tokens, cost_usd)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
                """,
                company_id, report_id, product_id,
                provider, model, call_type, module,
                prompt_tokens, completion_tokens,
                prompt_tokens + completion_tokens,
                round(cost_usd, 8),
            )
    except Exception as e:
        print(f"  ⚠️  [cost_tracker] {e}")


# ─────────────────────────────────────────────
#  SHARED AI CALL FUNCTIONS
#  Single place for all OpenAI and Sonar calls.
#  Import call_openai / call_sonar in any module
#  instead of building a raw client there.
# ─────────────────────────────────────────────

async def call_openai(
    model:           str,
    messages:        list,
    max_tokens:      int,
    temperature:     float,
    call_type:       str,
    module:          "str | None"  = None,
    company_id:      "str | None"  = None,
    report_id:       "str | None"  = None,
    product_id:      "str | None"  = None,
    response_format: "dict | None" = None,
) -> "str | None":
    """
    Shared OpenAI call with retry logic and automatic cost logging.
    Import and use this instead of calling the OpenAI client directly.
    Returns the raw response string, or None on failure.
    """
    client = _get_module_openai()

    for attempt in range(LLM["max_retries"]):
        try:
            kwargs: dict[str, Any] = dict(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=messages,
            )
            if response_format:
                kwargs["response_format"] = response_format

            response = await client.chat.completions.create(**kwargs)
            usage    = response.usage

            asyncio.create_task(_persist_usage(
                "openai", model, call_type, module,
                company_id, report_id, product_id,
                usage.prompt_tokens, usage.completion_tokens,
            ))

            return response.choices[0].message.content

        except Exception as e:
            if attempt < LLM["max_retries"] - 1:
                wait = LLM["retry_delay_sec"] * (2 ** attempt)
                print(f"  ⚠️  [call_openai] attempt {attempt + 1} failed: {e}. Retry in {wait}s...")
                await asyncio.sleep(wait)
            else:
                print(f"  ❌ [call_openai] {model}/{call_type} failed after {LLM['max_retries']} attempts: {e}")
                return None


async def call_sonar(
    query:      str,
    call_type:  str        = "sonar_research",
    module:     "str | None" = None,
    company_id: "str | None" = None,
    report_id:  "str | None" = None,
    product_id: "str | None" = None,
) -> "str | None":
    """
    Shared Perplexity Sonar call with retry logic and automatic cost logging.
    Import and use this instead of calling the Sonar client directly.
    Respects the global _SONAR_SEMAPHORE to cap concurrent requests.
    Returns the raw response string, or None on failure.
    """
    client = _get_module_sonar()

    for attempt in range(LLM["max_retries"]):
        try:
            async with _SONAR_SEMAPHORE:
                response = await client.chat.completions.create(
                    model=LLM["sonar_model"],
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a trade research assistant. "
                                "Provide factual, data-rich responses with "
                                "specific numbers, statistics, and sources. "
                                "Focus on recent data (2023-2025)."
                            ),
                        },
                        {"role": "user", "content": query},
                    ],
                    max_tokens=2000,
                    temperature=0.2,
                )

            usage = response.usage
            asyncio.create_task(_persist_usage(
                "perplexity", LLM["sonar_model"], call_type, module,
                company_id, report_id, product_id,
                usage.prompt_tokens, usage.completion_tokens,
            ))

            return response.choices[0].message.content

        except Exception as e:
            is_rate_limit = "429" in str(e) or "rate_limit" in str(e).lower()
            if attempt < LLM["max_retries"] - 1:
                wait = (15 * (2 ** attempt)) if is_rate_limit else (LLM["retry_delay_sec"] * (2 ** attempt))
                print(f"  ⚠️  [call_sonar] attempt {attempt + 1} failed: {e}. Retry in {wait}s...")
                await asyncio.sleep(wait)
            else:
                print(f"  ❌ [call_sonar] failed after {LLM['max_retries']} attempts: {e}")
                return None


# ─────────────────────────────────────────────
#  MODULE INPUT
#  Standardised input passed to every module
# ─────────────────────────────────────────────

class ModuleInput:
    """
    Standardised input for all intelligence modules.
    Built from product_master + company_preference data.
    """
    def __init__(
        self,
        product_id:       str,
        product_name:     str,
        category:         str | None,
        hs_code:          str | None,
        description:      str | None,
        certifications:   list[str],
        origin_country:   str,          # where the company is based
        target_country:   list[str],          # which market to research
        company_name:     str | None,
        business_type:    str | None,   # Manufacturer / Exporter / Trader
        price_positioning: str | None,  # Budget / Mid-range / Premium
        moq:              str | None,
        buyer_type:       str | None,   # B2B / B2C / Both
        company_id:       str | None = None,   # SaaS: which company triggered this
        report_id:        str | None = None,   # SaaS: which report/job
    ):
        self.product_id        = product_id
        self.product_name      = product_name
        self.category          = category or "general"
        self.hs_code           = hs_code or ""
        self.description       = description or ""
        self.certifications    = certifications or []
        self.origin_country    = origin_country
        self.target_country    = target_country
        self.company_name      = company_name or ""
        self.business_type     = business_type or "Exporter"
        self.price_positioning = price_positioning or "Mid-range"
        self.moq               = moq or ""
        self.buyer_type        = buyer_type or "B2B"
        self.company_id        = company_id
        self.report_id         = report_id

    def cert_string(self) -> str:
        """Returns certifications as comma-separated string for use in queries."""
        return ", ".join(self.certifications) if self.certifications else "none"

    def __repr__(self):
        return (f"ModuleInput({self.product_name!r} → "
                f"{self.target_country!r})")


# ─────────────────────────────────────────────
#  MODULE RESULT
#  Standardised output from every module
# ─────────────────────────────────────────────

class ModuleResult:
    """
    Output from a module run.
    Contains structured data ready for DB insertion.
    """
    def __init__(
        self,
        product_id:    str,
        target_country: str,
        module_name:   str,
        data:          dict,            # structured extracted data
        raw_sonar:     str | None,      # raw Sonar response (for debugging)
        success:       bool,
        error:         str | None = None,
    ):
        self.product_id     = product_id
        self.target_country = target_country
        self.module_name    = module_name
        self.data           = data
        self.raw_sonar      = raw_sonar
        self.success        = success
        self.error          = error

    def field_count(self) -> int:
        """Returns how many of the 8 fields have real non-null, non-empty values."""
        core_fields = [
            "demand_growth", "import_volume", "matched_buyers",
            "peak_procurement", "primary_channel", "cert_require", "cert_gap",
            "analysis_note",
        ]
        count = 0
        for k in core_fields:
            v = self.data.get(k)
            if v is None:
                continue
            if isinstance(v, dict) and all(val is None for val in v.values()):
                continue
            if isinstance(v, list) and len(v) == 0:
                continue
            if isinstance(v, str) and not v.strip():
                continue
            count += 1
        return count


    
# ─────────────────────────────────────────────
#  BASE MODULE
# ─────────────────────────────────────────────
_SONAR_SEMAPHORE = asyncio.Semaphore(2)
class BaseModule:
    """
    Base class for all intelligence modules.

    Provides shared helpers: lazy API clients, Sonar call with retries,
    structured GPT extraction, and analyst note generation.

    Modules with a simple 1-Sonar + 1-extract flow should implement:
        module_name(), build_query(), build_extraction_prompt(), empty_result()
    and inherit run() unchanged.

    Modules with custom multi-step flows (buyer_discovery, variants, etc.)
    should extend BaseModule and override run() entirely — they still inherit
    all the helper methods for free.
    """

    def __init__(self):
        self._openai_client = None
        self._sonar_client  = None
        self._company_id: "str | None" = None
        self._report_id:  "str | None" = None

    def _get_openai(self) -> AsyncOpenAI:
        """Lazy OpenAI client — created on first use."""
        if self._openai_client is None:
            self._openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        return self._openai_client

    def _get_sonar(self) -> AsyncOpenAI:
        """Perplexity Sonar client (OpenAI-compatible SDK, different base_url)."""
        if self._sonar_client is None:
            self._sonar_client = AsyncOpenAI(
                api_key=os.getenv("PERPLEXITY_API_KEY"),
                base_url="https://api.perplexity.ai",
            )
        return self._sonar_client

    # ── Methods for simple-flow modules to implement ─────────────────────────

    def module_name(self) -> str:
        raise NotImplementedError

    def build_query(self, inp: ModuleInput) -> str:
        raise NotImplementedError

    def build_extraction_prompt(self, inp: ModuleInput, sonar_response: str) -> str:
        raise NotImplementedError

    def empty_result(self) -> dict:
        return {}

    # ── Main run method — shared by all modules ──

    async def run(self, inp: ModuleInput) -> ModuleResult:
        """
        Runs the full module pipeline:
            1. Call Sonar with the research query
            2. Extract structured JSON from the response
            3. Return ModuleResult

        Args:
            inp: ModuleInput with product + company + target country data

        Returns:
            ModuleResult — always returned, never raises
        """
        print(f"\n  🔬 [{self.module_name()}] {inp.product_name} → {inp.target_country}")

        # Capture SaaS context so helper calls can log it
        self._company_id = getattr(inp, "company_id", None)
        self._report_id  = getattr(inp, "report_id",  None)

        # ── Step 1: Sonar research query ─────────────
        query = self.build_query(inp)
        # print(f"     Query: {query[:150]}...")

        sonar_response = await self._call_sonar(query)
        # print(sonar_response)
        if sonar_response is None:
            print(f"  ❌ [{self.module_name()}] Sonar call failed")
            return ModuleResult(
                product_id=inp.product_id,
                target_country=inp.target_country,
                module_name=self.module_name(),
                data=self.empty_result(),
                raw_sonar=None,
                success=False,
                error="Sonar call failed after retries",
            )

        # ── Step 2: Extract structured data ──────────
        extraction_prompt = self.build_extraction_prompt(inp, sonar_response)
        structured_data   = await self._extract_structured(extraction_prompt)

        if structured_data is None:
            print(f"  ⚠️  [{self.module_name()}] Extraction failed — using empty result")
            return ModuleResult(
                product_id=inp.product_id,
                target_country=inp.target_country,
                module_name=self.module_name(),
                data=self.empty_result(),
                raw_sonar=sonar_response,
                success=False,
                error="Structured extraction failed",
            )
        # Generate analyst note separately using actual extracted data
        analysis_note = await self._generate_analyst_note(inp, structured_data)
        structured_data["analysis_note"] = analysis_note

        CORE_FIELDS = {
            "demand_growth", "import_volume", "matched_buyers",
            "peak_procurement", "primary_channel", "cert_require", "cert_gap"
        }
        field_count = sum(
            1 for k, v in structured_data.items()
            if k in CORE_FIELDS and v is not None
        )
        print(f"  ✅ [{self.module_name()}] {field_count} fields extracted")

        return ModuleResult(
            product_id=inp.product_id,
            target_country=inp.target_country,
            module_name=self.module_name(),
            data=structured_data,
            raw_sonar=sonar_response,
            success=True,
        )

    # ── Sonar deflection check ────────────────────────

    _DEFLECTION_PHRASES = [
        "do not include", "not available", "consult", "cannot provide",
        "no specific", "would need to", "unable to find", "not found in",
        "search results do not", "no data",
    ]

    def _sonar_deflected(self, text: str) -> bool:
        """
        Returns True if Sonar gave up instead of returning real data.
        Requires 2+ deflection phrases to avoid false positives.
        """
        lower = text.lower()
        return sum(1 for p in self._DEFLECTION_PHRASES if p in lower) >= 2

    async def _call_sonar_with_deflection_retry(
        self, query: str, label: str = ""
    ) -> str | None:
        """
        Calls Sonar and retries once with the same query if it deflects.
        Use this instead of _call_sonar when deflection is a concern.
        """
        text = await self._call_sonar(query)
        if text and self._sonar_deflected(text):
            tag = f"[{label}] " if label else ""
            print(f"  ⚠️  {tag}Sonar deflected — retrying...")
            text = await self._call_sonar(query)
        return text

    # ── Sonar call ───────────────────────────────────

    async def _call_sonar(self, query: str) -> str | None:
        """Thin wrapper — delegates to module-level call_sonar() with context."""
        return await call_sonar(
            query,
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
        )

    # ── Structured extraction ────────────────────────

    async def _extract_structured(self, prompt: str) -> dict | None:
        """Thin wrapper — delegates to module-level call_openai() with context."""
        system = (
            "You are a precise data extraction engine. "
            "Extract structured data from research text. "
            "Return ONLY valid JSON. No markdown, no explanation, no preamble. "
            "If a field cannot be found, set it to null."
        )
        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[
                {"role": "system", "content": system},
                {"role": "user",   "content": prompt},
            ],
            max_tokens=LLM["extraction_max_tokens"],
            temperature=0.0,
            call_type="extraction",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            response_format={"type": "json_object"},
        )
        if raw is None:
            return None
        try:
            return json.loads(raw)
        except json.JSONDecodeError as e:
            print(f"  ⚠️  JSON parse failed: {e}")
            return None
                
    # ─────────────────────────────────────────────
    #  ANALYSIS NOTES
    # ─────────────────────────────────────────────

    async def _generate_analyst_note(self, inp: ModuleInput, data: dict) -> str:
        """
        Generates a unique analyst note using GPT-4o.
        Called AFTER structured data is extracted.
        Uses actual extracted data as context — not the raw Sonar text.
        """
        prompt = f"""
    You are a senior export market analyst writing a brief insight for an Indian exporter.

    Product: {inp.product_name}
    Target market: {inp.target_country}
    Certifications: {inp.cert_string()}
    Business type: {inp.business_type}

    Extracted market data:
    - Demand growth: {data.get('demand_growth')}
    - Import volume: {data.get('import_volume')}
    - Matched buyers: {data.get('matched_buyers')}
    - Peak procurement: {data.get('peak_procurement')}
    - Primary channel: {data.get('primary_channel')}
    - Cert requirement: {data.get('cert_require')}
    - Cert gap: {data.get('cert_gap')}

    Write 2-3 sentences that:
    1. Lead with the single most compelling data point specific to THIS market
    2. Explain what it means practically for THIS exporter
    3. End with one specific, actionable insight (timing, channel, cert, or positioning)

    Do NOT start with "The [product] market in [country]". 
    Be direct, specific, and different from generic market summaries.
    Return only the analyst note text — no labels, no JSON.
    """.strip()

        raw = await call_openai(
            model=LLM["generation_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.7,
            call_type="analyst_note",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            product_id=inp.product_id,
        )
        return raw.strip() if raw else ""