export default function PrimaryButtonComponent({ label, onClick, icon, buttonClassName = "", iconPosition = "left"}) {
    return (
        <button onClick={onClick} className={` ${buttonClassName} bg-slate-800 py-2 px-3 text-white text-sm font-bold rounded flex items-center justify-center gap-2`}>
            {icon && iconPosition === "left" && <i className={icon} aria-hidden="true"></i>}
            <span>{label}</span>
            {icon && iconPosition === "right" && <i className={icon} aria-hidden="true"></i>}
        </button>
    );
};
