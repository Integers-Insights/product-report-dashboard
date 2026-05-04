import {
  BoltIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import InitialText from "./InitialText";
import Flag from "./Flag";

const tableData = [
  {
    Competitor_txt1: "SpiceGuru International",
    Competitor_txt2: "🇮🇳 India — Rajasthan",
    markets: "🇺🇸 🇩🇪 🇬🇧",
    certifications: ["GMP", "USDA Org"],
    price: "$7–14",
    positioning: "Mid bulk",
    your_edge: "Cert lapse — their buyers now available",
    threat: "⬇ Reduced",
  },
  {
    Competitor_txt1: "OrganicIndia Ltd.",
    Competitor_txt2: "🇮🇳 India — Uttar Pradesh",
    markets: "🇺🇸 🇬🇧 🇸🇬",
    certifications: ["GMP", "USDA Org", "Fair Trade"],
    price: "$10–18",
    positioning: "Premium brand",
    your_edge: "Price advantage at $8.50 vs $10+",
    threat: "High",
  },
  {
    Competitor_txt1: "NatureVit GmbH",
    Competitor_txt2: "🇩🇪 Germany — private label",
    markets: "🇩🇪 🇫🇷",
    certifications: ["EU Organic", "GMP"],
    price: "$13–20",
    positioning: "EU-origin",
    your_edge: "Price: 40% cheaper, USDA cert adds credibility",
    threat: "Medium",
  },
  {
    Competitor_txt1: "Verdure Sciences",
    Competitor_txt2: "🇺🇸 USA — reformulator",
    markets: "🇺🇸 only",
    certifications: ["USDA Org", "Non-GMO", "Kosher"],
    price: "$15–24",
    positioning: "Science-backed",
    your_edge: "Price 45% lower + India origin story",
    threat: "Medium",
  },
  {
    Competitor_txt1: "Himalaya Drug Company",
    Competitor_txt2: "🇮🇳 India — branded",
    markets: "Global",
    certifications: ["GMP", "WHO GMP", "USDA"],
    price: "$12–22",
    positioning: "Consumer brand",
    your_edge: "Bulk B2B focus vs their retail focus — different buyers",
    threat: "Low (diff channel)",
  },
];

const Competitors = ({ competitor_data }) => {
  console.log("competitor_data: ", competitor_data);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Competitor Map
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            Direct competitors in your target markets · Certifications, pricing,
            positioning gaps
          </p>
        </div>
        <div className="bg-red-100 text-red-500 text-sm font-medium py-0.5 px-3 rounded-2xl">
          1 cert gap identified — act now
        </div>
      </div>

      <div className="border flex gap-3 p-3 rounded-lg border-l-3 border-[#0284C7] mt-6">
        <div>
          <BoltIcon className="mt-1 h-5 w-5" />
        </div>
        <div>
          <span className="text-sm text-[#0284C7] font-medium">
            SpiceGuru International lost USDA Organic certification 8 days ago.
          </span>
          <span className="text-sm text-[#5F6368] font-regular">
            {" "}
            They supply 44 German buyers and ~20 US buyers. Those buyers are now
            actively re-sourcing. This window typically lasts 60–90 days before
            a new supplier qualifies. BioHerb GmbH (score 88) confirmed Q2
            procurement is open.
          </span>
          <span className="text-sm text-[#0284C7] font-medium">
            {" "}
            Send Email 1 this week.
          </span>
        </div>
      </div>

      {/* <div className="mt-6">
                <div className="border-b border-[#E6E6E6] grid grid-cols-5 gap-5 py-1 bg-gray-100">
                    <div className="px-1 uppercase font-medium text-sm py-1 text-center ">Competitor</div>
                    <div className="text-center px-1 uppercase font-medium text-sm py-1 ">Type</div>
                    <div className="px-1 uppercase font-medium text-sm py-1 text-center ">Country</div>
                    <div className="text-center uppercase font-medium text-sm py-1 ">Website</div>
                    <div className="uppercase font-medium text-sm py-1  text-center">Notes</div>
                </div>

                {competitor_data?.map((item, i) => {
                    return (
                        <div className="grid grid-cols-5 gap-5 border-t py-2 border-[#E6E6E6] transition-all duration-300 hover:bg-gray-100" key={i}>
                            <div className="px-1 text-sm text-[#000000] wrap-break-word text-center">
                                {item.name}
                            </div>
                            <div className="text-center text-sm wrap-break-word">{item.competitor_type}</div>
                            <div className="text-center text-sm px-1 flex flex-wrap gap-2 wrap-break-word">
                                {item.origin_country}
                                
                            </div>
                            <div className="text-center text-sm wrap-break-word">{item.website}</div>
                            <div className="px-1 text-sm wrap-break-word text-center">
                                {item.notes}
                            </div>
                        </div>
                    )
                })}
            </div> */}

      <div className="mt-6 flex flex-col gap-6">
        {competitor_data?.map((item, i) => {
          return (
            <div
              className="border flex justify-between p-3 border-[#E6E6E6] rounded-lg card-hover"
              key={i}
            >
              <div className="flex gap-3 items-center">
                <InitialText text={item.name} />
                <div className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <p className="text-base font-medium text-[#000000]">
                      {item?.name ?? "--"}
                    </p>
                    <span className="bg-[#F1FEF2] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                      {item?.competitor_type ?? "--"}
                    </span>
                    <span>
                      <Flag country={item?.origin_country} />
                    </span>
                  </div>
                  <div className="text-xs font-light text-[#5F6368]">
                    <p>{item?.notes ?? "--"}</p>
                  </div>
                  <p className="text-sm font-regular text-blue-500">
                    <a
                      href={
                        item?.website
                          ? item.website.startsWith("http")
                            ? item.website
                            : `https://${item.website}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.website}
                    </a>
                    {/* {item?.website ?? "--"} */}
                  </p>
                </div>
              </div>
              <div>
                <button className="cursor-pointer">
                  <ArrowTopRightOnSquareIcon className="h-5 w-5 text-green-700" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Competitors;
