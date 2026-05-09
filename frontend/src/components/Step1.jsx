import {
  GlobeAltIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowUpCircleIcon,
  ShieldCheckIcon,
  ChartBarSquareIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import CircularProgress from "./CircularProgress";
import { useState } from "react";
import { base_url1 } from "../URL";

const Step1 = ({
  nextStep,
  url,
  setUrl,
  agree1,
  setAgree1,
  agree2,
  setAgree2,
  loading1,
  handleFetchProducts,
}) => {
  return (
    <>
      <h1 className="text-[28px] font-semibold text-[#000000]">
        Discover Products
      </h1>
      <p className="text-13 text-[#5F6368]">
        Add your products via website, CSV, or manually. We'll fetch and enrich
        them automatically.
      </p>

      <div className="mt-4">
        <div className="grid grid-cols-[1fr_326px] gap-6">
          {/* Left Top */}
          <div className="border border-[#E6E6E6] rounded-xl bg-[#FFFFFF] p-4 card-hover">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md border border-[#0284C7] px-3 py-2 text-sm font-medium text-[#0284C7] shadow-xs hover:bg-[#F5F5F5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
              >
                <GlobeAltIcon aria-hidden="true" className="-ml-0.5 size-5" />
                Website
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md border border-[#E6E6E6] px-3 py-2 text-sm font-medium text-[#9FA2A6] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] cursor-not-allowed"
              >
                <ArrowUpTrayIcon
                  aria-hidden="true"
                  className="-ml-0.5 size-5"
                />
                Upload CSV
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-x-1.5 rounded-md border border-[#E6E6E6] px-3 py-2 text-sm font-medium text-[#9FA2A6] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] cursor-not-allowed"
              >
                <PencilIcon aria-hidden="true" className="-ml-0.5 size-5" />
                Enter Manually
              </button>
            </div>

            <div className="mt-4">
              <label
                htmlFor="company-website"
                className="block text-sm/6 font-light text-[#001413]"
              >
                Enter website or product page URL
              </label>
              <div>
                <div className="flex items-center rounded-md bg-white pl-1 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#0284C7]">
                  {/* <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                    https://
                  </div> */}
                  <input
                    id="company-website"
                    name="company-website"
                    type="text"
                    placeholder="https://www.example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <p className="text-[#000000] text-sm font-light mt-4">
              We'll scan product pages and extract names, descriptions,
              packaging and pricing automatically.
            </p>

            <div className="mt-4">
              <fieldset>
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-4 grid-cols-1">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          checked={agree1}
                          onChange={(e) => setAgree1(e.target.checked)}
                          aria-describedby="comments-description"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 14 14"
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                          />
                          <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-sm/6">
                      <label
                        htmlFor="comments"
                        className="text-sm text-[#001413]"
                      >
                        By clicking Fetch Products I allow INTRADE24 to process
                        this URL to generate market intelligence for my personal
                        use. I agree to the
                        <span className="text-[#0284C7]">
                          {" "}
                          Terms & Conditions{" "}
                        </span>
                        and
                        <span className="text-[#0284C7]"> Privacy Policy</span>.
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-4 grid-cols-1">
                        <input
                          id="candidates"
                          required
                          name="candidates"
                          type="checkbox"
                          checked={agree2}
                          onChange={(e) => setAgree2(e.target.checked)}
                          aria-describedby="candidates-description"
                          className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                        />
                        <svg
                          fill="none"
                          viewBox="0 0 14 14"
                          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                        >
                          <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                          />
                          <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-sm/6">
                      <label
                        htmlFor="candidates"
                        className="text-sm text-[#001413]"
                      >
                        I understand fetched data may be incomplete and I will
                        validate it before analysis begins.
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex gap-2.5 items-center mt-6">
              <div>
                {/* <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-[#0284C7] px-3 py-2 text-base font-semibold text-white shadow-xs
                   hover:bg-[#0273AE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0273AE] cursor-pointer"
                  onClick={nextStep}
                >
                  Fetch Products
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="-mr-0.5 size-5"
                  />
                </button> */}

                <button
                  type="button"
                  disabled={!agree1 || !agree2 || loading1}
                  onClick={handleFetchProducts}
                  className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-base font-semibold text-white shadow-xs ${!agree1 || !agree2 || loading1 ? "bg-gray-400 cursor-not-allowed" : "bg-[#0284C7] hover:bg-[#0273AE] cursor-pointer"}`}
                >
                  {loading1 ? "Fetching..." : "Fetch Products"}
                </button>
              </div>
              <div>Uses 1 credit per product</div>
            </div>
          </div>

          {/* Right Full */}
          <div className="border border-[#E6E6E6] row-span-2 rounded-xl bg-[#FFFFFF] p-4 card-hover">
            <div>
              <h1 className="text-[#5F6368] text-xs font-light">
                WHAT YOU’LL GET
              </h1>
              <div className="flex gap-3 mt-3">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <UsersIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Matched buyers
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    Companies actively sourcing your product, ranked by fit
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Market opportunities
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    Countries scored by demand, competition, and your product
                    fit
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Keyword gaps
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    B2B search terms buyers use that your competitors miss
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-4 bg-[#E6E6E6] h-[1px]" />

            <div>
              <h1 className="text-[#5F6368] text-xs font-light">
                EXAMPLE RESULT
              </h1>
            </div>

            <div className="mt-3 flex gap-3 bg-[rgba(202,218,226,0.30)] p-3 rounded-lg">
              <div>
                <CircularProgress
                  value={82}
                  progressColor="#22c55e"
                  textColor="#065f46"
                  bgColor="#d1fae5"
                />
              </div>
              <div>
                <div className="text-[#1E1E1E] text-sm font-medium">
                  Organic Turmeric Powder
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  <button
                    type="button"
                    className="rounded-sm bg-[#CCFFCF] px-2 py-1 text-xs font-light text-[#2E7D32] shadow-xs hover:bg-[#B8F5BC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8F5BC]"
                  >
                    4 Easy Win Markets
                  </button>
                  <button
                    type="button"
                    className="rounded-sm bg-[#B6E7FF] px-2 py-1 text-xs font-light text-[#008ACB] shadow-xs hover:bg-[#9FDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FDBFF]"
                  >
                    200+ buyers
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-[#E6E6E6] grid grid-cols-3 rounded-lg mt-4">
              <div className="py-2 text-center">
                <h2 className="flex gap-1 justify-center text-[#2E7D32] text-base font-medium">
                  <ArrowUpCircleIcon className="h-5 w-5" />
                  18%
                </h2>
                <p className="text-[#000000] text-xs font-light">YoY demand</p>
              </div>
              <div className="border-r border-[#E6E6E6] border-l py-2 text-center">
                <h2 className="text-[#1E1E1E] text-base font-medium">34</h2>
                <p className="text-[#000000] text-xs font-light">Keywords</p>
              </div>
              <div className="py-2 text-center">
                <h2 className="text-[#1E1E1E] text-base font-medium">
                  $8 - 16
                </h2>
                <p className="text-[#000000] text-xs font-light">YoY demand</p>
              </div>
            </div>

            <ul className="list-disc text-[#000000] text-xs font-light ml-4 mt-4">
              <li>
                You review all extracted data before any analysis runs. Nothing
                is final until you confirm.
              </li>
            </ul>

            <hr className="my-4 bg-[#E6E6E6] h-[1px]" />

            <div>
              <h1 className="text-[#5F6368] text-xs font-light">
                WHY TRUST US
              </h1>
              <div className="flex gap-3 mt-3">
                <div className="bg-[#CCFFCF] h-7.5 p-1.5 flex justify-center items-center text-[#2E7D32] rounded-sm">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Your data stays yours
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    We never sell, share, or use your product data to train
                    models. It's yours alone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#FFE9C5] h-7.5 p-1.5 flex justify-center items-center text-[#D48C15] rounded-sm">
                  <ChartBarSquareIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Real trade data sources
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    We pull from live customs records, B2B portals, and verified
                    trade databases - not scraped guesses.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#FFC4C4] h-7.5 p-1.5 flex justify-center items-center text-[#C62828] rounded-sm">
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Encrypted and secure
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    All data is encrypted in transit and at rest. We are SOC 2
                    compliant and GDPR ready.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Bottom */}
          <div className="rounded-xl card-hover">
            <div className="rounded-lg border border-[#E6E6E6] bg-white p-4 shadow-xs">
              <div className="w-full">
                <div className="text-13 text-[#5F6368]">PAST DISCOVERIES</div>
              </div>

              {/* 1 */}
              <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-3">
                <div className="flex gap-3 items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <circle cx="4" cy="4" r="4" fill="#E6E6E6" />
                      <circle cx="4" cy="4" r="2" fill="#5F6368" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1E1E1E] text-13">
                      Alpha-Lipoic Acid Capsules
                    </p>
                    <p className="text-[#5F6368] text-xs">
                      Sourced from Germany | In Progress 45s ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <button
                      type="button"
                      className="rounded-sm bg-[#FFE9C5] px-2 py-1 text-sm font-regular text-[#D48C15] shadow-xs hover:bg-[#FFDFAF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFDFAF] cursor-pointer"
                    >
                      Pending
                    </button>
                  </div>
                  <div className="py-1.5 px-2">
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* 2 */}
              <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
                <div className="flex gap-3 items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <circle cx="4" cy="4" r="4" fill="#E6E6E6" />
                      <circle cx="4" cy="4" r="2" fill="#5F6368" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1E1E1E] text-13">Omega-3 Fish Oil</p>
                    <p className="text-[#5F6368] text-xs">
                      Wild-Caught, Norway | Completed 3m 12s ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <button
                      type="button"
                      className="rounded-sm bg-[#CCFFCF] px-2 py-1 text-sm font-regular text-[#2E7D32] shadow-xs hover:bg-[#B8F5BC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8F5BC] cursor-pointer"
                    >
                      Complete
                    </button>
                  </div>
                  <div className="py-1.5 px-2">
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* 3 */}
              <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
                <div className="flex gap-3 items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <circle cx="4" cy="4" r="4" fill="#E6E6E6" />
                      <circle cx="4" cy="4" r="2" fill="#5F6368" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1E1E1E] text-13">
                      Ginger Root Extract
                    </p>
                    <p className="text-[#5F6368] text-xs">
                      Organic, India | Initiated 10m 5s ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <button
                      type="button"
                      className="rounded-sm bg-[#B6E7FF] px-2 py-1 text-sm font-regular text-[#008ACB] shadow-xs hover:bg-[#A0DCFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A0DCFF] cursor-pointer"
                    >
                      In Progress
                    </button>
                  </div>
                  <div className="py-1.5 px-2">
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* 4 */}
              <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
                <div className="flex gap-3 items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <circle cx="4" cy="4" r="4" fill="#E6E6E6" />
                      <circle cx="4" cy="4" r="2" fill="#5F6368" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1E1E1E] text-13">Ashwagandha Powder</p>
                    <p className="text-[#5F6368] text-xs">
                      Adaptogenic, India | Scheduled 1h 15m ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <button
                      type="button"
                      className="rounded-sm bg-[#FFE9C5] px-2 py-1 text-sm font-regular text-[#D48C15] shadow-xs hover:bg-[#FFE0B0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE0B0] cursor-pointer"
                    >
                      Pending
                    </button>
                  </div>
                  <div className="py-1.5 px-2">
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* 5 */}
              <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
                <div className="flex gap-3 items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <circle cx="4" cy="4" r="4" fill="#E6E6E6" />
                      <circle cx="4" cy="4" r="2" fill="#5F6368" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1E1E1E] text-13">Biotin Gummies</p>
                    <p className="text-[#5F6368] text-xs">
                      Vegan, USA | In Progress 22m 30s ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <button
                      type="button"
                      className="rounded-sm bg-[#FFE9C5] px-2 py-1 text-sm font-regular text-[#D48C15] shadow-xs hover:bg-[#FFE0B3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE0B3] cursor-pointer"
                    >
                      Pending
                    </button>
                  </div>
                  <div className="py-1.5 px-2">
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* 6 */}
              <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
                <div className="flex gap-3 items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                    >
                      <circle cx="4" cy="4" r="4" fill="#E6E6E6" />
                      <circle cx="4" cy="4" r="2" fill="#5F6368" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#1E1E1E] text-13">Probiotic Blend</p>
                    <p className="text-[#5F6368] text-xs">
                      Multi-strain, Canada | Initiated 30s ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <button
                      type="button"
                      className="rounded-sm bg-[#B6E7FF] px-2 py-1 text-sm font-regular text-[#008ACB] shadow-xs hover:bg-[#A3DDFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A3DDFF] cursor-pointer"
                    >
                      In Progress
                    </button>
                  </div>
                  <div className="py-1.5 px-2">
                    <ChevronRightIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <div className="text-[#0284C7] flex gap-2 items-center">
                  View all <ArrowRightIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Step1;
