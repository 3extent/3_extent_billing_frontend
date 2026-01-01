import { useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function AddRepairers() {
    const navigate = useNavigate();
    const { repairer_id } = useParams();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [repairerData, setRepairerData] = useState({
        name: "",
        firm_name: "",
        state: "",
        address: "",
        contact_number: "",
        gst_number: "",
        role: "REPAIRER",
    });
    useEffect(() => {
        if (repairer_id) {
            getRepairerData();
        }
    }, [repairer_id]);
    const getRepairerDataCallback = (response) => {
        if (response.status === 200) {
            setRepairerData({
                name: response.data.name,
                firm_name: response.data.firm_name,
                state: response.data.state,
                address: response.data.address,
                contact_number: response.data.contact_number,
                gst_number: response.data.gst_number,
                role: "REPAIRER",
            });
        }
    };

    const getRepairerData = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.USERS}/${repairer_id}`,
            data: {},
            callback: getRepairerDataCallback,
            setLoading: setLoading,
        });
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const uppercasedValue = value.toUpperCase();
        setErrors(prev => ({ ...prev, [name]: "" }));
        setRepairerData({ ...repairerData, [name]: uppercasedValue });
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
        if (repairer_id) {
            editRepairerData();
        } else {
            addRepairerData();
        }
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
    const addRepairerData = () => {
        apiCall({
            method: "POST",
            url: API_URLS.USERS,
            data: repairerData,
            callback: addRepairerCallback,
            setLoading: setLoading,
        });
    };
    const editRepairerCallback = (response) => {
        if (response.status === 200) {
            toast.success("Repairer updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/repairers");
        } else {
            const errorMsg = response?.data?.error || "Failed to update repairer";
            toast.error(errorMsg);
        }
    };

    const editRepairerData = () => {
        apiCall({
            method: "PUT",
            url: `${API_URLS.USERS}/${repairer_id}`,
            data: repairerData,
            callback: editRepairerCallback,
            setLoading: setLoading,
        });
    };


    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="w-full">
            {loading && <Spinner />}
            <div className='text-xl font-serif mb-4'>
                {repairer_id ? "Edit Repairer" : "Add Repairer"}
            </div>
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