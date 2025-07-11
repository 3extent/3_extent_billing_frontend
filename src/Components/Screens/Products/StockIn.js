import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";

function StockIn() {
    const selectType = ['Single Product', 'Multiple Product'];
    const selectGrade = ['a', 'b']
    const selectBox = ['yes', 'No']
    const selectSource = ['Amazon', 'NA', 'Messho']
    return (
        <div className='w-full'>
            <div className='text-xl font-serif'>Add Product</div>
            <div className='flex items-center gap-4'>
                <DropdownCompoent
                    label="Type of Stock in"
                    options={selectType}
                    placeholder="Select Type"
                />

            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                <InputComponent
                    label="Model Name"
                    type="text"
                    placeholder="Model Name"
                />
                <InputComponent
                    label="Date"
                    type="Date"
                    placeholder="Enter your Date"
                />
                <DropdownCompoent
                    label="Grade"
                    options={selectGrade}
                    placeholder="Select Grade"
                />
                <InputComponent
                    label="Buying Price"
                    type="text"
                    placeholder="Buying Purchase Price"
                />
                <InputComponent
                    label="Rate"
                    type="text"
                    placeholder="Rate Selling Price"
                />
                <InputComponent
                    label="IMEI"
                    type="text"
                    placeholder="IMEI"
                />
                <InputComponent
                    label="Engineer Name"
                    type="text"
                    placeholder="Engineer Name"
                />
                <InputComponent
                    label="QC Remark"
                    type="text"
                    placeholder="QC Remark"
                />
                <DropdownCompoent
                    label="Source"
                    options={selectSource}
                    placeholder="Select Source"
                />
                <DropdownCompoent
                    label="BOX"
                    options={selectBox}
                    placeholder="Select Box"
                />


            </div>
        </div>
    );
} export default StockIn;