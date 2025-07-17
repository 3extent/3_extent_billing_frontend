import { useState } from "react";
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
    // const [imei, setImei] = useState("");
    // const [customerName, setCustomerName] = useState("");
    // const [contactNo, setContactNo] = useState("");
    // const [date, setDate] = useState("");
    // const [filteredRow, setFilteredRow] = useState(null);
    // const handleImeiChange = (value) => {
    //     setImei(value);

    //     const matchedRow = rows.find(row => row["IMEI NO"] === value);
    //     setFilteredRow(matchedRow || null);
    // };
    return (
        <div>
             <CustomHeaderComponent
                            name="Sales Billing"
                            label="Billing History"
                            className="w-full mt-2 py-1"
                            icon="fa fa-plus-circle" />
            {/* <div className='text-xl mb-6 font-serif'>Sales Billing</div> */}
            <div className="grid grid-cols-5 items-center gap-4">
                <InputComponent
                    label="IMEI No :"
                    type="text"
                    placeholder="Scan IMEI No"
                    // value={imei}
                    // onChange={(e) => handleImeiChange(e.target.value)}
                />
                <InputComponent
                    label="Customer Name :"
                    type="text"
                    placeholder="Enter Customer Name"
                    // value={customerName}
                    // onChange={(e) => setCustomerName(e.target.value)}
                />
                <InputComponent
                    label="Contact No:"
                    type="text"
                    placeholder="contact No"
                    // value={contactNo}
                    // onChange={(e) => setContactNo(e.target.value)}
                />
                <InputComponent
                    label="Date :"
                    type="Date"
                    // placeholder=""
                    // value={date}
                    // onChange={(e) => setDate(e.target.value)}
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
            {/* <div className="mt-5">
                <CustomTableCompoent
                    headers={headers}
                    rows={filteredRow ? [filteredRow] : []}
                />
                {!filteredRow && imei && (
                    <p className="text-red-500 mt-2">No record found for this IMEI.</p>
                )}
            </div> */}
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