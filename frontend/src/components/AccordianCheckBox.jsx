import { useState } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";

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

export default function AccordionCheckBox({
  certifications,
  handleCertChange,
}) {
  const [open, setOpen] = useState(null);

  const toggleAccordion = (index) => {
    setOpen(open === index ? null : index);
  };

  return (
    <div className="w-full mx-auto space-y-3">
      {/* Accordion 1 */}
      <div className="rounded-lg overflow-hidden">
        <button
          onClick={() => toggleAccordion(1)}
          className="flex items-center justify-between w-full px-4 py-2 font-medium bg-[#E0F5FF] hover:bg-[#CFEFFF] transition-all duration-100 cursor-pointer rounded-lg"
        >
          Quality & Manufacturing
          <PlusIcon
            className={`w-5 transition-transform duration-300 ${
              open === 1 ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ${
            open === 1
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden px-4 pb-0.5 pt-4">
            <div className="grid grid-cols-4 gap-3">
              {acc1.map((ac1, i) => {
                return (
                  <fieldset key={i}>
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`quality-${i}`}
                              type="checkbox"
                              checked={certifications.quality.includes(ac1)}
                              onChange={() => handleCertChange("quality", ac1)}
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
                            htmlFor={`quality-${i}`}
                            className="font-medium text-gray-900"
                          >
                            {ac1}
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion 2 */}
      <div className="rounded-lg overflow-hidden">
        <button
          onClick={() => toggleAccordion(2)}
          className="flex items-center justify-between w-full px-4 py-2 font-medium bg-[#E0F5FF] hover:bg-[#CFEFFF] transition-all duration-100 cursor-pointer rounded-lg"
        >
          Food, Agriculture & Organic
          <PlusIcon
            className={`w-5 transition-transform duration-300 ${
              open === 2 ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ${
            open === 2
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden px-4 pb-0.5 pt-4">
            <div className="grid grid-cols-4 gap-3">
              {acc2.map((ac2, i) => {
                return (
                  <fieldset key={i}>
                    <legend className="sr-only">Notifications</legend>
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`food-${i}`}
                              type="checkbox"
                              checked={certifications.food.includes(ac2)}
                              onChange={() => handleCertChange("food", ac2)}
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
                            htmlFor={`food-${i}`}
                            className="font-medium text-gray-900"
                          >
                            {ac2}
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion 3 */}
      <div className="rounded-lg overflow-hidden">
        <button
          onClick={() => toggleAccordion(3)}
          className="flex items-center justify-between w-full px-4 py-2 font-medium bg-[#E0F5FF] hover:bg-[#CFEFFF] transition-all duration-100 cursor-pointer rounded-lg"
        >
          Pharma, Health & Safety
          <PlusIcon
            className={`w-5 transition-transform duration-300 ${
              open === 3 ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ${
            open === 3
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden px-4 pb-0.5 pt-4">
            <div className="grid grid-cols-4 gap-3">
              {acc3.map((ac3, i) => {
                return (
                  <fieldset key={i}>
                    <legend className="sr-only">Notifications</legend>
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`pharma-${i}`}
                              type="checkbox"
                              checked={certifications.pharma.includes(ac3)}
                              onChange={() => handleCertChange("pharma", ac3)}
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
                            htmlFor={`pharma-${i}`}
                            className="font-medium text-gray-900"
                          >
                            {ac3}
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion 4 */}
      <div className="rounded-lg overflow-hidden">
        <button
          onClick={() => toggleAccordion(4)}
          className="flex items-center justify-between w-full px-4 py-2 font-medium bg-[#E0F5FF] hover:bg-[#CFEFFF] transition-all duration-100 cursor-pointer rounded-lg"
        >
          Religion, Ethics & Lifestyle
          <PlusIcon
            className={`w-5 transition-transform duration-300 ${
              open === 4 ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ${
            open === 4
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden px-4 pb-0.5 pt-4">
            <div className="grid grid-cols-4 gap-3">
              {acc4.map((ac4, i) => {
                return (
                  <fieldset key={i}>
                    <legend className="sr-only">Notifications</legend>
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`ethics-${i}`}
                              type="checkbox"
                              checked={certifications.ethics.includes(ac4)}
                              onChange={() => handleCertChange("ethics", ac4)}
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
                            htmlFor={`ethics-${i}`}
                            className="font-medium text-gray-900"
                          >
                            {ac4}
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Accordion 5 */}
      <div className="rounded-lg overflow-hidden">
        <button
          onClick={() => toggleAccordion(5)}
          className="flex items-center justify-between w-full px-4 py-2 font-medium bg-[#E0F5FF] hover:bg-[#CFEFFF] transition-all duration-100 cursor-pointer rounded-lg"
        >
          Technology & Digital
          <PlusIcon
            className={`w-5 transition-transform duration-300 ${
              open === 5 ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ${
            open === 5
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden  px-4 pb-0.5 pt-4">
            <div className="grid grid-cols-4 gap-3">
              {acc5.map((ac5, i) => {
                return (
                  <fieldset key={i}>
                    <legend className="sr-only">Notifications</legend>
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <div className="flex h-6 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`tech-${i}`}
                              type="checkbox"
                              checked={certifications.tech.includes(ac5)}
                              onChange={() => handleCertChange("tech", ac5)}
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
                            htmlFor={`tech-${i}`}
                            className="font-medium text-gray-900"
                          >
                            {ac5}
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
