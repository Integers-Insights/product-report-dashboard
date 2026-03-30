import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const MultiSelectDropdown = ({ label, options, value, onChange }) => {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item) => {
    if (value.includes(item)) {
      onChange(value.filter((i) => i !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="w-full mb-5" ref={dropdownRef}>
      <label className="text-15 font-medium text-primary">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-200 px-0.5 py-2 mt-1 cursor-pointer flex justify-between items-center bg-white rounded"
      >
        <span className="text-13 text-primary truncate">
          {value.length ? value.join(", ") : "Select..."}
        </span>
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <IoIosArrowDown />
        </span>
      </div>
      {open && (
        <div className="border border-gray-200 border-t-0 p-1 bg-white rounded-b">
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 px-2 py-1 mb-2 rounded text-15 outline-none focus:ring-1 focus:ring-black"
          />
          <div className="h-auto overflow-y-auto space-y-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <label key={item} className="border border-gray-200 flex items-center gap-2 text-15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value.includes(item)}
                    onChange={() => handleSelect(item)}
                    className="accent-green-500"
                  />
                  {item}
                </label>
              ))
            ) : (
              <p className="text-xs text-gray-500">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
