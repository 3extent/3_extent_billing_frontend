import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { PART_SHOP_OPTIONS } from "./Constants";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";

function PartShop() {
    const navigate = useNavigate();

    const navigateAddShop = () => {
        navigate("/addshop");
    };
    const [rows] = useState([
        {
            "Shop Name": "ABC PARTS",
            // "Owner Name": "RAHUL",
            "Contact": "9876543210",
            "State": "MAHARASHTRA",
            "GST Number": "27ABCDE1234F1Z5",
            "Actions": "Edit",
            id: 1
        }
    ]);
    return (
        <div className="w-full">
            <CustomHeaderComponent
                name="Part Shop List"
                label="Add Shop"
                icon="fa fa-plus-circle"
                onClick={navigateAddShop}
            />
            <div className="flex items-center gap-4 mb-5">
                <InputComponent
                    type="text"
                    placeholder="Shop Name"
                    inputClassName="w-[190px]"
                />

                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    numericOnly
                    maxLength={10}
                    inputClassName="w-[190px]"
                />
            </div>
            <CustomTableCompoent
                headers={PART_SHOP_OPTIONS}
                rows={rows}
                maxHeight="h-[65vh]"
            />
        </div >
    )

} export default PartShop;