import { useEffect, useState } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { SALESBILLING_COLOUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import { useNavigate } from "react-router-dom";
import { exportToExcel, generateAndSavePdf } from "../../../Util/Utility";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";
import moment from "moment";
import { toast } from "react-toastify";
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
    const [totalAmount, setTotalAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
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
    const generateDummyRows = () => {
        const dummyRows = [];
        for (let i = 1; i <= 100; i++) {
            dummyRows.push({
                "Sr.No": i,
                "Date": moment().format('ll'),
                "IMEI NO": `DUMMY-IMEI-${1000 + i}`,
                "Brand": "Dummy Brand",
                "Model": `Dummy Model ${i}`,
                "Rate": 1000 + i,
                "Purchase Price": 500 + i,
                "Grade": "A",
                "Accessories": "None",
                "QC-Remark": "Dummy data for testing"
            });
        }
        return dummyRows;
    };

    // New handler function to print dummy data
    const handlePrintDummyData = () => {
        const dummyRows = generateDummyRows();
        const dummyTotalAmount = dummyRows.reduce((sum, row) => sum + row["Rate"], 0);
        const dummyCustomerName = "Dummy Customer";
        const dummyContactNo = "9876543210";
        const dummyCustomerGstNo = "GSTN-123456789";

        generateAndSavePdf(
            dummyCustomerName,
            dummyContactNo,
            dynamicHeaders,
            dummyCustomerGstNo,
            dummyRows,
            dummyTotalAmount
        );
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
    useEffect(() => {
        const cash = Number(cashAmount);
        const online = Number(onlineAmount);
        const cardAmt = Number(card);
        const pending = totalAmount - (cash + online + cardAmt);
        setPendingAmount(pending);
    }, [cashAmount, card, onlineAmount, totalAmount, pendingAmount]);
    useEffect(() => {
        const total = rows.reduce((sum, row) => sum + Number(row["Rate"] || 0), 0);
        setTotalAmount(total);
    }, [rows]);
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
        const url = "https://3-extent-billing-backend.vercel.app/api/products?status=AVAILABLE";
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
                "Date": moment(Number(product.created_at)).format('ll'),
                "IMEI NO": product.imei_number,
                "Brand": product?.model.brand?.name || product?.brand,
                "Model": product?.model?.name || product?.model,
                "Rate": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Accessories": product.accessories,
                "QC-Remark": product.qc_remark
            }));
            console.log('productFormattedRows: ', productFormattedRows);
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
    const billsCallback = (response) => {
        console.log("response: ", response);
        if (response.status === 200) {
            toast.success("Bill saved successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setRows([]);
            setSelectedImei("");
            setCustomerName("");
            setSelectedContactNo("");
            setOnlineAmount("");
            setCashAmount("");
            setCard("");
            setShowPaymentPopup(false);
            setPendingAmount(0);
            navigate("/billinghistory");
            generateAndSavePdf(customerName, selectedContactNo, dynamicHeaders, rows, totalAmount);

        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving bill.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
            setShowPaymentPopup(false);
        }
    };
    const handleCancelPopup = () => {
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
    };
    const handleSaveData = () => {
        if (totalAmount <= 0) {
            toast.warning("Please add products before proceeding to payment.", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }
        setShowPaymentPopup(true);
    };
    const handlePrintButton = () => {
        const billsData = {
            customer_name: customerName,
            contact_number: selectedContactNo,
            products: rows.map((row) => ({
                imei_number: row["IMEI NO"],
                rate: row["Rate"],
            })),
            paid_amount: [
                { method: "cash", amount: Number(cashAmount) },
                { method: "online", amount: Number(onlineAmount) },
                { method: "card", amount: Number(card) },
            ],
            payable_amount: totalAmount,
            pending_amount: pendingAmount,
        };
        apiCall({
            method: 'POST',
            url: 'https://3-extent-billing-backend.vercel.app/api/billings',
            data: billsData,
            callback: billsCallback,
        })
    };
    const draftCallback = (response) => {
        if (response.status === 200) {
            toast.success("Draft saved successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setRows([]);
            setSelectedImei("");
            setCustomerName("");
            setSelectedContactNo("");
            setCashAmount("");
            setOnlineAmount("");
            setCard("");
            setPendingAmount(0);
        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving draft.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
        }
    }
    const handleDraftData = () => {
        const billsData = {
            customer_name: customerName,
            contact_number: selectedContactNo,
            products: rows.map((row) => ({
                imei_number: row["IMEI NO"],
                rate: row["Rate"],
            })),
            paid_amount: [
                { method: "cash", amount: Number(cashAmount) },
                { method: "online", amount: Number(onlineAmount) },
                { method: "card", amount: Number(card) },
            ],
            payable_amount: totalAmount,
            pending_amount: totalAmount,
            status: "DRAFTED"
        };
        apiCall({
            method: 'POST',
            url: 'https://3-extent-billing-backend.vercel.app/api/billings',
            data: billsData,
            callback: draftCallback,
        })
    };
    const handleExportToExcel = () => {
        exportToExcel(rows, "salesbillingData.xlsx");
    };
    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Sales Billing"
                label="Billing History"
                icon="fa fa-history"
                onClick={navigateBillingHistory}
            />
            <div className="flex justify-between items-center ">
                <div className="flex items-center gap-3">
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
                <div>
                    <PrimaryButtonComponent
                        label="Export to Excel"
                        icon="fa fa-file-excel-o"
                        onClick={handleExportToExcel}

                    />
                </div>
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
            <div className="h-[64vh]">
                <CustomTableCompoent
                    headers={dynamicHeaders}
                    rows={rows}
                    onRateChange={handleRateChange}
                    editable={true}
                />
            </div>
            <div className="fixed bottom-5 right-5">
                <div>
                    <span className="font-bold gap-4 text-[22px]  flex justify-end">
                        Total Amount : {Number(totalAmount).toLocaleString("en-IN")}
                    </span>
                </div>
                <div className="flex gap-4 mt-3">
                    <PrimaryButtonComponent
                        label="Save"
                        icon="fa fa-cloud-download"
                        onClick={handleSaveData}
                    />
                    <PrimaryButtonComponent
                        label="Draft"
                        icon="fa fa-pencil-square-o"
                        onClick={handleDraftData}
                    />
                    <PrimaryButtonComponent
                        label="Print Dummy Bill"
                        icon="fa fa-print"
                        onClick={handlePrintDummyData}
                    />
                </div>
            </div>
            {showPaymentPopup && (
                <CustomPopUpComponet
                    totalAmount={totalAmount}
                    cashAmount={cashAmount}
                    onlineAmount={onlineAmount}
                    card={card}
                    pendingAmount={pendingAmount}
                    setCashAmount={setCashAmount}
                    setOnlineAmount={setOnlineAmount}
                    setCard={setCard}
                    handleCancelButton={handleCancelPopup}
                    handlePrintButton={handlePrintButton}
                />
            )}
        </div>
    );
}
