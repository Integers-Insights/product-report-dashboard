import { motion } from 'framer-motion'
import { Database } from 'lucide-react'
import PageWrapper from '../components/PageWrapper'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

export default function DataPolicy() {
  return (
    <>
    <Navbar/>
    <PageWrapper>
      <section className="relative pt-20 pb-10 px-4 text-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 bg-grid mask-radial-top opacity-30" />
        <div className="relative max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="sec-label justify-center"><Database size={12} />Legal</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">Data Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: 7 May 2026</p>
          </motion.div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8 md:p-12">
          <Section title="1. Our Data Sources">
            <p>Integer Market aggregates trade intelligence from multiple authoritative sources, including: government customs databases (DGFT, US CBP, HMRC, EU TARIC); verified global business directories and import license registries; bill of lading and shipment records from major ports; aggregated and anonymised search demand signals; and real-time trade news and regulatory publications.</p>
            <p>Every data point in a report includes its source, last updated date, and a confidence score (0–100).</p>
          </Section>

          <Section title="2. Data Freshness">
            <p>Buyer data is refreshed on a rolling 7-day cycle. Trade volume data is updated monthly as government customs authorities publish records. Demand signals are updated weekly. AI confidence scores are recalculated with every refresh cycle.</p>
          </Section>

          <Section title="3. Data Accuracy and Confidence Scores">
            <p>No dataset is perfect. We apply a multi-layer verification process — cross-referencing sources, flagging anomalies, and assigning confidence scores — to give you a clear picture of data reliability. We recommend acting on insights with a confidence score of 75 or above.</p>
            <p>Integer Market does not guarantee the accuracy of third-party source data. We are not liable for decisions based on platform data.</p>
          </Section>

          <Section title="4. User-Generated Data">
            <p>Data you enter into the platform (product names, target markets, search history) is used solely to provide your personalised reports and is never shared with other users or third parties. This data is stored securely and deleted within 30 days of account closure.</p>
          </Section>

          <Section title="5. Buyer Contact Data">
            <p>Buyer contact details provided through the platform are sourced from publicly available business directories, verified import registries, and publicly accessible professional profiles. We do not scrape or harvest private correspondence. Contacts are verified against active import records before being included in reports.</p>
          </Section>

          <Section title="6. Data Requests and Corrections">
            <p>If you believe a data point in your report is inaccurate, use the "Flag data issue" button within any report. Our data team reviews flagged items within 5 business days. If a correction is confirmed, your report is automatically updated.</p>
          </Section>

          <Section title="7. Contact">
            <p>For data policy queries: info@integersinsights.com</p>
          </Section>
        </div>
      </article>

      <Footer />
    </PageWrapper>
    </>
  )
}
