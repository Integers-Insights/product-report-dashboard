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
                GDPR COMPLIANCE
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
            <Section title="1. OUR COMMITMENT">
              <p>
                REPORTINSHORT applies GDPR principles to every user globally -
                not just users based in the European Economic Area. We believe
                strong data protection is a right, not a regional checkbox.
              </p>
              <p>
                This document explains what GDPR is, how it applies to your use
                of REPORTINSHORT, and exactly what rights you have.
              </p>
            </Section>

            <Section title="2. WHAT IS GDPR?">
              <p>
                The General Data Protection Regulation (GDPR) is a European law
                that sets high standards for how organisations collect, store,
                and use personal data. Even though Integers Insights Private
                Limited is based in India, we serve users in Europe and have
                adopted GDPR principles as our baseline standard for all users
                worldwide.
              </p>
            </Section>

            <Section title="3. WHY WE PROCESS YOUR DATA (LAWFUL BASIS)">
              <p className="text-base font-medium">
                Under GDPR, every piece of data processing needs a legal reason.
                Here's ours:
              </p>

              <p className="font-medium -mb-0.5">Contract</p>
              <p>
                We process your name, email, and account data because you've
                entered into a subscription agreement with us. Without this
                data, we can't provide the service.
              </p>

              <p className="font-medium -mb-0.5">Legitimate Interests</p>
              <p>
                We process usage and session data to improve the platform,
                detect fraud, and maintain security. We've balanced this against
                your privacy rights and concluded it's proportionate.
              </p>

              <p className="font-medium -mb-0.5">Consent</p>
              <p>
                We only send marketing emails with your explicit consent, and
                only use optional analytics cookies with your consent. You can
                withdraw either at any time.
              </p>
            </Section>

            <Section title="4. YOUR RIGHTS UNDER GDPR">
              <p className="text-base font-medium">
                You have the following rights, and exercising them is free and
                straightforward:
              </p>

              <p className="font-medium -mb-0.5">Right to Access</p>
              <p>
                You can ask us for a copy of all personal data we hold about
                you. We'll send it within 30 days.
              </p>

              <p className="font-medium -mb-0.5">Right to Rectification</p>
              <p>
                If any of your data is wrong or out of date, tell us and we'll
                fix it.
              </p>

              <p className="font-medium -mb-0.5">
                Right to Erasure ("Right to be Forgotten")
              </p>
              <p>
                You can ask us to delete your personal data. We'll do so within
                30 days, except where we have a legal obligation to retain it
                (e.g., billing records).
              </p>

              <p className="font-medium -mb-0.5">Right to Restriction</p>
              <p>
                You can ask us to pause processing your data while we resolve a
                dispute about its accuracy or our lawful basis for using it.
              </p>

              <p className="font-medium -mb-0.5">Right to Data Portability</p>
              <p>
                You can ask for your data in a structured, machine-readable
                format (JSON or CSV). Useful if you're switching services.
              </p>

              <p className="font-medium -mb-0.5">Right to Object</p>
              <p>
                You can object to processing based on legitimate interests - for
                example, if you feel our interest doesn't outweigh your privacy
                right in a specific case. We'll review and respond within 30
                days.
              </p>

              <p className="font-medium -mb-0.5">Right to Withdraw Consent</p>
              <p>
                If you gave consent for marketing emails or analytics cookies,
                you can withdraw it at any time. Withdrawal doesn't affect
                anything we processed before then.
              </p>
              <p>
                To exercise any of these rights, email info@integersinsights.com
                with "GDPR Request" in the subject line. We'll respond within 30
                days - and usually much faster.
              </p>
            </Section>

            <Section title="5. INTERNATIONAL DATA TRANSFERS">
              <p>
                Integers Insights Private Limited is based in India. When data
                is transferred between our systems and users in the European
                Economic Area, we rely on Standard Contractual Clauses (SCCs) -
                the mechanism approved by the European Commission for
                international transfers - to ensure your data stays protected.
              </p>
            </Section>

            <Section title="6. OUR PROCESSORS">
              <p className="text-base font-medium">
                We share your data with a small number of carefully selected
                third-party processors to operate the platform:
              </p>
              <ul className="list-disc ml-8">
                <li>
                  Cloud infrastructure providers (for hosting and storage)
                </li>
                <li>Razorpay (for payment processing)</li>
                <li>
                  Email service providers (for transactional and marketing
                  emails)
                </li>
              </ul>
              <p>
                Every processor is bound by a Data Processing Agreement (DPA).
                None of them may use your data for their own purposes.
              </p>
            </Section>

            <Section title="7. DATA BREACH NOTIFICATION">
              <p className="text-base font-medium">
                If we ever experience a personal data breach that poses a risk
                to your rights, we will:
              </p>
              <ol className="list-decimal ml-8">
                <li>
                  Cloud infrastructure providers (for hosting and storage)
                </li>
                <li>Razorpay (for payment processing)</li>
                <li>
                  Email service providers (for transactional and marketing
                  emails)
                </li>
              </ol>
              <p>We haven't had a breach. We intend to keep it that way.</p>
            </Section>

            <Section title="6. YOUR RIGHT TO COMPLAIN">
              <p className="text-base font-medium">
                If you feel we've handled your data incorrectly, please contact
                us first - we want to make it right. If you're not satisfied
                with our response, you have the right to lodge a complaint with:
              </p>
              <ul className="list-disc ml-8">
                <li>
                  Your local EU data protection supervisory authority (if you're
                  in the EEA)
                </li>
                <li>India's data protection authority (under DPDPA 2023)</li>
              </ul>
            </Section>

            <Section title="7. CONTACT">
              <p className="text-base font-medium">Data protection queries:</p>
              <p className="-mb-0.5">
                <span className="font-medium">Email: </span>
                info@integersinsights.com
              </p>
              <p className="-mb-0.5">
                <span className="font-medium">Phone: </span>+91 89769 93084
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
