
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { BRANDS_COLOUMNS } from "./Constants";
function Brands({NavigateAddBrands}) {
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
                label="Add Brands"
                buttonclassName="py-1 text-sm"
                className="w-[full] mt-2 "
                icon="fa fa-plus-circle"
                onClick={NavigateAddBrands} />
            <div className='flex items-center gap-4'>
                <InputComponent
                type="text"
                placeholder="Enter Brand Name"
                inputClassName="w-full"
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
