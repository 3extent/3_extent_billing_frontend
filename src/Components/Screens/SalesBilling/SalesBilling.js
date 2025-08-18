import { useEffect, useState } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { SALESBILLING_COLOUMNS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
export default function SalesBilling() {
    const [rows, setRows] = useState([
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
    const [imeiOptions, setImeiOptions] = useState([]);
    const [selectedImei, setSelectedImei] = useState("");
    const handleRateChange = (index, newRate) => {
        const updatedRows = [...rows];
        updatedRows[index]["Rate"] = Number(newRate);
        setRows(updatedRows);
    };
  useEffect(() => {
      getAllImeis();
    getsalesbillingAllData ();
     setSelectedImei("");
  }, [selectedImei]);
 const getAllImeis = () => {
        const url = "https://3-extent-billing-backend.vercel.app/api/products";
        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getImeisCallback,
        });
    };
const getImeisCallback = (response) => {
        if (response.status === 200) {
            const imeis = response.data.map(item => item.imei_number); 
            setImeiOptions(imeis);
        } else {
            console.error("IMEI numbers fetching error");
        }
    };
    const getsalesbillingCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const productFormattedRows = response.data.map((product, index) => ({
                "Sr.No": index + 1,
                "date": product.date,
                "IMEI NO": product.imei_number,
                "Company Name": typeof product.brand === 'object' ? product.brand.name : product.brand,
                "Model Name": typeof product.model === 'object' ? product.model.name : product.model,
                "Rate": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Box": product.box

            }))
            setRows(productFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getsalesbillingAllData = () => {
         let url = 'https://3-extent-billing-backend.vercel.app/api/products?';
        if (selectedImei) {
            url += `&imei_number=${selectedImei}`
        }
        apiCall({
            method: 'GET',
            url:url,
            data: {},
            callback: getsalesbillingCallBack,
        })
    }
    return (
        <div>
            <CustomHeaderComponent
                name="Sales Billing"
                label="Billing History"
                icon="fa fa-history"
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="flex items-center gap-4 mt-3">
                 <CustomDropdownInputComponent
                    label="IMEI No :"
                    dropdownClassName="w-full"
                    placeholder="Select IMEI No"
                    value={selectedImei}
                    onChange={(value) => setSelectedImei(value)}
                    options={imeiOptions}
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
                            buttonClassName="py-1 px-5 text-xl font-bold"
                        />
                        <PrimaryButtonComponent
                            label="Print"
                            icon="fa fa-print"
                            buttonClassName="py-1 px-5 text-xl font-bold"
                        />
                        <PrimaryButtonComponent
                            label="Cancel"
                            icon="fa fa-window-close"
                            buttonClassName="py-1 px-5 text-xl font-bold"
                        />
                    </div>
            
        
        </div>

    );
}