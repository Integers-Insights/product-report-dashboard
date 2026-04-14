import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRightStartOnRectangleIcon, BuildingStorefrontIcon, ViewfinderCircleIcon, ChatBubbleLeftRightIcon, CurrencyDollarIcon, CheckIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PlusIcon, UserCircleIcon, DocumentMagnifyingGlassIcon, ClipboardDocumentListIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { people1 } from "./dummyTableData";
import { LuChevronDown } from "react-icons/lu";
const icons = [
    ArrowRightStartOnRectangleIcon,
    BuildingStorefrontIcon,
    ViewfinderCircleIcon,
    ChatBubbleLeftRightIcon,
    CurrencyDollarIcon,
    CheckIcon
];

const acc1 = [
    "ISO 9001", "ISO 14001", "ISO 45001", "GMP", "cGMP (FDA)", "EU GMP", "WHO GMP", "Six Sigma", "CE Marking", "Other"
];

const acc2 = [
    "FSSAI", "USDA Organic", "EU Organic", "India Organic", "FSSC 22000", "BRC/BRCGS", "HACCP", "Global G.A.P.", "Rainforest Alliance", "Fair Trade", "Other"
];

const acc3 = [
    "FDA Registered", "US FDA (510K)", "Drug Master File", "ISO 13485 (Medical)", "REACH Compliant", "NSF Certified", "Informed Sport", "USP Verified"
];

const acc4 = [
    "Halal", "Kosher", "Vegan Certified", "Vegetarian Cert.", "Cruelty-Free", "B Corp", "Carbon Neutral", "Other"
];

const acc5 = [
    "ISO 27001", "SOC 2 Type II", "GDPR Compliant", "PCI-DSS", "CMMI Level 3+", "AWS/Azure Certified", "Other"
];

const notificationMethods = [
    { id: 'b2b', title: 'B2B' },
    { id: 'b2c', title: 'B2C' },
    { id: 'both', title: 'Both' },
]

const Step3 = () => {

    // for grid card
    const [selectedPeople, setSelectedPeople] = useState([]);

    const [open, setOpen] = useState(null);

    const toggleAccordion = (index) => {
        setOpen(open === index ? null : index);
    };

    // useLayoutEffect(() => {
    //     const isIndeterminate = selectedPeople.length > 0 && selectedPeople.length < people1.length
    //     setChecked(selectedPeople.length === people1.length)
    //     setIndeterminate(isIndeterminate)
    //     checkbox.current.indeterminate = isIndeterminate
    // }, [selectedPeople])

    // function toggleAll() {
    //     setSelectedPeople(checked || indeterminate ? [] : people1)
    //     setChecked(!checked && !indeterminate)
    //     setIndeterminate(false)
    // }

    const countries = [
        { name: "MT" },
        { name: "option1" },
        { name: "option2" },
        { name: "option3" },
        { name: "option4" }
    ];

    return (
        <div>
            <h1 className='text-[28px] font-semibold text-[#000000]'>About Your Research Goals</h1>
            <p className='text-13 text-[#5F6368] mb-4'>Select which products to analyse, only selected ones will be included in your intelligence run.</p>

            <div className="grid grid-cols-[1fr_326px] gap-6">
                <div>
                    <div className="p-4 bg-[#FFFFFF] border border-[#E6E6E6] rounded-lg">
                        <div className="flex gap-3 items-center">
                            <div className="bg-[#0284C7] text-[#E0F5FF] h-7 w-7 rounded-full text-center content-center text-13">
                                01
                            </div>
                            <p className="text-[#1E1E1E] text-sm font-medium">Your goals?</p>
                            <p className="text-[#5F6368] text-xs font-light">Select all that apply</p>
                        </div>
                        <div className="mt-4">
                            <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                                {people1.map((person, index) => {

                                    const Icon = icons[index];

                                    return (
                                        <div key={person.id} className="border border-[#E6E6E6] p-3 rounded-lg group card-hover">

                                            <div className="p-3">
                                                <div className="flex justify-between">
                                                    <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm"><Icon className="w-5 h-5 text-[#0284C7]" /></div>
                                                    <div className="h-4 w-4">
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
                                                </div>
                                                <h1 className="mt-1.5 text-[#000000] text-sm font-medium">{person.title}</h1>
                                                <p className="text-[#5F6368] text-xs font-light">{person.txt}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />

                        <div className="flex gap-3 items-center">
                            <div className="bg-[#0284C7] text-[#E0F5FF] h-7 w-7 rounded-full text-center content-center text-13">
                                02
                            </div>
                            <p className="text-[#1E1E1E] text-sm font-medium">Quick Details</p>
                        </div>

                        <div className="flex justify-between mt-3">
                            <div>
                                <fieldset>
                                    <legend className="text-base font-semibold text-[#001413]">Buyer Type</legend>
                                    <div className="mt-1 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                        {notificationMethods.map((notificationMethod) => (
                                            <div key={notificationMethod.id} className="flex items-center">
                                                <input
                                                    defaultChecked={notificationMethod.id === 'email'}
                                                    id={notificationMethod.id}
                                                    name="notification-method"
                                                    type="radio"
                                                    className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-[#0284C7] checked:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7] disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
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
                                    <legend className="text-base font-semibold text-[#001413]">Annual turnover</legend>
                                    <div className="flex gap-6 mt-1">
                                        <div className="flex gap-1">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        defaultChecked
                                                        id="Budget"
                                                        name="Budget"
                                                        type="checkbox"
                                                        aria-describedby="Budget-description"
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
                                                <label htmlFor="Budget" className="font-medium text-gray-900">
                                                    Budget
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        id="midRange"
                                                        name="midRange"
                                                        type="checkbox"
                                                        aria-describedby="midRange-description"
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
                                                <label htmlFor="midRange" className="font-medium text-gray-900">
                                                    Mid Range
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="flex h-6 shrink-0 items-center">
                                                <div className="group grid size-4 grid-cols-1">
                                                    <input
                                                        id="Premium"
                                                        name="Premium"
                                                        type="checkbox"
                                                        aria-describedby="Premium-description"
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
                                                <label htmlFor="Premium" className="font-medium text-gray-900">
                                                    Premium
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        {/* <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" /> */}

                        <div className="mt-3 flex justify-between">
                            <div>
                                <div>
                                    <label htmlFor="phone-number" className="block text-lg font-semibold text-[#001413] dark:text-white">
                                        Monthly supply capacity
                                    </label>
                                    <div>
                                        <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-[var(--color-brand-primary1)]">
                                            <input
                                                id="phone-number"
                                                name="phone"
                                                type="text"
                                                // value={formData.phone}
                                                // onChange={handleChange}
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
                                                    {countries.map((country, index) => (
                                                        <option key={index} value={country.name}>
                                                            {country.name}
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
                            </div>
                            <div className="w-75">
                                <label htmlFor="turnover" className="block text-lg font-semibold text-[#001413]">
                                    Annual turnover
                                </label>
                                <div className="grid grid-cols-1">
                                    <select
                                        id="turnover"
                                        name="turnover"
                                        defaultValue="$200K - $1M"
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284C7] sm:text-sm/6"
                                    >
                                        <option>$200K - $1M</option>
                                        <option>$300K - $1.5M</option>
                                        <option>$400K - $1.6M</option>
                                    </select>
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />

                        <div className="flex gap-3 items-center">
                            <div className="bg-[#0284C7] text-[#E0F5FF] h-7 w-7 rounded-full text-center content-center text-13">
                                03
                            </div>
                            <p className="text-[#1E1E1E] text-sm font-medium">Certifications you hold</p>
                            <p className="text-[#5F6368] text-xs font-light">Select all that apply</p>
                        </div>

                        <div className="w-full mx-auto space-y-3 mt-4">

                            {/* Accordion 1 */}
                            <div className="rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion(1)}
                                    className="flex items-center justify-between w-full px-4 py-2 font-medium bg-[#E0F5FF] hover:bg-[#CFEFFF] transition-all duration-100 cursor-pointer rounded-lg"
                                >
                                    Quality & Manufacturing
                                    <PlusIcon
                                        className={`w-5 transition-transform duration-300 ${open === 1 ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${open === 1 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden px-4 pb-0.5 pt-4">
                                        <div className="grid grid-cols-4 gap-3">
                                            {
                                                acc1.map((ac1, i) => {
                                                    return (
                                                        <fieldset key={i}>
                                                            <div className="space-y-5">
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
                                                                            {ac1}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    )
                                                })
                                            }
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
                                        className={`w-5 transition-transform duration-300 ${open === 2 ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${open === 2 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden px-4 pb-0.5 pt-4">
                                        <div className="grid grid-cols-4 gap-3">

                                            {
                                                acc2.map((ac2, i) => {
                                                    return (
                                                        <fieldset key={i}>
                                                            <legend className="sr-only">Notifications</legend>
                                                            <div className="space-y-5">
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
                                                                            {ac2}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    )
                                                })
                                            }

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
                                        className={`w-5 transition-transform duration-300 ${open === 3 ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${open === 3 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden px-4 pb-0.5 pt-4">
                                        <div className="grid grid-cols-4 gap-3">

                                            {
                                                acc3.map((ac3, i) => {
                                                    return (
                                                        <fieldset key={i}>
                                                            <legend className="sr-only">Notifications</legend>
                                                            <div className="space-y-5">
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
                                                                            {ac3}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    )
                                                })
                                            }
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
                                        className={`w-5 transition-transform duration-300 ${open === 4 ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${open === 4 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden px-4 pb-0.5 pt-4">
                                        <div className="grid grid-cols-4 gap-3">

                                            {
                                                acc4.map((ac4, i) => {
                                                    return (
                                                        <fieldset key={i}>
                                                            <legend className="sr-only">Notifications</legend>
                                                            <div className="space-y-5">
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
                                                                            {ac4}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    )
                                                })
                                            }
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
                                        className={`w-5 transition-transform duration-300 ${open === 5 ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${open === 5 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden  px-4 pb-0.5 pt-4">
                                        <div className="grid grid-cols-4 gap-3">

                                            {
                                                acc5.map((ac5, i) => {
                                                    return (
                                                        <fieldset key={i}>
                                                            <legend className="sr-only">Notifications</legend>
                                                            <div className="space-y-5">
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
                                                                            {ac5}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="notlisted" className="block text-[18px] font-semibold text-[#001413]">
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
                                        <button className="border border-[#5F6368] rounded-lg px-3 py-1.5 flex gap-2 items-center text-[#6A7675] font-semibold hover:bg-[#F5F5F5] cursor-pointer">Add <PlusIcon className="h-5 w-5" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-[#E6E6E6] rounded-lg flex flex-col justify-between p-4 bg-[#FFFFFF] card-hover">
                    <div>
                        <p className="text-[#5F6368] font-light text-xs">HOW THIS SHAPES YOUR RESULT</p>

                        <div className="mt-3">
                            <div className="flex gap-3">
                                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm"><UserCircleIcon className='h-5 w-5' /></div>
                                <div>
                                    <p className='text-[#000000] text-sm font-medium'>Buyer matching</p>
                                    <p className='text-[#000000] text-xs font-light'>Goals + certs filter the buyer list to only relevant companies</p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm"><DocumentMagnifyingGlassIcon className='h-5 w-5' /></div>
                                <div>
                                    <p className='text-[#000000] text-sm font-medium'>Market scoring</p>
                                    <p className='text-[#000000] text-xs font-light'>Capacity + price position adjusts which markets are realistic for you</p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <div className="bg-[#E0F5FF] h-7.5 p-1.5 flex justify-center items-center text-[#0284C7] rounded-sm"><ClipboardDocumentListIcon className='h-5 w-5' /></div>
                                <div>
                                    <p className='text-[#000000] text-sm font-medium'>Email sequence tone</p>
                                    <p className='text-[#000000] text-xs font-light'>Buyer type (B2B) sets the right outreach language and CTAs</p>
                                </div>
                            </div>
                        </div>
                        <hr className="h-[1px] bg-[#E6E6E6] mt-4 border-0" />
                    </div>



                    <div>
                        <div className="flex gap-1.5 border p-3 border-[#ABECAE] bg-[#F3FFF3] rounded-lg">
                            <div className="h-7.5 p-1.5 flex justify-center items-center text-[#2E7D32] rounded-sm"><LightBulbIcon className='h-5 w-5' /></div>
                            <div>
                                <p className='text-[#2E7D32] text-sm font-medium'>Improve accuracy before running.</p>
                                <p className='text-[#5F6368] text-xs font-light'>Products with low confidence scores may return fewer buyers. Use Review & Update to fill in missing fields.</p>
                            </div>
                        </div>

                        <hr className="h-[1px] bg-[#E6E6E6] my-4 border-0" />

                        <div>
                            <p className="text-[#5F6368] text-xs font-light">RUN COST</p>
                            <div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#000000] text-xs font-light">3 products selected</p>
                                    <h1 className="text-[#000000] text-xl font-semibold">3Q</h1>
                                </div>

                                <div className="w-full h-1 bg-[#A9B3B1] rounded my-2">
                                    <div className="h-1 bg-[#0284C7] rounded" style={{ width: "20%" }}></div>
                                </div>
                                <p className="text-[#5F6368] text-xs font-light">70 queries remaining after this run</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Step3;