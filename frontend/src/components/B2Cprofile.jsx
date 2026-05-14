import {
  ArrowDownIcon,
  LightBulbIcon,
  UserIcon,
  GlobeAltIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { PiGlobeXLight, PiGlobeLight } from "react-icons/pi";

const B2Cprofile = ({ b2c }) => {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <div className="flex gap-3 items-center">
            <span>
              <UserIcon className="h-5 w-5" />
            </span>
            <span className="text-xl font-medium text-[#000000]">
              Consumer Segment
            </span>
            <span className="bg-[#f0fcff] text-[#0284C7] text-xs font-medium px-2 py-0.5 rounded-2xl">
              B2C Profile
            </span>
          </div>
          <p className="text-[#5F6368] text-13 font-regular">
            Primary buyer profile for Organic Turmeric in the US supplement
            market
          </p>
        </div>
        <div>
          <p className="text-right text-2xl font-bold text-[#0284C7]">~12M</p>
          <p className="text-[#5F6368] text-13 font-regular">
            addressable consumers · USA
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-6 bg-white">
        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368]">
            {b2c?.consumer_profile?.consumer_segment?.age_group ?? "--"}
          </p>
        </div>

        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368]">
            {b2c?.consumer_profile?.consumer_segment?.gender_skew ?? "--"}
          </p>
        </div>

        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368]">
            {b2c?.consumer_profile?.consumer_segment?.income_bracket ?? "--"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6 bg-white">
        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368]">Lifestyle</p>
          <p className="flex flex-wrap gap-1.5">
            {b2c?.consumer_profile?.consumer_segment?.lifestyle_tags?.map(
              (item, i) => {
                return (
                  <span
                    className="bg-[#f0fcff] text-[#0284C7] text-xs font-medium px-2 py-0.5 rounded-2xl"
                    key={i}
                  >
                    {item}
                  </span>
                );
              },
            )}
          </p>
        </div>
        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368]">Motivations</p>
          <p className="flex flex-wrap gap-1.5">
            {b2c?.consumer_profile?.consumer_segment?.purchase_motivation?.map(
              (item, i) => {
                return (
                  <span
                    className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl"
                    key={i}
                  >
                    {item}
                  </span>
                );
              },
            )}
          </p>
        </div>
      </div>

      <p className="text-sm font-medium text-[#5F6368] mt-6">Where they buy</p>

      <div className="mt-2 grid grid-cols-3 gap-6 bg-white">
        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368] flex gap-1">
            <span>
              <PiGlobeLight className="h-5 w-5" />
            </span>
            <span>Online</span>
          </p>
          <ul className="list-disc ml-6 text-sm">
            {b2c?.purchase_channels?.online?.map((itm, i) => {
              return <li key={i}>{itm}</li>;
            })}
          </ul>
        </div>

        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368] flex gap-1">
            <span>
              <PiGlobeXLight className="h-5 w-5" />
            </span>
            <span>Offline</span>
          </p>
          <ul className="list-disc ml-6 text-sm">
            {b2c?.purchase_channels?.offline?.map((itm, i) => {
              return <li key={i}>{itm}</li>;
            })}
          </ul>
        </div>

        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover">
          <p className="text-sm font-medium text-[#5F6368] flex gap-1">
            <span>
              <UserGroupIcon className="h-5 w-5" />
            </span>
            <span>Social Commerce</span>
          </p>
          <ul className="list-disc ml-6 text-sm">
            {b2c?.purchase_channels?.social_commerce?.map((itm, i) => {
              return <li key={i}>{itm}</li>;
            })}
          </ul>
        </div>
      </div>

      <p className="text-sm font-medium text-[#5F6368] mt-6">
        Label preferences
      </p>
      <div className="grid grid-cols-2">
        <div className="mt-2">
          <p className="text-sm font-medium text-[#000000]">
            Certifications they look for
          </p>
          <p className="flex gap-1.5 mt-1.5">
            {b2c?.label_preferences?.certifications?.map((item, i) => {
              return (
                <span
                  className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl"
                  key={i}
                >
                  {item}
                </span>
              );
            })}
          </p>
        </div>

        <div className="mt-2">
          <p className="text-sm font-medium text-[#000000]">
            Key claims they respond to
          </p>
          <p className="flex gap-1.5 mt-1.5">
            {b2c?.label_preferences?.key_claims?.map((item, i) => {
              return (
                <span
                  className="bg-[#EDF9FF] text-[#0284C7] text-xs font-medium px-2 py-0.5 rounded-2xl"
                  key={i}
                >
                  {item}
                </span>
              );
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-6">
        <div>
          <p className="text-sm font-medium text-[#000000]">
            Preferred formats
          </p>
          <p className="flex gap-1.5 mt-1.5">
            {b2c?.label_preferences?.preferred_formats?.map((item, i) => {
              return (
                <span
                  className="bg-gray-100 text-[#5F6368] text-xs font-medium px-2 py-0.5 rounded-2xl"
                  key={i}
                >
                  {item}
                </span>
              );
            })}
          </p>
        </div>

        <div className="border px-3 content-center bg-[#fff5e6] text-[#D48C15] text-sm font-medium rounded-lg">
          {b2c?.label_preferences?.price_sensitivity ?? "--"}
        </div>
      </div>

      <p className="text-sm font-medium text-[#5F6368] mt-6">
        Leading brands (7) — what consumers already trust
      </p>

      <div className="grid grid-cols-3 gap-6 mt-2">
        {b2c?.leading_brands?.map((item, i) => {
          return (
            <div
              className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1 card-hover"
              key={i}
            >
              <p className="text-sm font-medium text-[#000000]">
                {item.name ?? "--"}
              </p>
              <p className="text-xs font-regular text-[#5F6368]">
                {item.positioning ?? "--"}
              </p>
              <p className="text-sm font-regular text-[#5F6368]">
                {item.notes ?? "--"}
              </p>
              <p className="text-sm font-regular text-[#0284C7]">
                <span className="font-medium">Website:</span>{" "}
                {item.website ?? "--"}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1.5 border p-3 border-[#ABECAE] bg-[#F3FFF3] rounded-lg mt-6">
        <div className="h-7.5 p-1.5 flex justify-center items-center text-[#2E7D32] rounded-sm">
          <LightBulbIcon className="h-5 w-5" />
        </div>
        <div>
          <span className="text-[#2E7D32] text-sm font-medium">
            Market Gap:
          </span>
          <span className="text-[#5F6368] text-sm font-light">
            &nbsp;{b2c?.market_gap ?? "--"}
          </span>
        </div>
      </div>
    </div>
  );
};
export default B2Cprofile;
