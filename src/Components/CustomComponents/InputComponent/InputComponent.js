export default function InputComponent({ label, type, placeholder, onChange, inputClassName = "" }) {
    return (
        <div className="text-left mb-4">
            {/* // <div className={`text-left mb-4 ${className}`}> */}
            <label>{label}</label><br />
            <input
                // className="w-full border px-3 py-2 rounded"
                className={`w-full border px-3 py-2 rounded ${inputClassName}`}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    );
} 
