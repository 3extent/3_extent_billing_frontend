import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URLS } from "../../../Util/AppConst";
function AddCustomer() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { customer_id } = useParams();
    const [errors, setErrors] = useState("");
    const handleBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        if (customer_id) {
            getCustomerData();
        }
    }, [customer_id]);

    const [customerData, setCustomerData] = useState({
        name: "",
        firm_name: "",
        address: "",
        state: "",
        contact_number: "",
        gst_number: "",
        pan_number: "",
        role: "CUSTOMER",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const uppercasedValue = value.toUpperCase();
        setErrors(prev => ({ ...prev, [name]: "" }));
        setCustomerData({ ...customerData, [name]: uppercasedValue });
    };
    const addCustomerCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            toast.success("Customer added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setCustomerData({
                name: "",
                firm_name: "",
                address: "",
                state: "",
                contact_number: "",
                gst_number: "",
                pan_number: "",
                role: "CUSTOMER",
            });
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } else {
            const errorMsg = response?.data?.error || "Failed to add customer";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const saveCallback = (response) => {
        if (response.status === 200) {
            toast.success("Customer updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate(-1);
        } else {
            const errorMsg = response?.data?.error || "Failed to update customer";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const handleValidation = () => {
        const newErrors = {};
        if (!customerData.name.trim()) {
            newErrors.name = "Customer name is required";
        }
        if (!customerData.contact_number.trim()) {
            newErrors.contact_number = "Contact no is required";
        }
        if (!customerData.address.trim()) {
            newErrors.address = "Address is required";
        }
        if (!customerData.firm_name.trim()) {
            newErrors.firm_name = "shop name is required";
        }
        if (!customerData.state.trim()) {
            newErrors.state = "State is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const addCustomer = () => {
        if (!handleValidation()) {
            return;
        }

        if (customer_id) {
            editCustomerData();
        } else {
            addCustomerData();
        }
    }
    const addCustomerData = () => {
        apiCall({
            method: "POST",
            url: API_URLS.USERS,
            data: customerData,
            callback: addCustomerCallback,
            setLoading: setLoading

        });
    }
    const editCustomerData = () => {
        apiCall({
            method: "PUT",
            url: `${API_URLS.USERS}/${customer_id}`,
            data: customerData,
            callback: saveCallback,
            setLoading: setLoading,
        });
    }
    const getCustomerDataCallback = (response) => {
        if (response.status === 200) {
            setCustomerData({
                name: response.data.name, address: response.data.address,
                firm_name: response.data.firm_name || "",
                state: response.data.state, contact_number: response.data.contact_number, gst_number: response.data.gst_number,
                pan_number: response.data.pan_number,
            });
        } else {
            // error("Failed to fetch customer data");
        }
    }

    const getCustomerData = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.USERS}/${customer_id}`,
            data: {},
            callback: getCustomerDataCallback,
            setLoading: setLoading
        });
    }
    return (
        <div>
            {loading && <Spinner />}
            <div className='text-xl font-serif mb-4'>{customer_id ? "Edit Customer" : "Add Customer"}</div>
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
                    error={errors.name}
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
                    error={errors.address}
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
                    error={errors.state}
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
                    error={errors.contact_number}
                    maxLength={10}
                    numericOnly={true}
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
                    maxLength={15}
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
                    maxLength={10}
                />
                <InputComponent
                    label="Shop Name"
                    type="text"
                    name="firm_name"
                    placeholder="Shop Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={customerData.firm_name}
                    onChange={handleInputChange}
                    error={errors.firm_name}
                />

            </div>
            <div className="mt-10 flex justify-center gap-5">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    onClick={addCustomer}
                />
            </div>
        </div>
    )
} export default AddCustomer;
