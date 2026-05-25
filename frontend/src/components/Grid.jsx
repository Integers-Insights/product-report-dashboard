import { Link } from "react-router-dom";
import loader from "../assets/loader.gif";
import LoadingCard from "./LoadingCard";
const Grid = ({
  selectedProducts,
  setSelectedProducts,
  products,
  fetching_allProducts,
  handleProductSelect,
  onEdit,
}) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 p-4">
        {fetching_allProducts ? (
          // <div className="h-86.5 w-full flex justify-between items-center overflow-hidden col-span-3">
          //   <img
          //     src={loader}
          //     alt=""
          //     className="h-full w-[50%] m-auto scale-175"
          //   />
          // </div>
          <div className="w-full overflow-hidden col-span-3">
            <LoadingCard />
          </div>
        ) : (
          <>
            {products.length ? (
              [...products]
                .sort(
                  (a, b) =>
                    Number(b?.confidence_score) - Number(a?.confidence_score),
                )
                .map((prod, index) => {
                  return (
                    <div
                      key={index}
                      className={`border p-3 rounded-lg border-t-4 group card-hover ${Number(prod?.confidence_score) >= 71 ? "border-green-500" : Number(prod?.confidence_score) >= 31 ? "border-yellow-500" : "border-red-500"}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-[#000000] text-sm font-medium">
                            {prod?.product_name}
                          </h2>
                          <p className="text-[#5F6368] text-xs font-light">
                            {prod?.category}
                          </p>
                          <p className="text-[#5F6368] text-xs font-light">
                            <a
                              href={prod?.source_url ? prod?.source_url : "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500"
                            >
                              Website URL
                            </a>
                          </p>
                        </div>
                        <div className="h-4 w-4 relative">
                          <div className="absolute top-1/2 -mt-2 grid size-4 grid-cols-1">
                            <input
                              type="checkbox"
                              className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0284C7] bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                              checked={selectedProducts.includes(prod)}
                              onChange={(e) =>
                                handleProductSelect(e.target.checked, prod)
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
                      <div className="grid grid-cols-2 mt-1.5">
                        {Number(prod?.confidence_score) >= 71 ? (
                          <div></div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onEdit && onEdit(prod)}
                            className={`rounded-tl-lg rounded-bl-lg px-2 py-1 border text-xs font-light shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] cursor-pointer ${Number(prod?.confidence_score) >= 31 ? "text-[#D48C15]" : "text-[#C62828]"}`}
                          >
                            {Number(prod?.confidence_score) >= 31
                              ? "Review & Update"
                              : "Enter Manually"}
                          </button>
                        )}
                        <button className="border border-[#E6E6E6] rounded-tr-lg rounded-br-lg text-[#0284C7] text-xs font-light py-1.5 px-1.5" onClick={() => onEdit && onEdit(prod)}>
                          View Fetched Data
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <h1 className="col-end-3 text-center font-medium text-xl">
                Data not found
              </h1>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default Grid;
