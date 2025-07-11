import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
export default function Customer() {
    const headers = [
        "No",
        "Customer Name",
        "Address",
        "Contact No",
        "GST No",
        "State",
        "Balance",
        "Customer Type",
        "Bank",
        "Account No",
        "IFSC",
        "Rate",
        "Credit Amount"
    ];
    const rows = [{
        "No": "1",
        "Customer Name": "Nikita Kadam",
        "Address": "Pune",
        "Contact No": "1234567765",
        "GST No": "27AAAPL1234C1ZV",
        "State": "Maharashtra",
        "Balance": 60000,
        "Customer Type": "Regular",
        "Bank": "HDFC",
        "Account No": "1234567890",
        "IFSC": "HDFC0001234",
        "Rate": "18%",
        "Credit Amount": 5000
    },
    {
        "No": "2",
        "Customer Name": "Nikita Kadam",
        "Address": "Pune",
        "Contact No": "1234567765",
        "GST No": "27AAAPL1234C1ZV",
        "State": "Maharashtra",
        "Balance": 70000,
        "Customer Type": "Regular",
        "Bank": "HDFC",
        "Account No": "1234567890",
        "IFSC": "HDFC0001234",
        "Rate": "18%",
        "Credit Amount": 5000
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
                    headers={headers}
                    rows={rows}
                />
            </div>
        </div>
    );
}