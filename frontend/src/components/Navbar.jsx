import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, TrendingUp, ChevronRight } from "lucide-react";
import report_inshort_logo from "../assets/Report_inshort_Logo.svg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => setOpen(false), [location]);

  const handleClick = () => {
    let authToken = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
    authToken ? navigate("/overview") : navigate("/login");
  };

  let userProfile = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 bg-white"
      >
        <nav
          className={`w-full max-w-6xl flex items-center justify-between px-5 h-14 rounded-2xl transition-all duration-500`}
        >
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-10 w-30">
              <img
                src={report_inshort_logo}
                alt="logo"
                className="h-full w-full"
              />
            </div>
          </Link>
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === to
                      ? "text-brand-600 bg-brand-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {label}
                  {location.pathname === to && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-brand-50 -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.4,
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            {!userProfile ? (
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all duration-200"
              >
                Log in
              </button>
            ) : (
              ""
            )}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleClick}
              className="btn-shimmer relative flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-1.5 rounded-xl shadow-glow-green-sm transition-colors duration-200"
            >
              Start free
              <ChevronRight size={14} />
            </motion.button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 inset-x-4 z-40 rounded-2xl bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-4"
          >
            <ul className="flex flex-col gap-1 mb-4">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      location.pathname === to
                        ? "bg-brand-50 text-brand-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <Link
                to="/login"
                className="flex-1 text-center text-sm font-medium text-slate-700 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/login"
                className="flex-1 text-center text-sm font-semibold text-white py-2 rounded-xl bg-brand-500 hover:bg-brand-600 transition-colors"
              >
                Start free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
