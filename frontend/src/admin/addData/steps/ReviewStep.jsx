import { useState } from "react";

const ReviewStep = ({
  reportTitle,
  subTitle,
  industry,
  subIndustry,
  regions,
  country,
  reportType,
  useCases,
  publishDate,
  coveragePeriodFrom,
  coveragePeriodTo,
  reportCovers,
  reportSupports,
  availableReports,
  reportPrice,
  status,
  fHomepage,
  seoSlug,
  seoTitle,
  seoKeywords,
  seoDescription,
  uploadedFile,
  samplePDF,
  image,
  charts
}) => {

  const [openStep, setOpenStep] = useState(null);

  const toggleStep = (step) => {
    setOpenStep(openStep === step ? null : step);
  };

  return (
    <>
      <h1 className="text-24 font-bold mb-4">ReviewStep</h1>
      <div className="mb-3">
        <button
          onClick={() => toggleStep(1)}
          className="w-full flex justify-between px-3 py-2 font-medium bg-gray-100 hover:bg-gray-200"
        >
          <span>Step1</span>
          <span>{openStep === 1 ? "−" : "+"}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${openStep === 1 ? "h-auto p-3" : "h-0 px-3"}`}>
          <p><span className="font-medium">Title:</span> {reportTitle}</p>
          <p><span className="font-medium">Subtitle:</span> {subTitle}</p>
          <p><span className="font-medium">Industry Name:</span> {industry}</p>
          <p><span className="font-medium">Subindustry Name:</span> {subIndustry}</p>
          <p><span className="font-medium">Region:</span> {regions?.join(", ")}</p>
          <p><span className="font-medium">Country:</span> {country?.join(", ")}</p>
          <p><span className="font-medium">Report Type:</span> {reportType}</p>
          <p><span className="font-medium">Use Cases:</span> {useCases}</p>
          <p><span className="font-medium">Publish Date:</span> {publishDate}</p>
          <p><span className="font-medium">Coverage From:</span> {coveragePeriodFrom}</p>
          <p><span className="font-medium">Coverage To:</span> {coveragePeriodTo}</p>
        </div>
      </div>
      <div className="mb-3 rounded">
        <button
          onClick={() => toggleStep(2)}
          className="w-full flex justify-between px-3 py-2 font-medium bg-gray-100 hover:bg-gray-200"
        >
          <span>Step2</span>
          <span>{openStep === 2 ? "−" : "+"}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${openStep === 2 ? "h-auto p-3" : "h-0 px-3"}`}>
          <p><span className="font-medium">Report Covers:</span> {reportCovers?.join(", ")}</p>
          <p><span className="font-medium">Report Supports:</span> {reportSupports?.join(", ")}</p>
        </div>
      </div>
      <div className="mb-3 rounded">
        <button
          onClick={() => toggleStep(3)}
          className="w-full flex justify-between px-3 py-2 font-medium bg-gray-100 hover:bg-gray-200"
        >
          <span>Step3</span>
          <span>{openStep === 3 ? "−" : "+"}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${openStep === 3 ? "h-auto p-3" : "h-0 px-3"}`}>
          <p><span className="font-medium">Report Files:</span> {availableReports || uploadedFile?.name}</p>
          <p><span className="font-medium">Sample PDF:</span> {samplePDF?.name}</p>
          <p><span className="font-medium">Image:</span> {image?.name}</p>
          <p><span className="font-medium">Charts:</span> {charts?.name}</p>
        </div>
      </div>
      <div className="mb-3 rounded">
        <button
          onClick={() => toggleStep(5)}
          className="w-full flex justify-between px-3 py-2 font-medium bg-gray-100 hover:bg-gray-200"
        >
          <span>Step5</span>
          <span>{openStep === 5 ? "−" : "+"}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${openStep === 5 ? "h-auto p-3" : "h-0 px-3"}`}>
          <p><span className="font-medium">Full Report Price:</span> {reportPrice}</p>
        </div>
      </div>
      <div className="mb-3 rounded">
        <button
          onClick={() => toggleStep(6)}
          className="w-full flex justify-between px-3 py-2 font-medium bg-gray-100 hover:bg-gray-200"
        >
          <span>Step6</span>
          <span>{openStep === 6 ? "−" : "+"}</span>
        </button>
        <div className={`transition-all duration-300 overflow-hidden ${openStep === 6 ? "h-auto p-3" : "h-0 px-3"}`}>
          <p><span className="font-medium">Status:</span> {status}</p>
          <p><span className="font-medium">Feature Homepage:</span> {fHomepage ? "True" : "False"}</p>
          <p><span className="font-medium">SEO Slug:</span> {seoSlug}</p>
          <p><span className="font-medium">SEO Title:</span> {seoTitle}</p>
          <p><span className="font-medium">SEO Keywords:</span> {seoKeywords}</p>
          <p><span className="font-medium">SEO Description:</span> {seoDescription}</p>
        </div>
      </div>
    </>
  );
};

export default ReviewStep;
