import PrimaryButtonComponent from "../PrimaryButtonComponent/PrimaryButtonComponent";

export default function CustomHeaderComponent({name,icon,label}) {
    return (
        <div className="flex justify-between items-center">
            <div className="text-xl font-serif">{name}</div>
            <PrimaryButtonComponent
            icon={icon}
            label={label} 
            />
        </div>
    );
}