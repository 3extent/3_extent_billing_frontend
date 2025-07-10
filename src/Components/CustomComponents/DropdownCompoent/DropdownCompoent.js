
export default function DropdownCompoent({ options = [], placeholder = "Select an option" }) {
    return (
        <div>
            <select id="supplierType" name="supplierType" className="w-full border px-3 py-2 mt-2 rounded">
                <option value="">{placeholder}</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}
