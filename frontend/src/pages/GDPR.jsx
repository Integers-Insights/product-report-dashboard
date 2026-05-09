import { motion } from "framer-motion";
import { Globe } from "lucide-react";
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

export default function GDPR() {
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
                <Globe size={12} />
                Legal
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                GDPR Compliance
              </h1>
              <p className="text-slate-400 text-sm">Last updated: 7 May 2026</p>
            </motion.div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 pb-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-8">
              <p className="text-sm text-brand-800 leading-relaxed">
                Integer Market applies GDPR principles to all users globally —
                not just those in the European Economic Area. We believe strong
                data protection is a right, not a regional privilege.
              </p>
            </div>

            <Section title="1. Lawful Basis for Processing">
              <p>
                We process your personal data on the following lawful bases:{" "}
                <strong className="text-slate-800">Contract</strong> - to
                provide the service you have subscribed to;{" "}
                <strong className="text-slate-800">Legitimate interests</strong>{" "}
                - to improve our platform, prevent fraud, and maintain security;{" "}
                <strong className="text-slate-800">Consent</strong> - for
                marketing communications and optional analytics cookies.
              </p>
            </Section>

            <Section title="2. Your GDPR Rights">
              <p>Under GDPR, you have the right to:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  <strong className="text-slate-800">Access</strong> - request a
                  copy of all personal data we hold about you
                </li>
                <li>
                  <strong className="text-slate-800">Rectification</strong> -
                  correct inaccurate or incomplete data
                </li>
                <li>
                  <strong className="text-slate-800">Erasure</strong> - request
                  deletion of your data ("right to be forgotten")
                </li>
                <li>
                  <strong className="text-slate-800">Restriction</strong> -
                  limit how we process your data
                </li>
                <li>
                  <strong className="text-slate-800">Portability</strong> -
                  receive your data in a machine-readable format
                </li>
                <li>
                  <strong className="text-slate-800">Object</strong> - opt out
                  of processing based on legitimate interests
                </li>
                <li>
                  <strong className="text-slate-800">Withdraw consent</strong> -
                  for any processing based on consent
                </li>
              </ul>
              <p>
                To exercise any right, email gdpr@integermarket.com. We respond
                within 30 days.
              </p>
            </Section>

            <Section title="3. Data Transfers">
              <p>
                Integer Market is based in India. When we transfer data to or
                from the EEA, we use Standard Contractual Clauses (SCCs)
                approved by the European Commission to ensure an adequate level
                of protection.
              </p>
            </Section>

            <Section title="4. Data Processor Relationships">
              <p>
                We use a limited number of third-party processors (cloud
                hosting, payment processing, email delivery). All processors are
                bound by Data Processing Agreements (DPAs) and are prohibited
                from using your data for their own purposes.
              </p>
            </Section>

            <Section title="5. Breach Notification">
              <p>
                In the event of a personal data breach, we will notify the
                relevant supervisory authority within 72 hours and affected
                users without undue delay, as required by Article 33 of the
                GDPR.
              </p>
            </Section>

            <Section title="6. Data Protection Officer">
              <p>
                Our Data Protection contact: info@integersinsights.com
                <br />
                Integers Insights Private Limited, Mumbai, Maharashtra, India.
              </p>
              <p>
                You also have the right to lodge a complaint with your local
                data protection authority.
              </p>
            </Section>
          </div>
        </article>

        <Footer />
      </PageWrapper>
    </>
  );
}
