export default function PrimaryButtonComponent({ label, onClick }) {
    return (
        <div>
            <button onClick={onClick} className="w-full bg-slate-800 text-white py-2 px-32 rounded  text-xl font-bold">{label}</button>
        </div>


    );
};