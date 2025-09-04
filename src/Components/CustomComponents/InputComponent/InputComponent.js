export default function InputComponent({ label, type, placeholder, onChange, inputClassName = "", accept, labelClassName = "", name,value, disabled = false }) {
    return (
        <div className="text-left">
            {label && (
                <label className={labelClassName}>{label}</label>
            )}
            <br />
            <input
                className={`border px-3 py-2 rounded ${inputClassName}  ${disabled ? "cursor-not-allowed bg-gray-200 opacity-50 " : ""}`}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                accept={accept}
                name={name}
                value={value}
                disabled ={disabled}
            />
        </div>
    );
} 
