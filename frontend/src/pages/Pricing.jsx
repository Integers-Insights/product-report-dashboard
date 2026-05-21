import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Check,
  Minus,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import CheckoutModal from "../components/CheckoutModal";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

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

const plans = [
  {
    tier: null,
    name: "Trial",
    desc: "Try with real data. No card, no commitment.",
    monthlyPrice: null,
    yearlyPrice: null,
    priceLabel: "Free",
    feats: [
      { text: "3 intelligence reports", ok: true },
      { text: "1 product at a time", ok: true },
      { text: "1 module of your choice", ok: true },
      { text: "Market demand overview", ok: true },
      { text: "Buyer contact details", ok: false },
      { text: "PDF/CSV downloads", ok: false },
      { text: "Demand alerts", ok: false },
    ],
    cta: "Get started free",
    ctaStyle: "outline",
  },
  {
    tier: null,
    name: "Basic",
    desc: "For solo exporters exploring new markets.",
    monthlyPrice: 1499,
    yearlyPrice: 14990,
    feats: [
      { text: "100 reports / month", ok: true },
      { text: "Up to 10 products", ok: true },
      { text: "Any 2 modules", ok: true },
      { text: "Market demand + keywords", ok: true },
      { text: "Basic buyer list (names)", ok: true },
      { text: "Verified buyer contacts", ok: false },
      { text: "PDF/CSV downloads", ok: false },
    ],
    cta: "Start Navigator",
    ctaStyle: "outline",
  },
  {
    tier: null,
    name: "Pro",
    desc: "For exporters ready to close real deals.",
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    badge: "Most Popular",
    feats: [
      { text: "300 reports / month", ok: true },
      { text: "Up to 25 products", ok: true },
      { text: "Any 4 modules", ok: true },
      { text: "Full buyer discovery", ok: true },
      { text: "Verified emails + LinkedIn", ok: true },
      { text: "PDF + CSV downloads", ok: true },
      { text: "Demand alerts", ok: true },
    ],
    cta: "Start Expedition",
    ctaStyle: "primary",
  },
  {
    tier: "Enterprise",
    name: "Command",
    desc: "For trading houses and large export teams.",
    monthlyPrice: null,
    yearlyPrice: null,
    priceLabel: "Custom",
    feats: [
      { text: "Unlimited reports", ok: true },
      { text: "Unlimited products", ok: true },
      { text: "All 6 modules", ok: true },
      { text: "Dedicated account manager", ok: true },
      { text: "Custom research (48hr)", ok: true },
      { text: "Team seats + role access", ok: true },
      { text: "Priority support + onboarding", ok: true },
    ],
    cta: "Talk to our team →",
    ctaStyle: "ghost",
  },
];

const faqs = [
  {
    q: "What counts as one report?",
    a: "One report = one complete intelligence run for a product in a specific country. Re-running a saved product costs 0.5 reports. Browsing saved reports or your dashboard never uses your quota.",
  },
  {
    q: "Can I change my plan anytime?",
    a: "Yes - upgrade or downgrade whenever you like. Upgrades are immediate. Downgrades apply from the next billing date. No cancellation fees, no lock-in.",
  },
  {
    q: "How accurate is the data?",
    a: "We pull from government customs records, verified business directories, and real-time trade APIs. Every data point shows its source and confidence score. Our platform average is 94% accuracy.",
  },
  {
    q: "Is there a real free trial?",
    a: "The Explorer plan is permanently free and gives you 3 full intelligence reports with real data. No watered-down previews - you see exactly what you're buying before you pay.",
  },
  {
    q: "What if I want to leave a yearly plan?",
    a: "Full refund within the first 14 days of any yearly plan - no questions asked. After that, the remaining months are non-refundable but you can use the platform until the period ends.",
  },
  {
    q: "How does Command pricing work?",
    a: "Command is custom priced based on team size, report volume, and module needs. Reach out and we'll put together a proposal within 24 hours.",
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [planList, setPlanList] = useState(plans);
  const navigate = useNavigate();

  const base_url = import.meta.env.VITE_BASE_URL;

  const [currentPlan, setCurrentPlan] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("CtKoIC)iR1SP)5mr&R4d")) || {};
      return (u.current_plan || "").toLowerCase();
    } catch { return ""; }
  });

  useEffect(() => {
    const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    if (!token) return;
    fetch(`${base_url}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.current_plan) {
          setCurrentPlan(data.data.current_plan.toLowerCase());
        }
      })
      .catch(() => {});
  }, [base_url]);

  useEffect(() => {
    fetch(`${base_url}/plans`)
      .then(r => r.json())
      .then(data => {
        if (!data.success) return;
        const priceMap = {};
        data.Plans.forEach(p => { priceMap[p.plan_name.toLowerCase()] = p; });
        setPlanList(plans.map(plan => {
          const api = priceMap[plan.name.toLowerCase()];
          if (!api) return plan;
          return {
            ...plan,
            monthlyPrice: api.monthly_price || plan.monthlyPrice,
            yearlyPrice:  api.yearly_price  || plan.yearlyPrice,
          };
        }));
      })
      .catch(() => {});
  }, [base_url]);

  const handlePaymentSuccess = async (response) => {
    try {
      let token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      const res = await fetch(
        `${base_url}/billing/verify-subscription-payment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        },
      );

      const result = await res.json();

      if (result.success) {
        toast.success("Payment successful");
        navigate("/overview");
      } else {
        toast.error("Verification failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRedirect = (cta) => {
    const authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    if (cta === "Get started free") {
      authToken ? navigate("/overview") : navigate("/login");
      return;
    }
    if (cta === "Talk to our team →") {
      navigate("/contact");
      return;
    }
    if (cta === "Start Navigator") {
      if (!authToken) { navigate("/login"); return; }
      setCheckoutPlan(planList.find(p => p.name === "Basic"));
      return;
    }
    if (cta === "Start Expedition") {
      if (!authToken) { navigate("/login"); return; }
      setCheckoutPlan(planList.find(p => p.name === "Pro"));
      return;
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Find International Buyers Fast - Trade Intelligence Plans & Pricing
        </title>
        <meta
          name="description"
          content="Stop guessing. Report InShort gives you real customs data, buyers email id, and market demand scores for 180+ countries."
        />

        <meta
          property="og:title"
          content="Find International Buyers Fast - Trade Intelligence Plans & Pricing"
        />
        <meta
          property="og:url"
          content="https://www.reportinshort.com/pricing"
        />
        <meta
          property="og:description"
          content="Stop guessing. Report InShort gives you real customs data, buyers email id, and market demand scores for 180+ countries."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.reportinshort.com/pricing" />
      </Helmet>
      <Navbar />
      <PageWrapper>
        <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-40" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-400/8 rounded-full blur-3xl" />

          <div className="relative max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sec-label justify-center">
                <Sparkles size={12} />
                Pricing
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 text-balance">
                Research that fits your budget
              </h1>
              <p className="text-lg text-slate-500 font-light mb-10">
                Same data quality that large enterprises use - at a price for
                growing exporters. Start free.
              </p>
              <div className="inline-flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm">
                <span
                  onClick={() => setYearly(false)}
                  className={`text-sm font-medium cursor-pointer transition-colors ${!yearly ? "text-slate-900" : "text-slate-400"}`}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setYearly((v) => !v)}
                  className="relative w-11 h-6 rounded-full bg-brand-500 transition-all"
                >
                  <motion.div
                    animate={{ x: yearly ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                  />
                </button>
                <span
                  onClick={() => setYearly(true)}
                  className={`text-sm font-medium cursor-pointer transition-colors ${yearly ? "text-slate-900" : "text-slate-400"}`}
                >
                  Yearly{" "}
                  <span className="text-brand-600 bg-brand-50 border border-brand-200 text-xs px-1.5 py-0.5 rounded-full font-semibold ml-1">
                    Save 20%
                  </span>
                </span>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="px-4 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {planList.map(
                (
                  {
                    tier,
                    name,
                    desc,
                    monthlyPrice,
                    yearlyPrice,
                    priceLabel,
                    badge,
                    feats,
                    cta,
                    ctaStyle,
                  },
                  i,
                ) => {
                  const isCurrentPlan = name.toLowerCase() === currentPlan;
                  return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -4 }}
                    className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                      badge
                        ? "bg-brand-500 text-white shadow-glow-green border-2 border-brand-400"
                        : "bg-white border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-200"
                    }`}
                  >
                    {badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-brand-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow border border-brand-200">
                        {badge}
                      </div>
                    )}

                    <div
                      className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${badge ? "text-white/70" : "text-slate-400"}`}
                    >
                      {tier}
                    </div>
                    <div
                      className={`text-xl font-extrabold mb-1 ${badge ? "text-white" : "text-slate-900"}`}
                    >
                      {name}
                    </div>
                    <div
                      className={`text-xs leading-relaxed mb-5 min-h-[36px] ${badge ? "text-white/70" : "text-slate-400"}`}
                    >
                      {desc}
                    </div>

                    <div className="mb-1">
                      {priceLabel ? (
                        <span
                          className={`font-mono text-4xl font-black ${badge ? "text-white" : "text-slate-900"}`}
                        >
                          {priceLabel}
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`font-mono text-4xl font-black ${badge ? "text-white" : "text-slate-900"}`}
                          >
                            ₹
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={yearly ? "y" : "m"}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.2 }}
                              >
                                {yearly ? yearlyPrice : monthlyPrice}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                          {yearly && (
                            <span
                              className={`text-sm line-through ${badge ? "text-white/40" : "text-slate-300"}`}
                            >
                              ${monthlyPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div
                      className={`text-xs mb-6 ${badge ? "text-white/60" : "text-slate-400"}`}
                    >
                      {priceLabel === "Custom"
                        ? "tailored to your scale"
                        : priceLabel === "Free"
                          ? ""
                          : `per month${yearly ? " · billed annually" : ""}`}
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {feats.map(({ text, ok }) => (
                        <li
                          key={text}
                          className={`flex items-start gap-2 text-xs ${ok ? (badge ? "text-white/90" : "text-slate-600") : badge ? "text-white/30" : "text-slate-300"}`}
                        >
                          {ok ? (
                            <Check
                              size={13}
                              className={`shrink-0 mt-0.5 ${badge ? "text-white" : "text-brand-500"}`}
                              strokeWidth={2.5}
                            />
                          ) : (
                            <Minus
                              size={13}
                              className="shrink-0 mt-0.5"
                              strokeWidth={2}
                            />
                          )}
                          {text}
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={{ scale: isCurrentPlan ? 1 : 1.03 }}
                      whileTap={{ scale: isCurrentPlan ? 1 : 0.97 }}
                      onClick={() => !isCurrentPlan && handleRedirect(cta)}
                      disabled={isCurrentPlan}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        isCurrentPlan
                          ? badge
                            ? "bg-white/20 text-white border border-white/30 cursor-default"
                            : "bg-slate-100 text-slate-500 border border-slate-200 cursor-default"
                          : badge
                            ? "bg-white text-brand-600 hover:bg-white/90 shadow-sm"
                            : ctaStyle === "primary"
                              ? "bg-brand-500 text-white hover:bg-brand-600 shadow-glow-green-sm"
                              : ctaStyle === "ghost"
                                ? "bg-brand-50 text-brand-600 border border-brand-200 hover:bg-brand-100"
                                : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-brand-300 hover:text-brand-700"
                      }`}
                    >
                      {isCurrentPlan ? "Current plan" : cta}
                    </motion.button>
                  </motion.div>
                  );
                }
              )}
            </div>

            <Reveal delay={0.1}>
              <p className="text-center text-sm text-slate-400 mt-6">
                All plans include SSL security, GDPR compliance, and full data
                transparency.{" "}
                <span
                  className="text-brand-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/about")}
                >
                  Learn about our data →
                </span>
              </p>
            </Reveal>
          </div>
        </section>
        <div className="border-y border-slate-100 bg-slate-50 py-8 px-4">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: Shield,
                title: "GDPR + SSL secured",
                desc: "All data encrypted in transit and at rest with AES-256 and TLS.",
              },
              {
                icon: Zap,
                title: "14-day money back",
                desc: "Not happy with your yearly plan? Full refund within 14 days, no questions.",
              },
              {
                icon: Check,
                title: "Cancel anytime",
                desc: "No lock-in contracts. Upgrade, downgrade, or cancel whenever you like.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon size={16} className="text-brand-500" />
                </div>
                <div className="font-bold text-slate-800 text-sm">{title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>
        <section className="py-24 px-4">
          <div className="max-w-2xl mx-auto">
            <Reveal className="text-center mb-12">
              <span className="sec-label justify-center">FAQ</span>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                Pricing, answered simply
              </h2>
            </Reveal>

            <div className="space-y-2">
              {faqs.map(({ q, a }, i) => (
                <Reveal key={q} delay={i * 0.05}>
                  <div
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="group rounded-2xl border border-slate-200 bg-white hover:border-brand-200 transition-colors cursor-pointer overflow-hidden"
                  >
                    <div className="flex justify-between items-center px-6 py-4 gap-4">
                      <span className="text-sm font-semibold text-slate-800">
                        {q}
                      </span>
                      <motion.div
                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown
                          size={16}
                          className="text-slate-400 shrink-0"
                        />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 pt-0 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                            {a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </PageWrapper>

      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          initialYearly={yearly}
          baseUrl={base_url}
          onSuccess={handlePaymentSuccess}
          onClose={() => setCheckoutPlan(null)}
        />
      )}
    </>
  );
}
