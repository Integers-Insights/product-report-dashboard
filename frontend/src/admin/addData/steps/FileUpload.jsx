import { useRef } from "react";

const FileUpload = ({ label, file, onChange, disabled = false }) => {

    const inputRef = useRef(null);

    const handleFile = (file) => {
        if (!disabled) {
            onChange(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (disabled) return;

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    };

    return (
        <div className={`w-full mt-4 ${disabled ? "opacity-50" : ""}`}>
            <label className="font-medium text-primary text-20">{label}</label>
            <div
                onClick={() => !disabled && inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`p-5 border-2 border-dashed border-gray-500 rounded text-center 
                    ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"}
                `}
            >
                <input
                    type="file"
                    ref={inputRef}
                    hidden
                    disabled={disabled}
                    onChange={(e) => handleFile(e.target.files[0])}
                />
                {!file ? (
                    <p className="text-primary">
                        {disabled ? "File upload disabled" : "Select from folder or drag drop"}
                    </p>
                ) : (
                    <p className="text-brand-primary font-medium">
                        Selected: {file.name}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
