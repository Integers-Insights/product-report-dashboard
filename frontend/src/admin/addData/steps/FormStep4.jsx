import FileUpload from "./FileUpload";

const FormStep4 = (
    { sectionName,
        setSectionName,
        sectionGroup,
        setSectionGroup,
        shortDescription,
        setShortDescription,
        previewAvailable,
        setPreviewAvailable,
        sDescription,
        setSDescription,
        fullReport,
        setFullReport,
        sectionPDF,
        setSectionPDF,
        error }
) => {

    return (
        <>
            <div className="w-full m-auto flex flex-col gap-5 my-2">
                <div>
                    <h1 className="text-24 font-medium text-primary">Define Report Sections</h1>
                    <p className="text-16 font-regular text-primary">Enable modular selling</p>
                </div>
                <div>
                    <label className="text-15 font-medium text-primary" htmlFor="reportType">
                        Section Name <sup>*</sup>
                    </label>
                    <select className="w-full mt-1 border border-gray-200 h-10 text-20" id="reportType" value={sectionName} onChange={(e) => setSectionName(e.target.value)}>
                        <option value="option1">option1</option>
                        <option value="option2">option2</option>
                        <option value="option3">option3</option>
                        <option value="option4">option4</option>
                        <option value="option5">option5</option>
                    </select>
                    {error && !sectionName && (
                        <p className="text-red-500 ml-1">Please select Section Name...</p>
                    )}
                </div>
                <div>
                    <label className="text-15 font-medium text-primary" htmlFor="reportType">
                        Section Group <sup>*</sup>
                    </label>
                    <select className="w-full mt-1 border border-gray-200 h-10 text-20" id="reportType" value={sectionGroup} onChange={(e) => setSectionGroup(e.target.value)}>
                        <option value="option1">option1</option>
                        <option value="option2">option2</option>
                        <option value="option3">option3</option>
                        <option value="option4">option4</option>
                        <option value="option5">option5</option>
                    </select>
                    {error && !sectionGroup && (
                        <p className="text-red-500 ml-1">Please select Section Group...</p>
                    )}
                </div>
                <div>
                    <label className="text-16 font-medium text-primary" htmlFor="reportTitle">Short Description <sup>*</sup>
                    </label>
                    <input type="text" id="reportTitle" className="w-full border border-gray-200 h-10 px-0.5 text-20" placeholder="Enter short description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                    {error && !shortDescription && (
                        <p className="text-red-500 ml-1">Please Enter Short Description...</p>
                    )}
                </div>
                <div className="p-2">
                    <label className="text-16 font-medium text-primary block mb-1">
                        Preview Available? <sup>*</sup>
                    </label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="previewAvailable"
                                value="true"
                                checked={previewAvailable === true}
                                onChange={() => setPreviewAvailable(true)}
                            />
                            <span>True</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="previewAvailable"
                                value="false"
                                checked={previewAvailable === false}
                                onChange={() => setPreviewAvailable(false)}
                            />
                            <span>False</span>
                        </label>
                        {error && previewAvailable === null && (
                            <p className="text-red-500 ml-1">Please select Preview Available...</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-between gap-5">
                    <div className="w-1/2">
                        <label className="text-16 font-medium text-primary" htmlFor="reportTitle">Section Price<sup>*</sup>
                        </label><br />
                        <input type="text" id="reportTitle" className="w-full border border-gray-200 h-10 px-0.5 text-20" placeholder="Enter short description" value={sDescription} onChange={(e) => setSDescription(e.target.value)} />
                        {error && !sDescription && (
                            <p className="text-red-500 ml-1">Please Enter Short Description...</p>
                        )}
                    </div>
                    <div className="p-2 w-1/2">
                        <label className="text-16 font-medium text-primary block mb-1">
                            Included in full report
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="fullReport"
                                    value="true"
                                    checked={fullReport === true}
                                    onChange={() => setFullReport(true)}
                                />
                                <span>True</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="fullReport"
                                    value="false"
                                    checked={fullReport === false}
                                    onChange={() => setFullReport(false)}
                                />
                                <span>False</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <FileUpload
                        label="Upload Section PDF"
                        file={sectionPDF}
                        onChange={setSectionPDF}
                    />
                    {error && sectionPDF && sectionPDF.type !== "application/pdf" && (
                        <p className="text-red-500 ml-1">Section PDF must be a PDF file</p>
                    )}
                </div>
                <div>
                    <button className="border border-gray-200 p-1 font-medium text-primary text-20">+ Add Section</button>
                </div>
            </div>
        </>
    )
}
export default FormStep4;
