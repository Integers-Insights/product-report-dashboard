"""
modules/input_preprocessing.py
--------------------------------
Preprocesses ModuleInput before running intelligence modules.

Two GPT-4o-mini calls run concurrently:
  1. clean_product_name — strips brand/company name and quantity/weight
     from the raw product listing title
  2. find_hs_code       — finds closest 6-digit HS code if not provided

Call preprocess_module_input(inp) once at the start of module_runner.run_all()
before dispatching to any modules.

Example:
    "AADAR Ayurveda Pure Himalayan Shilajit - Finest Resin (15 g)"
    → product_name : "Ayurveda Pure Himalayan Shilajit - Finest Resin"
    → hs_code      : "130290"  (if was empty)
"""

import asyncio
import os

from openai import AsyncOpenAI
from dotenv import load_dotenv

from modules.base_module import ModuleInput
from input_pipeline.config import LLM

load_dotenv()


# ─────────────────────────────────────────────
#  SHARED GPT HELPER
# ─────────────────────────────────────────────

async def _gpt_text_call(prompt: str, max_tokens: int = 80) -> str | None:
    """
    Lightweight GPT-4o-mini call returning plain text (not JSON).
    Creates its own client — this module is called before BaseModule instances exist.
    """
    try:
        client   = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = await client.chat.completions.create(
            model=LLM["extraction_model"],
            max_tokens=max_tokens,
            temperature=0.0,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"  ⚠️  [preprocess] GPT call failed: {e}")
        return None


# ─────────────────────────────────────────────
#  FUNCTION 1 — CLEAN PRODUCT NAME
# ─────────────────────────────────────────────

async def clean_product_name(raw_name: str, company_name: str = "") -> str:
    """
    Strips brand/company name and quantity/weight from a raw product listing title.

    Example:
        "AADAR Ayurveda Pure Himalayan Shilajit - Finest Resin (15 g)"
        → "Ayurveda Pure Himalayan Shilajit - Finest Resin"

    Falls back to raw_name unchanged if GPT fails.
    """
    prompt = f"""Clean a product listing title for use in trade research searches.

Raw title    : {raw_name}
Company name : {company_name or "unknown"}

Remove from the title:
- The brand or company name if it appears anywhere in the title
- Quantity, weight, or volume (e.g. 15g, 500ml, 100 capsules, 1kg, Pack of 3)
- Packaging words that don't describe the product (pack, set, bottle, jar, sachet, combo)

Keep in the title:
- The core product type and its descriptors
- Format words that are part of the product identity (Resin, Powder, Extract, Tablet, Serum)
- Qualifiers that affect trade classification (Organic, Pure, Himalayan, Standardised)

Return ONLY the cleaned product name. No quotes, no explanation, no punctuation at the end."""

    result = await _gpt_text_call(prompt, max_tokens=60)
    if result:
        print(f"     → Name: {raw_name!r} → {result!r}")
        return result
    return raw_name


# ─────────────────────────────────────────────
#  FUNCTION 2 — FIND HS CODE
# ─────────────────────────────────────────────

async def find_hs_code(product_name: str, category: str = "") -> str:
    """
    Returns the closest 6-digit HS (Harmonized System) code for a product.
    Returns empty string if GPT fails or returns an invalid code.
    """
    prompt = f"""Return the most appropriate 6-digit HS (Harmonized System) code for:

Product : {product_name}
Category: {category or "general"}

Rules:
- Return ONLY the 6-digit code (digits only, no dots, no spaces)
- If unsure between two codes, pick the more specific one
- Do not explain — just the code

Example output: 091030"""

    result = await _gpt_text_call(prompt, max_tokens=20)
    if result:
        clean = result.replace(".", "").replace(" ", "").strip()
        if clean.isdigit() and 4 <= len(clean) <= 10:
            print(f"     → HS code: {clean}")
            return clean
    print(f"  ⚠️  [preprocess] HS code invalid or not found: {result!r}")
    return ""


# ─────────────────────────────────────────────
#  ORCHESTRATOR
# ─────────────────────────────────────────────

async def preprocess_module_input(inp: ModuleInput) -> ModuleInput:
    """
    Enriches ModuleInput before running intelligence modules.

    Runs both GPT calls concurrently:
      1. clean_product_name — always runs
      2. find_hs_code       — only runs if inp.hs_code is empty

    Modifies inp in-place and returns it.

    Usage:
        inp = await preprocess_module_input(inp)
    """
    print(f"\n  🔧 [preprocess] {inp.product_name!r}")

    run_hs = not bool(inp.hs_code)

    if run_hs:
        cleaned_name, hs_code = await asyncio.gather(
            clean_product_name(inp.product_name, inp.company_name),
            find_hs_code(inp.product_name, inp.category),
        )
    else:
        cleaned_name = await clean_product_name(inp.product_name, inp.company_name)
        hs_code      = inp.hs_code

    inp.product_name = cleaned_name or inp.product_name
    if run_hs and hs_code:
        inp.hs_code = hs_code

    print(f"     → Ready: name={inp.product_name!r}  hs_code={inp.hs_code!r}")
    return inp
