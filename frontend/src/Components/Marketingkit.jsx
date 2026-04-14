import { ChartBarSquareIcon, LanguageIcon, EnvelopeIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Keywords from "./Keywords";
import EmailSequence from "./EmailSequence";
import AdConcept from "./AdConcept";

const Marketingkit = () => {

    const [tab, setTab] = useState("Keywords");

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[#000000] text-base font-medium">Marketing Kit</h2>
                    <p className="text-[#5F6368] text-13 font-regular">Keywords · Email sequence · Ad concepts — all tuned for Organic Turmeric B2B buyers</p>
                </div>
                <div className="border bg-[#0284C7] text-white text-sm font-medium py-0.5 px-3 rounded-2xl">↓ Export Kit</div>
            </div>

            <div className="border border-[#E6E6E6] grid grid-cols-3 gap-5 p-2 bg-[#EDF9FF] rounded-lg mt-6">
                <div className={`p-1.5 flex justify-center items-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-300 ${tab === "Keywords" ? "bg-white" : ""}`} onClick={() => setTab("Keywords")}><LanguageIcon className="h-5 w-5" /> Keywords</div>
                <div className={`p-1.5 flex justify-center items-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-300 ${tab === "Email Sequence" ? "bg-white" : ""}`} onClick={() => setTab("Email Sequence")}><EnvelopeIcon className="h-5 w-5" /> Email Sequence</div>
                <div className={`p-1.5 flex justify-center items-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-300 ${tab === "Ad Concept" ? "bg-white" : ""}`} onClick={() => setTab("Ad Concept")}><BanknotesIcon className="h-5 w-5" /> Ad Concept</div>
            </div>

            <div>
                {tab === "Keywords" && <Keywords />}
                {tab === "Email Sequence" && <EmailSequence />}
                {tab === "Ad Concept" && <AdConcept />}
            </div>
        </>
    );
};
export default Marketingkit;