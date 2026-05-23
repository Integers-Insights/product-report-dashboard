import { FunnelIcon } from "@heroicons/react/24/outline";
import InitialText from "./InitialText";
import Flag from "./Flag";
import { useNavigate } from "react-router-dom";

const B2Bbuyers = ({ b2b }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Target Buyers
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            Sorted by opportunity score
          </p>
        </div>
        {/* <div className="flex gap-3 items-center">
          <div
            className="bg-[#FFF8EE] text-[#A66A07] text-sm font-medium py-0.5 px-3 rounded-2xl h-6.5 cursor-pointer"
            onClick={() => navigate("/pricing")}
          >
            Contacts need Venture+
          </div>
          <div className="border border-gray-300 text-sm font-medium bg-gray-100 flex gap-2 items-center px-4 py-1.5 rounded-lg cursor-pointer">
            <FunnelIcon className="h-5 w-5" /> Filter
          </div>
        </div> */}
      </div>
      <div className="flex flex-col gap-6 mt-6">
        {b2b?.buyers?.map((item, index) => {
          if (item?.masked) {
            return (
              <div
                className="border flex justify-between p-3 border-[#E6E6E6] rounded-lg card-hover"
                key={index}
              >
                <div className="flex gap-3 items-center">
                  <div className="blur-sm">
                    <InitialText text={"A B"} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-2 blur-sm">
                      <p className="text-base font-medium text-[#000000]">
                        Natural Health Distributors Inc.
                      </p>
                      <button className="bg-[#F1FEF2] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                        Active RFQ
                      </button>
                      <button className="bg-[#EDF9FF] text-[#008ACB] text-xs font-medium px-2 py-0.5 rounded-2xl">
                        🇺🇸 USA
                      </button>
                    </div>
                    <div className="text-xs font-light text-[#5F6368] flex gap-5 blur-sm">
                      <p>Contract Manufacturer</p>
                      <p>Annual spend $2M–8M</p>
                      <p>Requires GMP + Organic</p>
                      <p>New Jersey, USA</p>
                    </div>
                    <p className="text-sm font-regular text-[#5F6368] blur-sm">
                      They likely source Pear Shaped Water Dissolving Film from
                      India for their water-soluble film production, indicating
                      a strong relevance in volume and frequency of use.
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-1 whitespace-nowrap"
                    onClick={() => navigate("/pricing")}
                  >
                    🔒 Upgrade your plan to see more
                  </button>
                </div>
              </div>
            );
          }

          const score = Math.max(0, Math.min(10, item.relevance_score ?? 0));

          const textColor =
            score >= 7
              ? "text-[#009A3F]"
              : score >= 3
                ? "text-[#D48C15]"
                : "text-[#C62828]";

          return (
            <div
              className="border flex justify-between p-3 border-[#E6E6E6] rounded-lg card-hover"
              key={index}
            >
              <div className="flex gap-3 items-center">
                <InitialText text={item?.name} />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium text-[#000000]">
                      {item?.name ?? "--"}
                    </p>
                    <button className="bg-[#F1FEF2] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                      Active RFQ
                    </button>
                    <span>
                      <Flag country={item?.country} />
                    </span>
                  </div>
                  <div className="text-xs font-light text-[#0284C7] flex gap-5">
                    <p>
                      <a
                        href={
                          item?.contact
                            ? item.contact.startsWith("http")
                              ? item.contact
                              : `https://${item.contact}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item?.contact}
                      </a>
                    </p>
                    <p className="text-[#5F6368]">{item?.type ?? "--"}</p>
                  </div>
                  <p className="text-sm font-regular text-[#5F6368]">
                    {item?.notes ?? "--"}
                  </p>
                </div>
              </div>
              <div>
                <h1
                  className={`text-xl font-semibold ${textColor} text-center`}
                >
                  {score}
                </h1>
                <p className="text-xs font-light text-[#5F6368]">Match</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="border border-[#FFDFAB] bg-[#FFF8EE] p-3 rounded-lg mt-6 flex justify-between items-center">
        <p>
          🔒 195 more buyers with contact details, procurement emails, LinkedIn
          profiles and RFQ history — unlock on Venture+
        </p>
        <button
          className="bg-[#D48C15] text-white rounded-lg font-medium px-3 py-1"
          onClick={() => navigate("/pricing")}
        >
          Upgrade your plan to see more →
        </button>
      </div> */}
    </>
  );
};
export default B2Bbuyers;
