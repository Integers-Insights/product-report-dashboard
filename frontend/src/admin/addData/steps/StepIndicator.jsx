const StepIndicator = ({  step, setStep }) => {

    const totalSteps = 6;
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between py-6 w-230 m-auto">
            {steps.map((s, i) => {
                const isActive = step === s;
                const isCompleted = step > s;

                return (
                    <div key={s} className="flex-1 flex items-center relative">
                        <div onClick={() => isCompleted || isActive ? setStep(s) : null} className={`w-5 h-5 ml-1 rounded-full flex-shrink-0 cursor-pointer transition-all duration-500 ease-in-out hover:scale-125 ${isActive ? "bg-brand scale-110" : isCompleted ? "bg-brand" : "bg-gray-300 hover:bg-brand/60"}`}></div>

                        {/* line */}
                        <div className="flex-1 h-1 mx-2 bg-gray-300 rounded overflow-hidden relative">
                            <div className="h-1 bg-brand transition-all duration-700 ease-in-out absolute top-0 left-0" style={{ width: step > s ? "100%" : "0%" }}></div>
                        </div>

                        {/* label */}
                        <span className={` text-sm font-medium transition-colors duration-500 ease-in-out ${isActive || isCompleted ? "text-brand-primary" : "text-gray-500"}`}>
                            Step {s}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default StepIndicator;
