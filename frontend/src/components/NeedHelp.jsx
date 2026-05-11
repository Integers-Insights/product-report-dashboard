// import { UserCircleIcon, XMarkIcon,LightBulbIcon } from "@heroicons/react/24/outline";
// import { useState } from "react";
// const NeedHelp = ({setPopup_Open}) => {
//   const [openStep, setOpenStep] = useState("");

//   const toggleStep = (step) => {
//     setOpenStep(openStep === step ? "" : step);
//   };

//   return (
//     <div className="border border-gray-200 w-150 m-auto rounded-lg bg-[#FFFFFF]" onClick={(e)=>e.stopPropagation()}>
//       <div className="border bg-[#0284C7] p-4 rounded-tl-lg rounded-tr-lg text-white">
//         <div className="flex justify-between">
//           <div className="p-1 rounded-sm bg-white/20 backdrop-blur-md border border-white/30">
//             <LightBulbIcon className="w-6 h-6" />
//           </div>
//           <div className="p-1 rounded-sm bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer" onClick={()=>setPopup_Open(false)}>
//             <XMarkIcon className="w-6 h-6" />
//           </div>
//         </div>
//         <h1 className="text-xl font-medium mt-4">How INTRADE24 works</h1>
//         <p className="text-sm font-regular">
//           Everything you need to get your first intelligence report in 3 steps.
//           Read what's
//         </p>
//         <p className="text-sm font-regular">
//           relevant, skip what you already know.
//         </p>
//         <div className="flex gap-4 mt-4">
//           <div className="px-2.5 py-1 rounded-2xl border flex gap-1.5 text-sm font-medium bg-white/20 backdrop-blur-md border border-white/30">
//             <div className="bg-[#0284C7] rounded-full h-5.5 w-5.5 text-center content-center">
//               01
//             </div>
//             <p>About You</p>
//           </div>
//           <div className="px-2.5 py-1 rounded-2xl border flex gap-1.5 text-sm font-medium bg-white/20 backdrop-blur-md border border-white/30">
//             <div className="bg-[#0284C7] rounded-full h-5.5 w-5.5 text-center content-center">
//               02
//             </div>
//             <p>Products & Markets</p>
//           </div>
//           <div className="px-2.5 py-1 rounded-2xl border flex gap-1.5 text-sm font-medium bg-white/20 backdrop-blur-md border border-white/30">
//             <div className="bg-[#0284C7] rounded-full h-5.5 w-5.5 text-center content-center">
//               03
//             </div>
//             <p>Certificates & Goals</p>
//           </div>
//         </div>
//       </div>

//       {/* content */}
//       <div className="my-1 mbd h-105 px-4">
//         {/* step1 */}
//         <div
//           className="p-2 mt-4 rounded bg-[#E0F5FF] cursor-pointer flex justify-between items-center"
//           onClick={() => toggleStep("step1")}
//         >
//           <div>
//             <p className="text-sm font-medium">What is this 3-step setup?</p>
//             <p className="text-xs font-regular">
//               Why we need it and what happens after
//             </p>
//           </div>
//           <span
//             className={`text-lg transition-transform duration-300 ${
//               openStep === "step1" ? "rotate-45" : "rotate-0"
//             }`}
//           >
//             +
//           </span>
//         </div>

//         <div
//           className={`transition-all duration-300 ease-in-out overflow-hidden ${
//             openStep === "step1"
//               ? "h-auto opacity-100 mt-2"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="text-sm font-regular">
//             <p>
//               <span className="font-medium">This setup runs once. </span>
//               We use your answers to personalise every intelligence report —
//               matching buyers to your product, certifications, pricing and
//               target regions.
//             </p>

//             <p className="mt-2">
//               <span className="font-medium">Takes about 2 minutes. </span>
//               Three short steps — who you are, what you sell, and what
//               certifications and goals matter to you.
//             </p>

//             <p className="mt-2">
//               <span className="font-medium">Your data stays yours. </span>
//               Everything you enter is used exclusively to generate your reports.
//             </p>

//             <div className="border border-l-3 border-[#0284C7] bg-gray-100 rounded-lg p-2 mt-2">
//               <span className="font-medium">What happens after setup?</span>
//               You add your products → we run 6 intelligence modules → you get a
//               full report.
//             </div>
//           </div>
//         </div>

//         {/* step2 */}
//         <div
//           className="p-2 mt-4 rounded bg-[#E0F5FF] cursor-pointer flex justify-between items-center"
//           onClick={() => toggleStep("step2")}
//         >
//           <div>
//             <p className="text-sm font-medium">Step 1 — About You</p>
//             <p className="text-xs font-regular">
//               Name, company, country, industry, company type
//             </p>
//           </div>
//           <span
//             className={`text-lg transition-transform duration-300 ${
//               openStep === "step1" ? "rotate-45" : "rotate-0"
//             }`}
//           >
//             +
//           </span>
//         </div>

//         <div
//           className={`transition-all text-sm font-regular duration-300 ease-in-out overflow-hidden ${
//             openStep === "step2"
//               ? "max-h-[500px] opacity-100 mt-2"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <p className="text-gray-700 font-medium uppercase mb-2">
//             Why we ask each field
//           </p>
//           <p>
//             <span className="font-medium">Company name & country - </span>
//             used to identify your export origin and match you with buyers in
//             compatible trade corridors. An Indian manufacturer gets different
//             buyer matches than a UK distributor selling the same product.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Company type - </span>Manufacturer,
//             Exporter, Distributor, Brand, etc. Buyers search differently
//             depending on whether they want factory-direct or a trading house.
//             This changes who we show you.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Years in industry - </span>
//             shapes the tone of the outreach templates and the complexity of the
//             intelligence we surface. A new exporter needs different guidance
//             than a 15-year veteran.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Website - </span>
//             optional but recommended. We use it to pre-fill product data in Step
//             2, saving you time. If your website has a product catalogue, we can
//             extract names, descriptions and specs automatically.
//           </p>

//           <div className="flex justify-between gap-5 mt-2">
//             <div className="border border-green-400 p-3 rounded-lg text-sm flex flex-col gap-1 bg-green-50">
//               <p className="font-medium text-green-700 text-sm">✓ Do this</p>
//               <div className="flex gap-1">
//                 <div className="h-5 w-5 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
//                   ✓
//                 </div>
//                 <p>Use your legal company name</p>
//               </div>
//               <div className="flex gap-1">
//                 <div className="h-5 w-6 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
//                   ✓
//                 </div>
//                 <p>Select your primary country of operation</p>
//               </div>
//               <div className="flex gap-1">
//                 <div className="h-5 w-7.5 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
//                   ✓
//                 </div>
//                 <p>Choose the type that fits best — you can adjust later</p>
//               </div>
//               <div className="flex gap-1">
//                 <div className="h-5 w-5 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
//                   ✓
//                 </div>
//                 <p>Add your website if you have one</p>
//               </div>
//             </div>

//             <div className="border border-red-400 p-3 rounded-lg text-sm flex flex-col gap-1 bg-red-50">
//               <p className="font-medium text-red-700 text-sm">✗ Avoid this</p>
//               <div className="flex gap-1">
//                 <div className="h-5 w-6.5 rounded-full text-center content-center bg-red-700 font-medium text-white text-xs">
//                   ✗
//                 </div>
//                 <p>Using a personal name instead of company</p>
//               </div>
//               <div className="flex gap-1">
//                 <div className="h-5 w-7.5 rounded-full text-center content-center bg-red-700 font-medium text-white text-xs">
//                   ✗
//                 </div>
//                 <p>Selecting a different country than where you operate</p>
//               </div>
//               <div className="flex gap-1">
//                 <div className="h-5 w-6.5 rounded-full text-center content-center bg-red-700 font-medium text-white text-xs">
//                   ✗
//                 </div>
//                 <p>Leaving industry blank — it affects all matches</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* step3 */}
//         <div
//           className="p-2 mt-4 rounded bg-[#E0F5FF] cursor-pointer flex justify-between items-center"
//           onClick={() => toggleStep("step3")}
//         >
//           <div>
//             <p className="text-sm font-medium">Step 2 — Products & Markets</p>
//             <p className="text-xs font-regular">
//               What you sell, buyer type, target regions, price positioning
//             </p>
//           </div>
//           <span
//             className={`text-lg transition-transform duration-300 ${
//               openStep === "step1" ? "rotate-45" : "rotate-0"
//             }`}
//           >
//             +
//           </span>
//         </div>

//         <div
//           className={`transition-all text-sm font-regular duration-300 ease-in-out overflow-hidden ${
//             openStep === "step3"
//               ? "h-auto opacity-100 mt-2"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <p className="text-gray-700 font-medium uppercase mb-2">
//             How to describe your products
//           </p>
//           <p>
//             <span className="font-medium">Be specific, not generic. </span>
//             "Organic Turmeric Powder 95% Curcumin, GMP certified" will match far
//             more buyers than "Turmeric". Include grade, spec, packaging format,
//             or application where relevant.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">
//               Add multiple products separately.{" "}
//             </span>
//             Each product gets its own intelligence report. Don't bundle
//             "Turmeric and Ashwagandha" into one entry — add them as two separate
//             products for accurate buyer matching.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Target regions, not countries. </span>
//             At this stage we ask for broad regions (e.g. North America, Europe).
//             You'll see individual country scores in your report. Selecting too
//             many regions doesn't cost extra — we'll score them all.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Price positioning matters. </span>
//             Budget, mid-range, and premium buyers search and behave very
//             differently. Choosing the wrong tier means your buyer list will
//             include companies who will never pay your price.
//           </p>

//           <div className="border border-l-3 border-[#0284C7] bg-gray-100 rounded-lg p-2 mt-2">
//             <span className="font-medium text-[#0284C7]">
//               Good product entry:
//             </span>{" "}
//             "Organic Turmeric Powder — curcumin ≥95%, moisture &lt;8%, GMP
//             certified, 500g and 25kg bags, food grade"
//           </div>
//           <div className="border border-l-3 border-[#D48C15] bg-[#f7ede1] rounded-lg p-2 mt-2">
//             <span className="font-medium text-[#D48C15]">Too vague:</span>{" "}
//             "Turmeric" or "Spices" — these return commodity-level matches with
//             low buyer quality and poor market scoring.
//           </div>

//           <p className="text-gray-700 font-medium uppercase my-2">
//             Product type — what to select
//           </p>

//           <div className="flex flex-wrap gap-2 mt-2">
//             <div className="border px-3 py-0.5 rounded-2xl bg-green-100 text-green-700 text-sm font-medium">
//               Raw Material
//             </div>
//             <div className="border px-3 py-0.5 rounded-2xl bg-green-100 text-green-700 text-sm font-medium">
//               Extract / API
//             </div>
//             <div className="border px-3 py-0.5 rounded-2xl bg-green-100 text-green-700 text-sm font-medium">
//               Finished Goods
//             </div>
//             <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
//               Component / Part
//             </div>
//             <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
//               Formulation
//             </div>
//             <div className="border px-3 py-0.5 rounded-2xl bg-[#E0F5FF] text-[#0284C7] text-sm font-medium">
//               Software / Tech
//             </div>
//             <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
//               Commodity
//             </div>
//             <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
//               Branded / Private Label
//             </div>

//             <p>
//               Select <span className="font-medium">all types that apply</span> —
//               some products qualify as both a Raw Material and a Finished Good
//               depending on the buyer. Multi-selecting gives you a broader buyer
//               pool.
//             </p>
//           </div>
//         </div>

//         {/* step4 */}
//         <div
//           className="p-2 mt-4 rounded bg-[#E0F5FF] cursor-pointer flex justify-between items-center"
//           onClick={() => toggleStep("step4")}
//         >
//           <div>
//             <p className="text-sm font-medium">Step 3 — Certificates & Goals</p>
//             <p className="text-xs font-regular">
//               Which certs buyers expect, and what you want from INTRADE24
//             </p>
//           </div>
//           <span
//             className={`text-lg transition-transform duration-300 ${
//               openStep === "step1" ? "rotate-45" : "rotate-0"
//             }`}
//           >
//             +
//           </span>
//         </div>

//         <div
//           className={`transition-all text-sm font-regular duration-300 ease-in-out overflow-hidden ${
//             openStep === "step4"
//               ? "h-auto opacity-100 mt-2"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <p className="text-gray-700 font-medium uppercase my-2">
//             Certifications — what this means
//           </p>
//           <div className="border rounded-lg p-2 text-[#D48C15]">
//             <span className="font-medium">Important:</span> We ask for
//             certifications{" "}
//             <span className="font-medium">expected from your research</span> —
//             meaning which certs your target buyers typically require. This is
//             NOT about what certs you currently hold. It's a filter for buyer
//             matching.
//           </div>
//           <p className="mt-2">
//             <span className="font-medium">
//               Select certs your buyers care about.{" "}
//             </span>
//             If you're selling to US supplement brands, they'll expect GMP and
//             USDA Organic. If you're selling into Germany, they'll want EU
//             Organic or FSSC 22000. Selecting these surfaces buyers who require
//             exactly that.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Don't select everything.</span>
//             Over-selecting certs narrows your buyer pool unnecessarily. If
//             you're not sure which certs your buyers need, start with the 2–3
//             most common for your industry and adjust after seeing your first
//             report.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">
//               Use "Other" for specialist certs.{" "}
//             </span>
//             If your industry uses certs not in the list — like FSMA, JAS, TGA,
//             or a country-specific standard — type it in the "Other" field with
//             the full cert name and issuing body.
//           </p>

//           <hr className="border-0 bg-gray-200 h-[1px] my-2" />
//           <p className="text-gray-700 font-medium uppercase mb-2">
//             Goals — why this matters
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">
//               Goals shape the report sections we prioritise{" "}
//             </span>
//             Selecting "Find export buyers" emphasises the buyer list. "Pricing
//             intelligence" weights the price analysis. "Competitor analysis"
//             expands the competitor map. You can select multiple.
//           </p>

//           <p className="mt-2">
//             <span className="font-medium">
//               Goals also shape your email sequence.{" "}
//             </span>
//             A "Find distributors" goal generates a different outreach tone and
//             CTA than "Find export buyers". The AI adapts the copy based on what
//             you're trying to achieve.
//           </p>

//           <div className="border border-l-3 border-[#2E7D32] bg-[#e2ffe3] rounded-lg p-2 mt-2">
//             <span className="font-medium text-[#2E7D32]">
//               Good goal combination:
//             </span>
//             A "Find distributors" goal generates a different outreach tone and
//             CTA than "Find export buyers". The AI adapts the copy based on what
//             you're trying to achieve.
//           </div>
//         </div>

//         {/* step5 */}
//         <div
//           className="p-2 mt-4 rounded bg-[#E0F5FF] cursor-pointer flex justify-between items-center"
//           onClick={() => toggleStep("step5")}
//         >
//           <div>
//             <p className="text-sm font-medium">What are queries?</p>
//             <p className="text-xs font-regular">
//               How credits work and what uses them
//             </p>
//           </div>
//           <span
//             className={`text-lg transition-transform duration-300 ${
//               openStep === "step1" ? "rotate-45" : "rotate-0"
//             }`}
//           >
//             +
//           </span>
//         </div>

//         <div
//           className={`transition-all text-sm font-regular duration-300 ease-in-out overflow-hidden ${
//             openStep === "step5"
//               ? "h-auto opacity-100 mt-2"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <p>
//             <span className="font-medium">
//               1 query = 1 product analysis run.
//             </span>
//             Each time you run intelligence on a product, it uses 1 query. If you
//             analyse 3 products in one run, it costs 3 queries. The setup itself
//             — including this onboarding — is completely free.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Viewing reports is always free.</span>
//             Once a report is generated, you can open, re-read, share, and
//             revisit it as many times as you want. Queries are only used when the
//             engine runs.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">Re-runs cost a query. </span>
//             If market conditions change or you want fresh buyer data, you can
//             re-run any product. Each re-run costs 1 query. Your query balance
//             renews monthly on your plan.
//           </p>

//           <div className="grid grid-cols-3 gap-3 mt-2">
//             <div className="p-2 text-center rounded-lg bg-gray-100">
//               <p className="text-base font-medium">Scout</p>
//               <p className="text-xl font-medium">100 Q</p>
//               <p className="text-xs font-regular">per month</p>
//             </div>
//             <div className="p-2 text-center rounded-lg bg-[#E0F5FF]">
//               <p className="text-base font-medium">Venture</p>
//               <p className="text-xl font-medium">300 Q</p>
//               <p className="text-xs font-regular">per month · recommended</p>
//             </div>
//             <div className="p-2 text-center rounded-lg bg-gray-100">
//               <p className="text-base font-medium">Apex</p>
//               <p className="text-xl font-medium">1000 Q</p>
//               <p className="text-xs font-regular">per month</p>
//             </div>
//           </div>

//           <div className="border border-l-3 border-[#0284C7] bg-gray-100 rounded-lg p-2 mt-3">
//             <span className="font-medium">Need more queries mid-month?</span>{" "}
//             You can buy 20 extra queries for $9 at any time without changing
//             your plan.
//           </div>
//         </div>

//         {/* step6 */}

//         <div
//           className="p-2 mt-4 rounded bg-[#E0F5FF] cursor-pointer flex justify-between items-center"
//           onClick={() => toggleStep("step6")}
//         >
//           <div>
//             <p className="text-sm font-medium">Common questions</p>
//             <p className="text-xs font-regular">
//               Things most new users ask before their first run
//             </p>
//           </div>
//           <span
//             className={`text-lg transition-transform duration-300 ${
//               openStep === "step1" ? "rotate-45" : "rotate-0"
//             }`}
//           >
//             +
//           </span>
//         </div>

//         <div
//           className={`transition-all text-sm font-regular duration-300 ease-in-out overflow-hidden ${
//             openStep === "step6"
//               ? "h-auto opacity-100 mt-2"
//               : "max-h-0 opacity-0"
//           }`}
//         >
//           <p>
//             <span className="font-medium">
//               Can I change my answers after setup?
//             </span>
//             Yes. Everything you enter here can be updated from your profile
//             settings at any time. Your next intelligence run will use the
//             updated profile.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">
//               What if I don't have a website yet?
//             </span>
//             That's fine — the website field is optional. You can add products
//             manually or upload a CSV in the next step. The website just speeds
//             up product extraction.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">
//               What if my product doesn't fit any category?
//             </span>
//             Choose the closest match and describe your product accurately in the
//             text field. Our engine uses the description more than the category
//             for matching. You can also use the "Other" option for industry.
//           </p>

//           <p className="mt-2">
//             <span className="font-medium">
//               I sell both B2B and B2C — which do I choose?
//             </span>
//             Select "Both". We'll surface buyers from both segments and let you
//             filter in the report. If the majority of your revenue is B2B, lean
//             towards B2B — it affects the outreach templates most.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">
//               What if I don't hold any certifications yet?
//             </span>
//             Select the certifications your target buyers typically require — not
//             what you currently hold. This tells us what market segment you're
//             targeting. Your report will show you which certs would unlock the
//             most buyers.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">How accurate is the buyer data?</span>
//             Buyer data is sourced from live B2B trade portals, customs records,
//             and verified databases. Contact details (email, LinkedIn) are
//             available on Venture+ plan. Company profiles and match scores are
//             available on all plans.
//           </p>
//           <p className="mt-2">
//             <span className="font-medium">
//               Can I run reports for multiple products at once?
//             </span>
//             Yes. You can add up to 10 products and run them together. Each
//             product uses 1 query. You'll get individual reports per product plus
//             a combined opportunity report covering all of them.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default NeedHelp;

import {
  UserCircleIcon,
  XMarkIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
const NeedHelp = ({ setPopup_Open }) => {
  const [openSteps, setOpenSteps] = useState([]);

  const toggleStep = (step) => {
    setOpenSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step],
    );
  };

  return (
    <div
      className="border border-gray-200 w-150 m-auto rounded-lg bg-[#FFFFFF]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="border bg-[#0284C7] p-4 rounded-tl-lg rounded-tr-lg text-white">
        <div className="flex justify-between">
          <div className="p-1 rounded-sm bg-white/20 backdrop-blur-md border border-white/30">
            <LightBulbIcon className="w-6 h-6" />
          </div>
          <div
            className="p-1 rounded-sm bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer"
            onClick={() => setPopup_Open(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-xl font-medium mt-4">How INTRADE24 works</h1>
        <p className="text-sm font-regular">
          Everything you need to get your first intelligence report in 3 steps.
          Read what's
        </p>
        <p className="text-sm font-regular">
          relevant, skip what you already know.
        </p>
        <div className="flex gap-4 mt-4">
          <div className="px-2.5 py-1 rounded-2xl border flex gap-1.5 text-sm font-medium bg-white/20 backdrop-blur-md border border-white/30">
            <div className="bg-[#0284C7] rounded-full h-5.5 w-5.5 text-center content-center">
              01
            </div>
            <p>About You</p>
          </div>
          <div className="px-2.5 py-1 rounded-2xl border flex gap-1.5 text-sm font-medium bg-white/20 backdrop-blur-md border border-white/30">
            <div className="bg-[#0284C7] rounded-full h-5.5 w-5.5 text-center content-center">
              02
            </div>
            <p>Products & Markets</p>
          </div>
          <div className="px-2.5 py-1 rounded-2xl border flex gap-1.5 text-sm font-medium bg-white/20 backdrop-blur-md border border-white/30">
            <div className="bg-[#0284C7] rounded-full h-5.5 w-5.5 text-center content-center">
              03
            </div>
            <p>Certificates & Goals</p>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="my-1 mbd h-105 px-4 mb-4">
        {/* step1 */}
        <div
          className="p-2 mt-4 rounded bg-[#E0F5FF] hover:bg-[#d4f1ff] cursor-pointer flex justify-between items-center"
          onClick={() => toggleStep("step1")}
        >
          <div>
            <p className="text-sm font-medium">What is this 3-step setup?</p>
            <p className="text-xs font-regular">
              Why we need it and what happens after
            </p>
          </div>
          <span
            className={`text-lg transition-transform duration-300 ${
              openSteps.includes("step1") ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </div>

        <div
          className={`transition-all text-sm font-regular duration-300 overflow-hidden ${
            openSteps.includes("step1")
              ? "h-auto opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="text-sm font-regular">
            <p>
              <span className="font-medium">This setup runs once. </span>
              We use your answers to personalise every intelligence report — matching buyers to your product, certifications, pricing and target regions. The more accurate your input, the better your results.
            </p>

            <p className="mt-4">
              <span className="font-medium">Takes about 2 minutes. </span>
              Three short steps — who you are, what you sell, and what certifications and goals matter to you. You can edit everything later from your profile settings.
            </p>

            <p className="mt-4">
              <span className="font-medium">Your data stays yours. </span>
              Everything you enter is used exclusively to generate your reports. It is never shared, sold, or used for any other purpose.
            </p>

            <div className="border border-l-3 border-[#0284C7] bg-gray-100 rounded-lg p-2 mt-4">
              <span className="font-medium">What happens after setup?</span>
              You add your products → we run 6 intelligence modules → you get a full opportunity report with matched buyers, market scores, keywords, pricing intelligence, competitor analysis, and an email outreach sequence — all in one place.
            </div>
          </div>
        </div>

        {/* step2 */}
        <div
          className="p-2 mt-6 rounded bg-[#E0F5FF] hover:bg-[#d4f1ff] cursor-pointer flex justify-between items-center"
          onClick={() => toggleStep("step2")}
        >
          <div>
            <p className="text-sm font-medium">Step 1 — About You</p>
            <p className="text-xs font-regular">
              Name, company, country, industry, company type
            </p>
          </div>
          <span
            className={`text-lg transition-transform duration-300 ${
              openSteps.includes("step2") ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </div>

        <div
          className={`transition-all text-sm font-regular duration-300 overflow-hidden ${
            openSteps.includes("step2")
              ? "h-auto opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-gray-700 font-medium uppercase mb-2">
            Why we ask each field
          </p>
          <p>
            <span className="font-medium">Company name & country - </span>
            used to identify your export origin and match you with buyers in
            compatible trade corridors. An Indian manufacturer gets different
            buyer matches than a UK distributor selling the same product.
          </p>
          <p className="mt-4">
            <span className="font-medium">Company type - </span>Manufacturer,
            Exporter, Distributor, Brand, etc. Buyers search differently
            depending on whether they want factory-direct or a trading house.
            This changes who we show you.
          </p>
          <p className="mt-4">
            <span className="font-medium">Years in industry - </span>
            shapes the tone of the outreach templates and the complexity of the
            intelligence we surface. A new exporter needs different guidance
            than a 15-year veteran.
          </p>
          <p className="mt-4">
            <span className="font-medium">Website - </span>
            optional but recommended. We use it to pre-fill product data in Step
            2, saving you time. If your website has a product catalogue, we can
            extract names, descriptions and specs automatically.
          </p>

          <div className="flex justify-between gap-5 mt-4">
            <div className="border border-green-400 p-3 rounded-lg text-sm flex flex-col gap-1 bg-green-50">
              <p className="font-medium text-green-700 text-sm">✓ Do this</p>
              <div className="flex gap-1">
                <div className="h-5 w-5 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
                  ✓
                </div>
                <p>Use your legal company name</p>
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-6 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
                  ✓
                </div>
                <p>Select your primary country of operation</p>
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-7.5 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
                  ✓
                </div>
                <p>Choose the type that fits best — you can adjust later</p>
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-5 rounded-full text-center content-center bg-green-700 font-medium text-white text-xs">
                  ✓
                </div>
                <p>Add your website if you have one</p>
              </div>
            </div>

            <div className="border border-red-400 p-3 rounded-lg text-sm flex flex-col gap-1 bg-red-50">
              <p className="font-medium text-red-700 text-sm">✗ Avoid this</p>
              <div className="flex gap-1">
                <div className="h-5 w-6.5 rounded-full text-center content-center bg-red-700 font-medium text-white text-xs">
                  ✗
                </div>
                <p>Using a personal name instead of company</p>
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-7.5 rounded-full text-center content-center bg-red-700 font-medium text-white text-xs">
                  ✗
                </div>
                <p>Selecting a different country than where you operate</p>
              </div>
              <div className="flex gap-1">
                <div className="h-5 w-6.5 rounded-full text-center content-center bg-red-700 font-medium text-white text-xs">
                  ✗
                </div>
                <p>Leaving industry blank — it affects all matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* step3 */}
        <div
          className="p-2 mt-6 rounded bg-[#E0F5FF] hover:bg-[#d4f1ff] cursor-pointer flex justify-between items-center"
          onClick={() => toggleStep("step3")}
        >
          <div>
            <p className="text-sm font-medium">Step 2 — Products & Markets</p>
            <p className="text-xs font-regular">
              What you sell, buyer type, target regions, price positioning
            </p>
          </div>
          <span
            className={`text-lg transition-transform duration-300 ${
              openSteps.includes("step3") ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </div>

        <div
          className={`transition-all text-sm font-regular duration-300 overflow-hidden ${
            openSteps.includes("step3")
              ? "h-auto opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-gray-700 font-medium uppercase mb-2">
            How to describe your products
          </p>
          <p>
            <span className="font-medium">Be specific, not generic. </span>
            "Organic Turmeric Powder 95% Curcumin, GMP certified" will match far
            more buyers than "Turmeric". Include grade, spec, packaging format,
            or application where relevant.
          </p>
          <p className="mt-4">
            <span className="font-medium">
              Add multiple products separately.{" "}
            </span>
            Each product gets its own intelligence report. Don't bundle
            "Turmeric and Ashwagandha" into one entry — add them as two separate
            products for accurate buyer matching.
          </p>
          <p className="mt-4">
            <span className="font-medium">Target regions, not countries. </span>
            At this stage we ask for broad regions (e.g. North America, Europe).
            You'll see individual country scores in your report. Selecting too
            many regions doesn't cost extra — we'll score them all.
          </p>
          <p className="mt-4">
            <span className="font-medium">Price positioning matters. </span>
            Budget, mid-range, and premium buyers search and behave very
            differently. Choosing the wrong tier means your buyer list will
            include companies who will never pay your price.
          </p>

          <div className="border border-l-3 border-[#0284C7] bg-gray-100 rounded-lg p-2 mt-4">
            <span className="font-medium text-[#0284C7]">
              Good product entry:
            </span>{" "}
            "Organic Turmeric Powder — curcumin ≥95%, moisture &lt;8%, GMP
            certified, 500g and 25kg bags, food grade"
          </div>
          <div className="border border-l-3 border-[#D48C15] bg-[#f7ede1] rounded-lg p-2 mt-4">
            <span className="font-medium text-[#D48C15]">Too vague:</span>{" "}
            "Turmeric" or "Spices" — these return commodity-level matches with
            low buyer quality and poor market scoring.
          </div>

          <p className="text-gray-700 font-medium uppercase my-4">
            Product type — what to select
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="border px-3 py-0.5 rounded-2xl bg-green-100 text-green-700 text-sm font-medium">
              Raw Material
            </div>
            <div className="border px-3 py-0.5 rounded-2xl bg-green-100 text-green-700 text-sm font-medium">
              Extract / API
            </div>
            <div className="border px-3 py-0.5 rounded-2xl bg-green-100 text-green-700 text-sm font-medium">
              Finished Goods
            </div>
            <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
              Component / Part
            </div>
            <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
              Formulation
            </div>
            <div className="border px-3 py-0.5 rounded-2xl bg-[#E0F5FF] text-[#0284C7] text-sm font-medium">
              Software / Tech
            </div>
            <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
              Commodity
            </div>
            <div className="border px-3 py-0.5 rounded-2xl text-gray-700 text-sm font-medium">
              Branded / Private Label
            </div>

            <p className="mt-1">
              Select <span className="font-medium">all types that apply</span> —
              some products qualify as both a Raw Material and a Finished Good
              depending on the buyer. Multi-selecting gives you a broader buyer
              pool.
            </p>
          </div>
        </div>

        {/* step4 */}
        <div
          className="p-2 mt-6 rounded bg-[#E0F5FF] hover:bg-[#d4f1ff] cursor-pointer flex justify-between items-center"
          onClick={() => toggleStep("step4")}
        >
          <div>
            <p className="text-sm font-medium">Step 3 — Certificates & Goals</p>
            <p className="text-xs font-regular">
              Which certs buyers expect, and what you want from INTRADE24
            </p>
          </div>
          <span
            className={`text-lg transition-transform duration-300 ${
              openSteps.includes("step4") ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </div>

        <div
          className={`transition-all text-sm font-regular duration-300 overflow-hidden ${
            openSteps.includes("step4")
              ? "h-auto opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <p className="text-gray-700 font-medium uppercase mb-2">
            Certifications — what this means
          </p>
          <div className="border rounded-lg p-2 text-[#D48C15]">
            <span className="font-medium">Important:</span> We ask for
            certifications{" "}
            <span className="font-medium">expected from your research</span> —
            meaning which certs your target buyers typically require. This is
            NOT about what certs you currently hold. It's a filter for buyer
            matching.
          </div>
          <p className="mt-4">
            <span className="font-medium">
              Select certs your buyers care about.{" "}
            </span>
            If you're selling to US supplement brands, they'll expect GMP and
            USDA Organic. If you're selling into Germany, they'll want EU
            Organic or FSSC 22000. Selecting these surfaces buyers who require
            exactly that.
          </p>
          <p className="mt-4">
            <span className="font-medium">Don't select everything.</span>
            Over-selecting certs narrows your buyer pool unnecessarily. If
            you're not sure which certs your buyers need, start with the 2–3
            most common for your industry and adjust after seeing your first
            report.
          </p>
          <p className="mt-4">
            <span className="font-medium">
              Use "Other" for specialist certs.{" "}
            </span>
            If your industry uses certs not in the list — like FSMA, JAS, TGA,
            or a country-specific standard — type it in the "Other" field with
            the full cert name and issuing body.
          </p>

          <hr className="border-0 bg-gray-200 h-[1px] my-4" />
          <p className="text-gray-700 font-medium uppercase mb-2">
            Goals — why this matters
          </p>
          <p className="mb-2">
            <span className="font-medium">
              Goals shape the report sections we prioritise{" "}
            </span>
            Selecting "Find export buyers" emphasises the buyer list. "Pricing
            intelligence" weights the price analysis. "Competitor analysis"
            expands the competitor map. You can select multiple.
          </p>

          <p className="mt-4">
            <span className="font-medium">
              Goals also shape your email sequence.{" "}
            </span>
            A "Find distributors" goal generates a different outreach tone and
            CTA than "Find export buyers". The AI adapts the copy based on what
            you're trying to achieve.
          </p>

          <div className="border border-l-3 border-[#2E7D32] bg-[#e2ffe3] rounded-lg p-2 mt-4">
            <span className="font-medium text-[#2E7D32]">
              Good goal combination:
            </span>
             "Find export buyers" + "Discover new markets" + "Pricing intelligence" — gives you a balanced report with buyers, market scores, and price positioning in one run.
          </div>
        </div>

        {/* step5 */}
        <div
          className="p-2 mt-6 rounded bg-[#E0F5FF] hover:bg-[#d4f1ff] cursor-pointer flex justify-between items-center"
          onClick={() => toggleStep("step5")}
        >
          <div>
            <p className="text-sm font-medium">What are queries?</p>
            <p className="text-xs font-regular">
              How credits work and what uses them
            </p>
          </div>
          <span
            className={`text-lg transition-transform duration-300 ${
              openSteps.includes("step5") ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </div>

        <div
          className={`transition-all text-sm font-regular duration-300 overflow-hidden ${
            openSteps.includes("step5")
              ? "h-auto opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <p>
            <span className="font-medium">
              1 query = 1 product analysis run.
            </span>
            Each time you run intelligence on a product, it uses 1 query. If you
            analyse 3 products in one run, it costs 3 queries. The setup itself
            — including this onboarding — is completely free.
          </p>
          <p className="mt-4">
            <span className="font-medium">Viewing reports is always free.</span>
            Once a report is generated, you can open, re-read, share, and
            revisit it as many times as you want. Queries are only used when the
            engine runs.
          </p>
          <p className="mt-4">
            <span className="font-medium">Re-runs cost a query. </span>
            If market conditions change or you want fresh buyer data, you can
            re-run any product. Each re-run costs 1 query. Your query balance
            renews monthly on your plan.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-2 text-center rounded-lg bg-gray-100">
              <p className="text-base font-medium">Scout</p>
              <p className="text-xl font-medium">100 Q</p>
              <p className="text-xs font-regular">per month</p>
            </div>
            <div className="p-2 text-center rounded-lg bg-[#E0F5FF]">
              <p className="text-base font-medium">Venture</p>
              <p className="text-xl font-medium">300 Q</p>
              <p className="text-xs font-regular">per month · recommended</p>
            </div>
            <div className="p-2 text-center rounded-lg bg-gray-100">
              <p className="text-base font-medium">Apex</p>
              <p className="text-xl font-medium">1000 Q</p>
              <p className="text-xs font-regular">per month</p>
            </div>
          </div>

          <div className="border border-l-3 border-[#0284C7] bg-gray-100 rounded-lg p-2 mt-4">
            <span className="font-medium">Need more queries mid-month?</span>{" "}
            You can buy 20 extra queries for $9 at any time without changing
            your plan.
          </div>
        </div>

        {/* step6 */}

        <div
          className="p-2 mt-6 rounded bg-[#E0F5FF] hover:bg-[#d4f1ff] cursor-pointer flex justify-between items-center"
          onClick={() => toggleStep("step6")}
        >
          <div>
            <p className="text-sm font-medium">Common questions</p>
            <p className="text-xs font-regular">
              Things most new users ask before their first run
            </p>
          </div>
          <span
            className={`text-lg transition-transform duration-300 ${
              openSteps.includes("step6") ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </div>

        <div
          className={`transition-all text-sm font-regular duration-300 overflow-hidden ${
            openSteps.includes("step6")
              ? "h-auto opacity-100 mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          <p>
            <span className="font-medium">
              Can I change my answers after setup?
            </span>
            Yes. Everything you enter here can be updated from your profile
            settings at any time. Your next intelligence run will use the
            updated profile.
          </p>
          <p className="mt-4">
            <span className="font-medium">
              What if I don't have a website yet?
            </span>
            That's fine — the website field is optional. You can add products
            manually or upload a CSV in the next step. The website just speeds
            up product extraction.
          </p>
          <p className="mt-4">
            <span className="font-medium">
              What if my product doesn't fit any category?
            </span>
            Choose the closest match and describe your product accurately in the
            text field. Our engine uses the description more than the category
            for matching. You can also use the "Other" option for industry.
          </p>

          <p className="mt-4">
            <span className="font-medium">
              I sell both B2B and B2C — which do I choose?
            </span>
            Select "Both". We'll surface buyers from both segments and let you
            filter in the report. If the majority of your revenue is B2B, lean
            towards B2B — it affects the outreach templates most.
          </p>
          <p className="mt-4">
            <span className="font-medium">
              What if I don't hold any certifications yet?
            </span>
            Select the certifications your target buyers typically require — not
            what you currently hold. This tells us what market segment you're
            targeting. Your report will show you which certs would unlock the
            most buyers.
          </p>
          <p className="mt-4">
            <span className="font-medium">How accurate is the buyer data?</span>
            Buyer data is sourced from live B2B trade portals, customs records,
            and verified databases. Contact details (email, LinkedIn) are
            available on Venture+ plan. Company profiles and match scores are
            available on all plans.
          </p>
          <p className="mt-4">
            <span className="font-medium">
              Can I run reports for multiple products at once?
            </span>
            Yes. You can add up to 10 products and run them together. Each
            product uses 1 query. You'll get individual reports per product plus
            a combined opportunity report covering all of them.
          </p>
        </div>
      </div>
    </div>
  );
};
export default NeedHelp;
