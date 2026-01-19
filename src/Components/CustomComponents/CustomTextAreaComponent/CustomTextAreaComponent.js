export default function CustomTextAreaComponent({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    rows = "",
    inputClassName = "",
    labelClassName = "",
    error = ""
}) {
    return (
        <div className="text-left">
            {label && <label className={labelClassName}>{label}</label>}
            <br />
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`border px-3 py-2 rounded ${inputClassName} ${error ? "border-red-600" : ""}`}
            />
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
    );
}
