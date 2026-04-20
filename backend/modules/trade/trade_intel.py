"""
modules/trade/trade_intel.py
-----------------------------
Module 4 — Trade Intelligence

Pipeline:
    1. 4 Sonar queries in parallel (global overview, country shares, trend, pricing)
    2. 4 paired extractions in parallel → merge into one dict
    3. GPT fallback 1 — fills top-level null fields (scalars + objects)
    4. GPT fallback 2 — fills null volume/share within country lists
    5. GPT fallback 3 — fills null volume_mt within export trend entries
    6. Analyst note generation

All prompt strings live in trade_prompts.py.
DB table: product_info.trade_intelligence — one row per product.
"""

import json
import asyncio
from modules.base_module import BaseModule, ModuleInput, ModuleResult, call_openai, call_sonar
from input_pipeline.config import LLM

from modules.trade.trade_prompts import (
    QUERY_GLOBAL_OVERVIEW,          EXTRACT_GLOBAL_OVERVIEW,
    QUERY_COUNTRY_SHARES,           EXTRACT_COUNTRY_SHARES,
    QUERY_ORIGIN_TREND,             EXTRACT_ORIGIN_TREND,
    QUERY_PRICING,                  EXTRACT_PRICING,
    TRADE_FALLBACK_PROMPT,
    COUNTRY_METRICS_FALLBACK_PROMPT,
    TREND_GAPS_FALLBACK_PROMPT,
    TRADE_ANALYST_NOTE_PROMPT,
)


class TradeIntelModule(BaseModule):
    """Module 4 — Trade Intelligence."""

    def module_name(self) -> str:
        return "trade_intel"

    def empty_result(self) -> dict:
        return {
            "global_trade_value":     None,
            "volume_traded_globally": None,
            "avg_global_trade_price": None,
            "country_export_share":   None,
            "top_exporters":          None,
            "top_importers":          None,
            "export_volume_trend":    None,
            "export_pricing_commod":  None,
        }

    # ─────────────────────────────────────────────
    #  MAIN RUN
    # ─────────────────────────────────────────────

    async def run(self, inp: ModuleInput) -> ModuleResult:
        print(f"\n  🔬 [trade_intel] {inp.product_name} ({inp.origin_country})")

        self._company_id = getattr(inp, "company_id", None)
        self._report_id  = getattr(inp, "report_id",  None)

        hs   = inp.hs_code or "unknown"
        prod = inp.product_name
        orig = inp.origin_country

        # ── Step 1: 4 Sonar queries in parallel ──────────────────────────────
        q1 = QUERY_GLOBAL_OVERVIEW.format(product_name=prod, hs_code=hs).strip()
        q2 = QUERY_COUNTRY_SHARES.format(product_name=prod, hs_code=hs, origin_country=orig).strip()
        q3 = QUERY_ORIGIN_TREND.format(product_name=prod, hs_code=hs, origin_country=orig).strip()
        q4 = QUERY_PRICING.format(product_name=prod, hs_code=hs, origin_country=orig).strip()

        s1, s2, s3, s4 = await asyncio.gather(
            call_sonar(q1, call_type="trade_global_overview", module=self.module_name(), company_id=self._company_id, report_id=self._report_id, product_id=inp.product_id),
            call_sonar(q2, call_type="trade_country_shares",  module=self.module_name(), company_id=self._company_id, report_id=self._report_id, product_id=inp.product_id),
            call_sonar(q3, call_type="trade_origin_trend",    module=self.module_name(), company_id=self._company_id, report_id=self._report_id, product_id=inp.product_id),
            call_sonar(q4, call_type="trade_pricing",         module=self.module_name(), company_id=self._company_id, report_id=self._report_id, product_id=inp.product_id),
        )

        if all(r is None for r in (s1, s2, s3, s4)):
            print("  ❌ [trade_intel] All Sonar calls failed")
            return ModuleResult(
                product_id=inp.product_id,
                target_country=orig,
                module_name=self.module_name(),
                data=self.empty_result(),
                raw_sonar=None,
                success=False,
                error="All Sonar calls failed",
            )

        # ── Step 2: 4 extractions in parallel ────────────────────────────────
        e1 = EXTRACT_GLOBAL_OVERVIEW.format(product_name=prod, hs_code=hs,    sonar_response=s1 or "").strip()
        e2 = EXTRACT_COUNTRY_SHARES.format(product_name=prod,  origin_country=orig, sonar_response=s2 or "").strip()
        e3 = EXTRACT_ORIGIN_TREND.format(product_name=prod,    origin_country=orig, sonar_response=s3 or "").strip()
        e4 = EXTRACT_PRICING.format(product_name=prod,         origin_country=orig, sonar_response=s4 or "").strip()

        r1, r2, r3, r4 = await asyncio.gather(
            self._extract_structured(e1),
            self._extract_structured(e2),
            self._extract_structured(e3),
            self._extract_structured(e4),
        )

        # ── Step 3: Merge sections ────────────────────────────────────────────
        merged: dict = self.empty_result()

        if r1:
            merged["global_trade_value"]     = r1.get("global_trade_value")
            merged["volume_traded_globally"] = r1.get("volume_traded_globally")
            merged["avg_global_trade_price"] = r1.get("avg_global_trade_price")
        if r2:
            merged["country_export_share"] = r2.get("country_export_share")
            merged["top_exporters"]        = r2.get("top_exporters")
            merged["top_importers"]        = r2.get("top_importers")
        if r3:
            merged["export_volume_trend"]  = r3.get("export_volume_trend")
        if r4:
            merged["export_pricing_commod"] = r4.get("export_pricing_commod")

        sonar_count = sum(1 for v in merged.values() if v is not None)
        print(f"  ✅ [trade_intel] {sonar_count}/8 sections extracted from Sonar")

        # ── Step 4: GPT fallbacks ─────────────────────────────────────────────
        merged = await self._gpt_fill_top_level(merged, inp)
        merged = await self._gpt_fill_country_metrics(merged, inp)
        merged = await self._gpt_fill_trend_gaps(merged, inp)

        # ── Step 5: Analyst note ──────────────────────────────────────────────
        merged["analysis_note"] = await self._generate_trade_note(inp, merged)

        return ModuleResult(
            product_id=inp.product_id,
            target_country=orig,
            module_name=self.module_name(),
            data=merged,
            raw_sonar="\n\n---\n\n".join(filter(None, [s1, s2, s3, s4])),
            success=True,
        )

    # ─────────────────────────────────────────────
    #  HELPERS
    # ─────────────────────────────────────────────

    @staticmethod
    def _is_null(v) -> bool:
        if v is None:
            return True
        if isinstance(v, list) and len(v) == 0:
            return True
        if isinstance(v, dict) and all(val is None for val in v.values()):
            return True
        return False

    async def _gpt_call(self, prompt: str, call_type: str, max_tokens: int, product_id: str) -> "dict | None":
        """Shared GPT JSON call used by all three fallback methods."""
        try:
            raw = await call_openai(
                model=LLM["extraction_model"],
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=0.0,
                call_type=call_type,
                module=self.module_name(),
                company_id=self._company_id,
                report_id=self._report_id,
                product_id=product_id,
                response_format={"type": "json_object"},
            )
            return json.loads(raw) if raw else None
        except Exception as e:
            print(f"  ⚠️  [trade_intel] {call_type} failed: {e}")
            return None

    # ─────────────────────────────────────────────
    #  GPT FALLBACK 1 — Top-level null fields
    # ─────────────────────────────────────────────

    _TOP_LEVEL_FILLABLE = {
        "global_trade_value", "volume_traded_globally", "avg_global_trade_price",
        "country_export_share", "export_volume_trend", "export_pricing_commod",
    }

    async def _gpt_fill_top_level(self, data: dict, inp: ModuleInput) -> dict:
        null_fields = [f for f in self._TOP_LEVEL_FILLABLE if self._is_null(data.get(f))]
        if not null_fields:
            return data

        print(f"     → [trade_intel] GPT fallback 1: filling {null_fields}")

        prompt = TRADE_FALLBACK_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            origin_country=inp.origin_country,
            null_fields=", ".join(null_fields),
            current_data_json=json.dumps(data, indent=2),
        )

        filled = await self._gpt_call(prompt, "trade_fallback_top_level", 1400, inp.product_id)
        if not filled:
            return data

        merged = dict(data)
        for field in null_fields:
            if filled.get(field) and not self._is_null(filled[field]):
                merged[field] = filled[field]

        filled_fields = [f for f in null_fields if not self._is_null(merged.get(f))]
        print(f"     → [trade_intel] GPT fallback 1 filled: {filled_fields}")
        return merged

    # ─────────────────────────────────────────────
    #  GPT FALLBACK 2 — Country metric gaps
    # ─────────────────────────────────────────────

    async def _gpt_fill_country_metrics(self, data: dict, inp: ModuleInput) -> dict:
        exporters = data.get("top_exporters") or []
        importers = data.get("top_importers") or []

        exp_gaps = [e["country"] for e in exporters if isinstance(e, dict) and (e.get("trad_value") is None or e.get("share_pct") is None)]
        imp_gaps = [e["country"] for e in importers if isinstance(e, dict) and (e.get("volume_mt") is None or e.get("yoy_growth") is None)]

        if not exp_gaps and not imp_gaps:
            return data

        print(f"     → [trade_intel] GPT fallback 2: exporters {exp_gaps}, importers {imp_gaps}")

        prompt = COUNTRY_METRICS_FALLBACK_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            exporters_json=json.dumps(exporters, indent=2),
            importers_json=json.dumps(importers, indent=2),
        )

        filled = await self._gpt_call(prompt, "trade_fallback_country_metrics", 800, inp.product_id)
        if not filled:
            return data

        merged = dict(data)
        if filled.get("top_exporters") and len(filled["top_exporters"]) == len(exporters):
            merged["top_exporters"] = filled["top_exporters"]
        if filled.get("top_importers") and len(filled["top_importers"]) == len(importers):
            merged["top_importers"] = filled["top_importers"]
        return merged

    # ─────────────────────────────────────────────
    #  GPT FALLBACK 3 — Export volume trend gaps
    # ─────────────────────────────────────────────

    async def _gpt_fill_trend_gaps(self, data: dict, inp: ModuleInput) -> dict:
        trend = data.get("export_volume_trend") or []
        gap_years = [e["year"] for e in trend if isinstance(e, dict) and e.get("volume_mt") is None]

        if not gap_years:
            return data

        print(f"     → [trade_intel] GPT fallback 3: filling volume_mt for years {gap_years}")

        prompt = TREND_GAPS_FALLBACK_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            origin_country=inp.origin_country,
            trend_json=json.dumps(trend, indent=2),
        )

        filled = await self._gpt_call(prompt, "trade_fallback_trend_gaps", 400, inp.product_id)
        if not filled:
            return data

        new_trend = filled.get("export_volume_trend")
        if new_trend and len(new_trend) == len(trend):
            data = dict(data)
            data["export_volume_trend"] = new_trend
        return data

    # ─────────────────────────────────────────────
    #  ANALYST NOTE
    # ─────────────────────────────────────────────

    async def _generate_trade_note(self, inp: ModuleInput, data: dict) -> str:
        gtv   = data.get("global_trade_value")     or {}
        share = data.get("country_export_share")   or {}
        trend = data.get("export_volume_trend")    or []
        price = data.get("export_pricing_commod")  or {}

        prompt = TRADE_ANALYST_NOTE_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            origin_country=inp.origin_country,
            certifications=inp.cert_string(),
            global_trade_value_usd=gtv.get("value_usd"),
            global_trade_value_yoy=gtv.get("yoy_growth"),
            export_share_pct=share.get("share_pct"),
            export_share_trend=share.get("trend"),
            latest_trend_entry=trend[-1] if trend else "N/A",
            commodity_price=(price.get("commodity") or {}).get("price_range"),
            certified_price=(price.get("certified")  or {}).get("price_range"),
        )

        raw = await call_openai(
            model=LLM["generation_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.7,
            call_type="trade_analyst_note",
            module=self.module_name(),
            company_id=self._company_id,
            report_id=self._report_id,
            product_id=inp.product_id,
        )
        return raw.strip() if raw else ""

    # ─────────────────────────────────────────────
    #  DB ROW BUILDER
    # ─────────────────────────────────────────────

    @staticmethod
    def to_db_row(result: ModuleResult, product_id: str, inp: ModuleInput) -> dict:
        d = result.data
        return {
            "product_id":             product_id,
            "hs_code":                inp.hs_code or "",
            "origin_country":         inp.origin_country,
            "global_trade_value":     d.get("global_trade_value"),
            "volume_traded_globally": d.get("volume_traded_globally"),
            "avg_global_trade_price": d.get("avg_global_trade_price"),
            "country_export_share":   d.get("country_export_share"),
            "top_exporters":          d.get("top_exporters"),
            "top_importers":          d.get("top_importers"),
            "export_volume_trend":    d.get("export_volume_trend"),
            "export_pricing_commod":  d.get("export_pricing_commod"),
            "analysis_note":          d.get("analysis_note"),
        }
