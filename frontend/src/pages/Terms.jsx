import { motion } from "framer-motion";
import { FileText } from "lucide-react";
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

export default function Terms() {
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
                <FileText size={12} />
                Legal
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Terms of Service
              </h1>
              <p className="text-slate-400 text-sm">Last updated: 7 May 2026</p>
            </motion.div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 pb-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using Integer Market ("the Service"), you agree
                to be bound by these Terms of Service. If you do not agree, do
                not use the Service. These terms constitute a legally binding
                agreement between you and Integers Insights Private Limited.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>
                Integer Market provides market intelligence, buyer discovery,
                and trade data services to exporters and manufacturers. The
                Service is provided on a subscription basis, with a free tier
                offering limited reports.
              </p>
            </Section>

            <Section title="3. Account Registration">
              <p>
                You must provide accurate and complete information when creating
                an account. You are responsible for maintaining the security of
                your account credentials. You must not share your account with
                others. Notify us immediately at info@integersinsights.com if
                you suspect unauthorised access.
              </p>
            </Section>

            <Section title="4. Acceptable Use">
              <p>
                You agree not to: scrape, copy, or resell data from the
                platform; use the Service for illegal purposes; attempt to
                reverse-engineer any part of the platform; use automated bots to
                access the Service beyond permitted API limits; or share reports
                externally in ways that violate third-party data rights.
              </p>
            </Section>

            <Section title="5. Intellectual Property">
              <p>
                Integer Market's software, design, and proprietary data models
                are owned by Integers Insights Private Limited. Report outputs
                generated for your account are licensed to you for your internal
                business use only. Resale of report data without written
                permission is prohibited.
              </p>
            </Section>

            <Section title="6. Limitation of Liability">
              <p>
                The Service is provided "as is." We do not guarantee that all
                data is 100% accurate or complete. Integer Market is not liable
                for business decisions made based on platform data. Our total
                liability to you in any month shall not exceed the amount you
                paid us in that month.
              </p>
            </Section>

            <Section title="7. Termination">
              <p>
                We may suspend or terminate your account if you violate these
                terms. You may cancel your subscription at any time from your
                account settings. On termination, your right to access the
                Service ceases immediately.
              </p>
            </Section>

            <Section title="8. Governing Law">
              <p>
                These terms are governed by the laws of India. Any disputes
                shall be subject to the exclusive jurisdiction of the courts of
                Mumbai, Maharashtra, India.
              </p>
            </Section>

            <Section title="9. Contact">
              <p>For terms-related queries: info@integersinsights.com</p>
            </Section>
          </div>
        </article>

        <Footer />
      </PageWrapper>
    </>
  );
}
