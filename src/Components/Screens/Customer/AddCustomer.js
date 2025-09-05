import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { CUSTOMER_TYPE_OPTIONS } from "./Constants";
import { useNavigate } from "react-router-dom";

function AddCustomer() {
    const [loading, setLoading] = useState(false); 
      const navigate = useNavigate();
      const handleBack = () => {
    navigate(-1);
};
    const [customerData, setCustomerData] = useState({
        name: "",
        address: "",
        state: "",
        contact_number: "",
        gst_number: "",
        pan_number: "",
        role: "CUSTOMER",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCustomerData({ ...customerData, [name]: value });
    };
    const addCustomerCallback = (response) => {
         navigate("/customer");
        console.log('response: ', response);
        if (response.status === 200) {
            setCustomerData({
                name: "",
                address: "",
                state: "",
                contact_number: "",
                gst_number: "",
                pan_number: "",
                role: "CUSTOMER",
            });
        } else {
            console.log("Error");
        }
    };
    const addCustomer = () => {
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/users",
            data: customerData,
            callback: addCustomerCallback,
            setLoading:setLoading

        });
    };
    return (
        <div>
            {loading && <Spinner/>}
            <div className='text-xl font-serif mb-4'>Add Customer</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Customer Name"
                    type="text"
                    name="name"
                    placeholder="Customer Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={customerData.name}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="Address"
                    type="text"
                    name="address"
                    placeholder="Address"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={customerData.address}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="State"
                    type="text"
                    name="state"
                    placeholder="State"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={customerData.state}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="Contact No "
                    type="text"
                    name="contact_number"
                    placeholder="Contact No "
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={customerData.contact_number}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="GST No."
                    type="text"
                    name="gst_number"
                    placeholder="GST No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={customerData.gst_number}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="PAN No."
                    type="text"
                    name="pan_number"
                    placeholder="PAN No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={customerData.pan_number}
                    onChange={handleInputChange}
                />

            </div>
            <div className="mt-4 flex justify-center">
                 <PrimaryButtonComponent
                                label="Back"
                                icon="fa fa-arrow-left"
                                buttonClassName="mt-2 py-1 px-5 mr-10 text-xl font-bold"
                                onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
                    onClick={addCustomer}
                />
            </div>
        </div>
    )
} export default AddCustomer;