export default function PrimaryButtonComponent({ label, onClick, icon, buttonClassName = "", iconPosition = "left", iconOnly = false }) {
    return (
        <button
            onClick={onClick}
            className={`group bg-slate-800 text-white text-sm font-bold rounded-[7px] flex items-center justify-center gap-2 
            ${iconOnly ? "px-3 py-2" : "px-3 py-2"} 
            ${buttonClassName}`}>

            {icon && iconPosition === "left" && <i className={icon} aria-hidden="true"></i>}
            {!iconOnly && <span>{label}</span>}
            {iconOnly && (
                <span className="hidden group-hover:inline transition-all">
                    {label}
                </span>
            )}
            {icon && iconPosition === "right" && <i className={icon} aria-hidden="true"></i>}
        </button>
    );
};


