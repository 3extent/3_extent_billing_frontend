import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
const headers = [
    "Sr.No",
    "IMEI NO",
    "Company Name",
    "Model Name",
    "Rate",
    "Grade",
    "Box",
    "Date",
    "Contact No",
    "Qty",
    "Total Price"
];
const rows = [
    {
        "Sr.No": "1",
        "IMEI NO": "359876543210123",
        "Company Name": "Apple",
        "Model Name": "iPhone 6",
        "Rate": 500,
        "Grade": "A",
        "Box": "Yes",
        "Date": "2025-07-10",
        "Contact No": "9876543210",
        "Qty": 1,
        "Total Price": 500
    }
];
export default function SellsBilling() {
    return (
        <div>
            <div className='text-xl mb-2 font-serif'>Sales Billing</div>
            <div className="flex items-center gap-4  ">
                <InputComponent
                    label="IMEI No :"
                    type="text"
                    placeholder="Scan IMEI No"
                />
                <InputComponent
                    label="Customer Name :"
                    type="text"
                    placeholder="Enter Customer Name"
                />
                <InputComponent
                    label="Contact No:"
                    type="text"
                    placeholder="contact No"
                />
                <InputComponent
                    label="Date :"
                    type="Date"
                    placeholder=""
                />
                <button className="px-4 py-3 bg-white mt-2 rounded" >Add Product <i class="fa fa-plus-square" aria-hidden="true"></i> </button>
            </div>
            <div>
                <CustomTableCompoent
                    headers={headers}
                    rows={rows}
                />
            </div>
            <div className="flex justify-evenly gap-4 mt-5">
                <PrimaryButtonComponent
                    label="Save"
                />
                <PrimaryButtonComponent
                    label="Print"
                />
                <PrimaryButtonComponent
                    label="Cancel"
                />
            </div>
        </div>
    );
}