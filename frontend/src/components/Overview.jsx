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

const Overview = ({ overview_data, urgent_note_data, actions_data,safeValue }) => {
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
          Score: {safeValue || 0}/100
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 mt-4">
        {overview_data?.map((item, index) => {
          const Icon = icons[index];
          const score = Math.max(0, Math.min(10, item.score ?? 0));

          const textColor =
            score >= 7
              ? "text-[#009A3F]"
              : score >= 3
                ? "text-[#D48C15]"
                : "text-[#C62828]";

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

      {/* <div className="flex gap-2.5 mt-6 p-3 border border-[#ADE0AF] rounded-lg">
        <div>
          <div className="h-7.5 w-7.5 bg-[#CCFFCF] flex justify-center items-center rounded">
            <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-[#2E7D32] flex-shrink-0" />
          </div>
        </div>
        <div className="text-[#5F6368] text-13 font-regular">
          {urgent_note_data?.message || ""}
        </div>
      </div> */}

      <div className="grid grid-cols-3 gap-6 mt-6">
        {actions_data?.masked ? (
          <div className="text-center">
            <button
              className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-3 py-1"
              onClick={() => navigate("/pricing")}
            >
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
      </div>
    </>
  );
};
export default Overview;
