import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function AiGenerated({ ai_insightsData }) {
  return (
    <>
      <div className="text-13 text-[#5F6368] mt-6">AI - GENERATED INSIGHTS</div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
        {ai_insightsData?.map((item, index) => {
          return (
            <div
              className="bg-white shadow-sm sm:rounded-lg card-hover"
              key={index}
            >
              <div className="p-6">
                <h3 className="text-base font-medium text-[#3C4D4D]">
                  {item?.country} demand for {item?.product_name}
                </h3>
                <div className="mt-2 max-w-xl text-13 text-[#5F6368]">
                  <p>{item?.urgent_note}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
