import { useNavigate } from "react-router-dom";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";

function AddPart() {
    const navigate = useNavigate();
    const handleback = () => {
        navigate("-1")
    }
    return (
        <div className="w-full">
            <div className="text-xl font-serif mb-4">
                Add Device Part
            </div>

            <div className="grid grid-cols-3 gap-x-5 gap-y-2">
                <InputComponent
                    label="Part Name"
                    type="text"
                    name="purchase_price"
                    placeholder="Enter Part Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <div className="col-span-3 mt-5 flex justify-center gap-4">
                    <PrimaryButtonComponent
                        label="Back"
                        icon="fa fa-arrow-left"
                        onClick={handleback}
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