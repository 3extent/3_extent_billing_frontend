
export default function DropdownCompoent({ options = [], placeholder = "Select an option", label = " ", value, onChange = () => { }, className = "",  labelClassName = "",  accept }) {
    return (
        <div>
            {label && (
                <label htmlFor="supplierType" className={`block ${labelClassName}`}>
                    {label}
                </label>
            )}
            {/* <select id="supplierType"
                name="supplierType"
                className="w-full border px-3 py-2 mt-2 rounded"> */}
            <select
                className={` border px-3 py-2 mt-2 rounded ${className}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            // accept={accept}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );


}
