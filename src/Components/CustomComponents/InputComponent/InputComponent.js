export default function InputComponent({ label, type, placeholder, onChange, inputClassName = "", accept, labelClassName = "", name,maxLength}) {
    console.log('maxLength: ', maxLength);
    return (
        <div className="text-left mb-4">
            {/* // <div className={`text-left mb-4 ${className}`}> */}
            {label && (
                <label className={labelClassName}>{label}</label>
            )}
            <br />
            <input
                className={`border px-3 py-2 rounded ${inputClassName}`}
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                accept={accept}
                name={name}
                maxLength={10}
            />
        </div>
    );
} 
