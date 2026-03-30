// import { useState } from "react";
// import { CheckIcon } from "@heroicons/react/24/solid";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Example() {

//   const [step, setStep] = useState(1);

//   const steps = [
//     {
//       id: "01",
//       name: "Job Details",
//       description: "Add job information",
//       status: step > 1 ? "complete" : step === 1 ? "current" : "upcoming",
//     },
//     {
//       id: "02",
//       name: "Application Form",
//       description: "Candidate information",
//       status: step > 2 ? "complete" : step === 2 ? "current" : "upcoming",
//     },
//     {
//       id: "03",
//       name: "Preview",
//       description: "Check before submit",
//       status: step === 3 ? "current" : "upcoming",
//     },
//   ];

//   const nextStep = () => {
//     if (step < 3) setStep(step + 1);
//   };

//   const prevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   return (
//     <div className="max-w-5xl mx-auto mt-10">

//       {/* Steps */}
//       <nav aria-label="Progress">
//         <ol className="overflow-hidden rounded-md lg:flex lg:border lg:border-gray-200">
//           {steps.map((s, stepIdx) => (
//             <li key={s.id} className="relative flex-1">
//               <div className="border border-gray-200 lg:border-0">

//                 {s.status === "complete" ? (
//                   <div className="flex items-start px-6 py-5 text-sm font-medium">
//                     <span className="flex size-10 items-center justify-center rounded-full bg-[#0284C7]">
//                       <CheckIcon className="size-6 text-white" />
//                     </span>
//                     <span className="ml-4 flex flex-col">
//                       <span className="text-sm font-medium text-gray-900">{s.name}</span>
//                       <span className="text-sm text-gray-500">{s.description}</span>
//                     </span>
//                   </div>
//                 ) : s.status === "current" ? (
//                   <div className="flex items-start px-6 py-5 text-sm font-medium">
//                     <span className="flex size-10 items-center justify-center rounded-full border-2 border-indigo-600">
//                       <span className="text-indigo-600">{s.id}</span>
//                     </span>
//                     <span className="ml-4 flex flex-col">
//                       <span className="text-sm font-medium text-indigo-600">{s.name}</span>
//                       <span className="text-sm text-gray-500">{s.description}</span>
//                     </span>
//                   </div>
//                 ) : (
//                   <div className="flex items-start px-6 py-5 text-sm font-medium">
//                     <span className="flex size-10 items-center justify-center rounded-full border-2 border-gray-300">
//                       <span className="text-gray-500">{s.id}</span>
//                     </span>
//                     <span className="ml-4 flex flex-col">
//                       <span className="text-sm text-gray-500">{s.name}</span>
//                       <span className="text-sm text-gray-500">{s.description}</span>
//                     </span>
//                   </div>
//                 )}

//               </div>
//             </li>
//           ))}
//         </ol>
//       </nav>

//       {/* Progress text */}
//       <div className="text-right text-sm text-gray-500 mt-2">
//         {step} of 3
//       </div>

//       {/* Form Area */}
//       <div className="border rounded-lg p-6 mt-6 bg-white">

//         {step === 1 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">Job Details</h2>

//             <input
//               type="text"
//               placeholder="Job Title"
//               className="border p-2 w-full mb-3 rounded"
//             />

//             <textarea
//               placeholder="Job Description"
//               className="border p-2 w-full rounded"
//             />
//           </div>
//         )}

//         {step === 2 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">Application Form</h2>

//             <input
//               type="text"
//               placeholder="Full Name"
//               className="border p-2 w-full mb-3 rounded"
//             />

//             <input
//               type="email"
//               placeholder="Email Address"
//               className="border p-2 w-full rounded"
//             />
//           </div>
//         )}

//         {step === 3 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">Preview</h2>
//             <p className="text-gray-600">
//               Review your information before submitting.
//             </p>
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={prevStep}
//             disabled={step === 1}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Back
//           </button>

//           {step === 3 ? (
//             <button className="px-4 py-2 bg-indigo-600 text-white rounded">
//               Submit
//             </button>
//           ) : (
//             <button
//               onClick={nextStep}
//               className="px-4 py-2 bg-indigo-600 text-white rounded"
//             >
//               Next
//             </button>
//           )}
//         </div>

//       </div>

//     </div>
//   );
// }






// // latest
// import { useState } from "react";
// import { CheckIcon } from "@heroicons/react/24/solid";

// function classNames(...classes) {
//     return classes.filter(Boolean).join(" ");
// }

// export default function Example() {

//     const [currentStep, setCurrentStep] = useState(1);

//     const steps = [
//         {
//             id: "01",
//             name: "Job Details",
//             description: "Vitae sed mi luctus laoreet.",
//             href: "#",
//             status:
//                 currentStep === 1
//                     ? "current"
//                     : currentStep > 1
//                         ? "complete"
//                         : "upcoming",
//         },
//         {
//             id: "02",
//             name: "Application form",
//             description: "Cursus semper viverra.",
//             href: "#",
//             status:
//                 currentStep === 2
//                     ? "current"
//                     : currentStep > 2
//                         ? "complete"
//                         : "upcoming",
//         },
//         {
//             id: "03",
//             name: "Preview",
//             description: "Penatibus eu quis ante.",
//             href: "#",
//             status: currentStep === 3 ? "current" : "upcoming",
//         },
//     ];

//     const nextStep = () => {
//         if (currentStep < 3) setCurrentStep(currentStep + 1);
//     };

//     const prevStep = () => {
//         if (currentStep > 1) setCurrentStep(currentStep - 1);
//     };

//     return (
//         <div className="border w-216">

//             <div className="border border-red-500 p-6 flex justify-between w-full bg-[linear-gradient(93deg,rgba(2,132,199,0.15)_7.55%,rgba(2,132,199,0.05)_88.45%)]">
//                 <div className="border">
//                     <p className="text-xl text-[#000] font-semibold">Welcome to InTrade24</p>
//                     <p className="text-13 text-[#000]">Before your first intelligence run, help us personalize your experience. Takes 2 minutes.</p>
//                 </div>
//                 <div className="border-2 border-[#0284C7] px-3 rounded-2xl"><button className="h-full w-full font-medium text-15">Need Help?</button></div>
//             </div>

//             {/* STEP NAVIGATION */}
//             <div className="lg:border-t lg:border-b lg:border-gray-200">
//                 <nav
//                     aria-label="Progress"
//                     className="mx-auto "
//                 >
//                     <ol
//                         role="list"
//                         className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-r lg:border-l lg:border-gray-200"
//                     >
//                         {steps.map((step, stepIdx) => (
//                             <li key={step.id} className="relative overflow-hidden lg:flex-1 border">
//                                 <div
//                                     className={classNames(
//                                         stepIdx === 0 ? "rounded-t-md border-b-0" : "",
//                                         stepIdx === steps.length - 1 ? "rounded-b-md border-t-0" : "",
//                                         "overflow-hidden border border-gray-200 lg:border-0"
//                                     )}
//                                 >
//                                     {step.status === "complete" ? (
//                                         <div className="group">
//                                             <span
//                                                 aria-hidden="true"
//                                                 className="absolute top-0 left-0 h-full w-1 bg-transparent lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
//                                             />
//                                             <span
//                                                 className={classNames(
//                                                     stepIdx !== 0 ? "lg:pl-9" : "",
//                                                     "flex items-start px-4 py-3 text-sm font-medium"
//                                                 )}
//                                             >
//                                                 <span className="shrink-0">
//                                                     <span className="flex size-8 items-center justify-center rounded-full bg-indigo-600">
//                                                         <CheckIcon className="size-5 text-white" />
//                                                     </span>
//                                                 </span>
//                                                 <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
//                                                     <span className="text-sm font-medium text-gray-900">
//                                                         {step.name}
//                                                     </span>
//                                                     <span className="text-sm font-medium text-gray-500">
//                                                         {step.description}
//                                                     </span>
//                                                 </span>
//                                             </span>
//                                         </div>
//                                     ) : step.status === "current" ? (
//                                         <div aria-current="step">
//                                             <span
//                                                 aria-hidden="true"
//                                                 className="absolute top-0 left-0 h-full w-1 bg-indigo-600 lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
//                                             />
//                                             <span
//                                                 className={classNames(
//                                                     stepIdx !== 0 ? "lg:pl-9" : "",
//                                                     "flex items-start px-4 py-3 text-sm font-medium"
//                                                 )}
//                                             >
//                                                 <span className="shrink-0">
//                                                     <span className="flex size-8 items-center justify-center rounded-full border-2 border-indigo-600">
//                                                         <span className="text-indigo-600">{step.id}</span>
//                                                     </span>
//                                                 </span>
//                                                 <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
//                                                     <span className="text-sm font-medium text-indigo-600">
//                                                         {step.name}
//                                                     </span>
//                                                     <span className="text-sm font-medium text-gray-500">
//                                                         {step.description}
//                                                     </span>
//                                                 </span>
//                                             </span>
//                                         </div>
//                                     ) : (
//                                         <div className="group">
//                                             <span
//                                                 aria-hidden="true"
//                                                 className="absolute top-0 left-0 h-full w-1 bg-transparent lg:top-auto lg:bottom-0 lg:h-1 lg:w-full"
//                                             />
//                                             <span
//                                                 className={classNames(
//                                                     stepIdx !== 0 ? "lg:pl-9" : "",
//                                                     "flex items-start px-4 py-3 text-sm font-medium"
//                                                 )}
//                                             >
//                                                 <span className="shrink-0">
//                                                     <span className="flex size-8 items-center justify-center rounded-full border-2 border-gray-300">
//                                                         <span className="text-gray-500">{step.id}</span>
//                                                     </span>
//                                                 </span>
//                                                 <span className="mt-0.5 ml-4 flex min-w-0 flex-col">
//                                                     <span className="text-sm font-medium text-gray-500">
//                                                         {step.name}
//                                                     </span>
//                                                     <span className="text-sm font-medium text-gray-500">
//                                                         {step.description}
//                                                     </span>
//                                                 </span>
//                                             </span>
//                                         </div>
//                                     )}

//                                     {stepIdx !== 0 ? (
//                                         <div
//                                             aria-hidden="true"
//                                             className="absolute inset-0 top-0 left-0 hidden w-3 lg:block"
//                                         >
//                                             <svg
//                                                 fill="none"
//                                                 viewBox="0 0 12 82"
//                                                 preserveAspectRatio="none"
//                                                 className="size-full text-gray-300"
//                                             >
//                                                 <path
//                                                     d="M0.5 0V31L10.5 41L0.5 51V82"
//                                                     stroke="currentcolor"
//                                                     vectorEffect="non-scaling-stroke"
//                                                 />
//                                             </svg>
//                                         </div>
//                                     ) : null}
//                                 </div>
//                             </li>
//                         ))}
//                     </ol>
//                 </nav>
//             </div>

//             {/* FORM AREA */}
//             <div className=" mx-auto mt-1 border rounded-lg p-6 border-red-500">


//                 {/* display form no */}
//                 {/* <div className="text-right text-sm text-gray-500 mb-6">
//           {currentStep} of 3
//         </div> */}

//                 {currentStep === 1 && (
//                     <div>
//                         <h2 className="text-lg font-semibold mb-4">Job Details</h2>
//                         <input className="border p-2 w-full mb-3 rounded" placeholder="Job title" />
//                         <textarea className="border p-2 w-full rounded" placeholder="Description" />
//                     </div>
//                 )}

//                 {currentStep === 2 && (
//                     <div>
//                         <h2 className="text-lg font-semibold mb-4">Application Form</h2>
//                         <input className="border p-2 w-full mb-3 rounded" placeholder="Full Name" />
//                         <input className="border p-2 w-full rounded" placeholder="Email" />
//                     </div>
//                 )}

//                 {currentStep === 3 && (
//                     <div>
//                         <h2 className="text-lg font-semibold mb-4">Preview</h2>
//                         <p className="text-gray-600">Check all details before submitting.</p>
//                     </div>
//                 )}

//                 {/* BUTTONS */}
//                 <div className="flex justify-between mt-6">
//                     <button
//                         onClick={prevStep}
//                         disabled={currentStep === 1}
//                         className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
//                     >
//                         Back
//                     </button>

//                     {currentStep === 3 ? (
//                         <button className="px-4 py-2 bg-indigo-600 text-white rounded">
//                             Submit
//                         </button>
//                     ) : (
//                         <button
//                             onClick={nextStep}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded"
//                         >
//                             Next
//                         </button>
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// }





// latest
import { useState } from "react";

import { CheckIcon, AdjustmentsHorizontalIcon, ArrowRightIcon, ArrowLeftIcon, WrenchScrewdriverIcon, ShoppingCartIcon, BuildingStorefrontIcon, TagIcon, CommandLineIcon, RectangleGroupIcon, RocketLaunchIcon, UserGroupIcon, FilmIcon, PlusCircleIcon, ViewfinderCircleIcon, CodeBracketSquareIcon, CogIcon, FunnelIcon, BeakerIcon, ComputerDesktopIcon, BellIcon, ClipboardDocumentListIcon, ForwardIcon, TruckIcon,ShieldCheckIcon  } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import AccordionCheckBox from "./AccordianCheckBox";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function PopForm({ setPopupOpen }) {

    const [currentStep, setCurrentStep] = useState(1);

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



    // company types (step1)
    const companyType = [
        {
            id: "1",
            label: "Manufacturer",
            icon: WrenchScrewdriverIcon
        },
        {
            id: "2",
            label: "Exporter/Trader",
            icon: ForwardIcon
        },
        {
            id: "3",
            label: "Distributor/Agent",
            icon: BuildingStorefrontIcon
        },
        {
            id: "4",
            label: "Brand/Private Label",
            icon: TagIcon
        },
        {
            id: "5",
            label: "Software/SaaS",
            icon: CommandLineIcon
        },
        {
            id: "6",
            label: "Service Provider",
            icon: RectangleGroupIcon
        },
        {
            id: "7",
            label: "B2C/D2C Retail",
            icon: ShoppingCartIcon
        },
        {
            id: "8",
            label: "R&D/Startup",
            icon: RocketLaunchIcon
        },
        {
            id: "9",
            label: "Conglomerate/Group",
            icon: UserGroupIcon
        },
        {
            id: "10",
            label: "Printing/Media/Social",
            icon: FilmIcon
        },
        {
            id: "11",
            label: "Other",
            icon: PlusCircleIcon
        }
    ];


    // product type (step2)
    const productType = [
        {
            id: "1",
            label: "Raw Material",
            icon: ViewfinderCircleIcon
        },
        {
            id: "2",
            label: "Extract/API",
            icon: CodeBracketSquareIcon
        },
        {
            id: "3",
            label: "Finished/Packaged Goods",
            icon: TruckIcon
        },
        {
            id: "4",
            label: "Component/Part",
            icon: CogIcon
        },
        {
            id: "5",
            label: "Formulation/Blend",
            icon: FunnelIcon
        },
        {
            id: "6",
            label: "Compound/Chemical",
            icon: BeakerIcon
        },
        {
            id: "7",
            label: "Software/Tech",
            icon: ComputerDesktopIcon
        },
        {
            id: "8",
            label: "Service/Deliverables",
            icon: BellIcon
        },
        {
            id: "9",
            label: "Commodity/Bulk",
            icon: ClipboardDocumentListIcon
        },
        {
            id: "10",
            label: "Branded/Private Label",
            icon: TagIcon
        },
        {
            id: "11",
            label: "Other",
            icon: PlusCircleIcon
        }
    ];

    const notificationMethod1 = [
        { id: 'export', title: 'Export' },
        { id: 'domestic', title: 'Domestic' },
        { id: 'both', title: 'Both' },
    ];

    const notificationMethod2 = [
        { id: 'b2b', title: 'b2b' },
        { id: 'b2c', title: 'B2C' },
        { id: 'both', title: 'Both' },
    ]


    // primary goal (step3)
    const primaryGoal = [
        {
            id: "1",
            label: "Find export buyers",
            icon: WrenchScrewdriverIcon
        },
        {
            id: "2",
            label: "Discover which markets to enter",
            icon: WrenchScrewdriverIcon
        },
        {
            id: "3",
            label: "Find distributors/agents",
            icon: WrenchScrewdriverIcon
        },
        {
            id: "4",
            label: "Understand my competition",
            icon: WrenchScrewdriverIcon
        },
        {
            id: "5",
            label: "Validate a new product",
            icon: WrenchScrewdriverIcon
        },
        {
            id: "6",
            label: "Grow existing market share",
            icon: WrenchScrewdriverIcon
        },
        {
            id: "7",
            label: "General market research",
            icon: WrenchScrewdriverIcon
        }
    ];

    const yearsInIndustry = [
        {
            id:"1",
            txt:"New"
        },
        {
            id:"2",
            txt:"1-3 Years"
        },
        {
            id:"3",
            txt:"3-7 Years"
        },
        {
            id:"4",
            txt:"7-15 Years"
        },
        {
            id:"5",
            txt:"15+ Years"
        }
    ]

    return (
        <div className="w-216">

            <div className="p-6 flex justify-between w-full bg-[linear-gradient(93deg,rgba(2,132,199,0.15)_7.55%,rgba(2,132,199,0.05)_88.45%)]">
                <div>
                    <p className="text-xl text-[#000] font-semibold">Welcome to InTrade24</p>
                    <p className="text-13 text-[#000]">Before your first intelligence run, help us personalize your experience. Takes 2 minutes.</p>
                </div>
                <div className="border-2 border-[#0284C7] px-3 rounded-2xl"><button className="h-full w-full font-medium text-15">Need Help?</button></div>
            </div>

            {/* STEP NAVIGATION */}
            <div className="lg:border-t lg:border-b lg:border-gray-200">
                <nav
                    aria-label="Progress"
                    className="mx-auto "
                >
                    <ol
                        role="list"
                        className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-r lg:border-l lg:border-gray-200"
                    >
                        {steps.map((step, stepIdx) => (
                            <li key={step.id} className="relative overflow-hidden lg:flex-1">
                                <div
                                    className={classNames(
                                        stepIdx === 0 ? "rounded-t-md border-b-0" : "",
                                        stepIdx === steps.length - 1 ? "rounded-b-md border-t-0" : "",
                                        "overflow-hidden border border-gray-200 lg:border-0"
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
                                                    "flex items-start px-4 py-3 text-sm font-medium"
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
                                                    "flex items-start px-4 py-3 text-sm font-medium"
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
                                                    "flex items-start px-4 py-3 text-sm font-medium"
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

            {/* FORM AREA */}
            <div className="mx-auto mt-1 rounded-lg p-6">
                <div className="h-110 overflow-auto no-scrollbar">

                    {currentStep === 1 && (
                        <div>
                            <div className="grid grid-cols-2 gap-6">
                                <div><label htmlFor="nameInput" className="block text-lg font-semibold text-[#001413]">
                                    Enter You Name
                                </label>
                                    <div>
                                        <input
                                            id="nameInput"
                                            name="name"
                                            type="text"
                                            placeholder="John Doe"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                                        />
                                    </div></div>
                                <div><label htmlFor="companyName" className="block text-lg font-semibold text-[#001413]">
                                    Company Name
                                </label>
                                    <div>
                                        <input
                                            id="companyName"
                                            name="company"
                                            type="text"
                                            placeholder="your company LLC"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#0284C7] sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-lg font-semibold text-[#001413]">
                                        Location
                                    </label>
                                    <div className="grid grid-cols-1">
                                        <select
                                            id="location"
                                            name="location"
                                            defaultValue="Canada"
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
                                        >
                                            <option>United States</option>
                                            <option>Canada</option>
                                            <option>Mexico</option>
                                        </select>
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="Industry" className="block text-lg font-semibold text-[#001413]">
                                        Industry
                                    </label>
                                    <div className="grid grid-cols-1">
                                        <select
                                            id="Industry"
                                            name="Industry"
                                            defaultValue="Canada"
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
                                        >
                                            <option>Industry1</option>
                                            <option>Industry2</option>
                                            <option>Industry3</option>
                                        </select>
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                        />
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-[#001413] font-semibold text-lg mt-6">Company Type</h1>

                            <div className="mt-3 flex flex-wrap gap-y-3 gap-x-4">
                                {companyType?.map((btn) => {
                                    return (
                                        <button
                                            key={btn.id}
                                            type="button"
                                            className="inline-flex items-center gap-x-2 rounded-md border border-[#C8CED4] bg-[#FAFAFA] hover:bg-[#F5F5F5] cursor-pointer px-3.5 py-2.5 text-sm font-medium text-[#5F6368] shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
                                        >
                                            {btn.label}
                                            <btn.icon className="-mr-0.5 size-5" />
                                            {/* <CheckCircleIcon aria-hidden="true" /> */}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* <h1 className="text-[#001413] font-semibold text-lg mt-6">Years in Industry</h1> */}
                            <div className="mt-6">
                                <p className="text-lg font-semibold text-[#001413]">Years in Industry</p>
                                <fieldset>
                                        <legend className="text-[#001413] font-semibold text-lg">Sales Intent</legend>
                                        <div className="mt-3 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                            {yearsInIndustry.map((industry) => (
                                                <div key={industry.id} className="flex items-center">
                                                    <input
                                                        id={industry.id}
                                                        name="notification-method"
                                                        type="radio"
                                                        // className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#0284C7] checked:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-white before:opacity-0 checked:border-[#0284C7] checked:bg-[#0284C7] checked:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
                                                    />
                                                    <label htmlFor={industry.id} className="ml-3 block text-sm/6 font-medium text-gray-900">
                                                        {industry.txt}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="company-website" className="block text-lg font-semibold text-[ #001413]">
                                    Website
                                </label>
                                <div className="mt-3 w-99">
                                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-[#5F6368] focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-[#0284C7]">
                                        <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">https://</div>
                                        <input
                                            id="company-website"
                                            name="company-website"
                                            type="text"
                                            placeholder="www.example.com"
                                            className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h1 className="text-[#001413] font-semibold text-lg">Product Type</h1>
                            <div className="mt-3 flex flex-wrap gap-y-3 gap-x-4">
                                {productType?.map((btn) => {
                                    return (
                                        <button
                                            key={btn.id}
                                            type="button"
                                            className="inline-flex items-center gap-x-2 rounded-md  border border-[#C8CED4] bg-[#FAFAFA] px-3.5 cursor-pointer py-2.5 text-sm font-semibold text-[#5F6368] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
                                        >
                                            {btn.label}
                                            <btn.icon className="-mr-0.5 size-5" />
                                            {/* <CheckCircleIcon aria-hidden="true" /> */}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-10">
                                <div>
                                    <fieldset>
                                        <legend className="text-[#001413] font-semibold text-lg">Sales Intent</legend>
                                        <div className="mt-3 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                            {notificationMethod1.map((notificationMethod) => (
                                                <div key={notificationMethod.id} className="flex items-center">
                                                    <input
                                                        id={notificationMethod.id}
                                                        name="notification-method"
                                                        type="radio"
                                                        // className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#0284C7] checked:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-white before:opacity-0 checked:border-[#0284C7] checked:bg-[#0284C7] checked:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
                                                    />
                                                    <label htmlFor={notificationMethod.id} className="ml-3 block text-sm/6 font-medium text-gray-900">
                                                        {notificationMethod.title}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                                <div>
                                    <fieldset>
                                        <legend className="text-sm/6 font-semibold text-gray-900">Buyer Type</legend>
                                        <div className="mt-3 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                            {notificationMethod2.map((notificationMethod) => (
                                                <div key={notificationMethod.id} className="flex items-center">
                                                    <input
                                                        id={notificationMethod.id}
                                                        name="notification-method"
                                                        type="radio"
                                                        // className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#0284C7] checked:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                                        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:top-1/2 before:left-1/2 before:size-2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-white before:opacity-0 checked:border-[#0284C7] checked:bg-[#0284C7] checked:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
                                                    />
                                                    <label htmlFor={notificationMethod.id} className="ml-3 block text-sm/6 font-medium text-gray-900">
                                                        {notificationMethod.title}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>

                            <div className="mt-6">
                                <fieldset>
                                    <legend className="text-[#001413] font-semibold text-lg">Price Positioning</legend>
                                    <div className="mt-3 flex gap-6">
                                        <div className="flex gap-3">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        defaultChecked
                                                        id="comments"
                                                        name="comments"
                                                        type="checkbox"
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
                                                <label htmlFor="comments" className="font-medium text-gray-900">
                                                    Budget
                                                </label>
                                                {/* {' '}
                                            <span id="comments-description" className="text-gray-500">
                                                <span className="sr-only">New comments </span>so you always know what's happening.
                                            </span> */}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        id="candidates"
                                                        name="candidates"
                                                        type="checkbox"
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
                                                <label htmlFor="candidates" className="font-medium text-gray-900">
                                                    Mid Range
                                                </label>
                                                {/* {' '}
                                            <span id="candidates-description" className="text-gray-500">
                                                <span className="sr-only">New candidates </span>who apply for any open postings.
                                            </span> */}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        id="offers"
                                                        name="offers"
                                                        type="checkbox"
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
                                                <label htmlFor="offers" className="font-medium text-gray-900">
                                                    Premium
                                                </label>
                                                {/* {' '}
                                            <span id="offers-description" className="text-gray-500">
                                                <span className="sr-only">Offers </span>when they are accepted or rejected by candidates.
                                            </span> */}
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h1 className="text-[#001413] font-semibold text-lg">Product Type</h1>
                            <div className="mt-3 flex flex-wrap gap-y-3 gap-x-4">
                                {primaryGoal?.map((btn) => {
                                    return (
                                        <button
                                            key={btn.id}
                                            type="button"
                                            className="inline-flex items-center gap-x-2 rounded-md border border-[#C8CED4] bg-[#FAFAFA] px-3.5 py-2.5 text-sm font-semibold text-[#5F6368] shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] cursor-pointer"
                                        >
                                            {btn.label}
                                            <btn.icon className="-mr-0.5 size-5" />
                                            {/* <CheckCircleIcon aria-hidden="true" /> */}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex gap-3 items-center mt-6">
                                <div><h1 className="bordertext-[#001413] text-lg font-semibold">Certification You Hold</h1></div>
                                <div>
                                    <button className="border border-[#C8CED4] text-[#5F6368] py-3 px-4 rounded-4xl hover:bg-[#F0F0F0] cursor-pointer">Not Yet - I’m working on it</button>
                                </div>
                            </div>
                            {/* accordian */}
                            <div className="mt-3">
                                <AccordionCheckBox />
                            </div>

                            {/* select */}
                            <div className="mt-6">
                                <label htmlFor="location" className="block text-sm/6 font-medium text-gray-900">
                                    How did you hear about InTrade24?
                                </label>
                                <div className="mt-2 grid grid-cols-1">
                                    <select
                                        id="location"
                                        name="location"
                                        defaultValue="option1"
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
                                    >
                                        <option>option1</option>
                                        <option>option2</option>
                                        <option>option3</option>
                                    </select>
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <span><ShieldCheckIcon className="h-5 w-5" /></span><span className="text-[#5F6368] text-13">Your profile personalises research results only. It is never shared or sold. You can update any of this in Settings at any time.</span>
                            </div>

                        </div>
                    )}

                </div>

                {/* BUTTONS */}
                <div className="flex justify-between items-center mt-6">
                    {/* display form no */}
                    <div className="text-sm text-[#000000] font-light">
                        {currentStep} of 3
                    </div>
                    <div className="flex gap-6">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="px-4 py-2 border-2 border-[#0284C7] hover:bg-gray-100 text-[#001413] rounded-lg text-lg font-semibold cursor-pointer flex gap-2 justify-center items-center disabled:opacity-0 disabled:cursor-default"
                        >
                            <span className="mt-1"><ArrowLeftIcon className="w-4 h-4 font-bold" /></span>
                            <span>Back</span>
                        </button>

                        {currentStep === 3 ? (
                            <button className="px-4 py-2 bg-[#0284C7] hover:bg-[#0274B0] text-[#FFFFFF] rounded-lg text-lg font-semibold cursor-pointer" onClick={() => setPopupOpen(false)}>
                                Finish & Go to Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0274B0] text-[#FFFFFF] rounded-lg text-lg font-semibold flex gap-2 justify-center items-center cursor-pointer"
                            >
                                <span>Continue</span>
                                <span className="mt-1"><ArrowRightIcon className="w-4 h-4 font-bold" /></span>
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
