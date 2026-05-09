import {
  ArrowRightIcon,
  SparklesIcon,
  DocumentChartBarIcon,
  InformationCircleIcon,
  BoltIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import CircularProgress from "./CircularProgress";
import banner from "../assets/banner.svg";
import { useNavigate } from "react-router-dom";

const Step4 = ({
  productsData,
  banner_summary,
  product_analyse_data,
  last_run_data,
  time_taken_data,
  pages_crawled_data
}) => {
  // console.log("product:", productsData);
  // console.log("banner:", banner_summary);
  // console.log("product:", product_analyse_data);
  // console.log("last:", last_run_data);
  // console.log("tm:", time_taken_data);

  const navigate = useNavigate();

  return (
    <>
      <div
        className="p-6 flex justify-between rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="text-[#FFFFFF]">
          <p className="text-xs font-light">
            {product_analyse_data || 0} PRODUCTS ANALYZED
          </p>
          <h2 className="text-[28px] font-semibold mt-1">
            Your Combined Opportunity Report is Ready
          </h2>
          <p className="text-xs font-light mt-3">
            All {product_analyse_data || 0} products analysed.
          </p>
          <p className="text-xs font-light">
            View individual reports below or open the combined report for the
            full picture.
          </p>
          <div className="my-6 text-[#FFFFFF] grid grid-cols-4 gap-4">
            {banner_summary?.map((itm, i) => {
              return (
                <div className="flex justify-between" key={i}>
                  <div className="p-0.5">
                    <h2 className="text-xl font-semibold">{itm?.value}</h2>
                    <p className="text-xs font-light">{itm?.label}</p>
                  </div>
                  {i < banner_summary?.length - 1 && (
                    <div className="w-[0.5px] bg-[#FFFFFF]"></div>
                  )}
                </div>
              );
            })}

            {/* <div className="flex justify-between">
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">9</h2>
                <p className="text-xs font-light">EASY WIN MARKETS</p>
              </div>
              <div className="w-[1px] bg-[#FFFFFF]"></div>
            </div>
            <div className="flex justify-between">
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">+19%</h2>
                <p className="text-xs font-light">AVG YOY DEMAND</p>
              </div>
              <div className="w-[1px] bg-[#FFFFFF]"></div>
            </div>
            <div>
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">76</h2>
                <p className="text-xs font-light">KEYWORDS</p>
              </div>
            </div> */}
          </div>

          {/* <div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-red-500 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer">
              <span className="font-semibold text-base">
                View Combined Report
              </span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div> */}
        </div>
        <div className="text-[#FFFFFF] flex flex-col gap-7.5">
          <div className="border h-16 w-34 flex items-center justify-end p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30">
            <div>
              <p className="font-semibold text-sm">{last_run_data || ""}</p>
              <p className="font-light text-xs text-right">Last run</p>
            </div>
          </div>
          <div className="border h-16 w-34 flex items-center justify-end p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30">
            <div>
              <p className="font-semibold text-sm">{time_taken_data || ""}</p>
              <p className="font-light text-xs text-right">Time taken</p>
            </div>
          </div>
          <div className="border h-16 w-34 flex items-center justify-end p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30">
            <div>
              <p className="font-semibold text-sm text-right">{pages_crawled_data || 0}</p>
              <p className="font-light text-xs text-right">Webpages visited</p>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-[#000000] text-base font-semibold mt-6">
        Individual Product Reports
      </h1>
      <p className="text-[#5F6368] text-13 font-regular">
        Click any card to open that product's full report ・ Hover a score to
        see breakdown
      </p>

      <div className="grid grid-cols-3 gap-6 mt-3">
        {productsData?.map((item, index) => {
          return (
            <div
              className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover"
              key={index}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-medium text-[#000000]">
                    {item?.product_name}
                  </h2>
                  <p className="text-xs font-light text-[#5F6368] flex gap-4">
                    <span>Nutraceuticals</span>
                    <span>{item?.hs_code}</span>
                  </p>
                </div>
                <div>
                  {/* <CircularProgress
                    value={item?.overview?.score || 0}
                    textColor="#065f46"
                    progressColor="#22c55e"
                    bgColor="#d1fae5"
                  /> */}
                  <CircularProgress
                    value={item?.overview?.score || 0}
                    textColor={
                      Number(item?.overview?.score) >= 71
                        ? "#2E7D32"
                        : Number(item?.overview?.score) >= 31
                          ? "#D48C15"
                          : "#C62828"
                    }
                    progressColor={
                      Number(item?.overview?.score) >= 71
                        ? "#6ED073"
                        : Number(item?.overview?.score) >= 31
                          ? "#FBBC05"
                          : "#C62828"
                    }
                    bgColor={
                      Number(item?.overview?.score) >= 71
                        ? "#CCFFCF"
                        : Number(item?.overview?.score) >= 31
                          ? "#FFF1DA"
                          : "#FFC4C4"
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                {/* {item?.overview?.scores?.map((itm, i) => {
                  return (
                    <div
                      className="grid grid-cols-[100px_1fr_20px] gap-2"
                      key={i}
                    >
                      <div className="text-xs text-[#5F6368] font-light">
                        {itm?.label}
                      </div>
                      <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                        <div
                          className={`h-1 bg-[#2E7D32] rounded ${Number(itm.score) >= 7 ? "bg-[#009A3F]" : Number(itm.score) >= 3 ? "bg-[#D48C15]" : "bg-[#C62828]"}`}
                          style={{ width: `${Number(itm.score)*10}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-[#2E7D32] font-medium text-right">
                        {itm?.score}
                      </div>
                    </div>
                  );
                })} */}
                {item?.overview?.scores?.map((itm, i) => {
                  const rawScore = Number(itm?.score);

                  // between 0–10
                  const score = isNaN(rawScore)
                    ? 0
                    : Math.min(10, Math.max(0, rawScore));

                  const bgColor =
                    score >= 7
                      ? "bg-[#009A3F]" // green
                      : score >= 3
                        ? "bg-[#D48C15]" // yellow
                        : "bg-[#C62828]"; // red

                  const bgColor1 =
                    score >= 7
                      ? "bg-[#CCFFCF]" // green
                      : score >= 3
                        ? "bg-[#FFE9C5]" // yellow
                        : "bg-[#FFC4C4]"; // red

                  return (
                    <div
                      className="grid grid-cols-[110px_1fr_30px] gap-2 items-center"
                      key={i}
                    >
                      <div className="text-xs text-[#5F6368] font-light">
                        {itm?.label}
                      </div>

                    <div className={`w-full h-1 ${bgColor1} rounded`}>
                        <div
                          className={`h-1 rounded ${bgColor}`}
                          style={{ width: `${score * 10}%` }}
                        ></div>
                      </div>

                      <div className="text-sm text-[#2E7D32] font-medium text-right">
                        {score}
                      </div>
                    </div>
                  );
                })}
                {/* <div className="grid grid-cols-[100px_1fr_20px] gap-2">
                  <div className="text-xs text-[#5F6368] font-light">
                    Market Demand
                  </div>
                  <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                    <div
                      className="h-1 bg-[#2E7D32] rounded"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                  <div className="text-sm text-[#2E7D32] font-medium text-right">
                    9
                  </div>
                </div> */}

                {/* <div className="grid grid-cols-[100px_1fr_20px] gap-2">
                  <div className="text-xs text-[#5F6368] font-light">
                    Competition
                  </div>
                  <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                    <div
                      className="h-1 bg-[#2E7D32] rounded"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                  <div className="text-sm text-[#2E7D32] font-medium text-right">
                    8
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr_20px] gap-2">
                  <div className="text-xs text-[#5F6368] font-light">
                    Trade Activity
                  </div>
                  <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                    <div
                      className="h-1 bg-[#D48C15] rounded"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <div className="text-sm text-[#D48C15] font-medium text-right">
                    6
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr_20px] gap-2">
                  <div className="text-xs text-[#5F6368] font-light">
                    Price Fit
                  </div>
                  <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                    <div
                      className="h-1 bg-[#2E7D32] rounded"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                  <div className="text-sm text-[#2E7D32] font-medium text-right">
                    9
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr_20px] gap-2">
                  <div className="text-xs text-[#5F6368] font-light">
                    Buyer Availability
                  </div>
                  <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                    <div
                      className="h-1 bg-[#2E7D32] rounded"
                      style={{ width: "8%" }}
                    ></div>
                  </div>
                  <div className="text-sm text-[#2E7D32] font-medium text-right">
                    8
                  </div>
                </div>
                <div className="grid grid-cols-[100px_1fr_20px] gap-2">
                  <div className="text-xs text-[#5F6368] font-light">
                    Marketing Data
                  </div>
                  <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                    <div
                      className="h-1 bg-[#2E7D32] rounded"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                  <div className="text-sm text-[#2E7D32] font-medium text-right">
                    9
                  </div>
                </div> */}
              </div>

              <div className="border border-[#A5F7A9] flex gap-2.5 mt-3 p-3 bg-[#F1FEF2] rounded-lg">
                <div>
                  <SparklesIcon className="h-6 w-6 text-[#2E7D32]" />
                </div>
                <div className="text-13">
                  {/* <span className="text-[#2E7D32]">200+ buyers</span>{" "} */}
                  <span className="text-[#2E7D32]">
                    {item?.overview?.urgent_note || ""}
                  </span>
                </div>
              </div>

              <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

              <div className="flex justify-between gap-1.5">
                <button
                  className="w-[85%] bg-[#0284C7] hover:bg-[#0274AE] cursor-pointer py-2 rounded-lg text-[#FFFFFF] flex justify-center items-center gap-2.5"
                  onClick={() => {
                    if (!item?.product_id) return;
                    navigate(`/full-report/${item.product_id}`);
                  }}
                >
                  <span>
                    <DocumentChartBarIcon className="w-5 h-5" />
                  </span>
                  <span>View Report</span>
                </button>
                <div className="border border-[#5F6368] rounded-lg w-[12%] flex justify-center items-center">
                  <InformationCircleIcon className="w-6 h-6 text-[#5F6368]" />
                </div>
              </div>
            </div>
          );
        })}
        {/* 1 */}
        {/* <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#000000]">
                Moringa Leaf Powder
              </h2>
              <p className="text-xs font-light text-[#5F6368] flex gap-4">
                <span>Nutraceuticals</span>
                <span>500g pouches</span>
              </p>
            </div>
            <div>
              <CircularProgress
                value={82}
                progressColor="#22c55e"
                textColor="#065f46"
                bgColor="#d1fae5"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Market Demand
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                9
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Competition
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                6
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">Price Fit</div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                9
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Buyer Availability
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "8%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Marketing Data
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                9
              </div>
            </div>
          </div>

          <div className="border border-[#A5F7A9] flex gap-2.5 mt-3 p-3 bg-[#F1FEF2] rounded-lg">
            <div>
              <SparklesIcon className="h-6 w-6 text-[#2E7D32]" />
            </div>
            <div className="text-13">
              <span className="text-[#2E7D32]">200+ buyers</span>{" "}
              <span className="text-[#1E1E1E]">
                matched · 4 Easy Win markets · Q2 sourcing window open now
              </span>
            </div>
          </div>

          <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

          <div className="flex justify-between gap-1.5">
            <button className="w-[85%] bg-[#0284C7] hover:bg-[#0274AE] cursor-pointer py-2 rounded-lg text-[#FFFFFF] flex justify-center items-center gap-2.5">
              <span>
                <DocumentChartBarIcon className="w-5 h-5" />
              </span>
              <span>View Report</span>
            </button>
            <div className="border border-[#5F6368] rounded-lg w-[12%] flex justify-center items-center">
              <InformationCircleIcon className="w-6 h-6 text-[#5F6368]" />
            </div>
          </div>
        </div> */}

        {/* 2 */}
        {/* <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#000000]">
                Ashwagandha Extract
              </h2>
              <p className="text-xs font-light text-[#5F6368] flex gap-4">
                <span>Nutraceuticals</span>
                <span>KSM-66</span>
              </p>
            </div>
            <div>
              <CircularProgress
                value={76}
                progressColor="#22c55e"
                textColor="#065f46"
                bgColor="#d1fae5"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Market Demand
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Competition
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                7
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                5
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">Price Fit</div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "55%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Buyer Availability
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "45%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                7
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Marketing Data
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
          </div>

          <div className="border border-[#96DBFF] flex gap-2.5 mt-3 p-3 bg-[#EDF9FF] rounded-lg">
            <div>
              <BoltIcon className="h-6 w-6 text-[#0284C7]" />
            </div>
            <div className="text-13">
              <span className="text-[#0284C7]">Competitor cert gap</span>{" "}
              <span className="text-[#1E1E1E]">
                 in Germany - 40+ buyers now sourcing
              </span>
            </div>
          </div>

          <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

          <div className="flex justify-between gap-1.5">
            <button className="w-[85%] bg-[#0284C7] hover:bg-[#0274AE] cursor-pointer py-2 rounded-lg text-[#FFFFFF] flex justify-center items-center gap-2.5">
              <span>
                <DocumentChartBarIcon className="w-5 h-5" />
              </span>
              <span>View Report</span>
            </button>
            <div className="border border-[#5F6368] rounded-lg w-[12%] flex justify-center items-center">
              <InformationCircleIcon className="w-6 h-6 text-[#5F6368]" />
            </div>
          </div>
        </div> */}

        {/* 3 */}
        {/* <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#000000]">
                Red Chilli Powder
              </h2>
              <p className="text-xs font-light text-[#5F6368] flex gap-4">
                <span>Food ingredient</span> . <span>Low confidence</span>
              </p>
            </div>
            <div>
              <CircularProgress
                value={55}
                progressColor="#FBBC05"
                textColor="#D48C15"
                bgColor="#FFF1DA"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                6
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                5
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFC4C4] rounded my-2">
                <div
                  className="h-1 bg-[#C62828] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#C62828] font-medium text-right">
                4
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                7
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                5
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                7
              </div>
            </div>
          </div>

          <div className="border border-[#FFDFAB] flex gap-2.5 mt-3 p-3 bg-[#FFF8EE] rounded-lg">
            <div>
              <ExclamationTriangleIcon className="h-6 w-6 text-[#A66A07]" />
            </div>
            <div className="text-13">
              <span className="text-[#A66A07]">200+ buyers</span>{" "}
              <span className="text-[#1E1E1E]">
                matched · 4 Easy Win markets · Q2 sourcing window open now
              </span>
            </div>
          </div>

          <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

          <div className="flex justify-between gap-1.5">
            <button className="w-[85%] bg-[#0284C7] hover:bg-[#0274AE] cursor-pointer py-2 rounded-lg text-[#FFFFFF] flex justify-center items-center gap-2.5">
              <span>
                <DocumentChartBarIcon className="w-5 h-5" />
              </span>
              <span>View Report</span>
            </button>
            <div className="border border-[#5F6368] rounded-lg w-[12%] flex justify-center items-center">
              <InformationCircleIcon className="w-6 h-6 text-[#5F6368]" />
            </div>
          </div>
        </div> */}

        {/* 4 */}
        {/* <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#000000]">
                Moringa Leaf Powder
              </h2>
              <p className="text-xs font-light text-[#5F6368] flex gap-4">
                <span>Nutraceuticals</span>
                <span>500g pouches</span>
              </p>
            </div>
            <div>
              <CircularProgress
                value={82}
                progressColor="#22c55e"
                textColor="#065f46"
                bgColor="#d1fae5"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Market Demand
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                9
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Competition
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                6
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">Price Fit</div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                9
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Buyer Availability
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Marketing Data
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "90%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                9
              </div>
            </div>
          </div>

          <div className="border border-[#A5F7A9] flex gap-2.5 mt-3 p-3 bg-[#F1FEF2] rounded-lg">
            <div>
              <SparklesIcon className="h-6 w-6 text-[#2E7D32]" />
            </div>
            <div className="text-13">
              <span className="text-[#2E7D32]">200+ buyers</span>{" "}
              <span className="text-[#1E1E1E]">
                matched · 4 Easy Win markets · Q2 sourcing window open now
              </span>
            </div>
          </div>

          <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

          <div className="flex justify-between gap-1.5">
            <button className="w-[85%] bg-[#0284C7] hover:bg-[#0274AE] cursor-pointer py-2 rounded-lg text-[#FFFFFF] flex justify-center items-center gap-2.5">
              <span>
                <DocumentChartBarIcon className="w-5 h-5" />
              </span>
              <span>View Report</span>
            </button>
            <div className="border border-[#5F6368] rounded-lg w-[12%] flex justify-center items-center">
              <InformationCircleIcon className="w-6 h-6 text-[#5F6368]" />
            </div>
          </div>
        </div> */}

        {/* 5 */}
        {/* <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#000000]">
                Ashwagandha Extract
              </h2>
              <p className="text-xs font-light text-[#5F6368] flex gap-4">
                <span>Nutraceuticals</span>
                <span>KSM-66</span>
              </p>
            </div>
            <div>
              <CircularProgress
                value={76}
                progressColor="#22c55e"
                textColor="#065f46"
                bgColor="#d1fae5"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Market Demand
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Competition
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                7
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                5
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">Price Fit</div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "55%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Buyer Availability
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "45%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                7
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Marketing Data
              </div>
              <div className="w-full h-1 bg-[#CCFFCF] rounded my-2">
                <div
                  className="h-1 bg-[#2E7D32] rounded"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-sm text-[#2E7D32] font-medium text-right">
                8
              </div>
            </div>
          </div>

          <div className="border border-[#96DBFF] flex gap-2.5 mt-3 p-3 bg-[#EDF9FF] rounded-lg">
            <div>
              <BoltIcon className="h-6 w-6 text-[#0284C7]" />
            </div>
            <div className="text-13">
              <span className="text-[#0284C7]">Competitor cert gap</span>{" "}
              <span className="text-[#1E1E1E]">
                 in Germany - 40+ buyers now sourcing
              </span>
            </div>
          </div>

          <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

          <div className="flex justify-between gap-1.5">
            <button className="w-[85%] bg-[#0284C7] hover:bg-[#0274AE] cursor-pointer py-2 rounded-lg text-[#FFFFFF] flex justify-center items-center gap-2.5">
              <span>
                <DocumentChartBarIcon className="w-5 h-5" />
              </span>
              <span>View Report</span>
            </button>
            <div className="border border-[#5F6368] rounded-lg w-[12%] flex justify-center items-center">
              <InformationCircleIcon className="w-6 h-6 text-[#5F6368]" />
            </div>
          </div>
        </div> */}

        {/* 6 */}
        {/* <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <div>
              <h2 className="text-sm font-medium text-[#000000]">
                Red Chilli Powder
              </h2>
              <p className="text-xs font-light text-[#5F6368] flex gap-4">
                <span>Food ingredient</span> . <span>Low confidence</span>
              </p>
            </div>
            <div>
              <CircularProgress
                value={55}
                progressColor="#FBBC05"
                textColor="#D48C15"
                bgColor="#FFF1DA"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                6
              </div>
            </div>

            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "85%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                5
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFC4C4] rounded my-2">
                <div
                  className="h-1 bg-[#C62828] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#C62828] font-medium text-right">
                4
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                7
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                5
              </div>
            </div>
            <div className="grid grid-cols-[100px_1fr_20px] gap-2">
              <div className="text-xs text-[#5F6368] font-light">
                Trade Activity
              </div>
              <div className="w-full h-1 bg-[#FFE9C5] rounded my-2">
                <div
                  className="h-1 bg-[#D48C15] rounded"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <div className="text-sm text-[#D48C15] font-medium text-right">
                7
              </div>
            </div>
          </div>

          <div className="border border-[#FFDFAB] flex gap-2.5 mt-3 p-3 bg-[#FFF8EE] rounded-lg">
            <div>
              <ExclamationTriangleIcon className="h-6 w-6 text-[#A66A07]" />
            </div>
            <div className="text-13">
              <span className="text-[#A66A07]">200+ buyers</span>{" "}
              <span className="text-[#1E1E1E]">
                matched · 4 Easy Win markets · Q2 sourcing window open now
              </span>
            </div>
          </div>

          <hr className="h-[1px] bg-[#E6E6E6] my-3 border-0" />

          <div className="flex justify-between gap-1.5">
            <button className="w-[85%] bg-[#0284C7] hover:bg-[#0274AE] cursor-pointer py-2 rounded-lg text-[#FFFFFF] flex justify-center items-center gap-2.5">
              <span>
                <DocumentChartBarIcon className="w-5 h-5" />
              </span>
              <span>View Report</span>
            </button>
            <div className="border border-[#5F6368] rounded-lg w-[12%] flex justify-center items-center">
              <InformationCircleIcon className="w-6 h-6 text-[#5F6368]" />
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};
export default Step4;
