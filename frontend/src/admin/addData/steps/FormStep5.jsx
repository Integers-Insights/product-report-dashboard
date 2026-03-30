const FormStep5 = ({reportPrice,setReportPrice}) => {

    return (
        <>
            <div className="w-full m-auto flex flex-col gap-5 my-2">
                <div>
                    <h1 className="text-24 font-medium text-primary">Pricing & Access</h1>
                    <p className="text-16 font-regular text-primary">Set competitive price for report</p>
                </div>
                <div>
                    <label className="text-16 font-medium text-primary" htmlFor="reportTitle">Full Report Price (Fetch)
                    </label>
                    <input type="number" id="reportTitle" className="w-full border border-gray-200 h-10 px-0.5 text-20" placeholder="Full report price" value={reportPrice} onChange={(e)=>setReportPrice(e.target.value)} />
                </div>
            </div>
        </>
    )
}

export default FormStep5;
