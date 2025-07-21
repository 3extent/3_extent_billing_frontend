import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";

function AddSupplier({ setSelectedMenu }) {
    const selectSupplierType = ["A", "B", "Regular"];
    return (
        <div className="w-full">
            <div className='text-xl font-serif mb-4'>Add Supplier</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Supplier Name"
                    type="text"
                    placeholder="Supplier Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Firm Name"
                    type="text"
                    placeholder="Firm Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="State"
                    type="text"
                    placeholder="State"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Address"
                    type="text"
                    placeholder="Address"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Contact No 1"
                    type="text"
                    placeholder="Contact No 1"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Contact No 2"
                    type="text"
                    placeholder="Contact No 2"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Supplier Name"
                    type="text"
                    placeholder="Supplier Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="GST No."
                    type="text"
                    placeholder="GST No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Email ID."
                    type="text"
                    placeholder="Email ID."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <DropdownCompoent
                    label="Supplier Type"
                    options={selectSupplierType}
                    placeholder="Supplier Type"
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
            </div>
        </div>

    )
} export default AddSupplier;