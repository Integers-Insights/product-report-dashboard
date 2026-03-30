const FormStep2 = (
    { reportCovers, setReportCovers, reportSupports, setReportSupports, error }
) => {

    const handleChange = (value, checked) => {
        if (checked) {
            setReportCovers((prev) => [...prev, value]);
        } else {
            setReportCovers((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleChange1 = (value, checked) => {
        if (checked) {
            setReportSupports((prev) => [...prev, value]);
        } else {
            setReportSupports((prev) => prev.filter((item) => item !== value));
        }
    };

    const checkBox1 = ["Market & Demand", "Competitive Landscape", "Strategic Insights", "Pricing & Economics", "Trade & Supply Chain", "Innovation & Trends", "Geography", "Forecasting & Outlook", "Regulation & Compliance"];

    const checkBox2 = ["Product & Portfolio Decisions", "Competitive Strategy", "Investment & Financial Planning", "Market Entry & Expansion", "Pricing & Commercial Strategy", "Supply Chain & Sourcing", "Risk & Feasibility Assessment", "Strategic Communication","Strategic Communication1"];

    return (
        <>
            <div className="w-full m-auto flex flex-col gap-5 my-2">
                <div>
                    <h1 className="text-24 font-medium text-primary">Scope & Decision Value</h1>
                    <p className="text-16 font-regular text-primary">Control report positioning & conversion copy</p>
                </div>
                <div>
                    <h1 className="text-20 font-medium text-primary">What this report covers <sup>*</sup></h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
                        {checkBox1?.map((item, index) => (
                            <label key={index} className=" flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={reportCovers.includes(item)}
                                    onChange={(e) => handleChange(item, e.target.checked)}
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                    {error && !reportCovers.length && <p className="text-red-500 ml-1">Please select value...</p>}
                </div>
                <div className="">
                    <h1 className="text-20 font-medium text-primary">What decisions this report supports <sup>*</sup></h1>
                    <div className=" grid grid-cols-1 sm:grid-cols-3 gap-5 mt-2">
                        {checkBox2?.map((item, index) => (
                            <label key={index} className=" flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={reportSupports.includes(item)}
                                    onChange={(e) => handleChange1(item, e.target.checked)}
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                    {error && !reportSupports.length && <p className="text-red-500 ml-1">Please select value...</p>}
                </div>
            </div>
        </>
    )
}
export default FormStep2;
