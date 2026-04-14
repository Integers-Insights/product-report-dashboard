import { useState } from 'react'
import { CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid'

import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'

const steps = [
    { id: '01', name: 'Products Fetch' },
    { id: '02', name: 'Validate' },
    { id: '03', name: 'Profile' },
    { id: '04', name: 'Opportunities' },
]

export default function Steps() {
    const [currentStep, setCurrentStep] = useState(0)

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
    }
    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1)
    }

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <nav aria-label="Progress" className="mb-6 bg-[#FFFFFF]">
                <ol className="divide-y divide-gray-300 border border-[#E6E6E6] md:flex md:divide-y-0">
                    {steps.map((step, stepIdx) => {
                        const status =
                            stepIdx < currentStep
                                ? 'complete'
                                : stepIdx === currentStep
                                    ? 'current'
                                    : 'upcoming'
                        return (
                            <li key={step.id} className="relative md:flex md:flex-1">
                                {status === 'complete' ? (
                                    <div className="group flex w-full items-center">
                                        <span className="flex items-center px-6 py-4 text-sm font-medium">
                                            <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-[#0284C7] group-hover:bg-[#0284C7]">
                                                <CheckIcon aria-hidden="true" className="w-6 h-6 text-white" />
                                            </span>
                                            <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                                        </span>
                                    </div>
                                ) : status === 'current' ? (
                                    <div className="flex items-center px-6 py-4 text-sm font-medium">
                                        <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full border-2 border-[#0284C7]">
                                            <span className="text-[#0284C7]">{step.id}</span>
                                        </span>
                                        <span className="ml-4 text-sm font-medium text-[#0284C7]">{step.name}</span>
                                    </div>
                                ) : (
                                    <div className="group flex items-center px-6 py-4 text-sm font-medium">
                                        <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                                            <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                                        </span>
                                        <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                                    </div>
                                )}

                                {/* Arrow separator */}
                                {stepIdx !== steps.length - 1 && (
                                    <div aria-hidden="true" className="absolute top-0 right-0 hidden h-full w-5 md:block">
                                        <svg fill="none" viewBox="0 0 22 80" preserveAspectRatio="none" className="size-full text-gray-300">
                                            <path
                                                d="M0 -2L20 40L0 82"
                                                stroke="currentcolor"
                                                vectorEffect="non-scaling-stroke"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ol>
            </nav>

            {/* Step Content */}
            <div className="mb-6 border-gray-300 rounded-md">
                {currentStep === 0 && (
                    <div>
                        <Step1 nextStep={nextStep} />
                    </div>
                )}
                {currentStep === 1 && (
                    <div>
                        <Step2 />
                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                        <Step3 />
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                        <Step4 />
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            {/* <div className="flex justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                >
                    Back
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
                >
                    {currentStep === steps.length - 2 ? 'Finish' : 'Next'}
                </button>
            </div> */}

            {/* {currentStep !== 0 && (
                <div className="flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-4 py-2 border-2 border-[#0284C7] rounded-lg text-[#001413] cursor-pointer disabled:opacity-50 flex items-center gap-2 text-base font-semibold"
                    >
                        <ArrowLeftIcon className='h-5 w-5' /> Back
                    </button>

                    <button
                        onClick={nextStep}
                        disabled={currentStep === steps.length - 1}
                        className="px-4 py-2 rounded-lg bg-[#0284C7] text-white text-base font-semibold cursor-pointer disabled:opacity-50"
                    >
                        {currentStep === steps.length - 2 ?
                            "Submit"
                            :
                            <div className="flex items-center gap-2">
                                Confirm Selection <ArrowRightIcon className='h-5 w-5' />
                            </div>
                        }
                    </button>
                </div>
            )} */}


            {currentStep !== 0 && (
                <div className="flex justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="px-4 py-2 border-2 border-[#0284C7] rounded-lg text-[#001413] cursor-pointer disabled:opacity-50 flex items-center gap-2 text-base font-semibold"
                    >
                        <ArrowLeftIcon className='h-5 w-5' /> Back
                    </button>

                    <button
                        onClick={nextStep}
                        disabled={currentStep === steps.length - 1}
                        className="px-4 py-2 rounded-lg bg-[#0284C7] text-white text-base font-semibold cursor-pointer disabled:opacity-50"
                    >
                        {currentStep === steps.length - 1 ?
                            "Submit"
                            :
                            <div className="flex items-center gap-2">
                                Confirm Selection <ArrowRightIcon className='h-5 w-5' />
                            </div>
                        }
                    </button>
                </div>
            )}

        </div>
    )
}