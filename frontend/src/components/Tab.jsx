const Tab = ({ label, isActive, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`cursor-pointer flex-shrink-0 flex items-center gap-2 pb-1.5 px-1 py-2.5 text-sm font-medium ${
      isActive
        ? "text-[#0284C7] border-b-2 border-b-[#0284C7]"
        : "text-[#6A7675] hover:text-gray-700"
    }`}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {label}
  </button>
);

export default Tab;
