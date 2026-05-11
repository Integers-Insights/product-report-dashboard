"""
run.py
------
CLI entry point for the input pipeline.

Takes a website URL, runs the full pipeline, and saves results to JSON.

Usage:
    # Basic
    python run.py https://greenleafexports.in

    # With options
    python run.py https://greenleafexports.in --max-depth 2 --max-pages 50
    python run.py https://greenleafexports.in --no-semantic
    python run.py https://greenleafexports.in --output my_output.json

Output files saved to input_pipeline/output/:
    {domain}_products.json   → list of extracted + scored products
    {domain}_company.json    → extracted company data
    {domain}_full.json       → complete PipelineResult (products + company + stats)
"""

import sys
import json
import asyncio
import argparse
from pathlib import Path
from datetime import datetime

# ── Fix import path so we can run from any directory ──
# Adds website_dna/ to sys.path so `input_pipeline` is importable
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from input_pipeline.pipeline import run_pipeline, PipelineResult
from input_pipeline.config import OUTPUT_DIR


# ─────────────────────────────────────────────
#  CLI ARGUMENT PARSER
# ─────────────────────────────────────────────

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="run.py",
        description="INTRADE24 Input Pipeline — crawl a website and extract products",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run.py https://greenleafexports.in
  python run.py https://example.com --max-depth 2 --max-pages 50
  python run.py https://example.com --no-semantic
  python run.py https://example.com --output results/my_run.json
        """,
    )

    parser.add_argument(
        "url",
        help="Website URL to crawl (e.g. https://greenleafexports.in)",
    )
    parser.add_argument(
        "--max-depth",
        type=int,
        default=None,
        help="Max crawl depth (default: from config.py CRAWLER['max_depth'])",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=None,
        help="Max pages to crawl (default: from config.py CRAWLER['max_pages'])",
    )
    parser.add_argument(
        "--no-semantic",
        action="store_true",
        default=False,
        help="Skip semantic scoring (faster, no LLM cost for scoring stage)",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=3,
        help="Max parallel LLM extraction calls (default: 3)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Custom output file path (default: output/{domain}_full.json)",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        default=False,
        help="Suppress crawl progress logs",
    )

    return parser


# ─────────────────────────────────────────────
#  OUTPUT HELPERS
# ─────────────────────────────────────────────

def _get_domain(url: str) -> str:
    """Extracts clean domain name for use in output filenames."""
    from urllib.parse import urlparse
    domain = urlparse(url).netloc
    # Strip www. prefix and replace dots with underscores
    domain = domain.replace("www.", "").replace(".", "_")
    return domain or "unknown"


def _save_results(result: PipelineResult, output_path: Path | None = None) -> dict[str, Path]:
    """
    Saves pipeline results to JSON files.

    Always saves 3 files:
        {domain}_products.json  → clean list of products for frontend
        {domain}_company.json   → company data for preference pre-fill
        {domain}_full.json      → complete result for debugging

    Returns dict of saved file paths.
    """
    domain    = _get_domain(result.website_url)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    prefix    = f"{domain}_{timestamp}"

    saved = {}

    # ── Products JSON ────────────────────────────
    products_data = []
    for p in result.products:
        products_data.append({
            "product_name":     p.product_name,
            "category":         p.category,
            "subcategory":      p.subcategory,
            "description":      p.description,
            "packaging":        p.packaging,
            "price":            p.price,
            "hs_code":          p.hs_code,
            "certifications":   p.certifications,
            "ingredients":      p.ingredients,
            "moq":              p.moq,
            "monthly_capacity": p.monthly_capacity,
            "variants":         p.variants,
            "specifications":   p.specifications,
            "images":           p.images,
            "source_url":       p.source_url,
            "confidence_score": p.confidence_score,
            "confidence_tier":  p.confidence_tier.value,
            "missing_fields":   [
                {"field": m.field, "penalty": m.penalty, "suggestion": m.suggestion}
                for m in p.missing_fields
            ],
            "extraction_notes": p.extraction_notes,
        })

    products_path = OUTPUT_DIR / f"{prefix}_products.json"
    _write_json(products_path, products_data)
    saved["products"] = products_path

    # ── Company JSON ─────────────────────────────
    if result.company:
        company_data = result.company.model_dump(exclude_none=False)
        company_path = OUTPUT_DIR / f"{prefix}_company.json"
        _write_json(company_path, company_data)
        saved["company"] = company_path

    # ── Full result JSON (for debugging) ─────────
    full_path = output_path or OUTPUT_DIR / f"{prefix}_full.json"
    full_data = {
        "website_url":   result.website_url,
        "timestamp":     timestamp,
        "elapsed_sec":   result.elapsed_sec,
        "errors":        result.errors,
        "stats": {
            "total_products":   len(result.products),
            "high_confidence":  len(result.high_confidence()),
            "needs_review":     len(result.needs_review()),
            "low_confidence":   len(result.low_confidence()),
            "ready_for_analysis": len(result.ready_for_analysis()),
        },
        "crawl_stats": {
            "pages_fetched":  result.crawl_result.pages_fetched if result.crawl_result else 0,
            "pages_skipped":  result.crawl_result.pages_skipped if result.crawl_result else 0,
            "fetch_errors":   result.crawl_result.fetch_errors  if result.crawl_result else 0,
        } if result.crawl_result else {},
        "products": products_data,
        "company":  result.company.model_dump(exclude_none=False) if result.company else None,
    }
    _write_json(full_path, full_data)
    saved["full"] = full_path

    return saved


def _write_json(path: Path, data) -> None:
    """Writes data to a JSON file with pretty printing."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False, default=str)
    print(f"  💾 Saved → {path}")


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

async def main():
    parser = build_parser()
    args   = parser.parse_args()

    # ── Validate URL ─────────────────────────────
    url = args.url.strip()
    if not url.startswith("http"):
        url = "https://" + url

    print(f"\n{'═' * 55}")
    print(f"  🚀 INTRADE24 Input Pipeline")
    print(f"  URL: {url}")
    print(f"{'═' * 55}")

    # ── Check .env for API key ───────────────────
    _check_env()

    # ── Run pipeline ─────────────────────────────
    result = await run_pipeline(
        website_url=url,
        max_depth=args.max_depth,
        max_pages=args.max_pages,
        run_semantic=not args.no_semantic,
        extraction_concurrency=args.concurrency,
    )

    # ── Save output ──────────────────────────────
    print("\n" + "─" * 55)
    print("  Saving output files...")
    print("─" * 55)

    output_path = Path(args.output) if args.output else None
    saved = _save_results(result, output_path)

    # ── Final summary ────────────────────────────
    print(f"\n{'═' * 55}")
    print(f"  ✅ Pipeline complete in {result.elapsed_sec:.1f}s")
    print(f"  📦 {len(result.products)} products extracted")
    print(f"  🟢 {len(result.high_confidence())} high confidence")
    print(f"  🟠 {len(result.needs_review())} need review")
    print(f"  🔴 {len(result.low_confidence())} low confidence")
    if result.errors:
        print(f"  ⚠️  {len(result.errors)} errors:")
        for err in result.errors:
            print(f"      - {err}")
    print(f"{'═' * 55}\n")


def _check_env():
    """
    Checks that required environment variables are set.
    Warns if missing but does not abort — user may have set them
    directly in the shell environment.
    """
    import os
    from dotenv import load_dotenv
    load_dotenv()

    missing = []
    if not os.getenv("OPENAI_API_KEY"):
        missing.append("OPENAI_API_KEY")

    if missing:
        print(f"\n  ⚠️  Missing environment variables: {', '.join(missing)}")
        print(f"  Add them to your .env file at:")
        print(f"  {ROOT_DIR / '.env'}\n")


if __name__ == "__main__":
    asyncio.run(main())