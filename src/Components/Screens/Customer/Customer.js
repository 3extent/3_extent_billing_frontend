import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { CUSTOMER_COLOUMS } from "./Constants";
export default function Customer({ setSelectedMenu }) {
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
    const CustomerTypes = ['a', 'b'];
    return (
        <div className="w-full">
            <CustomHeaderComponent
                name="List Of Customer Information"
                label="Add Customer"
                icon="fa fa-plus-circle"
                onClick={() => setSelectedMenu("Add Customer")}
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
                    options={CustomerTypes}
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