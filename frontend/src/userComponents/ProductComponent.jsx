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
    txt1: "Organic Turmeric Powder",
    txt2: "Nutraceutical",
    txt3: "High confidence",
    txt4: "500g pouches",
    txt5: "GMP",
    txt6: "USDA Organic",
    txt7: "🇺🇸 91",
    txt8: "🇩🇪 82",
    txt9: "🇬🇧 79",
    txt10: "Today, 2 hrs ago March 11, 2026 09:14",
    txt11: "82",
  },
  {
    txt1: "Organic Turmeric Powder",
    txt2: "Nutraceutical",
    txt3: "High confidence",
    txt4: "500g pouches",
    txt5: "GMP",
    txt6: "USDA Organic",
    txt7: "🇺🇸 91",
    txt8: "🇩🇪 82",
    txt9: "🇬🇧 79",
    txt10: "Today, 2 hrs ago March 11, 2026 09:14",
    txt11: "82",
  },
  {
    txt1: "Organic Turmeric Powder",
    txt2: "Nutraceutical",
    txt3: "High confidence",
    txt4: "500g pouches",
    txt5: "GMP",
    txt6: "USDA Organic",
    txt7: "🇺🇸 91",
    txt8: "🇩🇪 82",
    txt9: "🇬🇧 79",
    txt10: "Today, 2 hrs ago March 11, 2026 09:14",
    txt11: "82",
  },
  {
    txt1: "Organic Turmeric Powder",
    txt2: "Nutraceutical",
    txt3: "High confidence",
    txt4: "500g pouches",
    txt5: "GMP",
    txt6: "USDA Organic",
    txt7: "🇺🇸 91",
    txt8: "🇩🇪 82",
    txt9: "🇬🇧 79",
    txt10: "Today, 2 hrs ago March 11, 2026 09:14",
    txt11: "82",
  },
];

const ProductComponent = () => {
  const [view_com, setView_com] = useState("List");

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">My Products</h1>
        <div className="flex gap-4">
          <div className="border border-gray-300 flex gap-2 p-1 rounded">
            <button
              className={`flex items-center gap-2 py-0.5 px-1 rounded font-medium transition-all duration-300 cursor-pointer ${view_com === "List" ? "bg-white" : ""}`}
              onClick={() => setView_com("List")}
            >
              <Bars3Icon className="h-5 w-5" />
              List
            </button>
            <button
              className={`flex items-center gap-2 py-0.5 px-1 rounded font-medium transition-all duration-300 cursor-pointer ${view_com === "Grid" ? "bg-white" : ""}`}
              onClick={() => setView_com("Grid")}
            >
              <Squares2X2Icon className="h-5 w-5" />
              Grid
            </button>
          </div>
          <button className="border border-gray-300 bg-white px-2 py-0.5 rounded font-medium">
            ↑ Import CSV
          </button>
          <button className="border border-gray-300 bg-white px-2 py-0.5 rounded font-medium">
            + Add Products
          </button>
        </div>
      </div>

      <p className="my-4 text-sm text-[#5F6368]">
        4 products · Re-analyze any for 0.5 queries
      </p>

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
            <option>All Categories</option>
            <option>Nutraceuticals</option>
            <option>Agriculture</option>
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
            <option>All Status</option>
            <option>Analyzed</option>
            <option>Pending</option>
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>
      </div>

      {view_com === "List" && (
        <div className="flex flex-col gap-3 mt-4">
          {product_data?.map((item, i) => {
            return (
              <div className="border border-[#E6E6E6] bg-white p-3 rounded-lg flex justify-between card-hover">
                <div className="flex items-center gap-5">
                  <div className="border border-gray-500 h-10 w-10 rounded-lg flex justify-center items-center">
                    <Squares2X2Icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="flex gap-3">
                      <span className="text-base font-medium text-[#000000]">
                        {item.txt1}
                      </span>
                      <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                        {item.txt2}
                      </span>
                      <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                        {item?.txt3}
                      </span>
                    </p>
                    <p className="flex gap-2 text-xs font-regular text-[#5F6368]">
                      <span>{item.txt4} ·</span>
                      <span>{item.txt5} ·</span>
                      <span>{item?.txt6} ·</span>
                      <span>{item?.txt7} ·</span>
                      <span>{item?.txt8} ·</span>
                      <span>{item?.txt9}</span>
                    </p>
                    <p className="flex gap-1 text-xs font-regular text-[#5F6368] mt-2">
                      <span className="font-medium">Last analyzed:</span>
                      <span>{item.txt10}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-2xl font-bold text-center text-[#2E7D32]">
                      {item.txt11}
                    </p>
                    <p className="text-sm font-regular text-[#5F6368]">Score</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
                      ↻ Re-run −0.5Q
                    </button>
                    <button className="border border-gray-500 py-1 px-3 rounded-lg font-medium text-sm">
                      View Report →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view_com === "Grid" && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {product_data?.map((item, index) => {
            return (
              <div className="border border-t-4 border-[#009A3F] p-3 rounded-lg bg-white card-hover">
                <div className="border border-gray-500 h-10 w-10 flex justify-center items-center rounded-lg">
                  <Squares2X2Icon className="h-6 w-6" />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-base text-[#000000] font-medium">
                      {item.txt1}
                    </p>
                    <p className="text-xs font-regular text-[#5F6368] flex gap-2">
                      <span>{item.txt4}</span>
                      <span>{item.txt5}</span>
                      <span>{item.txt6}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-center text-[#2E7D32]">
                      {item.txt11}
                    </p>
                    <p className="text-sm font-regular text-[#5F6368]">Score</p>
                  </div>
                </div>
                <p className="text-xs font-regular text-[#5F6368] flex flex-wrap gap-2 mt-4">
                  <span>{item.txt7}</span>
                  <span>{item.txt8}</span>
                  <span>{item.txt9}</span>
                </p>
                <div className="w-full h-1 bg-gray-300 rounded my-1">
                  <div
                    className="h-1 bg-[#0284C7] rounded"
                    style={{ width: "82%" }}
                  ></div>
                </div>

                <p className="text-xs font-regular text-[#5F6368] flex gap-2 mt-3">
                  {item.txt10}
                </p>
                <div className="grid grid-cols-2 gap-5 mt-4">
                  <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] text-white">
                    ↻ Re-run
                  </button>
                  <button className="border border-gray-500 py-1 px-3 rounded-lg font-medium text-sm">
                    Report →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
export default ProductComponent;
