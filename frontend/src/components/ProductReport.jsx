import banner from "../assets/banner.svg";
import Tab from "./Tab";
import { useState } from "react";
import Overview from "./Overview";
import Markets from "./Markets";
import Trade from "./Trade";
import Variants from "./Variants";
// import Kpis from "./Kpis";
import Buyer from "./Buyer";
import Competitors from "./Competitors";
import Marketingkit from "./Marketingkit";
import {
  ArrowRightIcon,
  ChartBarSquareIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  BanknotesIcon,
  SwatchIcon,
  BriefcaseIcon,
  MegaphoneIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import PriceAnalysis from "./PriceAnalysis";
import Flag from "./Flag";

const ProductReport = ({
  banner_product_name,
  banner_hs_code,
  banner_certifications,
  banner_single_country,
  banner_multiple_country,
  banner_buyer_type,
  banner_price_positioning,
  banner_monthly_supply_capacity,
  banner_total_buyers,
  banner_easy_win,
  banner_global_trade,
  banner_keywords,
  banner_market_range,
  banner_score,
  overview_data,
  urgent_note_data,
  actions_data,
  market_data,
  trade_data,
  buyers_data,
  price_intelligence_data,
  variants_data,
  competitor_data,
  marketing_kit_data,
}) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const size = 81;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(100, Math.max(0, banner_score || 0));
  const progress = (safeValue / 100) * circumference;

  return (
    <>
      <div
        className="p-6 flex justify-between rounded-xl text-[#FFFFFF] bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div>
          <p className="text-xs font-light">INDIVIDUAL PRODUCT REPORT</p>
          <h1 className="text-[28px] font-semibold mt-1">
            {banner_product_name || "--"}
          </h1>
          <div className="flex gap-9 items-center mt-3">
            <div className="text-xs font-light">
              HS {banner_hs_code || "--"}
            </div>
            <div className="flex gap-1.5">
              {banner_certifications?.slice(0, 3).map((val, i) => {
                return (
                  <button className="border py-0.5 px-3 rounded-full" key={i}>
                    {val}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-1.5 items-center">
              <div className="h-3 w-6 rounded-full">
                <Flag country={banner_single_country} />
              </div>
              <div>
                <ArrowRightIcon className="h-4 w-4" />
              </div>
              <div className="flex gap-2 w-25 h-4">
                {banner_multiple_country?.slice(0, 4).map((itm, index) => {
                  return (
                    <div
                      className="flex justify-center items-center h-4 w-8 rounded-full"
                      key={index}
                    >
                      <Flag country={itm} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-sm font-medium">
              <span>{banner_buyer_type ?? "--"}</span>
              <span>・</span>
              <span>{banner_price_positioning ?? "--"} </span>
              <span>・</span>
              <span>{banner_monthly_supply_capacity ?? "--"}</span>
            </div>
          </div>

          <div className="mt-6 text-[#FFFFFF] grid grid-cols-6 gap-4">
            <div className="flex justify-between">
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">
                  {banner_total_buyers ?? 0}
                </h2>
                <p className="text-xs font-light">BUYERS FOUND</p>
              </div>
              <div className="w-[0.5px] bg-[#FFFFFF]"></div>
            </div>
            <div className="flex justify-between">
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">
                  {banner_easy_win ?? 0}
                </h2>
                <p className="text-xs font-light">EASY WIN MARKETS</p>
              </div>
              <div className="w-[1px] bg-[#FFFFFF]"></div>
            </div>
            <div className="flex justify-between">
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">
                  {banner_global_trade !== null &&
                  banner_global_trade !== undefined &&
                  banner_global_trade !== ""
                    ? banner_global_trade
                    : "--"}
                </h2>
                <p className="text-xs font-light">AVG YOY DEMAND</p>
              </div>
              <div className="w-[1px] bg-[#FFFFFF]"></div>
            </div>
            <div className="flex justify-between">
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">Q2</h2>
                <p className="text-xs font-light">BUY WINDOW</p>
              </div>
              <div className="w-[1px] bg-[#FFFFFF]"></div>
            </div>
            <div className="flex justify-between">
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">
                  {banner_keywords ?? 0}
                </h2>
                <p className="text-xs font-light">TOTAL KEYWORDS</p>
              </div>
              <div className="w-[1px] bg-[#FFFFFF]"></div>
            </div>
            <div>
              <div className="p-0.5">
                <h2 className="text-xl font-semibold">
                  {banner_market_range !== null &&
                  banner_market_range !== undefined &&
                  banner_market_range !== ""
                    ? banner_market_range
                    : "--"}
                </h2>
                <p className="text-xs font-light">PRICE RANGE</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#27C727"
              strokeWidth={strokeWidth}
              strokeDasharray={`${progress} ${circumference}`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            <text
              x="50%"
              y="52%"
              textAnchor="middle"
              fontSize="28px"
              fontWeight="600"
              fill="#FFFFFF"
            >
              {safeValue}
            </text>
            <text
              x="50%"
              y="68%"
              textAnchor="middle"
              fontSize="12px"
              fontWeight="300"
              fill="#FFFFFF"
            >
              Score
            </text>
          </svg>
        </div>
      </div>
      <div className="overflow-hidden w-full">
        <div className="border-b border-[#A9B3B1] bg-white pb-0.5">
          <div className="flex gap-8 overflow-x-auto whitespace-nowrap w-0 min-w-full">
            <Tab
              label="Overview"
              isActive={activeTab === "Overview"}
              onClick={() => setActiveTab("Overview")}
              icon={ChartBarSquareIcon}
            />
            <Tab
              label="Markets"
              isActive={activeTab === "Markets"}
              onClick={() => setActiveTab("Markets")}
              icon={BuildingStorefrontIcon}
            />
            <Tab
              label="Trade"
              isActive={activeTab === "Trade"}
              onClick={() => setActiveTab("Trade")}
              icon={ArrowsRightLeftIcon}
            />
            <Tab
              label="Buyers"
              isActive={activeTab === "Buyers"}
              onClick={() => setActiveTab("Buyers")}
              icon={UserGroupIcon}
            />
            <Tab
              label="Price Analysis"
              isActive={activeTab === "Price Analysis"}
              onClick={() => setActiveTab("Price Analysis")}
              icon={BanknotesIcon}
            />
            <Tab
              label="Variants & Formats"
              isActive={activeTab === "Variants & Formats"}
              onClick={() => setActiveTab("Variants & Formats")}
              icon={SwatchIcon}
            />
            <Tab
              label="Competitors"
              isActive={activeTab === "Competitors"}
              onClick={() => setActiveTab("Competitors")}
              icon={BriefcaseIcon}
            />
            <Tab
              label="Marketing Kit"
              isActive={activeTab === "Marketing Kit"}
              onClick={() => setActiveTab("Marketing Kit")}
              icon={MegaphoneIcon}
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-surface mt-3 border border-[#E6E6E6] p-4 rounded-lg">
        {activeTab === "Overview" && (
          <Overview
            overview_data={overview_data}
            urgent_note_data={urgent_note_data}
            actions_data={actions_data}
            safeValue={safeValue}
          />
        )}
        {activeTab === "Markets" && <Markets market_data={market_data} />}
        {activeTab === "Trade" && <Trade trade_data={trade_data} />}
        {activeTab === "Buyers" && <Buyer buyers_data={buyers_data} />}
        {activeTab === "Price Analysis" && (
          <PriceAnalysis price_intelligence_data={price_intelligence_data} />
        )}
        {activeTab === "Variants & Formats" && (
          <Variants variants_data={variants_data} />
        )}
        {activeTab === "Competitors" && (
          <Competitors competitor_data={competitor_data} />
        )}
        {activeTab === "Marketing Kit" && (
          <Marketingkit marketing_kit_data={marketing_kit_data} />
        )}
        {/* {activeTab === "Kpis & Actions" && <Kpis />} */}
      </div>
    </>
  );
};
export default ProductReport;
