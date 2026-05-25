// // import {
// //   ListBulletIcon,
// //   Squares2X2Icon,
// //   UserCircleIcon,
// //   DocumentMagnifyingGlassIcon,
// //   ClipboardDocumentListIcon,
// //   LightBulbIcon,
// // } from "@heroicons/react/24/outline";
// // import { useLayoutEffect, useRef, useState } from "react";
// // import List from "./List";
// // import Grid from "./Grid";

// // function classNames(...classes) {
// //   return classes.filter(Boolean).join(" ");
// // }

// // const Step2 = ({
// //   fetching_allProducts,
// //   products,
// //   selectedProducts,
// //   setSelectedProducts,
// //   usage_summary_data,
// // }) => {
// //   const checkbox = useRef();
// //   const [checked, setChecked] = useState(false);
// //   const [indeterminate, setIndeterminate] = useState(false);
// //   const [view, setView] = useState("list");

// //   useLayoutEffect(() => {
// //     const isIndeterminate =
// //       selectedProducts.length > 0 && selectedProducts.length < products.length;
// //     setChecked(selectedProducts.length === products.length);
// //     setIndeterminate(isIndeterminate);
// //     checkbox.current.indeterminate = isIndeterminate;
// //   }, [selectedProducts]);

// //   function toggleAll() {
// //     setSelectedProducts(checked || indeterminate ? [] : products);
// //     setChecked(!checked && !indeterminate);
// //     setIndeterminate(false);
// //   }

// //   const selectedCount = selectedProducts?.length || 0;
// //   const totalLimit = usage_summary_data || 0;

// //   const progressPercent =
// //     totalLimit > 0 ? (selectedCount / totalLimit) * 100 : 0;

// //   return (
// //     <>
// //       <h1 className="text-[28px] font-semibold text-[#000000]">
// //         Validate & Select Products
// //       </h1>
// //       <p className="text-13 text-[#5F6368]">
// //         Select which products to analyse, only selected ones will be included in
// //         your intelligence run.
// //       </p>
// //       <div className="grid grid-cols-[1fr_326px] gap-6">
// //         <div>
// //           <div>
// //             <div className="border border-[#E6E6E6] rounded-xl flex gap-2 items-center justify-between p-4 mt-4 bg-[#FFFFFF]">
// //               <div className="flex gap-4 items-center">
// //                 <div className="group grid size-4 grid-cols-1">
// //                   <input
// //                     type="checkbox"
// //                     className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0284C7] bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
// //                     ref={checkbox}
// //                     checked={checked}
// //                     onChange={toggleAll}
// //                   />
// //                   <svg
// //                     className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
// //                     viewBox="0 0 14 14"
// //                     fill="none"
// //                   >
// //                     <path
// //                       className="opacity-0 group-has-checked:opacity-100"
// //                       d="M3 8L6 11L11 3.5"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                     />
// //                     <path
// //                       className="opacity-0 group-has-indeterminate:opacity-100"
// //                       d="M3 7H11"
// //                       strokeWidth="2"
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                     />
// //                   </svg>
// //                 </div>
// //                 <span className="text-13 text-[#001413]">SelectAll</span>
// //                 <div className="border bg-[#0284C7] text-[#FFFFFF] text-xs font-light py-0.5 px-2 rounded flex">
// //                   <div className="w-4">{selectedProducts?.length}</div>
// //                   selected
// //                 </div>
// //                 <div>
// //                   <h2 className="font-medium text-[#000000]">
// //                     Products ready for analysis
// //                   </h2>
// //                   <p className="text-13 font-regular text-[#5F6368]">
// //                     Review flagged items before confirming
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex gap-2">
// //                 <button
// //                   type="button"
// //                   onClick={() => setView("list")}
// //                   className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-[#9EDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF] cursor-pointer ${view === "list" ? "bg-[#9EDBFF]" : "bg-[#E0F5FF]"}`}
// //                 >
// //                   <ListBulletIcon
// //                     aria-hidden="true"
// //                     className="-ml-0.5 size-5"
// //                   />
// //                   List
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setView("grid")}
// //                   className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-[#9EDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF] cursor-pointer ${view === "grid" ? "bg-[#9EDBFF]" : "bg-[#E0F5FF]"}`}
// //                 >
// //                   <Squares2X2Icon
// //                     aria-hidden="true"
// //                     className="-ml-0.5 size-5"
// //                   />
// //                   Grid
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="mt-4">
// //             <div className="sm:flex sm:items-center flex gap-1">
// //               <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3 rounded-2xl text-sm">
// //                 <div className="h-1.5 w-[5.5px] bg-[#2E7D32] rounded-full"></div>
// //                 High Confidence
// //               </div>
// //               <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3  rounded-2xl text-sm">
// //                 <div className="h-1.5 w-[5.5px] bg-[#D48C15] rounded-full"></div>
// //                 Needs Review
// //               </div>
// //               <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3  rounded-2xl text-sm">
// //                 <div className="h-1.5 w-[5.5px] bg-[#C62828] rounded-full"></div>
// //                 Low Data
// //               </div>
// //             </div>
// //             <div className="mt-4 flow-root">
// //               <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
// //                 <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
// //                   <div className="group/table relative">
// //                     <div className="relative min-w-full table-fixed divide-y divide-gray-300">
// //                       <div className="divide-y divide-gray-200 bg-white rounded-xl border border-[#E6E6E6] mb-4">
// //                         {view === "list" && (
// //                           <List
// //                             products={products}
// //                             fetching_allProducts={fetching_allProducts}
// //                             selectedProducts={selectedProducts}
// //                             setSelectedProducts={setSelectedProducts}
// //                           />
// //                         )}
// //                         {view === "grid" && (
// //                           <Grid
// //                             products={products}
// //                             fetching_allProducts={fetching_allProducts}
// //                             selectedProducts={selectedProducts}
// //                             setSelectedProducts={setSelectedProducts}
// //                           />
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="p-4 flex flex-col justify-between bg-[#FFFFFF] my-4 rounded-lg border border-[#E6E6E6] card-hover">
// //           <div>
// //             <p className="text-[#5F6368] text-xs font-light">RUN COST</p>
// //             <div className="grid grid-cols-2 mt-3">
// //               <div className="flex items-center gap-1.5">
// //                 <span className="text-[28px] font-semibold text-[#000000]">
// //                   {selectedProducts?.length || 0}
// //                 </span>
// //                 <span className="text-[#5F6368] text-13">queries</span>
// //               </div>
// //               <div className="text-right text-base font-medium text-[#000000] content-center">
// //                 {usage_summary_data || 0}
// //               </div>
// //               <div className="text-[#5F6368] font-light text-xs">
// //                 1 per product selected
// //               </div>
// //               <div className="text-right text-[#5F6368] font-light text-xs">
// //                 remaining after
// //               </div>
// //             </div>

// //             <div className="flex justify-between items-center mt-4">
// //               <div className="text-xs font-regular text-[#001413]">
// //                 {selectedProducts?.length || 0}
// //               </div>
// //               <div className="w-[85%] h-1 bg-[#A9B3B1] rounded">
// //                 <div
// //                   className="h-1 bg-[#0284C7] rounded"
// //                   style={{ width: `${progressPercent}%` }}
// //                 ></div>
// //               </div>
// //               <div className="text-xs font-regular text-[#001413]">{usage_summary_data || 0}</div>
// //             </div>
// //             <p className="flex justify-between">
// //               <span className="text-[#5F6368] text-xs font-light">
// //                 This run
// //               </span>
// //               <span className="text-[#5F6368] text-xs font-light">
// //                 Remaining
// //               </span>
// //             </p>

// //             <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />
// //             <p className="text-[#5F6368] font-light text-xs">
// //               WHAT HAPPENS NEXT
// //             </p>

// //             <div className="mt-3">
// //               <div className="flex gap-3">
// //                 <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
// //                   <UserCircleIcon className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <p className="text-[#000000] text-sm font-medium">
// //                     Complete your profile
// //                   </p>
// //                   <p className="text-[#000000] text-xs font-light">
// //                     Business type, target regions, certifications
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex gap-3 mt-4">
// //                 <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
// //                   <DocumentMagnifyingGlassIcon className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <p className="text-[#000000] text-sm font-medium">
// //                     Engine runs 6 modules
// //                   </p>
// //                   <p className="text-[#000000] text-xs font-light">
// //                     Demand · Keywords · Trade · Buyers · Price · Competition
// //                   </p>
// //                 </div>
// //               </div>
// //               <div className="flex gap-3 mt-4">
// //                 <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
// //                   <ClipboardDocumentListIcon className="h-5 w-5" />
// //                 </div>
// //                 <div>
// //                   <p className="text-[#000000] text-sm font-medium">
// //                     Full opportunity report
// //                   </p>
// //                   <p className="text-[#000000] text-xs font-light">
// //                     uyers, markets, keywords, email sequence
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>

// //             <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />
// //           </div>

// //           <div className="flex gap-1.5 border p-3 border-[#ABECAE] bg-[#F3FFF3] rounded-lg">
// //             <div className="h-7.5 p-1.5 flex justify-center items-center text-[#2E7D32] rounded-sm">
// //               <LightBulbIcon className="h-5 w-5" />
// //             </div>
// //             <div>
// //               <p className="text-[#2E7D32] text-sm font-medium">
// //                 Improve accuracy before running.
// //               </p>
// //               <p className="text-[#5F6368] text-xs font-light">
// //                 Products with low confidence scores may return fewer buyers. Use
// //                 Review & Update to fill in missing fields.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };
// // export default Step2;

// latest code
// import {
//   ListBulletIcon,
//   Squares2X2Icon,
//   UserCircleIcon,
//   DocumentMagnifyingGlassIcon,
//   ClipboardDocumentListIcon,
//   LightBulbIcon,
// } from "@heroicons/react/24/outline";
// import { useEffect, useLayoutEffect, useRef, useState } from "react";
// import List from "./List";
// import Grid from "./Grid";
// import toast from "react-hot-toast";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const Step2 = ({
//   fetching_allProducts,
//   products,
//   selectedProducts,
//   setSelectedProducts,
//   usage_summary_data,
//   scoutPlan
// }) => {
//   const checkbox = useRef();
//   const [checked, setChecked] = useState(false);
//   const [indeterminate, setIndeterminate] = useState(false);
//   const [view, setView] = useState("list");

//   //   useLayoutEffect(() => {
//   //     const isIndeterminate =
//   //       selectedProducts.length > 0 && selectedProducts.length < products.length;
//   //     // setChecked(selectedProducts.length === products.length);
//   //     setChecked(
//   //   selectedProducts.length ===
//   //   Math.min(products.length, usage_summary_data || 0)
//   // );
//   //     setIndeterminate(isIndeterminate);
//   //     // checkbox.current.indeterminate = isIndeterminate;
//   //     if (checkbox.current) {
//   //   checkbox.current.indeterminate = isIndeterminate;
//   // }
//   //   }, [selectedProducts,products]);

//   const maxSelection = scoutPlan || 0;

//   useLayoutEffect(() => {
//   const sortedProducts = [...products].sort(
//     (a, b) =>
//       Number(b?.confidence_score) -
//       Number(a?.confidence_score)
//   );

//   const maxSelectable = Math.min(
//     sortedProducts.length,
//     maxSelection
//   );

//   const isIndeterminate =
//     selectedProducts.length > 0 &&
//     selectedProducts.length < maxSelectable;

//   setChecked(
//     selectedProducts.length === maxSelectable
//   );

//   setIndeterminate(isIndeterminate);

//   if (checkbox.current) {
//     checkbox.current.indeterminate =
//       isIndeterminate;
//   }
// }, [
//   selectedProducts,
//   products,
//   maxSelection,
// ]);

//   // function toggleAll() {
//   //   setSelectedProducts(checked || indeterminate ? [] : products);
//   //   setChecked(!checked && !indeterminate);
//   //   setIndeterminate(false);
//   // }

//   function toggleAll() {
//   if (checked || indeterminate) {
//     setSelectedProducts([]);
//   } else {
//     const sortedProducts = [...products].sort(
//       (a, b) =>
//         Number(b?.confidence_score) -
//         Number(a?.confidence_score)
//     );

//     setSelectedProducts(
//       sortedProducts.slice(
//         0,
//         maxSelection
//       )
//     );
//   }
// }

//   const selectedCount = selectedProducts?.length || 0;
//   const totalLimit = usage_summary_data || 0;

//   const progressPercent =
//     totalLimit > 0 ? (selectedCount / totalLimit) * 100 : 0;

//   // const handleProductSelect = (isChecked, prod) => {
//   //   if (isChecked) {
//   //     if (selectedProducts.length < maxSelection) {
//   //       setSelectedProducts([...selectedProducts, prod]);
//   //     }
//   //   } else {
//   //     setSelectedProducts(selectedProducts.filter((p) => p !== prod));
//   //   }
//   // };

// //   const handleProductSelect = (
// //   isChecked,
// //   prod
// // ) => {
// //   if (isChecked) {
// //     const alreadySelected =
// //       selectedProducts.some(
// //         (p) => p.id === prod.id
// //       );

// //     if (alreadySelected) return;

// //     if (
// //       selectedProducts.length <
// //       maxSelection
// //     ) {
// //       setSelectedProducts(
// //         (prev) => [
// //           ...prev,
// //           prod,
// //         ]
// //       );
// //     }
// //   } else {
// //     setSelectedProducts(
// //       (prev) =>
// //         prev.filter(
// //           (p) =>
// //             p.id !== prod.id
// //         )
// //     );
// //   }
// // };

// const handleProductSelect = (
//   isChecked,
//   prod
// ) => {
//   if (isChecked) {
//     const alreadySelected =
//       selectedProducts.some(
//         (p) => p.id === prod.id
//       );

//     if (alreadySelected) return;

//     // limit reached
//     if (
//       selectedProducts.length >=
//       maxSelection
//     ) {
//       toast.error(
//         `You cannot select more than ${maxSelection} products`
//       );
//       return;
//     }

//     setSelectedProducts(
//       (prev) => [
//         ...prev,
//         prod,
//       ]
//     );
//   } else {
//     setSelectedProducts(
//       (prev) =>
//         prev.filter(
//           (p) =>
//             p.id !== prod.id
//         )
//     );
//   }
// };

//   return (
//     <>
//       <h1 className="text-[28px] font-semibold text-[#000000]">
//         Validate & Select Products
//       </h1>
//       <p className="text-13 text-[#5F6368]">
//         Select which products to analyse, only selected ones will be included in
//         your intelligence run.
//       </p>
//       <div className="grid grid-cols-[1fr_326px] gap-6">
//         <div>
//           <div>
//             <div className="border border-[#E6E6E6] rounded-xl flex gap-2 items-center justify-between p-4 mt-4 bg-[#FFFFFF]">
//               <div className="flex gap-4 items-center">
//                 <div className="group grid size-4 grid-cols-1">
//                   <input
//                     type="checkbox"
//                     className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0284C7] bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
//                     ref={checkbox}
//                     checked={checked}
//                     onChange={toggleAll}
//                   />
//                   <svg
//                     className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
//                     viewBox="0 0 14 14"
//                     fill="none"
//                   >
//                     <path
//                       className="opacity-0 group-has-checked:opacity-100"
//                       d="M3 8L6 11L11 3.5"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       className="opacity-0 group-has-indeterminate:opacity-100"
//                       d="M3 7H11"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                 </div>
//                 <span className="text-13 text-[#001413]">SelectAll</span>
//                 <div className="border bg-[#0284C7] text-[#FFFFFF] text-xs font-light py-0.5 px-2 rounded flex">
//                   <div className="w-4">{selectedProducts?.length}</div>
//                   selected
//                 </div>
//                 <div>
//                   <h2 className="font-medium text-[#000000]">
//                     Products ready for analysis
//                   </h2>
//                   <p className="text-13 font-regular text-[#5F6368]">
//                     Review flagged items before confirming
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setView("list")}
//                   className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-[#9EDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF] cursor-pointer ${view === "list" ? "bg-[#9EDBFF]" : "bg-[#E0F5FF]"}`}
//                 >
//                   <ListBulletIcon
//                     aria-hidden="true"
//                     className="-ml-0.5 size-5"
//                   />
//                   List
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setView("grid")}
//                   className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-[#9EDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF] cursor-pointer ${view === "grid" ? "bg-[#9EDBFF]" : "bg-[#E0F5FF]"}`}
//                 >
//                   <Squares2X2Icon
//                     aria-hidden="true"
//                     className="-ml-0.5 size-5"
//                   />
//                   Grid
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4">
//             <div className="sm:flex sm:items-center flex gap-1">
//               <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3 rounded-2xl text-sm">
//                 <div className="h-1.5 w-[5.5px] bg-[#2E7D32] rounded-full"></div>
//                 High Confidence
//               </div>
//               <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3  rounded-2xl text-sm">
//                 <div className="h-1.5 w-[5.5px] bg-[#D48C15] rounded-full"></div>
//                 Needs Review
//               </div>
//               <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3  rounded-2xl text-sm">
//                 <div className="h-1.5 w-[5.5px] bg-[#C62828] rounded-full"></div>
//                 Low Data
//               </div>
//             </div>
//             <div className="mt-4 flow-root">
//               <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//                 <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//                   <div className="group/table relative">
//                     <div className="relative min-w-full table-fixed divide-y divide-gray-300">
//                       <div className="divide-y divide-gray-200 bg-white rounded-xl border border-[#E6E6E6] mb-4">
//                         {view === "list" && (
//                           <List
//                             products={products}
//                             fetching_allProducts={fetching_allProducts}
//                             selectedProducts={selectedProducts}
//                             setSelectedProducts={setSelectedProducts}
//                             handleProductSelect={handleProductSelect}
//                           />
//                         )}
//                         {view === "grid" && (
//                           <Grid
//                             products={products}
//                             fetching_allProducts={fetching_allProducts}
//                             selectedProducts={selectedProducts}
//                             setSelectedProducts={setSelectedProducts}
//                             handleProductSelect={handleProductSelect}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="p-4 flex flex-col justify-between bg-[#FFFFFF] my-4 rounded-lg border border-[#E6E6E6] card-hover">
//           <div>
//             <p className="text-[#5F6368] text-xs font-light">RUN COST</p>
//             <div className="grid grid-cols-2 mt-3">
//               <div className="flex items-center gap-1.5">
//                 <span className="text-[28px] font-semibold text-[#000000]">
//                   {selectedProducts?.length || 0}
//                 </span>
//                 <span className="text-[#5F6368] text-13">queries</span>
//               </div>
//               <div className="text-right text-base font-medium text-[#000000] content-center">
//                 {usage_summary_data || 0}
//               </div>
//               <div className="text-[#5F6368] font-light text-xs">
//                 1 per product selected
//               </div>
//               <div className="text-right text-[#5F6368] font-light text-xs">
//                 remaining after
//               </div>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <div className="text-xs font-regular text-[#001413]">
//                 {selectedProducts?.length || 0}
//               </div>
//               <div className="w-[85%] h-1 bg-[#A9B3B1] rounded">
//                 <div
//                   className="h-1 bg-[#0284C7] rounded"
//                   style={{ width: `${progressPercent}%` }}
//                 ></div>
//               </div>
//               <div className="text-xs font-regular text-[#001413]">
//                 {usage_summary_data || 0}
//               </div>
//             </div>
//             <p className="flex justify-between">
//               <span className="text-[#5F6368] text-xs font-light">
//                 This run
//               </span>
//               <span className="text-[#5F6368] text-xs font-light">
//                 Remaining
//               </span>
//             </p>

//             <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />
//             <p className="text-[#5F6368] font-light text-xs">
//               WHAT HAPPENS NEXT
//             </p>

//             <div className="mt-3">
//               <div className="flex gap-3">
//                 <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
//                   <UserCircleIcon className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-[#000000] text-sm font-medium">
//                     Complete your profile
//                   </p>
//                   <p className="text-[#000000] text-xs font-light">
//                     Business type, target regions, certifications
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-3 mt-4">
//                 <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
//                   <DocumentMagnifyingGlassIcon className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-[#000000] text-sm font-medium">
//                     Engine runs 6 modules
//                   </p>
//                   <p className="text-[#000000] text-xs font-light">
//                     Demand · Keywords · Trade · Buyers · Price · Competition
//                   </p>
//                 </div>
//               </div>
//               <div className="flex gap-3 mt-4">
//                 <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
//                   <ClipboardDocumentListIcon className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <p className="text-[#000000] text-sm font-medium">
//                     Full opportunity report
//                   </p>
//                   <p className="text-[#000000] text-xs font-light">
//                     uyers, markets, keywords, email sequence
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />
//           </div>

//           <div className="flex gap-1.5 border p-3 border-[#ABECAE] bg-[#F3FFF3] rounded-lg">
//             <div className="h-7.5 p-1.5 flex justify-center items-center text-[#2E7D32] rounded-sm">
//               <LightBulbIcon className="h-5 w-5" />
//             </div>
//             <div>
//               <p className="text-[#2E7D32] text-sm font-medium">
//                 Improve accuracy before running.
//               </p>
//               <p className="text-[#5F6368] text-xs font-light">
//                 Products with low confidence scores may return fewer buyers. Use
//                 Review & Update to fill in missing fields.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
// export default Step2;

import {
  ListBulletIcon,
  Squares2X2Icon,
  UserCircleIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import List from "./List";
import Grid from "./Grid";
import toast from "react-hot-toast";

import ProductEditModal from "./ProductEditModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Step2 = ({
  fetching_allProducts,
  products,
  selectedProducts,
  setSelectedProducts,
  usage_summary_data,
  scoutPlan,
}) => {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [view, setView] = useState("list");

  const [editingProduct, setEditingProduct] = useState(null);

  const handleEditSaved = (updatedProduct) => {
    // update the product in selectedProducts if it was selected
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    );
    setEditingProduct(null);
  };

  //   useLayoutEffect(() => {
  //     const isIndeterminate =
  //       selectedProducts.length > 0 && selectedProducts.length < products.length;
  //     // setChecked(selectedProducts.length === products.length);
  //     setChecked(
  //   selectedProducts.length ===
  //   Math.min(products.length, usage_summary_data || 0)
  // );
  //     setIndeterminate(isIndeterminate);
  //     // checkbox.current.indeterminate = isIndeterminate;
  //     if (checkbox.current) {
  //   checkbox.current.indeterminate = isIndeterminate;
  // }
  //   }, [selectedProducts,products]);

  const maxSelection = scoutPlan || 0;

  useLayoutEffect(() => {
    const sortedProducts = [...products].sort(
      (a, b) => Number(b?.confidence_score) - Number(a?.confidence_score),
    );

    const maxSelectable = Math.min(sortedProducts.length, maxSelection);

    const isIndeterminate =
      selectedProducts.length > 0 && selectedProducts.length < maxSelectable;

    setChecked(selectedProducts.length === maxSelectable);

    setIndeterminate(isIndeterminate);

    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedProducts, products, maxSelection]);

  // function toggleAll() {
  //   setSelectedProducts(checked || indeterminate ? [] : products);
  //   setChecked(!checked && !indeterminate);
  //   setIndeterminate(false);
  // }

  function toggleAll() {
    if (checked || indeterminate) {
      setSelectedProducts([]);
    } else {
      const sortedProducts = [...products].sort(
        (a, b) => Number(b?.confidence_score) - Number(a?.confidence_score),
      );

      setSelectedProducts(sortedProducts.slice(0, maxSelection));
    }
  }

  const selectedCount = selectedProducts?.length || 0;
  const totalLimit = usage_summary_data || 0;

  const progressPercent =
    totalLimit > 0 ? (selectedCount / totalLimit) * 100 : 0;

  // const handleProductSelect = (isChecked, prod) => {
  //   if (isChecked) {
  //     if (selectedProducts.length < maxSelection) {
  //       setSelectedProducts([...selectedProducts, prod]);
  //     }
  //   } else {
  //     setSelectedProducts(selectedProducts.filter((p) => p !== prod));
  //   }
  // };

  //   const handleProductSelect = (
  //   isChecked,
  //   prod
  // ) => {
  //   if (isChecked) {
  //     const alreadySelected =
  //       selectedProducts.some(
  //         (p) => p.id === prod.id
  //       );

  //     if (alreadySelected) return;

  //     if (
  //       selectedProducts.length <
  //       maxSelection
  //     ) {
  //       setSelectedProducts(
  //         (prev) => [
  //           ...prev,
  //           prod,
  //         ]
  //       );
  //     }
  //   } else {
  //     setSelectedProducts(
  //       (prev) =>
  //         prev.filter(
  //           (p) =>
  //             p.id !== prod.id
  //         )
  //     );
  //   }
  // };

  const handleProductSelect = (isChecked, prod) => {
    if (isChecked) {
      const alreadySelected = selectedProducts.some((p) => p.id === prod.id);

      if (alreadySelected) return;

      // limit reached
      if (selectedProducts.length >= maxSelection) {
        toast.error(`You cannot select more than ${maxSelection} products`);
        return;
      }

      setSelectedProducts((prev) => [...prev, prod]);
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== prod.id));
    }
  };

  return (
    <>
      <h1 className="text-[28px] font-semibold text-[#000000]">
        Validate & Select Products
      </h1>
      <p className="text-13 text-[#5F6368]">
        Select which products to analyse, only selected ones will be included in
        your intelligence run.
      </p>
      <div className="grid grid-cols-[1fr_326px] gap-6">
        <div>
          <div>
            <div className="border border-[#E6E6E6] rounded-xl flex gap-2 items-center justify-between p-4 mt-4 bg-[#FFFFFF]">
              <div className="flex gap-4 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    type="checkbox"
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0284C7] bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    ref={checkbox}
                    checked={checked}
                    onChange={toggleAll}
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
                <span className="text-13 text-[#001413]">SelectAll</span>
                <div className="border bg-[#0284C7] text-[#FFFFFF] text-xs font-light py-0.5 px-2 rounded flex">
                  <div className="w-4">{selectedProducts?.length}</div>
                  selected
                </div>
                <div>
                  <h2 className="font-medium text-[#000000]">
                    Products ready for analysis
                  </h2>
                  <p className="text-13 font-regular text-[#5F6368]">
                    Review flagged items before confirming
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-[#9EDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF] cursor-pointer ${view === "list" ? "bg-[#9EDBFF]" : "bg-[#E0F5FF]"}`}
                >
                  <ListBulletIcon
                    aria-hidden="true"
                    className="-ml-0.5 size-5"
                  />
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-[#9EDBFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF] cursor-pointer ${view === "grid" ? "bg-[#9EDBFF]" : "bg-[#E0F5FF]"}`}
                >
                  <Squares2X2Icon
                    aria-hidden="true"
                    className="-ml-0.5 size-5"
                  />
                  Grid
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="sm:flex sm:items-center flex gap-1">
              <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3 rounded-2xl text-sm">
                <div className="h-1.5 w-[5.5px] bg-[#2E7D32] rounded-full"></div>
                High Confidence
              </div>
              <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3  rounded-2xl text-sm">
                <div className="h-1.5 w-[5.5px] bg-[#D48C15] rounded-full"></div>
                Needs Review
              </div>
              <div className="bg-[#FFFFFF] border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3  rounded-2xl text-sm">
                <div className="h-1.5 w-[5.5px] bg-[#C62828] rounded-full"></div>
                Low Data
              </div>
            </div>
            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="group/table relative">
                    <div className="relative min-w-full table-fixed divide-y divide-gray-300">
                      <div className="divide-y divide-gray-200 bg-white rounded-xl border border-[#E6E6E6] mb-4">
                        {view === "list" && (
                          <List
                            products={products}
                            fetching_allProducts={fetching_allProducts}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            handleProductSelect={handleProductSelect}
                            onEdit={setEditingProduct}
                          />
                        )}
                        {view === "grid" && (
                          <Grid
                            products={products}
                            fetching_allProducts={fetching_allProducts}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            handleProductSelect={handleProductSelect}
                            onEdit={setEditingProduct}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between bg-[#FFFFFF] my-4 rounded-lg border border-[#E6E6E6] card-hover">
          <div>
            <p className="text-[#5F6368] text-xs font-light">RUN COST</p>
            <div className="grid grid-cols-2 mt-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[28px] font-semibold text-[#000000]">
                  {selectedProducts?.length || 0}
                </span>
                <span className="text-[#5F6368] text-13">queries</span>
              </div>
              <div className="text-right text-base font-medium text-[#000000] content-center">
                {usage_summary_data || 0}
              </div>
              <div className="text-[#5F6368] font-light text-xs">
                1 per product selected
              </div>
              <div className="text-right text-[#5F6368] font-light text-xs">
                remaining after
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-xs font-regular text-[#001413]">
                {selectedProducts?.length || 0}
              </div>
              <div className="w-[85%] h-1 bg-[#A9B3B1] rounded">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="text-xs font-regular text-[#001413]">
                {usage_summary_data || 0}
              </div>
            </div>
            <p className="flex justify-between">
              <span className="text-[#5F6368] text-xs font-light">
                This run
              </span>
              <span className="text-[#5F6368] text-xs font-light">
                Remaining
              </span>
            </p>

            <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />
            <p className="text-[#5F6368] font-light text-xs">
              WHAT HAPPENS NEXT
            </p>

            <div className="mt-3">
              <div className="flex gap-3">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <UserCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Complete your profile
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    Business type, target regions, certifications
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Engine runs 6 modules
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    Demand · Keywords · Trade · Buyers · Price · Competition
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm">
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[#000000] text-sm font-medium">
                    Full opportunity report
                  </p>
                  <p className="text-[#000000] text-xs font-light">
                    uyers, markets, keywords, email sequence
                  </p>
                </div>
              </div>
            </div>

            <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />
          </div>

          <div className="flex gap-1.5 border p-3 border-[#ABECAE] bg-[#F3FFF3] rounded-lg">
            <div className="h-7.5 p-1.5 flex justify-center items-center text-[#2E7D32] rounded-sm">
              <LightBulbIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[#2E7D32] text-sm font-medium">
                Improve accuracy before running.
              </p>
              <p className="text-[#5F6368] text-xs font-light">
                Products with low confidence scores may return fewer buyers. Use
                Review & Update to fill in missing fields.
              </p>
            </div>
          </div>
        </div>
      </div>
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={handleEditSaved}
        />
      )}
    </>
  );
};
export default Step2;
