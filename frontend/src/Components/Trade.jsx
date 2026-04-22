import {
  BuildingStorefrontIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import ellipse_3 from "../assets/Ellipse 3.svg";
import ellipse_4 from "../assets/Ellipse 4.svg";

const stats = [
  {
    stat: "$840M",
    txt: "GLOBAL TRADE VALUE 2025",
    previousStat: "28.62%",
    change: "14% YoY",
    changeType: "increase",
  },
  {
    stat: "320K MT",
    txt: "VOLUME TRADED GLOBALLY",
    previousStat: "70,946",
    change: "8% YoY",
    changeType: "increase",
  },
  {
    stat: "$2.63/KG",
    txt: "AVG GLOBAL TRADE PRICE",
    previousStat: "56.14%",
    change: "Commodity avg (non-organic)",
    changeType: "increase",
  },
  {
    stat: "64%",
    txt: "INDIA’S EXPORT SHARE",
    previousStat: "28.62%",
    change: "from 58% in 2021",
    changeType: "increase",
  },
];

const kpis = [
  {
    year: "2021",
    txt1: "148K",
    txt2: "Baseline",
  },
  {
    year: "2022",
    txt1: "169K",
    txt2: "↑14%",
  },
  {
    year: "2023",
    txt1: "190K",
    txt2: "↑12%",
  },
  {
    year: "2024",
    txt1: "205K",
    txt2: "↑8%",
  },
];

const kpis1 = [
  {
    txt1: "Commodity (non-organic)",
    txt2: "$1.20–$2.80",
    txt3: "High volume, race-to-bottom pricing · Vietnam + Bangladesh undercutting India on cost",
  },
  {
    txt1: "Organic certified (your tier)",
    txt2: "$8–$16",
    txt3: "5–7× commodity floor · India is only large-scale organic certified supplier globally · Protected from commodity price pressure",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Trade = ({ trade_data }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Import / Export Trade Data
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            HS Code {trade_data?.hs_code || ""} · Global customs records ·{" "}
            {trade_data?.trend_period || ""}
          </p>
        </div>
        <div className="bg-[#B6E7FF] text-[#008ACB] text-sm font-medium py-0.5 px-3 rounded-2xl">
          {trade_data?.origin_country || ""}: #1 exporter ·{" "}
          {trade_data?.country_export_share?.share_pct || ""} global share
        </div>
      </div>

      <div className="flex gap-9.5 items-center bg-[#ECF5FC] rounded-xl p-3 mt-6">
        <div className="text-[#000000] text-xl font-semibold">
          HS {trade_data?.hs_code || ""}
        </div>
        <div className="text-[#000000] text-13 font-regular">
          <span className="font-bold">{trade_data?.product_name || ""} — </span>
          dried, crushed or ground · Classified under Spices, Chapter 09 <br />{" "}
          Sub-codes: 0910.30.10 (whole), 0910.30.20 (powder), 0910.30.90 (other
          preparations)
        </div>
      </div>

      {/*  */}
      <div className="card-hover mt-6 grid grid-cols-1 divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-3 lg:grid-cols-4 md:divide-x md:divide-y-0 border border-[#E6E6E6]">
        {/* {stats.map((item, index) => (
          <div key={index} className="p-3">
            <div className="mt-1 flex flex-col items-center gap-1 justify-between md:block lg:flex">
              <div className="flex items-baseline text-xl font-semibold text-[#008ACB]">
                {item.stat}
              </div>
              <p className="text-[#5F6368] font-light text-xs">{item.txt}</p>

              <div
                className={classNames(
                  item.changeType === "increase"
                    ? "text-[#2E7D32]"
                    : "text-red-800",
                  "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0",
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    aria-hidden="true"
                    className="mr-0.5 -ml-1 size-5 shrink-0 self-center text-[#2E7D32]"
                  />
                ) : (
                  <ArrowDownIcon
                    aria-hidden="true"
                    className="mr-0.5 -ml-1 size-5 shrink-0 self-center text-red-500"
                  />
                )}

                <span className="sr-only">
                  {" "}
                  {item.changeType === "increase"
                    ? "Increased"
                    : "Decreased"}{" "}
                  by{" "}
                </span>
                {item.change}
              </div>
            </div>
          </div>
        ))} */}

        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.global_trade_value?.value_usd || ""}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            Global trade value {trade_data?.global_trade_value?.year || 0}
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.global_trade_value?.yoy_growth || ""}
          </p>
        </div>
        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.volume_traded_globally?.value_mt || ""}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            Volume traded globally{" "}
            {trade_data?.volume_traded_globally?.year || 0}
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.volume_traded_globally?.yoy_growth || ""}
          </p>
        </div>
        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.avg_global_trade_price?.price_per_kg || ""}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            Avg global trade price
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.avg_global_trade_price?.context || ""}
          </p>
        </div>
        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.country_export_share?.share_pct || ""}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            {trade_data?.country_export_share?.country || ""}'s export share
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.country_export_share?.trend || ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <h2 className="text-sm font-medium text-[#000000]">
              Top exporting countries
            </h2>
            <p className="text-xs font-light text-[#5F6368]">by volume 2024</p>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {trade_data?.top_exporters?.map((item, i) => {
              return (
                <div
                  className="grid grid-cols-[90px_1fr_60px_20px] gap-2"
                  key={i}
                >
                  <div className="text-xs text-[#000000] font-regular">
                    {item?.country}
                  </div>
                  <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                    <div
                      className="h-1 bg-[#0284C7] rounded"
                      style={{ width: "64%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-[#000000] font-regular">
                    {item?.trad_value}
                  </div>
                  <div className="text-sm text-[#000000] font-medium text-right">
                    64%
                  </div>
                </div>
              );
            })}

            {/* <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">
                Bangladesh
              </div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "18%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">58K MT</div>
              <div className="text-sm text-[#000000] font-medium text-right">
                18%
              </div>
            </div> */}
            {/* <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">Myanmar</div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "9%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">29K MT</div>
              <div className="text-sm text-[#000000] font-medium text-right">
                9%
              </div>
            </div> */}
            {/* <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">Peru</div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "4%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">14K MT</div>
              <div className="text-sm text-[#000000] font-medium text-right">
                4%
              </div>
            </div> */}
            {/* <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">Others</div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "5%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">14K MT</div>
              <div className="text-sm text-[#000000] font-medium text-right">
                5%
              </div>
            </div> */}
          </div>
        </div>

        <div className="border border-[#E6E6E6] bg-[#FFFFFF] p-3 rounded-lg card-hover">
          <div className="flex justify-between">
            <h2 className="text-sm font-medium text-[#000000]">
              Top importing countries
            </h2>
            <p className="text-xs font-light text-[#5F6368]">by volume 2024</p>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {trade_data?.top_importers?.map((item, i) => {
              return (
                <div
                  className="grid grid-cols-[90px_1fr_60px_20px] gap-2"
                  key={i}
                >
                  <div className="text-xs text-[#000000] font-regular">
                    {item?.country}
                  </div>
                  <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                    <div
                      className="h-1 bg-[#0284C7] rounded"
                      style={{ width: "64%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-[#000000] font-regular">
                    {item?.volume_mt}
                  </div>
                  <div className="text-sm text-[#000000] font-medium text-right">
                    64%
                  </div>
                </div>
              );
            })}

            {/* <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">Germany</div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "18%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">
                18.4K MT
              </div>
              <div className="text-sm text-[#000000] font-medium text-right">
                18%
              </div>
            </div>
            <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">
                United Kingdom
              </div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "14%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">9.6K MT</div>
              <div className="text-sm text-[#000000] font-medium text-right">
                14%
              </div>
            </div>
            <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">
                Singapore
              </div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "12%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">8.1K MT</div>
              <div className="text-sm text-[#000000] font-medium text-right">
                12%
              </div>
            </div>
            <div className="grid grid-cols-[90px_1fr_60px_20px] gap-2">
              <div className="text-xs text-[#000000] font-regular">Japan</div>
              <div className="w-full h-1 bg-[#D6F0FF] rounded my-2">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "9%" }}
                ></div>
              </div>
              <div className="text-xs text-[#000000] font-regular">4.1K MT</div>
              <div className="text-sm text-[#000000] font-medium text-right">
                9%
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-[#000000] font-medium text-sm">
          India export volume trend — all markets (MT)
        </h2>
        <div className="grid grid-cols-4 gap-6 mt-2">
          {trade_data?.export_volume_trend?.map((itm, index) => {
            return (
              <div
                className="border p-3 border-[#E6E6E6] rounded-lg card-hover"
                key={index}
              >
                <p className="text-sm font-regular text-[#000000] text-center">
                  {itm.year}
                </p>
                <p className="mt-1 text-xl font-semibold text-[#000000] text-center">
                  {itm.volume_mt}
                </p>
                <p className="mt-1 text-sm font-medium text-[#000000] text-center">
                  {itm.yoy_growth === null ? itm.label : itm.yoy_growth}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-[#000000] font-medium text-sm">
          India organic turmeric — certified export pricing vs commodity
        </h2>
        <div className="grid grid-cols-2 gap-6 mt-2">
          {/* {kpis1?.map((itm, index) => {
            return (
              <div
                className="p-3 border border-[#E6E6E6] rounded-lg card-hover"
                key={index}
              >
                <p className="text-[#000000] text-base font-medium">
                  Commodity (non-organic)
                </p>
                <p className="mt-1">
                  <span className="text-[#000000] text-xl font-semibold">
                    $1.20–$2.80
                  </span>
                  <span className="text-[#5F6368] text-base font-medium">
                    /kg FOB
                  </span>
                </p>
                <p className="text-[#5F6368] text-xs font-light mt-1">
                  High volume, race-to-bottom pricing · Vietnam + Bangladesh undercutting India on cost
                </p>
              </div>
            );
          })} */}

          <div className="p-3 border border-[#E6E6E6] rounded-lg card-hover">
            <p className="text-[#000000] text-base font-medium">
              Organic certified (your tier)
            </p>
            <p className="mt-1">
              <span className="text-[#000000] text-xl font-semibold">
                {trade_data?.export_pricing_commod?.certified?.price_range ||
                  ""}
              </span>
              <span className="text-[#5F6368] text-base font-medium">
                /kg FOB
              </span>
            </p>
            <p className="text-[#5F6368] text-xs font-light mt-1">
              {trade_data?.export_pricing_commod?.certified?.context || ""}
            </p>
          </div>

          <div className="p-3 border border-[#E6E6E6] rounded-lg card-hover">
            <p className="text-[#000000] text-base font-medium">
              Commodity (non-organic)
            </p>
            <p className="mt-1">
              <span className="text-[#000000] text-xl font-semibold">
                {trade_data?.export_pricing_commod?.commodity?.price_range ||
                  ""}
              </span>
              <span className="text-[#5F6368] text-base font-medium">
                /kg FOB
              </span>
            </p>
            <p className="text-[#5F6368] text-xs font-light mt-1">
              {trade_data?.export_pricing_commod?.commodity?.context || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-l-3 border-[#2E7D32] rounded-lg p-3 bg-[#F1FEF2]">
        <p className="text-sm text-[#5F6368] font-regular">
          {" "}
          <span className="text-sm text-[#2E7D32] font-medium">
            What this means for you:
          </span>{" "}
          {trade_data?.analysis_note || ""}
        </p>
      </div>
    </>
  );
};
export default Trade;
