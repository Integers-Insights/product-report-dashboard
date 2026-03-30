import { useState } from "react";
import { RxCaretDown } from "react-icons/rx";
import { faqData } from "./Data";

const FAQ = () => {

  const [openFaq, setOpenFaq] = useState(null);

  const handleClick = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="pb-1 rounded-md">
      {faqData.map((fq, i) => {
        const isOpen = openFaq === i;
        return (
          <div key={i} className="overflow-hidden mb-2">
            <button
              onClick={() => handleClick(i)}
              className="w-full flex justify-between items-center px-4 py-3 text-left bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            >
              <span className="font-medium text-primary text-16">
                {fq.title}
              </span>
              <RxCaretDown
                className={`text-20 text-primary transition-all duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`px-4 text-primary overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "h-auto py-3" : "h-0"
              }`}
            >
              <p className=" leading-relaxed">
                {fq.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;
