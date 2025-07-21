import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
function Supplier() {   
    <SUPPLIER_COLUMNS/>
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
            <div className="text-xl font-serif">List Of Suppiler Information</div>
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