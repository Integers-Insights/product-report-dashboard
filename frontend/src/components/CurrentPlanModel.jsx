import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLAN_META = {
  trial:   { tier: "Free",       display: "Explorer",   next: "Navigator" },
  basic:   { tier: "Starter",    display: "Navigator",  next: "Expedition" },
  pro:     { tier: "Pro",        display: "Expedition", next: null },
  command: { tier: "Enterprise", display: "Command",    next: null },
};

function formatDate(dateStr) {
  if (!dateStr || dateStr === "no expiry") return "No expiry";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CurrentPlanModal({ planName, baseUrl, onClose, onUpgrade }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const meta = PLAN_META[planName?.toLowerCase()] || PLAN_META.trial;

  useEffect(() => {
    const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    if (!token) { setLoading(false); return; }
    fetch(`${baseUrl}/billing/usage`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [baseUrl]);

  const billingCycle = data?.billing_cycle
    ? data.billing_cycle.charAt(0).toUpperCase() + data.billing_cycle.slice(1)
    : "—";
  const nextRenewal = data?.end_date ? formatDate(data.end_date) : "—";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* top accent bar */}
          <div className="h-1 bg-gradient-to-r from-brand-400 to-brand-600" />

          <div className="p-6">
            {/* close */}
            <div className="flex justify-end mb-2">
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                <CheckCircle size={32} className="text-blue-500" strokeWidth={1.5} />
              </div>
            </div>

            {/* badge */}
            <div className="flex justify-center mb-3">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                Active Plan
              </span>
            </div>

            {/* title */}
            <div className="text-center mb-1">
              <h2 className="text-xl font-extrabold text-slate-900">
                You're already on {meta.display}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {PLAN_META[planName?.toLowerCase()]
                  ? planName?.toLowerCase() === "trial"
                    ? "Try with real data. No card, no commitment."
                    : planName?.toLowerCase() === "basic"
                      ? "For solo exporters exploring new markets."
                      : planName?.toLowerCase() === "pro"
                        ? "For exporters ready to close real deals."
                        : "For trading houses and large export teams."
                  : ""}
              </p>
            </div>

            {/* details table */}
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
              <Row label="Plan" value={`${meta.tier} · ${meta.display}`} />
              <Row
                label="Status"
                value={
                  <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Active
                  </span>
                }
              />
              <Row label="Next renewal" value={loading ? "Loading…" : nextRenewal} />
              <Row label="Billing"       value={loading ? "Loading…" : billingCycle} />
            </div>

            {/* actions */}
            <div className="mt-5 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onClose(); navigate("/app"); }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors"
              >
                <LayoutDashboard size={16} />
                Explore Dashboard
              </motion.button>

              <button
                onClick={() => { onClose(); navigate("/app"); }}
                className="w-full py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors"
              >
                Manage subscription
              </button>
            </div>

            {/* upgrade nudge */}
            {meta.next && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Want more?{" "}
                <button
                  onClick={() => { onClose(); onUpgrade?.(); }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Upgrade to {meta.next} →
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}
