import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import report_inshort_logo1 from "../assets/Report_short_1.svg";
const cols = [
  {
    title: "Product",
    links: [
      { to: "/how-it-works", label: "How It Works" },
      { to: "/pricing", label: "Pricing" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/team", label: "Our Team" },
      { to: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/data-policy", label: "Data Policy" },
      { to: "/gdpr", label: "GDPR" },
      { to: "/payment-refund", label: "Payment & Refund" },
    ],
  },
];

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-brand-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-96 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-10 w-30">
                <img
                  src={report_inshort_logo1}
                  alt="logo"
                  className="h-full w-full"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[220px] mb-6">
              Live market intelligence for exporters and manufacturers. Know
              your market before you enter it.
            </p>
            <div className="flex gap-2 flex-wrap">
              <SocialIcon
                href="https://www.instagram.com/integers.insights/"
                label="Instagram"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://www.linkedin.com/company/integersinsights"
                label="LinkedIn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://www.youtube.com/@integers.insights"
                label="YouTube"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon
                    fill="#0f172a"
                    points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                  />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://www.facebook.com/profile.php?id=61585447392065"
                label="Facebook"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://www.reddit.com/user/integers_insights/"
                label="Reddit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" />
                  <ellipse cx="12" cy="13" rx="6" ry="4.8" fill="#0f172a" />
                  <circle cx="9.8" cy="12.8" r="0.75" fill="white" />
                  <circle cx="14.2" cy="12.8" r="0.75" fill="white" />
                  <path
                    d="M9.5 15c.7.7 1.6 1.05 2.5 1.05s1.8-.35 2.5-1.05"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12.8 8.7l1.1-2.8 2.2.5"
                    stroke="#0f172a"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                  <circle cx="16.8" cy="6.9" r="1.1" fill="#0f172a" />
                </svg>
              </SocialIcon>
              <SocialIcon
                href="https://x.com/integers71866"
                label="X (Twitter)"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
            </div>
          </div>
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h5 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
                {title}
              </h5>
              <ul className="space-y-2.5">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Integers Insights Private Limited. All
            rights reserved.
          </p>
          <div className="flex gap-3">
            {["SSL Secured", "GDPR", "ISO 27001"].map((b) => (
              <span
                key={b}
                className="text-xs text-slate-600 bg-slate-800/60 border border-slate-700 rounded-md px-2.5 py-1"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
