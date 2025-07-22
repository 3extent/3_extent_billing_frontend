import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { CUSTOMER_COLOUMS } from "./Constants";
export default function Customer() {
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
    const CostomerTypes = ['a', 'b'];
    return (
        <div className="w-full">
            <div className="text-xl font-serif">List Of Customer Information</div>
            <div className="flex items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Customer Name"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                />
                <DropdownCompoent
                    options={CostomerTypes}
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