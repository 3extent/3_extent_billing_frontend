
export default function DropdownCompoent({ options = [], placeholder = "Select an option", label = "Choose an option", value, onChange = () => { } }) {
    return (
        <div>
            <label htmlFor="supplierType" className="font-serif">
                {label}
            </label>
            {/* <select id="supplierType"
                name="supplierType"
                className="w-full border px-3 py-2 mt-2 rounded"> */}
            <select
                className="w-full border px-3 py-2 mt-2 rounded"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );


}
