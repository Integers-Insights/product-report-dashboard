import {
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import InitialText from "./InitialText";
import Flag from "./Flag";
import { useNavigate } from "react-router-dom";

const BuyerListComponent = ({
  buyer_list,
  total_b2b_buyers_data,
  fetchingBuyerData,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Buyer List</h1>
        <div className="flex gap-4">
          <button className="border border-gray-300 bg-white hover:bg-gray-100 px-3 py-1 rounded-lg font-medium cursor-pointer">
            ↓ Export CSV 🔒
          </button>
          <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer">
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
          <p className="text-center text-xl font-medium text-[#0284C7]">
            {total_b2b_buyers_data || 0}
          </p>
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
      {fetchingBuyerData ? (
        <div className="h-86.5 flex justify-center items-center col-span-4">
          <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          {buyer_list.length ? (
            buyer_list?.map((item, i) => {
              if (item?.masked) {
                return (
                  <div
                    className="border flex justify-between p-3 border-[#E6E6E6] rounded-lg card-hover"
                    key={i}
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
                        </div>
                        <div className="text-xs font-light text-[#5F6368] flex gap-5 blur-sm">
                          <p>Contract Manufacturer</p>
                          <p>Annual spend $2M–8M</p>
                          <p>Requires GMP + Organic</p>
                          <p>New Jersey, USA</p>
                        </div>
                        <p className="text-sm font-regular text-[#5F6368] blur-sm">
                          They likely source Pear Shaped Water Dissolving Film
                          from India for their water-soluble film production,
                          indicating a strong relevance in volume and frequency
                          of use.
                        </p>
                      </div>
                    </div>
                    <div>
                      <button
                        className="text-[#A66A07] bg-[#FFF8EE] rounded-2xl px-2 py-1 whitespace-nowrap"
                        onClick={() => navigate("/pricing")}
                      >
                        🔒 Venture+
                      </button>
                    </div>
                  </div>
                );
              }

              const score = Math.max(
                0,
                Math.min(10, item.relevance_score ?? 0),
              );

              const textColor =
                score >= 7
                  ? "text-[#009A3F]"
                  : score >= 3
                    ? "text-[#D48C15]"
                    : "text-[#C62828]";

              const bgColor =
                score >= 7
                  ? "bg-[#CCFFCF]"
                  : score >= 3
                    ? "bg-[#FFF1DA]"
                    : "bg-[#FFC4C4]";

              return (
                <div
                  className="border border-[#E6E6E6] bg-white p-3 rounded-lg flex justify-between card-hover"
                  key={i}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`border ${bgColor} font-medium ${textColor} h-10.5 w-10.5 rounded-full flex justify-center items-center`}
                    >
                      {score}
                    </div>
                    <div className="h-10 w-10 rounded-lg font-medium flex justify-center items-center bg-[#E0F5FF] uppercase">
                      <InitialText text={item?.company_name} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="flex gap-3 items-center">
                        <span className="text-base font-medium text-[#000000]">
                          {item?.company_name || ""}
                        </span>
                        <span>
                          <Flag country={item.country} />
                        </span>
                      </p>
                      <p className="flex gap-2 text-xs font-regular text-[#5F6368]">
                        <span>{item.contact} </span>
                        <span>{item?.buyer_type}</span>
                      </p>
                      <p className="text-xs font-regular text-[#5F6368]">
                        {item.notes}
                      </p>
                      <p className="flex gap-1 text-xs font-regular text-[#5F6368] mt-2">
                        <span className="font-medium text-xs py-0.5 px-2 rounded-2xl bg-gray-100 text-[#000000]">
                          {item.product_name}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] cursor-pointer text-white"
                      onClick={() => {
                        if (!item?.product_id) return;
                        navigate(`/full-report/${item.product_id}`);
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      className="border border-gray-500 py-1 px-3 rounded-lg hover:bg-gray-100 cursor-pointer font-medium text-sm"
                      onClick={() => navigate("/contact")}
                    >
                      Contact 🔒
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-center font-medium text-xl col-span-4">
              Data not found
            </h1>
          )}
        </div>
      )}
      <div className="border border-[#98d6f3] flex justify-between items-center p-3 rounded-lg bg-[#E0F5FF] mt-6">
        <p className="text-sm font-regular text-[#5F6368]">
          Showing 5 of 12 buyers · <span className="font-medium">7 more</span>{" "}
          available with Venture plan
        </p>
        <button
          className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] cursor-pointer text-white"
          onClick={() => navigate("/pricing")}
        >
          ↑ Upgrade to Venture — $129/mo
        </button>
      </div>
    </>
  );
};
export default BuyerListComponent;
