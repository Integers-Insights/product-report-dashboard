import MultiSelectDropdown from "./MultiSelectDropdown";

const FormStep1 = (
    { selectedOption,
        handleRadioChange,
        reportDirectory,
        selectedReportId,
        setSelectedReportId,
        versionNum,
        reportTitle,
        setReportTitle,
        subTitle,
        setSubTitle,
        industry,
        setIndustry,
        subIndustry,
        setSubIndustry,
        regions,
        setRegions,
        country,
        setCountry,
        reportType,
        setReportType,
        useCases,
        setUseCases,
        publishDate,
        setPublishDate,
        coveragePeriodFrom,
        setCoveragePeriodFrom,
        coveragePeriodTo,
        setCoveragePeriodTo,
        error,
        getIndustry,
        getSubindustry,
        getRegions,
        getCountries,
        getReportTypes,
        getuseCases,
        periodError }
) => {

    return (
        <>
            <div className="w-full my-2 m-auto flex flex-col gap-5">
                <div className="">
                    <h1 className="text-24 font-medium text-primary">Basic Report Information</h1>
                    <p className="text-16 font-regular text-primary">Identify the report correctly (SEO + discovery)</p>
                </div>
                <div className=" flex justify-between items-center gap-3.5">
                    <div className="flex gap-6 items-center">
                        <span className="flex items-center gap-1">
                            <input type="radio" id="insert" name="dataOption" />
                            <label className="text-15 font-medium text-primary" htmlFor="insert">
                                Insert New
                            </label>
                        </span>
                        <span className="flex items-center gap-1">
                            <input
                                type="radio"
                                id="select"
                                name="dataOption"
                                value="generated"
                                checked={selectedOption === "generated"}
                                onChange={handleRadioChange}
                            />
                            <label
                                className="text-15 font-medium text-primary"
                                htmlFor="select"
                            >
                                Select from generated data
                            </label>
                        </span>
                        <span className="flex items-center gap-1">
                            <input type="radio" id="Update" name="dataOption" />
                            <label className="text-15 font-medium text-primary" htmlFor="Update">
                                Update Version
                            </label>
                        </span>
                    </div>
                    <div className="flex justify-center gap-5">
                        <div className="w-52.5">
                            <label className="text-15 font-medium text-primary" htmlFor="options">
                                Report Directory
                            </label>
                            <select
                                className="w-full mt-1 border border-gray-200 p-1"
                                id="options"
                                value={selectedReportId}
                                onChange={(e) => setSelectedReportId(e.target.value)}
                            >
                                <option value="">Select Report</option>
                                {reportDirectory?.map((item) => (
                                    <option key={item.id} value={item.id} className="wrap-break-word">
                                        {item.title.length > 47
                                            ? item.title.slice(0, 47) + "..."
                                            : item.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-39">
                            <label className="text-15 font-medium text-primary" htmlFor="options">
                                Version
                            </label>
                            <input type="text" value={versionNum || ""} readOnly className="outline-0 px-1 w-full font-medium" />
                        </div>
                    </div>
                </div>
                <div className=" flex justify-between">
                    <div className="w-[80.5%]">
                        <label className="text-16 font-medium text-primary" htmlFor="reportTitle">Report Title <sup>*</sup>
                        </label><br />
                        <input type="text" id="reportTitle" className="w-full border border-gray-200 h-10 px-0.5 text-20" placeholder="Enter Report Title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
                        {error && !reportTitle && <p className="text-red-500 ml-1">Please Enter ReportTitle...</p>}
                    </div>
                    <div className="w-[17.3%]">
                        <label className="text-16 font-medium text-primary" htmlFor="reportId">Report ID <sup>*</sup>
                        </label><br />
                        <input type="text" id="reportId" className="w-full border border-gray-200 h-10 px-0.5 text-20" placeholder="Enter Report ID" />
                    </div>
                </div>
                <div>
                    <label className="text-16 font-medium text-primary" htmlFor="marketDescription">Subtitle / Market description <sup>*</sup> </label>
                    <input type="text" id="marketDescription" className="w-full border border-gray-200 h-10 px-0.5 text-20" placeholder="Enter subtitle / market description" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
                    {error && !subTitle && <p className="text-red-500 ml-1">Please Enter subTitle...</p>}
                </div>
                <div>
                    <label className="text-15 font-medium text-primary">
                        Industry <sup>*</sup>
                    </label>
                    <select
                        className="w-full mt-1 border border-gray-200 h-10"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                    >
                        <option value="">-- Select Industry --</option>
                        {getIndustry?.map((item, i) => (
                            <option key={i} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {error && !industry && (
                        <p className="text-red-500 ml-1">Please select industry...</p>
                    )}
                </div>
                <div>
                    <label className="text-15 font-medium text-primary">
                        Sub-Industry <sup>*</sup>
                    </label>
                    <select
                        className="w-full mt-1 border border-gray-200 h-10"
                        value={subIndustry}
                        onChange={(e) => setSubIndustry(e.target.value)}
                    >
                        <option value="">-- Select Sub-Industry --</option>
                        {getSubindustry?.map((item, i) => (
                            <option key={i} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {error && !subIndustry && (
                        <p className="text-red-500 ml-1">
                            Please select subIndustry...
                        </p>
                    )}
                </div>
                <div>
                    <MultiSelectDropdown
                        label="Regions* (Multi select)"
                        options={getRegions?.map((item) => item.name)}
                        value={regions}
                        onChange={(val) => setRegions(val)}
                    />
                    {error && !regions.length && <p className="text-red-500 ml-1">Please select Regions...</p>}
                </div>
                <div>
                    <MultiSelectDropdown
                        label="Country* (Multi select)"
                        options={getCountries?.map((item) => item.name)}
                        value={country}
                        onChange={(val) => setCountry(val)}
                    />
                    {error && !country.length && <p className="text-red-500 ml-1">Please select country...</p>}
                </div>
                <div>
                    <label className="text-15 font-medium text-primary" htmlFor="reportType">
                        Report Type <sup>*</sup>
                    </label>
                    <select
                        className="w-full mt-1 border border-gray-200 h-10"
                        id="reportType"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="">-- Select Report Type --</option>
                        {getReportTypes?.map((item, i) => (
                            <option key={i} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {error && !reportType && (
                        <p className="text-red-500 ml-1">
                            Please select Report Type...
                        </p>
                    )}
                </div>
                <div>
                    <label className="text-15 font-medium text-primary">
                        Use Cases <sup>*</sup>
                    </label>
                    <select
                        className="w-full mt-1 border border-gray-200 h-10"
                        value={useCases}
                        onChange={(e) => setUseCases(e.target.value)}
                    >
                        <option value="">-- Select Use Cases --</option>
                        {getuseCases?.map((item, i) => (
                            <option key={i} value={item.name}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    {error && !useCases && (
                        <p className="text-red-500 ml-1">Please select Use Cases...</p>
                    )}
                </div>
                <div>
                    <label className="text-16 font-medium text-primary" htmlFor="publishDate">Publish Date<sup>*</sup>
                    </label>
                    <input type="date" id="publishDate" className="w-full border border-gray-200 h-10 px-0.5" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
                    {error && !publishDate && <p className="text-red-500 ml-1">Please select publishDate...</p>}
                </div>
                <div>
                    <label
                        className="text-16 font-medium text-primary"
                        htmlFor="coveragePeriodFrom"
                    >
                        Coverage Period (From) <sup>*</sup>
                    </label>
                    <input
                        type="number"
                        id="coveragePeriodFrom"
                        className="w-full border border-gray-200 h-10 px-0.5"
                        placeholder="Enter year"
                        min="1900"
                        max="2100"
                        value={coveragePeriodFrom}
                        onChange={(e) => setCoveragePeriodFrom(e.target.value)}
                    />
                    {error && !coveragePeriodFrom && (
                        <p className="text-red-500 ml-1">
                            Please select coverage period year...
                        </p>
                    )}
                </div>
                <div>
                    <label
                        className="text-16 font-medium text-primary"
                        htmlFor="coveragePeriodTo"
                    >
                        Coverage Period (To) <sup>*</sup>
                    </label>
                    <input
                        type="number"
                        id="coveragePeriodTo"
                        className="w-full border border-gray-200 h-10 px-0.5"
                        placeholder="Enter year"
                        min="1900"
                        max="2100"
                        value={coveragePeriodTo}
                        onChange={(e) => setCoveragePeriodTo(e.target.value)}
                    />
                    {error && !coveragePeriodTo && (
                        <p className="text-red-500 ml-1">
                            Please select coverage period year...
                        </p>
                    )}
                    {periodError && (
                        <p className="text-red-500 ml-1">
                            {periodError}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
export default FormStep1;
