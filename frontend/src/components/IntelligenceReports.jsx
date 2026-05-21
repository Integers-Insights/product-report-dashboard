import { ChevronDownIcon } from "@heroicons/react/16/solid";
import {
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import InitialText from "./InitialText";
import { useEffect, useState } from "react";
import Flag from "./Flag";
import { useNavigate } from "react-router-dom";

const IntelligenceReportsComponent = ({
  allReportData,
  intelligenceReportLoading,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Intelligence Reports</h1>
        <div className="flex gap-4">
          <div className="grid grid-cols-1">
            <select className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#0284C7] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6">
              <option>All Products</option>
              <option>Turmeric</option>
              <option>Ashwagandha</option>
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </div>
          <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] cursor-pointer text-white">
            ⚡ New Run
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#5F6368]">
        {allReportData?.length ?? "--"} completed reports · Viewing reports is always free
      </p>

      <div className="flex flex-col gap-6 mt-6">
        {intelligenceReportLoading ? (
          <div className="h-86.5 flex justify-center items-center col-span-4">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {allReportData.length ? (
              allReportData?.map((item, index) => {
                return (
                  <div
                    className="border border-l-4 border-[#2E7D32] bg-white p-3 rounded-lg flex justify-between gap-5 card-hover"
                    key={index}
                  >
                    <div className="flex gap-3 items-center">
                      <InitialText text={item.title} />
                      <div>
                        <p className="text-base font-medium text-[#000000]">
                          {item.title}
                        </p>
                        <p className="flex items-center gap-2 text-xs font-regular text-[#5F6368] mt-2">
                          <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                            {item.status}
                          </span>
                          <span>
                            <Flag country={item.target_country} />
                          </span>
                          <span>{item.report_type}</span>
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
                        <p className="flex gap-2 text-xs font-regular text-[#5F6368] mt-2">
                          <span className="whitespace-nowrap">
                            Score {item.score}/100
                          </span>
                          <span className="whitespace-nowrap">
                            {item.keyword_count} keywords
                          </span>
                          <span className="whitespace-nowrap">
                            {item.buyers_count} buyers
                          </span>
                          <span className="whitespace-nowrap">
                            {item.segment_count} segments
                          </span>
                          <span>{item.summary_note}</span>
                        </p>
                        <p className="flex gap-2 mt-2">
                          <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#CCFFCF] text-[#2E7D32]">
                            Score {item.score}/100
                          </span>
                          <span className="font-medium text-sm py-0.5 px-2 rounded-2xl bg-[#E0F5FF] text-[#0284C7]">
                            {item.keyword_count} keywords
                          </span>
                          <span className="font-medium text-xs pt-1 px-2 rounded-2xl bg-gray-100 text-[#5F6368]">
                            {item.buyers_count} buyers
                          </span>
                          <span className="font-medium text-xs pt-1 px-2 rounded-2xl bg-gray-100 text-[#5F6368]">
                            {item.segment_count} segments
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] cursor-pointer text-white whitespace-nowrap"
                        onClick={() => {
                          if (!item?.product_id) return;
                          navigate(`/full-report/${item.product_id}`);
                        }}
                      >
                        Open Report
                      </button>
                      <button className="border border-gray-500 py-1 px-3 rounded-lg hover:bg-gray-100 cursor-pointer font-medium text-sm">
                        ↓ PDF 🔒
                      </button>
                      <button className="hover:bg-gray-100 py-1 px-3 rounded-lg cursor-pointer font-medium text-sm">
                        ↗ Share
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

      {/* <div className="border border-dashed border-gray-300 bg-white rounded-lg mt-6 flex justify-center items-center py-8">
        <div className="flex flex-col gap-2 items-center">
          <div className="bg-[#E0F5FF] h-10 w-10 rounded-lg flex justify-center items-center">
            <BoltIcon className="h-6 w-6 text-[#0284C7]" />
          </div>
          <p className="text-base text-[#000000] font-medium">
            Run more intelligence analyses
          </p>
          <p className="text-sm text-[#5F6368] font-regular">
            Each run generates a full report saved here. You have 73 queries
            remaining.
          </p>
          <button className="py-1 px-3 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer">
            Start New Run →
          </button>
        </div>
      </div> */}
    </>
  );
};
export default IntelligenceReportsComponent;
