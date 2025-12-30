import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { SINGLE_CUSTOMER_INFO } from "./Constants";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { useState } from "react";

export default function SingleCustomerBillDetails() {
    const navigate = useNavigate();

    const [rows,setRows]=useState([]);

    const navigateCustomerScreen = () => {
        navigate(-1);
    }
    return (
        <div className="w-full">
            <CustomHeaderComponent
                name="List Of Single Customer Bill Details"
                label="Back"
                icon="fa fa-arrow-left"
                onClick={navigateCustomerScreen}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />

            <div className="h-[75vh]">
                <CustomTableCompoent
                    headers={SINGLE_CUSTOMER_INFO}
                    rows={rows}
                />
            </div>

        </div>
    );
}