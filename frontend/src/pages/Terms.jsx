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
                TERMS OF SERVICE
              </h1>
              <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
                REPORTINSHORT
              </h3>
              <p className="text-slate-400 text-sm">
                Last updated: 11 May 2026
              </p>
              <p className="text-slate-400 text-sm">
                Operated by: Integers Insights Private Limited
              </p>
            </motion.div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 pb-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
            <Section title="1. THE SHORT VERSION">
              <p>
                Use REPORTINSHORT fairly, don't misuse the data, and we'll give
                you reliable market intelligence to grow your export business.
                That's the deal in one line. The rest of this document fills in
                the specifics.
              </p>
            </Section>

            <Section title="2. WHO THESE TERMS APPLY TO">
              <p>
                These Terms of Service apply to anyone who creates an account or
                uses REPORTINSHORT — whether you're on the free plan or a paid
                plan. By signing up, you agree to these terms. If you're signing
                up on behalf of a company, you confirm you have the authority to
                do so.
              </p>
              <p>
                REPORTINSHORT is operated by Integers Insights Private Limited,
                incorporated in India.
              </p>
            </Section>

            <Section title="3. WHAT REPORTINSHORT PROVIDES">
              <p>
                REPORTINSHORT is a market intelligence platform. It pulls
                together trade data, buyer information, demand signals, and
                competitive insights from multiple sources, runs them through
                our AI engine, and delivers structured reports to help you make
                better export decisions.
              </p>
              <p>
                We offer a free plan and several paid subscription tiers.
                Features vary by plan — see our Pricing page for the current
                breakdown.
              </p>
            </Section>

            <Section title="4. YOUR ACCOUNT">
              <p className="font-medium -mb-0.5">
                You're responsible for your account. That means:
              </p>
              <ul className="list-disc ml-8">
                <li>Provide accurate information when signing up</li>
                <li>Keep your login credentials secure</li>
                <li>Don't share your account with others</li>
                <li>
                  Tell us immediately if you think your account has been
                  compromised (info@integersinsights.com)
                </li>
              </ul>
              <p>
                Each subscription is for one business. If you need team access,
                look at our Command plan or contact us.
              </p>
            </Section>

            <Section title="6. ACCEPTABLE USE">
              <p className="font-medium -mb-0.5">
                You can use REPORTINSHORT for your own legitimate business
                research. You cannot:
              </p>
              <ul className="list-disc ml-8">
                <li>Scrape, copy, or resell data from the platform</li>
                <li>
                  Share reports externally in ways that violate third-party data
                  rights
                </li>
                <li>
                  Use the platform to target individuals for harassment or spam
                </li>
                <li>
                  Attempt to reverse-engineer or hack any part of the platform
                </li>
                <li>
                  Use automated bots to extract data beyond what our API permits
                </li>
                <li>
                  Use the platform for anything illegal under Indian or
                  international law
                </li>
              </ul>
              <p>
                We reserve the right to suspend accounts that violate these
                rules — with or without notice, depending on severity.
              </p>
            </Section>

            <Section title="7. DATA AND REPORTS">
              <p className="font-medium -mb-0.5">
                Reports generated on REPORTINSHORT are licensed to you for your
                internal business use. You may share individual insights with
                your team, but you may not:
              </p>
              <ul className="list-disc ml-8">
                <li>Resell reports or data extracts as a product or service</li>
                <li>
                  Publish report content publicly without attribution and our
                  written permission
                </li>
                <li>
                  Pass report data to a competitor or third-party intelligence
                  service
                </li>
              </ul>
              <p>
                We take data integrity seriously. Every data point in your
                report shows its source, freshness date, and confidence score.
                That said, no dataset is perfect — trade data has inherent
                limitations, and we recommend cross-referencing high-stakes
                decisions with additional sources.
              </p>
            </Section>

            <Section title="6. INTELLECTUAL PROPERTY">
              <p>
                The REPORTINSHORT platform, its design, AI models, and
                proprietary scoring systems are owned by Integers Insights
                Private Limited. Nothing in these terms transfers any
                intellectual property rights to you beyond the limited licence
                to use the reports you generate.
              </p>
              <p>
                The name "REPORTINSHORT" and related branding are trademarks of
                Integers Insights Private Limited.
              </p>
            </Section>

            <Section title="6. AVAILABILITY AND CHANGES">
              <p>
                We aim for high uptime, but we don't guarantee the platform will
                be available 24/7. We may occasionally need to take it offline
                for maintenance — we'll always try to give advance notice when
                possible.
              </p>
              <p>
                We may update or change platform features over time. If we
                remove a feature you rely on, we'll give reasonable notice and,
                where appropriate, a refund for the unused period.
              </p>
            </Section>

            <Section title="6. LIMITATION OF LIABILITY">
              <p>
                REPORTINSHORT is a research tool, not a financial advisor. We
                are not liable for business decisions you make based on platform
                data. Our total liability to you in any billing period will not
                exceed the amount you paid us in that period.
              </p>
              <p>
                We are not liable for data accuracy issues arising from
                third-party government or directory sources.
              </p>
            </Section>

            <Section title="6. TERMINATION">
              <p>
                You can cancel anytime from your account settings. We can
                suspend or terminate your account if you violate these terms. On
                termination, you lose access to the platform but we retain your
                data for 30 days in case you return.
              </p>
            </Section>

            <Section title="6. GOVERNING LAW">
              <p>
                These terms are governed by the laws of India. Any disputes will
                be resolved in the courts of Mumbai, Maharashtra, India.
              </p>
            </Section>

            <Section title="7. CONTACT">
              <p className="text-base font-medium">
                Questions? Reach our team at:
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
