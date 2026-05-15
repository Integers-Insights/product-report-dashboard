import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Tag } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

const posts = [
  {
    tag: "Market Entry",
    title: "How to Find Verified Buyers in Europe Without Cold Calling",
    excerpt:
      "Most Indian exporters burn weeks on unqualified leads. Here's a data-driven approach to reaching verified European importers before your competitors do.",
    date: "Apr 28, 2026",
    readTime: "6 min read",
    color: "bg-brand-50 text-brand-600",
    featured: true,
  },
  {
    tag: "Trade Intelligence",
    title: "Understanding HS Codes: The Backbone of Global Trade Data",
    excerpt:
      "HS codes aren't just a customs formality - they're the key to unlocking buyer discovery, competitor tracking, and demand forecasting.",
    date: "Apr 20, 2026",
    readTime: "5 min read",
    color: "bg-sky-50 text-sky-600",
  },
  {
    tag: "Case Study",
    title: "How Kapoor Exports Found Their First German Buyer in 6 Weeks",
    excerpt:
      "A Gujarat-based nutraceuticals manufacturer used Report InShort to identify demand, shortlist buyers, and close their first export deal in Europe.",
    date: "Apr 14, 2026",
    readTime: "4 min read",
    color: "bg-violet-50 text-violet-600",
  },
  {
    tag: "Data & AI",
    title: 'What Does "Confidence Score" Really Mean in Trade Data?',
    excerpt:
      "Not all trade data is equal. We explain how Report InShort scores every data point - and why you should always check the confidence label before acting.",
    date: "Apr 8, 2026",
    readTime: "7 min read",
    color: "bg-amber-50 text-amber-600",
  },
  {
    tag: "Keyword Intelligence",
    title: "The Buyer Intent Signals You're Missing in Search Data",
    excerpt:
      "Global buyers search for suppliers in local languages. We break down how to use multi-language keyword data to reach buyers before they reach your competitors.",
    date: "Mar 30, 2026",
    readTime: "5 min read",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    tag: "Export Strategy",
    title: "Top 5 Mistakes Indian Exporters Make When Entering New Markets",
    excerpt:
      "Based on data from 2,400+ exporters on our platform, here are the most common and costly mistakes - and exactly how to avoid them.",
    date: "Mar 22, 2026",
    readTime: "8 min read",
    color: "bg-rose-50 text-rose-600",
  },
];

const categories = [
  "All",
  "Market Entry",
  "Trade Intelligence",
  "Case Study",
  "Data & AI",
  "Export Strategy",
  "Keyword Intelligence",
];

export default function Blog() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        <section className="relative pt-20 pb-16 px-4 text-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-40" />
          <div className="relative max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sec-label justify-center">
                <BookOpen size={12} />
                Blog
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 text-balance">
                Export intelligence,{" "}
                <span className="gradient-text">explained</span>
              </h1>
              <p className="text-lg text-slate-500 font-light">
                Practical guides, case studies, and data insights for exporters
                navigating global markets.
              </p>
            </motion.div>
          </div>
        </section>
        <div className="px-4 pb-8">
          <div className="max-w-6xl mx-auto flex gap-2 flex-wrap justify-center">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  i === 0
                    ? "bg-brand-500 text-white border-brand-500 shadow-glow-green-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <section className="px-4 pb-24">
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-6">
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 p-8 cursor-pointer md:flex gap-8"
              >
                <div className="flex-1">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${posts[0].color} border border-current/20`}
                  >
                    {posts[0].tag}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
                    {posts[0].title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {posts[0].readTime}
                    </span>
                    <span>{posts[0].date}</span>
                    <span className="ml-auto flex items-center gap-1 text-brand-600 font-semibold">
                      Read more <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
                <div className="hidden md:block w-72 h-44 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl border border-brand-200 shrink-0 mt-6 md:mt-0" />
              </motion.div>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts
                .slice(1)
                .map(({ tag, title, excerpt, date, readTime, color }, i) => (
                  <Reveal key={title} delay={i * 0.07}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-card hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 cursor-pointer h-full flex flex-col"
                    >
                      <span
                        className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${color} border border-current/20 w-fit`}
                      >
                        {tag}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug flex-1">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {readTime}
                        </span>
                        <span>{date}</span>
                      </div>
                    </motion.div>
                  </Reveal>
                ))}
            </div>
          </div>
        </section>

        <Footer />
      </PageWrapper>
    </>
  );
}
