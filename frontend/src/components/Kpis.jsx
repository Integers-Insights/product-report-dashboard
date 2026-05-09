// import {
//     ChartBarSquareIcon,
//     ArrowRightStartOnRectangleIcon,
//     EnvelopeOpenIcon,
//     ChatBubbleOvalLeftEllipsisIcon,
//     CubeIcon,
//     ClockIcon,
//     CalendarDaysIcon,
//     ClipboardDocumentCheckIcon,
//     CalendarIcon,
// } from "@heroicons/react/24/outline";


// const kpiData = [
//     {
//         id: 1,
//         title: "28–35%",
//         txt1: "Cold email open rate",
//         txt2: "B2B supplement buyers · Cert mention in subject line performs best"
//     },
//     {
//         id: 2,
//         title: "8–12%",
//         txt1: "Reply rate (3-step sequence)",
//         txt2: "Benchmark for certified ingredient suppliers with social proof in Email 2"
//     },
//     {
//         id: 3,
//         title: "18–26%",
//         txt1: "Free sample → qualified lead",
//         txt2: "Conversion rate when a sample is offered in Email 3 — strong close signal"
//     },
//     {
//         id: 4,
//         title: "45 days",
//         txt1: "Avg deal cycle",
//         txt2: "First contact to PO. US is faster (~38d), Germany slower (~52d) due to quality review"
//     },
//     {
//         id: 5,
//         title: "Q4 + Jan",
//         txt1: "Peak sourcing window",
//         txt2: "US + Germany begin procurement planning Oct–Nov. January is highest RFQ volume month globally"
//     },
//     {
//         id: 6,
//         title: "62–70%",
//         txt1: "RFQ response conversion",
//         txt2: "Certified exporters responding within 24 hrs with COA get significantly higher close rates"
//     }
// ]

// const icons = [
//     EnvelopeOpenIcon,
//     ChatBubbleOvalLeftEllipsisIcon,
//     CubeIcon,
//     ClockIcon,
//     CalendarDaysIcon,
//     ClipboardDocumentCheckIcon,
//     CalendarIcon,
// ];

// const Kpis = () => {
//     return (
//         <>
//             <div className="flex items-center">
//                 <div>
//                     <h2 className="text-[#000000] text-base font-medium">KPIs & Benchmarks</h2>
//                     <p className="text-[#5F6368] text-13 font-regular">Targets for your outreach — based on GMP + Organic certified Indian exporters at mid-range pricing</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-3 gap-6 mt-6">
//                 {kpiData?.map((item, index) => {

//                     const Icon = icons[index];
//                     return (
//                         <div className="py-3 px-5 rounded-lg border border-[#E6E6E6] flex flex-col gap-1 items-center card-hover" key={item.id}>
//                             <div className="h-7.5 w-7.5"><Icon className="h-7.5 w-7.5" /></div>
//                             <div className="text-xl font-semibold text-[#000000]">{item.title}</div>
//                             <div className="text-sm font-medium text-[#000000]">{item.txt1}</div>
//                             <div className="text-xs font-light text-[#5F6368]">{item.txt2}</div>
//                         </div>
//                     )
//                 })}
//             </div>

//             <div className="mt-6">
//                 <h2 className="text-[#000000] text-sm font-medium">Recommended next actions</h2>
//                 <div className="grid grid-cols-3 gap-6 mt-1">
//                     <div className="card-hover border border-[#A5F7A9] flex flex-col gap-1.5 rounded-lg p-3 bg-[#F1FEF2]">
//                         <div className="flex gap-3 items-center text-[#2E7D32]">
//                             <span><ClockIcon className="h-5 w-5" /></span>
//                             <span className="text-base font-medium">Do this week</span>
//                         </div>
//                         <div className="text-[#1E1E1E] text-13 font-regular">Contact BioHerb GmbH Germany. The cert gap window is open now. Use Email 1 from the Marketing Kit. Target score: 88.</div>
//                     </div>

//                     <div className="card-hover border border-[#96DBFF] flex flex-col gap-1.5 rounded-lg p-3 bg-[#EDF9FF]">
//                         <div className="flex gap-3 items-center text-[#008ACB]">
//                             <span><CalendarIcon className="h-5 w-5" /></span>
//                             <span className="text-base font-medium">This month</span>
//                         </div>
//                         <div className="text-[#1E1E1E] text-13 font-regular">Run the 3-email sequence to your top 20 US buyers. Q2 sourcing window opens in April — start building pipeline now.</div>
//                     </div>

//                     <div className="card-hover border border-[#D9D9D9] flex flex-col gap-1.5 rounded-lg p-3 bg-[#F3F3F3]">
//                         <div className="flex gap-3 items-center">
//                             <span><CalendarDaysIcon className="h-5 w-5" /></span>
//                             <span className="text-base font-medium">Q2 2026</span>
//                         </div>
//                         <div className="text-[#1E1E1E] text-13 font-regular">Develop water-soluble turmeric variant. $14–22/kg, zero direct competitors, beverage brands actively sourcing.</div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };
// export default Kpis;