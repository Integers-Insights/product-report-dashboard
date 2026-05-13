import {
  Squares2X2Icon,
  Bars3Icon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { useState } from "react";
import { faq_data } from "./Data";

const HelpComponent = () => {
  const [open_Faq, setOpen_Faq] = useState([]);

  const openFaq = (index) => {
    if (open_Faq.includes(index)) {
      setOpen_Faq(open_Faq.filter((item) => item !== index));
    } else {
      setOpen_Faq([...open_Faq, index]);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-medium">Help & Contact</h1>
      <p className="mt-4 text-sm text-[#5F6368]">
        Guides, support, and answers to common questions.
      </p>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="border border-[#E6E6E6] p-4 card-hover rounded-lg flex gap-3 bg-white">
          <div className="bg-[#E0F5FF] h-10 w-10 rounded-lg flex justify-center items-center">
            <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 text-[#0284C7]" />
          </div>
          <div>
            <p className="text-base text-[#000000] font-medium">
              Live Chat Support
            </p>
            <p className="mt-1 text-sm text-[#5F6368] font-regular">
              Response under 5 minutes.
            </p>
            <a
              href="https://wa.me/919321256706?text=How%20can%20I%20help%20you%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 px-3 mt-2 rounded-lg font-medium text-sm bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer inline-block"
            >
              Start Chat
            </a>
          </div>
        </div>
        <div className="border border-[#E6E6E6] p-4 card-hover rounded-lg flex gap-3 bg-white">
          <div className="bg-[#E0F5FF] h-10 w-10 rounded-lg flex justify-center items-center">
            <EnvelopeIcon className="h-6 w-6 text-[#0284C7]" />
          </div>
          <div>
            <p className="text-base text-[#000000] font-medium">
              Email Support
            </p>
            <p className="mt-1 text-sm text-[#5F6368] font-regular">
              <a href="mailto:info@integersinsights.com">
                info@integersinsights.com
              </a>{" "}
              · Within 24hrs.
            </p>
            <a
              href="mailto:info@integersinsights.com"
              className="border border-gray-500 mt-2 py-1 px-3 rounded-lg hover:bg-gray-100 cursor-pointer font-medium text-sm inline-block"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>

      <p className="mt-6 text-base font-medium text-[#000000]">FAQs</p>

      <div className="mt-2 rounded-lg">
        {faq_data?.map((item, index) => {
          const isOpen = open_Faq.includes(index);
          return (
            <div key={index} className="border-b border-gray-300 mt-2">
              <div
                className="flex justify-between items-center px-3 py-3 cursor-pointer bg-gray-50 hover:bg-white"
                onClick={() => openFaq(index)}
              >
                <p className="text-sm font-medium text-black">{item.que}</p>
                <span className="text-xl font-semibold">
                  {isOpen ? "-" : "+"}
                </span>
              </div>
              <div
                className={`overflow-hidden ${
                  isOpen ? "max-h-40 py-2 px-3" : "max-h-0"
                }`}
              >
                <p className="text-sm text-[#5F6368] py-2">{item.ans}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HelpComponent;
