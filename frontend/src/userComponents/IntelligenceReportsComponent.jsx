import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const intelligenceReports_data = [
  {
    txt1: "Organic Turmeric Powder — USA Market Intelligence",
    txt2: "✓ Complete",
    txt3: "🇺🇸 USA",
    txt4: "Market Demand + Keywords",
    txt5: "March 11, 2026 · 2 hrs ago",
    txt6: "91/100",
    txt7: "34 keywords",
    txt8: "5 buyer segments",
    txt9: "Demand up 18% YoY",
    txt10:
      "Strong Q2 opportunity for contract manufacturers in California and Texas.",
    txt11: "Score 91",
    txt12: "34 keywords",
    txt13: "200+ buyers",
    txt14: "8 segments",
  },
  {
    txt1: "Organic Turmeric Powder — USA Market Intelligence",
    txt2: "✓ Complete",
    txt3: "🇺🇸 USA",
    txt4: "Market Demand + Keywords",
    txt5: "March 11, 2026 · 2 hrs ago",
    txt6: "91/100",
    txt7: "34 keywords",
    txt8: "5 buyer segments",
    txt9: "Demand up 18% YoY",
    txt10:
      "Strong Q2 opportunity for contract manufacturers in California and Texas.",
    txt11: "Score 91",
    txt12: "34 keywords",
    txt13: "200+ buyers",
    txt14: "8 segments",
  },
];

const IntelligenceReportsComponent = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Intelligence Reports</h1>
        <div className="flex gap-4">
          <div className="grid grid-cols-1">
            <select className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#0284C7] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6">
              <option>All Products</option>
              <option>Turmeric</option>
              <option>Ashwagandha</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </div>
          <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
            ⚡ New Run
          </button>
        </div>
      </div>
      <p className="my-4 text-sm text-[#5F6368]">
        2 completed reports · Viewing reports is always free
      </p>

      <div className="flex flex-col gap-3">
        {intelligenceReports_data?.map((item, index) => {
          return (
            <div
              className="border border-l-4 border-[#2E7D32] bg-white p-3 rounded-lg flex justify-between card-hover"
              key={index}
            >
              <div className="flex gap-3 items-center">
                <div className="border border-gray-500 h-10 w-10 rounded-lg flex justify-center items-center">
                  <Squares2X2Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-medium text-[#000000]">
                    {item.txt1}
                  </p>
                  <p className="flex items-center gap-2 text-xs font-regular text-[#5F6368] mt-2">
                    <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                      {item.txt2}
                    </span>
                    <span>{item.txt3}</span>
                    <span>{item.txt4}</span>
                    <span>{item.txt5}</span>
                  </p>
                  <p className="flex gap-2 text-xs font-regular text-[#5F6368] mt-2">
                    <span>Score {item.txt6} ·</span>
                    <span>{item.txt7} ·</span>
                    <span>{item.txt8} ·</span>
                    <span>{item.txt9} ·</span>
                    <span>{item.txt10}</span>
                  </p>
                  <p className="flex gap-2 mt-2">
                    <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                      {item.txt11}
                    </span>
                    <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#E0F5FF] text-[#0284C7]">
                      {item.txt12}
                    </span>
                    <span className="font-medium text-xs pt-1 px-2 rounded-2xl bg-gray-100 text-[#000000]">
                      {item.txt13}
                    </span>
                    <span className="font-medium text-xs pt-1 px-2 rounded-2xl bg-gray-100 text-[#000000]">
                      {item.txt14}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
                  Open Report
                </button>
                <button className="border border-gray-500 py-1 px-3 rounded-lg font-medium text-sm">
                  ↓ PDF 🔒
                </button>
                <button className="hover:bg-gray-100 py-1 px-3 rounded-lg font-medium text-sm">
                  ↗ Share
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-dashed border-gray-300 bg-white rounded-lg mt-6 flex justify-center items-center py-8">
        <div className="flex flex-col gap-2 items-center">
          <div className="border border-gray-500 h-10 w-10 rounded-lg flex justify-center items-center">
            <Squares2X2Icon className="h-6 w-6" />
          </div>
          <p className="text-base text-[#000000] font-medium">Run more intelligence analyses</p>
          <p className="text-sm text-[#5F6368] font-regular">
            Each run generates a full report saved here. You have 73 queries
            remaining.
          </p>
          <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white cursor-pointer">
            Start New Run →
          </button>
        </div>
      </div>
    </>
  );
};
export default IntelligenceReportsComponent;
