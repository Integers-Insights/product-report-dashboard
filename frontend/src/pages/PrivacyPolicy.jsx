import { motion } from "framer-motion";
import { Shield } from "lucide-react";
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

export default function PrivacyPolicy() {
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
                <Shield size={12} />
                Legal
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Privacy Policy
              </h1>
              <p className="text-slate-400 text-sm">Last updated: 7 May 2026</p>
            </motion.div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 pb-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
            <Section title="1. Who We Are">
              <p>
                Integer Market is a product of Integers Insights Private
                Limited, a company incorporated under the laws of India. Our
                registered address is in Mumbai, Maharashtra, India. We operate
                the website integermarket.com and related services.
              </p>
            </Section>

            <Section title="2. Information We Collect">
              <p>
                We collect information you provide directly — such as your name,
                email address, company name, and payment details when you
                register or subscribe.
              </p>
              <p>
                We also collect usage data automatically, including IP
                addresses, browser type, pages visited, and actions taken within
                the platform. This helps us improve the service and detect
                abuse.
              </p>
            </Section>

            <Section title="3. How We Use Your Information">
              <p>
                Your information is used to: provide and improve the Integer
                Market platform; send service-related communications; process
                payments; respond to support queries; and send marketing
                communications (which you may opt out of at any time).
              </p>
              <p>
                We never sell your personal data to third parties. We never
                share your research queries, product lists, or target market
                data with other users or external organisations.
              </p>
            </Section>

            <Section title="4. Data Retention">
              <p>
                We retain your account data for as long as your account is
                active. If you close your account, we delete your personal data
                within 30 days, except where we are legally required to retain
                it (e.g., billing records for 7 years under Indian accounting
                law).
              </p>
            </Section>

            <Section title="5. Your Rights">
              <p>
                You have the right to: access the personal data we hold about
                you; correct inaccurate data; request deletion of your data;
                export your data in a machine-readable format; and withdraw
                consent for marketing communications at any time.
              </p>
              <p>
                To exercise any of these rights, email us at
                info@integersinsights.com
              </p>
            </Section>

            <Section title="6. Cookies">
              <p>
                We use essential cookies to operate the platform and optional
                analytics cookies to understand usage patterns. You can manage
                cookie preferences in your browser settings or through our
                cookie banner.
              </p>
            </Section>

            <Section title="7. Security">
              <p>
                All data in transit is encrypted using TLS 1.3. Data at rest is
                encrypted using AES-256. We conduct regular security audits and
                follow ISO 27001-aligned practices. We notify affected users
                within 72 hours of any data breach.
              </p>
            </Section>

            <Section title="8. Contact">
              <p>
                For privacy-related queries: info@integersinsights.com
                <br />
                Integers Insights Private Limited, Mumbai, Maharashtra, India.
              </p>
            </Section>
          </div>
        </article>

        <Footer />
      </PageWrapper>
    </>
  );
}
