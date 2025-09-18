export default function InputComponent({ label, type, placeholder, onChange, inputClassName = "", accept, labelClassName = "", name, value, disabled = false, maxLength, error, numericOnly = false, }) {
    const handleChange = (e) => {
        const val = e.target.value;
        if (!numericOnly) {
            onChange(e);
            return;
        }
        if (val === "" || /^\d+$/.test(val)) {
            onChange(e);
        }
    };
    return (
        <div className="text-left">
            {label && (
                <label className={labelClassName}>{label}</label>
            )}
            <br />
            <input
                className={`border px-3 py-2 rounded ${inputClassName}  ${disabled ? "cursor-not-allowed bg-gray-200 opacity-50 " : ""}${error ? "border-red-600" : ""}`}
                type={type}
                placeholder={placeholder}
                onChange={handleChange}
                accept={accept}
                name={name}
                value={value}
                disabled={disabled}
                maxLength={maxLength}
                inputMode={numericOnly}
            />
            {error && (
                <div className="text-red-600 text-sm mt-1">{error}</div>
            )}
        </div>
    );
}

