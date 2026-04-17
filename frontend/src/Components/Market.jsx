import {
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  LanguageIcon,
  BriefcaseIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  UserGroupIcon,
  SwatchIcon,
  PuzzlePieceIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import InitialText from "./InitialText";

const icons = [
  BuildingStorefrontIcon,
  LanguageIcon,
  BriefcaseIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  UserGroupIcon,
  SwatchIcon,
  PuzzlePieceIcon,
];

const market_data = [
  {
    txt1: "Market Demand",
    txt2: "Demand trends, growth rates, seasonality, and consumption signals across 50+ countries for your product.",
    txt3: "Uses 0.5Q per run",
  },
  {
    txt1: "Market Demand",
    txt2: "Demand trends, growth rates, seasonality, and consumption signals across 50+ countries for your product.",
    txt3: "Uses 0.5Q per run",
  },
  {
    txt1: "Market Demand",
    txt2: "Demand trends, growth rates, seasonality, and consumption signals across 50+ countries for your product.",
    txt3: "Uses 0.5Q per run",
  },
  {
    txt1: "Market Demand",
    txt2: "Demand trends, growth rates, seasonality, and consumption signals across 50+ countries for your product.",
    txt3: "Uses 0.5Q per run",
  },
  {
    txt1: "Market Demand",
    txt2: "Demand trends, growth rates, seasonality, and consumption signals across 50+ countries for your product.",
    txt3: "Uses 0.5Q per run",
  },
  {
    txt1: "Market Demand",
    txt2: "Demand trends, growth rates, seasonality, and consumption signals across 50+ countries for your product.",
    txt3: "Uses 0.5Q per run",
  }
];

const product_data = [
  {
    txt1: "Organic Turmeric · Market Demand",
    txt2: "🇺🇸 USA · 2 hours ago · Complete",
    txt3: "Done",
    txt4: "91",
  },
  {
    txt1: "Ashwagandha· Keyword Intel",
    txt2: "🇩🇪 Germany · Yesterday · Complete",
    txt3: "Done",
    txt4: "87",
  },
  {
    txt1: "Black Pepper · Market Demand",
    txt2: "🇯🇵 Japan · 3 days ago · Complete",
    txt3: "Stale",
    txt4: "55",
  },
];

const MarketComponent = () => {
  return (
    <>
      <h1 className="text-2xl font-medium">Market Intelligence</h1>
      <p className="my-4 text-sm text-[#5F6368]">
        6 AI modules. Each runs a focused analysis for a product × country pair.
        Active modules are always available — locked modules need Venture or
        Apex plan.
      </p>

      <div className="border border-[#98d6f3] flex justify-between items-center p-3 rounded-lg bg-[#E0F5FF]">
        <div className="flex gap-2 items-center">
          <div className="h-10 w-10 rounded-lg flex justify-center items-center">
            <BoltIcon className="h-6 w-6 text-[#0284C7]" />
          </div>
          <div>
            <p className="font-medium text-[#000000]">
              Scout Plan — 2 modules active
            </p>
            <p className="text-xs text-[#5F6368] font-regular mt-1">
              Each run costs 0.5–1 query. Results appear within 3–5 minutes.
              Upgrade to Venture to unlock all 6 modules simultaneously.
            </p>
            <div className="flex gap-3 mt-3">
              <button className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                ✓ Market Demand
              </button>
              <button className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                ✓ Keyword Intel
              </button>
              <button className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#FFE9C5] text-[#D48C15]">
                🔒 4 modules locked
              </button>
              <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer">
                Unlock All →
              </button>
            </div>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-right text-[#2E7D32]">82</p>
          <p className="text-sm font-regular text-[#5F6368]">Score</p>
        </div>
      </div>

      {/* <div className="bg-[#E0F5FF] h-10 w-10 rounded-lg flex justify-center items-center">
            <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 text-[#0284C7]" />
          </div> */}

      <div className="mt-6 grid grid-cols-3 gap-6">
        {market_data?.map((item, index) => {
          const Icon = icons[index];

          return (
            <div
              className="border border-[#E6E6E6] p-3 rounded-lg bg-[#FFFFFF] card-hover"
              key={index}
            >
              <div className="flex justify-between">
                <div className="bg-[#E0F5FF] h-10 w-10 rounded-lg flex justify-center items-center">
                  <Icon className="h-6 w-6 text-[#0284C7]" />
                </div>
                <button className="py-0.5 h-6 px-2 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
                  Active
                </button>
              </div>
              <p className="font-medium my-2">{item.txt1}</p>
              <p className="text-xs font-regular text-[#5F6368]">{item.txt2}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs font-regular text-[#5F6368]">
                  {item.txt3}
                </p>
                <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] cursor-pointer text-white">
                  Run →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* <p className="flex justify-between mt-4">
        <span className="text-sm font-medium text-[#5F6368]">
          Recent Module Runs
        </span>
        <span className="text-sm font-medium text-[#0284C7] hover:text-[#0475ad]">
          <Link to={"#"}>View all reports →</Link>
        </span>
      </p> */}

      {/* <div className="border border-[#E6E6E6] bg-white mt-4 p-3 rounded-lg">
        <p className="flex justify-between">
          <span className="text-sm font-medium text-[#5F6368]">
            Product · Module · Market
          </span>
          <span className="text-sm font-medium text-[#5F6368]">Score</span>
        </p>
        <hr className="h-[1px] bg-[#E6E6E6] border-0 mt-2" />

        {product_data?.map((itm, i) => {
          return (
            <div key={i}>
              <div className="flex justify-between items-center pb-3 mt-3 card-hover">
                <div className="flex gap-2 items-center">
                  <InitialText text={itm.txt1} />
                  <div>
                    <p className="text-sm font-medium text-[#000000]">
                      {itm.txt1}
                    </p>
                    <p className="text-xs font-regular text-[#5F6368]">
                      {itm.txt2}
                    </p>
                  </div>
                </div>
                <div className="flex gap-10">
                  <span className="border text-sm font-medium text-[#2E7D32] bg-[#CCFFCF] px-2 pt-[3px] rounded-2xl">
                    {itm.txt3}
                  </span>
                  <span className="text-xl font-medium text-[#2E7D32]">
                    {itm.txt4}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div> */}
    </>
  );
};
export default MarketComponent;
