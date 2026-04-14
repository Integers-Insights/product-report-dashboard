import ellipse_3 from "../assets/Ellipse 3.svg";
import ellipse_4 from "../assets/Ellipse 4.svg";
import ellipse_5 from "../assets/Ellipse 5.svg";
import ellipse_6 from "../assets/Ellipse 6.svg";
import ellipse_7 from "../assets/Ellipse 7.svg";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Flag from "./Flag";

export default function Opportunity({
  opportunity_hubData,
  recent_activityData,
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-xs card-hover">
        <div className="flex justify-between w-full">
          <div className="text-13 text-[#5F6368]">OPPORTUNITY HUB</div>
          <div className="text-[#0284C7] text-xs">
            <a href="">View All</a>
          </div>
        </div>
        {/* 1 */}
        {opportunity_hubData?.map((item, index) => {
          return (
            <div
              className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-3"
              key={index}
            >
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
                  <p className="text-[#1E1E1E] text-13">{item?.product_name}</p>
                  <p className="text-[#5F6368] text-xs">
                    {item?.buyers_count} buyers | Initiated{" "}
                    {item?.initiated_at
                      ? new Date(item.initiated_at).toLocaleDateString("en-GB")
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="flex relative w-20 h-8 gap-3">
                  {item.top_markets.slice(0, 5).map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center"
                    >
                      <Flag country={country} />
                      {/* <span>{country}</span> */}
                    </div>
                    // <div className="flex justify-center items-center rounded-full absolute left-0">
                    //   <Flag country={country} size={25} />
                    // </div>
                  ))}

                  {/* <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-0">
                    <img src={ellipse_3} alt="" />
                  </div>
                  <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-3">
                    <img src={ellipse_4} alt="" />
                  </div>
                  <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-6">
                    <img src={ellipse_5} alt="" />
                  </div>
                  <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-9">
                    <img src={ellipse_6} alt="" />
                  </div>
                  <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-12">
                    <img src={ellipse_7} alt="" />
                  </div> */}
                </div>
                <div>
                  <button
                    type="button"
                    className="rounded-full border border-[#CCFFCF] px-2 py-1 text-sm font-regular text-[#009A3F] shadow-xs hover:bg-[#F5F5F5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
                  >
                    {item?.label}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-3">
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
              <p className="text-[#1E1E1E] text-13">Ashwagandha Extract</p>
              <p className="text-[#5F6368] text-xs">
                200+ buyers | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex relative w-20 h-8">
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-0">
                <img src={ellipse_3} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-3">
                <img src={ellipse_4} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-6">
                <img src={ellipse_5} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-9">
                <img src={ellipse_6} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-12">
                <img src={ellipse_7} alt="" />
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-full border border-[#CCFFCF] px-2 py-1 text-sm font-regular text-[#009A3F] shadow-xs hover:bg-[#F5F5F5] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
              >
                Easy Win
              </button>
            </div>
          </div>
        </div> */}

        {/* 2 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Ashwagandha Extract</p>
              <p className="text-[#5F6368] text-xs">
                200+ buyers | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex relative w-20 h-8">
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-0">
                <img src={ellipse_3} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-3">
                <img src={ellipse_4} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-6">
                <img src={ellipse_5} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-9">
                <img src={ellipse_6} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-12">
                <img src={ellipse_7} alt="" />
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-full border border-[#CCFFCF] px-2 py-1 text-sm font-regular text-[#009A3F] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
              >
                Easy Win
              </button>
            </div>
          </div>
        </div> */}

        {/* 3 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Ashwagandha Extract</p>
              <p className="text-[#5F6368] text-xs">
                200+ buyers | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex relative w-20 h-8">
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-0">
                <img src={ellipse_3} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-3">
                <img src={ellipse_4} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-6">
                <img src={ellipse_5} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-9">
                <img src={ellipse_6} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-12">
                <img src={ellipse_7} alt="" />
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-full border border-[#FFC4C4] px-2 py-1 text-sm font-regular text-[#C62828] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
              >
                No Demand
              </button>
            </div>
          </div>
        </div> */}

        {/* 4 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Ashwagandha Extract</p>
              <p className="text-[#5F6368] text-xs">
                200+ buyers | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex relative w-20 h-8">
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-0">
                <img src={ellipse_3} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-3">
                <img src={ellipse_4} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-6">
                <img src={ellipse_5} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-9">
                <img src={ellipse_6} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-12">
                <img src={ellipse_7} alt="" />
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-full border border-[#CCFFCF] px-2 py-1 text-sm font-regular text-[#009A3F] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
              >
                Easy Win
              </button>
            </div>
          </div>
        </div> */}

        {/* 5 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Ashwagandha Extract</p>
              <p className="text-[#5F6368] text-xs">
                200+ buyers | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex relative w-20 h-8">
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-0">
                <img src={ellipse_3} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-3">
                <img src={ellipse_4} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-6">
                <img src={ellipse_5} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-9">
                <img src={ellipse_6} alt="" />
              </div>
              <div className="flex justify-center items-center h-8 w-8 rounded-full absolute left-12">
                <img src={ellipse_7} alt="" />
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-full border border-[#FFE9C5] px-2 py-1 text-sm font-regular text-[#D48C15] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
              >
                Less Demand
              </button>
            </div>
          </div>
        </div> */}
      </div>

      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-xs card-hover">
        <div className="w-full">
          <div className="text-13 text-[#5F6368]">RECENT ACTIVITY</div>
        </div>

        {/* 1 */}

        {recent_activityData?.map((itm, index) => {
          return (
            <div
              className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-3"
              key={index}
            >
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
                  <p className="text-[#1E1E1E] text-13">{itm.activity}</p>
                  <p className="text-[#5F6368] text-xs">
                    {itm.products?.map((prod, i) => {
                      return (
                        <span key={i}>
                          <span className="mr-1">{prod.product_name}</span>(
                          <span>{prod.country}</span>)
                          {i !== itm.products.length - 1 && ", "}
                        </span>
                      );
                    })}
                    <span>
                            {itm?.created_at
                              ? " | Initiated " +
                                new Date(itm.created_at).toLocaleDateString(
                                  "en-GB",
                                )
                              : ""}
                          </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div>
                  <button
                    type="button"
                    className="rounded-sm bg-[#B6E7FF] px-2 py-1 text-sm font-regular text-[#008ACB] shadow-xs hover:bg-[#9FDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FDBFF] cursor-pointer"
                  >
                    {itm.label}
                  </button>
                </div>
                <div className="py-1.5 px-2">
                  <ChevronRightIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}

        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-3">
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
              <p className="text-[#1E1E1E] text-13">Intelligence run</p>
              <p className="text-[#5F6368] text-xs">
                Organic Turmeric Powder, USA | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <button
                type="button"
                className="rounded-sm bg-[#B6E7FF] px-2 py-1 text-sm font-regular text-[#008ACB] shadow-xs hover:bg-[#9FDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FDBFF] cursor-pointer"
              >
                In Progress
              </button>
            </div>
            <div className="py-1.5 px-2">
              <ChevronRightIcon className="h-5 w-5" />
            </div>
          </div>
        </div> */}

        {/* 2 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Intelligence run</p>
              <p className="text-[#5F6368] text-xs">
                Organic Turmeric Powder, USA | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <button
                type="button"
                className="rounded-sm bg-[#FFE9C5] px-2 py-1 text-sm font-regular text-[#D48C15] shadow-xs hover:bg-[#FFDFA3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFDFA3] cursor-pointer"
              >
                Pending
              </button>
            </div>
            <div className="py-1.5 px-2">
              <ChevronRightIcon className="h-5 w-5" />
            </div>
          </div>
        </div> */}

        {/* 3 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Intelligence run</p>
              <p className="text-[#5F6368] text-xs">
                Organic Turmeric Powder, USA | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <button
                type="button"
                className="rounded-sm bg-[#CCFFCF] px-2 py-1 text-sm font-regular text-[#2E7D32] shadow-xs hover:bg-[#B3F5B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B3F5B8] cursor-pointer"
              >
                Complete
              </button>
            </div>
            <div className="py-1.5 px-2">
              <ChevronRightIcon className="h-5 w-5" />
            </div>
          </div>
        </div> */}

        {/* 4 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Intelligence run</p>
              <p className="text-[#5F6368] text-xs">
                Organic Turmeric Powder, USA | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <button
                type="button"
                className="rounded-sm bg-[#B6E7FF] px-2 py-1 text-sm font-regular text-[#008ACB] shadow-xs hover:bg-[#9FDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9FDBFF] cursor-pointer"
              >
                In Progress
              </button>
            </div>
            <div className="py-1.5 px-2">
              <ChevronRightIcon className="h-5 w-5" />
            </div>
          </div>
        </div> */}

        {/* 5 */}
        {/* <div className="border-b-1 border-[#E0F5FF] pb-1.5 flex justify-between items-center mt-2.5">
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
              <p className="text-[#1E1E1E] text-13">Intelligence run</p>
              <p className="text-[#5F6368] text-xs">
                Organic Turmeric Powder, USA | Initiated 1m 32s ago
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <button
                type="button"
                className="rounded-sm bg-[#FFE9C5] px-2 py-1 text-sm font-regular text-[#D48C15] shadow-xs hover:bg-[#FFDFA3] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFDFA3] cursor-pointer"
              >
                Pending
              </button>
            </div>
            <div className="py-1.5 px-2">
              <ChevronRightIcon className="h-5 w-5" />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
