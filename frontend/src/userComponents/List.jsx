import { Link } from 'react-router-dom';
const List = ({ people, selectedPeople, setSelectedPeople }) => {
    return (
        <>
            <div className="p-4">
                {people.map((person) => {
                    return (
                        <div key={person.id} className="group has-checked:bg-gray-50 border-b border-[#E6E6E6] flex justify-between items-center py-1 card-hover">
                            <div className="flex">
                                <div className="relative px-7 sm:w-12 sm:px-6">
                                    <div className={`absolute inset-y-0 left-0 w-1 ${Number(person.btn1) >= 71 ? "bg-[#009A3F]" : person.btn1 >= 31 ? "bg-[#D48C15]" : "bg-[#C62828]"}`} />
                                    <div className="absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                                        <input
                                            type="checkbox"
                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-[#0284C7] bg-white checked:border-[#0284C7] checked:bg-[#0284C7] indeterminate:border-[#0284C7] indeterminate:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                            value={person.title}
                                            checked={selectedPeople.includes(person)}
                                            onChange={(e) =>
                                                setSelectedPeople(
                                                    e.target.checked
                                                        ? [...selectedPeople, person]
                                                        : selectedPeople.filter((p) => p !== person),
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
                                <div>
                                    <div className="flex gap-3 items-center">
                                        <div className="text-sm font-medium whitespace-nowrap text-[#000000]">
                                            {person.title}
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className={`rounded-xl px-2 py-1 text-xs font-light shadow-xs  focus-visible:outline-2 focus-visible:outline-offset-2 ${Number(person.btn1) >= 71 ? "bg-[#CCFFCF] text-[#2E7D32]" : person.btn1 >= 31 ? "bg-[#FFE9C5] text-[#D48C15]" : "bg-[#FFC4C4] text-[#C62828]"}`}
                                            >
                                                {person.btn1}% Confidence
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 mt-1">
                                        <div className="text-xs whitespace-nowrap text-[#000000] font-light">{person.txt1}</div>
                                        <div className="text-xs whitespace-nowrap text-[#000000] font-light">{person.txt2}</div>
                                        <div className="text-xs whitespace-nowrap text-[#000000] font-light">{person.txt3}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {Number(person.btn1) >= 71 ? "" :
                                    <button
                                        type="button"
                                        className={`rounded-lg px-2 py-1 border text-xs font-light shadow-xs hover:bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] cursor-pointer ${Number(person.btn1) >= 31 ? "text-[#D48C15]" : "text-[#C62828]"}`}
                                    >
                                        {Number(person.btn1) >= 31 ? "Review & Update" : "Enter Manually"}
                                    </button>
                                }
                            </div>

                            <div className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                                <Link to={"#"} className="text-[#0284C7] hover:text-[#0274AE]">
                                    View fetched data<span className="sr-only">, {person.name}</span>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};
export default List;