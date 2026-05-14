import { motion } from "framer-motion";
import { Database } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function DataPolicy() {
  return (
    <>
      <Navbar />
      <PageWrapper>
        <section className="relative pt-20 pb-10 px-4 text-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-30" />
          <div className="relative max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sec-label justify-center">
                <Database size={12} />
                Legal
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                DATA POLICY
              </h1>
              <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
                REPORTINSHORT
              </h3>
              <p className="text-slate-400 text-sm">
                Last updated: 11 May 2026
              </p>
            </motion.div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 pb-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
            <Section title="1. WHY THIS DOCUMENT EXISTS">
              <p>
                Most platforms bury their data practices in footnotes. We don't.
                This document explains exactly where REPORTINSHORT's data comes
                from, how fresh it is, how reliable it is, and how we handle the
                information you put into the platform. No hidden surprises.
              </p>
            </Section>

            <Section title="2. WHERE OUR DATA COMES FROM">
              <p className="text-base font-medium">
                REPORTINSHORT aggregates intelligence from multiple
                authoritative sources:
              </p>
              <p className="font-medium -mb-0.5">Government Customs Records</p>
              <p>
                Official import/export data from 80+ trade authorities —
                including India's DGFT, the US CBP, the UK's HMRC, EU TARIC, and
                equivalent bodies across Asia, Africa, and Latin America. These
                are primary-source records, not estimates.
              </p>

              <p className="font-medium -mb-0.5">Global Shipment Records</p>
              <p>
                Bill of lading and cargo movement data from major ports
                worldwide. This shows actual trade flows — what's really moving,
                where, and in what volume.
              </p>

              <p className="font-medium -mb-0.5">Verified Buyer Directories</p>
              <p>
                Importer and buyer data sourced from accredited B2B directories
                and publicly available import license registries. Contacts are
                cross-verified against active trade records before being
                included in any report.
              </p>

              <p className="font-medium -mb-0.5">Search & Demand Signals</p>
              <p>
                Aggregated and anonymised search volume data reflecting real
                buyer intent — what importers are actively searching for, by
                country and language.
              </p>

              <p className="font-medium -mb-0.5">
                Trade Publications & Regulatory Monitoring
              </p>
              <p>
                Real-time tracking of industry news and regulatory changes that
                affect demand, tariffs, or market access
              </p>

              <p className="font-medium -mb-0.5">AI Scoring & Synthesis</p>
              <p>
                All raw data passes through our proprietary AI engine. It
                removes duplicates, flags anomalies, cross-references sources,
                and assigns confidence scores before anything reaches your
                report.
              </p>
            </Section>

            <Section title="3. HOW FRESH IS THE DATA?">
              <p className="text-base font-medium">
                We update data on different cycles depending on the source:
              </p>
              <p>
                <span>
                  Buyer data
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
                  &nbsp;&nbsp; Refreshed every 7 days
                </span>
                <br />
                <span>
                  Trade volumes
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
                  &nbsp;&nbsp; Updated monthly (as governments publish customs
                  records)
                </span>
                <br />
                <span>
                  Demand signals
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→
                  &nbsp;&nbsp; Refreshed weekly
                </span>
                <br />
                <span>
                  Confidence scores &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ &nbsp;&nbsp;
                  Recalculated with every data refresh cycle
                </span>
              </p>
              <p>
                You'll always see the last-updated date on every data point
                inside your report.
              </p>
            </Section>

            <Section title="4. WHAT CONFIDENCE SCORES MEAN">
              <p className="text-base font-medium">
                Every insight in a REPORTINSHORT report carries a confidence
                score from 0 to 100. Here's a rough guide:
              </p>
              <p>
                <span>
                  90–100
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;
                  Cross-verified from multiple independent sources. High
                  reliability.
                </span>
                <br />
                <span>
                  75–89
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;
                  Strong primary source data. Reliable for most business
                  decisions.
                </span>
                <br />
                <span>
                  50–74
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp;
                  Single source, or data that hasn't been refreshed recently.
                  Use with caution.
                </span>
                <br />
                <span>
                  Below 50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→&nbsp;&nbsp; Flagged
                  as low-confidence. We show it for completeness, not as a basis
                  for action.
                </span>
              </p>
              <p>
                Our platform average is 94. We recommend acting on insights
                scored 75 and above.
              </p>
            </Section>

            <Section title="5. YOUR DATA ON OUR PLATFORM">
              <p className="text-base font-medium">
                The information you enter — your product searches, target
                markets, saved reports — belongs to you. We use it only to
                generate and personalise your reports. We do not:
              </p>
              <ul className="list-disc ml-8">
                <li>Share your search history with other users</li>
                <li>Sell or licence your research activity to third parties</li>
                <li>
                  Use your competitive intelligence data to build products for
                  your competitors
                </li>
              </ul>
              <p>
                Your data is stored securely and deleted within 30 days of
                account closure.
              </p>
            </Section>

            <Section title="6. BUYER CONTACT DATA">
              <p className="text-base font-medium">
                Buyer contact details in REPORTINSHORT reports are sourced from:
              </p>
              <ul className="list-disc ml-8">
                <li>Publicly available business registries</li>
                <li>Verified import license databases</li>
                <li>Accredited B2B directories</li>
              </ul>
              <p>
                We do not purchase scraped data or harvest private
                communication. Every contact in a report has been matched to an
                active import record before being included.
              </p>
            </Section>

            <Section title="7. IF YOU SPOT A DATA ERROR">
              <p>
                Use the "Flag data issue" button inside any report. Our team
                reviews flagged items within 5 business days. If we confirm an
                error, your report is updated automatically — no need to re-run
                it.
              </p>
            </Section>

            <Section title="7. CONTACT">
              <p className="text-base font-medium">
                Data questions or concerns:
              </p>
              <p className="-mb-0.5">
                <span className="font-medium">Email: </span>
                info@integersinsights.com
              </p>
              <p className="-mb-0.5">
                <span className="font-medium">Phone: </span>+91 93212 56706
              </p>
              <p className="-mb-0.5">
                Integers Insights Private Limited, India
              </p>
            </Section>
          </div>
        </article>

        <Footer />
      </PageWrapper>
    </>
  );
}
