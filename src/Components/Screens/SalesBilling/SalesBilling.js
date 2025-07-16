import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
const headers = [
    "Sr.No",
    "Date",
    "IMEI NO",
    "Company Name",
    "Model Name",
    "Rate",
    "Grade",
    "Box",
    "Contact No"
];
const rows = [
    {
        "Sr.No": "1",
        "Date": "2025-07-10",
        "IMEI NO": "359876543210123",
        "Company Name": "Apple",
        "Model Name": "iPhone 6",
        "Rate": 500,
        "Grade": "A",
        "Box": "Yes",
        "Contact No": "9876543210",
    }
];
export default function SalesBilling() {
    return (
        <div>
            <div className='text-xl mb-6 font-serif'>Sales Billing</div>
            <div className="grid grid-cols-5 items-center gap-4">
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
                 <PrimaryButtonComponent
                    label="Save"
                    className="w-full mt-2"
                    icon="fa fa-cloud-download"
                />
            </div>
            <div>
                <CustomTableCompoent
                    headers={headers}
                    rows={rows}
                />
            </div>
            <div className="flex justify-end gap-4 mt-5">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-cloud-download"
                    className="w-full"
                />
                <PrimaryButtonComponent
                    label="Print"
                    icon="fa fa-print"
                    className="w-full"
                />
                <PrimaryButtonComponent
                    label="Cancel"
                    icon="fa fa-window-close"
                    className="w-full mr-3"
                />
            </div>
        </div>
    );
}