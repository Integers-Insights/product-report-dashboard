from pydantic import BaseModel,EmailStr,HttpUrl,Field
from typing import Optional, List,Dict

class UpdateCompanyRequest(BaseModel):
    company_name:  Optional[str] = None
    business_type: Optional[str] = None
    industry:      Optional[str] = None

class SubscriptionPaymentVerifyRequest(BaseModel):
    razorpay_order_id:   str
    razorpay_payment_id: str
    razorpay_signature:  str

class Step1Request(BaseModel):
    full_name:Optional[str]
    company_name:Optional[str]
    headquarters_country: str
    industry: str
    company_type: str
    years_in_industry: Optional[str]
    website: Optional[str]

class IntelligenceRequest(BaseModel):
    # Required
    product_name:      str = Field(..., description="Product name e.g. 'Organic Turmeric Powder'")

    # Product fields
    product_id:        Optional[str]       = Field(None,   description="UUID — auto-generated if not provided")
    category:          Optional[str]       = Field("",     description="e.g. 'Spices & Botanicals'")
    hs_code:           Optional[str]       = Field("",     description="e.g. '091030'")
    description:       Optional[str]       = Field("",     description="Product description")
    certifications:    Optional[List[str]] = Field([],     description="e.g. ['USDA Organic', 'GMP']")
    moq:               Optional[str]       = Field("",     description="e.g. '500 kg'")

    # Company fields
    company_name:      Optional[str]       = Field("",     description="Exporter company name")
    origin_country:    Optional[str]       = Field("India",description="Country of manufacture")
    target_country:    Optional[str]       = Field("United States",description= "Destination market")
    business_type:     Optional[str]       = Field("Manufacturer & Exporter")
    price_positioning: Optional[str]       = Field("Standard", description="Budget | Standard | Mid-range | Premium")
    buyer_type:        Optional[str]       = Field("B2B",  description="B2B | B2C | Both")


class Step2Request(BaseModel):
    product_type: List[str]
    sales_intent: str
    buyer_type: str
    price_positioning: Optional[List[str]]

class CertificationSchema(BaseModel):

    quality_manufacturing: Optional[List[str]] = None
    food_agriculture_organic: Optional[List[str]] = None
    pharma_health_safety: Optional[List[str]] = None
    religion_ethics_lifestyle: Optional[List[str]] = None
    technology_digital: Optional[List[str]] = None

class Step3Request(BaseModel):
    primary_goal: List[str]
    certifications: Optional[CertificationSchema]
    referral_source: Optional[str]

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    company_name: str
    full_name: Optional[str] = None
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class CreateUserRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

class GoogleAuthRequest(BaseModel):
    token: str
    #company_name: str

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class PipelineRequest(BaseModel):
    website_url: HttpUrl   # better than str (validates URL)

class MissingFieldSchema(BaseModel):
    field:      str
    penalty:    int
    suggestion: str


class ProductSchema(BaseModel):

    # ── product_master columns ──────────────────
    product_name:       Optional[str]
    description:        Optional[str]
    category:           Optional[str]
    subcategory:        Optional[str]
    price:              Optional[str]
    packaging:          Optional[str]
    certifications:     List[str]
    moq:                Optional[str]
    hs_code:            Optional[str]
    ingredients:        Optional[str]
    specifications:     Optional[dict]
    variants:           List[str]
    images:             List[str]
    monthly_capacity:   Optional[str]
    source_url:         str             # which page this was extracted from
    failure_reason:Optional[str]=None
    confidence_score:   int             # 0–100
    confidence_tier:    str             # "high" | "medium" | "low"
    missing_fields:     List[MissingFieldSchema]
    extraction_notes:   str

    # ── display helper ──────────────────────────
    display_name:       str             # product_name ?? page_title ?? url
    is_ready:           bool            # passes minimum bar for intelligence engine


class CompanyPatchSchema(BaseModel):

    company_name:           Optional[str]
    country:                Optional[str]
    city:                   Optional[str]
    business_type:          Optional[str]
    industries_served:      List[str]
    export_markets:         List[str]
    export_experience:      Optional[str]
    certifications:         List[str]
    regulatory_approvals:   List[str]
    manufacturing_capacity: Optional[str]
    annual_turnover:        Optional[str]
    employee_count:         Optional[str]
    contact_email:          Optional[str]
    contact_phone:          Optional[str]
    linkedin_url:           Optional[str]
    founded_year:           Optional[int]
    extracted_from_urls:    List[str]
    preference_patch:       dict

class CrawlStatsSchema(BaseModel):
    pages_fetched:  int
    pages_skipped:  int
    fetch_errors:   int
    product_pages:  int
    about_pages:    int
    contact_pages:  int

class PipelineResponse(BaseModel):
    status:       str                           # "success" | "partial" | "failed"
    company_id:   str                           # echoed from request
    user_id:      str                           # echoed from request
    website_url:  str
    products:     List[ProductSchema]
    company:      Optional[CompanyPatchSchema]
    total_products:         int
    high_confidence_count:  int
    medium_confidence_count: int
    low_confidence_count:   int
    ready_for_analysis_count: int
    crawl_stats:  Optional[CrawlStatsSchema]
    errors:       List[str]
    elapsed_sec:  float

class ResearchPreferencesRequest(BaseModel):
    goals: List[str]
    buyer_type: Optional[str] = None
    price_positioning: Optional[str] = None
    monthly_supply_capacity: Optional[str] = None
    annual_turnover: Optional[str] = None
    certifications: Optional[CertificationSchema]


class ProductConfirmSchema(BaseModel):
    product_name: str
    description: Optional[str]
    category: Optional[str]
    subcategory: Optional[str]
    packaging: Optional[str]
    certifications: Optional[List[str]]
    moq: Optional[str]
    hs_code: Optional[str]
    ingredients: Optional[str]
    specifications: Optional[Dict]
    variants: Optional[List[str]]
    images: Optional[List[str]]
    monthly_capacity: Optional[str]
    source_url: Optional[str]
    confidence_score: Optional[int]
    confidence_tier: Optional[str]
    #missing_fields: Optional[List[Dict]]
    extraction_notes: Optional[str]
    #is_ready: Optional[bool]