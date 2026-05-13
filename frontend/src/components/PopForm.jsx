import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlusCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { IoChevronDown } from "react-icons/io5";
import AccordionCheckBox from "./AccordianCheckBox";
import { countries } from "./Data";
import {
  companyType,
  ind,
  yearsInIndustry,
  productType,
  notificationMethod1,
  notificationMethod2,
  primaryGoal,
  platforms,
} from "./Data";
import NeedHelp from "./NeedHelp";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PopForm({ setPopupOpen }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showInput, setShowInput] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [otherValue, setOtherValue] = useState("");
  const [loading, setLoading] = useState(false); // loading
  const [error, setError] = useState(false);
  const [popup_Open, setPopup_Open] = useState(false);
  const [showInput1, setShowInput1] = useState(false);
  const [otherValue1, setOtherValue1] = useState("");

  const dropdownRef = useRef(null);
  const [search, setSearch] = useState("");

  const [countryOpen, setCountryopen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [industryData, setIndustryData] = useState("");
  const companyTypeValue = showInput ? otherValue : selectedType;
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [webInput, setWebInput] = useState("");

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [salesIntent, setSalesIntent] = useState("");
  const [buyerType, setBuyerType] = useState("");
  const [pricePositioning, setPricePositioning] = useState([]);

  const [selectedGoals, setSelectedGoals] = useState([]);

  const [certifications, setCertifications] = useState({
    quality: [],
    food: [],
    pharma: [],
    ethics: [],
    tech: [],
  });

  const [platform, setPlatform] = useState("");

  const base_url = import.meta.env.VITE_BASE_URL;

  const steps = [
    {
      id: "01",
      name: "Step 1",
      description: "About You",
      href: "#",
      status:
        currentStep === 1
          ? "current"
          : currentStep > 1
            ? "complete"
            : "upcoming",
    },
    {
      id: "02",
      name: "Step 2",
      description: "Products & markets",
      href: "#",
      status:
        currentStep === 2
          ? "current"
          : currentStep > 2
            ? "complete"
            : "upcoming",
    },
    {
      id: "03",
      name: "Step 3",
      description: "Certificates & Goals",
      href: "#",
      status: currentStep === 3 ? "current" : "upcoming",
    },
  ];

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCountryopen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (btn) => {
    setSelectedType(btn.label);
    setOtherValue("");
    setShowInput(false);
  };

  const handleProductToggle = (value) => {
    setSelectedProducts((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handlePriceChange = (value) => {
    setPricePositioning((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleGoalClick = (value) => {
    setSelectedGoals((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleCertChange = (category, value) => {
    setCertifications((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleStep1Submit = async () => {
    if (!fullName.trim()) {
      setError(true);
      return false;
    }

    if (!companyName.trim()) {
      setError(true);
      return false;
    }

    if (!selectedCountry) {
      setError(true);
      return false;
    }

    if (!industryData) {
      setError(true);
      return false;
    }

    if (!companyTypeValue || !companyTypeValue.trim()) {
      setError(true);
      return false;
    }

    if (webInput && webInput.trim()) {
      if (!/^https?:\/\/.+\..+/.test(webInput)) {
        alert("Please enter valid website URL");
        return;
      }
    }

    const payload = {
      full_name: fullName,
      company_name: companyName,
      headquarters_country: selectedCountry,
      industry: industryData,
      company_type: companyTypeValue,
      years_in_industry: selectedIndustry,
      website: webInput,
    };

    setError(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      if (!token) {
        alert("User not authenticated");
        return false;
      }
      const response = await fetch(`${base_url}/step1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return true;
    } catch (error) {
      console.error("Error:", error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    if (!salesIntent || !salesIntent.trim()) {
      setError(true);
      return false;
    }

    const payload = {
      product_type: selectedProducts,
      sales_intent: salesIntent,
      buyer_type: buyerType,
      price_positioning: pricePositioning,
    };

    setError(false);
    setLoading(true);
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      if (!token) {
        alert("User not authenticated");
        return false;
      }
      const response = await fetch(`${base_url}/step2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return true;
    } catch (error) {
      console.error("Error:", error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    if (!selectedGoals || selectedGoals.length === 0) {
      setError(true);
      return false;
    }

    if (!platform || !platform.trim()) {
      setError(true);
      return false;
    }

    const payload = {
      primary_goal: selectedGoals,
      certifications: {
        quality_manufacturing: certifications.quality,
        food_agriculture_organic: certifications.food,
        pharma_health_safety: certifications.pharma,
        religion_ethics_lifestyle: certifications.ethics,
        technology_digital: certifications.tech,
      },
      referral_source: platform,
    };

    setLoading(true);

    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      if (!token) {
        alert("User not authenticated");
        return false;
      }

      const response = await fetch(`${base_url}/step3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const key = "CtKoIC)iR1SP)5mr&R4d";

      let storedData = {};

      try {
        storedData = JSON.parse(localStorage.getItem(key)) || {};
      } catch (e) {
        storedData = {};
      }

      const updatedData = {
        ...storedData,
        isSubmitted: true,
      };

      localStorage.setItem(key, JSON.stringify(updatedData));

      return true;
    } catch (error) {
      console.error("Error:", error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const success = await handleStep1Submit();

      if (!success) return;
    }

    if (currentStep === 2) {
      const success = await handleStep2Submit();

      if (!success) return;
    }
    if (currentStep === 3) {
      const success = await handleStep3Submit();

      if (!success) return;
    }

    nextStep();
  };

  useEffect(() => {
    try {
      const data = localStorage.getItem("CtKoIC)iR1SP)5mr&R4d");
      if (data) {
        const parsedData = JSON.parse(data);
        setFullName(parsedData?.name || "");
        setCompanyName(parsedData?.company_name || "");
      }
    } catch (error) {
      console.error("LocalStorage parse error:", error);
    }
  }, []);

  return (
    <>
      <div className="w-216">
        <div className="p-6 flex justify-between w-full bg-[linear-gradient(93deg,rgba(2,132,199,0.15)_7.55%,rgba(2,132,199,0.05)_88.45%)]">
          <div>
            <p className="text-xl text-[#000] font-semibold">
              Welcome to InTrade24
            </p>
            <p className="text-13 text-[#000]">
              Before your first intelligence run, help us personalize your
              experience. Takes 2 minutes.
            </p>
          </div>
          <div
            className="border-2 border-[#0284C7] px-3 rounded-2xl hover:bg-[#e8f2f7] font-medium text-15 cursor-pointer content-center"
            onClick={() => setPopup_Open(true)}
          >
            Need Help?
          </div>
        </div>

        <div className="lg:border-t lg:border-b lg:border-gray-200">
          <nav aria-label="Progress" className="mx-auto ">
            <ol
              role="list"
              className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-r lg:border-l lg:border-gray-200"
            >
              {steps.map((step, stepIdx) => (
                <li
                  key={step.id}
                  className="relative overflow-hidden lg:flex-1"
                >
                  <div
                    className={classNames(
                      stepIdx === 0 ? "rounded-t-md border-b-0" : "",
                      stepIdx === steps.length - 1
                        ? "rounded-b-md border-t-0"
                        : "",
                      "overflow-hidden border border-gray-200 lg:border-0",
                    )}
                  >
                    {step.status === "complete" ? (
                      <div className="group">
                        <span
                          aria-hidden="true"
                          className="absolute top-0 left-0 h-full w-1 bg-transparent lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
                        />
                        <span
                          className={classNames(
                            stepIdx !== 0 ? "lg:pl-9" : "",
                            "flex items-start px-4 py-3 text-sm font-medium",
                          )}
                        >
                          <span className="shrink-0">
                            <span className="flex size-8 items-center justify-center rounded-full bg-[#0284C7]">
                              <CheckIcon className="size-5 text-white" />
                            </span>
                          </span>
                          <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {step.name}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                              {step.description}
                            </span>
                          </span>
                        </span>
                      </div>
                    ) : step.status === "current" ? (
                      <div aria-current="step">
                        <span
                          aria-hidden="true"
                          className="absolute top-0 left-0 h-full w-1 bg-[#0284C7] lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
                        />
                        <span
                          className={classNames(
                            stepIdx !== 0 ? "lg:pl-9" : "",
                            "flex items-start px-4 py-3 text-sm font-medium",
                          )}
                        >
                          <span className="shrink-0">
                            <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#0284C7]">
                              <span className="text-[#0284C7]">{step.id}</span>
                            </span>
                          </span>
                          <span className=" ml-4 flex min-w-0 flex-col">
                            <span className="text-sm font-medium text-[#0284C7]">
                              {step.name}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                              {step.description}
                            </span>
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="group">
                        <span
                          aria-hidden="true"
                          className="absolute top-0 left-0 h-full w-1 bg-transparent lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
                        />
                        <span
                          className={classNames(
                            stepIdx !== 0 ? "lg:pl-9" : "",
                            "flex items-start px-4 py-3 text-sm font-medium",
                          )}
                        >
                          <span className="shrink-0">
                            <span className="flex size-8 items-center justify-center rounded-full border-2 border-gray-300">
                              <span className="text-gray-500">{step.id}</span>
                            </span>
                          </span>
                          <span className="ml-4 flex min-w-0 flex-col">
                            <span className="text-sm font-medium text-gray-500">
                              {step.name}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                              {step.description}
                            </span>
                          </span>
                        </span>
                      </div>
                    )}

                    {stepIdx !== 0 ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 top-0 left-0 hidden w-3 lg:block"
                      >
                        <svg
                          fill="none"
                          viewBox="0 0 12 82"
                          preserveAspectRatio="none"
                          className="size-full text-gray-300"
                        >
                          <path
                            d="M0.5 0V31L10.5 41L0.5 51V82"
                            stroke="currentcolor"
                            vectorEffect="non-scaling-stroke"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="mx-auto mt-1 rounded-lg p-6">
          <div className="h-110 overflow-auto mbd">
            {currentStep === 1 && (
              <div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="nameInput"
                      className="block text-lg font-semibold text-[#001413]"
                    >
                      Enter You Name *
                    </label>
                    <div>
                      <input
                        id="nameInput"
                        name="name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                      />
                      <p className="text-red-500 text-sm mt-1 h-5">
                        {!fullName && error && "Enter Your Name"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-lg font-semibold text-[#001413]"
                    >
                      Company Name *
                    </label>
                    <div>
                      <input
                        id="companyName"
                        name="company"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="your company LLC"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                      />
                      <p className="text-red-500 text-sm mt-1 h-5">
                        {!companyName && error && "Enter company Name"}
                      </p>
                    </div>
                  </div>
                  <div ref={dropdownRef} className="relative w-full">
                    <label className="block text-lg font-semibold text-[#001413]">
                      Location *
                    </label>
                    <div
                      onClick={() => setCountryopen(!countryOpen)}
                      className="border border-gray-300 bg-white px-3 py-1.5 cursor-pointer select-none flex items-center justify-between rounded-lg"
                    >
                      <span>
                        {selectedCountry || (
                          <span className="text-gray-500">
                            ---Select Location---
                          </span>
                        )}
                      </span>
                      <IoChevronDown
                        className={`transition-transform duration-300 ease-in-out text-gray-500 ${countryOpen ? "rotate-180" : "rotate-0"}`}
                      />
                    </div>
                    {countryOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 shadow-md">
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full px-3 py-2 border-b"
                        />
                        <div className="max-h-40 overflow-y-auto">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setCountryopen(false);
                                  setSearch("");
                                }}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-200 text-sm"
                              >
                                {country}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-400 text-sm">
                              No country found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-red-500 text-sm mt-1 h-5">
                      {!selectedCountry && error && "select location"}
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="Industry"
                      className="block text-lg font-semibold text-[#001413]"
                    >
                      Industry *
                    </label>
                    <div className="grid grid-cols-1">
                      <select
                        id="Industry"
                        name="Industry"
                        value={industryData}
                        onChange={(e) => setIndustryData(e.target.value)}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
                      >
                        <option value={""}>---select industry---</option>
                        {ind?.map((itm, i) => {
                          return (
                            <option key={i} value={itm}>
                              {itm}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                      <p className="text-red-500 text-sm mt-1 h-5">
                        {!industryData && error && "select location"}
                      </p>
                    </div>
                  </div>
                </div>

                <h1 className="text-[#001413] font-semibold text-lg mt-6">
                  Company Type *
                </h1>
                <div className="mt-3 flex flex-wrap gap-y-3 gap-x-4">
                  {companyType?.map((btn) => {
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleSelect(btn)}
                        disabled={showInput}
                        className={`inline-flex items-center gap-x-2 rounded-md border px-3.5 py-2.5 text-sm font-medium shadow-xs cursor-pointer
                                            ${
                                              selectedType === btn.label
                                                ? "bg-[#0284C7] text-white border-[#0284C7]"
                                                : "bg-[#FAFAFA] text-[#5F6368] border-[#C8CED4] hover:bg-[#F5F5F5]"
                                            }`}
                      >
                        {btn.label}
                        <btn.icon className="-mr-0.5 size-5" />
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setShowInput(!showInput);
                      setSelectedType(null);
                    }}
                    className={`inline-flex items-center gap-x-2 rounded-md border px-3.5 py-2.5 text-sm font-medium shadow-xs cursor-pointer ${
                      showInput
                        ? "bg-[#0284C7] text-white border-[#0284C7]"
                        : "bg-[#FAFAFA] text-[#5F6368] border-[#C8CED4] hover:bg-[#F5F5F5]"
                    }
  `}
                  >
                    Others <PlusCircleIcon className="-mr-0.5 size-5" />
                  </button>
                </div>
                <p className="text-red-500 text-sm mt-1 h-5">
                  {!companyTypeValue && error && "Select company type"}
                </p>
                {showInput && (
                  <div className="border border-[#C8CED4] h-10 w-50 rounded mt-2">
                    <input
                      type="text"
                      placeholder="Enter Company Type"
                      value={otherValue}
                      onChange={(e) => setOtherValue(e.target.value)}
                      className="px-1 h-full w-full"
                    />
                  </div>
                )}
                <div className="mt-6">
                  <p className="text-lg font-semibold text-[#001413]">
                    Years in Industry
                  </p>
                  <fieldset>
                    <div className="mt-3 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                      {yearsInIndustry.map((industry) => (
                        <div key={industry.id} className="flex items-center">
                          <input
                            id={industry.id}
                            name="yearsInIndustry"
                            type="radio"
                            value={industry.txt}
                            checked={selectedIndustry === industry.txt}
                            onChange={(e) =>
                              setSelectedIndustry(e.target.value)
                            }
                            className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-white before:opacity-0 checked:border-[#0284C7] checked:bg-[#0284C7] checked:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
                          />
                          <label
                            htmlFor={industry.id}
                            className="ml-3 block text-sm/6 font-medium text-gray-900"
                          >
                            {industry.txt}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="company-website"
                    className="block text-lg font-semibold text-[ #001413]"
                  >
                    Website
                  </label>
                  <div className="mt-3 w-99">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-[#5F6368] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#0284C7]">
                      <input
                        id="company-website"
                        name="company-website"
                        type="url"
                        value={webInput}
                        onChange={(e) => setWebInput(e.target.value)}
                        placeholder="https://www.example.com"
                        className="block min-w-0 grow py-1.5 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h1 className="text-[#001413] font-semibold text-lg">
                  Product Type
                </h1>
                <div className="mt-3 flex flex-wrap gap-y-3 gap-x-4">
                  {productType?.map((btn) => {
                    const isSelected = selectedProducts.includes(btn.label);
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleProductToggle(btn.label)}
                        className={`inline-flex items-center gap-x-2 rounded-md border px-3.5 py-2.5 text-sm font-semibold shadow-xs cursor-pointer ${isSelected ? "bg-[#0284C7] text-white border-[#0284C7]" : "bg-[#FAFAFA] text-[#5F6368] border-[#C8CED4] hover:bg-[#F5F5F5]"}`}
                      >
                        {btn.label}
                        <btn.icon className="-mr-0.5 size-5" />
                      </button>
                    );
                  })}

                  <button
                    onClick={() => {
                      if (showInput1) {
                        setShowInput1(false);
                        setOtherValue1("");
                        setSelectedProducts((prev) =>
                          prev.filter((item) => item !== otherValue1),
                        );
                      } else {
                        setShowInput1(true);
                        setOtherValue1("");
                      }
                    }}
                    className={`inline-flex items-center gap-x-2 rounded-md border px-3.5 py-2.5 text-sm font-medium shadow-xs cursor-pointer ${showInput1 ? "bg-[#0284C7] text-white border-[#0284C7]" : "bg-[#FAFAFA] text-[#5F6368] border-[#C8CED4] hover:bg-[#F5F5F5]"}`}
                  >
                    Others <PlusCircleIcon className="-mr-0.5 size-5" />
                  </button>
                </div>

                {showInput1 && (
                  <div className="border border-[#C8CED4] h-10 w-50 rounded mt-3">
                    <input
                      type="text"
                      placeholder="Enter Product Type"
                      value={otherValue1}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setOtherValue1(newValue);
                        if (newValue.trim()) {
                          setSelectedProducts((prev) => {
                            const filtered = prev.filter(
                              (item) => item !== otherValue1,
                            );
                            if (!filtered.includes(newValue)) {
                              return [...filtered, newValue];
                            }
                            return filtered;
                          });
                        } else {
                          setSelectedProducts((prev) =>
                            prev.filter((item) => item !== otherValue1),
                          );
                        }
                      }}
                      className="px-1 h-full w-full"
                    />
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-10">
                  <div>
                    <fieldset>
                      <legend className="text-[#001413] font-semibold text-lg">
                        Sales Intent *
                      </legend>
                      <div className="mt-3 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        {notificationMethod1.map((item) => (
                          <div key={item.id} className="flex items-center">
                            <input
                              id={item.id}
                              name="salesIntent"
                              type="radio"
                              value={item.title}
                              checked={salesIntent === item.title}
                              onChange={(e) => setSalesIntent(e.target.value)}
                              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-white before:opacity-0 checked:border-[#0284C7] checked:bg-[#0284C7] checked:before:opacity-100"
                            />
                            <label
                              htmlFor={item.id}
                              className="ml-3 text-sm font-medium text-gray-900"
                            >
                              {item.title}
                            </label>
                          </div>
                        ))}
                      </div>
                      <p className="text-red-500 text-sm mt-1 h-5">
                        {!salesIntent && error && "Select sales intent"}
                      </p>
                    </fieldset>
                  </div>
                  <div>
                    <fieldset>
                      <legend className="text-sm/6 font-semibold text-gray-900">
                        Buyer Type
                      </legend>
                      <div className="mt-3 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        {notificationMethod2.map((item) => (
                          <div key={item.id} className="flex items-center">
                            <input
                              id={`buyer-${item.id}`}
                              name="buyerType"
                              type="radio"
                              value={item.title}
                              checked={buyerType === item.title}
                              onChange={(e) => setBuyerType(e.target.value)}
                              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-white before:opacity-0 checked:border-[#0284C7] checked:bg-[#0284C7] checked:before:opacity-100"
                            />
                            <label
                              htmlFor={`buyer-${item.id}`}
                              className="ml-3 text-sm font-medium text-gray-900"
                            >
                              {item.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div className="mt-6">
                  <fieldset>
                    <legend className="text-[#001413] font-semibold text-lg">
                      Price Positioning
                    </legend>
                    <div className="mt-3 flex gap-6">
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id="comments"
                              name="comments"
                              type="checkbox"
                              value="Budget"
                              checked={pricePositioning.includes("Budget")}
                              onChange={() => handlePriceChange("Budget")}
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
                            className="font-medium text-gray-900"
                          >
                            Budget
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id="candidates"
                              name="candidates"
                              type="checkbox"
                              value="Mid Range"
                              checked={pricePositioning.includes("Mid Range")}
                              onChange={() => handlePriceChange("Mid Range")}
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
                            className="font-medium text-gray-900"
                          >
                            Mid Range
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id="offers"
                              name="offers"
                              type="checkbox"
                              value="Premium"
                              checked={pricePositioning.includes("Premium")}
                              onChange={() => handlePriceChange("Premium")}
                              aria-describedby="offers-description"
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
                            htmlFor="offers"
                            className="font-medium text-gray-900"
                          >
                            Premium
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h1 className="text-[#001413] font-semibold text-lg">
                  Primary Goal *
                </h1>
                <div className="mt-3 flex flex-wrap gap-y-3 gap-x-4">
                  {primaryGoal?.map((btn) => {
                    const isSelected = selectedGoals.includes(btn.label);
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleGoalClick(btn.label)}
                        className={`inline-flex items-center gap-x-2 rounded-md border px-3.5 py-2.5 text-sm font-semibold shadow-xs cursor-pointer transition ${isSelected ? "bg-[#0284C7] text-white border-[#0284C7]" : "bg-[#FAFAFA] text-[#5F6368] border-[#C8CED4] hover:bg-[#F5F5F5]"}`}
                      >
                        {btn.label}
                        <btn.icon className="-mr-0.5 size-5" />
                      </button>
                    );
                  })}
                </div>
                <p className="text-red-500 text-sm mt-1 h-5">
                  {selectedGoals.length === 0 &&
                    error &&
                    "Select primary goal "}
                </p>
                <div className="flex gap-3 items-center mt-6">
                  <div>
                    <h1 className="bordertext-[#001413] text-lg font-semibold">
                      Certification You Hold
                    </h1>
                  </div>
                  <div>
                    <button className="border border-[#C8CED4] text-[#5F6368] py-3 px-4 rounded-4xl hover:bg-[#F0F0F0] cursor-pointer">
                      Not Yet - I’m working on it
                    </button>
                  </div>
                </div>
                {/* accordian */}
                <div className="mt-3">
                  <AccordionCheckBox
                    certifications={certifications}
                    handleCertChange={handleCertChange}
                  />
                </div>
                <div className="mt-6">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    How did you hear about InTrade24? *
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
                    >
                      <option value="">---Select platform---</option>
                      {platforms?.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                    />
                  </div>
                  <p className="text-red-500 text-sm mt-1 h-5">
                    {!platform && error && "Select platform"}
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <span>
                    <ShieldCheckIcon className="h-5 w-5" />
                  </span>
                  <span className="text-[#5F6368] text-13">
                    Your profile personalises research results only. It is never
                    shared or sold. You can update any of this in Settings at
                    any time.
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-[#000000] font-light">
              {currentStep} of 3
            </div>
            <div className="flex gap-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-4 py-2 border-2 border-[#0284C7] hover:bg-gray-100 text-[#001413] rounded-lg text-lg font-semibold cursor-pointer flex gap-2 justify-center items-center disabled:opacity-0 disabled:cursor-default"
              >
                <span className="mt-1">
                  <ArrowLeftIcon className="w-4 h-4 font-bold" />
                </span>
                <span>Back</span>
              </button>

              {currentStep === 3 ? (
                <button
                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0274B0] text-[#FFFFFF] rounded-lg text-lg font-semibold cursor-pointer disabled:cursor-not-allowed"
                  disabled={loading}
                  onClick={async () => {
                    const success = await handleStep3Submit();
                    if (success) {
                      setPopupOpen(false);
                    }
                  }}
                >
                  {loading ? "Loading..." : "Finish & Go to Dashboard"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#0284C7] hover:bg-[#0274B0] text-[#FFFFFF] rounded-lg text-lg font-semibold flex gap-2 justify-center items-center cursor-pointer disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <span>{loading ? "Loading..." : "Continue"}</span>
                  <span className="mt-1">
                    <ArrowRightIcon className="w-4 h-4 font-bold" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {popup_Open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 rounded-lg"
            onClick={() => setPopup_Open(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6">
            <NeedHelp setPopup_Open={setPopup_Open} />
          </div>
        </>
      )}
    </>
  );
}
