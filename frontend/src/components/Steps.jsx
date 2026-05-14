import { useEffect, useState } from "react";
import {
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import toast from "react-hot-toast";

const steps = [
  { id: "01", name: "Products Fetch" },
  { id: "02", name: "Validate" },
  { id: "03", name: "Profile" },
  { id: "04", name: "Opportunities" },
];

export default function Steps() {
  const [currentStep, setCurrentStep] = useState(0);

  const base_url = import.meta.env.VITE_BASE_URL;

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const [url, setUrl] = useState("");
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [joinId, setJobId] = useState("");

  const [products, setProducts] = useState([]);
  const [usage_summary_data, setUsage_summary_data] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);

  let selectedProductId = selectedProducts?.map((v) => v.id) || [];

  const [selectedGoal, setSelectedGoal] = useState([]);
  const [buyerType, setBuyerType] = useState("");
  const [priceType, setPriceType] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [selected, setSelected] = useState([]);
  const [certifications, setCertifications] = useState({
    quality_manufacturing: [],
    food_agriculture_organic: [],
    pharma_health_safety: [],
    religion_ethics_lifestyle: [],
    technology_digital: [],
  });

  const [productsData, setProductsData] = useState([]);
  const [banner_summary, setBanner_summary] = useState([]);
  const [last_run_data, setLast_run_data] = useState("");
  const [product_analyse_data, setProduct_analyse_data] = useState(0);
  const [time_taken_data, setTime_taken_data] = useState("");
  const [pages_crawled_data, setPages_crawled_data] = useState(0);

  const [loading2, setLoading2] = useState(false);
  const [fetching_allProducts, setFetching_allProducts] = useState(true);

  const handleFetchProducts = async () => {
    if (!url) {
      toast.error("Please enter URL");
      return;
    }

    if (!url.startsWith("http")) {
      toast.error("Enter valid URL");
      return;
    }

    try {
      setLoading1(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      let payload = {
        website_url: url,
      };

      const response = await fetch(`${base_url}/pipeline/run`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setJobId(data?.job_id);
        toast.success(data?.message);
        nextStep();
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    } finally {
      setLoading1(false);
    }
  };

  const getProduct = async () => {
    try {
      setFetching_allProducts(true);
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url}/pipeline/products/${joinId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      // console.log("data: ",data);
    
      if (data?.success) {
        setProducts(Array.isArray(data?.products) ? data?.products : []);

        if (data?.billing_cycle === "monthly") {
          setUsage_summary_data(data?.monthly_remaining || 0);
        }
      } else {
        setUsage_summary_data(data?.yearly_remaining || 0);
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    } finally {
      setFetching_allProducts(false);
    }
  };

  const postProduct = async () => {
    try {
      setLoading2(true);

      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      let post_payload = { product_ids: selectedProductId };

      const response = await fetch(`${base_url}/products/confirm/${joinId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(post_payload),
      });

      if (!response.ok) {
        throw new Error("Failed to post products");
      }

      const data = await response.json();
      // console.log("products data:", data);
    } catch (error) {
      console.log("Something went wrong:", error.message);
      throw error;
    } finally {
      setLoading2(false);
    }
  };

  const payloadData = {
    goals: selectedGoal,

    buyer_type: buyerType,

    price_positioning: priceType,

    monthly_supply_capacity: capacity,

    target_country: selected,

    certifications: {
      quality_manufacturing: certifications.quality_manufacturing,
      food_agriculture_organic: certifications.food_agriculture_organic,
      pharma_health_safety: certifications.pharma_health_safety,
      religion_ethics_lifestyle: certifications.religion_ethics_lifestyle,
      technology_digital: certifications.technology_digital,
    },
  };

  const researchGoals = async () => {
    try {
      setLoading2(true);

      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");
      const response = await fetch(
        `${base_url}/research-preferences?job_id=${joinId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payloadData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to post products");
      }

      const data = await response.json();
    } catch (error) {
      console.log("Something went wrong:", error.message);
      throw error;
    } finally {
      setLoading2(false);
    }
  };

  const getCardData = async () => {
    try {
      const token = localStorage.getItem("VZyHRIoNN3m)OXhGwCtC");

      const response = await fetch(`${base_url}/products-overview`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data?.success) {
        setProductsData(Array.isArray(data?.products) ? data.products : []);
        setBanner_summary(Array.isArray(data?.summary) ? data.summary : []);
        setProduct_analyse_data(data?.products_analyzed || 0);
        setLast_run_data(data?.last_run || "");
        setTime_taken_data(data?.time_taken || "");
        setPages_crawled_data(data?.pages_crawled || 0);
      }
    } catch (error) {
      console.log("Something went wrong:", error.message);
    }
  };

  useEffect(() => {
    if (joinId === "") return;
    getProduct();
  }, [joinId]);

  useEffect(() => {
    let isFetching = false;
    getCardData();

    const interval = setInterval(() => {
      if (isFetching) return;

      isFetching = true;

      getCardData()
        .catch((err) => console.log("error:", err))
        .finally(() => (isFetching = false));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <nav aria-label="Progress" className="mb-6 bg-[#FFFFFF]">
        <ol className="divide-y divide-gray-300 border border-[#E6E6E6] md:flex md:divide-y-0">
          {steps.map((step, stepIdx) => {
            const status =
              stepIdx < currentStep
                ? "complete"
                : stepIdx === currentStep
                  ? "current"
                  : "upcoming";
            return (
              <li key={step.id} className="relative md:flex md:flex-1">
                {status === "complete" ? (
                  <div className="group flex w-full items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-[#0284C7] group-hover:bg-[#0284C7]">
                        <CheckIcon
                          aria-hidden="true"
                          className="w-6 h-6 text-white"
                        />
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        {step.name}
                      </span>
                    </span>
                  </div>
                ) : status === "current" ? (
                  <div className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full border-2 border-[#0284C7]">
                      <span className="text-[#0284C7]">{step.id}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-[#0284C7]">
                      {step.name}
                    </span>
                  </div>
                ) : (
                  <div className="group flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                      <span className="text-gray-500 group-hover:text-gray-900">
                        {step.id}
                      </span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </span>
                  </div>
                )}
                {stepIdx !== steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute top-0 right-0 hidden h-full w-5 md:block"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 22 80"
                      preserveAspectRatio="none"
                      className="size-full text-gray-300"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        stroke="currentcolor"
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="mb-6 border-gray-300 rounded-md">
        {currentStep === 0 && (
          <div>
            <Step1
              nextStep={nextStep}
              url={url}
              setUrl={setUrl}
              agree1={agree1}
              setAgree1={setAgree1}
              agree2={agree2}
              setAgree2={setAgree2}
              loading1={loading1}
              handleFetchProducts={handleFetchProducts}
            />
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <Step2
              fetching_allProducts={fetching_allProducts}
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              usage_summary_data={usage_summary_data}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <Step3
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
              buyerType={buyerType}
              setBuyerType={setBuyerType}
              priceType={priceType}
              setPriceType={setPriceType}
              capacity={capacity}
              setCapacity={setCapacity}
              selected={selected}
              setSelected={setSelected}
              certifications={certifications}
              setCertifications={setCertifications}
            />
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <Step4
              productsData={productsData}
              banner_summary={banner_summary}
              product_analyse_data={product_analyse_data}
              last_run_data={last_run_data}
              time_taken_data={time_taken_data}
              pages_crawled_data={pages_crawled_data}
            />
          </div>
        )}
      </div>
      {currentStep !== 0 && (
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 border-2 border-[#0284C7] rounded-lg text-[#001413] cursor-pointer disabled:opacity-50 flex items-center gap-2 text-base font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Back
          </button>

          {currentStep !== steps.length - 1 && (
            <button
              onClick={async () => {
                try {
                  if (currentStep === 1) {
                    if (selectedProducts.length === 0) {
                      toast.error("Please select at least one product");
                      return;
                    }

                    await postProduct();
                  } else if (currentStep === 2) {
                    if (selectedGoal.length === 0) {
                      toast.error("Please select at least one goal");
                      return;
                    }
                    if (!buyerType) {
                      toast.error("Please select buyer type");
                      return;
                    }
                    if (priceType.length === 0) {
                      toast.error(
                        "Please select at least one price positioning",
                      );
                      return;
                    }
                    if (!capacity || Number(capacity) <= 0) {
                      toast.error("Please enter valid monthly supply capacity");
                      return;
                    }
                    if (selected.length === 0) {
                      toast.error("Please select at least one target country");
                      return;
                    }
                    const allCategoriesHaveOne = Object.values(
                      certifications,
                    ).every((arr) => arr.length > 0);

                    if (!allCategoriesHaveOne) {
                      toast.error(
                        "Please select at least one certification from each category",
                      );
                      return;
                    }
                    await researchGoals();
                  } else if (currentStep === 3) {
                    //console.log("Step 4 API call");
                  }
                  nextStep();
                } catch (error) {
                  console.log("API Error:", error);
                }
              }}
              className="px-4 py-2 rounded-lg bg-[#0284C7] text-white text-base font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading2}
            >
              <div className="flex items-center gap-2">
                Confirm Selection <ArrowRightIcon className="h-5 w-5" />
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
