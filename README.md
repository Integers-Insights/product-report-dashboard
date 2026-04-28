# Product Intelligence Platform

**Integers Insights** — AI-powered export intelligence reports for SME manufacturers and exporters.

Production: `https://product-insight.integerstech.com`

---

## What It Does

A company submits their product URL. The platform crawls their website, extracts product and company data, then runs a multi-module AI pipeline that produces a structured intelligence report covering:

- Global trade flows and top exporter/importer data (UN Comtrade)
- Market demand signals and growth indicators
- Competitor landscape
- Buyer discovery (B2B leads via Apollo, B2C audience profiles)
- Keyword intelligence (Google Ads API)
- Marketing kit — email sequences and ad concepts
- Price analysis — commodity vs certified FOB pricing
- Product variant extraction
- Confidence scoring per module

Reports are stored per product in PostgreSQL and served to a React dashboard.

---

## Architecture

```
frontend/          React + Vite + Tailwind CSS
backend/
  main.py          FastAPI app — onboarding + admin routers
  intelligence_api.py   Report fetch/serve endpoints
  module_runner.py      Async module orchestrator
  worker.py             Background job worker
  input_pipeline/       Website crawler → product/company extraction
  modules/              Intelligence modules (one per report section)
  services/             DB read/write layer
  routers/              API route handlers
  utils/                JWT, email, subscription, security helpers
  db/database.py        asyncpg connection pool (AWS RDS)
```

---

## Intelligence Modules

| Module | File(s) | Data Sources |
|---|---|---|
| Input Preprocessing | `modules/input_preprocessing.py` | Playwright crawler + GPT-4o-mini |
| Market Demand | `modules/market_demand.py` | Perplexity Sonar + GPT-4o-mini |
| Competitor Discovery | `modules/competitor_discovery.py` | Perplexity Sonar + GPT-4o-mini |
| Trade Intelligence | `modules/trade/trade_intel.py` | Sonar + UN Comtrade API + GPT-4o |
| Price Analysis | `modules/price_analysis.py` | Perplexity Sonar + GPT-4o-mini |
| Marketing Kit — Keywords | `modules/marketing_kit/keyword_intel_v2.py` | Google Ads API + GPT-4o-mini |
| Marketing Kit — Email | `modules/marketing_kit/email_sequence.py` | GPT-4o |
| Marketing Kit — Ads | `modules/marketing_kit/ad_concepts.py` | GPT-4o |
| Buyer Discovery — B2B | `modules/buyer_discovery/b2b_buyers.py` | Apollo.io API |
| Buyer Discovery — B2C | `modules/buyer_discovery/b2c_audience.py` | GPT-4o |
| Variants Kit | `modules/variants_kit/variants_formats.py` | GPT-4o-mini |
| Scoring Engine | `modules/scoring_engine.py` | GPT-4o-mini |

All modules extend `BaseModule` (`modules/base_module.py`), which provides shared Sonar/OpenAI clients, deflection retry logic, and cost tracking.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Python 3.11, FastAPI, asyncpg |
| Database | PostgreSQL (AWS RDS, eu-north-1) |
| Auth | JWT (PyJWT), bcrypt, email verification via AWS SES |
| Payments | Razorpay |
| AI — Extraction | OpenAI gpt-4o-mini |
| AI — Generation | OpenAI gpt-4o |
| AI — Web Search | Perplexity Sonar (`sonar` model) |
| Trade Data | UN Comtrade Plus API |
| B2B Leads | Apollo.io API |
| Keyword Data | Google Ads API |
| Email | AWS SES (boto3) |
| Background Jobs | asyncio worker + asyncpg |

---

## External API Keys Required

| Variable | Provider | Used For |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI | All GPT extraction and generation |
| `PERPLEXITY_API_KEY` | Perplexity | Sonar real-time web search |
| `COMTRADE_API_KEY` | UN Comtrade | Trade flow data |
| `APOLLO_API_KEY` | Apollo.io | B2B buyer discovery |
| `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` | AWS | SES email sending |
| `AI_REPORTS_HOST/PORT/USER/PASSWORD/DB` | AWS RDS | PostgreSQL connection |
| `SECRET_KEY` | — | JWT signing |
| `INTERNAL_API_KEY` | — | Internal service auth |
| `GOOGLE_ADS_CUSTOMER_ID` + `google_ads.yaml` | Google Ads | Keyword intelligence |

Copy `.env.example` to `.env` and fill all values before running.

---

## Local Setup

### Prerequisites

- Python 3.11
- Node.js 18+
- PostgreSQL (or AWS RDS access)
- Conda (recommended) or virtualenv

### Backend

```bash
cd backend
conda create -n product_insights python=3.11
conda activate product_insights
pip install -r requirements.txt
playwright install chromium

cp ../.env.example ../.env
# fill in all values in .env

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# runs on http://localhost:5173
```

### Running a module test

```bash
cd backend
conda activate product_insights
python testing/test_trade_module.py
```

---

## Project Structure

```
product-report-dashboard/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── intelligence_api.py        # Report API endpoints
│   ├── module_runner.py           # Async module orchestrator
│   ├── worker.py                  # Background job processor
│   ├── state.py                   # App-level shared state
│   ├── db/
│   │   └── database.py            # asyncpg pool
│   ├── input_pipeline/
│   │   ├── pipeline.py            # Full crawl → extract pipeline
│   │   ├── crawler/               # Playwright + link extraction
│   │   ├── extractor/             # Product + company GPT extraction
│   │   ├── classifier/            # URL and content classification
│   │   ├── cleaner/               # Content cleaning
│   │   ├── scorer/                # Confidence scoring
│   │   ├── models/                # Pydantic models
│   │   └── config.py              # LLM settings, timeouts, cache TTLs
│   ├── modules/
│   │   ├── base_module.py         # BaseModule — shared AI clients + helpers
│   │   ├── market_demand.py
│   │   ├── competitor_discovery.py
│   │   ├── price_analysis.py
│   │   ├── scoring_engine.py
│   │   ├── trade/
│   │   │   ├── trade_intel.py     # Orchestrator
│   │   │   ├── trade_sonar.py     # Sonar + GPT helpers
│   │   │   ├── trade_comtrade.py  # UN Comtrade API client
│   │   │   └── trade_prompts.py   # All trade prompts
│   │   ├── marketing_kit/
│   │   │   ├── keyword_intel_v2.py
│   │   │   ├── email_sequence.py
│   │   │   └── ad_concepts.py
│   │   ├── buyer_discovery/
│   │   │   ├── b2b_buyers.py
│   │   │   └── b2c_audience.py
│   │   └── variants_kit/
│   │       └── variants_formats.py
│   ├── routers/
│   │   ├── onboarding.py          # Auth, signup, email verification
│   │   └── admin.py               # Admin controls
│   ├── services/                  # DB read/write service layer
│   ├── schemas/                   # Auth + onboarding schemas
│   ├── utils/                     # JWT, email, subscriptions, security
│   └── testing/                   # Module test scripts
├── frontend/                      # React + Vite + Tailwind
├── docs/
│   └── security/                  # Compliance documentation
├── infra/                         # Infrastructure notes
├── .env.example
└── .gitignore
```

---

## Environment Notes

- Never commit `.env`, `google_ads.yaml`, `*.pem`, or `*.key`
- All secrets are loaded at startup via `aws_secrets.py` or `python-dotenv`
- Database connection uses `asyncpg` pool (min 10, max 80 connections)
- Comtrade API is rate-limited — 1.2s sleep between calls is enforced in `trade_comtrade.py`
- The input pipeline uses Playwright (headless Chromium) — run `playwright install chromium` once per environment

---

## Security Documentation

Compliance documents are in `docs/security/`:

| Document | ID |
|---|---|
| GitHub Access Controls | GAC-001 |
| HTTPS and Encryption Checklist | HEC-001 |
| Incident Response Runbook | IRR-001 |
| Information Security Policy | ISP-001 |
| Secrets Management Policy | SMP-001 |
| Data Flow Register | DFR-001 |

---

## Team

| Name | Role |
|---|---|
| Nikhil Raut | Owner / Lead |
| Yukta Moolya | AI / ML Engineer |
| Neel Naik | Data / Backend |
| Amarjit Gupta | Frontend |

---

*Internal repository — Integers Insights. Not open source.*
