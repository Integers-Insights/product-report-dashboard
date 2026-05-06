import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Users2, ArrowRight } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Navbar from "../Components/Navbar";

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

const team = [
  {
    initials: "AK",
    name: "Aryan Kapoor",
    role: "Co-founder & CEO",
    bio: "10 years in international trade consulting. Helped 200+ Indian manufacturers break into European and US markets. Former director at a leading export promotion council.",
    color: "bg-brand-100 text-brand-700",
    border: "border-brand-200",
  },
  {
    initials: "PM",
    name: "Priya Menon",
    role: "Co-founder & CTO",
    bio: "Former data engineer at a global trade intelligence firm. Built real-time pipelines processing 40M+ trade records daily. IIT Bombay alumni.",
    color: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
  },
  {
    initials: "RS",
    name: "Rohan Shah",
    role: "Head of AI & Data",
    bio: "PhD in computational linguistics. Designed the models that map buyer intent signals across 28 languages globally. Previously at Google Research.",
    color: "bg-violet-100 text-violet-700",
    border: "border-violet-200",
  },
  {
    initials: "NJ",
    name: "Neha Joshi",
    role: "Head of Partnerships",
    bio: "Formerly with FIEO and CII. Manages data access agreements with government trade bodies and chambers of commerce across 40+ countries.",
    color: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
  },
  {
    initials: "VR",
    name: "Vikram Rao",
    role: "Head of Product",
    bio: "Ex-product lead at two B2B SaaS unicorns. Obsessed with reducing time-to-insight for exporter workflows. 8 years in product management.",
    color: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
  },
  {
    initials: "SA",
    name: "Shruti Agarwal",
    role: "Head of Customer Success",
    bio: "Built the onboarding and success programs from zero. Ensures every exporter gets their first international lead within 30 days of joining.",
    color: "bg-rose-100 text-rose-700",
    border: "border-rose-200",
  },
];

const values = [
  {
    title: "Transparency first",
    desc: "Every data point we show includes its source, freshness date, and confidence score. No black boxes.",
  },
  {
    title: "Exporters first",
    desc: "Every feature decision starts with one question: does this help an exporter find buyers faster?",
  },
  {
    title: "Data integrity",
    desc: "We verify, score, and flag every dataset. We never ship unconfident data without labelling it clearly.",
  },
  {
    title: "Continuous improvement",
    desc: "Our models retrain weekly. Our buyer data refreshes daily. We never let the platform go stale.",
  },
];

export default function Team() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Hero */}
        <section className="relative pt-20 pb-20 px-4 text-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-40" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-400/8 rounded-full blur-3xl" />
          <div className="relative max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sec-label justify-center">
                <Users2 size={12} />
                Our Team
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 text-balance">
                The people behind{" "}
                <span className="gradient-text">your intelligence</span>
              </h1>
              <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto">
                International trade, data engineering, and AI expertise —
                because solving this problem requires all three. We're a team of
                builders who've lived the exporter's pain firsthand.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Team grid */}
        <section className="px-4 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {team.map(({ initials, name, role, bio, color, border }, i) => (
                <Reveal key={name} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-slate-200 p-7 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 h-full flex flex-col"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${color} border-2 ${border} flex items-center justify-center text-xl font-black font-mono mb-4`}
                    >
                      {initials}
                    </div>
                    <div className="font-bold text-slate-900 text-base mb-0.5">
                      {name}
                    </div>
                    <div className="text-xs text-brand-600 font-semibold mb-3">
                      {role}
                    </div>
                    <div className="text-sm text-slate-500 leading-relaxed flex-1">
                      {bio}
                    </div>
                    <a
                      href="#"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-600 transition-colors"
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      LinkedIn
                    </a>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <Reveal className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                How we work
              </h2>
              <p className="text-slate-500 font-light">
                The principles that guide every decision we make.
              </p>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-5">
              {values.map(({ title, desc }, i) => (
                <Reveal key={title} delay={i * 0.07}>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:border-brand-200 transition-colors">
                    <div className="font-bold text-slate-900 mb-2">{title}</div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-emerald-700" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <Reveal className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white mb-5">
              Join our team
            </h2>
            <p className="text-lg text-white/70 font-light mb-8">
              We're always looking for exceptional people who want to reshape
              global trade.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/contact")}
              className="btn-shimmer inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-2xl shadow-lg"
            >
              Get in touch <ArrowRight size={16} />
            </motion.button>
          </Reveal>
        </section>

        <Footer />
      </PageWrapper>
    </>
  );
}
