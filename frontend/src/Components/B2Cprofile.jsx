import {
  ArrowDownIcon,
  LightBulbIcon,
  UserIcon,
  GlobeAltIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

import { PiGlobeXLight,PiGlobeLight } from "react-icons/pi";

const cdata1 = [
    {
      txt1: "Age Group",
      txt2: "30–50 years",
      txt3: "Health-conscious",
      txt4: "Professionals",
    },
    {
      txt1: "Age Group",
      txt2: "30–50 years",
      txt3: "Health-conscious",
      txt4: "Professionals",
    },
    {
      txt1: "Age Group",
      txt2: "30–50 years",
      txt3: "Health-conscious",
      txt4: "Professionals",
    },
  ];

  const cdata2 = [
    {
      txt1: "Online",
      txt2: "Amazon",
      txt3: "iHerb",
      txt4: "Thrive Market",
      txt5: "Walmart.com",
    },
    {
      txt1: "Offline",
      txt2: "Whole Foods Market",
      txt3: "Trader Joe's",
      txt4: "Sprouts Farmers Market",
      txt5: "Vitamin Shoppe",
    },
    {
      txt1: "Social Commerce",
      txt2: "Instagram Shops",
      txt3: "Facebook Marketplace",
      txt4: "Pinterest",
    },
  ];

  const cdata3 = [
    {
      txt1: "Certifications they look for",
      txt2: "USDA Organic",
      txt3: "Non-GMO",
      txt4: "Vegan",
      txt5: "Kosher",
    },
    {
      txt1: "Key claims they respond to",
      txt2: "clinically studied",
      txt3: "high curcumin content",
      txt4: "bioavailable",
    },
  ];

  const cdata4 = [
    {
      txt1: "Qunol",
      txt2: "Premium wellness",
      txt3: "Dominates Amazon with 20,000+ monthly sales, premium tier, lab-tested for quality and purity.",
    },
    {
      txt1: "Organic Spice Resource",
      txt2: "Affordable daily wellness",
      txt3: "Available on Amazon, 10,000+ monthly sales, priced at $7.97 for 8 oz, USDA Organic, Non-GMO.",
    },
    {
      txt1: "Simply Organic",
      txt2: "Premium organic flavor",
      txt3: "Available on Amazon and Instacart, 8,000+ monthly sales, priced at $5.09 for 2.38 oz, USDA Organic.",
    },
    {
      txt1: "Jiva Organics",
      txt2: "Premium raw turmeric",
      txt3: "Available on Amazon, 4,000+ monthly sales, $9.99 for 1 pound, USDA Organic, lab-tested.",
    },
    {
      txt1: "OSR Bulk",
      txt2: "Premium bulk option",
      txt3: "Available on Amazon, 5,000+ monthly sales, priced at $14.99 for 35.27 oz, USDA Organic, Non-GMO.",
    },
    {
      txt1: "Badia Organic",
      txt2: "Premium organic floral",
      txt3: "Available on Amazon, USDA Organic, noted for floral and sweeter notes. Budget-accessible.",
    },
  ];

const B2Cprofile = ({b2c}) => {
  

  const icons = [
    PiGlobeLight,
    PiGlobeXLight,
    UserGroupIcon
  ];

  console.log("b2c data: ",b2c);

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
        {cdata1?.map((item, index) => {
          return (
            <div
              className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1"
              key={index}
            >
              <p className="text-sm font-medium text-[#5F6368]">Age Group</p>
              <p className="text-base font-medium text-[#000000]">
                30–50 years
              </p>
              <p className="flex gap-1.5">
                <span className="bg-gray-100 text-[#5F6368] text-xs font-medium px-2 py-0.5 rounded-2xl">
                  Health-conscious
                </span>
                <span className="bg-gray-100 text-[#5F6368] text-xs font-medium px-2 py-0.5 rounded-2xl">
                  Professionals
                </span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6 bg-white">
        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1">
          <p className="text-sm font-medium text-[#5F6368]">Lifestyle</p>
          <p className="flex flex-wrap gap-1.5">
            <span className="bg-[#f0fcff] text-[#0284C7] text-xs font-medium px-2 py-0.5 rounded-2xl">
              holistic wellness
            </span>
            <span className="bg-[#f0fcff] text-[#0284C7] text-xs font-medium px-2 py-0.5 rounded-2xl">
              organic enthusiast
            </span>
            <span className="bg-[#f0fcff] text-[#0284C7] text-xs font-medium px-2 py-0.5 rounded-2xl">
              clean label
            </span>
            <span className="bg-[#f0fcff] text-[#0284C7] text-xs font-medium px-2 py-0.5 rounded-2xl">
              Ayurveda-curious
            </span>
          </p>
        </div>
        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1">
          <p className="text-sm font-medium text-[#5F6368]">Motivations</p>
          <p className="flex flex-wrap gap-1.5">
            <span className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
              preventive health
            </span>
            <span className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
              immune support
            </span>
            <span className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
              anti-inflammatory
            </span>
            {/* <span className="bg-[#CCFFCF] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
              Health-conscious
            </span> */}
          </p>
        </div>
        <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1">
          <p className="text-sm font-medium text-[#5F6368]">Willing to spend</p>
          <p className="text-base font-bold text-[#D48C15]">$20–$50</p>
          <p className="text-[#5F6368] text-13 font-regular">
            per supplement purchase
          </p>
        </div>
      </div>

      <p className="text-sm font-medium text-[#5F6368] mt-6">Where they buy</p>

      <div className="mt-2 grid grid-cols-3 gap-6 bg-white">
        {cdata2?.map((itm, index) => {

          const Icons = icons[index];

          return (
            <div
              className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1"
              key={index}
            >
              <p className="text-sm font-medium text-[#5F6368] flex gap-1">
                <span>
                  <Icons className="h-5 w-5" />
                </span>
                <span>{itm.txt1}</span>
              </p>
              <ul className="list-disc ml-6 text-sm">
                <li>{itm.txt2}</li>
                <li>{itm.txt3}</li>
                <li>{itm.txt4}</li>
                {itm?.txt5 && <li>{itm?.txt5}</li>}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-sm font-medium text-[#5F6368] mt-6">
        Label preferences
      </p>
      <div className="grid grid-cols-2">
        {cdata3?.map((val, index) => {
          return (
            <div className="mt-2">
              <p className="text-sm font-medium text-[#000000]">{val.txt1}</p>
              <p className="flex gap-1.5 mt-1.5">
                <span className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                  {val.txt2}
                </span>
                <span className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                  {val.txt3}
                </span>
                <span className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                  {val.txt4}
                </span>
                {val?.txt5 && (
                  <span className="bg-[#F3FFF3] text-[#2E7D32] text-xs font-medium px-2 py-0.5 rounded-2xl">
                    {val.txt5}
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 mt-6">
        <div>
          <p className="text-sm font-medium text-[#000000]">
            Preferred formats
          </p>
          <p className="flex gap-1.5 mt-1.5">
            <span className="bg-gray-100 text-[#5F6368] text-xs font-medium px-2 py-0.5 rounded-2xl">
              capsule
            </span>
            <span className="bg-gray-100 text-[#5F6368] text-xs font-medium px-2 py-0.5 rounded-2xl">
              powder sachet
            </span>
            <span className="bg-gray-100 text-[#5F6368] text-xs font-medium px-2 py-0.5 rounded-2xl">
              gummy
            </span>
            <span className="bg-gray-100 text-[#5F6368] text-xs font-medium px-2 py-0.5 rounded-2xl">
              liquid shot
            </span>
          </p>
        </div>

        <div className="border px-3 content-center bg-[#fff5e6] text-[#D48C15] text-sm font-medium rounded-lg">
          💰 $20–30 sweet spot for daily supplements in this market
        </div>
      </div>

      <p className="text-sm font-medium text-[#5F6368] mt-6">
        Leading brands (7) — what consumers already trust
      </p>

      <div className="grid grid-cols-3 gap-6 mt-2">
        {cdata4?.map((item, i) => {
          return (
            <div className="border border-[#E6E6E6] p-4 rounded-lg flex flex-col gap-1">
              <p className="text-sm font-medium text-[#000000]">Qunol</p>
              <p className="text-xs font-regular text-[#5F6368]">
                Premium wellness
              </p>
              <p className="text-sm font-regular text-[#5F6368]">
                Dominates Amazon with 20,000+ monthly sales, premium tier,
                lab-tested for quality and purity.
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
            &nbsp;There is a growing demand for Ayurvedic products with authentic sourcing, yet few brands emphasise their Indian origin and traditional preparation. This company can highlight its Indian heritage and traditional processing methods, offering a unique positioning in the organic turmeric market.
          </span>
        </div>
      </div>

    </div>
  );
};
export default B2Cprofile;
