import {
  ArrowRightStartOnRectangleIcon,
  BuildingStorefrontIcon,
  LanguageIcon,
  BriefcaseIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  UserGroupIcon,
  SwatchIcon,
  PuzzlePieceIcon,
  ClockIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// const cardData = [
//   {
//     id: 1,
//     title: "MARKET DEMAND",
//     txt1: "9/10",
//     txt2: "↑18% YoY · Anti-inflammatory trend",
//   },
//   {
//     id: 2,
//     title: "Keywords Found",
//     txt1: "34",
//     txt2: "↑18% YoY · Anti-inflammatory trend",
//   },
//   {
//     id: 3,
//     title: "Competition",
//     txt1: "6/10",
//     txt2: "Cert gap open · 3 direct competitors",
//   },
//   {
//     id: 4,
//     title: "Trade Activity",
//     txt1: "9/10",
//     txt2: "18,400 MT US import · India 64%",
//   },
//   {
//     id: 5,
//     title: "PRICE FIT",
//     txt1: "8/10",
//     txt2: "$8.50 vs $8–16 market · +35% organic",
//   },
//   {
//     id: 6,
//     title: "Buyer Availability",
//     txt1: "8/10",
//     txt2: "200+ matched · 3 RFQs open now",
//   },
//   {
//     id: 7,
//     title: "VARIANTS FOUND",
//     txt1: "5",
//     txt2: "The demand is rising for these variants",
//   },
//   {
//     id: 8,
//     title: "RFQs found",
//     txt1: "3",
//     txt2: "Customers are demanding this product",
//   },
// ];

const icons = [
  BuildingStorefrontIcon,
  LanguageIcon,
  BriefcaseIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  UserGroupIcon,
  SwatchIcon,
  PuzzlePieceIcon,
];

const icon = [ClockIcon, CalendarIcon, CalendarDaysIcon];

const Overview = ({ overview_data, urgent_note_data, actions_data }) => {
  // console.log("u: ",urgent_note_data);


  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Opportunity Summary
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            6 intelligence modules run · Personalised to your certifications and
            pricing
          </p>
        </div>
        <div className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl">
          Score: 82/100
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 mt-4">
        {overview_data?.map((item, index) => {
          const Icon = icons[index];
          const score = Math.max(0, Math.min(10, item.score ?? 0));

          const textColor =
            score >= 7
              ? "text-[#009A3F]" // green
              : score >= 3
                ? "text-[#D48C15]" // yellow
                : "text-[#C62828]"; // red

          return (
            <div
              className="border border-[#E6E6E6] p-3 rounded-lg card-hover"
              key={index}
            >
              <div className="h-7.5 w-7.5 bg-[#E0F5FF] flex justify-center items-center rounded">
                <Icon className="w-5 h-5 text-[#0284C7]" />
              </div>
              <div className="text-[#000000] font-light text-xs mt-1.5">
                {item.label}
              </div>
              <div className={`${textColor} font-semibold text-xl`}>
                {score}
              </div>
              <div className="text-[#5F6368] font-light text-xs">
                {item.sublabel}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2.5 mt-6 p-3 border border-[#ADE0AF] rounded-lg">
        <div>
          <div className="h-7.5 w-7.5 bg-[#CCFFCF] flex justify-center items-center rounded">
            <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-[#2E7D32] flex-shrink-0" />
          </div>
        </div>
        <div className="text-[#5F6368] text-13 font-regular">
          {urgent_note_data?.message || ""}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* {actions_data.length ? (
          actions_data?.map((item, index) => {
            console.log("actions_data: ", actions_data);

            const Icon = icon[index];
            return (
              <div
                className="card-hover border border-[#A5F7A9] flex flex-col gap-1.5 rounded-lg p-3 bg-[#F1FEF2]"
                key={index}
              >
                <div className="flex gap-3 items-center text-[#2E7D32]">
                  <span>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-base font-medium">{item.timing}</span>
                </div>
                <div className="text-[#1E1E1E] text-13 font-regular">
                  {item.body}
                </div>
              </div>
            );
          })
        ) : (
          <div className="border rounded-lg border-[#E6E6E6] p-3  text-center flex justify-between col-span-3">
            <p className="blur-sm">Lorem ipsum dolor sit amet.</p>
            <div className="blur-sm">$5–$9/kg</div>
            <div className="blur-sm pl-10">30–38%</div>
            <div className="text-sm font-medium">
              <button className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-1 whitespace-nowrap">
                🔒 Upgrade your plan +
              </button>
            </div>
          </div>
        )} */}

        {actions_data?.masked ? (
          <div className="text-center">
            <button className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-3 py-1" onClick={()=>navigate("/pricing")}>
              🔒 {actions_data.message}
            </button>
          </div>
        ) : Array.isArray(actions_data) && actions_data.length > 0 ? (
          actions_data.map((item, index) => {
            const Icon = icon[index];

            return (
              <div
                key={index}
                className="card-hover border border-[#A5F7A9] flex flex-col gap-1.5 rounded-lg p-3 bg-[#F1FEF2]"
              >
                <div className="flex gap-3 items-center text-[#2E7D32]">
                  <Icon className="h-5 w-5" />
                  <span className="text-base font-medium">{item.timing}</span>
                </div>

                <div className="text-[#1E1E1E] text-13">{item.body}</div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-end-3">No Data</p>
        )}

        {/* <div className="card-hover border border-[#96DBFF] flex flex-col gap-1.5 rounded-lg p-3 bg-[#EDF9FF]">
          <div className="flex gap-3 items-center text-[#008ACB]">
            <span>
              <CalendarIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-medium">This month</span>
          </div>
          <div className="text-[#1E1E1E] text-13 font-regular">
            Run 3-step outreach to top 20 US buyers. Q2 sourcing window opens
            April — pipeline now.
          </div>
        </div>

        <div className="card-hover border border-[#D9D9D9] flex flex-col gap-1.5 rounded-lg p-3 bg-[#F3F3F3]">
          <div className="flex gap-3 items-center">
            <span>
              <CalendarDaysIcon className="h-5 w-5" />
            </span>
            <span className="text-base font-medium">This quarter</span>
          </div>
          <div className="text-[#1E1E1E] text-13 font-regular">
            Develop water-soluble variant ($14–22/kg). No competitors present.
            Gap confirmed.
          </div>
        </div> */}
      </div>
    </>
  );
};
export default Overview;
