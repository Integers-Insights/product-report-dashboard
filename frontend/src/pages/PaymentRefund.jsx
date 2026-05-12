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
                PAYMENT & REFUND POLICY
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
            <Section title="1. THE QUICK SUMMARY">
              <ul className="list-disc ml-8">
                <li>Free plan: no payment needed, ever.</li>
                <li>
                  Monthly plans: cancel anytime, no refund for the current
                  billing period.
                </li>
                <li>
                  Annual plans: full refund within 14 days of purchase, no
                  questions asked.
                </li>
                <li>
                  Enterprise/custom plans: governed by your individual
                  agreement.
                </li>
              </ul>
              <p>Read on for the details.</p>
            </Section>

            <Section title="2. HOW PAYMENTS WORK">
              <p className="text-base font-medium">
                All payments on REPORTINSHORT are processed through Razorpay,
                one of India's most trusted and secure payment gateways. We
                accept:
              </p>
              <ul className="list-disc ml-8">
                <li>
                  Credit and debit cards (Visa, Mastercard, American Express,
                  RuPay)
                </li>
                <li>
                  UPI (Google Pay, PhonePe, Paytm, and all UPI-supported apps)
                </li>
                <li>Net banking</li>
                <li>Razorpay-supported wallets</li>
              </ul>
              <p>
                We never store your card or bank details on our servers. All
                payment data is handled directly by Razorpay under PCI DSS Level
                1 compliance — the highest security standard for payment
                processing
              </p>
            </Section>

            <Section title="3. BILLING CYCLES">
              <p className="font-medium -mb-0.5">Monthly plans</p>
              <p>
                You're billed on the same date every month — the date you first
                subscribed. If you subscribe on the 28th, 29th, 30th, or 31st of
                a month, billing adjusts to the last valid date in shorter
                months.
              </p>

              <p className="font-medium -mb-0.5">Annual plans</p>
              <p>
                You're billed upfront for the full 12-month period, at a 20%
                saving compared to paying monthly. Your renewal date and amount
                are always visible in Account Settings → Billing.
              </p>

              <p>
                You'll receive an invoice by email after every payment. GST
                invoices are also available in Account Settings → Billing →
                Invoices within 24 hours.
              </p>
            </Section>

            <Section title="4. THE FREE PLAN">
              <p>
                The Explorer (free) plan requires no payment details whatsoever.
                You get 3 full intelligence reports with real data — no trial
                period, no credit card prompt, no expiry. It's permanently free.
              </p>
            </Section>

            <Section title="5. UPGRADING AND DOWNGRADING">
              <p>
                You can change your plan at any time from Account Settings →
                Billing.
              </p>

              <p>
                <span className="font-medium">Upgrading: </span>
                <span>
                  Takes effect immediately. You're charged a pro-rated amount
                  for the remainder of your current billing period, then billed
                  at the new rate going forward.
                </span>
              </p>
              <p>
                <span className="font-medium">Downgrading: </span>
                <span>
                  Takes effect at the start of your next billing period. You
                  keep all current plan features until then.
                </span>
              </p>
              <span></span>
            </Section>

            <Section title="6. REFUND POLICY — MONTHLY PLANS">
              <p>
                Monthly billing is prepaid — you pay at the start of each period
                for that month's access. If you cancel mid-month, you keep
                access until the period ends but we don't refund the remaining
                days. There are no pro-rated refunds for monthly plans.
              </p>
              <p>
                <span className="font-medium">Exception: </span>
                <span>
                  If REPORTINSHORT experiences a documented platform outage
                  lasting more than 48 continuous hours in a billing period, we
                  will credit the affected days to your account.
                </span>
              </p>
            </Section>

            <Section title="7. REFUND POLICY — ANNUAL PLANS">
              <p>
                We offer a 14-day full refund guarantee on all annual plan
                purchases.
              </p>
              <p>
                If you're not satisfied within 14 days of starting an annual
                plan, email us at info@integersinsights.com with the subject
                "Refund Request" and we'll process a full refund within 5–7
                working days — no forms, no interrogation, no hassle.
              </p>
              <p>
                After 14 days, annual payments are non-refundable. However, you
                retain full access for the remainder of the annual period.
              </p>
            </Section>

            <Section title="6. CANCELLATIONS">
              <p>
                To cancel, go to Account Settings → Billing → Cancel
                Subscription. You can do this at any time without contacting us.
              </p>
              <p className="text-base font-medium">
                What happens after cancellation:
              </p>
              <ul className="list-disc ml-8">
                <li>Your access continues until the end of the paid period</li>
                <li>
                  Your data (reports, saved products, searches) is retained for
                  30 days
                </li>
                <li>
                  After 30 days, your data is permanently deleted unless you
                  resubscribe
                </li>
                <li>
                  You can re-subscribe at any time and pick up where you left
                  off, if within the 30-day window
                </li>
              </ul>
              <p>
                We don't charge cancellation fees. There are no lock-in
                contracts.
              </p>
            </Section>

            <Section title="6. FAILED PAYMENTS">
              <p className="text-base font-medium">
                If a payment fails (expired card, insufficient funds, etc.),
                here's what happens:
              </p>

              <ul className="list-disc ml-8">
                <li>We retry automatically after 3 days</li>
                <li>
                  You receive an email prompting you to update your payment
                  method
                </li>
                <li>We retry once more after another 4 days</li>
                <li>
                  If still unresolved after 7 days total, your account is
                  downgraded to the free plan
                </li>
              </ul>
              <p>
                Your data and reports are preserved throughout this process and
                for 30 days after downgrade.
              </p>
            </Section>

            <Section title="6. TAXES AND GST">
              <p>
                Prices on REPORTINSHORT are exclusive of Goods and Services Tax
                (GST). For Indian customers, the applicable GST rate is added at
                checkout. International customers may see local taxes depending
                on their jurisdiction.
              </p>

              <p>
                GST invoices are issued automatically and available in your
                account dashboard.
              </p>
            </Section>

            <Section title="6. DISPUTES">
              <p>
                If you believe you've been charged incorrectly, contact us at info@integersinsights.com within 30 days of the charge. We'll investigate and respond within 3 working days.
              </p>

              <p>
                For Razorpay-related technical disputes (e.g., a charge appearing on your bank statement but not in your account), we'll coordinate with Razorpay on your behalf and resolve it as quickly as possible.
              </p>
            </Section>

            <Section title="7. CONTACT">
              <p className="text-base font-medium">Billing queries:</p>
              <p className="-mb-0.5">
                <span className="font-medium">Email: </span>
                info@integersinsights.com
              </p>
              <p className="-mb-0.5">
                <span className="font-medium">Phone: </span>+91 93212 56706
              </p>
              <p className="-mb-0.5">
                Business hours: Mon–Fri, 9 AM – 6 PM IST
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
