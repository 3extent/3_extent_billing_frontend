export default function InputComponent({ label, type, placeholder,inputClassName="" }) {
    return (
        <div className="text-left mb-4 ">
            <label className="font-semibold text-lg">{label}</label><br />
            <input
                className={`border px-3 py-2 rounded ${inputClassName}`} 
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
} 