"""
app.py
-------
Streamlit UI for INTRADE24 Intelligence Engine.

Run: streamlit run app.py

Two sections:
  1. Input form  — editable fields, only product_name required
  2. Results     — tabbed display per module with live progress indicators
"""

import asyncio
import threading
import time
from typing import Any
from module_runner import ModuleRunner
from modules.base_module import ModuleInput
import nest_asyncio
import streamlit as st

nest_asyncio.apply()

# ── page config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="INTRADE24 — Intelligence Engine",
    page_icon="🌐",
    layout="wide",
)

# ── lazy import runner (avoids import errors before .env is loaded) ──────────
@st.cache_resource
def get_runner_class():
    return ModuleRunner

def _parse_target_country(value) -> list:
    """Normalises target_country to a list regardless of input type."""
    if not value:
        return ["United States"]
    if isinstance(value, list):
        return [v for v in value if v] or ["United States"]
    # plain string — wrap in list
    return [value.strip()]


def build_module_input(form: dict):
    return ModuleInput(
        product_id=      form.get("product_id") or "5c107643-c5e6-4c26-9728-95df27d69762",
        product_name=    form["product_name"],
        category=        form.get("category") or "",
        hs_code=         form.get("hs_code") or "",
        description=     form.get("description") or "",
        certifications=  [c.strip() for c in (form.get("certifications") or "").split(",") if c.strip()],
        origin_country=  form.get("origin_country") or "India",
        target_country=  _parse_target_country(form.get("target_country")),
        company_name=    form.get("company_name") or "",
        business_type=   form.get("business_type") or "Manufacturer & Exporter",
        price_positioning= form.get("price_positioning") or "Standard",
        moq=             form.get("moq") or "",
        buyer_type=      form.get("buyer_type") or "B2B",
    )


# ─────────────────────────────────────────────
#  SESSION STATE INIT
# ─────────────────────────────────────────────

def init_state():
    defaults = {
        "running":       False,
        "results":       None,
        "statuses":      {},   # name → {status, elapsed, error}
        "status_log":    [],
        "run_complete":  False,
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

init_state()


# ─────────────────────────────────────────────
#  HEADER
# ─────────────────────────────────────────────

st.markdown("## 🌐 INTRADE24 — Intelligence Engine")
st.markdown("Fill in your product details and run the intelligence engine. "
            "Only **Product Name** is required.")
st.divider()


# ─────────────────────────────────────────────
#  INPUT FORM
# ─────────────────────────────────────────────

with st.expander("📋 Product & Company Details", expanded=True):
    col1, col2 = st.columns(2)

    with col1:
        st.markdown("**Product**")
        product_name    = st.text_input("Product Name *",        value="Encapsulated Charcoal Dissolving Beads")
        category        = st.text_input("Category",              value="")
        hs_code         = st.text_input("HS Code",               value="380210")
        description     = st.text_area("Description",            value="Premium organic turmeric powder with 95% curcuminoids.", height=80)
        certifications  = st.text_input("Certifications (comma-separated)", value="USDA Organic, GMP, FSSAI, Kosher")
        moq             = st.text_input("MOQ",                   value="0 kg")

    with col2:
        st.markdown("**Company & Market**")
        company_name    = st.text_input("Company Name",          value="umang particle science")
        origin_country  = st.text_input("Origin Country",        value="India")
        target_country  = st.multiselect(
            "Target Countries",
            options=[
                "United States", "Germany", "United Kingdom", "Netherlands",
                "France", "Japan", "Canada", "Australia", "UAE",
                "Saudi Arabia", "Singapore", "South Korea", "Italy",
                "Spain", "Belgium", "Switzerland", "Sweden", "Brazil",
                "Mexico", "China", "Hong Kong", "New Zealand", "Denmark",
                "Poland", "South Africa",
            ],
            default=["United States"],
        )
        business_type   = st.text_input("Business Type",         value="Manufacturer & Exporter")
        price_positioning = st.selectbox("Price Positioning",    ["Budget", "Standard", "Mid-range", "Premium"], index=3)
        buyer_type      = st.selectbox("Buyer Type",             ["B2B", "B2C", "Both"], index=0)
        # skip_keywords   = st.checkbox("Skip Keyword Module (no Google Ads config)", value=True)

form_data = {
    "product_name":     product_name,
    "category":         category,
    "hs_code":          hs_code,
    "description":      description,
    "certifications":   certifications,
    "moq":              moq,
    "company_name":     company_name,
    "origin_country":   origin_country,
    "target_country":   target_country,
    "business_type":    business_type,
    "price_positioning": price_positioning,
    "buyer_type":       buyer_type,
}

st.divider()


# ─────────────────────────────────────────────
#  RUN BUTTON + THREADING
# ─────────────────────────────────────────────

MODULE_LABELS = {
    "overview":             "🏆 Overview",
    "market_demand":        "📊 Market Demand",
    "trade_intel":          "📦 Trade Intelligence",
    "buyer_discovery":      "🛒 Buyer Discovery",
    "variants_formats":     "🔬 Variants & Formats",
    "competitor_discovery": "⚔️  Competitor Discovery",
    "keyword_intel":        "🔑 Keyword Intelligence",
    "email_sequence":       "✉️  Email Sequence",
    "ad_concepts":          "🎯 Ad Concepts",
    "price_analysis":       "💰 Price Analysis",
}

def make_callback(status_store: dict, log: list):
    """Returns a thread-safe callback that updates shared dicts."""
    def callback(name: str, status: str, data: Any):
        status_store[name] = {
            "status":  status,
            "elapsed": data if isinstance(data, float) else None,
        }
        log.append(f"{name} → {status}")
    return callback


def run_in_thread(form: dict, result_container: list,
                  status_store: dict, log: list, done_flag: list):
    """Runs the async runner in a dedicated thread."""
    ModuleRunner = get_runner_class()
    inp          = build_module_input(form)
    callback     = make_callback(status_store, log)
    runner       = ModuleRunner(status_callback=callback)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        results = loop.run_until_complete(runner.run_all(inp))
        result_container.append(results)
    except Exception as e:
        import traceback
        traceback.print_exc()
        result_container.append(None)
        log.append(f"RUNNER ERROR: {e}")
    finally:
        loop.close()
        done_flag.append(True)


run_clicked = st.button(
    "🚀 Run Intelligence Engine",
    disabled=st.session_state.running,
    type="primary",
)

if run_clicked:
    if not product_name.strip():
        st.error("Product Name is required.")
    else:
        st.session_state.running      = True
        st.session_state.run_complete = False
        st.session_state.results      = None
        st.session_state.statuses     = {k: {"status": "pending"} for k in MODULE_LABELS}
        st.session_state.status_log   = []

        result_container = []
        done_flag        = []

        t = threading.Thread(
            target=run_in_thread,
            args=(form_data, result_container,
                  st.session_state.statuses, st.session_state.status_log,
                  done_flag),
            daemon=True,
        )
        # t = threading.Thread(
        #     target=run_in_thread,
        #     args=(form_data, result_container,
        #         st.session_state.statuses, st.session_state.status_log,
        #         done_flag),
        #     daemon=True,
        # )
        t.start()

        # ── Live progress loop ───────────────────────────────────────────────
        progress_area = st.empty()

        while not done_flag:
            with progress_area.container():
                st.markdown("### ⏳ Running modules...")
                cols = st.columns(4)
                for i, (name, label) in enumerate(MODULE_LABELS.items()):
                    s = st.session_state.statuses.get(name, {})
                    status = s.get("status", "pending")
                    icon   = {"pending": "⬜", "running": "🔄",
                              "done": "✅", "failed": "❌"}.get(status, "⬜")
                    cols[i % 4].markdown(f"{icon} **{label}**  \n`{status}`")
            time.sleep(0.6)
            t.join(timeout=0.1)
            if not t.is_alive():
                break

        # Final status render
        with progress_area.container():
            st.markdown("### ✅ Run complete")
            cols = st.columns(4)
            for i, (name, label) in enumerate(MODULE_LABELS.items()):
                s      = st.session_state.statuses.get(name, {})
                status = s.get("status", "pending")
                icon   = {"pending": "⬜", "running": "🔄",
                          "done": "✅", "failed": "❌"}.get(status, "⬜")
                cols[i % 4].markdown(f"{icon} **{label}**  \n`{status}`")

        if result_container:
            st.session_state.results = result_container[0]

        st.session_state.running      = False
        st.session_state.run_complete = True
        st.rerun()


# ─────────────────────────────────────────────
#  RESULTS DISPLAY
# ─────────────────────────────────────────────

def kv(label: str, value):
    """Render a key-value row, skip if value is None/empty."""
    if value:
        st.markdown(f"**{label}:** {value}")


_TIER_ICON = {
    "Easy Win":   "🟢",
    "Needs Work": "🟡",
    "Not Yet":    "🔴",
    "Avoid":      "🔴",
}

_COUNTRY_FLAGS = {
    "United States": "🇺🇸", "Germany": "🇩🇪", "United Kingdom": "🇬🇧",
    "France": "🇫🇷", "Japan": "🇯🇵", "China": "🇨🇳", "Australia": "🇦🇺",
    "Canada": "🇨🇦", "UAE": "🇦🇪", "Netherlands": "🇳🇱", "Italy": "🇮🇹",
    "Spain": "🇪🇸", "Brazil": "🇧🇷", "South Korea": "🇰🇷", "Singapore": "🇸🇬",
    "India": "🇮🇳", "Mexico": "🇲🇽", "Saudi Arabia": "🇸🇦", "Sweden": "🇸🇪",
    "Switzerland": "🇨🇭", "Poland": "🇵🇱", "Belgium": "🇧🇪", "Denmark": "🇩🇰",
}


def _render_market_demand_tile(r):
    """Renders one country's full market demand tile including score header."""
    d  = r.data
    cs = d.get("country_score") or {}

    score        = cs.get("score")
    tier         = cs.get("tier") or ""
    context_note = cs.get("context_note") or ""
    hs_code      = (r.data.get("country_and_score") or {}).get("hs_code") or ""
    tier_icon    = _TIER_ICON.get(tier, "⚪")
    flag         = _COUNTRY_FLAGS.get(r.target_country, "🌍")

    # ── Country header row ───────────────────────────────────────────────────
    hcol1, hcol2 = st.columns([3, 1])
    with hcol1:
        st.markdown(f"### {flag} {r.target_country}")
        sub_parts = []
        if hs_code:
            sub_parts.append(f"HS {hs_code}")
        if context_note:
            sub_parts.append(context_note)
        if sub_parts:
            st.caption(" — ".join(sub_parts))
    with hcol2:
        if score is not None:
            st.markdown(
                f"<div style='text-align:right'>"
                f"<span style='font-size:2rem;font-weight:700'>{score}</span><br>"
                f"<span style='font-size:0.85rem'>{tier_icon} {tier}</span>"
                f"</div>",
                unsafe_allow_html=True,
            )

    st.divider()

    # ── 7 data fields in 2 columns ───────────────────────────────────────────
    col1, col2 = st.columns(2)

    with col1:
        dg = d.get("demand_growth") or {}
        if dg.get("value"):
            period = dg.get("period") or ""
            arrow  = "↑" if "+" in str(dg["value"]) else ("↓" if "-" in str(dg["value"]) else "")
            st.markdown(f"**Demand Growth** &nbsp; `{arrow}{dg['value']} {period}`")

        iv = d.get("import_volume") or {}
        if iv.get("value"):
            unit = iv.get("unit") or ""
            year = f"({iv['year']})" if iv.get("year") else ""
            st.markdown(f"**Import Volume** &nbsp; `{iv['value']} {unit} {year}`.strip()")

        pp = d.get("peak_procurement") or {}
        if pp.get("period"):
            st.markdown(f"**Peak Procurement** &nbsp; `{pp['period']}`")

        mb = d.get("matched_buyers") or {}
        if mb.get("count"):
            st.markdown(f"**Matched Buyers** &nbsp; `{mb['count']}`")

    with col2:
        pc = d.get("primary_channel") or {}
        if pc.get("channel"):
            st.markdown(f"**Primary Channel** &nbsp; `{pc['channel']}`")

        cr = d.get("cert_require") or {}
        certs = cr.get("certifications") or []
        if certs:
            label = " · ".join(certs) if isinstance(certs, list) else str(certs)
            st.markdown(f"**Cert Requirement** &nbsp; `{label}`")

        cg = d.get("cert_gap") or {}
        if cg:
            status = cg.get("status") or ""
            detail = cg.get("detail") or ""
            icon   = "🔴" if "gap" in status.lower() else "🟢"
            st.markdown(f"**Cert Gap** &nbsp; {icon} {detail or status}")

    # ── Analyst note ─────────────────────────────────────────────────────────
    if d.get("analysis_note"):
        st.caption(d["analysis_note"])


def render_market_demand(result):
    if result is None:
        st.error("No market demand data returned.")
        return

    if not isinstance(result, list):
        result = [result]

    qualified = [r for r in result if r and r.success and r.data]
    if not qualified:
        st.warning("No country data returned.")
        return

    # Sort by score descending (Easy Win first)
    def _sort_key(r):
        cs = r.data.get("country_score") or {}
        return cs.get("score") or 0

    qualified = sorted(qualified, key=_sort_key, reverse=True)

    # Summary header
    tier_counts: dict[str, int] = {}
    for r in qualified:
        tier = (r.data.get("country_score") or {}).get("tier") or "—"
        tier_counts[tier] = tier_counts.get(tier, 0) + 1

    summary_parts = [f"**{len(qualified)} markets**"]
    for tier, icon in _TIER_ICON.items():
        if tier_counts.get(tier):
            summary_parts.append(f"{icon} {tier_counts[tier]} {tier}")
    st.markdown("  &nbsp;·&nbsp;  ".join(summary_parts), unsafe_allow_html=True)

    fields_line = (
        "Every market shows: &nbsp;"
        "**Score** · **Demand growth** · **Import volume** · **Matched buyers** · "
        "**Peak procurement** · **Primary channel** · **Cert requirement** · **Cert gap** · **Analyst note**"
    )
    st.caption(fields_line)
    st.divider()

    # Render each country tile
    cols = st.columns(2)
    for i, r in enumerate(qualified):
        with cols[i % 2]:
            with st.container(border=True):
                _render_market_demand_tile(r)


def render_trade_intel(result):
    if not result or not result.success:
        st.error(f"Failed: {getattr(result, 'error', 'unknown error')}")
        return
    d = result.data

    col1, col2 = st.columns(2)

    with col1:
        # Global Trade Value
        gtv = d.get("global_trade_value") or {}
        if gtv:
            st.metric(
                "Global Trade Value",
                gtv.get("value_usd") or "—",
                delta=gtv.get("yoy_growth") or None,
            )

        # Volume Traded
        vt = d.get("volume_traded_globally") or {}
        if vt and vt.get("value_mt"):
            yoy = vt.get("yoy_growth") or ""
            year_str = f"({vt.get('year')})" if vt.get('year') else ''
            st.markdown(f"**Volume Traded:** {vt['value_mt']} MT "
                        f"{'· ' + yoy if yoy else ''} {year_str}")

        # Avg Trade Price
        atp = d.get("avg_global_trade_price") or {}
        if atp:
            ctx = f" — {atp['context']}" if atp.get('context') else ''
            st.markdown(f"**Avg Trade Price:** {atp.get('price_per_kg') or '—'}{ctx}")

        # Export Share
        es = d.get("country_export_share") or {}
        if es:
            trend = es.get("trend") or ""
            st.markdown(f"**{es.get('country','India')} Export Share:** "
                        f"{es.get('share_pct') or '—'}"
                        f"{f' · {trend}' if trend else ''}")

        # Pricing tiers
        ep = d.get("export_pricing_commod") or {}
        if ep:
            st.markdown("**Pricing Tiers:**")
            comm = ep.get("commodity") or {}
            cert = ep.get("certified") or {}
            if comm.get("price_range"):
                comm_ctx = f" — {comm['context']}" if comm.get('context') else ''
                st.markdown(f"- Commodity: `{comm['price_range']}`{comm_ctx}")
            if cert.get("price_range"):
                cert_ctx = f" — {cert['context']}" if cert.get('context') else ''
                st.markdown(f"- Certified: `{cert['price_range']}`{cert_ctx}")

    with col2:
        # Top Exporters
        exporters = d.get("top_exporters") or []
        if exporters:
            st.markdown("**Top Exporters:**")
            for e in exporters[:5]:
                share = e.get("share_pct") or e.get("trade_value") or ""
                st.markdown(f"- {e.get('country','?')}  {f'· {share}' if share else ''}")

        # Top Importers
        importers = d.get("top_importers") or []
        if importers:
            st.markdown("**Top Importers:**")
            for i in importers[:5]:
                yoy = i.get("yoy_growth") or ""
                st.markdown(f"- {i.get('country','?')}  {f'· {yoy}' if yoy else ''}")

        # Export Volume Trend
        evt = d.get("export_volume_trend") or []
        evt = [e for e in evt if e.get("volume_mt")]
        if evt:
            st.markdown("**Export Volume Trend:**")
            for e in evt:
                yoy = e.get("yoy_growth") or ""
                st.markdown(f"- {e.get('year','?')}: {e.get('volume_mt','—')} MT "
                            f"{f'· {yoy}' if yoy else ''}")

    if d.get("analysis_note"):
        st.info(d["analysis_note"])


def _render_b2b_buyers(b2b):
    """Renders B2B buyer company cards from BuyerDiscoveryResult."""
    if not b2b or not b2b.success:
        st.error(f"B2B failed: {getattr(b2b, 'error', 'unknown error')}")
        return
    fallback_note = " *(sparse data — fallback mode)*" if b2b.is_fallback() else ""
    st.markdown(f"**{b2b.count()} companies found in {b2b.target_country}**{fallback_note}")
    for b in b2b.buyers:
        with st.container(border=True):
            col1, col2 = st.columns([2, 1])
            with col1:
                st.markdown(f"### {b.name}")
                kv("Type",  b.buyer_type)
                kv("Notes", b.notes)
            with col2:
                kv("Country", b.country)
                kv("Website", b.website)


def _render_b2c_profile(b2c):
    """Renders B2C consumer profile from B2CDiscoveryResult."""
    if not b2c or not b2c.success:
        st.error(f"B2C failed: {getattr(b2c, 'error', 'unknown error')}")
        return

    p = b2c.consumer_profile
    if not p:
        st.warning("No consumer profile generated.")
        return

    # ── Consumer Segment ────────────────────────────────────────────────────
    st.markdown("### 👤 Consumer Segment")
    c1, c2, c3 = st.columns(3)
    with c1:
        if p.consumer_segment.age_group:
            st.markdown(f"**Age Group**  \n{p.consumer_segment.age_group}")
    with c2:
        if p.consumer_segment.gender_skew:
            st.markdown(f"**Gender**  \n{p.consumer_segment.gender_skew.replace('-', ' ').title()}")
    with c3:
        if p.consumer_segment.income_bracket:
            st.markdown(f"**Income**  \n{p.consumer_segment.income_bracket}")

    if p.consumer_segment.lifestyle_tags:
        st.markdown("**Lifestyle:** " + "  &nbsp;·&nbsp;  ".join(
            [f"`{t}`" for t in p.consumer_segment.lifestyle_tags]
        ), unsafe_allow_html=True)
    if p.consumer_segment.purchase_motivation:
        st.markdown("**Motivations:** " + "  &nbsp;·&nbsp;  ".join(
            [f"`{m}`" for m in p.consumer_segment.purchase_motivation]
        ), unsafe_allow_html=True)

    st.divider()

    # ── Purchase Channels ───────────────────────────────────────────────────
    st.markdown("### 🛍️ Where They Buy")
    ch1, ch2, ch3 = st.columns(3)
    with ch1:
        st.markdown("**Online**")
        for ch in p.purchase_channels.online:
            st.markdown(f"- {ch}")
    with ch2:
        st.markdown("**Offline**")
        for ch in p.purchase_channels.offline:
            st.markdown(f"- {ch}")
    with ch3:
        st.markdown("**Social Commerce**")
        for ch in p.purchase_channels.social_commerce:
            st.markdown(f"- {ch}")

    st.divider()

    # ── Label Preferences ───────────────────────────────────────────────────
    st.markdown("### 🏷️ Label Preferences")
    lp1, lp2 = st.columns(2)
    with lp1:
        if p.label_preferences.certifications:
            st.markdown("**Certifications they look for:**  \n" + "  &nbsp;·&nbsp;  ".join(
                [f"`{c}`" for c in p.label_preferences.certifications]
            ), unsafe_allow_html=True)
        if p.label_preferences.preferred_formats:
            st.markdown("**Preferred formats:**  \n" + "  &nbsp;·&nbsp;  ".join(
                [f"`{f}`" for f in p.label_preferences.preferred_formats]
            ), unsafe_allow_html=True)
    with lp2:
        if p.label_preferences.key_claims:
            st.markdown("**Key claims they respond to:**  \n" + "  &nbsp;·&nbsp;  ".join(
                [f"`{c}`" for c in p.label_preferences.key_claims]
            ), unsafe_allow_html=True)
        if p.label_preferences.price_sensitivity:
            st.info(f"💰 {p.label_preferences.price_sensitivity}")

    st.divider()

    # ── Leading Brands ──────────────────────────────────────────────────────
    if p.leading_brands:
        st.markdown(f"### 🏆 Leading Brands ({len(p.leading_brands)})")
        cols = st.columns(min(len(p.leading_brands), 3))
        for i, b in enumerate(p.leading_brands):
            with cols[i % 3]:
                with st.container(border=True):
                    st.markdown(f"**{b.name}**")
                    if b.positioning:
                        st.caption(b.positioning)
                    if b.notes:
                        st.markdown(b.notes)
                    if b.website:
                        st.markdown(f"🌐 `{b.website}`")

        st.divider()

    # ── Market Gap ──────────────────────────────────────────────────────────
    if p.market_gap:
        st.markdown("### 💡 Market Gap")
        st.success(p.market_gap)


def render_buyer_discovery(result):
    """
    Routes CombinedBuyerResult to B2B cards, B2C profile, or both in tabs.
    """
    if not result:
        st.error("No buyer discovery data returned.")
        return

    if not result.success and not result.b2b and not result.b2c:
        st.error(f"Failed: {result.error or 'unknown error'}")
        return

    buyer_type = (result.buyer_type or "B2B").upper()

    if buyer_type == "B2B":
        _render_b2b_buyers(result.b2b)

    elif buyer_type == "B2C":
        _render_b2c_profile(result.b2c)

    elif buyer_type == "BOTH":
        tab_b2b, tab_b2c = st.tabs(["🏭 B2B Buyers", "🛍️ B2C Consumer Profile"])
        with tab_b2b:
            _render_b2b_buyers(result.b2b)
        with tab_b2c:
            _render_b2c_profile(result.b2c)

    else:
        st.warning(f"Unknown buyer_type: {result.buyer_type!r}")
        if result.b2b:
            _render_b2b_buyers(result.b2b)
        if result.b2c:
            _render_b2c_profile(result.b2c)


def render_variants_formats(result):
    if not result or not result.success:
        st.error(f"Failed: {getattr(result, 'error', 'unknown error')}")
        return
    TAG_COLORS = {
        "your_product": "🟢",
        "gap":          "⚡",
        "in_market":    "🔵",
        "emerging":     "🟡",
    }
    for v in result.variants:
        icon = TAG_COLORS.get(v.tag, "⚪")
        with st.container(border=True):
            col1, col2 = st.columns([3, 1])
            with col1:
                st.markdown(f"#### {icon} {v.variant_name}")
                kv("Key Spec",       v.key_spec)
                kv("Buyer Demand",   v.buyer_demand)
                kv("Matched Buyers", v.matched_buyers)
            with col2:
                if v.opportunity_score:
                    st.metric("Opportunity", f"{v.opportunity_score}/10")
                kv("Price",     v.price_range)
                kv("MOQ",       v.moq)
                kv("Lead Time", v.lead_time)
            if v.analysis_note:
                st.caption(v.analysis_note)


def render_competitor_discovery(result):
    if not result or not result.success:
        st.error(f"Failed: {getattr(result, 'error', 'unknown error')}")
        return
    st.markdown(f"**{result.count()} competitors found**"
                + (" *(fallback — sparse data)*" if result.is_fallback() else ""))
    for i, c in enumerate(result.competitors, 1):
        with st.container(border=True):
            col1, col2 = st.columns([3, 1])
            with col1:
                st.markdown(f"**{i}. {c.name}**")
                kv("Type",  c.competitor_type)
                kv("Notes", c.notes)
            with col2:
                kv("Country", c.origin_country)
                kv("Website", c.website)


def render_keyword_intel(result):
    if not result or not result.success:
        st.error(f"Failed: {getattr(result, 'error', 'unknown error')}")
        return
    tab1, tab2, tab3 = st.tabs([
        f"🔥 Buyer Intent ({len(result.high_volume_buyer_intent)})",
        f"⚡ Gap Keywords ({len(result.low_competition_gaps)})",
        f"🌍 Multilingual ({len(result.multilingual)})",
    ])
    def _kw_table(keywords):
        for k in keywords:
            cols = st.columns([4, 2, 2, 1])
            cols[0].markdown(f"`{k.keyword}`")
            cols[1].markdown(f"{k.search_volume or '—'}/mo")
            cols[2].markdown(k.competition or "—")
            cols[3].markdown(f"{'🟢' if k.gap == 'High' else '⚪'}")
    with tab1: _kw_table(result.high_volume_buyer_intent)
    with tab2: _kw_table(result.low_competition_gaps)
    with tab3:
        for k in result.multilingual:
            cols = st.columns([4, 2, 2])
            cols[0].markdown(f"`{k.keyword}`")
            cols[1].markdown(k.language)
            cols[2].markdown(f"{'🟢 Gap' if k.gap == 'High' else ''}")


def render_email_sequence(result):
    if not result or not result.success:
        st.error(f"Failed: {getattr(result, 'error', 'unknown error')}")
        return
    if result.sequence_note:
        st.caption(result.sequence_note)
    for email in result.emails:
        with st.expander(
            f"📧 Email {email.send_day + 1}  ·  Day {email.send_day}  ·  {email.type_label}",
            expanded=True,
        ):
            st.markdown(f"**{email.goal}**")
            st.markdown(f"*Subject:* `{email.subject}`")
            st.markdown(email.body)
            if email.tiles:
                st.markdown(" &nbsp;|&nbsp; ".join(
                    [f"`{t}`" for t in email.tiles]
                ), unsafe_allow_html=True)


def render_ad_concepts(result):
    if not result or not result.success:
        st.error(f"Failed: {getattr(result, 'error', 'unknown error')}")
        return
    cols = st.columns(2)
    for i, c in enumerate(result.concepts):
        with cols[i % 2]:
            with st.container(border=True):
                st.caption(f"{c.market}  ·  {c.angle}")
                st.markdown(f"### \"{c.hook}\"")
                st.markdown(c.description)
                if c.tiles:
                    st.markdown(" &nbsp;|&nbsp; ".join(
                        [f"`{t}`" for t in c.tiles]
                    ), unsafe_allow_html=True)

def render_overview(scoring):
    if not scoring or not scoring.success:
        st.error(f"Scoring failed: {getattr(scoring, 'error', 'unknown error')}")
        return

    st.metric("Overall Opportunity Score", f"{scoring.overall_score}/100")
    st.divider()

    # 6 score cards in 3×2 grid
    cols = st.columns(3)
    for i, s in enumerate(scoring.scores):
        icon = {"green": "🟢", "yellow": "🟡", "red": "🔴"}.get(s.color, "⚪")
        with cols[i % 3]:
            with st.container(border=True):
                st.caption(s.label)
                st.markdown(f"### {icon} {s.score}/10")
                st.caption(s.sublabel)

    st.divider()

    # Urgent note
    if scoring.urgent_note:
        st.warning(f"⚡ {scoring.urgent_note}")

    st.divider()

    # Action cards
    if scoring.action_cards:
        cols = st.columns(3)
        timing_icons = {"Do now": "🔥", "This month": "⚡", "This quarter": "🏁"}
        for i, card in enumerate(scoring.action_cards):
            with cols[i % 3]:
                with st.container(border=True):
                    icon = timing_icons.get(card.timing, "📌")
                    st.markdown(f"**{icon} {card.timing}**")
                    st.markdown(f"**{card.title}**")
                    st.caption(card.body)


def render_price_analysis(result):
    if not result or not result.success:
        st.error(f"Failed: {getattr(result, 'error', 'unknown error')}")
        return

    # Top 3 metric cards
    if result.top_metrics:
        t = result.top_metrics
        c1, c2, c3 = st.columns(3)
        c1.metric("Market Range",    t.market_range    or "—", delta=t.market_range_label)
        c2.metric("Est. Gross Margin", t.gross_margin  or "—", delta=t.gross_margin_label)
        c3.metric("Cert Premium",    t.cert_premium_overall or "—", delta=t.cert_premium_label)
    st.divider()

    # Variant pricing table
    if result.variant_table:
        st.markdown("**Price by Variant**")
        TAG_ICONS = {"your_product": "✅", "gap": "⚡", "in_market": "◉", "emerging": "🌱"}
        POS_COLORS = {
            "Uncontested":    "🟢",
            "Mid range":      "🔵",
            "Easy upsell":    "🟡",
            "Opportunity":    "🟡",
            "Race to bottom": "🔴",
            "Premium":        "🟣",
        }
        header = st.columns([3, 2, 2, 2])
        header[0].markdown("**Variant**")
        header[1].markdown("**Market Price**")
        header[2].markdown("**Margin Est.**")
        header[3].markdown("**Position**")
        st.divider()
        for v in result.variant_table:
            cols = st.columns([3, 2, 2, 2])
            tag_icon = TAG_ICONS.get(v.tag or "", "  ")
            pos_icon = POS_COLORS.get(v.position or "", "⚪")
            cols[0].markdown(f"{tag_icon} {v.variant_name}")
            cols[1].markdown(v.market_price or "—")
            cols[2].markdown(v.margin_est   or "—")
            cols[3].markdown(f"{pos_icon} {v.position or '—'}")

    st.divider()

    # Cert premiums
    if result.cert_premiums:
        st.markdown("**Why Your Certifications Justify the Price**")
        cols = st.columns(len(result.cert_premiums[:4]))
        for i, c in enumerate(result.cert_premiums[:4]):
            with cols[i]:
                with st.container(border=True):
                    st.markdown(f"### {c.premium_pct or '—'}")
                    st.caption(c.cert_name)
                    st.caption(c.vs_label or "")

# ── Tab display ──────────────────────────────────────────────────────────────

if st.session_state.run_complete and st.session_state.results:
    st.divider()
    st.markdown("## 📊 Intelligence Results")

    results = st.session_state.results

    tabs = st.tabs([
        "🏆 Overview", 
        "📊 Market",
        "📦 Trade",
        "🛒 Buyers",
        "🔬 Variants",
        "⚔️ Competitors",
        "🔑 Keywords",
        "✉️ Emails",
        "🎯 Ads",
        "💰 Price Analysis",
    ])

    with tabs[0]:  render_overview(results.scoring)
    with tabs[1]:  render_market_demand(results.market_demand)
    with tabs[2]:  render_trade_intel(results.trade_intel)
    with tabs[3]:  render_buyer_discovery(results.buyer_discovery)
    with tabs[4]:  render_variants_formats(results.variants_formats)
    with tabs[5]:  render_competitor_discovery(results.competitor_discovery)
    with tabs[6]:  render_keyword_intel(results.keyword_intel)
    with tabs[7]:  render_email_sequence(results.email_sequence)
    with tabs[8]:  render_ad_concepts(results.ad_concepts)
    with tabs[9]:  render_price_analysis(results.price_analysis)

elif st.session_state.run_complete and not st.session_state.results:
    st.error("Runner returned no results. Check terminal for errors.")