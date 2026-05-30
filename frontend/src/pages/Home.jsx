import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Target,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  TrendingUp,
  Search,
  Layers,
  Megaphone,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock,
  DollarSign,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import Seo from "../components/Seo";

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ""));
    let start = 0;
    const step = num / 60;
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      setVal(start);
      if (start >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  const display = target.includes(".")
    ? val.toFixed(2)
    : Math.round(val).toLocaleString();
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const ticks = [
  {
    flag: "🇩🇪",
    country: "Germany",
    stat: "+18%",
    product: "Ashwagandha Extract",
  },
  { flag: "🇺🇸", country: "USA", stat: "Score 91", product: "Curcumin 95%" },
  { flag: "🇯🇵", country: "Japan", stat: "34 buyers", product: "Black Pepper" },
  { flag: "🇬🇧", country: "UK", stat: "$4.20/kg", product: "Whey Protein" },
  {
    flag: "🇦🇺",
    country: "Australia",
    stat: "Score 87",
    product: "Herbal Supplements",
  },
  {
    flag: "🇨🇦",
    country: "Canada",
    stat: "22 importers",
    product: "Vitamin D3",
  },
  {
    flag: "🇸🇬",
    country: "Singapore",
    stat: "+31% YoY",
    product: "Nutraceuticals",
  },
  {
    flag: "🇫🇷",
    country: "France",
    stat: "Score 79",
    product: "Turmeric Extract",
  },
];

const modules = [
  {
    icon: BarChart3,
    title: "Market Demand",
    desc: "Opportunity scores, YoY growth, seasonal patterns for any product x country pair.",
    color: "from-brand-400/20 to-brand-500/5",
    iconColor: "text-brand-500",
  },
  {
    icon: Search,
    title: "Variants & Price Intelligence",
    desc: "Exact variants and prices globally - by country and currency, ready to position.",
    color: "from-sky-400/20 to-sky-500/5",
    iconColor: "text-sky-500",
  },
  {
    icon: Users,
    title: "Buyer Discovery",
    desc: "Verified importers actively sourcing your product - emails, LinkedIn, scored.",
    color: "from-violet-400/20 to-violet-500/5",
    iconColor: "text-violet-500",
  },
  {
    icon: Globe,
    title: "Trade Intelligence",
    desc: "Real customs records, HS codes, port volumes - market sizing with hard data.",
    color: "from-amber-400/20 to-amber-500/5",
    iconColor: "text-amber-500",
  },
  {
    icon: Target,
    title: "Competitor Intel",
    desc: "Who exports your product, what they charge, their market share - find the gaps.",
    color: "from-rose-400/20 to-rose-500/5",
    iconColor: "text-rose-500",
  },
  {
    icon: Megaphone,
    title: "Marketing Blueprint",
    desc: "AI-written ad copy, email sequences, landing pages - tailored per country.",
    color: "from-emerald-400/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
];

const testimonials = [
  {
    quote:
      "Report InShort gave us a ranked list of 12 countries with scores in 8 minutes. We closed our first German buyer within 6 weeks.",
    name: "Rajiv Kapoor",
    role: "Director, Nutraceuticals · Gujarat",
    rating: 5,
    initials: "RK",
    color: "bg-brand-100 text-brand-700",
  },
  {
    quote:
      "The buyer discovery feature alone paid for our subscription 10 times over. 22 verified UK importers actively sourcing our category.",
    name: "Sunita Mehta",
    role: "Export Head, Herbal Pharma · Mumbai",
    rating: 5,
    initials: "SM",
    color: "bg-sky-100 text-sky-700",
  },
  {
    quote:
      "We used to pay ₹80,000 per static report. Report InShort gives us live, updated intelligence every month for a fraction of that cost.",
    name: "Aakash Patel",
    role: "Founder, Specialty Chemicals · Ahmedabad",
    rating: 5,
    initials: "AP",
    color: "bg-violet-100 text-violet-700",
  },
];

const compare = [
  ["Market demand data", "6-12 weeks", "8 minutes"],
  ["Data freshness", "12-18 months old", "Live, always current"],
  ["Cost per report", "₹40K-₹2L+", "From $49/mo unlimited"],
  ["Buyer contacts", "Rarely included", "Yes, verified"],
  ["Countries covered", "1-5 per report", "180+ simultaneously"],
];

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleClick = () => {
    let authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    authToken ? navigate("/app") : navigate("/signup");
  };

  let userProfile = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");

  return (
    <>
      <Seo
        title="Market Analysis Platform - Trade Data, Reports & Insights"
        description="Get in-depth market analysis, import export data, competitor insights, and buyer intelligence - all in one platform. Make smarter business decisions, faster."
        url="https://www.reportinshort.com/"
        keywords={[
          "demand analysis",
          "import export data",
          "market analysis",
          "research report",
          "market demand analysis",
          "demand forecasting software",
          "market and demand analysis",
          "industry report",
          "market research industry report",
          "market research",
          "market research services",
          "competitors analysis",
          "marketing analysis",
          "global trade data",
          "exim trade data",
          "importers data",
          "business research",
          "market research to start a business"
        ]}
      />

      {/* <Helmet>
        <title>Market Analysis Platform - Trade Data, Reports & Insights</title>
        <meta
          name="description"
          content="Get in-depth market analysis, import export data, competitor insights, and buyer intelligence - all in one platform. Make smarter business decisions, faster."
        />

        <meta
          name="keywords"
          content="demand analysis, import export data, market analysis, research report, market demand analysis, demand forecasting software, market and demand analysis, industry report, market research industry report, market research, market research services, competitors analysis, marketing analysis, global trade data, exim trade data, importers data, business research, market research to start a business"
        />
        <meta
          property="og:title"
          content="Market Analysis Platform - Trade Data, Reports & Insights"
        />

        <meta property="og:url" content="https://www.reportinshort.com/" />
        <meta
          property="og:description"
          content="Get in-depth market analysis, import export data, competitor insights, and buyer intelligence - all in one platform."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.reportinshort.com/" />
      </Helmet> */}
      <Navbar />
      <PageWrapper>
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-8 pb-24"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-brand-50/30" />
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-60" />
          <motion.div
            style={{ y: heroY }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-400/10 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            style={{ y: heroY }}
            className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-sky-400/8 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-300/8 rounded-full blur-3xl pointer-events-none"
          />

          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7"
            >
              <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-brand-200/60 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
                <span className="live-dot" />
                AI-Powered · 180+ Countries · Live Trade Data
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-5xl sm:text-6xl lg:text-[76px] font-extrabold tracking-[-0.03em] leading-[1.04] text-balance mb-6"
            >
              Know{" "}
              <span className="relative inline-block">
                <span className="gradient-text">exactly</span>
                <motion.svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                >
                  <motion.path
                    d="M0 6 Q50 2 100 5 Q150 8 200 4"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>{" "}
              where
              <br />
              your product wins globally.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.18,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-lg sm:text-xl text-slate-500 font-light leading-relaxed max-w-[580px] mb-10"
            >
              Report InShort replaces expensive market research agencies with
              live AI intelligence - supply demand analysis, global trade data,
              and verified buyer discovery in minutes, not weeks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClick}
                className="btn-shimmer relative group flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-base px-8 py-3.5 rounded-2xl shadow-glow-green transition-all duration-300 cursor-pointer"
              >
                <span>
                  {userProfile ? "Explore Dashboard" : "Start for free"}
                </span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/how-it-works")}
                className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-700 font-medium text-base px-8 py-3.5 rounded-2xl transition-all duration-200 shadow-sm cursor-pointer"
              >
                See how it works
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.5 }}
              className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-14"
            >
              {[
                "No credit card needed",
                "Instant access",
                "3 free reports",
                "180+ countries",
              ].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1.5 text-sm text-slate-400"
                >
                  <CheckCircle2 size={13} className="text-brand-500" />
                  {t}
                </span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200/60 rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm w-full max-w-2xl"
            >
              {[
                { label: "Active exporters", target: "2418", suffix: "+" },
                { label: "Reports generated", target: "1.24", suffix: "M+" },
                { label: "Countries covered", target: "180", suffix: "+" },
                { label: "Data accuracy", target: "94", suffix: "%" },
              ].map(({ label, target, suffix }) => (
                <div key={label} className="bg-white/90 px-5 py-4 text-center">
                  <div className="font-mono text-xl font-bold text-slate-900">
                    <Counter target={target} suffix={suffix} />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[5%] top-[28%] hidden xl:block animate-float"
          >
            <div className="glass rounded-2xl p-4 w-52 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="live-dot" />
                <span className="text-xs text-slate-500 font-medium">
                  Live opportunity
                </span>
              </div>
              <div className="font-mono text-3xl font-bold text-brand-500 mb-1">
                91<span className="text-base text-slate-400">/100</span>
              </div>
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Curcumin 95% · USA
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <TrendingUp size={11} className="text-brand-500" />
                <span className="text-brand-600 font-medium">
                  +18.4% YoY demand
                </span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                  initial={{ width: 0 }}
                  animate={{ width: "91%" }}
                  transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[5%] top-[40%] hidden xl:block animate-float-delayed"
          >
            <div className="glass rounded-2xl p-4 w-48 shadow-card">
              <div className="text-xs text-slate-500 font-medium mb-2 flex items-center gap-1.5">
                <Users size={11} className="text-violet-500" />
                Buyers found · Japan
              </div>
              <div className="font-mono text-2xl font-bold text-slate-800 mb-3">
                34
              </div>
              {[
                { initials: "MT", c: "bg-violet-100 text-violet-700" },
                { initials: "SH", c: "bg-brand-100 text-brand-700" },
                { initials: "NK", c: "bg-sky-100 text-sky-700" },
              ].map(({ initials, c }) => (
                <div
                  key={initials}
                  className="flex items-center gap-2 mb-1.5 last:mb-0"
                >
                  <div
                    className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center font-mono ${c}`}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 rounded-full"
                      style={{ width: `${60 + Math.random() * 30}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
        <div className="border-y border-slate-100 bg-slate-50 py-3 overflow-hidden">
          <div
            className="flex gap-12 animate-ticker whitespace-nowrap"
            style={{ width: "max-content" }}
          >
            {[...ticks, ...ticks].map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400"
              >
                <span>{t.flag}</span>
                <span className="text-slate-600">{t.country}</span>
                <span className="text-brand-600 font-semibold">{t.stat}</span>
                <span>·</span>
                <span>{t.product}</span>
                <span className="text-slate-200 pl-6">·</span>
              </span>
            ))}
          </div>
        </div>
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="sec-label">
                <Layers size={12} /> Intelligence Modules
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                Six research engines. One platform.
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-xl mx-auto">
                From supply demand analysis to competitor pricing - your own
                market research firm, running 24/7.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map(
                ({ icon: Icon, title, desc, color, iconColor }, i) => (
                  <Reveal key={title} delay={i * 0.07}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bento p-7 group cursor-default h-full"
                    >
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon
                          size={20}
                          className={iconColor}
                          strokeWidth={1.8}
                        />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-2">
                        {title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {desc}
                      </p>
                    </motion.div>
                  </Reveal>
                ),
              )}
            </div>
          </div>
        </section>
        <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-dot mask-radial opacity-40" />
          <div className="max-w-6xl mx-auto relative">
            <Reveal className="text-center mb-14">
              <span className="sec-label">
                <Zap size={12} /> Live Sample
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                See a real report before signing up
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-xl mx-auto">
                Every search produces a structured intelligence report. Scored,
                ranked, and ready to act on.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_20px_80px_rgba(0,0,0,0.08)] overflow-hidden max-w-4xl mx-auto">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                  <div className="flex gap-1.5">
                    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                      <div
                        key={c}
                        className="w-3 h-3 rounded-full"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono">
                    Curcumin Extract 95% · United States Market Intelligence
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full">
                    <span className="live-dot w-1.5 h-1.5" />
                    Live
                  </span>
                </div>

                <div className="grid lg:grid-cols-2">
                  <div className="p-7 border-b lg:border-b-0 lg:border-r border-slate-100">
                    <div className="flex items-start gap-5 mb-6 pb-6 border-b border-slate-100">
                      <div>
                        <div className="font-mono text-6xl font-black text-brand-500 leading-none">
                          91
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          out of 100
                        </div>
                      </div>
                      <div className="pt-1">
                        <div className="font-bold text-brand-600 mb-1">
                          Strong Opportunity
                        </div>
                        <div className="text-xs text-slate-400 leading-5">
                          High demand · Low price competition
                          <br />
                          34 active importers identified
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        ["Demand trend (YoY)", "↑ 18.4%", "text-brand-600"],
                        ["Avg import price", "$12.40 / kg", "text-slate-700"],
                        [
                          "Top HS code",
                          "1302.19.90",
                          "text-slate-700 font-mono text-xs",
                        ],
                        [
                          "Competitor density",
                          "Moderate (42%)",
                          "text-amber-600",
                        ],
                        ["Data confidence", "94%", "text-brand-600"],
                      ].map(([k, v, cls]) => (
                        <div
                          key={k}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-slate-500">{k}</span>
                          <span className={`font-semibold ${cls}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-7">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                      Matched buyers
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          init: "NH",
                          name: "NutraHealth Corp",
                          loc: "New Jersey · Importer",
                          score: 96,
                          cls: "bg-brand-100 text-brand-700",
                          blur: false,
                        },
                        {
                          init: "AW",
                          name: "Apex Wellness LLC",
                          loc: "California · Distributor",
                          score: 88,
                          cls: "bg-sky-100 text-sky-700",
                          blur: false,
                        },
                        {
                          init: "VS",
                          name: "VitaSource Inc.",
                          loc: "Texas · Manufacturer",
                          score: 84,
                          cls: "bg-violet-100 text-violet-700",
                          blur: true,
                        },
                        {
                          init: "GN",
                          name: "GreenNova Pharma",
                          loc: "Florida · Importer",
                          score: 81,
                          cls: "bg-amber-100 text-amber-700",
                          blur: true,
                        },
                      ].map(({ init, name, loc, score, cls, blur }) => (
                        <div
                          key={init}
                          className={`flex items-center gap-3 ${blur ? "blur-[3px] select-none pointer-events-none" : ""}`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold font-mono shrink-0 ${cls}`}
                          >
                            {init}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-800 truncate">
                              {name}
                            </div>
                            <div className="text-xs text-slate-400">{loc}</div>
                          </div>
                          <div className="text-sm font-bold text-brand-600 font-mono shrink-0">
                            {score}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl py-2.5 border border-slate-100">
                      + 30 more verified buyers on paid plans
                    </div>
                  </div>
                </div>
                <div className="px-7 py-4 bg-gradient-to-r from-brand-50 to-sky-50 border-t border-brand-100 flex items-center justify-between gap-4">
                  <p className="text-sm text-slate-600">
                    This is a{" "}
                    <span className="text-brand-600 font-semibold">
                      live sample
                    </span>{" "}
                    - your report refreshes whenever underlying data changes
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleClick}
                    className="btn-shimmer shrink-0 flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-glow-green-sm cursor-pointer"
                  >
                    {userProfile ? "Explore Dashboard" : "Run yours free"}
                    <ArrowRight size={12} />
                    {/* Run yours free  */}
                  </motion.button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="sec-label">
                <Clock size={12} /> Why Report InShort
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                Built for speed, not spreadsheets
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-200">
                          What you need
                        </th>
                        <th className="text-center px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-200">
                          Agency / Report
                        </th>
                        <th className="text-center px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border-b border-brand-100">
                          Report InShort
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {compare.map(([need, trad, marq], i) => (
                        <tr
                          key={need}
                          className={
                            i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }
                        >
                          <td className="px-5 py-3 text-slate-600">{need}</td>
                          <td className="px-4 py-3 text-center text-slate-400">
                            {trad}
                          </td>
                          <td className="px-4 py-3 text-center text-brand-600 font-semibold bg-brand-50/50">
                            {marq}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      icon: Zap,
                      title: "Always live data",
                      desc: "Our data refreshes continuously from 80+ government trade authorities, shipment records, and buyer intent signals.",
                    },
                    {
                      icon: Target,
                      title: "Scored, not guessed",
                      desc: "Every country and buyer gets a 0–100 opportunity score so you always know where to focus first.",
                    },
                    {
                      icon: ShieldCheck,
                      title: "94% data accuracy",
                      desc: "Every data point shows its source, freshness date, and confidence score — full transparency.",
                    },
                    {
                      icon: DollarSign,
                      title: "Fraction of the cost",
                      desc: "Replace ₹80,000 static reports with live intelligence that updates every month for a fraction of the price.",
                    },
                  ].map(({ icon: Icon, title, desc }, i) => (
                    <Reveal key={title} delay={i * 0.08}>
                      <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-white shadow-card hover:border-brand-200 hover:shadow-card-hover transition-all duration-300">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon
                            size={16}
                            className="text-brand-500"
                            strokeWidth={1.8}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm mb-1">
                            {title}
                          </div>
                          <div className="text-xs text-slate-500 leading-relaxed">
                            {desc}
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
        {/* <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="sec-label">
                <Star size={12} /> Trusted by exporters
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
                What our users say
              </h2>
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="#1aa866"
                    className="text-brand-500"
                  />
                ))}
                <span className="text-sm text-slate-500 ml-2">
                  4.8 / 5 · 247 reviews
                </span>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map(({ quote, name, role, initials, color }, i) => (
                <Reveal key={name} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-slate-200 p-7 shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={13}
                          fill="#1aa866"
                          className="text-brand-500"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic flex-1 mb-6">
                      "{quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full font-mono text-xs font-bold flex items-center justify-center ${color}`}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {name}
                        </div>
                        <div className="text-xs text-slate-400">{role}</div>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section> */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-700" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none"
          />

          <Reveal className="relative text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90 mb-6">
              <Award size={11} />
              No credit card required
            </span>
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Your next export market
              <br />
              is 8 minutes away.
            </h2>
            <p className="text-lg text-white/70 font-light mb-10 max-w-lg mx-auto">
              Start free. Run 3 full reports. See real buyers, real demand, and
              real pricing before you pay anything.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/")}
                className="btn-shimmer flex items-center justify-center gap-2 bg-white text-brand-700 font-bold text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
              >
                Create free account <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/pricing")}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium text-base px-8 py-4 rounded-2xl transition-all duration-200 cursor-pointer"
              >
                View pricing
              </motion.button>
            </div>
          </Reveal>
        </section>

        <Footer />
      </PageWrapper>
    </>
  );
}
