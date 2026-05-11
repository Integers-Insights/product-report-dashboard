import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function AiGenerated({ ai_insightsData }) {
  return (
    <>
      <div className="text-13 text-[#5F6368] mt-6">AI - GENERATED INSIGHTS</div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-4">
        {/* 1 */}

        {ai_insightsData?.map((item, index) => {
          return (
            <div className="bg-white shadow-sm sm:rounded-lg card-hover" key={index}>
              <div className="p-6">
                <h3 className="text-base font-medium text-[#3C4D4D]">
                  {item?.country} demand for {item?.product_name}
                </h3>
                <div className="mt-2 max-w-xl text-13 text-[#5F6368]">
                  <p>{item?.urgent_note}</p>
                </div>
                {/* <div className="mt-3 text-xs w-36">
                  <a
                    href="#"
                    className="font-medium text-[#0284C7] hover:text-[#0475ad] flex items-center gap-2"
                  >
                    Analyze US Market
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </a>
                </div> */}
              </div>
            </div>
          );
        })}
        {/* <div className="bg-white shadow-sm sm:rounded-lg card-hover">
                    <div className="p-6">
                        <h3 className="text-base font-medium text-[#3C4D4D]">USA demand for organic turmeric up 18% YoY</h3>
                        <div className="mt-2 max-w-xl text-13 text-[#5F6368]">
                            <p>
                                Anti-inflammatory supplement trends are driving wholesale demand in Q1. Best window to target contract manufacturers in California and Texas before Q2 buying cycle opens.
                            </p>
                        </div>
                        <div className="mt-3 text-xs w-36">
                            <a href="#" className="font-medium text-[#0284C7] hover:text-[#0475ad] flex items-center gap-2">
                                 Analyze US Market
                                 <ArrowTopRightOnSquareIcon className="h-5 w-5"/>
                            </a>
                        </div>
                    </div>
                </div> */}

        {/* 2 */}
        {/* <div className="bg-white shadow-sm sm:rounded-lg card-hover">
          <div className="p-6">
            <h3 className="text-base font-medium text-[#3C4D4D]">
              3 high-intent buyers haven't been contacted yet
            </h3>
            <div className="mt-2 max-w-xl text-13 text-[#5F6368]">
              <p>
                VitaNutrition Labs, Spice Planet USA, and Organic Basics Co.
                match your exact profile. Upgrade to Venture to access contact
                details and start outreach.
              </p>
            </div>
            <div className="mt-3 text-xs w-36">
              <a
                href="#"
                className="font-medium text-[#0284C7] hover:text-[#0475ad] flex items-center gap-2"
              >
                View Buyer List
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div> */}

        {/* 3 */}
        {/* <div className="bg-white shadow-sm sm:rounded-lg card-hover">
          <div className="p-6">
            <h3 className="text-base font-medium text-[#3C4D4D]">
              34 high-volume keywords for your products
            </h3>
            <div className="mt-2 max-w-xl text-13 text-[#5F6368]">
              <p>
                "Bulk turmeric supplier" and "curcumin extract wholesale" have
                4–6K monthly searches in the USA with moderate competition.
                You're not ranking for any of them yet.
              </p>
            </div>
            <div className="mt-3 text-xs w-36">
              <a
                href="#"
                className="font-medium text-[#0284C7] hover:text-[#0475ad] flex items-center gap-2"
              >
                Run Keyword Analysis
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div> */}

        {/* 4 */}
        {/* <div className="bg-white shadow-sm sm:rounded-lg card-hover">
          <div className="p-6">
            <h3 className="text-base font-medium text-[#3C4D4D]">
              Germany shows strong Q2 opportunity for Ashwagandha
            </h3>
            <div className="mt-2 max-w-xl text-13 text-[#5F6368]">
              <p>
                German naturopath and supplement DTC brands are in active
                sourcing mode. Your KSM-66 certified extract is a direct match
                for their procurement criteria.
              </p>
            </div>
            <div className="mt-3 text-xs w-36">
              <a
                href="#"
                className="font-medium text-[#0284C7] hover:text-[#0475ad] flex items-center gap-2"
              >
                See Germany Report
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
