import FileUpload from "./FileUpload";

const FormStep3 = ({ availableReports,
    setAvailableReports,
    uploadedFile,
    setUploadedFile,
    samplePDF,
    setSamplePDF,
    image,
    setImage,
    charts,
    setCharts,
    getAvailableReport,
    error
}) => {

    const handleReportChange = (e) => {
        setAvailableReports(e.target.value);
        setUploadedFile(null);
    };

    const handleFileUpload = (file) => {
        setUploadedFile(file);
        setAvailableReports("");
    };

    return (
        <>
            <div className="w-full m-auto flex flex-col gap-5 my-2">
                <div>
                    <h1 className="text-24 font-medium text-primary">Upload Report Files</h1>
                    <p className="text-16 font-regular text-primary">Attach actual content</p>
                </div>
                <div>
                    <h1 className="text-20 font-medium text-primary">Upload Report Files</h1>
                    <div>
                        <label className="text-15 font-medium text-primary" htmlFor="reportType">
                            Select from available reports <sup>*</sup>
                        </label>
                        <select
                            className="w-full mt-1 border border-gray-200 h-10 text-20"
                            id="reportType"
                            value={availableReports}
                            onChange={handleReportChange}
                            disabled={uploadedFile !== null}
                        >
                            <option value="">Select report</option>
                            {getAvailableReport?.map((report) => (
                                <option key={report.id} value={report.id}>
                                    {report.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <FileUpload
                        label=""
                        file={uploadedFile}
                        onChange={handleFileUpload}
                        disabled={availableReports !== ""}
                    />
                    {error && !availableReports && !uploadedFile && (
                        <p className="text-red-500 ml-1">Please select a report or upload a file</p>
                    )}
                    {error && uploadedFile && uploadedFile.type !== "application/pdf" && (
                        <p className="text-red-500 ml-1">Uploaded file must be a PDF</p>
                    )}
                </div>
                <div>
                    <FileUpload
                        label="Upload Sample PDF*"
                        file={samplePDF}
                        onChange={setSamplePDF}
                    />
                    {error && !samplePDF && (
                        <p className="text-red-500 ml-1">Please upload the Sample PDF</p>
                    )}
                    {error && samplePDF && samplePDF.type !== "application/pdf" && (
                        <p className="text-red-500 ml-1">Sample PDF must be a PDF file</p>
                    )}
                </div>
                <div>
                    <FileUpload
                        label="Upload Image*"
                        file={image}
                        onChange={setImage}
                    />
                    {error && !image && (
                        <p className="text-red-500 ml-1">Please upload Image</p>
                    )}
                    {error && image && image.type !== "image/webp" && (
                        <p className="text-red-500 ml-1">Image must be a WEBP file</p>
                    )}
                </div>
                <div>
                    <FileUpload
                        label="Upload charts"
                        file={charts}
                        onChange={setCharts}
                    />
                    {error && charts && charts.type !== "application/pdf" && (
                        <p className="text-red-500 ml-1">charts PDF must be a PDF file</p>
                    )}
                </div>
            </div>
        </>
    )
}
export default FormStep3;
