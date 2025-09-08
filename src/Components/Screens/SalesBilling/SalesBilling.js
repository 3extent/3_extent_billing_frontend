import { useEffect, useState } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { SALESBILLING_COLOUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import { useNavigate } from "react-router-dom";
export default function SalesBilling() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hiddenColumns, setHiddenColumns] = useState([
        "Purchase Price",
        "QC-Remark"
    ]);
    const [dynamicHeaders, setDynamicHeaders] = useState(() => {
        return SALESBILLING_COLOUMNS.filter(
            (col) => !["Purchase Price", "QC-Remark"].includes(col)
        );
    });
    const navigate = useNavigate();
    const navigateBillingHistory = () => {
        navigate("/billinghistory")
    }
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const toggleColumn = (columnName) => {
        if (dynamicHeaders.includes(columnName)) {
            setDynamicHeaders(dynamicHeaders.filter(col => col !== columnName));
            setHiddenColumns([...hiddenColumns, columnName]);
        } else {
            setDynamicHeaders([...dynamicHeaders, columnName]);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        }
    };
    const [imeiOptions, setImeiOptions] = useState([]);
    const [selectedImei, setSelectedImei] = useState("");
    const [contactNoOptions, setContactNoOptions] = useState([]);
    const [selectedContactNo, setSelectedContactNo] = useState("");
    const [customers, setCustomers] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const handleRateChange = (index, newRate) => {
        const updatedRows = [...rows];
        updatedRows[index]["Rate"] = Number(newRate);
        setRows(updatedRows);
    };
    useEffect(() => {
        getAllImeis();
        getCustomerAllData();
    }, []);
    useEffect(() => {
        if (selectedImei.length === 15) {
            getsalesbillingAllData();
        }
    }, [selectedImei]);
    const getCustomerAllData = () => {
        const url = 'https://3-extent-billing-backend.vercel.app/api/users?role=CUSTOMER';
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getCustomersCallback,
            setLoading: setLoading
        });
    };
    const getCustomersCallback = (response) => {
        if (response.status === 200) {
            setCustomers(response.data);
            const contactNos = response.data.map(customer => customer.contact_number);
            setContactNoOptions(contactNos);
        } else {
            console.error("Customer contact numbers fetching error");
        }
    };
    const handleContactNoChange = (value) => {
        setSelectedContactNo(value);
        if (!value) {
            setCustomerName("");
            return;
        }
        const customer = customers.find(customer => customer.contact_number === value);
        setCustomerName(customer ? customer.name : "");
    };
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
                "Sr.No": rows.length + index + 1,
                "date": product.createdAt,
                "IMEI NO": product.imei_number,
                "Brand": typeof product.brand === 'object' ? product.brand.name : product.brand,
                "Model": typeof product.model === 'object' ? product.model.name : product.model,
                "Rate": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Box": product.box,
                "QC-Remark": product.qc_remark
            }));
            const existingImeis = rows.map(row => row["IMEI NO"]);
            const newUniqueRows = productFormattedRows.filter(
                row => !existingImeis.includes(row["IMEI NO"])
            );
            if (newUniqueRows.length > 0) {
                setRows(Rows => [...Rows, ...newUniqueRows]);
            }
            setSelectedImei("");
            setCustomerName("");
            setSelectedContactNo("");
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
            url: url,
            data: {},
            callback: getsalesbillingCallBack,
            setLoading: setLoading
        })
    }
    console.log("rows", rows);
    const billsData = {
        customer_name: customerName,
        contact_number: selectedContactNo,
        products: rows.map((row) => ({
            imei_number: row["IMEI NO"],
            rate: row["Rate"],
        })),
    };
    const billsCallback = (response) => {
        console.log("response: ", response);
        if (response.status === 200) {
            alert("Bill saved successfully!");
            setRows({});
            setSelectedImei("");
            setCustomerName("");
            setSelectedContactNo("");
        } else {
            console.log("Error");
        }
    };
    const handleSaveData = () => {
        setShowPaymentPopup(true);
        apiCall({
            method: 'POST',
            url: 'https://3-extent-billing-backend.vercel.app/api/billings',
            data: billsData,
            callback: billsCallback,
        })
    };
    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Sales Billing"
                label="Billing History"
                icon="fa fa-history"
                buttonClassName="py-1 px-3 text-sm font-bold"
                onClick={navigateBillingHistory}
            />
            <div className="flex items-center gap-4">
                <CustomDropdownInputComponent
                    label="IMEI No :"
                    dropdownClassName="w-[190px]"
                    placeholder="Scan IMEI No"
                    value={selectedImei}
                    maxLength={15}
                    onChange={(value) => setSelectedImei(value)}
                    options={
                        selectedImei.length >= 11
                            ? imeiOptions.filter((imei) => imei.startsWith(selectedImei))
                            : []
                    }
                />
                <CustomDropdownInputComponent
                    dropdownClassName="w-[190px] "
                    placeholder="Select Contact No"
                    value={selectedContactNo}
                    maxLength={10}
                    onChange={handleContactNoChange}
                    options={contactNoOptions}
                />
                <InputComponent
                    type="text"
                    placeholder="Enter Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    inputClassName="w-[190px] mb-6"
                />
            </div>
            {rows.length > 0 && (
                <div className="relative mb-2">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                        title="Show columns"
                    >
                        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </button>
                    {showDropdown && (
                        <div className="absolute bg-white border shadow-md mt-1 rounded w-48 z-10 max-h-48 overflow-auto">
                            {["Purchase Price", "QC_Remark"].map((col) => (
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
            )}
            <div>
                <CustomTableCompoent
                    headers={dynamicHeaders}
                    rows={rows}
                    onRateChange={handleRateChange}
                    maxHeight="max-h-[300px]"
                />
            </div>
            <div className="flex justify-end gap-4 mt-5">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-cloud-download"
                    buttonClassName="py-1 px-3 text-sm font-bold"
                    onClick={handleSaveData}
                />
                <PrimaryButtonComponent
                    label="Draft"
                    icon="fa fa-pencil-square-o"
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />
                <PrimaryButtonComponent
                    label="View"
                    icon="fa fa-dashcube"
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />
            </div>
            {showPaymentPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-5 rounded shadow-lg w-[300px]">
                        <div className="text-lg font-bold  text-center">Payment Method</div>
                        <div className="flex gap-2 items-center justify-center">
                            <label className="font-bold w-[60px]">Cash:</label>
                            <InputComponent
                                type="text"
                                placeholder=""
                                value={cashAmount}
                                onChange={(e) => setCashAmount(e.target.value)}
                                inputClassName=" w-[150px]"
                            />
                        </div>
                        <div className="flex gap-2 items-center justify-center ">
                            <label className="font-bold w-[60px]">Online:</label>
                            <InputComponent
                                type="text"
                                placeholder=""
                                value={onlineAmount}
                                onChange={(e) => setOnlineAmount(e.target.value)}
                                inputClassName="w-[150px] "
                            />
                        </div>
                        <div className="flex gap-2 items-center mb-2 justify-center ">
                            <label className="font-bold w-[60px]">card:</label>
                            <InputComponent
                                type="text"
                                placeholder=""
                                value={card}
                                onChange={(e) => setCard(e.target.value)}
                                inputClassName="w-[150px] "
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <PrimaryButtonComponent
                                label="Cancel"
                                buttonClassName="py-1 px-3 text-sm font-bold"
                                onClick={() => setShowPaymentPopup(false)}
                            />
                            <PrimaryButtonComponent
                                label="Print"
                                buttonClassName="py-1 px-3 text-sm font-bold"
                            // onClick={handleConfirmPayment}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
