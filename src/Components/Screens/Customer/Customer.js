import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { CUSTOMER_COLOUMS, CUSTOMER_TYPE_OPTIONS } from "./Constants";
export default function Customer() {
    const navigate=useNavigate();
    const navigateAddCustomer=()=>{
        navigate("/addcustomer")
    }
    const rows = [{
        "Customer Name": "Nikita Kadam",
        "Address": "Pune",
        "Contact No": "1234567765",
        "GST No": "27AAAPL1234C1ZV",
        "State": "Maharashtra",
        "Customer Type": "Regular",
    },
    {
        "Customer Name": "Nikita Kadam",
        "Address": "Pune",
        "Contact No": "1234567765",
        "GST No": "27AAAPL1234C1ZV",
        "State": "Maharashtra",
        "Customer Type": "Regular",
    }
    ];
    return (
        <div className="w-full">
            <CustomHeaderComponent
                name="List Of Customer Information"
                label="Add Customer"
                icon="fa fa-plus-circle"
                onClick={navigateAddCustomer}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="grid grid-cols-3 items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Customer Name"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                />
                <DropdownCompoent
                    options={CUSTOMER_TYPE_OPTIONS}
                    placeholder="Select Customer Type"
                />
            </div>
            <div>
                <CustomTableCompoent
                    headers={CUSTOMER_COLOUMS}
                    rows={rows}
                />
            </div>
        </div>
    );
}