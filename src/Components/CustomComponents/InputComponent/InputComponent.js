export default function InputComponent({ label, type, placeholder, onChange, inputClassName = "", accept, labelClassName = "", name }) {
    return (
        <div className="text-left">
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
            />
        </div>
    );
} 
