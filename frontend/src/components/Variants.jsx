import {
  BuildingStorefrontIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const MaskedValue = ({ value, fallback = "--" }) => {
  if (typeof value === "string" && value.toLowerCase().includes("upgrade")) {
    return (
      <span className="inline-flex items-center gap-1 text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-0.5 text-xs font-medium whitespace-nowrap">
        🔒 Upgrade to unlock
      </span>
    );
  }
  return <>{value ?? fallback}</>;
};

const Variants = ({ variants_data }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Product Variants & Formats
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            What buyers are actually sourcing · Your current offering vs market
            demand
          </p>
        </div>
        {/* <div className="flex gap-2 items-center">
          <div className="bg-[#2E7D32] h-2 w-2 rounded-xs"></div>
          <p className="text-xs text-[#5F6368] font-regular">Your product</p>
          <div className="bg-[#008ACB] h-2 w-2 rounded-xs"></div>
          <p className="text-xs text-[#5F6368] font-regular">Gap</p>
          <div className="bg-[#A9B3B1] h-2 w-2 rounded-xs"></div>
          <p className="text-xs text-[#5F6368] font-regular">In market</p>
          <div className="bg-[#D48C15] h-2 w-2 rounded-xs"></div>
          <p className="text-xs text-[#5F6368] font-regular">Emerging</p>
        </div> */}
      </div>
      <div className="flex gap-6 bg-[#F3F3F3] p-3 rounded-lg my-6">
        <span className="text-sm font-medium text-[#000000]">
          Every variant shows:
        </span>
        <span className="text-sm font-regular text-[#5F6368]">Key spec</span>
        <span className="text-sm font-regular text-[#5F6368]">Price range</span>
        <span className="text-sm font-regular text-[#5F6368]">
          Min. order qty
        </span>
        <span className="text-sm font-regular text-[#5F6368]">
          Buyer demand
        </span>
        <span className="text-sm font-regular text-[#5F6368]">
          Matched buyers
        </span>
        <span className="text-sm font-regular text-[#5F6368]">Lead time</span>
        <span className="text-sm font-regular text-[#5F6368]">
          Opportunity score
        </span>
        <span className="text-sm font-regular text-[#5F6368]">
          Analyst note
        </span>
      </div>
      <div className="flex flex-col gap-6">
        {variants_data?.map((item, index) => {
          if (item?.masked) {
            return (
              <div
              className={`border border-l-4 p-4 rounded-lg card-hover `}
              key={index}
            >
              <div className="flex justify-between">
                <div className="flex gap-6 items-center">
                  <div className="text-sm text-[#000000] font-medium blur-sm">
                    Lorem ipsum dolor sit
                  </div>
                  <div
                    className="text-sm font-medium px-3 py-0.5 rounded-2xl blur-sm"
                  >
                    Lorem, ipsum.
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold text-center blur-sm">
                    Lorem, ipsum dolor.
                  </p>
                  <p className="text-xs font-medium text-[#5F6368] blur-sm">OPP.</p>
                </div>
              </div>
              <div className="border border-[#E6E6E6] grid grid-cols-3 mt-6 mb-3 rounded-lg">
                <div className="border border-[#E6E6E6] p-2 rounded-tl-lg">
                  <p className="text-[#5F6368] font-medium text-sm blur-sm">Key spec</p>
                  <p className="text-[#000000] font-regular text-sm blur-sm">
                    Lorem, ipsum.
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2">
                  <p className="text-[#5F6368] font-medium text-sm blur-sm">
                    Price range
                  </p>
                  <p className="text-[#000000] font-regular text-sm blur-sm">
                    Lorem, ipsum.
                    {/* <MaskedValue value={item?.price_range} /> */}
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2 rounded-tr-lg">
                  <p className="text-[#5F6368] font-medium text-sm blur-sm">
                    Min. order qty
                  </p>
                  <p className="text-[#000000] font-regular text-sm blur-sm">
                    Lorem, ipsum dolor.
                    {/* <MaskedValue value={item?.moq} /> */}
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2 rounded-bl-lg">
                  <p className="text-[#5F6368] font-medium text-sm blur-sm">
                    Buyer demand
                  </p>
                  <p className="text-[#000000] font-regular text-sm blur-sm">
                    Lorem, ipsum dolor.
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2">
                  <p className="text-[#5F6368] font-medium text-sm blur-sm">
                    Matched buyers
                  </p>
                  <p className="text-[#000000] font-regular text-sm blur-sm">
                    Lorem ipsum dolor sit.
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2 rounded-br-lg">
                  <p className="text-[#5F6368] font-medium text-sm blur-sm">
                    Lead time
                  </p>
                  <p className="text-[#000000] font-regular text-sm blur-sm">
                    Lorem, ipsum dolor.
                  </p>
                </div>
              </div>
              <hr className="bg-[#E6E6E6] h-[1px] border-0 my-3" />
              <p className="text-[#5F6368] font-regular text-sm blur-sm">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis consequatur possimus ex ea optio, rerum explicabo aspernatur placeat autem cum, aliquam incidunt reprehenderit minima magnam iste delectus officia. Necessitatibus, deleniti!
              </p>
            </div>
            );
          }

          const score = Math.max(0, Math.min(10, item?.opportunity_score ?? 0));

          const borderColor =
            score >= 7
              ? "border-[#009A3F]"
              : score >= 3
                ? "border-[#D48C15]"
                : "border-[#C62828]";

          const textColor =
            score >= 7
              ? "text-[#009A3F]"
              : score >= 3
                ? "text-[#D48C15]"
                : "text-[#C62828]";

          const bgColor =
            score >= 7
              ? "bg-[#CCFFCF]"
              : score >= 3
                ? "bg-[#FFE9C5]"
                : "bg-[#FFC4C4]";

          return (
            <div
              className={`border border-l-4 ${borderColor} p-4 rounded-lg card-hover `}
              key={index}
            >
              <div className="flex justify-between">
                <div className="flex gap-6 items-center">
                  <div className="text-sm text-[#000000] font-medium">
                    {item?.variant_name ?? 0}
                  </div>
                  <div
                    className={`text-sm ${textColor} font-medium px-3 py-0.5 rounded-2xl ${bgColor}`}
                  >
                    {item?.tag ?? 0}
                  </div>
                </div>
                <div>
                  <p className={`text-xl font-bold ${textColor} text-center`}>
                    {item?.opportunity_score ?? 0}
                  </p>
                  <p className="text-xs font-medium text-[#5F6368]">OPP.</p>
                </div>
              </div>
              <div className="border border-[#E6E6E6] grid grid-cols-3 mt-6 mb-3 rounded-lg">
                <div className="border border-[#E6E6E6] p-2 rounded-tl-lg">
                  <p className="text-[#5F6368] font-medium text-sm">Key spec</p>
                  <p className="text-[#000000] font-regular text-sm">
                    {item?.key_spec ?? "--"}
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2">
                  <p className="text-[#5F6368] font-medium text-sm">
                    Price range
                  </p>
                  <p className="text-[#000000] font-regular text-sm">
                    {item?.price_range ?? "--"}
                    {/* <MaskedValue value={item?.price_range} /> */}
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2 rounded-tr-lg">
                  <p className="text-[#5F6368] font-medium text-sm">
                    Min. order qty
                  </p>
                  <p className="text-[#000000] font-regular text-sm">
                    {item?.moq ?? "--"}
                    {/* <MaskedValue value={item?.moq} /> */}
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2 rounded-bl-lg">
                  <p className="text-[#5F6368] font-medium text-sm">
                    Buyer demand
                  </p>
                  <p className="text-[#000000] font-regular text-sm">
                    {item?.buyer_demand ?? "--"}
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2">
                  <p className="text-[#5F6368] font-medium text-sm">
                    Matched buyers
                  </p>
                  <p className="text-[#000000] font-regular text-sm">
                    {item?.matched_buyers ?? "--"}
                  </p>
                </div>
                <div className="border border-[#E6E6E6] p-2 rounded-br-lg">
                  <p className="text-[#5F6368] font-medium text-sm">
                    Lead time
                  </p>
                  <p className="text-[#000000] font-regular text-sm">
                    {item?.lead_time ?? "--"}
                  </p>
                </div>
              </div>
              <hr className="bg-[#E6E6E6] h-[1px] border-0 my-3" />
              <p className="text-[#5F6368] font-regular text-sm">
                {item?.analysis_note ?? "--"}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Variants;
