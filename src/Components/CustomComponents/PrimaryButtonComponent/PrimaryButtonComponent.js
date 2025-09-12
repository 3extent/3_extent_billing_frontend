export default function PrimaryButtonComponent({ label, onClick, icon, buttonClassName = "", iconPosition = "left", error = "", }) {
    return (
        <div>
            <button onClick={onClick} className={` bg-slate-800 text-white rounded flex items-center justify-center gap-2 ${buttonClassName}`}>
                {icon && iconPosition === "left" && <i className={icon} aria-hidden="true"></i>}
                <span className="">{label}</span>
                {icon && iconPosition === "right" && <i className={icon} aria-hidden="true"></i>}
            </button>
            {error && <div className="text-red-600 mt-1 text-sm">{error}</div>}
        </div>
    );
};
