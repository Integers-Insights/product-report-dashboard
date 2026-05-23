/**
 * LoadingCard.jsx
 * The "Analyzing Website" loading card with sitemap animation + pun panel.
 * React + Tailwind. All custom keyframes injected via a single <style> tag.
 *
 * Usage:
 *   import LoadingCard from "./LoadingCard";
 *   <LoadingCard />
 */

import { useState, useEffect } from "react";

// ─── Custom keyframes Tailwind can't express ──────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  /* Top-edge sweep */
  @keyframes topSweep {
    0%   { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
  /* Blue pulsing ring on the eyebrow dot */
  @keyframes dotPing {
    0%   { box-shadow: 0 0 0 0 rgba(0,102,204,.55); }
    80%  { box-shadow: 0 0 0 10px rgba(0,102,204,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,102,204,0); }
  }
  /* SVG scan line sweeping left→right */
  @keyframes ldScan {
    0%   { background-position: 200% 0; }
    100% { background-position: -100% 0; }
  }
  /* Traveling pulse dots along edges */
  @keyframes ldRing {
    0%   { r: 1.2; opacity: .7; }
    100% { r: 5;   opacity: 0;  }
  }
  /* Pun line fade+slide in */
  @keyframes punIn {
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0);   }
  }
  /* Feed dot breathe */
  @keyframes feedDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .35; transform: scale(.7); }
  }
  /* Spinner for stage list */
  @keyframes spin { to { transform: rotate(360deg); } }

  .lc-font { font-family: "Plus Jakarta Sans", system-ui, sans-serif; }

  /* Top-sweep bar */
  .lc-top-sweep {
    background: linear-gradient(90deg, transparent, #0066CC 30%, #0066CC 70%, transparent);
    background-size: 200% 100%;
    animation: topSweep 2.4s linear infinite;
  }
  /* Pulsing dot */
  .lc-dot-ping { animation: dotPing 1.6s ease-out infinite; }

  /* Scan overlay inside the stage area */
  .lc-scan-overlay {
    background: linear-gradient(90deg,
      transparent 0%, rgba(0,102,204,0) 40%,
      rgba(0,102,204,.08) 50%,
      rgba(0,102,204,0) 60%, transparent 100%);
    background-size: 200% 100%;
    animation: ldScan 5.5s ease-in-out infinite;
  }

  /* Node appear transition */
  .lc-node { transition: opacity .5s ease, transform .5s cubic-bezier(.2,.7,.2,1.2); }
  .lc-node-hidden  { opacity: 0; transform: translate(-50%,-54%); }
  .lc-node-visible { opacity: 1; transform: translate(-50%,-50%); }

  /* Edge appear transition */
  .lc-edge { transition: opacity .8s ease; }

  /* Pun line */
  .lc-pun-in { animation: punIn .55s cubic-bezier(.2,.7,.2,1) both; }

  /* Feed dot */
  .lc-feed-dot { animation: feedDot 1.2s ease-in-out infinite; }

  /* Stage spinner */
  .lc-spin {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid #D9E8F5;
    border-top-color: #0066CC;
    animation: spin .9s linear infinite;
    flex-shrink: 0;
  }
`;

// ─── Sitemap data (matches the screenshot exactly) ────────────────────────────
const NODES = [
  // center
  { x: 50, y: 50, label: "Home",     kind: "home",      d: 0   },
  // tier-1 (primary nav)
  { x: 18, y: 28, label: "About",    kind: "page",      d: 0.6 },
  { x: 82, y: 28, label: "Products", kind: "page",      d: 1.0 },
  { x: 15, y: 72, label: "Services", kind: "page",      d: 1.4 },
  { x: 85, y: 72, label: "Contact",  kind: "page",      d: 1.8 },
  // tier-2 (secondary)
  { x: 60, y: 14, label: "Pricing",  kind: "secondary", d: 2.4 },
  { x: 92, y: 50, label: "Blog",     kind: "secondary", d: 2.8 },
  { x: 38, y: 14, label: "FAQ",      kind: "secondary", d: 3.2 },
  { x: 8,  y: 50, label: "Careers",  kind: "secondary", d: 3.6 },
  { x: 68, y: 86, label: "Privacy",  kind: "secondary", d: 4.0 },
  { x: 32, y: 86, label: "Terms",    kind: "secondary", d: 4.4 },
];

const EDGES = [
  [0,1],[0,2],[0,3],[0,4],       // home → tier-1
  [2,5],[2,6],[1,7],[3,8],[4,9],[3,10], // tier-1 → tier-2
];

// ─── Pun lines ────────────────────────────────────────────────────────────────
const PUNS = [
  "Surfing your site — one page at a time.",
  "Deep diving into your web presence.",
  "Crawling through the details. We're thorough.",
  "Taking notes. Your site is looking sharp.",
  "Exploring every corner of your digital home.",
  "Reading between the (HTML) lines.",
];

// ─── Sitemap animation (RAF loop) ────────────────────────────────────────────
function useRafTimer(loopSeconds) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (t) => {
      setNow(((t - start) / 1000) % loopSeconds);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loopSeconds]);
  return now;
}

// ─── Pun cycling ─────────────────────────────────────────────────────────────
function usePunCycle(ms = 4200) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % PUNS.length), ms);
    return () => clearInterval(t);
  }, [ms]);
  return i;
}

// ─── Node style helpers ───────────────────────────────────────────────────────
const nodeClasses = {
  home:      "bg-[#0066CC] text-white border-[#0066CC] font-bold px-4 py-2 shadow-[0_8px_20px_-6px_rgba(0,102,204,.40)]",
  page:      "bg-white text-[#3A4554] border-[#E4E9F0] px-3 py-1.5 shadow-[0_4px_14px_-6px_rgba(15,23,42,.16),0_1px_2px_rgba(15,23,42,.05)]",
  secondary: "bg-[#EAF3FC] text-[#0066CC] border-[#D9E8F5] px-3 py-1.5 shadow-[0_2px_8px_-4px_rgba(0,102,204,.15)]",
};
const dotClasses = {
  home:      "bg-white",
  page:      "bg-[#2E9A4A]",
  secondary: "bg-[#0066CC]",
};

// ─── Components ──────────────────────────────────────────────────────────────

/** The animated sitemap graph */
function SitemapViz() {
  const now = useRafTimer(9); // 9-second loop

  return (
    <div className="absolute inset-0">
      {/* SVG layer — edges + traveling pulses */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const A = NODES[a], B = NODES[b];
          const delay = Math.max(A.d, B.d);
          const on = now > delay;
          return (
            <line
              key={i}
              x1={A.x} y1={A.y} x2={B.x} y2={B.y}
              stroke={on ? "#B7D3EE" : "transparent"}
              strokeWidth="0.35"
              strokeDasharray="1.2 1.2"
              className="lc-edge"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}

        {/* Traveling pulse dots */}
        {EDGES.map(([a, b], i) => {
          const A = NODES[a], B = NODES[b];
          const delay = Math.max(A.d, B.d);
          if (now < delay) return null;
          const t = ((now - delay) % 2.4) / 2.4;
          const cx = A.x + (B.x - A.x) * t;
          const cy = A.y + (B.y - A.y) * t;
          return (
            <circle
              key={"p" + i}
              cx={cx} cy={cy} r="0.6"
              fill="#0066CC"
              style={{ filter: "drop-shadow(0 0 1.4px #0066CC)" }}
            />
          );
        })}
      </svg>

      {/* HTML node pills */}
      {NODES.map((n, i) => {
        const appeared = now > n.d;
        return (
          <div
            key={i}
            className={[
              "absolute flex items-center gap-1.5 border rounded-full text-xs font-semibold whitespace-nowrap lc-node lc-font",
              appeared ? "lc-node-visible" : "lc-node-hidden",
              nodeClasses[n.kind],
            ].join(" ")}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span className={`w-2 h-2 rounded-full flex-none ${dotClasses[n.kind]}`} />
            {n.label}
          </div>
        );
      })}
    </div>
  );
}

/** "While we work" pun strip */
function PunPanel() {
  const idx = usePunCycle();
  return (
    <div className="border border-[#E4E9F0] rounded-xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,.04),0_0_0_1px_rgba(15,23,42,.04)]">
      {/* Header row */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] lc-feed-dot" />
        <span className="text-[10.5px] font-bold tracking-[.1em] text-[#6B7785] uppercase lc-font">
          While we work
        </span>
      </div>
      {/* Rotating pun line */}
      <div className="flex items-center justify-center min-h-[36px]">
        <div key={idx} className="flex items-center gap-3 lc-pun-in">
          {/* Quotation mark icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0066CC" opacity=".55" aria-hidden="true">
            <path d="M7 7h4v4H7a4 4 0 0 0 4 4v2a6 6 0 0 1-6-6V9a2 2 0 0 1 2-2zm10 0h4v4h-4a4 4 0 0 0 4 4v2a6 6 0 0 1-6-6V9a2 2 0 0 1 2-2z" />
          </svg>
          <span className="text-[15px] font-medium italic text-[#3A4554] lc-font">
            {PUNS[idx]}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Top header row: eyebrow ping + title + time pill */
function CardHeader() {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      {/* Left: ping dot + label */}
      <div className="flex items-center gap-3.5">
        <span
          className="w-2.5 h-2.5 rounded-full bg-[#0066CC] flex-none lc-dot-ping"
          aria-hidden="true"
        />
        <span className="text-[11px] font-bold tracking-[.14em] text-[#0066CC] uppercase lc-font">
          Analyzing Website
        </span>
      </div>
      {/* Right: time pill */}
      <div className="flex items-center gap-2 bg-[#EAF3FC] border border-[#D9E8F5] rounded-full px-3.5 py-2 flex-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066CC" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        <span className="text-[12.5px] font-semibold text-[#0066CC] lc-font">Usually takes 2–3 min</span>
      </div>
    </div>
  );
}

/** Stage area: dot-grid + scan + sitemap */
function StageArea() {
  return (
    <div
      className="relative flex-1 min-h-[360px] rounded-[14px] border border-[#EEF1F6] overflow-hidden mb-4"
      style={{
        background: "radial-gradient(circle at 50% 40%, #EAF3FC 0%, transparent 60%), linear-gradient(180deg, #FAFCFE 0%, #F4F8FC 100%)",
      }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,102,204,.10) 1px, transparent 1.2px)",
          backgroundSize: "22px 22px",
          opacity: .55,
        }}
      />
      {/* Scan sweep */}
      <div className="absolute inset-0 pointer-events-none lc-scan-overlay" />
      {/* Sitemap visualization */}
      <SitemapViz />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function LoadingCard() {
  return (
    <>
      <style>{STYLES}</style>
      <div
        className="relative bg-white border border-[#E4E9F0] rounded-[18px] p-6 flex flex-col overflow-hidden"
        style={{
          boxShadow: "0 6px 24px -8px rgba(15,23,42,.10), 0 1px 2px rgba(15,23,42,.04)",
          minHeight: 560,
        }}
      >
        {/* Animated top-edge sweep bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none lc-top-sweep" />

        <CardHeader />
        <StageArea />
        <PunPanel />
      </div>
    </>
  );
}
