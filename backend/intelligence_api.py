# """
# intelligence_api.py
# --------------------
# FastAPI endpoint for the INTRADE24 Intelligence Engine.

# Exposes the ModuleRunner as a single HTTP endpoint so the backend
# can trigger a full intelligence run and receive structured results.

# Endpoints:
#     POST /intelligence/run      — runs all 8 modules, returns full results
#     GET  /intelligence/health   — health check
#     GET  /intelligence/modules  — lists available modules + their status fields

# Run:
#     python -m uvicorn intelligence_api:app --reload --host 0.0.0.0 --port 8001

# Note: runs on port 8001 to avoid conflict with input pipeline API (port 8000).
# """

# import asyncio
# import traceback
# import uuid
# from typing import Optional,List

# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel, Field

# from modules.base_module import ModuleInput
# from module_runner import ModuleRunner


# # ─────────────────────────────────────────────
# #  APP SETUP
# # ─────────────────────────────────────────────

# app = FastAPI(
#     title="INTRADE24 Intelligence API",
#     description="Runs market intelligence modules for B2B export products.",
#     version="1.0.0",
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ─────────────────────────────────────────────
# #  REQUEST MODEL
# #  Mirrors ModuleInput — all fields except product_id (auto-generated)
# #  and product_name (required) are optional with sensible defaults.
# # ─────────────────────────────────────────────

# class IntelligenceRequest(BaseModel):
#     # Required
#     product_name:      str = Field(..., description="Product name e.g. 'Organic Turmeric Powder'")

#     # Product fields
#     product_id:        Optional[str]       = Field(None,   description="UUID — auto-generated if not provided")
#     category:          Optional[str]       = Field("",     description="e.g. 'Spices & Botanicals'")
#     hs_code:           Optional[str]       = Field("",     description="e.g. '091030'")
#     description:       Optional[str]       = Field("",     description="Product description")
#     certifications:    Optional[List[str]] = Field([],     description="e.g. ['USDA Organic', 'GMP']")
#     moq:               Optional[str]       = Field("",     description="e.g. '500 kg'")

#     # Company fields
#     company_name:      Optional[str]       = Field("",     description="Exporter company name")
#     origin_country:    Optional[str]       = Field("India",description="Country of manufacture")
#     target_country:    Optional[str]       = Field("United States",description= "Destination market")
#     business_type:     Optional[str]       = Field("Manufacturer & Exporter")
#     price_positioning: Optional[str]       = Field("Standard", description="Budget | Standard | Mid-range | Premium")
#     buyer_type:        Optional[str]       = Field("B2B",  description="B2B | B2C | Both")

#     # Runner config
#     # skip_keywords:     Optional[bool]      = Field(False,  description="Skip keyword module if Google Ads not configured")

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "product_name":     "Organic Turmeric Powder",
#                 "category":         "Spices & Botanicals",
#                 "hs_code":          "091030",
#                 "description":      "Premium organic turmeric powder with 95% curcuminoids.",
#                 "certifications":   ["USDA Organic", "GMP", "FSSAI"],
#                 "moq":              "500 kg",
#                 "company_name":     "GreenLeaf Exports",
#                 "origin_country":   "India",
#                 "target_country":   "United States",
#                 "business_type":    "Manufacturer & Exporter",
#                 "price_positioning":"Premium",
#                 "buyer_type":       "B2B",
#                 # "skip_keywords":    False,
#             }
#         }


# # ─────────────────────────────────────────────
# #  RESPONSE SERIALISER
# #  Converts RunnerResult into a clean JSON-serialisable dict.
# #  Each module returns its full data + success + error fields.
# # ─────────────────────────────────────────────

# def _safe_dict(obj) -> dict:
#     """Convert a dataclass/result object to dict, handling None."""
#     if obj is None:
#         return {}
#     if hasattr(obj, "to_db_row"):
#         return obj.to_db_row()
#     if hasattr(obj, "__dict__"):
#         return {k: v for k, v in obj.__dict__.items() if not k.startswith("_")}
#     return {}


# def _serialise_result(result, request: IntelligenceRequest) -> dict:
#     """
#     Builds the full response payload from RunnerResult.
#     Each module section includes: success, error, data (all fields).
#     """

#     def _module_block(name: str, obj) -> dict:
#         status = result.statuses.get(name)
#         block = {
#             "success": status.status == "done" if status else False,
#             "elapsed_seconds": status.elapsed if status else None,
#             "error":   status.error if status else None,
#         }
#         if obj is None:
#             return block

#         # Variants formats — has .variants list
#         if name == "variants_formats" and hasattr(obj, "variants"):
#             block["data"] = {
#                 "product_id": obj.product_id,
#                 "variants": [
#                     {
#                         "variant_name":      v.variant_name,
#                         "tag":               v.tag,
#                         "opportunity_score": v.opportunity_score,
#                         "key_spec":          v.key_spec,
#                         "price_range":       v.price_range,
#                         "moq":               v.moq,
#                         "buyer_demand":      v.buyer_demand,
#                         "matched_buyers":    v.matched_buyers,
#                         "lead_time":         v.lead_time,
#                         "analysis_note":     v.analysis_note,
#                     }
#                     for v in obj.variants
#                 ],
#             }
#             return block

#         # Buyer discovery — has .buyers list
#         if name == "buyer_discovery" and hasattr(obj, "buyers"):
#             block["data"] = {
#                 "product_id":     obj.product_id,
#                 "target_country": obj.target_country,
#                 "is_fallback":    obj.is_fallback(),
#                 "buyers": [b.to_dict() for b in obj.buyers],
#             }
#             return block

#         # Competitor discovery — has .competitors list
#         if name == "competitor_discovery" and hasattr(obj, "competitors"):
#             block["data"] = {
#                 "product_id":   obj.product_id,
#                 "is_fallback":  obj.is_fallback(),
#                 "competitors":  [c.to_dict() for c in obj.competitors],
#             }
#             return block

#         # Keyword intel — has 3 keyword lists
#         if name == "keyword_intel" and hasattr(obj, "high_volume_buyer_intent"):
#             def _kw(k):
#                 d = {"keyword": k.keyword, "search_volume": k.search_volume,
#                      "competition": k.competition, "competition_index": getattr(k, "competition_index", None),
#                      "gap": k.gap}
#                 if hasattr(k, "language"):
#                     d["language"] = k.language
#                 return d
#             block["data"] = {
#                 "product_id":               obj.product_id,
#                 "target_country":           obj.target_country,
#                 "high_volume_buyer_intent": [_kw(k) for k in obj.high_volume_buyer_intent],
#                 "low_competition_gaps":     [_kw(k) for k in obj.low_competition_gaps],
#                 "multilingual":             [_kw(k) for k in obj.multilingual],
#             }
#             return block

#         # Email sequence — has .emails list
#         if name == "email_sequence" and hasattr(obj, "emails"):
#             block["data"] = {
#                 "product_id":     obj.product_id,
#                 "target_country": obj.target_country,
#                 "buyer_type":     obj.buyer_type,
#                 "sequence_note":  obj.sequence_note,
#                 "emails": [
#                     {
#                         "send_day":   e.send_day,
#                         "type_label": e.type_label,
#                         "goal":       e.goal,
#                         "subject":    e.subject,
#                         "body":       e.body,
#                         "tiles":      e.tiles,
#                     }
#                     for e in obj.emails
#                 ],
#             }
#             return block

#         # Ad concepts — has .concepts list
#         if name == "ad_concepts" and hasattr(obj, "concepts"):
#             block["data"] = {
#                 "product_id":     obj.product_id,
#                 "target_country": obj.target_country,
#                 "concepts": [
#                     {
#                         "market":       c.market,
#                         "angle":        c.angle,
#                         "hook":         c.hook,
#                         "description":  c.description,
#                         "tiles":        c.tiles,
#                         "border_color": c.border_color,
#                     }
#                     for c in obj.concepts
#                 ],
#             }
#             return block

#         # Market demand + trade intel — have .data dict
#         if hasattr(obj, "data") and isinstance(obj.data, dict):
#             block["data"] = obj.data
#             return block

#         # Fallback
#         block["data"] = _safe_dict(obj)
#         return block

#     return {
#         "run_id":       str(uuid.uuid4()),
#         "product_id":   request.product_id,
#         "product_name": request.product_name,
#         "target_country": request.target_country,
#         "summary":      result.summary(),
#         "modules": {
#             "market_demand":        _module_block("market_demand",        result.market_demand),
#             "trade_intel":          _module_block("trade_intel",          result.trade_intel),
#             "buyer_discovery":      _module_block("buyer_discovery",      result.buyer_discovery),
#             "variants_formats":     _module_block("variants_formats",     result.variants_formats),
#             "competitor_discovery": _module_block("competitor_discovery", result.competitor_discovery),
#             "keyword_intel":        _module_block("keyword_intel",        result.keyword_intel),
#             "email_sequence":       _module_block("email_sequence",       result.email_sequence),
#             "ad_concepts":          _module_block("ad_concepts",          result.ad_concepts),
#         },
#     }


# # ─────────────────────────────────────────────
# #  ENDPOINTS
# # ─────────────────────────────────────────────

# @app.get("/intelligence/health")
# async def health():
#     return {"status": "ok", "service": "INTRADE24 Intelligence API"}


# @app.get("/intelligence/modules")
# async def list_modules():
#     """Lists all available modules and their output fields."""
#     return {
#         "modules": [
#             {"name": "market_demand",        "description": "Demand growth, import volume, buyer demand, cert gaps"},
#             {"name": "trade_intel",          "description": "Global trade value, top exporters/importers, pricing tiers"},
#             {"name": "buyer_discovery",      "description": "Top 10 buyer companies in target country"},
#             {"name": "variants_formats",     "description": "6 market variants with specs, pricing, demand tags"},
#             {"name": "competitor_discovery", "description": "Top 10 global competing manufacturers"},
#             {"name": "keyword_intel",        "description": "B2B keywords: buyer intent, gap, multilingual"},
#             {"name": "email_sequence",       "description": "3-step B2B cold outreach email sequence"},
#             {"name": "ad_concepts",          "description": "6 creative ad concepts with hooks and descriptions"},
#         ]
#     }


# @app.post("/intelligence/run")
# async def run_intelligence(request: IntelligenceRequest):
#     """
#     Run all intelligence modules for a product.

#     Takes 20–90 seconds depending on Sonar response times.
#     Returns full results for all 8 modules when complete.

#     Failed modules are included in the response with success=false
#     and an error message — they do not cause the endpoint to fail.
#     """
#     # Auto-generate product_id if not provided
#     product_id = request.product_id or str(uuid.uuid4())

#     # Build ModuleInput
#     try:
#         inp = ModuleInput(
#             product_id=        product_id,
#             product_name=      request.product_name,
#             category=          request.category or "",
#             hs_code=           request.hs_code or "",
#             description=       request.description or "",
#             certifications=    request.certifications or [],
#             origin_country=    request.origin_country or "India",
#             target_country=    request.target_country or "United States",
#             company_name=      request.company_name or "",
#             business_type=     request.business_type or "Manufacturer & Exporter",
#             price_positioning= request.price_positioning or "Standard",
#             moq=               request.moq or "",
#             buyer_type=        request.buyer_type or "B2B",
#         )
#     except Exception as e:
#         raise HTTPException(status_code=422, detail=f"Invalid input: {e}")

#     # Run all modules
#     try:
#         runner = ModuleRunner()
#         result = await runner.run_all(inp)
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(
#             status_code=500,
#             detail=f"Runner failed: {type(e).__name__}: {str(e)}"
#         )

#     # Serialise and return
#     return _serialise_result(result, request)


import asyncio
import traceback
import uuid
from typing import Optional, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from modules.base_module import ModuleInput
from module_runner import ModuleRunner


# ─────────────────────────────────────────────
#  APP SETUP
# ─────────────────────────────────────────────

app = FastAPI(
    title="INTRADE24 Intelligence API",
    description="Runs market intelligence modules for B2B export products.",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
#  REQUEST MODEL
# ─────────────────────────────────────────────

class IntelligenceRequest(BaseModel):
    product_name: str = Field(...)

    product_id: Optional[str] = None
    category: Optional[str] = ""
    hs_code: Optional[str] = ""
    description: Optional[str] = ""
    certifications: Optional[List[str]] = []
    moq: Optional[str] = ""

    company_name: Optional[str] = ""
    origin_country: Optional[str] = "India"
    target_country: Optional[str] = "United States"
    business_type: Optional[str] = "Manufacturer & Exporter"
    price_positioning: Optional[str] = "Standard"
    buyer_type: Optional[str] = "B2B"


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _safe_dict(obj) -> dict:
    if obj is None:
        return {}
    if hasattr(obj, "to_db_row"):
        return obj.to_db_row()
    if hasattr(obj, "__dict__"):
        return {k: v for k, v in obj.__dict__.items() if not k.startswith("_")}
    return {}


# ─────────────────────────────────────────────
#  SERIALIZER
# ─────────────────────────────────────────────

def _serialise_result(result, request: IntelligenceRequest) -> dict:

    def _module_block(name: str, obj) -> dict:
        status = result.statuses.get(name)

        block = {
            "success": status.status == "done" if status else False,
            "elapsed_seconds": status.elapsed if status else None,
            "error": status.error if status else None,
        }

        if obj is None:
            return block

        # Variants
        if name == "variants_formats" and hasattr(obj, "variants"):
            block["data"] = {
                "product_id": obj.product_id,
                "variants": [
                    {
                        "variant_name": v.variant_name,
                        "tag": v.tag,
                        "opportunity_score": v.opportunity_score,
                        "key_spec": v.key_spec,
                        "price_range": v.price_range,
                        "moq": v.moq,
                        "buyer_demand": v.buyer_demand,
                        "matched_buyers": v.matched_buyers,
                        "lead_time": v.lead_time,
                        "analysis_note": v.analysis_note,
                    }
                    for v in obj.variants
                ],
            }
            return block

        # Buyer
        if name == "buyer_discovery" and hasattr(obj, "buyers"):
            block["data"] = {
                "product_id": obj.product_id,
                "target_country": obj.target_country,
                "is_fallback": obj.is_fallback(),
                "buyers": [b.to_dict() for b in obj.buyers],
            }
            return block

        # Competitors
        if name == "competitor_discovery" and hasattr(obj, "competitors"):
            block["data"] = {
                "product_id": obj.product_id,
                "is_fallback": obj.is_fallback(),
                "competitors": [c.to_dict() for c in obj.competitors],
            }
            return block

        # Keywords
        if name == "keyword_intel" and hasattr(obj, "high_volume_buyer_intent"):
            def _kw(k):
                d = {
                    "keyword": k.keyword,
                    "search_volume": k.search_volume,
                    "competition": k.competition,
                    "competition_index": getattr(k, "competition_index", None),
                    "gap": k.gap,
                }
                if hasattr(k, "language"):
                    d["language"] = k.language
                return d

            block["data"] = {
                "product_id": obj.product_id,
                "target_country": obj.target_country,
                "high_volume_buyer_intent": [_kw(k) for k in obj.high_volume_buyer_intent],
                "low_competition_gaps": [_kw(k) for k in obj.low_competition_gaps],
                "multilingual": [_kw(k) for k in obj.multilingual],
            }
            return block

        # Emails
        if name == "email_sequence" and hasattr(obj, "emails"):
            block["data"] = {
                "product_id": obj.product_id,
                "target_country": obj.target_country,
                "buyer_type": obj.buyer_type,
                "sequence_note": obj.sequence_note,
                "emails": [
                    {
                        "send_day": e.send_day,
                        "type_label": e.type_label,
                        "goal": e.goal,
                        "subject": e.subject,
                        "body": e.body,
                        "tiles": e.tiles,
                    }
                    for e in obj.emails
                ],
            }
            return block

        # Ads
        if name == "ad_concepts" and hasattr(obj, "concepts"):
            block["data"] = {
                "product_id": obj.product_id,
                "target_country": obj.target_country,
                "concepts": [
                    {
                        "market": c.market,
                        "angle": c.angle,
                        "hook": c.hook,
                        "description": c.description,
                        "tiles": c.tiles,
                        "border_color": c.border_color,
                    }
                    for c in obj.concepts
                ],
            }
            return block

        # Generic dict
        if hasattr(obj, "data") and isinstance(obj.data, dict):
            block["data"] = obj.data
            return block

        block["data"] = _safe_dict(obj)
        return block

    # ✅ SCORING BLOCK
    scoring = getattr(result, "scoring", None)
    scoring_block = {}

    if scoring and getattr(scoring, "success", False):
        scoring_block = {
            "overall_score": scoring.overall_score,
            "scores": [
                {
                    "dimension": s.dimension,
                    "label": s.label,
                    "score": s.score,
                    "sublabel": s.sublabel,
                    "color": s.color,
                }
                for s in scoring.scores
            ],
            "urgent_note": scoring.urgent_note,
            "action_cards": [
                {
                    "timing": a.timing,
                    "title": a.title,
                    "body": a.body,
                }
                for a in scoring.action_cards
            ],
        }

    return {
        "run_id": str(uuid.uuid4()),
        "product_id": getattr(result, "product_id", request.product_id),
        "product_name": request.product_name,
        "target_country": request.target_country,
        "summary": result.summary(),
        "scoring": scoring_block,  # ✅ ADDED
        "modules": {
            "market_demand": _module_block("market_demand", result.market_demand),
            "trade_intel": _module_block("trade_intel", result.trade_intel),
            "buyer_discovery": _module_block("buyer_discovery", result.buyer_discovery),
            "variants_formats": _module_block("variants_formats", result.variants_formats),
            "competitor_discovery": _module_block("competitor_discovery", result.competitor_discovery),
            "keyword_intel": _module_block("keyword_intel", result.keyword_intel),
            "email_sequence": _module_block("email_sequence", result.email_sequence),
            "ad_concepts": _module_block("ad_concepts", result.ad_concepts),
        },
    }


# ─────────────────────────────────────────────
#  ENDPOINTS
# ─────────────────────────────────────────────

@app.get("/intelligence/health")
async def health():
    return {"status": "ok"}


@app.get("/intelligence/modules")
async def list_modules():
    return {
        "modules": [
            {"name": "market_demand"},
            {"name": "trade_intel"},
            {"name": "buyer_discovery"},
            {"name": "variants_formats"},
            {"name": "competitor_discovery"},
            {"name": "keyword_intel"},
            {"name": "email_sequence"},
            {"name": "ad_concepts"},
        ]
    }


@app.post("/intelligence/run")
async def run_intelligence(request: IntelligenceRequest):

    product_id = request.product_id or str(uuid.uuid4())

    try:
        inp = ModuleInput(
            product_id=product_id,
            product_name=request.product_name,
            category=request.category or "",
            hs_code=request.hs_code or "",
            description=request.description or "",
            certifications=request.certifications or [],
            origin_country=request.origin_country or "India",
            target_country=request.target_country or "United States",
            company_name=request.company_name or "",
            business_type=request.business_type or "Manufacturer & Exporter",
            price_positioning=request.price_positioning or "Standard",
            moq=request.moq or "",
            buyer_type=request.buyer_type or "B2B",
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        runner = ModuleRunner()
        result = await runner.run_all(inp)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    return _serialise_result(result, request)
