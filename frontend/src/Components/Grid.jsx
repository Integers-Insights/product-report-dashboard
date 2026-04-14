import { Link } from 'react-router-dom';
const Grid = ({ people, selectedPeople, setSelectedPeople }) => {
    return (
        <>
            <div className="grid grid-cols-3 gap-x-3 gap-y-4 p-4">
                {people.map((person) => {
                    return (
                        <div key={person.id} className={`border p-3 rounded-lg border-t-4 group card-hover ${Number(person.btn1) >= 71 ? "border-green-500" : person.btn1 >= 31 ? "border-yellow-500" : "border-red-500"}`}>
                            <div className="flex justify-between">
                                <div>
                                    <h2 className='text-[#000000] text-sm font-medium'>{person.title}</h2>
                                    <p className='text-[#5F6368] text-xs font-light flex gap-3'>
                                        <span>{person.txt1}</span>
                                        <span>{person.txt2}</span>
                                    </p>
                                    <p className='text-[#5F6368] text-xs font-light'>
                                        <span>{person.txt3}, </span>
                                        <span>{person.txt4}, </span>
                                        <span>{person.txt5}</span>
                                    </p>
                                </div>
                                <div className="h-4 w-4 relative">
                                    <div className="absolute top-1/2 -mt-2 grid size-4 grid-cols-1">
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
                            </div>
                            <div className="grid grid-cols-2 mt-1.5">
                                {Number(person.btn1) >= 71 ? <div></div> :
                                    <button className='border border-[#E6E6E6] rounded-tl-lg rounded-bl-lg border-r-0 text-[#0284C7] text-xs font-light py-1.5 px-2'>{Number(person.btn1) >= 31 ? "Review & Update" : "Enter Manually"}</button>
                                }
                                <button className='border border-[#E6E6E6] rounded-tr-lg rounded-br-lg text-[#0284C7] text-xs font-light py-1.5 px-1.5'>View Fetched Data</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};
export default Grid;