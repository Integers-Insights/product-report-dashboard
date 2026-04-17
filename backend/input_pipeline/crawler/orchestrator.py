"""
crawler/orchestrator.py
------------------------
BFS crawl loop that orchestrates the full crawl of a website.

Ties together:
    - browser.py         → fetches pages
    - link_extractor.py  → discovers links from each page
    - url_classifier.py  → pre-filters URLs before fetching
    - content_classifier.py → confirms page type after fetching
    - content_cleaner.py → cleans HTML into usable text

Returns a CrawlResult containing pages grouped by type:
    - product_pages:  list[ClassifiedPage]  ← goes to product_extractor
    - about_pages:    list[ClassifiedPage]  ← goes to company_extractor
    - contact_pages:  list[ClassifiedPage]  ← goes to company_extractor

Usage:
    from input_pipeline.crawler.orchestrator import crawl_website

    result = await crawl_website("https://greenleafexports.in")
    print(result.product_pages)   # list of ClassifiedPage
    print(result.summary())       # human-readable crawl stats
"""

import asyncio
from dataclasses import dataclass, field
from urllib.parse import urlparse

from input_pipeline.crawler.browser import BrowserSession
from input_pipeline.crawler.link_extractor import extract_links
from input_pipeline.classifier.url_classifier import (
    classify_url,
    get_crawl_depth_budget,
)
from input_pipeline.classifier.content_classifier import confirm_classification
from input_pipeline.cleaner.content_cleaner import clean_page
from input_pipeline.models.page import (
    RawPage,
    CrawledPage,
    ClassifiedPage,
    PageType,
)
from input_pipeline.config import CRAWLER


# ─────────────────────────────────────────────
#  CRAWL RESULT
# ─────────────────────────────────────────────

@dataclass
class CrawlResult:
    """
    Output of crawl_website().
    Pages are pre-grouped by type so the pipeline layer
    can pass them directly to the right extractor.
    """
    start_url:      str
    product_pages:  list[ClassifiedPage] = field(default_factory=list)
    about_pages:    list[ClassifiedPage] = field(default_factory=list)
    contact_pages:  list[ClassifiedPage] = field(default_factory=list)
    ignored_pages:  list[ClassifiedPage] = field(default_factory=list)

    # Crawl stats
    pages_fetched:  int = 0
    pages_skipped:  int = 0
    fetch_errors:   int = 0

    def all_company_pages(self) -> list[ClassifiedPage]:
        """Returns about + contact pages combined for company extraction."""
        return self.about_pages + self.contact_pages

    def summary(self) -> str:
        """Human-readable crawl summary for logging."""
        return (
            f"\n{'─' * 55}\n"
            f"  🏁 Crawl complete — {self.start_url}\n"
            f"     Pages fetched   : {self.pages_fetched}\n"
            f"     Pages skipped   : {self.pages_skipped}\n"
            f"     Fetch errors    : {self.fetch_errors}\n"
            f"     Product pages   : {len(self.product_pages)}\n"
            f"     About pages     : {len(self.about_pages)}\n"
            f"     Contact pages   : {len(self.contact_pages)}\n"
            f"{'─' * 55}\n"
        )


# ─────────────────────────────────────────────
#  MAIN ENTRY POINT
# ─────────────────────────────────────────────

async def crawl_website(
    start_url:     str,
    max_depth:     int | None = None,
    max_pages:     int | None = None,
    product_queue: asyncio.Queue | None = None,
) -> CrawlResult:
    """
    BFS crawl of a website, returning pages grouped by type.

    Args:
        start_url: Root URL to crawl (http/https)
        max_depth: Override CRAWLER max_depth from config
        max_pages: Override CRAWLER max_pages from config

    Returns:
        CrawlResult with product_pages, about_pages, contact_pages populated.
    """
    # ── Normalise start URL ──────────────────────
    if not start_url.startswith("http"):
        start_url = "https://" + start_url
    start_url = start_url.rstrip("/")

    _max_depth = max_depth if max_depth is not None else CRAWLER["max_depth"]
    _max_pages = max_pages if max_pages is not None else CRAWLER["max_pages"]

    print(f"\n🕷️  Starting crawl → {start_url}")
    print(f"    max_depth={_max_depth}, max_pages={_max_pages}\n")

    result  = CrawlResult(start_url=start_url)
    visited: set[str] = {start_url}

    # BFS runs level-by-level so each level can be fetched in parallel.
    # current_level holds all (url, depth) pairs for the current BFS wave.
    current_level: list[tuple[str, int]] = [(start_url, 0)]

    async with BrowserSession() as session:
        while current_level and result.pages_fetched < _max_pages:

            # ── 1. Pre-filter this level ──────────────────────────────────────
            # URL-classify every URL synchronously (fast, no I/O).
            # Drop URLs that are over depth budget or marked skip.
            # Carry url_result forward so we don't classify twice.
            to_fetch: list[tuple[str, int, object]] = []

            for url, depth in current_level:
                url_result = classify_url(url, base_url=start_url)

                if depth > 0:
                    budget = get_crawl_depth_budget(
                        url_result.page_type, CRAWLER["depth_budget"]
                    )
                    if depth > budget:
                        result.pages_skipped += 1
                        _log(depth, url, "⏭  skipped (over depth budget)")
                        continue
                    if not url_result.should_crawl:
                        result.pages_skipped += 1
                        continue

                to_fetch.append((url, depth, url_result))

            # Cap batch to remaining page budget
            remaining = _max_pages - result.pages_fetched
            to_fetch  = to_fetch[:remaining]

            if not to_fetch:
                break

            print(f"\n  📦 Fetching batch: {len(to_fetch)} pages "
                  f"(concurrency={CRAWLER['crawl_concurrency']})")

            # ── 2. Parallel fetch ─────────────────────────────────────────────
            raw_pages = await session.fetch_many(
                [(url, depth) for url, depth, _ in to_fetch],
                concurrency=CRAWLER['crawl_concurrency'],
            )

            # ── 3. Process results, collect next level ────────────────────────
            next_level: list[tuple[str, int]] = []

            for (url, depth, url_result), raw_page in zip(to_fetch, raw_pages):
                result.pages_fetched += 1

                if raw_page.error:
                    result.fetch_errors += 1
                    _log(depth, url, f"⚠️  fetch error: {raw_page.error[:60]}")
                    continue

                # ── Clean content ─────────────────────────────
                crawled: CrawledPage = clean_page(raw_page)

                # ── Confirm classification ────────────────────
                if depth == 0:
                    final_type    = PageType.HOME
                    final_conf    = 1.0
                    classified_by = "homepage"
                else:
                    content_result = confirm_classification(
                        url_result=url_result,
                        clean_text=crawled.clean_text,
                        html=raw_page.html,
                    )
                    final_type    = content_result.page_type
                    final_conf    = content_result.confidence
                    classified_by = "content"

                # ── Build ClassifiedPage ──────────────────────
                classified = ClassifiedPage.from_crawled(
                    page=crawled,
                    page_type=final_type,
                    confidence=final_conf,
                    classified_by=classified_by,
                )

                _route_page(classified, result, depth)

                # ── Stream product page to extraction queue ───
                # If a queue is provided (streaming mode), push immediately
                # so extraction starts before crawling finishes.
                if product_queue is not None and classified.page_type == PageType.PRODUCT:
                    await product_queue.put(classified)

                # ── Discover links for next BFS level ─────────
                if depth < _max_depth and raw_page.html:
                    new_links = extract_links(raw_page.html, base_url=start_url)

                    added = 0
                    for link in new_links:
                        if link.url not in visited:
                            visited.add(link.url)
                            next_level.append((link.url, depth + 1))
                            added += 1

                    if added:
                        _log(depth, url, f"  ↳ found {added} new links")

                    # SPA fallback — homepage gave no links, probe common paths
                    if depth == 0 and added == 0:
                        print("  ⚠️  Homepage yielded no links — trying SPA fallback paths")
                        for fallback in ["/products", "/product", "/shop",
                                         "/catalogue", "/offerings"]:
                            fallback_url = start_url + fallback
                            if fallback_url not in visited:
                                visited.add(fallback_url)
                                next_level.append((fallback_url, 1))

            current_level = next_level

    # Signal extraction workers that crawl is complete
    if product_queue is not None:
        await product_queue.put(None)  # sentinel — no more pages coming

    print(result.summary())
    return result


# ─────────────────────────────────────────────
#  PAGE ROUTING
# ─────────────────────────────────────────────

def _route_page(
    page:   ClassifiedPage,
    result: CrawlResult,
    depth:  int,
) -> None:
    """
    Routes a classified page into the correct bucket in CrawlResult.
    Logs the routing decision.
    """
    indent = "  " * depth

    if page.page_type == PageType.PRODUCT:
        result.product_pages.append(page)
        _log(depth, page.url,
             f"✅ PRODUCT — \"{page.title[:50]}\" "
             f"(conf={page.type_confidence:.2f})")

    elif page.page_type == PageType.ABOUT:
        result.about_pages.append(page)
        _log(depth, page.url, f"🏢 ABOUT — \"{page.title[:50]}\"")

    elif page.page_type == PageType.CONTACT:
        result.contact_pages.append(page)
        _log(depth, page.url, f"📞 CONTACT — \"{page.title[:50]}\"")

    elif page.page_type == PageType.CATEGORY:
        # Category pages are not extracted but we still crawl their links
        # (already handled in the main loop above)
        _log(depth, page.url, f"📂 CATEGORY — will crawl links inside")

    elif page.page_type == PageType.HOME:
        _log(depth, page.url, f"🏠 HOME — crawling links")

    else:
        result.ignored_pages.append(page)
        _log(depth, page.url,
             f"🚫 IGNORED ({page.page_type.value})")


# ─────────────────────────────────────────────
#  LOGGING
# ─────────────────────────────────────────────

def _log(depth: int, url: str, message: str) -> None:
    """Consistent indented logging for crawl progress."""
    indent = "  " * depth
    # Truncate long URLs for clean output
    display_url = url if len(url) <= 70 else url[:67] + "..."
    print(f"  {indent}[D{depth}] {display_url}")
    if message:
        print(f"  {indent}       {message}")