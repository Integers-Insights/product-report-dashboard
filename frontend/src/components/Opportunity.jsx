import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Flag from "./Flag";
import {Link} from 'react-router-dom';

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
            <Link to={"/product"}>View All</Link>
          </div>
        </div>
        {opportunity_hubData?.slice(0,10)?.map((item, index) => {
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
                    <div key={index} className="flex items-center">
                      <Flag country={country} />
                    </div>
                  ))}
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
      </div>

      <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-xs card-hover">
        <div className="w-full">
          <div className="text-13 text-[#5F6368]">RECENT ACTIVITY</div>
        </div>
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
                          new Date(itm.created_at).toLocaleDateString("en-GB")
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
      </div>
    </div>
  );
}
