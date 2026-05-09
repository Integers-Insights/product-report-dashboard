import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
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

export default function PaymentRefund() {
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
                <CreditCard size={12} />
                Legal
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
                Payment & Refund Policy
              </h1>
              <p className="text-slate-400 text-sm">Last updated: 7 May 2026</p>
            </motion.div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 pb-24">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
            <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-8">
              <p className="text-sm text-brand-800 leading-relaxed">
                <strong>Summary:</strong> Monthly plans can be cancelled anytime
                with no refund for the current period. Annual plans come with a
                14-day full refund guarantee. Enterprise plans are governed by
                individual contracts.
              </p>
            </div>

            <Section title="1. Accepted Payment Methods">
              <p>
                We accept all major credit and debit cards (Visa, Mastercard,
                American Express, RuPay), UPI, net banking, and wallets via our
                payment processor, Stripe and Razorpay. All transactions are PCI
                DSS Level 1 compliant. We never store your card details on our
                servers.
              </p>
            </Section>

            <Section title="2. Billing Cycles">
              <p>
                <strong className="text-slate-800">Monthly plans</strong> are
                billed on the same date each month from the date of
                subscription.{" "}
                <strong className="text-slate-800">Annual plans</strong> are
                billed upfront for the full 12-month period at a 20% discount
                versus the monthly rate. Your billing date and next renewal are
                always visible in your account settings.
              </p>
            </Section>

            <Section title="3. Free Plan">
              <p>
                The Explorer (free) plan requires no payment details. It
                provides 3 intelligence reports at no charge, permanently. No
                credit card is required to sign up or use the free plan.
              </p>
            </Section>

            <Section title="4. Refund Policy - Monthly Plans">
              <p>
                Monthly subscriptions are billed at the start of each billing
                period. We do not offer pro-rated refunds for unused days within
                a billing period. You may cancel at any time, and you will
                retain access until the end of the paid period.
              </p>
            </Section>

            <Section title="5. Refund Policy - Annual Plans">
              <p>
                Annual subscriptions come with a{" "}
                <strong className="text-slate-800">
                  14-day full refund guarantee
                </strong>{" "}
                from the date of purchase, no questions asked. After 14 days,
                annual plan payments are non-refundable, but you retain access
                until the subscription period ends. To request a refund within
                the guarantee window, email billing@integermarket.com with your
                account email and reason.
              </p>
            </Section>

            <Section title="6. Cancellations">
              <p>
                You can cancel your subscription at any time from Account
                Settings → Billing → Cancel Subscription. Cancellation takes
                effect at the end of your current billing period. Your data is
                retained for 30 days post-cancellation, after which it is
                permanently deleted unless you re-subscribe.
              </p>
            </Section>

            <Section title="7. Failed Payments">
              <p>
                If a payment fails, we will retry it 3 times over 7 days. You
                will receive email notifications at each retry. If payment is
                not resolved within 7 days, your account will be downgraded to
                the free plan and your data will be retained for 30 days.
              </p>
            </Section>

            <Section title="8. GST and Taxes">
              <p>
                Prices displayed are exclusive of GST. For Indian customers, GST
                at the applicable rate will be added at checkout. Your GST
                invoice is available in Account Settings → Billing → Invoices
                within 24 hours of each payment.
              </p>
            </Section>

            <Section title="9. Contact">
              <p>
                For billing queries: info@integersinsights.com
                <br />
                Response time: within 1 business day.
              </p>
            </Section>
          </div>
        </article>

        <Footer />
      </PageWrapper>
    </>
  );
}
