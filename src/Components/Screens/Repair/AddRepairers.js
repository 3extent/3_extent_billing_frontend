import { useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";

function AddRepairers() {
    const navigate = useNavigate();
    const [repairerData, setRepairerData] = useState({
        name: "",
        contact: "",
        role: "REPAIRER",
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRepairerData({ ...repairerData, [name]: value.toUpperCase() });
    };
    const addRepairerCallback = (response) => {
        if (response.status === 200) {
            console.log("Repairer added successfully!");
            setRepairerData({ name: "", contact: "", role: "REPAIRER" });
            navigate("/repairers");
        } else {
            console.error("Failed to add repairer", response?.data?.error);
        }
    };

    const saveRepairData = () => {
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
        <div>
            <InputComponent
                label="Repair Name"
                type="text"
                name="name"
                placeholder="Repair Name"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
                value={repairerData.name}
                onChange={handleInputChange}
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
            />
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