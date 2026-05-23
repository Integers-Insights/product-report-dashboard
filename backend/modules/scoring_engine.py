"""
modules/scoring_engine.py
--------------------------
Scoring Engine — Opportunity Summary

Runs after all intelligence modules complete.
One GPT-4o-mini call scores all 6 dimensions + writes
the urgent opportunity note + 3 action cards.

6 Score dimensions:
  1. market_demand       — from market_demand module
  2. variants_formats    — from variants_formats module
  3. competition         — from competitor_discovery module
  4. trade_activity      — from trade_intel module
  5. price_fit           — from price_analysis module
  6. buyer_availability  — from buyer_discovery module

Output:
  overall_score    : int 0–100
  scores           : dict of 6 × {score, label, sublabel}
  urgent_note      : string — the highlighted opportunity text
  action_cards     : list of 3 × {timing, title, body}

Integration: called at end of module_runner.run_all()
No new API keys needed — uses existing OpenAI client.
"""

import json
import re
from dataclasses import dataclass, field
from typing import Optional
from modules.scoring_prompts import SCORING_PROMPT
from modules.base_module import call_openai

# Weights must sum to 1.0
_WEIGHTS: dict[str, float] = {
    "market_demand":    0.20,
    "trade_activity":   0.20,
    "price_fit":        0.15,
    "buyer_availability": 0.15,
    "variants_formats": 0.15,
    "competition":      0.15,
}

def _compute_overall(scores: list) -> int:
    """Weighted average of dimension scores (1–10) scaled to 0–100."""
    total = sum(
        s.score * _WEIGHTS.get(s.dimension, 0)
        for s in scores
    )
    return round(total * 10)


# ─────────────────────────────────────────────
#  DATA MODELS
# ─────────────────────────────────────────────

@dataclass
class ScoreCard:
    dimension:  str            # e.g. "market_demand"
    label:      str            # e.g. "MARKET DEMAND"
    score:      int            # 1–10
    sublabel:   str            # e.g. "+18% YoY · Anti-inflammatory trend"
    color:      str            # "green" | "yellow" | "red" — UI hint


@dataclass
class ActionCard:
    timing:  str   # "Do now" | "This month" | "This quarter"
    title:   str   # short bold label
    body:    str   # 2-3 sentence action description


@dataclass
class ScoringResult:
    success:       bool
    product_id:    str
    overall_score: Optional[int]             = None   # 0–100
    scores:        list[ScoreCard]           = field(default_factory=list)
    urgent_note:   Optional[str]             = None
    action_cards:  list[ActionCard]          = field(default_factory=list)
    error:         Optional[str]             = None

    def to_db_row(self) -> dict:
        return {
            "product_id":    self.product_id,
            "overall_score": self.overall_score,
            "scores": [
                {
                    "dimension": s.dimension,
                    "label":     s.label,
                    "score":     s.score,
                    "sublabel":  s.sublabel,
                    "color":     s.color,
                }
                for s in self.scores
            ],
            "urgent_note": self.urgent_note,
            "action_cards": [
                {
                    "timing": a.timing,
                    "title":  a.title,
                    "body":   a.body,
                }
                for a in self.action_cards
            ],
        }

# ─────────────────────────────────────────────
#  MODULE SUMMARISER
#  Condenses each module result into a compact text block
#  so the GPT prompt stays within token limits.
# ─────────────────────────────────────────────

def _summarise_modules(runner_result) -> str:
    """
    Extracts the most scoring-relevant fields from each module result.
    Returns a compact multi-section string for the GPT prompt.
    """
    lines = []

    def _section(title: str, content: str):
        lines.append(f"\n[{title}]\n{content}")

    # ── market_demand ────────────────────────────────────────────────────────
    md_list = runner_result.market_demand
    if md_list and isinstance(md_list, list):
        qualified = [r for r in md_list if r and r.success and r.data]
        if qualified:
            parts = []
            for r in qualified[:3]:  # summarise up to 3 countries for scoring context
                d = r.data
                country = r.target_country
                row = [f"[{country}]"]
                if d.get("demand_growth"):
                    dg = d["demand_growth"]
                    row.append(f"Growth: {dg.get('value','?')} ({dg.get('period','')})")
                if d.get("import_volume"):
                    iv = d["import_volume"]
                    row.append(f"Import vol: {iv.get('value','?')} {iv.get('unit','')}")
                if d.get("cert_gap"):
                    row.append(f"Cert gap: {d['cert_gap'].get('detail','')}")
                if d.get("matched_buyers"):
                    row.append(f"Buyers: {d['matched_buyers'].get('count','?')}")
                parts.append(" | ".join(row))
            _section("MARKET DEMAND", "\n".join(parts))
        else:
            _section("MARKET DEMAND", "Module failed or no data")
    else:
        _section("MARKET DEMAND", "Module failed or no data")

    # ── variants_formats ─────────────────────────────────────────────────────
    vf = runner_result.variants_formats
    if vf and vf.success:
        gap_variants     = [v for v in vf.variants if v.tag == "gap"]
        emerging         = [v for v in vf.variants if v.tag == "emerging"]
        top_opp          = sorted(vf.variants, key=lambda v: v.opportunity_score or 0, reverse=True)[:3]
        parts = [
            f"Total variants: {len(vf.variants)}",
            f"Gap variants: {len(gap_variants)} ({', '.join(v.variant_name for v in gap_variants)})",
            f"Emerging: {len(emerging)}",
            f"Top opportunities: {', '.join(f'{v.variant_name} ({v.opportunity_score}/10)' for v in top_opp)}",
        ]
        _section("VARIANTS & FORMATS", "\n".join(parts))
    else:
        _section("VARIANTS & FORMATS", "Module failed or no data")

    # ── competitor_discovery ─────────────────────────────────────────────────
    cd = runner_result.competitor_discovery
    if cd and cd.success:
        parts = [
            f"Competitors found: {cd.count()} (fallback: {cd.is_fallback()})",
            f"Countries: {', '.join(set(c.origin_country for c in cd.competitors if c.origin_country))}",
        ]
        # Top 3 competitor notes
        for c in cd.competitors[:3]:
            if c.notes:
                parts.append(f"- {c.name} ({c.origin_country}): {c.notes}")
        _section("COMPETITION", "\n".join(parts))
    else:
        _section("COMPETITION", "Module failed or no data")

    # ── trade_intel ──────────────────────────────────────────────────────────
    ti = runner_result.trade_intel
    if ti and ti.success and ti.data:
        d = ti.data
        parts = []
        if d.get("global_trade_value"):
            gtv = d["global_trade_value"]
            parts.append(f"Global trade value: {gtv.get('value_usd','?')} YoY: {gtv.get('yoy_growth','?')}")
        if d.get("country_export_share"):
            es = d["country_export_share"]
            parts.append(f"Export share: {es.get('country','India')} {es.get('share_pct','?')} ({es.get('trend','')})")
        if d.get("volume_traded_globally"):
            vt = d["volume_traded_globally"]
            parts.append(f"Volume: {vt.get('value_mt','?')} MT")
        _section("TRADE ACTIVITY", "\n".join(parts) or "No data")
    else:
        _section("TRADE ACTIVITY", "Module failed or no data")

    # ── price_analysis ───────────────────────────────────────────────────────
    pa = runner_result.price_analysis if hasattr(runner_result, "price_analysis") else None
    if pa and pa.success and pa.top_metrics:
        t = pa.top_metrics
        parts = [
            f"Market range: {t.market_range or '?'} ({t.market_range_label or ''})",
            f"Gross margin: {t.gross_margin or '?'} ({t.gross_margin_label or ''})",
            f"Cert premium: {t.cert_premium_overall or '?'} ({t.cert_premium_label or ''})",
        ]
        if pa.variant_table:
            for row in pa.variant_table[:3]:
                parts.append(f"- {row.variant_name}: {row.market_price or '?'} margin {row.margin_est or '?'} → {row.position or '?'}")
        _section("PRICE FIT", "\n".join(parts))
    else:
        # Fallback: derive from variants price_range if price_analysis not run
        if vf and vf.success and vf.variants:
            prices = [v.price_range for v in vf.variants if v.price_range]
            _section("PRICE FIT", f"Price ranges from variants: {', '.join(prices[:3])}" if prices else "No price data")
        else:
            _section("PRICE FIT", "Module not run or no data")

  # ── buyer_discovery ──────────────────────────────────────────────────────
    bd = runner_result.buyer_discovery  # CombinedBuyerResult
    if bd and bd.success:
        parts = []
        # B2B buyers summary
        if bd.b2b and bd.b2b.success:
            b2b = bd.b2b
            parts.append(f"B2B buyers found: {b2b.count()} in {b2b.target_country}")
            parts.append(f"Fallback mode: {b2b.is_fallback()}")
            for b in b2b.buyers[:3]:
                if b.notes:
                    parts.append(f"- {b.name} ({b.buyer_type or '?'}): {b.notes}")
        # B2C consumer profile summary
        if bd.b2c and bd.b2c.success and bd.b2c.consumer_profile:
            p = bd.b2c.consumer_profile
            parts.append(f"B2C consumer: {p.consumer_segment.age_group or '—'}")
            if p.consumer_segment.purchase_motivation:
                parts.append(f"Motivations: {', '.join(p.consumer_segment.purchase_motivation[:3])}")
            if p.market_gap:
                parts.append(f"Market gap: {p.market_gap[:200]}")
        _section("BUYER AVAILABILITY", "\n".join(parts) if parts else "No buyer data")
    else:
        _section("BUYER AVAILABILITY", "Module failed or no data")
 
    return "\n".join(lines)

# ─────────────────────────────────────────────
#  SCORING ENGINE
# ─────────────────────────────────────────────

class ScoringEngine:
    """
    Scores all 6 dimensions from module results using GPT-4o-mini.
    Called at the end of ModuleRunner.run_all().

    Usage:
        engine = ScoringEngine()
        scoring_result = await engine.score(inp, runner_result)
    """

    async def score(self, inp, runner_result) -> ScoringResult:
        """
        Score all modules and generate opportunity summary.

        Args:
            inp           : ModuleInput
            runner_result : RunnerResult from ModuleRunner.run_all()
        Returns:
            ScoringResult with 6 scores + overall + action cards
        """
        print(f"\n  🏆 [scoring_engine] {inp.product_name}")

        # Summarise module outputs into compact text
        module_summary = _summarise_modules(runner_result)

        prompt = SCORING_PROMPT.format(
            product_name=   inp.product_name,
            origin_country= inp.origin_country,
            target_country= inp.target_country,
            certifications= ", ".join(inp.certifications or []),
            module_summary= module_summary,
        )

        try:
            raw = await call_openai(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1500,
                temperature=0.2,
                call_type="scoring",
                module="scoring_engine",
                company_id=getattr(inp, "company_id", None),
                report_id=getattr(inp, "report_id", None),
                product_id=getattr(inp, "product_id", None),
            )
            if raw is None:
                raise ValueError("call_openai returned None")
            raw  = raw.strip()
            raw  = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
            data = json.loads(raw)

            scores = [
                ScoreCard(
                    dimension= s["dimension"],
                    label=     s["label"],
                    score=     int(s["score"]),
                    sublabel=  s.get("sublabel", ""),
                    color=     s.get("color", "green"),
                )
                for s in data.get("scores", [])
            ]

            action_cards = [
                ActionCard(
                    timing= a["timing"],
                    title=  a["title"],
                    body=   a["body"],
                )
                for a in data.get("action_cards", [])
            ]

            overall = _compute_overall(scores)
            print(f"     → Overall score: {overall}/100 (Python weighted)  |  "
                  f"scores: {[f'{s.dimension}={s.score}' for s in scores]}")

            return ScoringResult(
                success=       True,
                product_id=    inp.product_id,
                overall_score= overall,
                scores=        scores,
                urgent_note=   data.get("urgent_note"),
                action_cards=  action_cards,
            )

        except Exception as e:
            print(f"  ❌ [scoring_engine] Failed: {e}")
            return ScoringResult(
                success=    False,
                product_id= inp.product_id,
                error=      str(e),
            )