
export default function DropdownCompoent({ name = "", options = [], placeholder = "Select an option", label = "", value, onChange = () => { }, className = "", labelClassName = "", accept }) {
    return (
        <div>
            {label && (
                <label htmlFor="supplierType" className={`block ${labelClassName}`}>
                    {label}
                </label>
            )}
            <select
                className={` border px-3 py-2 rounded ${className}`}
                name={name}
                value={value}
                // onChange={(e) => onChange(e.target.value)}
                // onChange={onChange}
                onChange={(e) => onChange({ target: { name, value: e.target.value } })}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );


}
