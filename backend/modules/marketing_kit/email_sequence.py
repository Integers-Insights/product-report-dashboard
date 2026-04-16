"""
modules/marketing_kit/email_sequence.py
-----------------------------------------
Sub-module 2 — Email Sequence Generator

Generates a 3-step B2B cold outreach email sequence tailored to:
  - Product + certifications + company
  - Target country + buyer type
  - Price positioning

Email structure (matches UI):
  Email 1 — Day 0       : Introduction (value-first, no pitch)
  Email 2 — GPT-chosen  : Social proof + spec sheet follow-up
  Email 3 — GPT-chosen  : Low-friction close (free sample offer)

  All email bodies are 60-70 words.
  Send days are chosen dynamically by GPT based on buyer type, target market,
  and product complexity — not hardcoded. e.g. enterprise EU = [0,5,12],
  distributor MENA = [0,3,8].

Each email has:
  - send_day       : int
  - type_label     : e.g. "INTRODUCTION" / "SOCIAL PROOF + SPEC SHEET"
  - goal           : short headline e.g. "Introduce your product — value-first"
  - subject        : email subject line
  - body           : full email body (≤120 words)
  - tiles          : list of 3 short tip/stat tags shown below the email in UI

DB table: product_info.email_sequence
  product_id, target_country, buyer_type,
  email_1 (jsonb), email_2 (jsonb), email_3 (jsonb), created_at

Model: gpt-4o (temp=0.8) — creativity matters here
"""

import json
import re
from dataclasses import dataclass, field
from typing import Optional
from input_pipeline.config import MARKETING_KIT
from modules.base_module import BaseModule


# ── Data models ──────────────────────────────────────────────────────────────

@dataclass
class EmailStep:
    send_day:   int
    type_label: str          # "INTRODUCTION" etc.
    goal:       str          # short headline
    subject:    str
    body:       str
    tiles:      list[str]    # 3 short tags/tips shown in UI


@dataclass
class EmailSequenceResult:
    success:       bool
    product_id:    str
    target_country: str
    buyer_type:    str
    emails:        list[EmailStep] = field(default_factory=list)
    sequence_note: Optional[str]  = None   # e.g. "3-step · tuned for UK B2B buyers · 28-35% open rate"
    error:         Optional[str]  = None

    def to_db_row(self) -> dict:
        def _email_dict(e: EmailStep) -> dict:
            return {
                "send_day":   e.send_day,
                "type_label": e.type_label,
                "goal":       e.goal,
                "subject":    e.subject,
                "body":       e.body,
                "tiles":      e.tiles,
            }
        emails = self.emails
        return {
            "product_id":     self.product_id,
            "target_country": self.target_country,
            "buyer_type":     self.buyer_type,
            "email_1":        _email_dict(emails[0]) if len(emails) > 0 else None,
            "email_2":        _email_dict(emails[1]) if len(emails) > 1 else None,
            "email_3":        _email_dict(emails[2]) if len(emails) > 2 else None,
            "sequence_note":  self.sequence_note,
        }


# ── Prompt ───────────────────────────────────────────────────────────────────

EMAIL_SEQUENCE_PROMPT = """
You are a B2B export marketing specialist. Write a 3-step cold outreach email 
sequence for a company targeting {buyer_type} buyers in {target_country}.

Exporter details:
  Company       : {company_name}
  Product       : {product_name}
  Category      : {category}
  Certifications: {certifications}
  Price tier    : {price_positioning}
  MOQ           : {moq}
  Description   : {description}

Sequence rules (all email bodies must be 90 -110 words — no exceptions):
  Email 1 — Introduction: value-first, no hard sell.
             Mention 1-2 certifications (if any) naturally.
  Email 2 — Social proof + spec sheet: reference a stat or a customer win
             (can be illustrative). Offer COA/spec.
  Email 3 — Low-friction close: offer a free sample, leave door open
             for next quarter if timing is off.

Send day selection — choose the best send_day (integer, days after Email 1) for each email
based on these factors:
  - Buyer type ({buyer_type}): enterprise procurement = longer gaps (7-10 days),
    distributors/SMEs = shorter gaps (3-5 days)
  - Target market ({target_country}): EU/UK buyers respond slower, MENA/SEA buyers faster
  - Product complexity: technical/certified products need more evaluation time
  Email 1 is always Day 0. Choose Email 2 and Email 3 days to fit this buyer's real buying cycle.
  Good examples: [0, 5, 12] for enterprise EU, [0, 3, 8] for distributor MENA, [0, 4, 10] for standard

Tone: professional but human. No buzzwords. Avoid "I hope this email finds you well."
Personalisation placeholders: [First Name], [Company Name]

For each email also produce:
  - A punchy goal headline (e.g. "Introduce your product — value-first, no pitch")
  - 3 short tiles (5-7 words each) — practical tips or stats for this email
    (e.g. "Open rate: 28-35%", "Keep under 120 words", "Send: Tue-Thu · 9-11am local")

Return ONLY valid JSON, no explanation:
{{
  "sequence_note": "3-step sequence · tuned for {product_name} B2B buyers in {target_country} · estimated 28-35% open rate",
  "emails": [
    {{
      "send_day": 0,
      "type_label": "INTRODUCTION",
      "goal": "...",
      "subject": "...",
      "body": "...",
      "tiles": ["...", "...", "..."]
    }},
    {{
      "send_day": "<GPT chooses — int>",
      "type_label": "SOCIAL PROOF + SPEC SHEET",
      "goal": "...",
      "subject": "...",
      "body": "...",
      "tiles": ["...", "...", "..."]
    }},
    {{
      "send_day": "<GPT chooses — int>",
      "type_label": "LOW-FRICTION CLOSE",
      "goal": "...",
      "subject": "...",
      "body": "...",
      "tiles": ["...", "...", "..."]
    }}
  ]
}}
"""


# ── Module class ──────────────────────────────────────────────────────────────

class EmailSequenceModule(BaseModule):
    """
    Generates a 3-step B2B cold outreach email sequence using GPT-4o.

    Usage:
        result = await EmailSequenceModule().run(inp)
    """

    async def run(self, inp) -> EmailSequenceResult:
        """
        Generate email sequence for one product × one target country.

        Args:
            inp : ModuleInput
        Returns:
            EmailSequenceResult with 3 EmailStep objects
        """
        print(f"  ✉️  [email_sequence] {inp.product_name} → {inp.target_country} ({inp.buyer_type})")

        prompt = EMAIL_SEQUENCE_PROMPT.format(
            company_name=inp.company_name,
            product_name=inp.product_name,
            category=inp.category,
            certifications=", ".join(inp.certifications or []),
            price_positioning=getattr(inp, "price_positioning", "standard"),
            moq=getattr(inp, "moq", "negotiable"),
            description=(inp.description or "")[:400],
            target_country=inp.target_country,
            buyer_type=inp.buyer_type,
        )

        client = self._get_openai()
        try:
            resp = await client.chat.completions.create(
                model=MARKETING_KIT["email_model"],
                temperature=MARKETING_KIT["email_temp"],
                max_tokens=MARKETING_KIT["email_max_tokens"],
                messages=[{"role": "user", "content": prompt}],
            )
            raw = resp.choices[0].message.content.strip()
            raw = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
            data = json.loads(raw)

            emails = [
                EmailStep(
                    send_day=e["send_day"],
                    type_label=e["type_label"],
                    goal=e["goal"],
                    subject=e["subject"],
                    body=e["body"],
                    tiles=e.get("tiles", [])[:3],
                )
                for e in data.get("emails", [])[:3]
            ]

            print(f"     → {len(emails)} emails generated")

            return EmailSequenceResult(
                success=True,
                product_id=inp.product_id,
                target_country=inp.target_country,
                buyer_type=inp.buyer_type,
                emails=emails,
                sequence_note=data.get("sequence_note"),
            )

        except Exception as e:
            print(f"  ❌ [email_sequence] GPT error: {e}")
            return EmailSequenceResult(
                success=False,
                product_id=inp.product_id,
                target_country=inp.target_country,
                buyer_type=inp.buyer_type,
                error=str(e),
            )