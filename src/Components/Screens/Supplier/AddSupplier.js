import { useNavigate, useParams } from "react-router-dom";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_URLS } from "../../../Util/AppConst";
function AddSupplier() {
    const navigate = useNavigate();
    const { suppiler_id } = useParams();
    const handleBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        getSupplierData();
    }, [suppiler_id])
    const [supplierData, setSupplierData] = useState({
        name: "",
        firm_name: "",
        state: "",
        address: "",
        contact_number: "",
        contact_number2: "",
        gst_number: "",
        role: "SUPPLIER",
    });
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const uppercasedValue = value.toUpperCase();
        setErrors(prev => ({ ...prev, [name]: "" }));
        setSupplierData({ ...supplierData, [name]: uppercasedValue });
    };
    const addSupplierCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            toast.success("Supplier added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setSupplierData({
                name: "",
                firm_name: "",
                state: "",
                address: "",
                contact_number: "",
                contact_number2: "",
                gst_number: "",
                role: "SUPPLIER",
            });
            setTimeout(() => {
                navigate("/supplier");
            }, 2000);
        } else {
            const errorMsg = response?.data?.error || "Failed to add supplier";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        };
    }
    const handleValidation = () => {
        const newErrors = {};

        if (!supplierData.name?.trim()) {
            newErrors.name = "Supplier name is required";
        }
        if (!supplierData.firm_name?.trim()) {
            newErrors.firm_name = "Firm name is required";
        }
        if (!supplierData.address?.trim()) {
            newErrors.address = "Address is required";
        }
        if (!supplierData.state?.trim()) {
            newErrors.state = "State is required";
        }
        if (!supplierData.contact_number?.trim()) {
            newErrors.contact_number = "Contact number 1 is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveSupplier = (() => {
        if (!handleValidation()) {
            return;
        }
        if (suppiler_id) {
            editSupplierData();
        } else {
            addSupplierData();
        }
    })

    const saveCallback = (response) => {
        if (response.status === 200) {
            toast.success("Supplier updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/supplier");
        } else {
            const errorMsg = response?.data?.error || "Failed to update supplier";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        };
    }
    const addSupplierData = (() => {
        apiCall({
            method: "POST",
            url: API_URLS.SUPPLIER,
            data: supplierData,
            callback: addSupplierCallback,
            setLoading: setLoading,
        });
    })
    const editSupplierData = () => {
        apiCall({
            method: "PUT",
            url: `${API_URLS.SUPPLIER}/${suppiler_id}`,
            data: supplierData,
            callback: saveCallback,
            setLoading: setLoading,
        });
    }
    const getSupplierDataCallback = (response) => {
        if (response.status === 200) {
            setSupplierData({
                name: response.data.name, address: response.data.address,
                state: response.data.state, contact_number: response.data.contact_number, contact_number2: response.data.contact_number2, gst_number: response.data.gst_number,
                firm_name: response.data.firm_name,
            });
        } else {
            // error("Failed to fetch customer data");
        }
    }
    const getSupplierData = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.SUPPLIER}/${suppiler_id}`,
            data: {},
            callback: getSupplierDataCallback,
            setLoading: setLoading
        });
    }
    return (
        <div className="w-full">
            {loading && <Spinner />}
            <div className='text-xl font-serif mb-4'>{suppiler_id ? "Edit Supplier" : "Add Supplier"}</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Supplier Name"
                    type="text"
                    name="name"
                    placeholder="Supplier Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                />
                <InputComponent
                    name="firm_name"
                    label="Firm Name"
                    type="text"
                    placeholder="Firm Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.firm_name}
                    onChange={handleInputChange}
                    error={errors.firm_name}
                />
                <InputComponent
                    name="state"
                    label="State"
                    type="text"
                    placeholder="State"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.state}
                    onChange={handleInputChange}
                    error={errors.state}

                />
                <InputComponent
                    name="address"
                    label="Address"
                    type="text"
                    placeholder="Address"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.address}
                    onChange={handleInputChange}
                    error={errors.firm_address}
                />
                <InputComponent
                    name="contact_number"
                    label="Contact No 1"
                    type="text"
                    placeholder="Contact No 1"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.contact_number}
                    onChange={handleInputChange}
                    error={errors.contact_number}
                    maxLength={10}
                    numericOnly={true}
                />
                <InputComponent
                    name="contact_number2"
                    label="Contact No 2"
                    type="text"
                    placeholder="Contact No 2"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.contact_number2}
                    onChange={handleInputChange}
                    maxLength={10}
                    numericOnly={true}
                />
                <InputComponent
                    name="gst_number"
                    label="GST No."
                    type="text"
                    placeholder="GST No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.gst_number}
                    onChange={handleInputChange}
                    maxLength={15}
                />
            </div>
            <div className="mt-10 gap-5 flex justify-center">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-save"
                    onClick={saveSupplier}
                />
            </div>
        </div>
    )
} export default AddSupplier;