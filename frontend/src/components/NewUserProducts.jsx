import { useState } from "react";
import {
  TrendingUp,
  Package,
  Globe,
  Users,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Search,
  Bell,
  Zap,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Global keyframes ─────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(.8); }
    to   { opacity: 1; transform: scale(1); }
  }

  .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
  .font-serif-it { font-family: 'Instrument Serif', serif; }

  .fade-up-1  { animation: fadeUp .4s ease both; }
  .fade-up-2  { animation: fadeUp .4s .05s ease both; }
  .fade-up-3  { animation: fadeUp .4s .10s ease both; }
  .fade-up-4  { animation: fadeUp .4s .15s ease both; }
  .fade-up-5  { animation: fadeUp .4s .20s ease both; }
  .fade-up-6  { animation: fadeUp .5s .25s ease both; }
  .fade-up-7  { animation: fadeUp .5s .30s ease both; }
  .fade-up-8  { animation: fadeUp .55s ease both; }
  .fade-up-9  { animation: fadeUp .6s ease both; }

  .count-up   { animation: countUp .6s ease both; }

  /* hero grid texture */
  .hero-grid::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none;
  }
  .hero-grid::after {
    content: '';
    position: absolute; right: -60px; top: -60px;
    width: 280px; height: 280px;
    background: radial-gradient(circle, rgba(56,189,248,.14) 0%, transparent 70%);
    pointer-events: none;
  }

  /* stat card empty hatching */
  .stat-empty::after {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg, transparent, transparent 4px,
      rgba(200,214,226,.12) 4px, rgba(200,214,226,.12) 8px
    );
    pointer-events: none;
    border-radius: 12px;
  }

  /* preview strip hatching */
  .preview-hatch::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg, transparent, transparent 5px,
      rgba(200,214,226,.1) 5px, rgba(200,214,226,.1) 10px
    );
    pointer-events: none;
  }

  .page-scroll::-webkit-scrollbar { width: 4px; }
  .page-scroll::-webkit-scrollbar-thumb { background: #C8D6E2; border-radius: 2px; }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: TrendingUp, label: "Opportunity Hub" },
  { icon: Package, label: "My Products" },
  { icon: Globe, label: "Market Glance" },
  { icon: Users, label: "Buyer List" },
  { icon: FileText, label: "Reports" },
];
const NAV_ACCOUNT = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help & Support" },
  { icon: LogOut, label: "Log out" },
];
const STAT_CARDS = [
  {
    emoji: "📦",
    bg: "#EAF6FF",
    label: "Products tracked",
    val: "0",
    hint: "Add your first product to start",
  },
  {
    emoji: "🎯",
    bg: "#EDFAF4",
    label: "Buyers discovered",
    val: "0",
    hint: "Appears after your first run",
  },
  {
    emoji: "📊",
    bg: "#FFF8EB",
    label: "Emails Generated",
    val: "—",
    hint: "Scored per product-market pair",
  },
  {
    emoji: "📋",
    bg: "#EBF0F6",
    label: "Reports completed",
    val: "0",
    hint: "1 query = 1 product report",
  },
];
const PREVIEW_ITEMS = [
  {
    emoji: "🎯",
    label: "Buyers matched",
    val: "200+",
    sub: "across 4 markets",
  },
  {
    emoji: "🌍",
    label: "Easy Win markets",
    val: "4",
    sub: "scored by demand + fit",
  },
  {
    emoji: "🔍",
    label: "Keywords found",
    val: "34",
    sub: "12 gaps competitors miss",
  },
  { emoji: "📊", label: "Opportunity score", val: "82", sub: "/100 · Strong" },
];
const SKEL_WIDTHS_OPP = ["40%", "55%", "35%"];
const SKEL_WIDTHS_ACT = [
  { t: "60%", s: "80%" },
  { t: "45%", s: "70%" },
  { t: "50%", s: "65%" },
];
const QS_STEPS = [
  {
    num: "✓",
    numStyle: "done",
    title: "Complete your profile",
    sub: "Business type, certifications, target regions and goals are already saved from onboarding.",
    tag: "✓ Done",
    tagStyle: "done",
    highlight: false,
  },
  {
    num: "2",
    numStyle: "active",
    title: "Add your first product",
    sub: "Enter via your website URL, upload a CSV, or type manually. We'll extract specs automatically from your URL.",
    tag: "→ Do this now",
    tagStyle: "active",
    highlight: true,
    btn: "+ Add Product",
  },
  {
    num: "3",
    numStyle: "todo",
    title: "Review & run intelligence",
    sub: "Validate the fetched data, select which products to analyse, and hit run. Your full report is ready in ~45 seconds.",
    tag: "Unlocks after step 2",
    tagStyle: "todo",
    highlight: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

// function Sidebar() {
//   return (
//     <aside className="w-[210px] shrink-0 bg-white border-r border-[#C8D6E2] flex flex-col h-full overflow-y-auto font-jakarta">
//       {/* Logo */}
//       <div className="flex items-center gap-[9px] px-4 py-[18px] pb-[14px] border-b border-[#C8D6E2]">
//         <div className="w-8 h-8 rounded-[9px] flex items-center justify-center"
//           style={{ background: "linear-gradient(135deg,#0284C7,#0891B2)" }}>
//           <TrendingUp size={15} color="#fff" strokeWidth={2.3} />
//         </div>
//         <span className="text-[15px] font-extrabold tracking-tight text-[#0B1927]">
//           InTrade<span className="text-[#0284C7]">24</span>
//         </span>
//       </div>

//       {/* New Intelligence */}
//       <button className="mx-3 mt-3 mb-1.5 flex items-center gap-[7px] px-[14px] py-[10px] rounded-[9px] text-[13px] font-bold text-white w-[calc(100%-24px)] cursor-pointer"
//         style={{ background: "linear-gradient(135deg,#0284C7,#0891B2)" }}>
//         <Plus size={14} color="#fff" strokeWidth={2} />
//         New Intelligence
//       </button>

//       {/* Main nav */}
//       <p className="px-3 pt-[10px] pb-1 text-[10px] font-bold tracking-[.09em] uppercase text-[#85A3B5]">Main</p>
//       <nav className="flex flex-col">
//         {NAV_MAIN.map(({ icon: Icon, label, active }) => (
//           <div key={label}
//             className={`flex items-center gap-[9px] mx-[6px] mb-0.5 px-3 py-2 rounded-[6px] text-[13px] font-medium cursor-pointer transition-all duration-100
//               ${active
//                 ? "bg-[#EAF6FF] text-[#075985] font-bold"
//                 : "text-[#506A80] hover:bg-[#EBF0F6] hover:text-[#0B1927]"
//               }`}
//           >
//             <Icon size={16} strokeWidth={1.8} className="shrink-0" />
//             {label}
//           </div>
//         ))}
//       </nav>

//       <div className="flex-1" />

//       {/* Account nav */}
//       <p className="px-3 pt-[10px] pb-1 text-[10px] font-bold tracking-[.09em] uppercase text-[#85A3B5]">Account</p>
//       <nav className="flex flex-col">
//         {NAV_ACCOUNT.map(({ icon: Icon, label }) => (
//           <div key={label}
//             className="flex items-center gap-[9px] mx-[6px] mb-0.5 px-3 py-2 rounded-[6px] text-[13px] font-medium text-[#506A80] hover:bg-[#EBF0F6] hover:text-[#0B1927] cursor-pointer transition-all duration-100">
//             <Icon size={16} strokeWidth={1.8} className="shrink-0" />
//             {label}
//           </div>
//         ))}
//       </nav>

//       {/* Bottom plan block */}
//       <div className="p-3 border-t border-[#C8D6E2]">
//         <div className="bg-[#EAF6FF] border border-[#BAE6FD] rounded-[9px] p-3 mb-[10px]">
//           <div className="flex items-center justify-between mb-[5px]">
//             <span className="text-[12px] font-bold text-[#075985] flex items-center gap-[5px]">
//               <Zap size={12} /> Scout Plan
//             </span>
//             <span className="text-[13px] font-extrabold text-[#0B1927]">
//               73 <span className="text-[10px] font-normal text-[#506A80]">/ 100</span>
//             </span>
//           </div>
//           <div className="h-1 bg-[#DDE5EE] rounded-full overflow-hidden mb-[5px]">
//             <div className="h-full rounded-full" style={{ width: "73%", background: "linear-gradient(90deg,#0284C7,#0891B2)" }} />
//           </div>
//           <p className="text-[10px] text-[#506A80]">27 used · Resets in <b className="text-[#0369A1]">22 days</b></p>
//         </div>
//         <button className="w-full py-2 rounded-[6px] text-[12px] font-bold text-white bg-[#0284C7] flex items-center justify-center gap-1.5 mb-[10px] cursor-pointer">
//           <ArrowUpRight size={13} /> Upgrade for more queries
//         </button>
//         <div className="flex items-center gap-[9px]">
//           <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0"
//             style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>H</div>
//           <div>
//             <p className="text-[12px] font-bold text-[#0B1927]">Harry Potter</p>
//             <p className="text-[10px] text-[#506A80]">Scout Account</p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// function TopBar() {
//   return (
//     <div className="h-14 bg-white border-b border-[#C8D6E2] flex items-center justify-between px-6 gap-4 shrink-0 font-jakarta">
//       <div className="flex items-center gap-2 bg-[#EBF0F6] border-[1.5px] border-[#C8D6E2] rounded-[9px] px-[14px] py-2 flex-1 max-w-[380px] focus-within:border-[#0284C7] focus-within:bg-white transition-colors duration-150">
//         <Search size={14} className="text-[#85A3B5] shrink-0" strokeWidth={2} />
//         <input
//           type="text"
//           placeholder="Search report or product"
//           className="bg-transparent border-none outline-none text-[13px] text-[#0B1927] placeholder-[#85A3B5] flex-1 font-jakarta"
//         />
//       </div>
//       <button className="w-9 h-9 rounded-[6px] border-[1.5px] border-[#C8D6E2] bg-white flex items-center justify-center cursor-pointer hover:border-[#0284C7] hover:bg-[#EAF6FF] transition-all duration-150 shrink-0">
//         <Bell size={16} className="text-[#506A80]" strokeWidth={1.8} />
//       </button>
//     </div>
//   );
// }

function SkeletonRow({ widthClass }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-[10px] border border-dashed border-[#C8D6E2] rounded-[6px] opacity-55">
      <div className="w-2 h-2 rounded-full bg-[#DDE5EE] shrink-0" />
      <div
        className="h-[10px] rounded bg-[#DDE5EE]"
        style={{ width: widthClass }}
      />
      <div className="ml-auto flex gap-[5px]">
        <div className="h-4 w-5 rounded-[6px] bg-[#DDE5EE]" />
        <div className="h-4 w-5 rounded-[6px] bg-[#DDE5EE]" />
      </div>
      <div className="h-4 w-[55px] rounded-full bg-[#DDE5EE]" />
    </div>
  );
}

function ActivitySkeletonRow({ widths }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-[10px] border border-dashed border-[#C8D6E2] rounded-[6px] opacity-55">
      <div className="w-2 h-2 rounded-full bg-[#DDE5EE] shrink-0" />
      <div className="flex-1">
        <div
          className="h-[10px] rounded bg-[#DDE5EE] mb-[5px]"
          style={{ width: widths.t }}
        />
        <div
          className="h-2 rounded bg-[#DDE5EE] opacity-60"
          style={{ width: widths.s }}
        />
      </div>
      <div className="h-5 w-[60px] rounded-full bg-[#DDE5EE]" />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function NewUserProduct() {
  const navigate = useNavigate();

  let userProfile = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");
  let name = "";
  try {
    const parsed = userProfile ? JSON.parse(userProfile) : null;
    name = parsed?.name || "";
  } catch (e) {
    console.log("Invalid localStorage data");
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div className="h-screen flex font-jakarta overflow-hidden bg-[#ECF1F7] text-[#0B1927] text-[14px] leading-[1.55] antialiased">
        {/* <Sidebar /> */}

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <TopBar /> */}

          {/* Scrollable page */}
          <div className="flex-1 overflow-y-auto p-6 page-scroll">
            {/* Greeting */}
            

            {/* ── Welcome Hero ── */}
            

            

            {/* ── Preview Strip ── */}
            {/* <div className="bg-white border-[1.5px] border-[#C8D6E2] rounded-[12px] overflow-hidden mb-5 fade-up-8"
              style={{ boxShadow: "0 1px 3px rgba(11,25,39,.06)" }}>
              <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-[#C8D6E2]">
                <div>
                  <p className="text-[13px] font-bold text-[#0B1927]">What your dashboard will show after your first run</p>
                  <p className="text-[11px] text-[#506A80] mt-0.5">Live example — Organic Turmeric Powder, India → USA · Germany · UK · Singapore</p>
                </div>
                <span className="text-[11px] italic text-[#85A3B5]">Preview only</span>
              </div>
              <div className="grid grid-cols-4">
                {PREVIEW_ITEMS.map(({ emoji, label, val, sub }, i) => (
                  <div key={label}
                    className={`preview-hatch relative px-4 py-4 text-center ${i < 3 ? "border-r border-[#C8D6E2]" : ""}`}>
                    <p className="text-[20px] mb-2 relative z-10">{emoji}</p>
                    <p className="text-[11px] font-bold text-[#0B1927] mb-[3px] relative z-10">{label}</p>
                    <p className="count-up text-[20px] font-extrabold text-[#075985] leading-none mb-0.5 relative z-10">{val}</p>
                    <p className="text-[10px] text-[#85A3B5] relative z-10">{sub}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* ── Two Panels ── */}
            <div className="grid grid-cols-1 gap-[14px] mb-5">
              {/* Opportunity Hub */}
              <div
                className="bg-white border-[1.5px] border-[#C8D6E2] rounded-[12px] overflow-hidden fade-up-6"
                style={{ boxShadow: "0 1px 3px rgba(11,25,39,.06)" }}
              >
                <div className="flex items-center justify-between px-4 py-[13px] border-b border-[#C8D6E2]">
                  <span className="font-bold tracking-[.08em] text-xl">
                    My Products
                  </span>
                  <span className="text-[12px] font-bold text-[#0284C7] opacity-35 cursor-default">
                    View All
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex flex-col items-center justify-center py-7 text-center">
                    <div className="w-12 h-12 rounded-[9px] bg-[#EBF0F6] flex items-center justify-center text-[22px] mb-3">
                      🚀
                    </div>
                    <p className="text-[13px] font-bold text-[#0B1927] mb-[5px]">
                      No products yet
                    </p>
                    <p className="text-[12px] text-[#506A80] leading-[1.6] max-w-[220px] mb-[14px]">
                      Once you run your first analysis, all your products and
                      their opportunity scores appear here.
                    </p>
                    <div className="w-full mb-[14px] flex flex-col gap-[7px]">
                      {SKEL_WIDTHS_OPP.map((w, i) => (
                        <SkeletonRow key={i} widthClass={w} />
                      ))}
                    </div>
                    <button
                      className="inline-flex items-center gap-[5px] px-4 py-[7px] rounded-[6px] text-[12px] font-bold text-white cursor-pointer transition-all duration-150 hover:-translate-y-[1px]"
                      style={{
                        background: "linear-gradient(135deg,#0284C7,#0891B2)",
                        boxShadow: "0 2px 8px rgba(2,132,199,.22)",
                      }}
                      onClick={() => navigate("/discover")}
                    >
                      + Run First Analysis
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
            </div>

            {/* ── Quick Start Guide ── */}
            <div
              className="bg-white border-[1.5px] border-[#C8D6E2] rounded-[12px] overflow-hidden fade-up-9"
              style={{ boxShadow: "0 1px 3px rgba(11,25,39,.06)" }}
            >
              <div className="px-[18px] py-[14px] border-b border-[#C8D6E2]">
                <p className="text-[13px] font-bold text-[#0B1927]">
                  Your quick start guide
                </p>
                <p className="text-[11px] text-[#506A80] mt-0.5">
                  3 things to do to get your first intelligence report
                </p>
              </div>
              <div className="grid grid-cols-3">
                {QS_STEPS.map(
                  (
                    {
                      num,
                      numStyle,
                      title,
                      sub,
                      tag,
                      tagStyle,
                      highlight,
                      btn,
                    },
                    i,
                  ) => (
                    <div
                      key={i}
                      className={`p-[18px] ${i < 2 ? "border-r border-[#C8D6E2]" : ""}`}
                      style={
                        highlight
                          ? {
                              background: "#EAF6FF",
                              borderTop: "2px solid #0284C7",
                            }
                          : {}
                      }
                    >
                      {/* Step number */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-extrabold mb-[10px] shrink-0
                      ${
                        numStyle === "done"
                          ? "bg-[#059669] text-white"
                          : numStyle === "active"
                            ? "bg-[#0284C7] text-white"
                            : "bg-[#EBF0F6] text-[#85A3B5] border-[1.5px] border-[#C8D6E2]"
                      }`}
                        style={
                          numStyle === "active"
                            ? { boxShadow: "0 0 0 4px #EAF6FF" }
                            : {}
                        }
                      >
                        {num}
                      </div>
                      <p className="text-[13px] font-bold text-[#0B1927] mb-1">
                        {title}
                      </p>
                      <p className="text-[12px] text-[#506A80] leading-[1.6] mb-3">
                        {sub}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-[9px] py-[3px]
                      ${
                        tagStyle === "done"
                          ? "bg-[#EDFAF4] text-[#059669]"
                          : tagStyle === "active"
                            ? "bg-[#EAF6FF] text-[#075985]"
                            : "bg-[#EBF0F6] text-[#85A3B5]"
                      }`}
                      >
                        {tag}
                      </span>
                      {btn && (
                        <button
                          className="mt-[10px] flex items-center gap-[5px] px-[14px] py-[7px] rounded-[6px] text-[12px] font-bold text-white cursor-pointer transition-all duration-150 hover:-translate-y-[1px]"
                          style={{
                            background:
                              "linear-gradient(135deg,#0284C7,#0891B2)",
                            boxShadow: "0 2px 7px rgba(2,132,199,.22)",
                          }}
                          onClick={()=>navigate("/discover")}
                        >
                          {btn}
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          {/* /page-scroll */}
        </div>
        {/* /main */}
      </div>
    </>
  );
}
