import { useNavigate } from "react-router-dom";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { useState } from "react";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";

function AddShop() {
    const navigate = useNavigate();

    const [shopData, setShopData] = useState({
        shop_name: "",
        contact_number: "",
        address: "",
        state: "",
        gst_number: "",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setShopData({ ...shopData, [name]: value.toUpperCase() });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (

        <div className="w-full">
            <div className="text-xl font-serif mb-4">
                Add Shop
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Shop Name"
                    name="shop_name"
                    placeholder="Shop Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={shopData.shop_name}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="Contact No"
                    name="contact_number"
                    placeholder="Contact No"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={shopData.contact_number}
                    onChange={handleInputChange}
                    numericOnly
                    maxLength={10}
                />

                <InputComponent
                    label="State"
                    name="state"
                    placeholder="State"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={shopData.state}
                    onChange={handleInputChange}
                />

                <InputComponent
                    label="Address"
                    name="address"
                    placeholder="Address"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={shopData.address}
                    onChange={handleInputChange}
                />

                <InputComponent
                    label="GST No."
                    name="gst_number"
                    placeholder="GST No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={shopData.gst_number}
                    onChange={handleInputChange}
                    maxLength={15}
                />
            </div>

            <div className="mt-5 flex justify-center gap-4">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                />
            </div>
        </div>
    )

} export default AddShop;