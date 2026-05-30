import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  FileSearch,
  Cpu,
  BarChart3,
  Users,
  Zap,
  Globe,
  Download,
  CheckCircle2,
  Bell,
  Lightbulb,
  Box,
  Target,
  Search,
  Megaphone,
  TrendingUp,
  Layers,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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

const steps = [
  {
    n: "01",
    icon: FileSearch,
    title: "Tell us your product",
    desc: "Enter a product name, HS code, or category. Pick the target countries. Takes under 2 minutes.",
    color: "bg-brand-500",
  },
  {
    n: "02",
    icon: Cpu,
    title: "AI pulls live data",
    desc: "Report InShort scans 80+ government trade databases, buyer directories, and demand signals across 180+ countries simultaneously.",
    color: "bg-sky-500",
  },
  {
    n: "03",
    icon: BarChart3,
    title: "Get a scored report",
    desc: "A clear, structured report with 0-100 opportunity scores, pricing benchmarks, and ranked buyer lists - ready in minutes.",
    color: "bg-violet-500",
  },
  {
    n: "04",
    icon: Users,
    title: "Reach your buyers",
    desc: "Use verified contact details, outreach templates, and AI marketing blueprints to start real buyer conversations.",
    color: "bg-amber-500",
  },
];

const features = [
  {
    icon: Zap,
    title: "Always live data",
    desc: "Data refreshes continuously - you're never working with last year's numbers.",
  },
  {
    icon: Target,
    title: "Opportunity scoring",
    desc: "Every country & buyer gets a 0–100 score so you know exactly where to focus.",
  },
  {
    icon: Globe,
    title: "180+ countries",
    desc: "Trade data, demand signals, and buyer lists for markets across every continent.",
  },
  {
    icon: Download,
    title: "Downloadable reports",
    desc: "Export full PDF reports and buyer CSV lists on Navigator and above.",
  },
  {
    icon: CheckCircle2,
    title: "Verified buyer contacts",
    desc: "Real emails, LinkedIn profiles - verified so your outreach actually reaches someone.",
  },
  {
    icon: Box,
    title: "Track multiple products",
    desc: "Monitor up to 50 products across different markets on one dashboard.",
  },
  {
    icon: Lightbulb,
    title: "Confidence scores",
    desc: "Every data point tells you how reliable it is - act on what matters.",
  },
  {
    icon: Bell,
    title: "Market alerts",
    desc: "Get notified the moment demand spikes or new importers appear in your target markets.",
  },
  {
    icon: Layers,
    title: "Custom research",
    desc: "Analysts handle custom requests within 48 hours on Command plans.",
  },
];

const modules = [
  {
    icon: BarChart3,
    title: "Market Demand",
    pills: ["Opportunity score", "YoY growth", "Seasonal trends"],
    desc: "Find how much demand really exists for your product in any country - with growth trends and a clear opportunity score.",
    color: "border-brand-200 bg-brand-50/50",
    iconBg: "bg-brand-100",
    iconColor: "text-brand-600",
  },
  {
    icon: Search,
    title: "Variants & Price Intelligence",
    pills: ["Search volume", "Local languages", "Ad keywords"],
    desc: "Exact variants and prices globally - by country and currency, ready to position.",
    color: "border-sky-200 bg-sky-50/50",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
  },
  {
    icon: Users,
    title: "Buyer Discovery",
    pills: ["Verified emails", "LinkedIn", "Buyer scores"],
    desc: "Find importers actively sourcing your product - with verified contacts and sourcing history.",
    color: "border-violet-200 bg-violet-50/50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: TrendingUp,
    title: "Trade Intelligence",
    pills: ["Customs records", "HS codes", "Trade volumes"],
    desc: "Access real customs and shipment data to size your market with hard numbers, not estimates.",
    color: "border-amber-200 bg-amber-50/50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: Target,
    title: "Competitor Intel",
    pills: ["Competitor pricing", "Market share", "Origins"],
    desc: "See who exports your product, their prices, and market share - find gaps and price competitively.",
    color: "border-rose-200 bg-rose-50/50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  {
    icon: Megaphone,
    title: "Marketing Blueprint",
    pills: ["Ad copy", "Email sequences", "Landing page"],
    desc: "AI-written ad scripts and email sequences - tailored to your product and target country, ready to launch.",
    color: "border-emerald-200 bg-emerald-50/50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  const handleClick = () => {
    let authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    authToken ? navigate("/app") : navigate("/signup");
  };

  let userProfile = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");

  return (
    <>
    <Seo
        title="Find International Buyers with Global Trade Data | Report InShort"
        description="See how Report InShort turns global import export data into a verified export buyer list in minutes. Find foreign buyers, overseas importers, and real demand signals across 180+ countries — free to try."
        url="https://www.reportinshort.com/how-it-works"
      />

      {/* <Helmet>
        <title>
          Find International Buyers with Global Trade Data | Report InShort
        </title>
        <meta
          name="description"
          content="See how Report InShort turns global import export data into a verified export buyer list in minutes. Find foreign buyers, overseas importers, and real demand signals across 180+ countries — free to try."
        />

        <meta
          property="og:title"
          content="Find International Buyers with Global Trade Data | Report InShort"
        />
        <meta
          property="og:url"
          content="https://www.reportinshort.com/how-it-works"
        />

        <meta
          property="og:description"
          content="See how Report InShort turns global import export data into a verified export buyer list in minutes. Find foreign buyers, overseas importers, and real demand signals across 180+ countries — free to try."
        />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href="https://www.reportinshort.com/how-it-works"
        />
      </Helmet> */}
      <Navbar />
      <PageWrapper>
        <section className="relative py-24 px-4 overflow-hidden text-center bg-gradient-to-b from-slate-50 via-white to-white">
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-50" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-400/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sec-label justify-center">
                <Cpu size={12} />
                How it works
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-5 text-balance">
                From product name to real buyers -{" "}
                <span className="gradient-text">in minutes</span>
              </h1>
              <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
                You tell us your product. We scan trade records, buyer
                directories, and demand signals across 180+ countries - so you
                don't spend weeks waiting for a market research agency.
              </p>
            </motion.div>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-brand-200 via-sky-200 via-violet-200 to-amber-200 hidden md:block" />
              <div className="space-y-6">
                {steps.map(({ n, icon: Icon, title, desc, color }, i) => (
                  <Reveal key={n} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="relative flex gap-6 p-7 bg-white rounded-2xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 md:ml-16"
                    >
                      <div
                        className={`absolute -left-8 top-1/2 -translate-y-1/2 hidden md:flex w-16 h-16 -ml-16 rounded-2xl ${color} items-center justify-center shadow-md flex-shrink-0`}
                      >
                        <Icon
                          size={22}
                          className="text-white"
                          strokeWidth={1.8}
                        />
                      </div>
                      <div
                        className={`md:hidden w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon
                          size={20}
                          className="text-white"
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {n}
                          </span>
                          <h3 className="font-bold text-slate-900 text-lg">
                            {title}
                          </h3>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot mask-radial opacity-30" />
          <div className="max-w-6xl mx-auto relative">
            <Reveal className="text-center mb-14">
              <span className="sec-label justify-center">
                <Zap size={12} />
                Platform features
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                Everything a serious market researcher needs
              </h2>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 h-full"
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                      <Icon
                        size={16}
                        className="text-brand-500"
                        strokeWidth={1.8}
                      />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {desc}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="sec-label justify-center">
                <Layers size={12} />
                Intelligence modules
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                Six research engines in one platform
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
                Each module is a specialist engine targeting a different part of
                your export journey. Think of it as your own market research
                firm, running 24/7.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map(
                (
                  { icon: Icon, title, desc, pills, color, iconBg, iconColor },
                  i,
                ) => (
                  <Reveal key={title} delay={i * 0.07}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      className={`rounded-2xl border p-7 h-full transition-all duration-300 ${color} shadow-card hover:shadow-card-hover`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center mb-5`}
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
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">
                        {desc}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {pills.map((p) => (
                          <span
                            key={p}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-white/70 border border-slate-200 text-slate-500"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </Reveal>
                ),
              )}
            </div>
          </div>
        </section>
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-emerald-700" />
          <div className="absolute inset-0 bg-grid opacity-20" />

          <Reveal className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5">
              Start with 3 free reports
            </h2>
            <p className="text-lg text-white/70 font-light mb-10">
              No card needed. See real data on your product before committing to
              any plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClick}
                className="btn-shimmer flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-2xl shadow-lg cursor-pointer"
              >
                {userProfile?"Explore Dashboard":"Start for free"}<ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/pricing")}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-8 py-4 rounded-2xl transition-all cursor-pointer"
              >
                Compare plans
              </motion.button>
            </div>
          </Reveal>
        </section>

        <Footer />
      </PageWrapper>
    </>
  );
}
