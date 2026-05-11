// import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
// import { useLayoutEffect, useRef, useState } from 'react'
// import { people } from "./dummyTableData";

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
// }

// const Step2 = () => {

//     const checkbox = useRef()
//     const [checked, setChecked] = useState(false)
//     const [indeterminate, setIndeterminate] = useState(false)
//     const [selectedPeople, setSelectedPeople] = useState([])

//     useLayoutEffect(() => {
//         const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people.length
//         setChecked(selectedPeople.length === people.length)
//         setIndeterminate(isIndeterminate)
//         checkbox.current.indeterminate = isIndeterminate
//     }, [selectedPeople])

//     function toggleAll() {
//         setSelectedPeople(checked || indeterminate ? [] : people)
//         setChecked(!checked && !indeterminate)
//         setIndeterminate(false)
//     }

//     return (
//         <>
//             <h1 className='text-[28px] font-semibold text-[#000000]'>Validate & Select Products</h1>
//             <p className='text-13 text-[#5F6368]'>Select which products to analyse, only selected ones will be included in your intelligence run.</p>
//             <div className="border grid grid-cols-[1fr_326px] gap-6">
//                 <div className="border">

//                     {/*  */}
//                     <div className="border">
//                         <div className="border border-[#E6E6E6] rounded-xl flex gap-2 items-center justify-between p-4 mt-4">
//                             <div className="border flex gap-4 items-center">

//                                 <div className="border border-red-500 group grid size-4 grid-cols-1">

//                                     <input
//                                         type="checkbox"
//                                         className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
//                                         ref={checkbox}
//                                         checked={checked}
//                                         onChange={toggleAll}
//                                     />

//                                     <svg
//                                         className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
//                                         viewBox="0 0 14 14"
//                                         fill="none"
//                                     >
//                                         <path
//                                             className="opacity-0 group-has-checked:opacity-100"
//                                             d="M3 8L6 11L11 3.5"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         />
//                                         <path
//                                             className="opacity-0 group-has-indeterminate:opacity-100"
//                                             d="M3 7H11"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <span className='text-13 text-[#001413]'>SelectAll</span>
//                                 <div className="border bg-[#0284C7] text-[#FFFFFF] text-xs font-light py-0.5 px-2 rounded">
//                                     {selectedPeople?.length} selected
//                                 </div>

//                                 <div className="border">
//                                     <h2 className="font-medium text-[#000000]">Products ready for analysis</h2>
//                                     <p className="text-13 font-regular text-[#5F6368]">Review flagged items before confirming</p>
//                                 </div>
//                             </div>

//                             <div className="border flex gap-2">
//                                 <button
//                                     type="button"
//                                     className="inline-flex items-center gap-x-1.5 rounded-md bg-[#E0F5FF] px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF]"
//                                 >
//                                     <ListBulletIcon aria-hidden="true" className="-ml-0.5 size-5" />
//                                     List
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="inline-flex items-center gap-x-1.5 rounded-md bg-[#E0F5FF] px-3 py-2 text-sm font-semibold text-[#0284C7] shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0F5FF]"
//                                 >
//                                     <Squares2X2Icon aria-hidden="true" className="-ml-0.5 size-5" />
//                                     Grid
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="px-4 sm:px-6 lg:px-8 mt-4">
//                         <div className="sm:flex sm:items-center border flex gap-1">
//                             <div className="border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3 rounded-2xl"> <div className="h-1.5 w-1.5 bg-[#2E7D32] rounded-full"></div> High Confidence</div>
//                             <div className="border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3 rounded-2xl"> <div className="h-1.5 w-1.5 bg-[#D48C15] rounded-full"></div> Needs Review</div>
//                             <div className="border border-[#E6E6E6] flex gap-1 items-center py-0.5 px-3 rounded-2xl"> <div className="h-1.5 w-1.5 bg-[#C62828] rounded-full"></div> Low Data</div>
//                         </div>
//                         <div className="mt-8 flow-root">
//                             <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//                                 <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
//                                     <div className="group/table relative">
//                                         {/* <div className="absolute top-0 left-14 z-10 hidden h-12 items-center space-x-3 bg-white group-has-checked/table:flex sm:left-12">

//                                             selected {selectedPeople?.length}
//                                         </div> */}
//                                         <table className="border relative min-w-full table-fixed divide-y divide-gray-300">

//                                             <tbody className="divide-y divide-gray-200 bg-white">
//                                                 {people.map((person) => (
//                                                     <tr key={person.email} className="group has-checked:bg-gray-50">
//                                                         <td className="relative px-7 sm:w-12 sm:px-6">
//                                                             <div className="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block" />

//                                                             <div className="absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
//                                                                     value={person.email}
//                                                                     checked={selectedPeople.includes(person)}
//                                                                     onChange={(e) =>
//                                                                         setSelectedPeople(
//                                                                             e.target.checked
//                                                                                 ? [...selectedPeople, person]
//                                                                                 : selectedPeople.filter((p) => p !== person),
//                                                                         )
//                                                                     }
//                                                                 />
//                                                                 <svg
//                                                                     className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
//                                                                     viewBox="0 0 14 14"
//                                                                     fill="none"
//                                                                 >
//                                                                     <path
//                                                                         className="opacity-0 group-has-checked:opacity-100"
//                                                                         d="M3 8L6 11L11 3.5"
//                                                                         strokeWidth="2"
//                                                                         strokeLinecap="round"
//                                                                         strokeLinejoin="round"
//                                                                     />
//                                                                     <path
//                                                                         className="opacity-0 group-has-indeterminate:opacity-100"
//                                                                         d="M3 7H11"
//                                                                         strokeWidth="2"
//                                                                         strokeLinecap="round"
//                                                                         strokeLinejoin="round"
//                                                                     />
//                                                                 </svg>
//                                                             </div>
//                                                         </td>
//                                                         <td className="py-4 pr-3 text-sm font-medium whitespace-nowrap text-gray-900 group-has-checked:text-indigo-600">
//                                                             {person.name}
//                                                         </td>
//                                                         <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.title}</td>
//                                                         <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.email}</td>
//                                                         <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{person.role}</td>
//                                                         <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
//                                                             <a href="#" className="text-indigo-600 hover:text-indigo-900">
//                                                                 Edit<span className="sr-only">, {person.name}</span>
//                                                             </a>
//                                                         </td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="border">ddeedxe</div>
//             </div>
//         </>
//     );
// };
// export default Step2;


// working
// import {
//   ListBulletIcon,
//   Squares2X2Icon,
//   UserCircleIcon,
//   DocumentMagnifyingGlassIcon,
//   ClipboardDocumentListIcon,
//   LightBulbIcon,
// } from "@heroicons/react/24/outline";
// import { useLayoutEffect, useRef, useState } from "react";
// import { people } from "./dummyTableData";
// import List from "./List";
// import Grid from "./Grid";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// const Step2 = ({ loading2, products }) => {
//   const checkbox = useRef();
//   const [checked, setChecked] = useState(false);
//   const [indeterminate, setIndeterminate] = useState(false);
//   const [selectedPeople, setSelectedPeople] = useState([]);

//   console.log("selectedPeople: ", selectedPeople);

//   const [view, setView] = useState("list");

//   useLayoutEffect(() => {
//     const isIndeterminate =
//       selectedPeople.length > 0 && selectedPeople.length < people.length;
//     setChecked(selectedPeople.length === people.length);
//     setIndeterminate(isIndeterminate);
//     checkbox.current.indeterminate = isIndeterminate;
//   }, [selectedPeople]);

//   function toggleAll() {
//     setSelectedPeople(checked || indeterminate ? [] : people);
//     setChecked(!checked && !indeterminate);
//     setIndeterminate(false);
//   }


//   console.log("prod: ",products);

//   return (
//     <>
//       {/* for testing */}
//       <h1>{loading2 ? "Loading..." : "fetched"}</h1>
//       {/* for testing */}

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
//                   <div className="w-4">{selectedPeople?.length}</div>
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
//                             people={people}
//                             selectedPeople={selectedPeople}
//                             setSelectedPeople={setSelectedPeople}
//                           />
//                         )}
//                         {view === "grid" && (
//                           <Grid
//                           products={products}
//                             people={people}
//                             selectedPeople={selectedPeople}
//                             setSelectedPeople={setSelectedPeople}
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
//                   3
//                 </span>
//                 <span className="text-[#5F6368] text-13">queries</span>
//               </div>
//               <div className="text-right text-base font-medium text-[#000000] content-center">
//                 70
//               </div>
//               <div className="text-[#5F6368] font-light text-xs">
//                 1 per product selected
//               </div>
//               <div className="text-right text-[#5F6368] font-light text-xs">
//                 remaining after
//               </div>
//             </div>

//             <div className="flex justify-between items-center mt-4">
//               <div className="text-xs font-regular text-[#001413]">3</div>
//               <div className="w-[85%] h-1 bg-[#A9B3B1] rounded">
//                 <div
//                   className="h-1 bg-[#0284C7] rounded"
//                   style={{ width: "20%" }}
//                 ></div>
//               </div>
//               <div className="text-xs font-regular text-[#001413]">70</div>
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






// new one
import {
  ListBulletIcon,
  Squares2X2Icon,
  UserCircleIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { useLayoutEffect, useRef, useState } from "react";
import List from "./List";
import Grid from "./Grid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Step2 = ({ fetching_allProducts, products,selectedProducts,setSelectedProducts,usage_summary_data }) => {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  // const [selectedPeople, setSelectedPeople] = useState([]);

  // console.log("selectedPeople: ", selectedPeople);

  const [view, setView] = useState("list");

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedProducts.length > 0 && selectedProducts.length < products.length;
    setChecked(selectedProducts.length === products.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedProducts]);

  function toggleAll() {
    setSelectedProducts(checked || indeterminate ? [] : products);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }


  // console.log("prod: ",products);

  return (
    <>
      {/* for testing */}
      {/* <h1>{loading2 ? "Loading..." : "fetched"}</h1> */}
      {/* for testing */}

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
                            // people={people}
                            fetching_allProducts={fetching_allProducts}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                          />
                        )}
                        {view === "grid" && (
                          <Grid
                          products={products}
                            // people={people}
                            fetching_allProducts={fetching_allProducts}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
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
              <div className="text-xs font-regular text-[#001413]">3</div>
              <div className="w-[85%] h-1 bg-[#A9B3B1] rounded">
                <div
                  className="h-1 bg-[#0284C7] rounded"
                  style={{ width: "20%" }}
                ></div>
              </div>
              <div className="text-xs font-regular text-[#001413]">70</div>
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
    </>
  );
};
export default Step2;
