
export default function DropdownCompoent({ options = [], placeholder = "Select an option", label = "", value = "", onChange = () => { }, className = "", labelClassName = "", name, error, disabled=false}) {
    return (
        <div>
            {label && (
                <label htmlFor="supplierType" className={`block ${labelClassName}`}>
                    {label}
                </label>
            )}
            <select
                className={` border px-3 py-2 rounded ${className} ${error ? 'border-red-500' : 'border-gray-300'}`}
                name={name}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange({ target: { name, value: e.target.value } })}
            >
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );


}
