"""
api.py
------
FastAPI endpoint for the INTRADE24 input pipeline.

Exposes one primary endpoint:
    POST /pipeline/run

This is the handoff point between the AI pipeline (your side)
and the backend/DB layer (backend person's side).

The response contains everything needed to write to:
    - product_info.product_master  (one row per product)
    - product_info.company_preference  (one row per company, UPSERT)

Run this server:
    uvicorn input_pipeline.api:app --reload --port 8001

Then hit it:
    POST http://localhost:8001/pipeline/run
    Body: { "website_url": "https://nutrastrips.com" }
"""

import time
from typing import Optional
import uuid
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from input_pipeline.pipeline import run_pipeline


# ─────────────────────────────────────────────
#  APP SETUP
# ─────────────────────────────────────────────

app = FastAPI(
    title="INTRADE24 Input Pipeline API",
    description="Crawls a website and extracts structured product + company data",
    version="1.0.0",
)

# Allow requests from the frontend and backend services
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
#  REQUEST SCHEMA
#  What the backend sends TO us
# ─────────────────────────────────────────────

class PipelineRequest(BaseModel):
    """
    Request body for POST /pipeline/run

    Fields:
        website_url:   The company's website to crawl
        company_id:    The company's ID in your DB — backend passes this so
                       the response can be linked back to the right company
        user_id:       The user who triggered this run
        max_pages:     Optional override for crawl depth (default 150)
        run_semantic:  Whether to run LLM semantic scoring (default True)
    """
    website_url:  str
    company_id:   str                   # backend passes this — links response to DB row
    user_id:      str                   # who triggered this run
    max_pages:    Optional[int] = None  # override if needed
    run_semantic: bool = True           # set False for faster dev runs


# ─────────────────────────────────────────────
#  RESPONSE SCHEMAS
#  What we send BACK to the backend
# ─────────────────────────────────────────────

class MissingFieldSchema(BaseModel):
    field:      str
    penalty:    int
    suggestion: str


class ProductSchema(BaseModel):
    """
    One extracted product — maps directly to product_master table.
    Backend inserts one row per item in the `products` array.
    """
    # ── product_master columns ──────────────────
    product_name:       Optional[str]
    description:        Optional[str]
    category:           Optional[str]
    subcategory:        Optional[str]
    price:              Optional[str]
    packaging:          Optional[str]
    certifications:     list[str]
    moq:                Optional[str]
    hs_code:            Optional[str]
    ingredients:        Optional[str]
    specifications:     Optional[dict]
    variants:           list[str]
    images:             list[str]
    monthly_capacity:   Optional[str]
    source_url:         str             # which page this was extracted from

    # ── confidence fields (also saved to DB) ───
    confidence_score:   int             # 0–100
    confidence_tier:    str             # "high" | "medium" | "low"
    missing_fields:     list[MissingFieldSchema]
    extraction_notes:   str

    # ── display helper ──────────────────────────
    display_name:       str             # product_name ?? page_title ?? url
    is_ready:           bool            # passes minimum bar for intelligence engine


class CompanyPatchSchema(BaseModel):
    """
    Company data for UPSERT into company_preference table.
    Backend should PATCH only fields that are not None —
    never overwrite existing user-entered data with None.

    preference_patch contains ONLY the fields relevant to
    company_preference — already filtered, already non-null.
    """
    company_name:           Optional[str]
    country:                Optional[str]
    city:                   Optional[str]
    business_type:          Optional[str]
    industries_served:      list[str]
    export_markets:         list[str]
    export_experience:      Optional[str]
    certifications:         list[str]
    regulatory_approvals:   list[str]
    manufacturing_capacity: Optional[str]
    annual_turnover:        Optional[str]
    employee_count:         Optional[str]
    contact_email:          Optional[str]
    contact_phone:          Optional[str]
    linkedin_url:           Optional[str]
    founded_year:           Optional[int]
    extracted_from_urls:    list[str]

    # ── Ready-made DB patch ──────────────────────
    # Backend can use this dict directly for the PATCH query
    # It only contains fields that were actually found (no Nones)
    preference_patch:       dict


class CrawlStatsSchema(BaseModel):
    pages_fetched:  int
    pages_skipped:  int
    fetch_errors:   int
    product_pages:  int
    about_pages:    int
    contact_pages:  int


class PipelineResponse(BaseModel):
    """
    Full response from the pipeline.

    Structure:
        status:       "success" | "partial" | "failed"
        company_id:   echoed back from request (for DB linking)
        user_id:      echoed back from request
        products:     list of extracted products → insert into product_master
        company:      company data → upsert into company_preference
        stats:        crawl + scoring summary
        errors:       any non-fatal errors that occurred
        elapsed_sec:  total pipeline duration
    """
    status:       str                           # "success" | "partial" | "failed"
    company_id:   str                           # echoed from request
    user_id:      str                           # echoed from request
    website_url:  str

    # ── Core data ────────────────────────────────
    products:     list[ProductSchema]
    company:      Optional[CompanyPatchSchema]

    # ── Summary ──────────────────────────────────
    total_products:         int
    high_confidence_count:  int
    medium_confidence_count: int
    low_confidence_count:   int
    ready_for_analysis_count: int

    crawl_stats:  Optional[CrawlStatsSchema]
    errors:       list[str]
    elapsed_sec:  float


# ─────────────────────────────────────────────
#  ENDPOINT
# ─────────────────────────────────────────────

@app.post("/pipeline/run", response_model=PipelineResponse)
async def run_pipeline_endpoint(request: PipelineRequest):
    """
    Crawls the given website URL and extracts structured product
    and company data.

    Returns structured JSON ready for DB insertion.

    The backend should:
        1. Insert each item in `products` as a row in product_master
           (linked to company_id from request)
        2. UPSERT company.preference_patch into company_preference
           (only update non-null fields — never overwrite user data)
        3. Store confidence_score + confidence_tier per product
           (drives the 🟢🟠🔴 display in Step 2 UI)
    """

    # Run the full pipeline
    try:
        result = await run_pipeline(
            website_url=request.website_url,
            max_pages=request.max_pages,
            run_semantic=request.run_semantic,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Pipeline failed to start: {str(e)}"
        )

    # ── Determine status ─────────────────────────
    if not result.products and not result.company:
        status = "failed"
    elif result.errors:
        status = "partial"
    else:
        status = "success"

    # ── Serialize products ───────────────────────
    products_out = []
    for p in result.products:
        products_out.append(ProductSchema(
            product_name=p.product_name,
            description=p.description,
            category=p.category,
            subcategory=p.subcategory,
            price=p.price,
            packaging=p.packaging,
            certifications=p.certifications,
            moq=p.moq,
            hs_code=p.hs_code,
            ingredients=p.ingredients,
            specifications=p.specifications,
            variants=p.variants,
            images=p.images,
            monthly_capacity=p.monthly_capacity,
            source_url=p.source_url,
            confidence_score=p.confidence_score,
            confidence_tier=p.confidence_tier.value,
            missing_fields=[
                MissingFieldSchema(
                    field=m.field,
                    penalty=m.penalty,
                    suggestion=m.suggestion,
                )
                for m in p.missing_fields
            ],
            extraction_notes=p.extraction_notes,
            display_name=p.get_display_name(),
            is_ready=p.is_ready_for_analysis(),
        ))

    # ── Serialize company ────────────────────────
    company_out = None
    if result.company:
        c = result.company
        company_out = CompanyPatchSchema(
            company_name=c.company_name,
            country=c.country,
            city=c.city,
            business_type=c.business_type,
            industries_served=c.industries_served,
            export_markets=c.export_markets,
            export_experience=c.export_experience,
            certifications=c.certifications,
            regulatory_approvals=c.regulatory_approvals,
            manufacturing_capacity=c.manufacturing_capacity,
            annual_turnover=c.annual_turnover,
            employee_count=c.employee_count,
            contact_email=c.contact_email,
            contact_phone=c.contact_phone,
            linkedin_url=c.linkedin_url,
            founded_year=c.founded_year,
            extracted_from_urls=c.extracted_from_urls,
            preference_patch=c.to_preference_patch(),
        )

    # ── Serialize crawl stats ────────────────────
    crawl_stats = None
    if result.crawl_result:
        cr = result.crawl_result
        crawl_stats = CrawlStatsSchema(
            pages_fetched=cr.pages_fetched,
            pages_skipped=cr.pages_skipped,
            fetch_errors=cr.fetch_errors,
            product_pages=len(cr.product_pages),
            about_pages=len(cr.about_pages),
            contact_pages=len(cr.contact_pages),
        )

    return PipelineResponse(
        status=status,
        company_id=request.company_id,
        user_id=request.user_id,
        website_url=request.website_url,
        products=products_out,
        company=company_out,
        total_products=len(result.products),
        high_confidence_count=len(result.high_confidence()),
        medium_confidence_count=len(result.needs_review()),
        low_confidence_count=len(result.low_confidence()),
        ready_for_analysis_count=len(result.ready_for_analysis()),
        crawl_stats=crawl_stats,
        errors=result.errors,
        elapsed_sec=result.elapsed_sec,
    )


# ─────────────────────────────────────────────
#  HEALTH CHECK
# ─────────────────────────────────────────────

@app.get("/health")
async def health():
    """Simple health check so the backend can verify the service is up."""
    return {"status": "ok", "service": "intrade24-input-pipeline"}