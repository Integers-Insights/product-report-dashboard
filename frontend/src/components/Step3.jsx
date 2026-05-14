import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRightStartOnRectangleIcon,
  BuildingStorefrontIcon,
  ViewfinderCircleIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
  UserCircleIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { yourGoals, countries } from "./Data";
import { LuChevronDown } from "react-icons/lu";
const icons = [
  ArrowRightStartOnRectangleIcon,
  BuildingStorefrontIcon,
  ViewfinderCircleIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CheckIcon,
];

const acc1 = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "GMP",
  "cGMP (FDA)",
  "EU GMP",
  "WHO GMP",
  "Six Sigma",
  "CE Marking",
  "Other",
];

const acc2 = [
  "FSSAI",
  "USDA Organic",
  "EU Organic",
  "India Organic",
  "FSSC 22000",
  "BRC/BRCGS",
  "HACCP",
  "Global G.A.P.",
  "Rainforest Alliance",
  "Fair Trade",
  "Other",
];

const acc3 = [
  "FDA Registered",
  "US FDA (510K)",
  "Drug Master File",
  "ISO 13485 (Medical)",
  "REACH Compliant",
  "NSF Certified",
  "Informed Sport",
  "USP Verified",
];

const acc4 = [
  "Halal",
  "Kosher",
  "Vegan Certified",
  "Vegetarian Cert.",
  "Cruelty-Free",
  "B Corp",
  "Carbon Neutral",
  "Other",
];

const acc5 = [
  "ISO 27001",
  "SOC 2 Type II",
  "GDPR Compliant",
  "PCI-DSS",
  "CMMI Level 3+",
  "AWS/Azure Certified",
  "Other",
];

const accordionData = [
  {
    title: "Quality & Manufacturing",
    key: "quality_manufacturing",
    items: acc1,
  },
  {
    title: "Food, Agriculture & Organic",
    key: "food_agriculture_organic",
    items: acc2,
  },
  {
    title: "Pharma, Health & Safety",
    key: "pharma_health_safety",
    items: acc3,
  },
  {
    title: "Religion, Ethics & Lifestyle",
    key: "religion_ethics_lifestyle",
    items: acc4,
  },
  {
    title: "Technology & Digital",
    key: "technology_digital",
    items: acc5,
  },
];

const notificationMethods = [
  { id: "b2b", title: "B2B" },
  { id: "b2c", title: "B2C" },
  { id: "both", title: "Both" },
];

const priceOptions = ["Budget", "Mid Range", "Premium"];

const Step3 = ({
  selectedGoal,
  setSelectedGoal,
  buyerType,
  setBuyerType,
  priceType,
  setPriceType,
  capacity,
  setCapacity,
  selected,
  setSelected,
  certifications,
  setCertifications,
}) => {
  const [open, setOpen] = useState(null);

  const toggleAccordion = (index) => {
    setOpen(open === index ? null : index);
  };

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleSelect = (country) => {
    if (selected.includes(country)) {
      setSelected(selected.filter((c) => c !== country));
    } else {
      setSelected([...selected, country]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const countries1 = [
    { name: "MT" },
    { name: "option1" },
    { name: "option2" },
    { name: "option3" },
    { name: "option4" },
  ];

  const handleCheckboxChange = (category, value) => {
    setCertifications((prev) => {
      const exists = prev[category].includes(value);

      return {
        ...prev,
        [category]: exists
          ? prev[category].filter((item) => item !== value)
          : [...prev[category], value],
      };
    });
  };

  return (
    <div>
      <h1 className="text-[28px] font-semibold text-[#000000]">
        About Your Research Goals
      </h1>
      <p className="text-13 text-[#5F6368] mb-4">
        Select which products to analyse, only selected ones will be included in
        your intelligence run.
      </p>

      <div className="grid grid-cols-[1fr_326px] gap-6">
        <div>
          <div className="p-4 bg-[#FFFFFF] border border-[#E6E6E6] rounded-lg">
            <div className="flex gap-3 items-center">
              <div className="bg-[#0284C7] text-[#E0F5FF] h-7 w-7 rounded-full text-center content-center text-13">
                01
              </div>
              <p className="text-[#1E1E1E] text-sm font-medium">Your goals?</p>
              <p className="text-[#5F6368] text-xs font-light">
                Select all that apply
              </p>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-3 gap-6">
                {yourGoals.map((goal, index) => {
                  const Icon = icons[index];

                  return (
                    <div
                      key={index}
                      className="border border-[#E6E6E6] p-3 rounded-lg group card-hover"
                    >
                      <div className="p-3">
                        <div className="flex justify-between">
                          <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                            <Icon className="w-5 h-5 text-[#0284C7]" />
                          </div>
                          <div className="h-4 w-4">
                            <div className="h-4 w-4 relative">
                              <div className="absolute top-1/2 -mt-2 grid size-4 grid-cols-1">
                                <input
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0284C7] bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                  value={goal.title}
                                  checked={selectedGoal.includes(goal.title)}
                                  onChange={(e) =>
                                    setSelectedGoal(
                                      e.target.checked
                                        ? [...selectedGoal, goal.title]
                                        : selectedGoal.filter(
                                            (g) => g !== goal.title,
                                          ),
                                    )
                                  }
                                />
                                <svg
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                >
                                  <path
                                    className="opacity-0 group-has-checked:opacity-100"
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                    d="M3 7H11"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h1 className="mt-1.5 text-[#000000] text-sm font-medium">
                          {goal.title}
                        </h1>
                        <p className="text-[#5F6368] text-xs font-light">
                          {goal.txt}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />

            <div className="flex gap-3 items-center">
              <div className="bg-[#0284C7] text-[#E0F5FF] h-7 w-7 rounded-full text-center content-center text-13">
                02
              </div>
              <p className="text-[#1E1E1E] text-sm font-medium">
                Quick Details
              </p>
            </div>

            <div className="flex mt-3 gap-24">
              <div>
                <fieldset>
                  <legend className="text-base font-semibold text-[#001413]">
                    Buyer Type
                  </legend>
                  <div className="mt-1 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    {notificationMethods.map((notificationMethod, index) => (
                      <div
                        key={notificationMethod.id}
                        className="flex items-center"
                      >
                        <input
                          id={notificationMethod.id}
                          name="notification-method"
                          type="radio"
                          value={notificationMethod.id}
                          checked={buyerType === notificationMethod.id}
                          onChange={(e) => setBuyerType(e.target.value)}
                          className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#0284C7] checked:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                        />
                        <label
                          htmlFor={notificationMethod.id}
                          className="ml-3 block text-sm/6 font-medium text-gray-900"
                        >
                          {notificationMethod.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div>
                <fieldset>
                  <legend className="text-base font-semibold text-[#001413]">
                    Price Positioning
                  </legend>

                  <div className="flex gap-6 mt-1">
                    {priceOptions.map((item) => (
                      <div key={item} className="flex gap-1">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={item}
                              type="checkbox"
                              value={item}
                              checked={priceType.includes(item)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPriceType([...priceType, item]);
                                } else {
                                  setPriceType(
                                    priceType.filter((i) => i !== item),
                                  );
                                }
                              }}
                              className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#0284C7] checked:bg-[#0284C7]"
                            />

                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-checked:opacity-100"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="text-sm/6">
                          <label
                            htmlFor={item}
                            className="font-medium text-gray-900"
                          >
                            {item}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="mt-3 flex gap-12">
              <div>
                <label
                  htmlFor="phone-number"
                  className="block text-base font-semibold text-[#001413]"
                >
                  Monthly supply capacity
                </label>
                <div>
                  <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-[var(--color-brand-primary1)]">
                    <input
                      id="phone-number"
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="e.g. 5"
                      className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />

                    <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country"
                        aria-label="Country"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-brand-primary1)] sm:text-sm/6"
                      >
                        {countries1.map((coun, index) => (
                          <option key={index} value={coun.name}>
                            {coun.name}
                          </option>
                        ))}
                      </select>
                      <LuChevronDown
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-75">
                <h1 className="block text-base font-semibold text-[#001413]">Target Country</h1>
                <div ref={dropdownRef} className="w-75 relative">
                  <div
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="min-h-[37px] border rounded-lg px-3 py-1 text-sm flex items-center cursor-pointer bg-white border-gray-300"
                  >
                    <span className="text-gray-400">
                      {selected.length > 0
                        ? `${selected.length} selected`
                        : "Select countries"}
                    </span>

                    <span
                      className={`ml-auto transition-transform text-[10px] text-gray-500 duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                  {isOpen && (
                    <div
                      className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {countries.map((country) => (
                        <label
                          key={country}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(country)}
                            onChange={() => toggleSelect(country)}
                            className="mr-2"
                          />
                          {country}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />

            <div className="flex gap-3 items-center">
              <div className="bg-[#0284C7] text-[#E0F5FF] h-7 w-7 rounded-full text-center content-center text-13">
                03
              </div>
              <p className="text-[#1E1E1E] text-sm font-medium">
                Certifications you hold
              </p>
              <p className="text-[#5F6368] text-xs font-light">
                Select all that apply
              </p>
            </div>

            <div className="w-full mx-auto space-y-3 mt-4">
              {accordionData.map((section, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="flex items-center justify-between w-full px-4 py-2 font-medium bg-[#E0F5FF] hover:bg-[#CFEFFF] transition-all duration-100 cursor-pointer rounded-lg"
                  >
                    {section.title}
                    <PlusIcon
                      className={`w-5 transition-transform duration-300 ${
                        open === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      open === index
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden px-4 pt-4 pb-1">
                      <div className="grid grid-cols-4 gap-3">
                        {section.items?.map((item, i) => (
                          <fieldset key={i}>
                            <div className="space-y-5">
                              <div className="flex gap-3">
                                <div className="flex h-6 shrink-0 items-center">
                                  <div className="group grid size-4 grid-cols-1">
                                    <input
                                      type="checkbox"
                                      value={item}
                                      checked={certifications[
                                        section.key
                                      ].includes(item)}
                                      onChange={() =>
                                        handleCheckboxChange(section.key, item)
                                      }
                                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#0284C7] checked:bg-[#0284C7]"
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
                                  <label className="font-medium text-gray-900">
                                    {item}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div>
                <label
                  htmlFor="notlisted"
                  className="block text-[18px] font-semibold text-[#001413]"
                >
                  Other / not listed
                </label>
                <div className="flex gap-1.5 w-full items-center">
                  <div className="w-full h-full">
                    <input
                      id="notlisted"
                      name="notlisted"
                      type="text"
                      placeholder="Type certification name, e.g. FSSC 22000 - Bureau Veritas"
                      aria-describedby="email-description"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-[#5F6368] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                    />
                  </div>
                  <div>
                    <button className="border border-[#5F6368] rounded-lg px-3 py-1.5 flex gap-2 items-center text-[#6A7675] font-semibold hover:bg-[#F5F5F5] cursor-pointer">
                      Add <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[#E6E6E6] rounded-lg flex flex-col justify-between p-4 bg-[#FFFFFF] card-hover">
          <div>
            <p className="text-[#5F6368] font-light text-xs">
              HOW THIS SHAPES YOUR RESULT
            </p>

            <div className="mt-3">
              <div className="flex gap-3">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <UserCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Buyer matching
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    Goals + certs filter the buyer list to only relevant
                    companies
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Market scoring
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    Capacity + price position adjusts which markets are
                    realistic for you
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Email sequence tone
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    Buyer type (B2B) sets the right outreach language and CTAs
                  </p>
                </div>
              </div>
            </div>
            <hr className="h-[1px] bg-[#E6E6E6] mt-4 border-0" />
          </div>

          <div>
            <div className="flex gap-1.5 border p-3 border-[#ABECAE] bg-[#F3FFF3] rounded-lg">
              <div className="h-7.5 p-1.5 flex justify-center items-center text-[#2E7D32] rounded-sm">
                <LightBulbIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[#2E7D32] text-sm font-medium">
                  Improve accuracy before running.
                </p>
                <p className="text-[#5F6368] text-xs font-light">
                  Products with low confidence scores may return fewer buyers.
                  Use Review & Update to fill in missing fields.
                </p>
              </div>
            </div>

            <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />

            <div>
              <p className="text-[#5F6368] text-xs font-light">RUN COST</p>
              <div>
                <div className="flex justify-between items-center">
                  <p className="text-[#000000] text-xs font-light">
                    3 products selected
                  </p>
                  <h1 className="text-[#000000] text-xl font-semibold">3Q</h1>
                </div>

                <div className="w-full h-1 bg-[#A9B3B1] rounded my-2">
                  <div
                    className="h-1 bg-[#0284C7] rounded"
                    style={{ width: "20%" }}
                  ></div>
                </div>
                <p className="text-[#5F6368] text-xs font-light">
                  70 queries remaining after this run
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Step3;
