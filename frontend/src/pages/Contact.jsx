import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Headphones,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const channels = [
  {
    icon: Mail,
    title: "Email Us",
    desc: "For general inquiries and support",
    value: "info@integersinsights.com",
    color: "bg-brand-50",
    iconColor: "text-brand-500",
  },
  {
    icon: Headphones,
    title: "Support",
    desc: "Technical help & account questions",
    value: "+91 9518349134",
    color: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    icon: Users,
    title: "Enterprise Sales",
    desc: "Custom plans for large teams",
    value: "info@integersinsights.com",
    color: "bg-violet-50",
    iconColor: "text-violet-500",
  },
  {
    icon: Clock,
    title: "Response Time",
    desc: "We reply within",
    value: "24 hours on business days",
    color: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <section className="relative pt-20 pb-20 px-4 text-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute inset-0 bg-grid mask-radial-top opacity-40" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-brand-400/8 rounded-full blur-3xl" />
          <div className="relative max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sec-label justify-center">
                <MessageSquare size={12} />
                Contact Us
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 text-balance">
                We'd love to{" "}
                <span className="gradient-text">hear from you</span>
              </h1>
              <p className="text-lg text-slate-500 font-light">
                Whether you have a question, need support, or want to explore an
                enterprise plan - we're here.
              </p>
            </motion.div>
          </div>
        </section>
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {channels.map(
              ({ icon: Icon, title, desc, value, color, iconColor }, i) => (
                <Reveal key={title} delay={i * 0.08}>
                  <div
                    className={`rounded-2xl border border-slate-200 p-6 ${color} h-full`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                      <Icon size={18} className={iconColor} />
                    </div>
                    <div className="font-bold text-slate-900 text-sm mb-1">
                      {title}
                    </div>
                    <div className="text-xs text-slate-500 mb-2">{desc}</div>
                    <div className="text-xs font-semibold text-slate-700">
                      {value}
                    </div>
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </section>
        <section className="px-4 pb-24">
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8">
            <Reveal className="md:col-span-3">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-8">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
                  Send us a message
                </h2>
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-4">
                      <Send size={22} className="text-brand-500" />
                    </div>
                    <div className="font-bold text-slate-900 text-lg mb-2">
                      Message sent!
                    </div>
                    <p className="text-slate-500 text-sm">
                      We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          id: "name",
                          label: "Full name",
                          placeholder: "John Doe",
                        },
                        {
                          id: "email",
                          label: "Email address",
                          placeholder: "john@yourdomain.com",
                          type: "email",
                        },
                      ].map(({ id, label, placeholder, type = "text" }) => (
                        <div key={id}>
                          <label
                            htmlFor={id}
                            className="block text-xs font-semibold text-slate-600 mb-1.5"
                          >
                            {label}
                          </label>
                          <input
                            id={id}
                            type={type}
                            placeholder={placeholder}
                            required
                            value={form[id]}
                            onChange={(e) =>
                              setForm((f) => ({ ...f, [id]: e.target.value }))
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
                        placeholder="How can we help?"
                        required
                        value={form.subject}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, subject: e.target.value }))
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-slate-600 mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us more..."
                        required
                        value={form.message}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, message: e.target.value }))
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all resize-none"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-shimmer w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-colors shadow-glow-green-sm"
                    >
                      Send message <Send size={15} />
                    </motion.button>
                  </form>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-2 space-y-5">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">Office</h3>
                <div className="flex gap-3 text-sm text-slate-600">
                  <MapPin
                    size={16}
                    className="text-brand-500 shrink-0 mt-0.5"
                  />
                  <span>
                    Integers Insights Private Limited Unit No 28, 2nd Floor,
                    Vicino Building, New Link Road, Goregaon (Mumbai), Goregaon
                    West, Maharashtra, 400104, India
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-900 mb-4">
                  Business hours
                </h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium text-slate-800">
                      9 AM - 6 PM IST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-slate-800">
                      10 AM - 2 PM IST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-slate-400">Closed</span>
                  </div>
                </div>
              </div>
              <div className="bg-brand-50 rounded-2xl border border-brand-200 p-6">
                <div className="font-bold text-brand-800 text-sm mb-2">
                  Enterprise inquiry?
                </div>
                <p className="text-xs text-brand-700 leading-relaxed">
                  For custom plans, data partnerships, or API access - email our
                  sales team and we'll respond within 4 hours.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <Footer />
      </PageWrapper>
    </>
  );
}
