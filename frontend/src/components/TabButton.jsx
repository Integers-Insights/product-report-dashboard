const TabButton = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`cursor-pointer pb-2 px-1 py-2.5 text-15 text-primary font-medium ${isActive
            ? "border-b-4 border-b-[var(--color-brand-primary)]"
            : "text-primary hover:text-gray-700"
            }`}
    >
        {label}
    </button>
);

export default TabButton;
