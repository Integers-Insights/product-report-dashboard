import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const SamplePreview = ({pdfPath}) => {

  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef(null);

  const onDocumentSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      setPageWidth(entries[0].contentRect.width);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-80 sm:w-160 lg:w-full h-175 overflow-y-auto border border-gray-300 m-auto"
    >
      <Document
        file={pdfPath}
        onLoadSuccess={onDocumentSuccess}
        loading="Loading PDF..."
        onLoadError={(err) => console.error("PDF error:", err)}
        error="PDF loading failed..."
      >
        {numPages &&
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
      </Document>
    </div>
  );
};

export default SamplePreview;
