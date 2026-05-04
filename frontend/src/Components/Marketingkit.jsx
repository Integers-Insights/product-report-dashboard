import {
  ChartBarSquareIcon,
  LanguageIcon,
  EnvelopeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Keywords from "./Keywords";
import EmailSequence from "./EmailSequence";
import AdConcept from "./AdConcept";

const Marketingkit = ({ marketing_kit_data }) => {
  const [tab, setTab] = useState("Keywords");

  console.log("marketingkit: ", marketing_kit_data);

  let high_volume_buyer_intent_data =
    marketing_kit_data?.high_volume_buyer_intent;
  let low_competition_gaps_data = marketing_kit_data?.low_competition_gaps;
  let multilingual_data = marketing_kit_data?.multilingual;

  let emailData = marketing_kit_data?.emails;
  let adConceptsData = marketing_kit_data?.ad_concepts;

  let buyer_type_data = marketing_kit_data?.buyer_type;

  let sequence_note_data = marketing_kit_data?.sequence_note;

  let product_name_data = marketing_kit_data?.product_name;

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[#000000] text-base font-medium">
            Marketing Kit
          </h2>
          <p className="text-[#5F6368] text-13 font-regular">
            Keywords · Email sequence · Ad concepts — all tuned for {product_name_data ?? "--"} {buyer_type_data ?? "--"} buyers
          </p>
        </div>
        <div className="border bg-[#0284C7] text-white text-sm font-medium py-0.5 px-3 rounded-2xl">
          ↓ Export Kit
        </div>
      </div>

      <div className="border border-[#E6E6E6] grid grid-cols-3 gap-5 p-2 bg-[#EDF9FF] rounded-lg mt-6">
        <div
          className={`p-1.5 flex justify-center items-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-300 ${tab === "Keywords" ? "bg-white" : ""}`}
          onClick={() => setTab("Keywords")}
        >
          <LanguageIcon className="h-5 w-5" /> Keywords
        </div>
        <div
          className={`p-1.5 flex justify-center items-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-300 ${tab === "Email Sequence" ? "bg-white" : ""}`}
          onClick={() => setTab("Email Sequence")}
        >
          <EnvelopeIcon className="h-5 w-5" /> Email Sequence
        </div>
        <div
          className={`p-1.5 flex justify-center items-center gap-2 font-medium rounded-lg cursor-pointer transition-all duration-300 ${tab === "Ad Concept" ? "bg-white" : ""}`}
          onClick={() => setTab("Ad Concept")}
        >
          <BanknotesIcon className="h-5 w-5" /> Ad Concept
        </div>
      </div>

      <div>
        {tab === "Keywords" && (
          <Keywords
            high_volume_buyer_intent_data={high_volume_buyer_intent_data}
            low_competition_gaps_data={low_competition_gaps_data}
            multilingual_data={multilingual_data}
          />
        )}
        {tab === "Email Sequence" && <EmailSequence emailData={emailData} sequence_note_data={sequence_note_data} />}
        {tab === "Ad Concept" && <AdConcept adConceptsData={adConceptsData} />}
      </div>
    </>
  );
};
export default Marketingkit;
