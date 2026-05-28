import {
  BuildingStorefrontIcon,
  SparklesIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import ellipse_3 from "../assets/Ellipse 3.svg";
import ellipse_4 from "../assets/Ellipse 4.svg";

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
            {trade_data?.trend_period ?? "--"}
          </p>
        </div>
        <div className="bg-[#B6E7FF] text-[#008ACB] text-sm font-medium py-0.5 px-3 rounded-2xl">
          {trade_data?.origin_country ?? "--"}: #1 exporter ·{" "}
          {trade_data?.country_export_share?.share_pct ?? "--"} global share
        </div>
      </div>

      <div className="flex gap-9.5 items-center bg-[#ECF5FC] rounded-xl p-3 mt-6">
        <div className="text-[#000000] text-xl font-semibold">
          HS {trade_data?.hs_code ?? "--"}
        </div>
        <div className="text-[#000000] text-13 font-regular">
          <span className="font-bold">
            {trade_data?.product_name ?? "--"} —{" "}
          </span>
          dried, crushed or ground · Classified under Spices, Chapter 09 <br />{" "}
          Sub-codes: 0910.30.10 (whole), 0910.30.20 (powder), 0910.30.90 (other
          preparations)
        </div>
      </div>
      <div className="card-hover mt-6 grid grid-cols-1 divide-gray-200 overflow-hidden rounded-lg bg-white shadow-sm md:grid-cols-3 lg:grid-cols-4 md:divide-x md:divide-y-0 border border-[#E6E6E6]">
        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.global_trade_value?.value_usd ?? "--"}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            Global trade value {trade_data?.global_trade_value?.year ?? 0}
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.global_trade_value?.yoy_growth ?? "--"}
          </p>
        </div>
        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.volume_traded_globally?.value_mt ?? "--"}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            Volume traded globally{" "}
            {trade_data?.volume_traded_globally?.year ?? 0}
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.volume_traded_globally?.yoy_growth ?? "--"}
          </p>
        </div>
        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.avg_global_trade_price?.price_per_kg ?? "--"}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            Avg global trade price
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.avg_global_trade_price?.context ?? "--"}
          </p>
        </div>
        <div className="p-3 flex flex-col gap-1 items-center">
          <p className="text-xl font-semibold text-[#008ACB]">
            {trade_data?.country_export_share?.share_pct ?? "--"}
          </p>
          <p className="text-[#5F6368] font-light text-xs">
            {/* {trade_data?.country_export_share?.country ?? "--"}'s export share */}
            {trade_data?.origin_country ?? "--"}'s export share
          </p>
          <p className="text-[#2E7D32] font-medium text-sm">
            {trade_data?.country_export_share?.trend ?? "--"}
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
            <div className="grid grid-cols-3 gap-8 border-b-[1px] border-gray-300">
              <div className="text-sm text-[#000000] font-medium text-center">
                Country
              </div>
              <div className="text-sm text-[#000000] font-medium text-center">
                Volume
              </div>
              <div className="text-sm text-[#000000] font-medium text-center">
                Value
              </div>
            </div>
            {trade_data?.top_exporters?.map((item, index) => {
              if (item?.masked) {
                return (
                  <div
                    className=" border-b-[1px] border-gray-300 grid grid-cols-3 gap-8"
                    key={index}
                  >
                    <div className="text-sm text-[#5F6368] text-center wrap-break-word blur-sm">
                      Lorem, ipsum.
                    </div>
                    <div className="text-sm text-[#5F6368] text-center wrap-break-word blur-sm">
                      Lorem, ipsum.
                    </div>
                    <div className="text-sm text-[#5F6368] text-center wrap-break-word blur-sm">
                      lorem
                    </div>
                  </div>
                );
              }

              return (
                <div
                  className=" border-b-[1px] border-gray-300 grid grid-cols-3 gap-8"
                  key={index}
                >
                  <div className="text-sm text-[#5F6368] text-center wrap-break-word">
                    {item?.country ?? "--"}
                  </div>
                  <div className="text-sm text-[#5F6368] text-center wrap-break-word">
                    {/* {item?.share_pct ?? "--"} */}
                    {item?.volume_mt ?? "--"}
                  </div>
                  <div className="text-sm text-[#5F6368] text-center wrap-break-word">
                    {/* {item?.trad_value ?? "--"} */}
                    {item?.value_usd ?? "--"}
                  </div>
                </div>
              );
            })}
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
            <div className="grid grid-cols-3 gap-8 border-b-[1px] border-gray-300">
              <div className="text-sm text-[#000000] font-medium text-center">
                Country
              </div>
              <div className="text-sm text-[#000000] font-medium text-center">
                Volume
              </div>
              <div className="text-sm text-[#000000] font-medium text-center">
                Value
              </div>
            </div>
            {trade_data?.top_importers?.map((item, index) => {
              if (item?.masked) {
                return (
                  <div
                    className=" border-b-[1px] border-gray-300 grid grid-cols-3 gap-8"
                    key={index}
                  >
                    <div className="text-sm text-[#5F6368] text-center wrap-break-word blur-sm">
                      Lorem, ipsum.
                    </div>
                    <div className="text-sm text-[#5F6368] text-center wrap-break-word blur-sm">
                      Lorem, ipsum.
                    </div>
                    <div className="text-sm text-[#5F6368] text-center wrap-break-word blur-sm">
                      lorem
                    </div>
                  </div>
                );
              }

              return (
                <div
                  className="grid grid-cols-3 gap-8 border-b-[1px] border-gray-300"
                  key={index}
                >
                  <div className="text-sm text-[#5F6368] text-center wrap-break-word">
                    {item?.country ?? "--"}
                  </div>
                  <div className="text-sm text-[#5F6368] text-center wrap-break-word">
                    {item?.volume_mt ?? "--"}
                  </div>
                  <div className="text-sm text-[#5F6368] text-center wrap-break-word">
                    {/* {item?.yoy_growth ?? "--"} */}
                    {item?.value_usd ?? "--"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-[#000000] font-medium text-sm">
          India export volume trend — all markets (MT)
        </h2>
        <div className="grid grid-cols-4 gap-6 mt-2">
          {/* {trade_data?.export_volume_trend?.map((itm, index) => {
            return (
              <div
                className="border p-3 border-[#E6E6E6] rounded-lg card-hover"
                key={index}
              >
                <p className="text-sm font-regular text-[#000000] text-center">
                  {itm.year ?? 0}
                </p>
                <p className="mt-1 text-xl font-semibold text-[#000000] text-center">
                  <MaskedValue value={itm.volume_mt} fallback="--" />
                </p>
                <p className="mt-1 text-sm font-medium text-[#000000] text-center">
                  <MaskedValue
                    value={itm.yoy_growth === null ? itm.label : itm.yoy_growth}
                  />
                </p>
              </div>
            );
          })} */}
          {trade_data?.export_volume_trend?.map((itm, index) => {
            const isLocked =
              typeof itm.volume_mt === "string" &&
              itm.volume_mt.toLowerCase().includes("upgrade");
            return (
              <div
                className="border p-3 border-[#E6E6E6] rounded-lg card-hover"
                key={index}
              >
                <p className="text-sm font-regular text-[#000000] text-center">
                  {itm.year ?? 0}
                </p>
                {isLocked ? (
                  <div className="mt-2 flex justify-center">
                    <span className="inline-flex items-center gap-1 text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-0.5 text-xs font-medium">
                      🔒 Upgrade to unlock
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="mt-1 text-xl font-semibold text-[#000000] text-center">
                      {itm.volume_mt ?? "--"}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#000000] text-center">
                      {itm.yoy_growth === null ? itm.label : itm.yoy_growth}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="mt-6">
        <h2 className="text-[#000000] font-medium text-sm">
          India organic turmeric — certified export pricing vs commodity
        </h2>
        <div className="grid grid-cols-2 gap-6 mt-2">
          <div className="p-3 border border-[#E6E6E6] rounded-lg card-hover">
            <p className="text-[#000000] text-base font-medium">
              Organic certified (your tier)
            </p>
            <p className="mt-1">
              <span className="text-[#000000] text-xl font-semibold">
                {trade_data?.export_pricing_commod?.certified?.price_range ??
                  ""}
              </span>
              <span className="text-[#5F6368] text-base font-medium">
                /kg FOB
              </span>
            </p>
            <p className="text-[#5F6368] text-xs font-light mt-1">
              {trade_data?.export_pricing_commod?.certified?.context ?? ""}
            </p>
          </div>

          <div className="p-3 border border-[#E6E6E6] rounded-lg card-hover">
            <p className="text-[#000000] text-base font-medium">
              Commodity (non-organic)
            </p>
            <p className="mt-1">
              <span className="text-[#000000] text-xl font-semibold">
                {trade_data?.export_pricing_commod?.commodity?.price_range ??
                  ""}
              </span>
            </p>
            <p className="text-[#5F6368] text-xs font-light mt-1">
              {trade_data?.export_pricing_commod?.commodity?.context ?? ""}
            </p>
          </div>
        </div>
      </div> */}

      <div className="mt-6 border border-l-3 border-[#2E7D32] rounded-lg p-3 bg-[#F1FEF2]">
        <p className="text-sm text-[#5F6368] font-regular">
          {" "}
          <span className="text-sm text-[#2E7D32] font-medium">
            What this means for you:
          </span>{" "}
          {trade_data?.analysis_note ?? ""}
        </p>
      </div>
    </>
  );
};
export default Trade;
