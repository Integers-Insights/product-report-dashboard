"""
pipeline.py
-----------
End-to-end orchestration of the input pipeline.

Ties together all stages in the correct order:
    1. Crawl        → orchestrator.crawl_website()
    2. Extract      → product_extractor + company_extractor
    3. Score        → confidence_scorer + semantic_scorer
    4. Return       → PipelineResult

This is the single function the rest of the application calls.
Nothing outside this file needs to know about individual stages.

Usage:
    from input_pipeline.pipeline import run_pipeline

    result = await run_pipeline("https://greenleafexports.in")

    for product in result.products:
        print(product.product_name, product.confidence_score)

    print(result.company.company_name)
    print(result.summary())
"""

import asyncio
import time
from dataclasses import dataclass, field

from input_pipeline.crawler.orchestrator import crawl_website, CrawlResult
from input_pipeline.extractor.product_extractor import extract_product
from input_pipeline.extractor.company_extractor import extract_company
from input_pipeline.scorer.confidence_scorer import score_products
from input_pipeline.scorer.semantic_scorer import semantic_score_products
from input_pipeline.models.product import ProductData
from input_pipeline.models.company import CompanyData
from input_pipeline.models.page import ConfidenceTier
from input_pipeline.crawler.orchestrator import CrawlResult


# ─────────────────────────────────────────────
#  PIPELINE RESULT
# ─────────────────────────────────────────────

@dataclass
class PipelineResult:
    """
    Final output of run_pipeline().

    products:       All extracted + scored products
    company:        Extracted company data (from about/contact pages)
    crawl_result:   Raw crawl stats (for logging/debugging)
    elapsed_sec:    Total pipeline duration
    website_url:    The URL that was crawled
    """
    website_url:    str
    products:       list[ProductData]   = field(default_factory=list)
    company:        CompanyData | None  = None
    crawl_result:   CrawlResult | None  = None
    elapsed_sec:    float               = 0.0
    errors:         list[str]           = field(default_factory=list)

    # ── Convenience accessors ────────────────────

    def high_confidence(self) -> list[ProductData]:
        """Products with HIGH confidence tier (green dot)."""
        return [p for p in self.products if p.confidence_tier == ConfidenceTier.HIGH]

    def needs_review(self) -> list[ProductData]:
        """Products with MEDIUM confidence tier (orange dot)."""
        return [p for p in self.products if p.confidence_tier == ConfidenceTier.MEDIUM]

    def low_confidence(self) -> list[ProductData]:
        """Products with LOW confidence tier (red dot)."""
        return [p for p in self.products if p.confidence_tier == ConfidenceTier.LOW]

    def ready_for_analysis(self) -> list[ProductData]:
        """Products that pass the minimum bar for intelligence engine."""
        return [p for p in self.products if p.is_ready_for_analysis()]

    def summary(self) -> str:
        """Human-readable pipeline result summary."""
        lines = [
            f"\n{'═' * 55}",
            f"  📦 PIPELINE RESULT — {self.website_url}",
            f"{'═' * 55}",
            f"  Total products found : {len(self.products)}",
            f"  🟢 High confidence   : {len(self.high_confidence())}",
            f"  🟠 Needs review      : {len(self.needs_review())}",
            f"  🔴 Low confidence    : {len(self.low_confidence())}",
            f"  ✅ Ready for analysis: {len(self.ready_for_analysis())}",
            f"  🏢 Company extracted : {'Yes' if self.company else 'No'}",
            f"  ⏱  Elapsed          : {self.elapsed_sec:.1f}s",
        ]
        if self.errors:
            lines.append(f"  ⚠️  Errors           : {len(self.errors)}")

        lines.append(f"{'═' * 55}\n")

        # Product list
        if self.products:
            lines.append("  Products:")
            for p in self.products:
                tier_icon = {"high": "🟢", "medium": "🟠", "low": "🔴"}.get(
                    p.confidence_tier.value, "⚪"
                )
                lines.append(
                    f"    {tier_icon} [{p.confidence_score:3d}] "
                    f"{p.get_display_name()[:50]}"
                )

        return "\n".join(lines)


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

async def run_pipeline(
    website_url:        str,
    max_depth:          int | None = None,
    max_pages:          int | None = None,
    run_semantic:       bool = True,
    extraction_concurrency: int = 8,
) -> PipelineResult:
    """
    Runs the full input pipeline for a given website URL.

    Stages:
        1. Crawl website → grouped pages by type
        2. Extract products from product pages (parallel)
        3. Extract company data from about/contact pages
        4. Rule-based confidence scoring (sync, fast)
        5. Semantic scoring for mid-confidence products (async, LLM)

    Args:
        website_url:              URL to crawl and extract from
        max_depth:                Override crawler max_depth (default from config)
        max_pages:                Override crawler max_pages (default from config)
        run_semantic:             Whether to run semantic scorer (costs LLM tokens)
        extraction_concurrency:   Max parallel LLM extraction calls

    Returns:
        PipelineResult with products, company, and crawl stats.
    """
    start_time = time.monotonic()
    result     = PipelineResult(website_url=website_url)

    # ────────────────────────────────────────────
    #  STAGE 1+2 — CRAWL + EXTRACT (streaming)
    #
    #  Crawler and extractor run simultaneously:
    #  - Crawler pushes each PRODUCT page into a queue the moment it is classified
    #  - Extraction workers pull from the queue immediately — no waiting for full crawl
    #  - Wall time ≈ max(crawl_time, extraction_time) instead of crawl + extraction
    # ────────────────────────────────────────────
    print("\n" + "─" * 55)
    print("  STAGE 1+2 — Crawling + Extracting (streaming)")
    print("─" * 55)

    products: list[ProductData] = []
    crawl: CrawlResult | None = None

    # Bounded queue — crawler won't race more than 40 pages ahead of extractor
    product_queue: asyncio.Queue = asyncio.Queue(maxsize=40)

    async def _crawl_task() -> CrawlResult:
        return await crawl_website(
            start_url=website_url,
            max_depth=max_depth,
            max_pages=max_pages,
            product_queue=product_queue,
        )

    async def _extraction_task() -> None:
        """Consumes product pages from queue, runs LLM extraction with concurrency control."""
        semaphore = asyncio.Semaphore(extraction_concurrency)
        active: list[asyncio.Task] = []

        while True:
            page = await product_queue.get()
            if page is None:                    # sentinel — crawler finished
                break

            async def _extract_one(p=page) -> None:
                async with semaphore:
                    try:
                        product = await extract_product(p)
                        products.append(product)
                    except Exception as e:
                        result.errors.append(f"Extraction error for {p.url}: {e}")

            active.append(asyncio.create_task(_extract_one()))

        # Wait for all in-flight extraction tasks before returning
        if active:
            await asyncio.gather(*active)

    try:
        crawl_result, _ = await asyncio.gather(
            _crawl_task(),
            _extraction_task(),
        )
        crawl = crawl_result
        result.crawl_result = crawl
        print(f"\n  ✅ Crawl complete — {crawl.pages_fetched} pages fetched")
        print(f"  ✅ Extracted {len(products)} products")

    except Exception as e:
        result.errors.append(f"Pipeline failed: {e}")
        result.elapsed_sec = time.monotonic() - start_time
        print(f"  ❌ Pipeline failed: {e}")
        # Push sentinel so extraction task doesn't hang if crawl errored
        try:
            product_queue.put_nowait(None)
        except Exception:
            pass
        return result

    if crawl and not crawl.product_pages and not crawl.all_company_pages():
        result.errors.append("No pages found after crawl")
        result.elapsed_sec = time.monotonic() - start_time
        print("  ⚠️  No usable pages found")
        return result


    # ────────────────────────────────────────────
    #  STAGE 3 — COMPANY EXTRACTION
    # ────────────────────────────────────────────
    print("\n" + "─" * 55)
    print(f"  STAGE 3 — Extracting company data "
          f"({len(crawl.all_company_pages())} pages)")
    print("─" * 55)

    company: CompanyData | None = None

    if crawl.all_company_pages():
        try:
            company = await extract_company(
                pages=crawl.all_company_pages(),
                website_url=website_url,
            )
            result.company = company
            print(f"  ✅ Company: {company.company_name or 'name not found'}")
        except Exception as e:
            result.errors.append(f"Company extraction failed: {e}")
            print(f"  ❌ Company extraction failed: {e}")
    else:
        print("  ℹ️  No about/contact pages found")

    # ── Deduplicate by product_name ──────────
    seen_names = set()
    unique_products = []
    for p in products:
        key = (p.product_name or "").strip().lower()
        if key and key not in seen_names:
            seen_names.add(key)
            unique_products.append(p)
        elif not key:
            unique_products.append(p)  # keep unnamed ones
    products = unique_products
    print(f"  ✅ After dedup: {len(products)} unique products")

    # ────────────────────────────────────────────
    #  STAGE 4 — RULE-BASED SCORING
    # ────────────────────────────────────────────


    print("\n" + "─" * 55)
    print("  STAGE 4 — Confidence scoring (rule-based)")
    print("─" * 55)

    if products:
        try:
            products = score_products(products)
            _print_score_distribution(products)
        except Exception as e:
            result.errors.append(f"Rule scoring failed: {e}")
            print(f"  ❌ Rule scoring failed: {e}")

    # ────────────────────────────────────────────
    #  STAGE 5 — SEMANTIC SCORING  (optional)
    # ────────────────────────────────────────────
    if run_semantic and products:
        mid_band = [
            p for p in products
            if 40 <= p.confidence_score <= 85
        ]

        print("\n" + "─" * 55)
        print(f"  STAGE 5 — Semantic scoring "
              f"({len(mid_band)} products in 40–85 band)")
        print("─" * 55)

        if mid_band:
            try:
                # Run semantic scoring only on mid-band products
                scored_mid = await semantic_score_products(
                    products=mid_band,
                    concurrency=extraction_concurrency,
                )

                # Merge back: replace mid-band products with semantically scored ones
                scored_urls = {p.source_url: p for p in scored_mid}
                products = [
                    scored_urls.get(p.source_url, p)
                    for p in products
                ]

                print(f"  ✅ Semantic scoring complete")
                _print_score_distribution(products)

            except Exception as e:
                result.errors.append(f"Semantic scoring failed: {e}")
                print(f"  ❌ Semantic scoring failed: {e}")
        else:
            print("  ℹ️  No products in mid-band, skipping")

    # ────────────────────────────────────────────
    #  FINALISE
    # ────────────────────────────────────────────
    result.products    = products
    result.elapsed_sec = time.monotonic() - start_time

    print(result.summary())
    return result


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _print_score_distribution(products: list[ProductData]) -> None:
    """Prints a quick score distribution after each scoring stage."""
    high   = sum(1 for p in products if p.confidence_tier == ConfidenceTier.HIGH)
    medium = sum(1 for p in products if p.confidence_tier == ConfidenceTier.MEDIUM)
    low    = sum(1 for p in products if p.confidence_tier == ConfidenceTier.LOW)
    print(f"  Score distribution → 🟢 {high} high  "
          f"🟠 {medium} medium  🔴 {low} low")