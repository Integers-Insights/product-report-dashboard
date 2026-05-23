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
  BoltIcon,
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
    txt2: "Opportunity scores, YoY growth, seasonal patterns for any product x country pair.",
  },
  {
    txt1: "Variants & Price Intelligence",
    txt2: "Exact variants and prices globally - by country and currency, ready to position.",
  },
  {
    txt1: "Buyer Discovery",
    txt2: "Verified importers actively sourcing your product - emails, LinkedIn, scored.",
  },
  {
    txt1: "Trade Intelligence",
    txt2: "Real customs records, HS codes, port volumes - market sizing with hard data.",
  },
  {
    txt1: "Competitor Intel",
    txt2: "Who exports your product, what they charge, their market share - find the gaps.",
  },
  {
    txt1: "Marketing Blueprint",
    txt2: "AI-written ad copy, email sequences, landing pages - tailored per country.",
  },
];

const MarketComponent = () => {

  let userProfile = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");
  let plan = "";
  try {
    const parsed = userProfile ? JSON.parse(userProfile) : null;
    plan = parsed?.current_plan || "";
  } catch (e) {
    console.log("Invalid localStorage data");
  }

  return (
    <>
      <h1 className="text-2xl font-medium">Market Intelligence</h1>
      <p className="my-4 text-sm text-[#5F6368]">
        6 AI modules. Each runs a focused analysis for a product × country pair.
      </p>

      <div className="border border-[#98d6f3] flex justify-between items-center p-3 rounded-lg bg-[#E0F5FF]">
        <div className="flex gap-2 items-center">
          <div className="h-10 w-10 rounded-lg flex justify-center items-center">
            <BoltIcon className="h-6 w-6 text-[#0284C7]" />
          </div>
          <div>
            <p className="font-medium text-[#000000] capitalize">
              {plan || ""} Plan
            </p>
            <p className="text-xs text-[#5F6368] font-regular mt-1">
              Each run costs 0.5–1 query. Results appear within 3–5 minutes.
            </p>
            {/* <div className="flex gap-3 mt-3">
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
            </div> */}
          </div>
        </div>
        {/* <div>
          <p className="text-2xl font-bold text-right text-[#2E7D32]">82</p>
          <p className="text-sm font-regular text-[#5F6368]">Score</p>
        </div> */}
      </div>

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
            </div>
          );
        })}
      </div>
    </>
  );
};
export default MarketComponent;
