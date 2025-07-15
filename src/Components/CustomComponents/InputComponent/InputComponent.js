export default function InputComponent({ label, type, placeholder, onChange, inputClassName = "", accept, labelClassName = "", }) {
    return (
        <div className="text-left mb-4">
            {/* // <div className={`text-left mb-4 ${className}`}> */}
            {label && (
                <label className={labelClassName}>{label}</label>
            )}
            <br />
            <input
                // className="w-full border px-3 py-2 rounded"
                className={`border px-3 py-2 rounded ${inputClassName}`}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                accept={accept}
            />
        </div>
    );
} 
