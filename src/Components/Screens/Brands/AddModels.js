import { useEffect, useState } from "react";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall } from "../../../Util/AxiosUtils";
export default function AddModels() {
    const [brandOptions, setBrandOptions] = useState([]);
    useEffect(() => {
            getBrandsAllData();
        }, []);
     const getBrandsAllData = () => {
            let url = "https://3-extent-billing-backend.vercel.app/api/brands";
            apiCall({
                method: 'GET',
                url: url,
                data: {},
                callback: getBrandsCallBack,
            })
        };
        const getBrandsCallBack = (response) => {
            console.log('response: ', response);
            if (response.status === 200) {
                const brands = response.data.map(brand=>brand.name);
                setBrandOptions(brands);
                console.log('brands: ', brands);
            } else {
                console.log("Error");
            }
        }
    return (
        <div>
            <div className="text-xl font-serif mb-4">Add Model</div>
            <div className="grid grid-cols-2 ">
                <CustomDropdownInputComponent
                    name="Brand Name"
                    placeholder="Enter a brand"
                    dropdownClassName="w-[90%]" 
                    options={brandOptions}/>
                <InputComponent
                    label="Model Name"
                    labelClassName="font-bold"
                    type="text"
                    placeholder="Enter Model Name"
                    inputClassName="w-[90%]"
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