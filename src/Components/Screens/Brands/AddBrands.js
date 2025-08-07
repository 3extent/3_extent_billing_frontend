
import { useEffect, useState } from "react";
import { apiCall } from "../../../Util/AxiosUtils";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
export default function AddBrands() {
    const [brandData, setBrandData] = useState({
        name: ""
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBrandData({ ...brandData, [name]: value });
    };

    const addBrandCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            console.log('response: ', response);
            setBrandData({ name: "" });
        } else {
            console.log("Error while adding brand");
        }
    };

    const addBrand = () => {
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/brands",
            data: brandData,
            callback: addBrandCallback,
        });
    };
    return (
        <div>
            <div className="text-xl font-serif mb-4">Add Brand</div>
            <InputComponent
                label="Brand Name"
                type="text"
                name="name"
                placeholder="Enter Brand Name"
                inputClassName="w-[40%]"
                labelClassName="font-bold"
                value={brandData.name}
                onChange={handleInputChange}
            />
            <PrimaryButtonComponent
                label="Submit"
                icon="fa fa-bookmark-o"
                buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
                onClick={addBrand}
            />
        </div>
    );
}
