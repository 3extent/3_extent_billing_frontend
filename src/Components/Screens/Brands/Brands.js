import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";

function Brands() {
    const headers = [
        "No",
        "Brand Name",
        "No. of Models"
    ];
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
    const selectedBrands = ['apple', 'xiaomi'];
    const selectNumberOfModels = ['2', '1'];


    return (
        <div className='w-full'>
            <div className='text-xl font-serif'>Brands</div>
            <div className='flex items-center gap-4'>
                <InputComponent />

                <DropdownCompoent
                    options={selectedBrands}
                    placeholder="Select Brands"

                />
                <DropdownCompoent
                    options={selectNumberOfModels}
                    placeholder="Enter No Of Models"
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
} export default Brands;
