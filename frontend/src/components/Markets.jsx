import {
  BuildingStorefrontIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import CircularProgress from "./CircularProgress";
import ellipse_3 from "../assets/Ellipse 3.svg";
import ellipse_4 from "../assets/Ellipse 4.svg";
import Flag from "./Flag";

const Markets = ({ market_data }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Market Summary
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            Opportunity scores personalised to GMP + USDA Organic · India origin
          </p>
        </div>
        <div className="bg-[#CCFFCF] text-[#2E7D32] text-sm font-medium py-0.5 px-3 rounded-2xl">
          {market_data?.length ?? "--"} Easy Win Markets
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-4">
        {market_data?.map((item, i) => {
          if (item?.masked) {
            return (
              <div
                className="border border-[#E6E6E6] p-3 rounded-lg card-hover"
                key={i}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="h-6 w-6 blur-sm">
                      <Flag country={item.country} />
                    </div>
                    <div>
                      <h2 className="text-[#000000] text-sm font-medium blur-sm">
                        Lorem, ipsum dolor.
                      </h2>
                      <p className="text-[#5F6368] text-xs font-light blur-sm">
                        HS Lorem
                      </p>
                    </div>
                  </div>
                  <div className="blur-sm">
                    <CircularProgress
                      value={item?.country_and_score?.score || 0}
                      textColor={
                        Number(item?.country_and_score?.score) >= 71
                          ? "#2E7D32"
                          : Number(item?.country_and_score?.score) >= 31
                            ? "#D48C15"
                            : "#C62828"
                      }
                      progressColor={
                        Number(item?.country_and_score?.score) >= 71
                          ? "#6ED073"
                          : Number(item?.country_and_score?.score) >= 31
                            ? "#FBBC05"
                            : "#C62828"
                      }
                      bgColor={
                        Number(item?.country_and_score?.score) >= 71
                          ? "#CCFFCF"
                          : Number(item?.country_and_score?.score) >= 31
                            ? "#FFF1DA"
                            : "#FFC4C4"
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[#5F6368] text-xs font-light whitespace-nowrap blur-sm">
                      Demand Growth
                    </p>
                    <p className="text-[#2E7D32] text-xs font-regular blur-sm">
                      Lorem, ipsum dolor.
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#5F6368] text-xs font-light whitespace-nowrap blur-sm">
                      Import volume Lorem, ipsum dolor.
                    </p>
                    <p className="text-[#1E1E1E] text-xs font-regular">
                      <span className="blur-sm">Lorem, ipsum dolor.</span>
                      <span className="blur-sm">Lorem, ipsum dolor.</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#5F6368] text-xs font-light whitespace-nowrap blur-sm">
                      Matched buyers
                    </p>
                    <p className="text-[#1E1E1E] text-xs font-regular blur-sm">
                      Lorem, ipsum.
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#5F6368] text-xs font-light whitespace-nowrap blur-sm">
                      Peak procurement
                    </p>
                    <p className="text-[#1E1E1E] text-xs font-regular blur-sm">
                      Lorem, ipsum.
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#5F6368] text-xs font-light whitespace-nowrap blur-sm">
                      Primary channel
                    </p>
                    <p className="text-[#1E1E1E] text-xs font-regular blur-sm">
                      Lorem ipsum dolor sit amet.
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[#5F6368] text-xs font-light whitespace-nowrap blur-sm">
                      Lorem, ipsum.
                    </p>
                    <p className="text-[#1E1E1E] text-xs font-regular flex gap-1 blur-sm">
                      Lorem ipsum dolor sit amet.
                    </p>
                  </div>
                </div>

                <div className="border flex gap-2.5 p-3 border-[#A5F7A9] text-[#2E7D32] bg-[#F1FEF2] rounded-lg mt-2.5">
                  <div>
                    <SparklesIcon className="h-6 w-6 blur-sm" />
                  </div>
                  <div className="text-13 font-regular blur-sm">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Laboriosam soluta ad, dicta, consectetur sint similique
                    sapiente voluptatum reiciendis, ut officia esse dolor eos
                    natus facilis neque earum dignissimos ab eaque.
                  </div>
                </div>
              </div>
            );
          }
          
          return (
            <div
              className="border border-[#E6E6E6] p-3 rounded-lg card-hover"
              key={i}
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="h-6 w-6">
                    <Flag country={item.country} />
                  </div>
                  <div>
                    <h2 className="text-[#000000] text-sm font-medium">
                      {item.country || ""}
                    </h2>
                    <p className="text-[#5F6368] text-xs font-light">
                      HS {item.hs_code || ""}
                    </p>
                  </div>
                </div>
                <div>
                  <CircularProgress
                    value={item?.country_and_score?.score || 0}
                    textColor={
                      Number(item?.country_and_score?.score) >= 71
                        ? "#2E7D32"
                        : Number(item?.country_and_score?.score) >= 31
                          ? "#D48C15"
                          : "#C62828"
                    }
                    progressColor={
                      Number(item?.country_and_score?.score) >= 71
                        ? "#6ED073"
                        : Number(item?.country_and_score?.score) >= 31
                          ? "#FBBC05"
                          : "#C62828"
                    }
                    bgColor={
                      Number(item?.country_and_score?.score) >= 71
                        ? "#CCFFCF"
                        : Number(item?.country_and_score?.score) >= 31
                          ? "#FFF1DA"
                          : "#FFC4C4"
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-[#5F6368] text-xs font-light whitespace-nowrap">
                    Demand Growth
                  </p>
                  <p className="text-[#2E7D32] text-xs font-regular">
                    {item?.demand_growth?.value || ""}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#5F6368] text-xs font-light whitespace-nowrap">
                    Import volume {item?.import_volume?.year || 0}
                  </p>
                  <p className="text-[#1E1E1E] text-xs font-regular">
                    <span>{item?.import_volume?.value || ""}</span>
                    <span>{item?.import_volume?.unit || ""}</span>
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#5F6368] text-xs font-light whitespace-nowrap">
                    Matched buyers
                  </p>
                  <p className="text-[#1E1E1E] text-xs font-regular">
                    {item.matched_buyers?.count || ""}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#5F6368] text-xs font-light whitespace-nowrap">
                    Peak procurement
                  </p>
                  <p className="text-[#1E1E1E] text-xs font-regular">
                    {item?.peak_procurement?.period || ""}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#5F6368] text-xs font-light whitespace-nowrap">
                    Primary channel
                  </p>
                  <p className="text-[#1E1E1E] text-xs font-regular">
                    {item?.primary_channel?.channel || ""}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#5F6368] text-xs font-light whitespace-nowrap">
                    Cert requirement
                  </p>
                  <p className="text-[#1E1E1E] text-xs font-regular flex gap-1">
                    {item?.cert_require?.certifications
                      ?.slice(0, 2)
                      ?.map((v, i) => {
                        return (
                          <span key={i} className="">
                            {v},
                          </span>
                        );
                      })}
                  </p>
                </div>
              </div>

              <div className="border flex gap-2.5 p-3 border-[#A5F7A9] text-[#2E7D32] bg-[#F1FEF2] rounded-lg mt-2.5">
                <div>
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <div className="text-13 font-regular">
                  {item.analysis_note || ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Markets;
