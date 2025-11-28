import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";

function AddRepair() {
    return (
        <div className="grid grid-cols-3 mt-2 gap-x-5 gap-y-1">
            <CustomDropdownInputComponent
                name="Brand Name"
                dropdownClassName="w-[80%]"
                placeholder="Enter Brand Name"
                labelClassName="font-serif font-bold"
            />
            <CustomDropdownInputComponent
                name="Model Name"
                dropdownClassName="w-[80%]"
                placeholder="Enter Model Name"
                labelClassName="font-serif font-bold"
            />
            <DropdownCompoent
                label="Grade"
                name="grade"
                placeholder="Select Grade"
                className="w-[80%]"
                labelClassName="font-serif font-bold"

            />
            <InputComponent
                label="Purchase Price"
                type="text"
                name="purchase_price"
                placeholder="Buying Purchase Price"
                numericOnly={true}
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <InputComponent
                label="Sales Price"
                type="text"
                name="sales_price"
                placeholder="Rate Selling Price"
                numericOnly={true}
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <InputComponent
                label="IMEI"
                type="text"
                name="imei_number"
                placeholder="IMEI"
                maxLength={15}
                numericOnly={true}
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"

            />
            <InputComponent
                label="Enginner Name "
                type="text"
                name="engineer_name"
                placeholder="Enginner Name"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <InputComponent
                label="QC Remark"
                type="text"
                name="qc_remark"
                placeholder="QC Remark"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <DropdownCompoent
                label="Supplier"
                name="supplier_name"
                placeholder="Select Supplier"
                className="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <DropdownCompoent
                label="Accessories"
                name="accessories"
                placeholder="Select Box"
                className="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <div className="col-span-3 mt-5 flex justify-center gap-4">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                />
                <PrimaryButtonComponent
                    label="Delete"
                    icon="fa fa-trash"
                    buttonClassName="border border-red-500 !text-red-500 bg-transparent hover:bg-red-500 hover:text-white"
                />

            </div>
        </div>

    )
} export default AddRepair;