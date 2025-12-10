import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { REPAIRERS_OPTIONS } from "./Constants";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { apiCall } from "../../../Util/AxiosUtils";
import { useCallback, useEffect, useState } from "react";
import { API_URLS } from "../../../Util/AppConst";

function Repairers() {
    const navigate = useNavigate();
    const navigateAddRepairers = () => {
        navigate("/addrepairers")
    }
    const [rows, setRows] = useState([]);
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
            console.error("Failed to fetch repairers");
        }
    }, []);
    const getAllRepairers = useCallback(() => {
        const url = `${API_URLS.USERS}?role=REPAIRER`;
        apiCall({
            method: "GET",
            // url: API_URLS.USERS,
            url: url,
            data: {},
            callback: getRepairersCallback,
        });
    }, [getRepairersCallback]);

    useEffect(() => {
        getAllRepairers();
    }, [getAllRepairers]);

    return (
        <div>
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