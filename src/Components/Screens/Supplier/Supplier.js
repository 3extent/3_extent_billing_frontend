import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
function Supplier({ setSelectedMenu }) {   
    const rows = [
        {
            "Supplier Name": "Nikita Kadam",
            "Contact No": "1234567890",
            "GST No": "27ABCDE1234F1Z5",
            "State": "Maharastra",
            "Balance": "70000",
            "Supplier Type": "wholesale",
        },
        {
            "Supplier Name": "Shardul Pawar",
            "Contact No": "1234567890",
            "GST No": "27ABCDE1234F1Z5",
            "State": "Maharastra",
            "Balance": "80000",
            "Supplier Type": "wholesale",
        }
    ];
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
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                />
            </div>
            <CustomTableCompoent
                headers={SUPPLIER_COLUMNS}
                rows={rows}
            />

        </div>
    );
}
export default Supplier;