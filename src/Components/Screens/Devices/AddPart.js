import { useNavigate } from "react-router-dom";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";

function AddPart() {
    const navigate = useNavigate();
    return (

        <div className="w-full">
            <div className="text-xl font-serif mb-4">
                Add Device Part
            </div>

            <div className="grid grid-cols-3 gap-x-5 gap-y-2">
                <InputComponent
                    label="Part Name"
                    placeholder="Enter Part Name"
                    inputClassName="w-[80%]"
                />
                <CustomDropdownInputComponent
                    name="Shop Name"
                    placeholder="Select Shop Name"
                    options={["ABC PARTS", "MOBILE HUB", "PHONE WORLD"]}
                    dropdownClassName="w-[80%]"
                />
                <CustomDropdownInputComponent
                    name="Contact Number"
                    placeholder="Select Contact Number"
                    options={["9876543210", "9123456789", "9988776655"]}
                    dropdownClassName="w-[80%]"
                    numericOnly
                />
                <div className="col-span-3 mt-5 flex justify-center gap-4">
                    <PrimaryButtonComponent
                        label="Back"
                        icon="fa fa-arrow-left"
                        onClick={() => navigate(-1)}
                    />
                    <PrimaryButtonComponent
                        label="Save"
                        icon="fa fa-save"
                    />
                </div>
            </div>
        </div>
    )

} export default AddPart;