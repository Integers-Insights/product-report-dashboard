"""
modules/trade/trade_intel.py
-----------------------------
Module 4 — Trade Intelligence (orchestrator)

Pipeline:
    Stage 1 (parallel)
        a. Sonar → global trade value, volume, avg price + YoY
        b. Sonar → top exporter/importer country NAMES + origin share %
        c. GPT   → commodity vs certified FOB pricing

    Stage 2 (sequential — Comtrade rate-limited at 1.2s/call)
        d. Comtrade → value + volume for each top exporter
        e. Comtrade → value + volume for each top importer
        f. Comtrade → 5-year export trend for origin country

    Stage 3 (parallel)
        g. GPT → structure Comtrade trader data into display strings
        h. GPT → structure Comtrade trend data + add year labels

    Stage 4
        i. GPT → analyst note

Sonar functions  → trade_sonar.py
Comtrade client  → trade_comtrade.py
All prompts      → trade_prompts.py
"""

import json
import asyncio
from modules.base_module import BaseModule, ModuleInput, ModuleResult, call_openai
from input_pipeline.config import LLM

from modules.trade.trade_sonar import TradeSonarHelper
from modules.trade.trade_comtrade import fetch_traders, fetch_origin_trend, fetch_origin_export_share
from modules.trade.trade_prompts import (
    STRUCTURE_TRADERS_PROMPT,
    STRUCTURE_TREND_PROMPT,
    TRADE_ANALYST_NOTE_PROMPT,
)

COMTRADE_YEAR = "2023"
TREND_YEARS   = [2019, 2020, 2021, 2022, 2023, 2024]  # 2019 is base year for 2020 YoY


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
            "analysis_note":          None,
        }

    # ─────────────────────────────────────────────
    #  MAIN RUN
    # ─────────────────────────────────────────────

    async def run(self, inp: ModuleInput) -> ModuleResult:
        print(f"\n  🔬 [trade_intel] {inp.product_name} ({inp.origin_country})")

        self._company_id = getattr(inp, "company_id", None)
        self._report_id  = getattr(inp, "report_id",  None)
        hs   = inp.hs_code or "unknown"
        orig = inp.origin_country

        # ── Stage 1: Sonar + GPT pricing in parallel ─────────────────────────
        sonar = TradeSonarHelper()
        overview, country_data, pricing = await asyncio.gather(
            sonar.fetch_global_overview(inp),
            sonar.fetch_country_names(inp),
            sonar.fetch_pricing_gpt(inp),
        )

        exporter_names = (country_data.get("top_exporter_names") or [])[:5]
        importer_names = (country_data.get("top_importer_names") or [])[:5]

        print(f"     → Sonar: {len(exporter_names)} exporters, {len(importer_names)} importers identified")

        # ── Stage 2: Comtrade (sequential — rate-limited) ────────────────────
        raw_exporters = []
        raw_importers = []
        raw_trend     = []

        if exporter_names:
            print(f"     → Comtrade: fetching {len(exporter_names)} exporters...")
            raw_exporters = await fetch_traders(hs, exporter_names, "X", COMTRADE_YEAR)

        if importer_names:
            print(f"     → Comtrade: fetching {len(importer_names)} importers...")
            raw_importers = await fetch_traders(hs, importer_names, "M", COMTRADE_YEAR)

        print(f"     → Comtrade: fetching {len(TREND_YEARS)}-year trend for {orig}...")
        raw_trend = await fetch_origin_trend(hs, orig, TREND_YEARS)

        target_list = inp.target_country if inp.target_country else None
        print(f"     → Comtrade: fetching export share for {orig} in target markets...")
        raw_export_share = await fetch_origin_export_share(hs, orig, target_list, COMTRADE_YEAR)

        # ── Stage 3: GPT structuring in parallel ─────────────────────────────
        # Drop the 2019 base entry — it was only needed to compute 2020 YoY
        display_trend = raw_trend[1:] if len(raw_trend) == len(TREND_YEARS) else raw_trend

        structured_traders, structured_trend = await asyncio.gather(
            self._structure_traders(raw_exporters, raw_importers, inp),
            self._structure_trend(display_trend, inp),
        )

        # ── Merge all sections ────────────────────────────────────────────────
        merged = {
            "global_trade_value":     overview.get("global_trade_value"),
            "volume_traded_globally": overview.get("volume_traded_globally"),
            "avg_global_trade_price": overview.get("avg_global_trade_price"),
            "country_export_share":   raw_export_share or None,
            "top_exporters":          structured_traders.get("top_exporters"),
            "top_importers":          structured_traders.get("top_importers"),
            "export_volume_trend":    structured_trend.get("export_volume_trend"),
            "export_pricing_commod":  pricing.get("export_pricing_commod"),
        }

        filled = sum(1 for v in merged.values() if v is not None)
        print(f"  ✅ [trade_intel] {filled}/8 sections populated")

        # ── Stage 4: Analyst note ─────────────────────────────────────────────
        merged["analysis_note"] = await self._generate_trade_note(inp, merged)

        return ModuleResult(
            product_id=inp.product_id,
            target_country=orig,
            module_name=self.module_name(),
            data=merged,
            raw_sonar=None,
            success=True,
        )

    # ─────────────────────────────────────────────
    #  GPT STRUCTURE — Traders
    # ─────────────────────────────────────────────

    async def _structure_traders(
        self,
        raw_exporters: list,
        raw_importers: list,
        inp: ModuleInput,
    ) -> dict:
        """GPT formats raw Comtrade trader dicts into display strings."""
        if not raw_exporters and not raw_importers:
            return {}

        prompt = STRUCTURE_TRADERS_PROMPT.format(
            product_name=inp.product_name,
            hs_code=inp.hs_code or "unknown",
            year=COMTRADE_YEAR,
            exporters_json=json.dumps(raw_exporters, indent=2),
            importers_json=json.dumps(raw_importers, indent=2),
        ).strip()

        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600,
            temperature=0.0,
            call_type="trade_structure_traders",
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

    # ─────────────────────────────────────────────
    #  GPT STRUCTURE — Origin Trend
    # ─────────────────────────────────────────────

    async def _structure_trend(self, raw_trend: list, inp: ModuleInput) -> dict:
        """GPT formats raw Comtrade trend entries and adds year labels."""
        if not raw_trend:
            return {}

        prompt = STRUCTURE_TREND_PROMPT.format(
            product_name=inp.product_name,
            origin_country=inp.origin_country,
            trend_json=json.dumps(raw_trend, indent=2),
        ).strip()

        raw = await call_openai(
            model=LLM["extraction_model"],
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.0,
            call_type="trade_structure_trend",
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

    # ─────────────────────────────────────────────
    #  ANALYST NOTE
    # ─────────────────────────────────────────────

    async def _generate_trade_note(self, inp: ModuleInput, data: dict) -> str:
        gtv   = data.get("global_trade_value")    or {}
        share = data.get("country_export_share")  or {}
        trend = data.get("export_volume_trend")   or []
        price = data.get("export_pricing_commod") or {}

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
