export default function InputComponent({ label, type, placeholder }) {
    return (
        <div className="text-left mb-4">
            <label>{label}</label><br />
            <input
                className="w-full border px-3 py-2 rounded"
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
} 