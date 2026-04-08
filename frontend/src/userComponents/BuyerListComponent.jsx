import {
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

const product_data = [
  {
    txt1: "94",
    txt2: "nh",
    txt3: "Natural Health Distributors Inc.",
    txt4: "Top match",
    txt5: " Los Angeles, California, 🇺🇸 USA Importer",
    txt6: "Distributor $5M–$20M",
    txt7: "🌿 Turmeric",
    txt8: "🌱 Ashwagandha",
  },
  {
    txt1: "94",
    txt2: "nh",
    txt3: "Natural Health Distributors Inc.",
    txt4: "Top match",
    txt5: " Los Angeles, California, 🇺🇸 USA Importer",
    txt6: "Distributor $5M–$20M",
    txt7: "🌿 Turmeric",
    txt8: "🌱 Ashwagandha",
  },
  {
    txt1: "94",
    txt2: "nh",
    txt3: "Natural Health Distributors Inc.",
    txt4: "Top match",
    txt5: " Los Angeles, California, 🇺🇸 USA Importer",
    txt6: "Distributor $5M–$20M",
    txt7: "🌿 Turmeric",
    txt8: "🌱 Ashwagandha",
  },
  {
    txt1: "94",
    txt2: "nh",
    txt3: "Natural Health Distributors Inc.",
    txt4: "Top match",
    txt5: " Los Angeles, California, 🇺🇸 USA Importer",
    txt6: "Distributor $5M–$20M",
    txt7: "🌿 Turmeric",
    txt8: "🌱 Ashwagandha",
  },
  {
    txt1: "94",
    txt2: "nh",
    txt3: "Natural Health Distributors Inc.",
    txt4: "Top match",
    txt5: " Los Angeles, California, 🇺🇸 USA Importer",
    txt6: "Distributor $5M–$20M",
    txt7: "🌿 Turmeric",
    txt8: "🌱 Ashwagandha",
  },
];

const BuyerListComponent = () => {

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Buyer List</h1>
        <div className="flex gap-4">
          <button className="border border-gray-300 bg-white px-2 py-0.5 rounded font-medium">
            ↓ Export CSV 🔒
          </button>
          <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
            ⚡ Find More Buyers
          </button>
        </div>
      </div>
      <p className="my-4 text-sm text-[#5F6368]">
        12 companies matched · Sorted by match score · Contact details on
        Venture+
      </p>
      <div className="flex justify-around my-10">
        <div>
          <p className="text-center text-xl font-medium text-[#0284C7]">12</p>
          <p className="text-center text-sm font-regular text-[#5F6368]">
            Total buyers matched
          </p>
        </div>
        <div>
          <p className="text-center text-xl font-medium text-[#2E7D32]">3</p>
          <p className="text-center text-sm font-regular text-[#5F6368]">
            Top matches (90+)
          </p>
        </div>
        <div>
          <p className="text-center text-xl font-medium text-[#000000]">🔒</p>
          <p className="text-center text-sm font-regular text-[#5F6368]">
            Contact details (Venture+)
          </p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <div className="grid w-68 grid-cols-1">
          <input
            name="search"
            type="search"
            placeholder="Search"
            className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#0284C7] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
          />
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-[#000000]"
          />
        </div>

        <div className="grid grid-cols-1">
          <select className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#0284C7] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6">
            <option>All Products</option>
            <option>Turmeric</option>
            <option>Ashwagandha</option>
            <option>Black Pepper</option>
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>

        <div className="grid grid-cols-1">
          <select
            name="location"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#0284C7] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
          >
            <option>All Countries</option>
            <option>🇺🇸 USA</option>
            <option>🇩🇪 Germany</option>
            <option>🇬🇧 UK</option>
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>

        <div className="grid grid-cols-1">
          <select
            name="location"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#0284C7] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
          >
            <option>All Types</option>
            <option>Importer</option>
            <option>Contract Mfr</option>
            <option>Distributor</option>
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-4">
        {product_data?.map((item, i) => {
          return (
            <div className="border border-[#E6E6E6] bg-white p-3 rounded-lg flex justify-between card-hover">
              <div className="flex items-center gap-5">
                <div className="border border-[#ABECAE] bg-[#F3FFF3] font-medium text-[#2E7D32] h-10.5 w-10.5 rounded-full flex justify-center items-center">
                  {item.txt1}
                </div>
                <div className="h-10 w-10 rounded-lg font-medium flex justify-center items-center bg-[#E0F5FF] uppercase">
                  {item.txt2}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="flex gap-3">
                    <span className="text-base font-medium text-[#000000]">
                      {item.txt3}
                    </span>
                    <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                      {item.txt4}
                    </span>
                  </p>
                  <p className="flex gap-2 text-xs font-regular text-[#5F6368]">
                    <span>{item.txt5} ·</span>
                    <span>{item?.txt6}</span>
                  </p>
                  <p className="flex gap-1 text-xs font-regular text-[#5F6368] mt-2">
                    <span className="font-medium text-xs py-0.5 px-2 rounded-2xl bg-gray-100 text-[#000000]">
                      {item.txt7}
                    </span>
                    <span className="font-medium text-xs py-0.5 px-2 rounded-2xl bg-gray-100 text-[#000000]">
                      {item.txt8}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
                  View Profile
                </button>
                <button className="border border-gray-500 py-1 px-3 rounded-lg font-medium text-sm">
                  Contact 🔒
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border border-[#98d6f3] flex justify-between items-center p-3 rounded-lg bg-[#E0F5FF] mt-4">
        <p className="text-sm font-regular text-[#5F6368]">
          Showing 5 of 12 buyers · <span className="font-medium">7 more</span>{" "}
          available with Venture plan
        </p>
        <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
          ↑ Upgrade to Venture — $129/mo
        </button>
      </div>
    </>
  );
};
export default BuyerListComponent;
