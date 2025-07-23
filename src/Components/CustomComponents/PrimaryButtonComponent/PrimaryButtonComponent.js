export default function PrimaryButtonComponent({ label, onClick ,icon,buttonclassName = ""}) {
    return (
        <div>
            <button onClick={onClick} className={` bg-slate-800 text-white rounded px-5 py-2 text-xl font-bold   ${buttonclassName}`}><span className="mr-3">{ <i className={icon} aria-hidden="true"></i>}</span>{label}</button>
        </div>
    );
};
