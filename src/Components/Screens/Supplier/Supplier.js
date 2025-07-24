import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
function Supplier({ setSelectedMenu }) {
    const headers = [
        "No",
        "Supplier Name",
        "Company Name",
        "Address",
        "Contact No",
        "GST No",
        "Email",
        "State",
        "Balance",
        "Supplier Type",
    ];
    const rows = [
        {
            "No": "1",
            "Supplier Name": "nikita kadam",
            "Company Name": "Apple",
            "Address": "pune",
            "Contact No": "1234567890",
            "GST No": "27ABCDE1234F1Z5",
            "Email": "abc@example.com",
            "State": "Maharastra",
            "Balance": "70000",
            "Supplier Type": "wholesale",
        },
        {
            "No": "2",
            "Supplier Name": "shardul pawar",
            "Company Name": "Apple",
            "Address": "pune",
            "Contact No": "1234567890",
            "GST No": "27ABCDE1234F1Z5",
            "Email": "abc@example.com",
            "State": "Maharastra",
            "Balance": "80000",
            "Supplier Type": "wholesale",
        }
    ];
    const supplierTypes = ['a', 'b'];
    return (
        <div className="w-full">
            <CustomHeaderComponent
                name="List of Supplier Information"
                icon="fa fa-plus-circle"
                label="Add Supplier"
                onClick={() => setSelectedMenu("Add Supplier")}
               
            />
            <div className="grid grid-cols-4 items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Suppiler Name"
                />
                <DropdownCompoent
                    options={supplierTypes}
                    placeholder="Select Supplier Type"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                />
                <InputComponent
                    type="text"
                    placeholder="Company Name"
                />
            </div>
            <CustomTableCompoent
                headers={headers}
                rows={rows}
            />

        </div>
    );
}
export default Supplier;