import { useState } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { SALESBILLING_COLOUMNS } from "./Constants";
export default function SalesBilling() {
    const [rows, setRows] = useState([
        {
            "Sr.No": "1",
            "Date": "2025-07-10",
            "IMEI NO": "359876543210123",
            "Company Name": "Apple",
            "Model Name": "iPhone 6",
            "Rate": 500,
            "Purchase Price": 1000,
            "Grade": "A",
            "Box": "Yes",
            "Contact No": "9876543210",
        },
        {
            "Sr.No": "1",
            "Date": "2025-07-10",
            "IMEI NO": "359876543210123",
            "Company Name": "Apple",
            "Model Name": "iPhone 6",
            "Rate": 500,
            "Purchase Price": 1000,
            "Grade": "A",
            "Box": "Yes",
            "Contact No": "9876543210",
        }
    ]);
    const [hiddenColumns, setHiddenColumns] = useState([
        "Purchase Price",
        "Sale Price"
    ]);
    const [dynamicHeaders, setDynamicHeaders] = useState(() => {
        return SALESBILLING_COLOUMNS.filter(
            (col) => !["Purchase Price"].includes(col)
        );
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleColumn = (columnName) => {
        if (dynamicHeaders.includes(columnName)) {
            setDynamicHeaders(dynamicHeaders.filter(col => col !== columnName));
            setHiddenColumns([...hiddenColumns, columnName]);
        } else {
            setDynamicHeaders([...dynamicHeaders, columnName]);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        }
    };
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const handleRateChange = (index, newRate) => {
        const updatedRows = [...rows];
        updatedRows[index]["Rate"] = Number(newRate);
        setRows(updatedRows);
    };
    return (
        <div>
            <CustomHeaderComponent
                name="Sales Billing"
                label="Billing History"
                buttonclassName="py-1 text-sm"
                icon="fa fa-plus-circle" />
            <div className="flex items-center gap-4 mt-3">
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
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <PrimaryButtonComponent
                    label="Save"
                    buttonclassName="mt-2 w-[200px]"
                    icon="fa fa-cloud-download"
                />
            </div>
            <div className="relative mt-4 mb-2">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-3 py-1 border rounded hover:bg-gray-200"
                    title="Show columns"
                >
                    <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                </button>
                {showDropdown && (
                    <div className="absolute bg-white border shadow-md mt-1 rounded w-48 z-10 max-h-48 overflow-auto">
                        {["Purchase Price"].map((col) => (
                            <label
                                key={col}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={dynamicHeaders.includes(col)}
                                    onChange={() => toggleColumn(col)}
                                    className="mr-2"
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                                />
                                {col}
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <CustomTableCompoent
                    headers={dynamicHeaders}
                    rows={rows}
                    onRateChange={handleRateChange}
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