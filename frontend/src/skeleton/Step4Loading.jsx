import { useState, useEffect, useMemo } from "react";
import {
  Clock,
  FileText,
  Check,
  ShieldCheck,
  Coffee,
} from "lucide-react";

// ─── Keyframe styles injected once ───────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @keyframes scanSweep {
    0%   { transform: translateY(-30%); opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { transform: translateY(130%); opacity: 0; }
  }
  @keyframes punIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(.9); opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: translateY(-80px) scale(1.05); opacity: 0; }
  }
  @keyframes pulseBlip {
    0%, 100% { opacity: .35; transform: scale(.85); }
    50%      { opacity: 1;   transform: scale(1.1); }
  }

  .font-outfit  { font-family: 'Outfit', sans-serif; }
  .font-mono-jb { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }

  .scan-beam {
    position: absolute; inset: 0 0 auto 0;
    height: 28%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(56,189,248,.00) 10%,
      rgba(56,189,248,.18) 50%,
      rgba(56,189,248,.04) 85%,
      transparent 100%
    );
    border-bottom: 1px solid rgba(56,189,248,.35);
    animation: scanSweep 3.6s cubic-bezier(.65,0,.35,1) infinite;
    mix-blend-mode: multiply;
    pointer-events: none;
    z-index: 5;
  }
  .scan-beam::after {
    content: "";
    position: absolute; left: 0; right: 0; bottom: -1px; height: 1px;
    background: linear-gradient(90deg, transparent, #38bdf8, transparent);
    filter: drop-shadow(0 0 6px rgba(56,189,248,.5));
  }

  .pun-enter { animation: punIn .5s cubic-bezier(.22,1,.36,1) both; }

  .particle {
    position: absolute;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(2,132,199,.7);
    pointer-events: none;
    animation: floatUp 4s ease-out infinite;
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .scan-beam, .particle { animation-duration: .001ms; animation-iteration-count: 1; }
  }
`;

// ─── Constants ────────────────────────────────────────────────────────────────
const PUNS = [
  "Reading between the lines — and the rows, and the columns.",
  "Our analysts are deep in thought. (The silicon ones don't take coffee breaks.)",
  "Connecting the dots.",
  "Doing the math so you don't have to. Literally.",
  "Sifting signal from noise. Mostly the noise.",
  "Crunching numbers gently — they bruise.",
  "Asking your warehouse the awkward questions.",
  "Turning rows into reasons.",
];

const PARTICLE_TOKENS = [
  "+38%", "CAGR", "$184k", "14 buyers", "Q3",
  "YoY +11.4%", "60 kw", "demand↑", "8% CAGR", "21 markets", "lookalike",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Rotating witty pun line */
function PunTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PUNS.length), 4200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-[22px] overflow-hidden">
      <p
        key={idx}
        className="pun-enter text-[14px] italic font-outfit"
        style={{ color: "#4a5560" }}
      >
        {PUNS[idx]}
      </p>
    </div>
  );
}

/** Floating data particles */
function Particles() {
  const items = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        text: PARTICLE_TOKENS[i % PARTICLE_TOKENS.length],
        left: 6 + Math.random() * 88,
        delay: Math.random() * 4,
        dur: 3.5 + Math.random() * 2.5,
      })),
    []
  );
  return (
    <>
      {items.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: "10%",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        >
          {p.text}
        </span>
      ))}
    </>
  );
}

/** Single document card */
function DocCard({ processed, bars }) {
  return (
    <div
      className="relative rounded-[10px] p-[14px_14px_16px] overflow-hidden transition-all duration-300"
      style={{
        background: "#fff",
        border: processed
          ? "1px solid rgba(56,189,248,.35)"
          : "1px solid #e2e7eb",
        boxShadow: processed
          ? "0 4px 14px rgba(56,189,248,.10), inset 0 0 0 1px rgba(56,189,248,.12)"
          : "0 1px 2px rgba(30,39,46,.03)",
      }}
    >
      {/* Check badge */}
      <div
        className="absolute top-[10px] right-[10px] w-[18px] h-[18px] rounded-full grid place-items-center transition-all duration-200"
        style={{
          background: "#38bdf8",
          color: "#fff",
          opacity: processed ? 1 : 0,
          transform: processed ? "scale(1)" : "scale(.6)",
        }}
      >
        <Check size={10} strokeWidth={2.5} />
      </div>

      {/* Header row */}
      <div className="flex items-center gap-2 mb-3">
        <FileText
          size={12}
          style={{ color: processed ? "#0284c7" : "#94a0a8", flexShrink: 0 }}
        />
        <div
          className="rounded-sm h-[7px]"
          style={{
            width: "55%",
            background: processed
              ? "rgba(56,189,248,.35)"
              : "#e2e7eb",
          }}
        />
      </div>

      {/* Skeleton lines */}
      <div className="flex flex-col gap-1.5 mb-3">
        {[92, 78, 85].map((w, i) => (
          <div
            key={i}
            className="rounded-sm h-[6px]"
            style={{
              width: `${w}%`,
              background: processed ? "rgba(186,230,253,.6)" : "#eef1f3",
            }}
          />
        ))}
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-1 h-8">
        {bars.map((h, j) => (
          <div
            key={j}
            className="rounded-sm transition-all duration-500"
            style={{
              width: 6,
              height: `${processed ? h : Math.max(20, h * 0.5)}%`,
              background: processed
                ? j % 3 === 0
                  ? "#38bdf8"
                  : "rgba(56,189,248,.35)"
                : "#e2e7eb",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Document grid with scan beam */
function DocGrid({ processedCount }) {
  const docBars = useMemo(
    () =>
      Array.from({ length: 12 }, () =>
        Array.from({ length: 7 }, () => 30 + Math.random() * 70)
      ),
    []
  );

  return (
    <div className="relative">
      <div className="scan-beam" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 relative">
        {docBars.map((bars, i) => (
          <DocCard key={i} processed={i < processedCount} bars={bars} />
        ))}
      </div>
    </div>
  );
}

// ─── Main LoadingScreen ───────────────────────────────────────────────────────
export default function LoadingScreen() {
  const [processed, setProcessed] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setProcessed((p) => (p >= 12 ? 0 : p + 1)),
      1600
    );
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* Inject global keyframe styles once */}
      <style>{GLOBAL_STYLES}</style>

      <div
        className="min-h-screen font-outfit px-7 py-6 overflow-y-auto"
        style={{ background: "#f7f9fa", color: "#1e272e" }}
      >
        <div className="max-w-[1320px] mx-auto">

          {/* ── Header row ── */}
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              {/* Status badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide font-outfit"
                  style={{ background: "rgba(56,189,248,.12)", color: "#0369a1" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#38bdf8",
                      boxShadow: "0 0 0 3px rgba(56,189,248,.25)",
                    }}
                  />
                  RUN IN PROGRESS
                </span>
              </div>

              <h1
                className="text-[34px] font-semibold leading-[1.05] font-outfit"
                style={{ letterSpacing: "-0.02em" }}
              >
                Running your intelligence
              </h1>
              <p
                className="text-[15px] mt-2 font-outfit"
                style={{ color: "#4a5560", maxWidth: 620 }}
              >
                Analyzing your selected products across demand, competition,
                trade activity, price fit, and buyer availability. Hang tight —
                this only happens once per run.
              </p>
            </div>

            {/* Time card */}
            <div
              className="rounded-[14px] px-5 py-4 min-w-[220px] flex flex-col gap-2 shrink-0"
              style={{ background: "#1e272e", color: "#fff" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-semibold tracking-[0.16em] font-outfit"
                  style={{ color: "#94a3b8" }}
                >
                  EST. TIME
                </span>
                <Clock size={14} style={{ color: "#94a3b8" }} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono-jb text-[40px] font-semibold leading-none">
                  3–5
                </span>
                <span
                  className="text-[14px] font-medium font-outfit"
                  style={{ color: "#cbd5e1" }}
                >
                  minutes
                </span>
              </div>
            </div>
          </div>

          {/* ── Doc scan section ── */}
          <section
            className="rounded-[16px] border bg-white overflow-hidden mb-5"
            style={{ borderColor: "#e2e7eb" }}
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{
                borderColor: "#e2e7eb",
                background: "linear-gradient(180deg, #fff, #f7f9fa)",
              }}
            >
              <div>
                <div
                  className="text-[10px] font-semibold tracking-[0.16em] font-outfit"
                  style={{ color: "#6b7780" }}
                >
                  SOURCE SCAN
                </div>
                <div className="text-[15px] font-semibold mt-0.5 font-outfit">
                  Processing your product documents
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 text-[11px] font-mono-jb"
                style={{ color: "#0369a1" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#38bdf8" }}
                />
                beam active
              </div>
            </div>

            {/* Grid + particles */}
            <div className="relative p-5">
              <DocGrid processedCount={processed} />
              <Particles />
            </div>

            {/* Footer note */}
            <div
              className="px-5 py-3 border-t flex items-center gap-2 text-[12px] font-outfit"
              style={{
                borderColor: "#e2e7eb",
                background: "#f7f9fa",
                color: "#6b7780",
              }}
            >
              <ShieldCheck size={13} />
              <span>Row-level lineage retained for every chart</span>
            </div>
          </section>

          {/* ── Pun / coffee banner ── */}
          <section
            className="rounded-[16px] border p-5 flex items-center gap-4"
            style={{
              borderColor: "#e2e7eb",
              background:
                "linear-gradient(90deg, rgba(56,189,248,.06), #fff)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full grid place-items-center shrink-0"
              style={{
                background: "rgba(56,189,248,.14)",
                color: "#0284c7",
              }}
            >
              <Coffee size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold mb-0.5 font-outfit">
                Grab a coffee — this one's on us.
              </div>
              <PunTicker />
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
