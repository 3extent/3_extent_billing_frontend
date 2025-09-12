export default function PrimaryButtonComponent({ label, onClick, icon, buttonClassName = "", iconPosition = "left" }) {
    return (
        <button onClick={onClick} className={` bg-slate-800 text-white py-1 px-3 text-sm font-bold rounded flex items-center justify-center gap-2 ${buttonClassName}`}>
            {icon && iconPosition === "left" && <i className={icon} aria-hidden="true"></i>}
            <span className="">{label}</span>
            {icon && iconPosition === "right" && <i className={icon} aria-hidden="true"></i>}
        </button>
    );
};
