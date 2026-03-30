import { useRef, useState } from "react";
import { RxCaretDown } from "react-icons/rx";

const prepareAccordionData = (sections = []) => {
  if (!Array.isArray(sections)) return [];

  const root = [];

  sections.forEach((raw) => {
    if (typeof raw !== "string") return;

    const section = raw.trim();
    if (!section) return;

    const number = section.split(" ")[0];
    const parts = number.split(".").filter(Boolean);

    let currentLevel = root;

    parts.forEach((_, index) => {
      const levelNumber = parts.slice(0, index + 1).join(".");

      let existing = currentLevel.find(
        (item) => item.number === levelNumber
      );

      if (!existing) {
        existing = {
          number: levelNumber,
          title:
            index === parts.length - 1
              ? section
              : levelNumber,
          children: [],
        };
        currentLevel.push(existing);
      }

      currentLevel = existing.children;
    });
  });

  return root;
};

const RenderItems = ({ items, level = 1 }) => {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.number}
          style={{ marginLeft: `${level * 16}px` }}
          className="mb-2"
        >
          <div className="flex gap-3">
            <span className="font-medium text-sm sm:text-base">
              {item.title.split(" ")[0]}
            </span>
            <span className="text-sm sm:text-base">
              {item.title.split(" ").slice(1).join(" ")}
            </span>
          </div>

          {item.children.length > 0 && (
            <RenderItems items={item.children} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};


const TableContent = ({ tableContent }) => {
  // if (!Array.isArray(tableContent) || tableContent.length === 0) {
  //   return null;
  // }
  if (!Array.isArray(tableContent) || tableContent.length === 0) {
    return (
      <div className="border border-gray-200 p-4 text-gray-400">
        No Table Content
      </div>
    );
  }

  const accordionItems = prepareAccordionData(tableContent);

  const [openSection, setOpenSection] = useState(null);
  const refs = useRef({});

  const toggleSection = (value) => {
    setOpenSection(openSection === value ? null : value);
  };

  return (
    <div className="pb-1">
      {accordionItems.map((item) => {
        const isOpen = openSection === item.number;
        return (
          <div
            key={item.number}
            className="rounded mb-2 overflow-hidden border border-gray-200"
          >
            <button
              onClick={() => toggleSection(item.number)}
              className="w-full flex justify-between items-center px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 transition"
            >
              <div className="flex gap-2 flex-wrap text-left">
                <span className="font-bold text-sm sm:text-base">
                  {item.title.split(" ")[0]}
                </span>
                <span className="text-primary text-sm sm:text-base">
                  {item.title.split(" ").slice(1).join(" ")}
                </span>
              </div>

              <RxCaretDown
                className={`text-xl transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            <div
              ref={(el) => (refs.current[item.number] = el)}
              style={{
                maxHeight: isOpen
                  ? refs.current[item.number]?.scrollHeight + "px"
                  : "0px",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <div className="px-4 sm:px-6 py-3 bg-white">
                <RenderItems items={item.children} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableContent;
