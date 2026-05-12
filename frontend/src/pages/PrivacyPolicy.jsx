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
                PRIVACY POLICY
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
            <Section title="1. WHO WE ARE">
              <p>REPORTINSHORT is a market intelligence platform operated by Integers Insights Private Limited, a company incorporated in India. When you use our platform, you're sharing some information with us — and we take that seriously.</p>
              <p>This policy explains what we collect, why we collect it, how we protect it, and what rights you have over it. No legalese, no surprises.</p>
            </Section>

            <Section title="2. WHAT INFORMATION WE COLLECT">
              <p className="text-base font-medium">
                When you sign up or subscribe, you give us:
              </p>
              <ul className="list-disc ml-8">
                <li>
                  Your name, email address, and company name
                </li>
                <li>
                  Payment details (processed securely through Razorpay — we never see your card number)
                </li>
                <li>Business information you enter to personalise your reports</li>
              </ul>

              <p className="text-base font-medium">
                When you use the platform, we automatically collect:
              </p>
              <ul className="list-disc ml-8">
                <li>
                  Your IP address and browser type
                </li>
                <li>
                  Pages you visit and features you use
                </li>
                <li>Device and session information</li>
              </ul>


              <p>
                We use this to keep the platform running smoothly and to spot any unusual activity.
              </p>
            </Section>

            <Section title="3. HOW WE USE YOUR INFORMATION">
              <p className="font-medium -mb-0.5">Here's the short version of why we need your data:</p>
              <ul className="list-disc ml-8">
                <li>
                  To create and manage your account
                </li>
                <li>
                  To generate the reports and intelligence you request
                </li>
                <li>To process your subscription payments</li>
                <li>
                  To send you service updates and, occasionally, useful content (you can opt out anytime)
                </li>
                <li>To fix bugs and improve the platform</li>
              </ul>
              <p>We do not sell your data. We do not share your research queries, product lists, or target markets with anyone — not even anonymously.
</p>
            </Section>

            <Section title="4. WHO ELSE SEES YOUR DATA">
              <p>
                We work with a small number of trusted service providers who help us run the platform — things like cloud hosting, payment processing, and email delivery. Each of them is bound by strict data agreements and cannot use your data for their own purposes.
              </p>
              <p>Other than that, we only share data if the law requires it — and even then, we'll always try to notify you first where we legally can.</p>
            </Section>

            <Section title="5. HOW LONG WE KEEP YOUR DATA">
              <p>
                We keep your account data for as long as your account is active. If you close your account, we delete your personal data within 30 days — with one exception: billing records, which we're required to keep for 7 years under Indian accounting law.
              </p>
              
            </Section>

            <Section title="6. YOUR RIGHTS">
              <p className="font-medium -mb-0.5">You can, at any time:</p>
              <ul className="list-disc ml-8">
                <li>
                  See all the personal data we hold about you
                </li>
                <li>
                  Correct anything that's wrong
                </li>
                <li>Ask us to delete your data</li>
                <li>
                  Export your data in a readable format
                </li>
                <li>Opt out of marketing emails</li>
              </ul>
              <p>To do any of these, just email us at info@integersinsights.com. We'll respond within 7 working days.</p>
            </Section>

            <Section title="7. COOKIES">
              <p>
                We use essential cookies to keep the platform working (you can't opt out of these without breaking the site) and optional analytics cookies to understand how people use REPORTINSHORT. You can manage cookie preferences in your browser settings.
              </p>
            </Section>

            <Section title="6. SECURITY">
              <p>
                We use TLS encryption for all data in transit, and AES-256 encryption for data at rest. We run regular security reviews and follow industry-standard practices. If anything ever goes wrong, we will notify affected users promptly.
              </p>
            </Section>

            <Section title="6. CHANGES TO THIS POLICY">
              <p>
                If we make significant changes, we'll let you know by email before the changes take effect. Minor updates will be reflected in the "Last updated" date at the top.
              </p>
            </Section>

            

          

            <Section title="7. CONTACT">
              <p className="text-base font-medium">Questions about this policy? Reach us at:</p>
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
