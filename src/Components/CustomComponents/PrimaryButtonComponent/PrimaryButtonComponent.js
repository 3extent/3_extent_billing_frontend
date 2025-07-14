export default function PrimaryButtonComponent({ label, onClick,className="" }) {
    return (
        <div>
            <button onClick={onClick} className={`bg-blue-500 text-white py-2 rounded text-xl font-bold transition ${className}`}>
                {label}</button>
        </div>


    );
};