"""
config.py
---------
Central configuration for the entire input pipeline.
All constants, signals, patterns, and settings live here.
Nothing is hardcoded anywhere else — always import from here.

Usage:
    from input_pipeline.config import CRAWLER, LLM, SKIP_PATTERNS
"""

from pathlib import Path
from typing import List,Dict

# ─────────────────────────────────────────────
#  PROJECT PATHS
# ─────────────────────────────────────────────

BASE_DIR    = Path(__file__).resolve().parent
OUTPUT_DIR  = BASE_DIR / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


# ─────────────────────────────────────────────
#  CRAWLER SETTINGS
# ─────────────────────────────────────────────

CRAWLER = {
    "max_depth":        3,
    "max_pages":        50,

    "page_timeout_ms":       30_000,      # ✅ 30s (was 20s)
    "wait_after_load":       1000,        # ✅ 1s (was 300ms)
    "wait_after_load_home":  3000,        # ✅ 3s (was 1500ms)
    "request_jitter_ms":     (500, 1500), # ✅ more jitter (was 100-400ms)
    "crawl_concurrency":     3,           # ✅ reduce parallel (was 5)
    "viewport":              {"width": 1440, "height": 900},
    "user_agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"  # ✅ newer Chrome version
    ),
    "depth_budget": {
        "product":  3,
        "category": 2,
        "about":    1,
        "contact":  1,
        "home":     1,
        "blog":     0,
        "ignore":   0,
    },
}


# ─────────────────────────────────────────────
#  URL PATTERNS — what to skip entirely
# ─────────────────────────────────────────────

SKIP_PATTERNS: List[str] = [
    # Auth / account
    "login", "signin", "sign-in", "signup", "sign-up",
    "register", "logout", "account", "password", "reset",
    # Commerce noise
    "cart", "checkout", "wishlist", "order", "invoice",
    # Legal / misc
    "terms", "privacy", "cookie", "sitemap", "disclaimer",
    "refund", "shipping", "returns",
    # Static assets
    "cdn", "static", "assets", "wp-content", "wp-includes",
    ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp",
    ".zip", ".xml", ".css", ".js",
    # Support
    "faq", "support", "help", "404", "403", "error",
    # Protocols
    "#", "mailto:", "tel:", "javascript:", "whatsapp:",
    # Specific noisy sections
    "blog", "news", "press", "videos", "videos-single",
    "gallery", "testimonial", "career", "jobs",
    "search", "tag", "author", "brochures", "formulations", "ingredients-books","ingredient-books"
    "catelogue-brochures", "partner-program", "partners"
]


# ─────────────────────────────────────────────
#  URL SIGNALS — page type classification
# ─────────────────────────────────────────────

# Strong indicators of a product / ingredient / offering page
PRODUCT_URL_SIGNALS: List[str] = [
    "product", "product-single", "product_detail",
    "item", "items", "sku",
    "shop", "store",
    "catalog", "catalogue",
    "collection", "collections",
    "ingredient", "ingredients",
    "formula", "formulas",
    "range", "ranges",
    "offering", "offerings",
    "solution", "solutions",
    "service", "services",
    "detail", "details",
    "specification", "specifications",
    "/p/", "/p-", "-p-",
]

# Indicators of a listing / category page (NOT a single product page)
CATEGORY_URL_SIGNALS: List[str] = [
    "category", "categories", "product-category"
    "all-products", "all_products",
    "collections",
    "filter", "brand", "tag",
    "department", "segment",
]

# Indicators of an about / company page
ABOUT_URL_SIGNALS: List[str] = [
    "about", "about-us", "about_us",
    "company", "who-we-are", "our-story",
    "overview", "profile", "vision", "mission",
    "history", "team", "management",
    "infrastructure", "facility", "facilities",
    "manufacturing", "certifications", "quality",
    "export", "exports",
]

# Indicators of a contact page
CONTACT_URL_SIGNALS: List[str] = [
    "contact", "contact-us", "contact_us",
    "get-in-touch", "reach-us", "enquiry",
    "inquiry", "location", "locations",
    "office", "offices",
]


# ─────────────────────────────────────────────
#  CONTENT SIGNALS — page type from HTML
# ─────────────────────────────────────────────

# Text found on the page body that confirms it's a product page
PRODUCT_CONTENT_SIGNALS: List[str] = [
    "add to cart", "buy now", "add to enquiry",
    "request a quote", "get quote", "send enquiry",
    "price", "per kg", "per unit", "per mt", "per ton",
    "moq", "minimum order", "minimum order quantity",
    "sku", "in stock", "out of stock", "availability",
    "hsn code", "hs code", "hs no",
    "certifications", "certified",
    "packaging", "pack size", "pack type",
    "ingredients", "composition", "formulation",
    "specification", "technical data", "coa",
    "encapsulation", "extract", "powder", "oil", "resin", "capsule"  # product-type words
]

# Minimum number of product content signals to confirm it's a product page
PRODUCT_CONTENT_SIGNAL_THRESHOLD: int = 6

# Text found on the page that confirms it's an about page
ABOUT_CONTENT_SIGNALS: List[str] = [
    "founded", "established", "since",
    "our company", "about us", "who we are",
    "our story", "our journey", "our mission",
    "manufacturer", "exporter", "supplier",
    "iso certified", "gmp certified",
    "years of experience", "decades",
    "export to", "exporting to", "clients worldwide",
]

ABOUT_CONTENT_SIGNAL_THRESHOLD: int = 2


# ─────────────────────────────────────────────
#  CONTENT CLEANER SETTINGS
# ─────────────────────────────────────────────

CLEANER = {
    # Minimum word count for a page to be worth processing
    "min_word_count":           30,

    # Maximum characters of clean text to send to LLM
    # (keeps token costs low — product pages rarely need more than this)
    "max_chars_for_extraction": 7000,

    # Snippet length for display in UI (Step 2 product list)
    "snippet_length":           300,

    # trafilatura settings
    "trafilatura": {
        "include_tables":   True,
        "include_links":    False,
        "no_fallback":      False,   # use fallback extractor if trafilatura fails
    },
}


# ─────────────────────────────────────────────
#  LLM SETTINGS
# ─────────────────────────────────────────────

LLM = {
    # Model used for structured extraction (product + company)
    "extraction_model":     "gpt-4o-mini",      # fast + cheap for extraction

    # Model used for semantic confidence scoring
    "scoring_model":        "gpt-4o-mini",

    # Model used for module 6 (Marketing Engine) — pure generation
    "generation_model":     "gpt-4o",

    # Perplexity Sonar — used for modules 1–5 (real-time research)
    "sonar_model":          "sonar",             # perplexity sonar model name

    # Token limits
    "extraction_max_tokens":    1000,
    "scoring_max_tokens":       300,
    "generation_max_tokens":    4000,

    # Temperature
    "extraction_temperature":   0.0,    # deterministic for structured output
    "scoring_temperature":      0.0,
    "generation_temperature":   0.7,    # creative for marketing copy

    # Retry settings
    "max_retries":          3,
    "retry_delay_sec":      2,
}


# ─────────────────────────────────────────────
#  CONFIDENCE SCORING WEIGHTS
# ─────────────────────────────────────────────

# Each field carries a weight — if missing, that many points are deducted
# Total of all weights = 100
CONFIDENCE_FIELD_WEIGHTS: Dict[str, int] = {
    # Core — always expected (high penalty if missing)
    "product_name":    40,
    "description":      30,
    "category":         15,

    # High value
    "price":            5,
    "packaging":        2,
    "certifications":   3,
    "moq":              2,

    # Medium value
    "hs_code":           1,
    "ingredients":       2,

    # Low value
    #"images":            2,
    #"specifications":    1,
}

# Tier thresholds (maps score → ConfidenceTier)
CONFIDENCE_THRESHOLDS = {
    "high":     60,     # 80–100  → green
    "medium":   40,     # 50–79   → orange, needs review
    # below 50  → red, enter manually
}


# ─────────────────────────────────────────────
#  CACHE SETTINGS (Redis)
# ─────────────────────────────────────────────

CACHE = {
    "ttl_seconds": {
        "market_demand":    172_800,    # 48 hours
        "keywords":         172_800,    # 48 hours
        "trade":            172_800,    # 48 hours
        "buyers":            86_400,    # 24 hours
        "competitors":       86_400,    # 24 hours
        "pricing":          172_800,    # 48 hours
    }
}

# ─────────────────────────────────────────────────────────────────────────────
# ADD THESE BLOCKS TO YOUR EXISTING config.py
# ─────────────────────────────────────────────────────────────────────────────
 
# Google Ads API config (used by keyword_intel.py)
# yaml_path     : path to your google-ads.yaml file
# customer_id   : your Google Ads customer ID (digits only, no dashes)
GOOGLE_ADS = {
    "yaml_path":             str(Path(__file__).resolve().parent.parent / "google_ads.yaml"),
    "customer_id":           "1143624949",                 # from .env GOOGLE_ADS_CUSTOMER_ID
    "max_keywords_per_seed": 20,
    "language_constant":     "languageConstants/1000",           # default: English
}
 
# Marketing Kit LLM settings
# Keywords:     gpt-4o-mini (classification, temp=0.0)
# Emails:       gpt-4o (creative, temp=0.8)
# Ad Concepts:  gpt-4o (highest creativity, temp=0.9)
MARKETING_KIT = {
    "keyword_classify_model":    "gpt-4o-mini",
    "keyword_classify_temp":     0.0,
    "keyword_multilingual_temp": 0.3,
    "email_model":               "gpt-4o",
    "email_temp":                0.8,
    "email_max_tokens":          2500,
    "ad_model":                  "gpt-4o",
    "ad_temp":                   0.9,
    "ad_max_tokens":             3000,
}
 
# DB table names (marketing kit)
# Add to your existing DB_TABLES dict or reference separately
MARKETING_KIT_TABLES = {
    "keyword_intelligence": "product_info.keyword_intelligence",
    "email_sequence":       "product_info.email_sequence",
    "ad_concepts":          "product_info.ad_concepts",
}
 
 