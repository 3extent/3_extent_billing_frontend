import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { REPAIRERS_OPTIONS } from "./Constants";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { apiCall } from "../../../Util/AxiosUtils";
import { useCallback, useEffect, useState } from "react";
import { API_URLS } from "../../../Util/AppConst";
import { toast } from "react-toastify";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";

function Repairers() {
    const navigate = useNavigate();
    const navigateAddRepairers = () => {
        navigate("/addrepairers")
    }
    const [rows, setRows] = useState([]);
    const [repairerName, setRepairerName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const getRepairersCallback = useCallback((response) => {
        if (response.status === 200) {
            const RepairedFormattedRows = response.data.map((repairer) => ({
                "Repairer Name": repairer.name,
                "Firm Name": repairer.firm_name,
                "GST Number": repairer.gst_number,
                "Contact": repairer.contact_number,
                "State": repairer.state,
                "Address": repairer.address,
                id: repairer._id
            }));
            setRows(RepairedFormattedRows);
        } else {
            toast.error("Failed to fetch repairers");
        }
    }, []);
    // const getAllRepairers = useCallback(() => {
    const getAllRepairers = useCallback(({ repairerName, contactNo } = {}) => {
        let url = `${API_URLS.USERS}?role=REPAIRER`;

        if (repairerName) url += `&name=${repairerName}`;
        if (contactNo) url += `&contact_number=${contactNo}`;
        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getRepairersCallback,
        });
    }, [getRepairersCallback]);
    const handleSearchFilter = () => {
        getAllRepairers({ repairerName, contactNo });
    }

    useEffect(() => {
        getAllRepairers();
    }, [getAllRepairers]);
    const handleResetFilter = () => {
        setRepairerName('');
        setContactNo('');
        getAllRepairers({});
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-5">
                <InputComponent
                    type="text"
                    placeholder="Repairer Name"
                    value={repairerName}
                    onChange={(e) => setRepairerName(e.target.value)}
                    inputClassName="w-[190px]"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    numericOnly={true}
                    maxLength={10}
                    inputClassName="w-[190px]"
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    buttonClassName="mt-5 py-1 px-5"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    buttonClassName="mt-5 py-1 px-5"
                    onClick={handleResetFilter}
                />
            </div>

            <CustomHeaderComponent
                name="List Of Repair Information"
                label="Add Repairer"
                icon="fa fa-plus-circle"
                onClick={navigateAddRepairers}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="h-[75vh] mt-5">
                <CustomTableCompoent
                    headers={REPAIRERS_OPTIONS}
                    rows={rows}
                />
            </div>
        </div>
    )
} export default Repairers;