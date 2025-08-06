import { useEffect, useState } from "react";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall } from "../../../Util/AxiosUtils";
export default function AddModels() {
    const [modelData, setModelData] = useState({
        brand_id: "",
        name: "",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setModelData({ ...modelData, [name]: value });
    };

    const addModelCallback = (response) => {
        console.log("response:", response);
        if (response.status === 200) {
            setModelData({
                brand_id: "",
                name: "",
            });
        } else {
            console.log("error");
        }
    };

    const addModel = () => {
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/models",
            data: modelData,
            callback: addModelCallback,
        });
    };
    return (
        <div>
            <div className="text-xl font-serif mb-4">Add Model</div>
            <div className="grid grid-cols-2">
                <CustomDropdownInputComponent
                    label="Brand Name"
                    name="brand_id"
                    placeholder="Select Brand"
                    className="w-[80%]"
                    labelClassName="font-bold"
                    value={modelData.brand_id}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="Model Name"
                    name="name"
                    type="text"
                    placeholder="Enter Model Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-bold"
                    value={modelData.name}
                    onChange={handleInputChange}
                />
            </div>
            <PrimaryButtonComponent
                label="Submit"
                icon="fa fa-bookmark-o"
                buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
                onClick={addModel}
            />
        </div>
    );
}