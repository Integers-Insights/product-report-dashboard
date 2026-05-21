import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Check, ChevronRight } from "lucide-react";
import { useRazorpay } from "../hooks/useRazorpay";
import toast from "react-hot-toast";

const RAZORPAY_LOGO = (
  <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#072654" />
    <path d="M12 28L20 10l5 10-4 2 4 6H12z" fill="#3395FF" />
    <path d="M25 22l-4-2 4-8 3 10z" fill="#fff" />
  </svg>
);

export default function CheckoutModal({ plan, initialYearly, onClose, baseUrl, onSuccess }) {
  const [yearly, setYearly]           = useState(initialYearly);
  const [couponCode, setCouponCode]   = useState("");
  const [coupon, setCoupon]           = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [loading, setLoading]         = useState(false);
  const { openCheckout }              = useRazorpay();

  const basePrice   = yearly ? plan.yearlyPrice : plan.monthlyPrice;
  const afterCoupon = coupon ? coupon.final_amount : basePrice;
  const gst         = Math.round(afterCoupon * 0.18 * 100) / 100;
  const total       = Math.round((afterCoupon + gst) * 100) / 100;

  const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res  = await fetch(`${baseUrl}/billing/apply-coupon`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          code:          couponCode.trim().toUpperCase(),
          plan_name:     plan.name,
          billing_cycle: yearly ? "yearly" : "monthly",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupon(data);
        toast.success(`Coupon applied! You save ₹${data.discount_amount}`);
      } else {
        toast.error(data.detail || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleSubscribe() {
    if (!token) { toast.error("Please login first"); return; }
    setLoading(true);
    try {
      const res  = await fetch(
        `${baseUrl}/billing/create-subscription-order?plan_name=${plan.name}&billing_cycle=${yearly ? "yearly" : "monthly"}`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      if (!data.success) { toast.error(data.message || "Order creation failed"); return; }

      onClose();
      openCheckout({
        order: {
          order_id:    data.order_id,
          amount:      data.amount,
          currency:    data.currency,
          description: `${plan.name} — ${yearly ? "yearly" : "monthly"}`,
        },
        onSuccess,
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <ChevronRight size={14} className="text-white" />
              </div>
              Secure Checkout
              <span className="text-[10px] font-medium text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 ml-1">SSL</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Plan summary */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 rounded-full px-2 py-0.5 inline-block mb-1">
                    Most Popular
                  </div>
                  <div className="text-lg font-extrabold text-slate-900">{plan.name}</div>
                  <div className="text-xs text-slate-400">{plan.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">
                    ₹{yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </div>
                  <div className="text-xs text-slate-400">/mo</div>
                </div>
              </div>

              {/* Monthly / Yearly toggle */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  onClick={() => { setYearly(false); setCoupon(null); }}
                  className={`text-xs font-medium cursor-pointer ${!yearly ? "text-slate-900" : "text-slate-400"}`}
                >
                  Monthly
                </span>
                <button
                  onClick={() => { setYearly(v => !v); setCoupon(null); }}
                  className="relative w-9 h-5 rounded-full bg-brand-500 transition-all"
                >
                  <motion.div
                    animate={{ x: yearly ? 16 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                  />
                </button>
                <span
                  onClick={() => { setYearly(true); setCoupon(null); }}
                  className={`text-xs font-medium cursor-pointer ${yearly ? "text-slate-900" : "text-slate-400"}`}
                >
                  Yearly
                  <span className="ml-1 text-[10px] text-brand-600 bg-brand-50 border border-brand-200 rounded-full px-1.5 py-0.5 font-semibold">
                    Save 20%
                  </span>
                </span>
              </div>

              {/* Included features */}
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Included</div>
              <div className="flex flex-wrap gap-1.5">
                {plan.feats.filter(f => f.ok).slice(0, 4).map(f => (
                  <span key={f.text} className="flex items-center gap-1 text-[11px] bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 text-slate-600">
                    <Check size={10} className="text-brand-500" strokeWidth={3} />
                    {f.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Payment Method</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 border-2 border-blue-500 rounded-xl p-3 cursor-pointer bg-blue-50/40">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  {RAZORPAY_LOGO}
                  <div>
                    <div className="text-xs font-bold text-slate-800">Razorpay</div>
                    <div className="text-[10px] text-slate-400">Cards · UPI · NetBanking</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 opacity-40 cursor-not-allowed">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold">S</div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Stripe</div>
                    <div className="text-[10px] text-slate-400">Coming soon</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon code */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="Coupon code (try LAUNCH20)"
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={couponLoading}
                className="px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {couponLoading ? "..." : "Apply"}
              </button>
            </div>

            {/* Price breakdown */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{plan.name} ({yearly ? "Yearly" : "Monthly"})</span>
                <span>₹{basePrice}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-sm text-brand-600">
                  <span>Discount ({coupon.code})</span>
                  <span>- ₹{coupon.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600">
                <span>GST (18%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-extrabold text-slate-900">
                <span>Total due today</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Subscribe button */}
            <motion.button
              onClick={handleSubscribe}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm shadow-glow-green-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : `Subscribe to ${plan.name} →`}
            </motion.button>

            <p className="text-center text-[10px] text-slate-400">
              Auto-renews {yearly ? "yearly" : "monthly"}. Cancel anytime.{" "}
              <span className="underline cursor-pointer">Terms</span> ·{" "}
              <span className="underline cursor-pointer">Privacy</span>.
              {yearly && " 14-day refund on annual plans."}
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
              {["SSL", "PCI DSS", "GDPR", "Razorpay"].map(b => (
                <span key={b} className="flex items-center gap-1">
                  <span className="text-slate-300">🔒</span> {b}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
