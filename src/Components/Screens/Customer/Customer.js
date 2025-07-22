import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
export default function Customer({ navigateAddCustomer }) {
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
        "Credit Amount",
        "Purchase Price"
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
        "Credit Amount": 5000,
        "Purchase Price": 3000
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
        "Credit Amount": 5000,
        "Purchase Price": 3000
    }
    ];
    const CustomerTypes = ['a', 'b'];
    return (
        <div className="w-full">
            {/* <div className="text-xl font-serif">List Of Customer Information</div> */}
            <CustomHeaderComponent
                name="List Of Customer Information"
                label="Add Customer"
                icon="fa fa-plus-circle"
                onClick={navigateAddCustomer}
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
                    headers={headers}
                    rows={rows}
                />
            </div>
        </div>
    );
}