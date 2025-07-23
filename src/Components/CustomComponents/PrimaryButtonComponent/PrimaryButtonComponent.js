export default function PrimaryButtonComponent({ label, onClick, icon, buttonClassName = "" }) {
    return (
        <button onClick={onClick} className={` bg-slate-800 text-white rounded ${buttonClassName}`}><span className="mr-3">{<i className={icon} aria-hidden="true"></i>}</span>{label}</button>
    );
};
