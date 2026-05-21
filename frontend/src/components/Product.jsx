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

const ProductComponent = ({ productData, productLoading }) => {
  const [view_com, setView_com] = useState("List");

  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">My Products</h1>
        <div className="flex gap-4">
          <div className="border border-gray-300 flex gap-2 p-1 rounded">
            <button
              className={`flex items-center gap-2 py-0.5 px-2 rounded font-medium text-sm transition-all duration-300 cursor-pointer hover:bg-white ${view_com === "List" ? "bg-white" : ""}`}
              onClick={() => setView_com("List")}
            >
              <Bars3Icon className="h-5 w-5" />
              List
            </button>
            <button
              className={`flex items-center gap-2 py-0.5 px-2 rounded font-medium transition-all duration-300 cursor-pointer hover:bg-white ${view_com === "Grid" ? "bg-white" : ""}`}
              onClick={() => setView_com("Grid")}
            >
              <Squares2X2Icon className="h-5 w-5" />
              Grid
            </button>
          </div>
          <button className="border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer px-3 py-0.5 rounded font-medium">
            ↑ Import CSV
          </button>
          <button className="border border-gray-300 bg-white hover:bg-gray-100 cursor-pointer px-3 py-0.5 rounded font-medium">
            + Add Products
          </button>
        </div>
      </div>

      <p className="my-4 text-sm text-[#5F6368]">
        {productData.length || 0} products · Re-analyze any for 0.5 queries
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
        <div className="flex flex-col gap-6 mt-6">
          {productLoading ? (
            <div className="h-86.5 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {productData.length ? (
                productData?.map((item, i) => {
                  return (
                    <div
                      className="border border-[#E6E6E6] bg-white p-3 rounded-lg flex justify-between card-hover"
                      key={i}
                    >
                      <div className="flex items-center gap-5">
                        <InitialText text={item.name} />
                        <div className="flex flex-col gap-1">
                          <p className="flex gap-3">
                            <span className="text-base font-medium text-[#000000]">
                              {item.name}
                            </span>
                            <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                              {item.industry}
                            </span>
                            <span
                              className={`font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32] ${Number(item.score) >= 71 ? "bg-[#CCFFCF] text-[#2E7D32]" : Number(item.score) >= 31 ? "bg-[#FFE9C5] text-[#D48C15]" : "bg-[#FFC4C4] text-[#C62828]"}`}
                            >
                              {item?.confidence_label}
                            </span>
                          </p>
                          <p className="flex gap-2 text-xs font-regular text-[#5F6368]">
                            <span>
                              {item.monthly_supply_capacity || 0} pouches ·
                            </span>

                            <span>
                              {item.price_positioning
                                .slice(0, 2)
                                ?.map((itm, index) => {
                                  return <span key={index}>{itm}, </span>;
                                })}
                            </span>

                            <span className="flex gap-2">
                              {item.country_and_score
                                .slice(0, 5)
                                ?.map((itm, index) => {
                                  return (
                                    <span
                                      key={index}
                                      className="flex gap-2 items-center"
                                    >
                                      <span>
                                        <Flag country={itm.country} />
                                      </span>

                                      <span>{itm.score}, </span>
                                    </span>
                                  );
                                })}
                            </span>
                          </p>
                          <p className="flex gap-1 text-xs font-regular text-[#5F6368] mt-2">
                            <span className="font-medium">Last analyzed:</span>
                            <span>
                              {item.last_analyzed_at
                                ? new Date(
                                    item.last_analyzed_at,
                                  ).toLocaleDateString("en-GB", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <div>
                          <p
                            className={`text-2xl font-bold text-center text-[#2E7D32] ${Number(item.score) >= 71 ? "text-[#2E7D32]" : Number(item.score) >= 31 ? "text-[#D48C15]" : "text-[#C62828]"}`}
                          >
                            {item.score}
                          </p>
                          <p className="text-sm font-regular text-[#5F6368]">
                            Score
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={true}
                          >
                            ↻ Re-run −0.5Q
                          </button>
                          <button
                            className="border border-gray-500 py-1 px-3 rounded-lg font-medium text-sm hover:bg-gray-100 whitespace-nowrap cursor-pointer"
                            onClick={() => {
                              if (!item?.product_id) return;
                              navigate(`/full-report/${item.product_id}`);
                            }}
                          >
                            View Report →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h1 className="text-center font-medium text-xl">
                  Data not found
                </h1>
              )}
            </>
          )}
        </div>
      )}

      {view_com === "Grid" && (
        <div className="mt-6 grid grid-cols-4 gap-6">
          {productLoading ? (
            <div className="h-86.5 flex justify-center items-center col-span-4">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {productData.length ? (
                productData?.map((item, index) => {
                  return (
                    <div
                      className="border border-t-4 border-[#009A3F] p-3 rounded-lg bg-white card-hover"
                      key={index}
                    >
                      <InitialText text={item.name} />
                      <div className="mt-4 flex justify-between">
                        <div>
                          <p className="text-base text-[#000000] font-medium">
                            {item.name}
                          </p>
                          <p className="text-xs font-regular text-[#5F6368] flex gap-2">
                            <span className="whitespace-nowrap">
                              {item.monthly_supply_capacity || 0} pouches
                            </span>
                            <span>
                              {item.price_positioning
                                .slice(0, 2)
                                ?.map((itm, index) => {
                                  return <span key={index}>{itm}, </span>;
                                })}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-2xl font-bold text-center text-[#2E7D32]  ${Number(item.score) >= 71 ? "text-[#2E7D32]" : Number(item.score) >= 31 ? "text-[#D48C15]" : "text-[#C62828]"}`}
                          >
                            {item.score}
                          </p>
                          <p className="text-sm font-regular text-[#5F6368]">
                            Score
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-regular text-[#5F6368] flex flex-wrap gap-2 mt-4">
                        {item.country_and_score
                          .slice(0, 5)
                          ?.map((itm, index) => {
                            return (
                              <span
                                key={index}
                                className="flex gap-2 items-center"
                              >
                                <span>
                                  <Flag country={itm.country} />
                                </span>

                                <span>{itm.score}, </span>
                              </span>
                            );
                          })}
                      </p>
                      <div className="w-full h-1 bg-gray-300 rounded my-1">
                        <div
                          className={`h-1 rounded  ${Number(item.score) >= 71 ? "bg-[#2E7D32]" : Number(item.score) >= 31 ? "bg-[#D48C15]" : "bg-[#C62828]"}`}
                          style={{ width: `${Number(item.score)}%` }}
                        ></div>
                      </div>

                      <p className="text-xs font-regular text-[#5F6368] flex gap-2 mt-3">
                        {item.last_analyzed_at
                          ? new Date(item.last_analyzed_at).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : ""}
                      </p>
                      <div className="grid grid-cols-2 gap-5 mt-4">
                        <button
                          className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={true}
                        >
                          ↻ Re-run
                        </button>
                        <button
                          className="border border-gray-500 py-1 px-3 rounded-lg font-medium text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            if (!item?.product_id) return;
                            navigate(`/full-report/${item.product_id}`);
                          }}
                        >
                          Report →
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
            </>
          )}
        </div>
      )}
    </>
  );
};
export default ProductComponent;
