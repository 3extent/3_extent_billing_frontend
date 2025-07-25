import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
export default function AddModels() {
    return (
        <div>
            <div className="text-xl font-serif mb-4">Add Model</div>
            <div className="grid grid-cols-2">
                <CustomDropdownInputComponent />
                <InputComponent
                    label="Model Name"
                    labelClassName="font-bold"
                    type="text"
                    placeholder="Enter Model Name"
                    inputClassName="w-[80%]"
                />
            </div>
            <PrimaryButtonComponent
                label="Submit"
                icon="fa fa-bookmark-o"
                buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
            />
        </div>
    );
}