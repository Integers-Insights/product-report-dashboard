import { useState } from "react";

const FilterCategory = ({ resetFilters, selectedFilters, setSelectedFilters, handleCheckboxChange, industry, sub_industry, report_type, region, country, use_cases }) => {

    const [open, setOpen] = useState(null);

    const toggle = (id) => {
        setOpen(open === id ? null : id);
    };

    return (
        <>
            <div>
                <button className="px-8 py-2 text-primary text-15 font-medium bg-brand cursor-pointer hover:bg-[var(--color-brand-primary-hover)]" onClick={resetFilters}>Reset Filter</button>
            </div>
            {/* Selected Filters */}
            {Object.values(selectedFilters).some(arr => arr.length > 0) && (
                <div className=" mt-4">
                    <h1 className="text-primary text-18 font-medium mb-2">Selected Filters</h1>
                    <div className=" hidden xl:block">
                        <div className="flex flex-wrap gap-1">
                            {Object.entries(selectedFilters).map(([group, items]) =>
                                items.map((item) => (
                                    <div
                                        key={`${group}-${item}`}
                                        className="px-2 py-1 bg-gray-100 text-12 rounded flex items-center gap-2"
                                    >
                                        <span>{item}</span>

                                        <button
                                            className="text-red-500 font-bold  px-1 cursor-pointer"
                                            onClick={() =>
                                                setSelectedFilters(prev => ({
                                                    ...prev,
                                                    [group]: prev[group].filter(i => i !== item)
                                                }))
                                            }
                                        >
                                            x
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {industry &&
                <div className=" flex flex-col gap-2">
                    <div
                        className=" flex justify-between items-center cursor-pointer xl:cursor-default"
                        onClick={() => toggle(1)}
                    >
                        <h1 className="text-primary text-15 font-medium">Industries</h1>
                        <span className={`text-xl font-bold xl:hidden transition-transform duration-300 ${open === 1 ? "rotate-45" : "rotate-0"}`}>+</span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${open === 1 ? "h-auto opacity-100 mt-2" : "max-h-0 opacity-0"} xl:max-h-full xl:opacity-100 xl:mt-2`}>
                        {industry?.map((ind, i) => {
                            return (
                                <label key={ind.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 accent-[var(--color-brand-primary)]"
                                        checked={selectedFilters.industries.includes(ind?.name)}
                                        onChange={() => handleCheckboxChange("industries", ind?.name)}
                                    />
                                    <span className="text-primary text-16 font-regular">{ind?.name}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>}

            {industry &&
                <div className=" flex flex-col gap-2">
                    <div
                        className=" flex justify-between items-center cursor-pointer xl:cursor-default"
                        onClick={() => toggle(2)}
                    >
                        <h1 className="text-primary text-15 font-medium">Sub Industries</h1>
                        <span className={`text-xl font-bold xl:hidden transition-transform duration-300 ${open === 2 ? "rotate-45" : "rotate-0"}`}>+</span>
                    </div>
                    <div className={` overflow-hidden transition-all duration-300 ${open === 2 ? "h-auto opacity-100 mt-2" : "max-h-0 opacity-0"} xl:max-h-full xl:opacity-100 xl:mt-2`}>
                        {sub_industry?.map((sub, i) => {
                            return (
                                <label key={sub.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 accent-[var(--color-brand-primary)]"
                                        checked={selectedFilters.sub_industries.includes(sub?.name)}
                                        onChange={() => handleCheckboxChange("sub_industries", sub?.name)}
                                    />
                                    <span className="text-primary text-16 font-regular">{sub?.name}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>}

            {report_type &&
                <div className=" flex flex-col gap-2">
                    <div
                        className=" flex justify-between items-center cursor-pointer xl:cursor-default"
                        onClick={() => toggle(3)}
                    >
                        <h1 className="text-primary text-15 font-medium">Report Types</h1>
                        <span className={`text-xl font-bold xl:hidden transition-transform duration-300 ${open === 3 ? "rotate-45" : "rotate-0"}`}>+</span>
                    </div>
                    <div className={` overflow-hidden transition-all duration-300 ${open === 3 ? "h-auto opacity-100 mt-2" : "max-h-0 opacity-0"} xl:max-h-full xl:opacity-100 xl:mt-2`}>
                        {report_type?.map((report, i) => {
                            return (
                                <label key={report.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 accent-[var(--color-brand-primary)]"
                                        checked={selectedFilters.report_types.includes(report?.name)}
                                        onChange={() => handleCheckboxChange("report_types", report?.name)}
                                    />
                                    <span className="text-primary text-16 font-regular">{report?.name}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            }

            <div className="flex flex-col gap-2">
                <div
                    className="flex justify-between items-center cursor-pointer xl:cursor-default"
                    onClick={() => toggle(4)}
                >
                    <h1 className="text-primary text-15 font-medium">Regions</h1>
                    <span className={`text-xl font-bold xl:hidden transition-transform duration-300 ${open === 4 ? "rotate-45" : "rotate-0"}`}>+</span>
                </div>
                <div className={` overflow-hidden transition-all duration-300 ${open === 4 ? "h-auto opacity-100 mt-2" : "max-h-0 opacity-0"} xl:max-h-full xl:opacity-100 xl:mt-2`}>
                    {region?.map((reg, i) => {
                        return (
                            <label key={reg.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-[var(--color-brand-primary)]"
                                    checked={selectedFilters.regions.includes(reg?.name)}
                                    onChange={() => handleCheckboxChange("regions", reg?.name)}
                                />
                                <span className="text-primary text-16 font-regular">{reg?.name}</span>
                            </label>
                        )
                    })}
                </div>
            </div>
            <div className=" flex flex-col gap-2">
                <div
                    className=" flex justify-between items-center cursor-pointer xl:cursor-default"
                    onClick={() => toggle(5)}
                >
                    <h1 className="text-primary text-15 font-medium">Countries</h1>
                    <span className={`text-xl font-bold xl:hidden transition-transform duration-300 ${open === 5 ? "rotate-45" : "rotate-0"}`}>+</span>
                </div>
                <div className={` overflow-hidden transition-all duration-300 ${open === 5 ? "h-auto opacity-100 mt-2" : "max-h-0 opacity-0"} xl:max-h-full xl:opacity-100 xl:mt-2`}>
                    {country?.map((coun, i) => {
                        return (
                            <label key={coun.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 accent-[var(--color-brand-primary)]"
                                    checked={selectedFilters.countries.includes(coun?.name)}
                                    onChange={() => handleCheckboxChange("countries", coun?.name)}
                                />
                                <span className="text-primary text-16 font-regular">{coun?.name}</span>
                            </label>
                        )
                    })}
                </div>
            </div>

            {use_cases &&
                <div className=" flex flex-col gap-2">
                    <div
                        className=" flex justify-between items-center cursor-pointer xl:cursor-default"
                        onClick={() => toggle(6)}
                    >
                        <h1 className="text-primary text-15 font-medium">Use Cases</h1>
                        <span className={`text-xl font-bold xl:hidden transition-transform duration-300 ${open === 6 ? "rotate-45" : "rotate-0"}`}>+</span>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${open === 6 ? "h-auto opacity-100 mt-2" : "max-h-0 opacity-0"} xl:max-h-full xl:opacity-100 xl:mt-2`}>
                        {use_cases?.map((uc, i) => {
                            return (
                                <label key={uc.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 accent-[var(--color-brand-primary)]"
                                        checked={selectedFilters.use_cases.includes(uc?.name)}
                                        onChange={() => handleCheckboxChange("use_cases", uc?.name)}
                                    />
                                    <span className="text-primary text-16 font-regular">{uc?.name}</span>
                                </label>
                            )
                        })}
                    </div>
                </div>
            }
        </>
    );
};
export default FilterCategory;
