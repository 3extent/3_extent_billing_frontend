import { useNavigate } from "react-router-dom";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { BRANDS_COLOUMNS } from "./Constants";
function Brands() {
    <BRANDS_COLOUMNS/>
    const rows = [
        {
            "No": 1,
            "Brand Name": "Samsung",
            "No. of Models": 2,
        },
        {
            "No": 2,
            "Brand Name": "Apple",
            "No. of Models": 1,
        }
    ];
    return (
        <div className='w-full'>
            <CustomHeaderComponent
                name="Brands"
                label="Add"
                className="w-full mt-2 py-1"
                icon="fa fa-plus-circle" />
            <div className='flex items-center gap-4'>
                <InputComponent
                type="text"
                placeholder="Enter Brands Name"
                />
 
            </div>
            <div>
                <CustomTableCompoent
                    headers={BRANDS_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    );
} export default Brands;
