
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
export default function AddBrands() {
    return (
        <div>
            <div className="text-xl font-serif mb-4">Add Brand</div>
            <InputComponent
                label="Brand Name"
                type="text"
                placeholder="Enter Brand Name"
                inputClassName="w-[40%]"
                labelClassName="font-bold"
            />
            <PrimaryButtonComponent
                label="Submit"
                className="w-[20%] mt-2"
                icon="fa fa-plus-circle"
            />
        </div>
    );
}
