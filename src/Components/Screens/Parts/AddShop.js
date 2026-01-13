import { useNavigate } from "react-router-dom";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { useState } from "react";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { toast } from "react-toastify";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";

function AddShop() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shopData, setShopData] = useState({
        name: "",
        contact_number: "",
        address: "",
        state: "",
        gst_number: "",
        role: "PARTS_SHOP",
    });
    const [errors, setErrors] = useState({});
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setShopData({ ...shopData, [name]: value.toUpperCase() });
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleBack = () => {
        navigate(-1);
    };
    const handleValidation = () => {
        const newErrors = {};
        if (!shopData.name.trim()) newErrors.shop_name = "Shop name is required";
        if (!shopData.contact_number.trim()) newErrors.contact_number = "Contact number is required";
        if (!shopData.address.trim()) newErrors.address = "Address is required";
        if (!shopData.state.trim()) newErrors.state = "State is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const addShopCallback = (response) => {
        if (response.status === 200) {
            toast.success("Shop added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setShopData({
                name: "",
                contact_number: "",
                address: "",
                state: "",
                gst_number: "",
                role: "PARTS_SHOP",
            });
            navigate("/partshop");
        } else {
            const errorMsg = response?.data?.error || "Failed to add shop";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const addShopData = () => {
        if (!handleValidation()) return;
        apiCall({
            method: "POST",
            url: API_URLS.USERS,
            data: shopData,
            callback: addShopCallback,
            setLoading

        });
    };
    return (

        <div className="w-full">
            {loading && <Spinner />}
            <div className="text-xl font-serif mb-4">
                Add Shop
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Shop Name"
                    name="name"
                    placeholder="Shop Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={shopData.name}
                    onChange={handleInputChange}
                    error={errors.shop_name}
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
                    error={errors.contact_number}
                />

                <InputComponent
                    label="State"
                    name="state"
                    placeholder="State"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={shopData.state}
                    onChange={handleInputChange}
                    error={errors.state}
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
                    onClick={addShopData}
                />
            </div>
        </div>
    )

} export default AddShop;