import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  Eye,
  CreditCard,
  Ban,
  Globe,
  Ship,
  Search,
  Building2,
  Newspaper,
  Cpu,
  ArrowRight,
  Award,
  Users2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";

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
    initials: "NR",
    name: "Nikhil Raut",
    role: "Co-founder & CEO",
    bio: "10 years in international trade consulting. Helped 200+ Indian manufacturers break into European and US markets.",
    color: "bg-brand-100 text-brand-700",
    border: "border-brand-200",
  },
  {
    initials: "YM",
    name: "Yukta Moolya",
    role: "AI/ML Engineer",
    bio: "Builds LLM-integrated SaaS platforms for real-world marketing intelligence. Shipped production AI systems spanning ML, CV, and cloud infrastructure.",
    color: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
  },
  {
    initials: "NN",
    name: "Neel Naik",
    role: "Data Engineer",
    bio: "Architects production-grade backends and databases that power AI SaaS at scale. Python, FastAPI, AWS, RDS — shipped and battle-tested.",
    color: "bg-violet-100 text-violet-700",
    border: "border-violet-200",
  },
  {
    initials: "AG",
    name: "Amarjit Gupta",
    role: "Full-Stack Developer",
    bio: "Builds sleek, scalable full-stack products across MERN, Next.js, TypeScript and Tailwind — from pixel-perfect UI to production-ready databases.",
    color: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
  },
];

const trust = [
  {
    icon: Lock,
    title: "256-bit Encryption",
    desc: "All data in transit and at rest is encrypted using AES-256 and TLS.",
  },
  {
    icon: Globe,
    title: "GDPR Compliant",
    desc: "GDPR principles for all users globally. Request, export, or delete data anytime.",
  },
  {
    icon: ShieldCheck,
    title: "ISO 27001 Aligned",
    desc: "Infrastructure and processes aligned to ISO 27001 information security standards.",
  },
  {
    icon: Ban,
    title: "We Never Sell Your Data",
    desc: "Your product list, target markets, and search history are never shared. Full stop.",
  },
  {
    icon: Eye,
    title: "Your Research Stays Private",
    desc: "Other users cannot see what you're tracking. Your competitive intelligence stays yours.",
  },
  {
    icon: CreditCard,
    title: "Safe Payments via Stripe",
    desc: "PCI DSS Level 1 certified. We never store your card details.",
  },
];

const sources = [
  {
    icon: Building2,
    title: "Government Trade Records",
    desc: "Official customs data from 80+ authorities — DGFT, US CBP, HMRC, EU TARIC.",
  },
  {
    icon: Ship,
    title: "Global Shipment Records",
    desc: "Bill of lading and shipment data from major ports worldwide — actual trade flows.",
  },
  {
    icon: Search,
    title: "Search & Buyer Intent",
    desc: "Aggregated search volume across Google and trade platforms — real buyer demand signals.",
  },
  {
    icon: Building2,
    title: "Verified Business Directories",
    desc: "Buyer and importer data from accredited B2B directories and import license registries.",
  },
  {
    icon: Newspaper,
    title: "Trade News & Publications",
    desc: "Real-time tracking of trade publications and regulatory changes affecting demand.",
  },
  {
    icon: Cpu,
    title: "AI Scoring & Synthesis",
    desc: "All raw data passes through our AI engine — confidence scores, anomaly removal, ranking.",
  },
];

const statCells = [
  { num: "2,418+", label: "Exporters on Report InShort" },
  { num: "1.24M", label: "Reports generated" },
  { num: "48K+", label: "Verified buyers indexed" },
  { num: "94%", label: "Average data confidence" },
];

export default function About() {
  const navigate = useNavigate();

  const handleClick = () => {
    let authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    authToken ? navigate("/overview") : navigate("/login");
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <section className="relative pt-20 pb-24 px-4 overflow-hidden text-center bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-40" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-400/8 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sec-label justify-center">
                <Award size={12} />
                About Report InShort
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-5 text-balance">
                We built the platform
                <br />
                <span className="gradient-text">we wished existed</span>
              </h1>
              <p className="text-lg text-slate-500 font-light max-w-2xl mx-auto mb-12">
                We watched manufacturers spend months and lakhs of rupees on
                outdated reports from traditional agencies — only to still be
                guessing when they entered a market. Static Mintel reports and
                slow research firms weren't built for modern global trade. So we
                built something better.
              </p>
              <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-card relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center shadow-glow-green-sm">
                  <span className="text-white font-serif text-lg font-bold">
                    "
                  </span>
                </div>
                <p className="text-slate-700 text-base leading-relaxed font-light italic mb-5">
                  Our mission is simple: give every exporter — whether they're a
                  one-person operation or a 500-crore trading house — the same
                  quality of market intelligence that Fortune 500 companies take
                  for granted.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold font-mono">
                    NR
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-800">
                      Nikhil Raut
                    </div>
                    <div className="text-xs text-slate-400">
                      Co-founder & CEO
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        <div className="bg-brand-500 py-12 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {statCells.map(({ num, label }) => (
              <div key={label} className="bg-brand-500 px-6 py-5 text-center">
                <div className="font-mono text-3xl font-black text-white mb-1">
                  {num}
                </div>
                <div className="text-xs text-brand-200">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <Reveal className="text-center mb-14">
              <span className="sec-label justify-center">
                <Users2 size={12} />
                The team
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                The people behind your intelligence
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-xl mx-auto">
                International trade, data engineering, and AI — because solving
                this problem requires all three.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map(({ initials, name, role, bio, color, border }, i) => (
                <Reveal key={name} delay={i * 0.09}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl border border-slate-200 p-7 text-center shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 h-full"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl ${color} border-2 ${border} flex items-center justify-center text-xl font-black font-mono mx-auto mb-4`}
                    >
                      {initials}
                    </div>
                    <div className="font-bold text-slate-900 text-base mb-1">
                      {name}
                    </div>
                    <div className="text-xs text-slate-400 mb-4">{role}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">
                      {bio}
                    </div>
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
                <ShieldCheck size={12} />
                Security & trust
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Why you can trust us with your business data
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-xl mx-auto">
                Your export strategy is your competitive edge. We protect it
                like it's our own.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {trust.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl border border-slate-200 p-7 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 h-full"
                  >
                    <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-5">
                      <Icon
                        size={20}
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
        <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot mask-radial opacity-30" />
          <div className="max-w-6xl mx-auto relative">
            <Reveal className="text-center mb-14">
              <span className="sec-label justify-center">
                <Globe size={12} />
                Data transparency
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Where does our data come from?
              </h2>
              <p className="text-lg text-slate-500 font-light max-w-xl mx-auto">
                We don't hide this. Every data source is documented,
                freshness-dated, and confidence-scored on your report.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {sources.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 0.07}>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-4 shadow-card hover:border-brand-200 transition-colors h-full">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon
                        size={18}
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

            <Reveal delay={0.2}>
              <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-brand-200 p-7 text-center shadow-card">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every report shows the{" "}
                  <strong className="text-slate-800">data source</strong>,{" "}
                  <strong className="text-slate-800">last updated date</strong>,
                  and{" "}
                  <strong className="text-slate-800">confidence score</strong>{" "}
                  for each insight. Transparency is what separates us from every
                  overpriced, outdated market research PDF.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-emerald-700" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          <Reveal className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-5">
              Confident in our data. You should be too.
            </h2>
            <p className="text-lg text-white/70 font-light mb-10">
              Start with 3 free reports — no card, no pressure. Judge us
              entirely on the quality of the data.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClick}
                className="btn-shimmer flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-2xl shadow-lg"
              >
                Run your first report free <ArrowRight size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/pricing")}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-8 py-4 rounded-2xl transition-all"
              >
                See plans
              </motion.button>
            </div>
          </Reveal>
        </section>

        <Footer />
      </PageWrapper>
    </>
  );
}
