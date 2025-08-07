
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
                icon="fa fa-bookmark-o"
                buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
            />
        </div>
    );
}
