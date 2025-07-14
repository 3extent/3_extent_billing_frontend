
export default function DropdownCompoent({ options = [], placeholder = "Select an option", label = "Choose an option", value, onChange = () => { }, className = "", accept }) {
    return (
        <div>
            <label htmlFor="supplierType" className="block">
                {label}
            </label>
            {/* <select id="supplierType"
                name="supplierType"
                className="w-full border px-3 py-2 mt-2 rounded"> */}
            <select
                className={`w-full border px-3 py-2 mt-2 rounded ${className}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                accept={accept}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );


}
