import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { PARTS_OPTIONS } from "./Constants";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { useState } from "react";

function DevicePartsList() {
    const navigate = useNavigate();

    const navigateAddPart = () => {
        navigate("/addpart");
    };
    const [rows] = useState([
        {
            // "Shop Name": "ABC PARTS",
            // "Contact No": "9876543210",
            "Part Name": "abc",
        }
    ]);
    return (

        <div>
            <CustomHeaderComponent
                name="Device Parts List"
                label="Add Part"
                icon="fa fa-plus-circle"
                onClick={navigateAddPart}
            />
            <div className="mt-4"></div>
            <CustomTableCompoent
                headers={PARTS_OPTIONS}
                rows={rows}
                maxHeight="h-[65vh]"
            />
        </div>
    )

} export default DevicePartsList;