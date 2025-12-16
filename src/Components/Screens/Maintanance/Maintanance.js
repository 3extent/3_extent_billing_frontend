import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { MANTAINANCE_COLOUMNS } from "./Constants";

function Maintanance() {
    const navigate = useNavigate();
    const navigateAddMaintanance = () => {
        navigate("/addMaintanance")
    }
    const rows = [
        {
            "Sr.NO": "1",
            Title: "AC Repair",
            "Paid By": "John Doe",
            Date: "2025-12-01",
            Amount: "500",
        },
        {
            "Sr.NO": "2",
            Title: "Plumbing Fix",
            "Paid By": "Jane Smith",
            Date: "2025-12-05",
            Amount: "300",
        },
    ];

    return (
        <div>
            <div className="mb-5">
                <CustomHeaderComponent
                    name="List of Maintanance Information"
                    icon="fa fa-plus-circle"
                    label="Add Expance"
                    onClick={navigateAddMaintanance}
                    buttonClassName="py-1 px-3 text-sm font-bold"

                />
            </div>
            <div className="h-[75vh]">
                <CustomTableCompoent
                    headers={MANTAINANCE_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    )
} export default Maintanance;