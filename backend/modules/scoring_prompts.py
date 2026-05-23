# ─────────────────────────────────────────────
#  PROMPT
# ─────────────────────────────────────────────

SCORING_PROMPT = """
You are a B2B export intelligence analyst. Based on the module results below,
score this exporter's opportunity across 6 dimensions and generate an
opportunity summary.

Product: {product_name}
Origin: {origin_country}
Target market: {target_country}
Certifications: {certifications}

--- MODULE RESULTS ---
{module_summary}
--- END ---

TASK 1: Score each dimension 1–10 with a short sublabel (≤10 words).

Dimensions and what to score:
1. market_demand      — demand growth, import volume, cert gaps from market_demand module
2. variants_formats   — number of gap/emerging variants, opportunity scores from variants module
3. competition        — how many direct competitors, cert gaps vs them from competitor_discovery
4. trade_activity     — global trade value, India export share, growth trend from trade_intel
5. price_fit          — how well seller's price fits the market range, margin potential from price_analysis
6. buyer_availability — number of matched buyers, buyer demand level from buyer_discovery

Scoring guidance:
- 9–10: exceptional, clear opportunity, strong data
- 7–8 : good, positive signals, some gaps
- 5–6 : moderate, mixed signals
- 3–4 : weak, significant challenges
- 1–2 : poor fit or very sparse data

Color:
- "green"  if score ≥ 7
- "yellow" if score 5–6
- "red"    if score ≤ 4

TASK 2: Urgent opportunity note (1–3 sentences).
- Must reference a SPECIFIC insight from the module data
- Should create urgency or highlight a time-sensitive window
- Bold the action recommendation using **bold** markdown

TASK 3: Three action cards.
- "Do now"       : immediate action this week
- "This month"   : 30-day priority
- "This quarter" : 90-day strategic move
Each card: title (3–5 words) + body (2 sentences max, specific to module data).

Return ONLY valid JSON, no explanation:
{{
  "scores": [
    {{
      "dimension": "market_demand",
      "label": "MARKET DEMAND",
      "score": integer,
      "sublabel": "short stat · short context",
      "color": "green|yellow|red"
    }},
    {{
      "dimension": "variants_formats",
      "label": "VARIANTS & FORMATS",
      "score": integer,
      "sublabel": "...",
      "color": "..."
    }},
    {{
      "dimension": "competition",
      "label": "COMPETITION",
      "score": integer,
      "sublabel": "...",
      "color": "..."
    }},
    {{
      "dimension": "trade_activity",
      "label": "TRADE ACTIVITY",
      "score": integer,
      "sublabel": "...",
      "color": "..."
    }},
    {{
      "dimension": "price_fit",
      "label": "PRICE FIT",
      "score": integer,
      "sublabel": "...",
      "color": "..."
    }},
    {{
      "dimension": "buyer_availability",
      "label": "BUYER AVAILABILITY",
      "score": integer,
      "sublabel": "...",
      "color": "..."
    }}
  ],
  "urgent_note": "...",
  "action_cards": [
    {{"timing": "Do now",       "title": "...", "body": "..."}},
    {{"timing": "This month",   "title": "...", "body": "..."}},
    {{"timing": "This quarter", "title": "...", "body": "..."}}
  ]
}}


"""