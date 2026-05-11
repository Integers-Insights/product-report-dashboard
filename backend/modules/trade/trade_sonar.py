"""
modules/trade/trade_sonar.py
-----------------------------
Sonar + GPT helper for trade intelligence.
Extends BaseModule so self._call_sonar_with_deflection_retry is available.

Used by TradeIntelModule — instantiate once and call the three methods:
    helper = TradeSonarHelper()
    overview      = await helper.fetch_global_overview(inp)
    country_data  = await helper.fetch_country_names(inp)
    pricing       = await helper.fetch_pricing_gpt(inp)
"""

import json
from modules.base_module import BaseModule, call_openai
from input_pipeline.config import LLM
from modules.trade.trade_prompts import (
    QUERY_GLOBAL_OVERVIEW,        EXTRACT_GLOBAL_OVERVIEW,
    QUERY_COUNTRY_NAMES,          EXTRACT_COUNTRY_NAMES,
    PRICING_GPT_PROMPT,
    GLOBAL_OVERVIEW_FALLBACK_PROMPT,
    COUNTRY_NAMES_FILL_PROMPT,
)


class TradeSonarHelper(BaseModule):
    """
    Sonar + GPT calls for the trade intelligence pipeline.
    Not a standalone module — called from TradeIntelModule.
    """

    def module_name(self) -> str:
        return "trade_intel"

    def _init_context(self, inp) -> None:
        """Set company/report context from inp before making any calls."""
        self._company_id = getattr(inp, "company_id", None)
        self._report_id  = getattr(inp, "report_id",  None)

    # ─────────────────────────────────────────────
    #  FETCH GLOBAL OVERVIEW
    # ─────────────────────────────────────────────

    async def fetch_global_overview(self, inp) -> dict:
        """
        Sonar (with deflection retry) → GPT extraction →
        GPT training fallback for any null fields.
        Returns: {global_trade_value, volume_traded_globally, avg_global_trade_price}
        """
        self._init_context(inp)
        hs   = inp.hs_code or "unknown"
        prod = inp.product_name

        query = QUERY_GLOBAL_OVERVIEW.format(product_name=prod, hs_code=hs).strip()
        sonar_text = await self._call_sonar_with_deflection_retry(query, "trade_global_overview")
        if not sonar_text:
            print("  ⚠️  [trade_sonar] Global overview — Sonar returned nothing")
            return {}

        prompt = EXTRACT_GLOBAL_OVERVIEW.format(
            product_name=prod,
            hs_code=hs,
            sonar_response=sonar_text,
        ).strip()

        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.0,
            call_type="trade_extract_overview",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            product_id=inp.product_id,
            response_format={"type": "json_object"},
        )

        try:
            data = json.loads(raw) if raw else {}
        except Exception:
            data = {}

        return await self._fill_overview_nulls(data, inp)

    @staticmethod
    def _is_empty(v) -> bool:
        """True if value is None, or a dict/list where every leaf is None."""
        if v is None:
            return True
        if isinstance(v, dict):
            return all(val is None for val in v.values())
        if isinstance(v, list):
            return len(v) == 0
        return False

    async def _fill_overview_nulls(self, data: dict, inp) -> dict:
        """GPT fills any null top-level fields using training knowledge."""
        FIELDS = {"global_trade_value", "volume_traded_globally", "avg_global_trade_price"}
        null_fields = [f for f in FIELDS if self._is_empty(data.get(f))]
        if not null_fields:
            return data

        print(f"     → [trade_sonar] GPT fill overview: {null_fields}")
        prompt = GLOBAL_OVERVIEW_FALLBACK_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            null_fields=", ".join(null_fields),
            current_data_json=json.dumps(data, indent=2),
        ).strip()

        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.0,
            call_type="trade_overview_fallback",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            product_id=inp.product_id,
            response_format={"type": "json_object"},
        )
        try:
            filled = json.loads(raw) if raw else {}
            for f in null_fields:
                if filled.get(f):
                    data[f] = filled[f]
        except Exception:
            pass
        return data

    # ─────────────────────────────────────────────
    #  FETCH COUNTRY NAMES
    # ─────────────────────────────────────────────

    async def fetch_country_names(self, inp) -> dict:
        """
        Sonar (with deflection retry) → GPT extraction →
        GPT fill if either list has fewer than 5 countries.
        Returns: {top_exporter_names, top_importer_names}
        (country_export_share removed — fetched via Comtrade instead)
        """
        self._init_context(inp)
        hs   = inp.hs_code or "unknown"
        prod = inp.product_name
        orig = inp.origin_country

        query = QUERY_COUNTRY_NAMES.format(
            product_name=prod,
            hs_code=hs,
            origin_country=orig,
        ).strip()
        sonar_text = await self._call_sonar_with_deflection_retry(query, "trade_country_names")
        if not sonar_text:
            print("  ⚠️  [trade_sonar] Country names — Sonar returned nothing")
            return {}

        prompt = EXTRACT_COUNTRY_NAMES.format(
            product_name=prod,
            hs_code=hs,
            origin_country=orig,
            sonar_response=sonar_text,
        ).strip()

        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.0,
            call_type="trade_extract_country_names",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            product_id=inp.product_id,
            response_format={"type": "json_object"},
        )

        try:
            data = json.loads(raw) if raw else {}
        except Exception:
            data = {}

        return await self._fill_country_names(data, inp)

    async def _fill_country_names(self, data: dict, inp) -> dict:
        """GPT tops up exporter/importer lists to 5 if Sonar returned fewer."""
        exporters = [c for c in (data.get("top_exporter_names") or []) if c and isinstance(c, str)]
        importers = [c for c in (data.get("top_importer_names") or []) if c and isinstance(c, str)]

        if len(exporters) >= 5 and len(importers) >= 5:
            return data

        print(f"     → [trade_sonar] GPT fill countries: exporters {len(exporters)}/5, importers {len(importers)}/5")
        prompt = COUNTRY_NAMES_FILL_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            exp_count=len(exporters),
            imp_count=len(importers),
            exporters_json=json.dumps(exporters),
            importers_json=json.dumps(importers),
        ).strip()

        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.0,
            call_type="trade_country_names_fill",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            product_id=inp.product_id,
            response_format={"type": "json_object"},
        )
        try:
            filled = json.loads(raw) if raw else {}
            data["top_exporter_names"] = filled.get("top_exporter_names", exporters)
            data["top_importer_names"] = filled.get("top_importer_names", importers)
        except Exception:
            pass
        return data

    # ─────────────────────────────────────────────
    #  FETCH PRICING (GPT ONLY)
    # ─────────────────────────────────────────────

    async def fetch_pricing_gpt(self, inp) -> dict:
        """
        GPT training knowledge only — no Sonar.
        Returns: {export_pricing_commod}
        """
        self._init_context(inp)

        prompt = PRICING_GPT_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            origin_country=inp.origin_country,
            business_type=getattr(inp, "business_type", "Exporter"),
            certifications=inp.cert_string() if hasattr(inp, "cert_string") else "",
            price_positioning=getattr(inp, "price_positioning", "standard"),
        ).strip()

        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.0,
            call_type="trade_pricing_gpt",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            product_id=inp.product_id,
            response_format={"type": "json_object"},
        )
        try:
            return json.loads(raw) if raw else {}
        except Exception:
            return {}
