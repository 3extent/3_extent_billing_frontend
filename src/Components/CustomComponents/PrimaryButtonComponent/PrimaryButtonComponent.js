export default function PrimaryButtonComponent({ label, onClick ,icon}) {
    return (
        <div>
            <button onClick={onClick} className="w-full bg-slate-800 text-white rounded py-2 px-5 text-xl font-bold"><span className="mr-3">{ <i className={icon} aria-hidden="true"></i>}</span>{label}</button>
        </div>


    );
};