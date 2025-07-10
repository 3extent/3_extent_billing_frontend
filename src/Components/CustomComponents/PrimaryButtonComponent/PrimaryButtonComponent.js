export default function PrimaryButtonComponent({ label, onClick }) {
    return (
        <div>
            <button onClick={onClick} className="w-full bg-blue-500 text-white py-2 rounded  text-xl font-bold">{label}</button>
        </div>


    );
};