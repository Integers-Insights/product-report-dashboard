import { CheckIcon, BoltIcon } from "@heroicons/react/24/outline";

const stats = [
  {
    title: "Market range",
    price: "$8–16/kg",
    txt1: "Organic certified tier",
  },
  {
    title: "Est. gross margin",
    price: "30–45%",
    txt1: "Strong — cert justified",
  },
  {
    title: "Cert premium",
    price: "+40%",
    txt1: "Over non-organic avg",
  },
];

const icons = [CheckIcon, CheckIcon, BoltIcon];

const tableData = [
  {
    title: "Your quoted price",
    price: "$8.50/kg",
    est: "30–45%",
    txt1: "Competitive — mid of range",
  },
  {
    title: "Organic cert price uplift",
    price: "$+35–60%",
    est: "50–60%",
    txt1: "✓ Well justified",
  },
  {
    title: "Estimated gross margin",
    price: "30–45%",
    est: "32–46%",
    txt1: "✓ Strong",
  },
  {
    title: "Water-soluble variant",
    price: "$14–22/kg",
    est: "35–48%",
    txt1: "⚡ No competitors — margin 50–60%",
  },
  {
    title: "Minimum order (recommended)",
    price: "500 kg",
    est: "<10%",
    txt1: "Matches most buyer RFQ sizes",
  },
];

const card = [
  {
    txt1: "+40%",
    txt2: "GMP certified",
    txt3: "vs uncertified avg",
  },
  {
    txt1: "+60%",
    txt2: "USDA Organic",
    txt3: "vs conventional avg",
  },
  {
    txt1: "40%",
    txt2: "of buyers require certs",
    txt3: "as hard filter",
  },
];

const PriceAnalysis = ({ price_intelligence_data }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Price Analysis
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            Import price bands · Your competitive position · Margin feasibility
            per format
          </p>
        </div>
        <div className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl h-6.5">
          Your position: Strong value
        </div>
      </div>
      <hr className="my-4 bg-[#E6E6E6] h-[1px] border-0" />

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white shadow-sm p-3 border border-[#E6E6E6] card-hover">
          <div className="text-sm font-medium text-[#000000]">Market range</div>
          <div className="text-xl font-semibold text-[#000000] mt-2">
            {price_intelligence_data[0]?.market_range ?? "--"}
          </div>
          <div className="text-sm font-regular text-[#5F6368] mt-1">
            {price_intelligence_data[0]?.market_range_label ?? "--"}
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow-sm p-3 border border-[#E6E6E6] card-hover">
          <div className="text-sm font-medium text-[#000000]">
            Est. gross margin
          </div>
          <div className="text-xl font-semibold text-[#000000] mt-2">
            {price_intelligence_data[0]?.gross_margin ?? "--"}
          </div>
          <div className="text-sm font-regular text-[#5F6368] mt-1">
            {price_intelligence_data[0]?.gross_margin_label ?? "--"}
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow-sm p-3 border border-[#E6E6E6] card-hover">
          <div className="text-sm font-medium text-[#000000]">Cert premium</div>
          <div className="text-xl font-semibold text-[#000000] mt-2">
            {price_intelligence_data[0]?.cert_premium_overall ?? "--"}
          </div>
          <div className="text-sm font-regular text-[#5F6368] mt-1">
            {price_intelligence_data[0]?.cert_premium_label ?? "--"}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-[#5F6368] font-medium mb-2 uppercase">
          Margin analysis
        </p>
        <div className="border-y border-[#E6E6E6] grid grid-cols-4 gap-10 hover:bg-gray-100">
          <div className=" py-3 text-sm font-medium wrap-break-word">
            Variant
          </div>
          <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">
            Market price
          </div>
          <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">
            Margin est.
          </div>
          <div className="py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">
            Position
          </div>
        </div>
        {price_intelligence_data[0]?.variants?.map((item, index) => {
          if (item.masked) {
            return (
              <div
                key={index}
                className="border-b border-[#E6E6E6] py-3  text-center flex justify-between"
              >
                <p className="blur-sm">Lorem ipsum dolor sit amet.</p>
                <div className="blur-sm">Lorem ipsum</div>
                <div className="blur-sm pl-10">Lorem</div>
                <div className="text-sm font-medium">
                  <button className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-1 whitespace-nowrap">
                    🔒 {item.message} +
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              className="border-b border-[#E6E6E6] grid grid-cols-4 gap-10 hover:bg-gray-100"
              key={index}
            >
              <div className=" py-3 text-sm text-[#5F6368] font-regular wrap-break-word">
                {item.variant_name || ""}
              </div>
              <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">
                {item.market_price || ""}
              </div>
              <div className=" py-3 text-center text-sm text-[#000000] font-medium wrap-break-word">
                {item.margin_est || ""}
              </div>
              <div className=" py-3 text-center">
                <span className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl h-6.5 wrap-break-word">
                  {item.position || ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default PriceAnalysis;
