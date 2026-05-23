import {
  FireIcon,
  InformationCircleIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
const Keywords = ({
  high_volume_buyer_intent_data,
  low_competition_gaps_data,
  multilingual_data,
}) => {
  return (
    <>
      <div className="mt-6">
        <div className="border border-[#E6E6E6] rounded-t-lg flex justify-between p-3 bg-[#EDF9FF]">
          <p className="text-[#000000] font-medium text-sm flex items-center gap-2">
            <FireIcon className="h-5 w-5" /> High-Volume Buyer Intent
          </p>
          <p className="text-[#5F6368] font-regular text-sm">
            {high_volume_buyer_intent_data?.length || 0} keywords · use in email subjects and LinkedIn profiles
          </p>
        </div>
        <div className="p-3 flex flex-wrap gap-3 border border-t-0 rounded-b-lg border-[#E6E6E6]">
          {high_volume_buyer_intent_data?.map((itm, i) => {
            return (
              <div
                className="border border-[#E6E6E6] bg-[#EDF9FF] hover:bg-[#E0F5FF] transition-all duration-200 flex gap-2 items-center px-3 py-1.5 rounded-full text-sm font-medium"
                key={i}
              >
                <div className="font-regular">{itm.keyword}</div>
                <div className="rounded-2xl py-0.5 px-1 bg-[#EDF9FF] text-[#008ACB]">
                  {itm.search_volume}
                </div>
                <div
                  className={`rounded-2xl py-0.5 px-1 
                    ${itm.gap === "High" ? "text-[#2E7D32] bg-[#F1FEF2]" : itm.gap === "Med" ? "text-[#D48C15] bg-[#FFF8EE]" : "text-[#C62828] bg-[#FFC4C4]"}
                    `}
                >
                  {itm.gap}
                </div>

                {itm.gap === "High" ? (
                  <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">
                    Gap ↑
                  </div>
                ) : itm.gap === "Med" ? (
                  ""
                ) : (
                  <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">
                    Gap ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="border border-[#E6E6E6] rounded-t-lg flex justify-between p-3 bg-[#EDF9FF]">
          <p className="text-[#000000] font-medium text-sm flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5" /> Low-Competition Gaps —
            competitors not ranking
          </p>
          <p className="text-[#5F6368] font-regular text-sm">
            {low_competition_gaps_data?.length || 0} keywords · highest conversion potential
          </p>
        </div>
        <div className="p-3 flex flex-wrap gap-3 border border-t-0 rounded-b-lg border-[#E6E6E6]">
          {low_competition_gaps_data?.map((itm, i) => {
            return (
              <div
                className="border border-[#E6E6E6] bg-[#EDF9FF] hover:bg-[#E0F5FF] transition-all duration-200 flex gap-2 items-center px-3 py-1.5 rounded-full text-sm font-medium"
                key={i}
              >
                <div className="font-regular">{itm.keyword}</div>
                <div className="rounded-2xl py-0.5 px-1 bg-[#EDF9FF] text-[#008ACB]">
                  {itm.search_volume}
                </div>
                <div
                  className={`rounded-2xl py-0.5 px-1 
                    ${itm.gap === "High" ? "text-[#2E7D32] bg-[#F1FEF2]" : itm.gap === "Med" ? "text-[#D48C15] bg-[#FFF8EE]" : "text-[#C62828] bg-[#FFC4C4]"}
                    `}
                >
                  {itm.gap}
                </div>
                {itm.gap === "High" ? (
                  <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">
                    Gap ↑
                  </div>
                ) : itm.gap === "Med" ? (
                  ""
                ) : (
                  <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">
                    Gap ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="border border-[#E6E6E6] rounded-t-lg p-3 bg-[#EDF9FF]">
          <p className="text-[#000000] font-medium text-sm flex items-center gap-2">
            <DocumentDuplicateIcon className="h-5 w-5" /> Multilingual
          </p>
        </div>
        <div className="p-3 flex flex-wrap gap-3 border border-t-0 rounded-b-lg border-[#E6E6E6]">
          {multilingual_data?.map((itm, i) => {
            return (
              <div
                className="border border-[#E6E6E6] bg-[#EDF9FF] hover:bg-[#E0F5FF] transition-all duration-200 flex gap-2 items-center px-3 py-1.5 rounded-full text-sm font-medium"
                key={i}
              >
                <div className="font-regular">{itm.keyword}</div>
                <div className="rounded-2xl py-0.5 px-1 bg-[#EDF9FF] text-[#008ACB]">
                  {itm.search_volume}
                </div>
                <div
                  className={`rounded-2xl py-0.5 px-1 
                    ${itm.gap === "High" ? "text-[#2E7D32] bg-[#F1FEF2]" : itm.gap === "Med" ? "text-[#D48C15] bg-[#FFF8EE]" : "text-[#C62828] bg-[#FFC4C4]"}
                    `}
                >
                  {itm.gap}
                </div>
                {itm.gap === "High" ? (
                  <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">
                    Gap ↑
                  </div>
                ) : itm.gap === "Med" ? (
                  ""
                ) : (
                  <div className="rounded-2xl py-0.5 px-1 bg-[#0284C7] text-white">
                    Gap ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Keywords;
