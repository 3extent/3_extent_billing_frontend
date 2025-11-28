import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { REPAIR_OPTIONS } from "./Constants";


function Repair() {
    const navigate = useNavigate();
    const navigateAddRepair = () => {
        navigate("/addrepair")
    }
    const rows = [
        { Brand: "hi" }
    ];
    return (
        <div>
            <CustomHeaderComponent
                name="List Of Repair Information"
                label="Add Repair"
                icon="fa fa-plus-circle"
                onClick={navigateAddRepair}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="mb-5">

            </div>
            <div className="h-[75vh]">
                <CustomTableCompoent
                    headers={REPAIR_OPTIONS}
                    rows={rows}
                />
            </div>
        </div>

    )
} export default Repair;
