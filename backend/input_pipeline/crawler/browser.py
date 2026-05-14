"""
crawler/browser.py
------------------
Handles all Playwright browser lifecycle and page fetching.
Single responsibility: launch browser, fetch a page, return RawPage.

Nothing about crawl logic, link extraction, or classification lives here.
This module is only about reliably getting HTML from a URL.

Usage:
    async with BrowserSession() as session:
        raw_page = await session.fetch(url, depth=1)
"""

import asyncio
import os
import random
from urllib.parse import urlparse
from playwright.async_api import async_playwright, Browser, BrowserContext, Page

from input_pipeline.config import CRAWLER
from input_pipeline.models.page import RawPage


# ─────────────────────────────────────────────
#  BROWSER SESSION
# ─────────────────────────────────────────────

class BrowserSession:
    """
    Async context manager that owns a single Playwright browser + context
    for the duration of a crawl session.

    One BrowserSession per crawl run — do not create a new one per page.
    The same context is reused across all page fetches which is faster
    and avoids memory leaks.

    Example:
        async with BrowserSession() as session:
            page1 = await session.fetch("https://example.com", depth=0)
            page2 = await session.fetch("https://example.com/products", depth=1)
    """

    def __init__(self):
        self._playwright = None
        self._browser: Browser | None = None
        self._context: BrowserContext | None = None

    async def __aenter__(self) -> "BrowserSession":
        self._playwright = await async_playwright().start()
        executable_path = os.getenv("PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH")
        self._browser = await self._playwright.chromium.launch(
            headless=True,
            executable_path=executable_path,
            args=["--no-sandbox", "--disable-setuid-sandbox"],
        )
        self._context = await self._browser.new_context(
            viewport=CRAWLER["viewport"],
            user_agent=CRAWLER["user_agent"],
            # Block images/fonts to speed up crawl
            # We only need text content
        )

        # Block unnecessary resource types to speed up loading
        await self._context.route(
            "**/*",
            _block_non_essential_resources
        )

        return self

    async def __aexit__(self, *args):
        if self._context:
            await self._context.close()
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()

    async def fetch(self, url: str, depth: int = 0) -> RawPage:
        """
        Fetches a single URL and returns a RawPage.

        Args:
            url:   Full URL to fetch (must start with http/https)
            depth: Crawl depth from start URL (0 = homepage)

        Returns:
            RawPage with html, title, status populated.
            On failure, RawPage.error is set and html is empty string.
        """
        if self._context is None:
            raise RuntimeError("BrowserSession not started — use as async context manager")

        path = urlparse(url).path or "/"
        page: Page = await self._context.new_page()

        try:
            response = await page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=CRAWLER["page_timeout_ms"],
            )

            # ── Jitter before content capture (depth > 0 only) ──
            # Spreads parallel requests to the same domain — avoids bot fingerprinting
            if depth > 0:
                jitter_min, jitter_max = CRAWLER["request_jitter_ms"]
                await asyncio.sleep(random.randint(jitter_min, jitter_max) / 1000)

            # ── Wait for JS to settle ─────────────────────────
            # Homepage gets longer networkidle wait (SPA detection).
            # Inner pages use a shorter timeout — most B2B sites are server-rendered.
            try:
                idle_timeout = 3000 if depth == 0 else 1500
                await page.wait_for_load_state("networkidle", timeout=idle_timeout)
            except Exception:
                pass  # static page or timed out — continue anyway

            # ── Click open accordions (product pages only) ────
            # Skip on home/category pages — only worth doing on product detail pages.
            if depth > 0:
                try:
                    accordion_selectors = [
                        ".elementor-tab-title",
                        ".woocommerce-tabs .tabs li a",
                        "[data-toggle='collapse']",
                        ".MuiAccordionSummary-root",
                        "details summary",
                    ]
                    for selector in accordion_selectors:
                        buttons = await page.query_selector_all(selector)
                        for button in buttons:
                            try:
                                await button.click()
                                await page.wait_for_timeout(150)
                            except Exception:
                                pass
                except Exception:
                    pass

            # ── Final wait — adaptive by depth ───────────────
            # Homepage: longer wait for SPA frameworks to fully mount.
            # All other pages: short wait — server-rendered content is ready immediately.
            wait_ms = CRAWLER["wait_after_load_home"] if depth == 0 else CRAWLER["wait_after_load"]
            await page.wait_for_timeout(wait_ms)

            # Use outerHTML to get fully JS-rendered DOM (not pre-JS shell)
            html       = await page.evaluate("document.documentElement.outerHTML")
            inner_text = await page.inner_text("body")
            title  = await _safe_get_title(page)
            status = response.status if response else 200

            return RawPage(
                url=url,
                path=path,
                title=title,
                html=html,
                inner_text=inner_text,
                depth=depth,
                status=status,
            )

        except Exception as e:
            error_msg = f"{type(e).__name__}: {str(e)[:120]}"
            return RawPage(
                url=url,
                path=path,
                title="",
                html="",
                depth=depth,
                status=0,
                error=error_msg,
            )

        finally:
            # Always close the page to free memory
            await page.close()

    async def fetch_many(
        self,
        urls: list[tuple[str, int]],
        concurrency: int = 3,
    ) -> list[RawPage]:
        """
        Fetches multiple URLs with controlled concurrency.

        Args:
            urls:        List of (url, depth) tuples
            concurrency: Max simultaneous page fetches (keep ≤ 3 to avoid blocks)

        Returns:
            List of RawPage in same order as input urls.
        """
        semaphore = asyncio.Semaphore(concurrency)

        async def _fetch_with_semaphore(url: str, depth: int, index: int) -> RawPage:
            # Stagger task starts so concurrent requests don't all fire simultaneously
            if index > 0:
                await asyncio.sleep(index * 0.15)   # 150ms between task starts
            async with semaphore:
                return await self.fetch(url, depth)

        tasks = [
            _fetch_with_semaphore(url, depth, i)
            for i, (url, depth) in enumerate(urls)
        ]
        return await asyncio.gather(*tasks)


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

async def _block_non_essential_resources(route, request):
    """
    Intercept and block resource types that don't affect text content.
    Speeds up page loads significantly on media-heavy sites.
    """
    BLOCKED_TYPES = {"image", "media", "font"}

    if request.resource_type in BLOCKED_TYPES:
        await route.abort()
    else:
        await route.continue_()


async def _safe_get_title(page: Page) -> str:
    """
    Gets page title without raising — some pages have broken title tags.
    """
    try:
        return await page.title()
    except Exception:
        return ""