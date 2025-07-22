import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";

function AddCustomer() {
    const selectcustomertype = ["Regular", "A", "B"]
    return (
        <div>
            <div className='text-xl font-serif mb-4'>Add Customer</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Customer Name"
                    type="text"
                    placeholder="Customer Name"
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
                    label="State"
                    type="text"
                    placeholder="State"
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
                    label="Email ID"
                    type="text"
                    placeholder="Email ID"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Email ID"
                    type="text"
                    placeholder="Email ID"
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
                    label="Adhar No."
                    type="text"
                    placeholder="Adhar No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="PAN No."
                    type="text"
                    placeholder="PAN No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <DropdownCompoent
                    label="Customer Type"
                    options={selectcustomertype}
                    placeholder="Select customer type"
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                />

            </div>
            <div className="mt-4 flex justify-center">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-cloud-download"
                    className="w-[200px]"

                />
            </div>
        </div>
    )
} export default AddCustomer;