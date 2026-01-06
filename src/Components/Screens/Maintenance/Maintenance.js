import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { apiCall } from "../../../Util/AxiosUtils";
import { useCallback, useEffect, useState } from "react";
import { API_URLS } from "../../../Util/AppConst";
import { MAINTENANCE_COLOUMNS } from "./Constant";

function Maintenance() {
    const navigate = useNavigate();
    const navigateAddMaintanance = () => {
        navigate("/addExpense")
    }
    // const [rows, setRows] = useState([]);

    const rows = [
        {
            "Sr.NO": "1",
            "Expense Title": "AC Repair",
            "Paid By": "John Doe",
            Date: "2025-12-01",
            Amount: "500",
        },
        {
            "Sr.NO": "2",
            "Expense Title": "Plumbing Fix",
            "Paid By": "Jane Smith",
            Date: "2025-12-05",
            Amount: "300",
        },
    ];

    const getMaintenanceCallBack = (response) => {
        if (response.status === 200) {
            const maintananceFormattedRows = response.data.map((item, index) => ({
                "Sr.No": index + 1,
                Date: item.date,
                Title: item.title,
                Description: item.description,
                "Paid By": item.paid_by,
                // Date: item.date,
                Amount: item.amount,
                Action: (
                    <div className="flex justify-end">
                        <div
                            title="Edit"
                            onClick={() => navigate(`/addMaintanance/${item._id}`)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-pencil text-gray-700 text-sm" />
                        </div>
                    </div>
                ),
                id: item._id
            }));
            // setRows(maintananceFormattedRows);
        } else {
            console.log("Failed to fetch maintenance data");
        }
    };
    const getMaintenanceData = useCallback(() => {
        apiCall({
            method: "GET",
            url: `${API_URLS.MAINTENANCE}`,
            data: {},
            callback: getMaintenanceCallBack,
        });
    }, []);

    useEffect(() => {
        getMaintenanceData();
    }, [getMaintenanceData]);


    return (
        <div>
            <div className="mb-5">
                <CustomHeaderComponent
                    name="List of Maintanance Information"
                    icon="fa fa-plus-circle"
                    label="Add Expense"
                    onClick={navigateAddMaintanance}
                    buttonClassName="py-1 px-3 text-sm font-bold"

                />
            </div>
            <div className="h-[75vh]">
                <CustomTableCompoent
                    headers={MAINTENANCE_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    )
} export default Maintenance;