import { useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddRepairers() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [repairerData, setRepairerData] = useState({
        name: "",
        firm_name: "",
        state: "",
        address: "",
        contact_number: "",
        gst_number: "",
        role: "REPAIRER",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const uppercasedValue = value.toUpperCase();
        setErrors(prev => ({ ...prev, [name]: "" }));
        setRepairerData({ ...repairerData, [name]: uppercasedValue });
    };
    const addRepairerCallback = (response) => {
        if (response.status === 200) {
            toast.success("Repairer added successfully!");
            setRepairerData({
                name: "",
                firm_name: "",
                state: "",
                address: "",
                contact_number: "",
                gst_number: "",
                role: "REPAIRER",
            });
            navigate("/repairers");
        } else {
            toast.error("Failed to add repairer", response?.data?.error);
        }
    };
    const handleValidation = () => {
        const newErrors = {};

        if (!repairerData.name.trim()) {
            newErrors.name = "Repairer name is required";
        }
        if (!repairerData.firm_name.trim()) {
            newErrors.firm_name = "Firm name is required";
        }
        if (!repairerData.address.trim()) {
            newErrors.address = "Address is required";
        }
        if (!repairerData.state.trim()) {
            newErrors.state = "State is required";
        }
        if (!repairerData.contact_number.trim()) {
            newErrors.contact_number = "Contact number is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveRepairData = () => {
        if (!handleValidation()) {
            return;
        }
        apiCall({
            method: 'POST',
            url: API_URLS.USERS,
            data: repairerData,
            callback: addRepairerCallback,
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="w-full">
            <div className='text-xl font-serif mb-4'>Add Repairers</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Repair Name"
                    type="text"
                    name="name"
                    placeholder="Repair Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={repairerData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                />
                <InputComponent
                    name="contact_number"
                    label="Contact No "
                    type="text"
                    placeholder="Contact No "
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={repairerData.contact_number}
                    onChange={handleInputChange}
                    maxLength={10}
                    numericOnly={true}
                    error={errors.contact_number}
                />
                <InputComponent
                    name="firm_name"
                    label="Firm Name"
                    type="text"
                    placeholder="Firm Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={repairerData.firm_name}
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
                    value={repairerData.state}
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
                    value={repairerData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                />
                <InputComponent
                    name="gst_number"
                    label="GST No."
                    type="text"
                    placeholder="GST No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={repairerData.gst_number}
                    onChange={handleInputChange}
                    maxLength={15}
                    error={errors.gst_number}
                />
            </div>
            <div className="col-span-3 mt-5 flex justify-center gap-4">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    onClick={saveRepairData}
                />
            </div>
        </div>


    )
} export default AddRepairers;