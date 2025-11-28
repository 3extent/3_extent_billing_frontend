import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { SINGLEBILLHISTORY_COLOUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { exportToExcel, generateAndSavePdf } from "../../../Util/Utility";
import { API_URLS } from "../../../Util/AppConst";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import { toast } from "react-toastify";
export default function SingleBillHistory() {
    const { billId } = useParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [singleBill, setSingleBill] = useState([])
    const [customerInfo, setCustomerInfo] = useState();
    const [imeiOptions, setImeiOptions] = useState([]);
    const [selectedImei, setSelectedImei] = useState("");
    const [selectedContactNo, setSelectedContactNo] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (billId) {
            getAllImeis();
            getSingleBillHistroyAllData(billId);
        }
    }, [billId]);
    useEffect(() => {
        if (selectedImei.length === 15) {
            addRow(selectedImei);
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
    const getAllImeis = () => {
        let url = `${API_URLS.PRODUCTS}?status=AVAILABLE,RETURN`;
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
    const getSingleBillHistroyCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const bill = response.data.billing;
            setCustomerInfo({
                name: bill.customer?.name,
                contact: bill.customer?.contact_number,
                invoice: bill.invoice_number,
                address: bill.customer?.address,
                gstno: bill.customer?.gst_number,
                firmname: bill.customer?.firm_name,
                amount: bill.payable_amount,
                date: moment((bill.created_at)).format('ll')
            });
            setCustomerName(bill.customer?.name || "");
            setSelectedContactNo(bill.customer?.contact_number || "");
            const singleBillHistrotFormattedRows = bill.products.map((product, index) => ({
                "Sr.No": index + 1,
                "IMEI NO": product.imei_number,
                "Brand": product.model.brand?.name,
                "Model": product.model?.name,
                "Rate": product.sold_at_price,
                "Sale Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "QC-Remark": product.qc_remark,
                "Grade": product.grade,
                "Accessories": product.accessories,
                "Action": (
                    <div className="flex justify-end">
                        <div
                            title="delete"
                            onClick={() => handleDeleteRow(product.imei_number)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-trash text-gray-700 text-sm" />
                        </div>
                    </div>
                ),
            }));
            setSingleBill(bill);
            setRows(singleBillHistrotFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const handleRateChange = (index, newRate) => {
        const updatedRows = [...rows];
        updatedRows[index]["Rate"] = Number(newRate);
        setRows(updatedRows);
    };
    const handleDeleteRow = (imeiNumber) => {
        setRows((currentRows) => {
            const updatedRows = [...currentRows];
            const index = updatedRows.findIndex(row => row["IMEI NO"] === imeiNumber);
            if (index !== -1) {
                updatedRows.splice(index, 1);
            }
            const newRows = updatedRows.map((row, index) => ({
                ...row,
                "Sr.No": index + 1,
            }));
            return newRows;
        });
    };
    const addRowCallback = (response) => {
        if (response.status === 200 && response.data.length > 0) {
            const product = response.data[0];
            if (!product || (product.status !== "AVAILABLE" && product.status !== "RETURN")) {
                toast.warning("Product is already sold !", { position: "top-center", autoClose: 2000 });
                setSelectedImei("");
                return;
            }
            const newRow = {
                "Sr.No": rows.length + 1,
                "IMEI NO": product.imei_number,
                "Brand": product.model?.brand?.name,
                "Model": product.model?.name,
                "Rate": product.sales_price,
                "Sale Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "QC-Remark": product.qc_remark,
                "Grade": product.grade,
                "Accessories": product.accessories,
                "Action": (
                    <div className="flex justify-end">
                        <div
                            title="delete"
                            onClick={() => handleDeleteRow(product.imei_number)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-trash text-gray-700 text-sm" />
                        </div>
                    </div>
                ),
            };

            setRows(Rows => [...Rows, newRow]);
            setSelectedImei("");
        }
    }
    const addRow = (imei) => {
        apiCall({
            method: "GET",
            url: `${API_URLS.PRODUCTS}?imei_number=${imei}`,
            data: {},
            callback: addRowCallback,
            setLoading: setLoading
        });
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
    }
    const handleCancelPopup = () => {
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
    };
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
            generateAndSavePdf(
                response.data.billing.customer?.name,
                response.data.billing.invoice_number,
                response.data.billing.customer?.contact_number,
                response.data.billing.customer?.address,
                response.data.billing.customer?.gst_number,
                response.data.billing.products,
                response.data.billing.payable_amount,
                response.data.billing.customer?.firm_name,

            );
        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving bill.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
            setShowPaymentPopup(false);
        }
    };
    const handleGenaratePdf = () => {
        generateAndSavePdf(
            customerInfo.name,
            customerInfo.invoice,
            customerInfo.contact,
            customerInfo.address,
            customerInfo.gstno,
            singleBill.products,
            customerInfo.amount,
            customerInfo.firmname
        );
    }
    const handlePrintButton = () => {
        if (!billId) return;
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
            method: 'PUT',
            url: `${API_URLS.BILLING}/${billId}`,
            data: billsData,
            callback: billsCallback,
            setLoading: setLoading
        })
    };
    const getSingleBillHistroyAllData = (id) => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.BILLING}/${id}`,
            data: {},
            callback: getSingleBillHistroyCallBack,
            setLoading: setLoading
        })
    };
    const handleNavigateBillHistroy = () => {
        navigate(-1);
    }
    const handleExportToExcel = () => {
        exportToExcel(rows, "billData.xlsx", customerInfo);
    };
    return (
        <div>
            {loading && <Spinner />}
            <div className="flex justify-between items-center">
                <div className="text-xl font-serif">Details of bill</div>
                <div className="flex gap-4">
                    <PrimaryButtonComponent
                        label="Back"
                        icon="fa fa-arrow-left"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={handleNavigateBillHistroy}
                    />
                    <PrimaryButtonComponent
                        label="Print"
                        icon="fa fa-print"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={handleGenaratePdf}
                    />
                    <PrimaryButtonComponent
                        label="Export to Excel"
                        icon="fa fa-file-excel-o"
                        onClick={handleExportToExcel}

                    />
                </div>
            </div>
            <div className="my-5">
                {customerInfo && (
                    <div className="">
                        <div className="text-[16px] font-semibold">
                            Customer Name :<span className="font-normal text-[14px]">{customerInfo.name}</span>
                        </div>
                        <div className="text-[16px] font-semibold">
                            Firm Name :<span className="font-normal text-[14px]">{customerInfo.firmname || "-"}</span>
                        </div>

                        <div className="text-[16px] font-semibold">
                            Contact Number : <span className="font-normal text-[14px]">{customerInfo.contact}</span>
                        </div>
                        <div className="text-[16px] font-semibold">
                            Date: <span className="font-normal text-[14px]">{customerInfo.date}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 mb-6">
                <CustomDropdownInputComponent
                    label="IMEI No :"
                    dropdownClassName="w-[190px]"
                    placeholder="Scan IMEI No"
                    value={selectedImei}
                    maxLength={15}
                    numericOnly={true}
                    onChange={(value) => setSelectedImei(value)}
                    options={
                        selectedImei.length >= 11
                            ? imeiOptions.filter((imei) => imei.startsWith(selectedImei))
                            : []
                    }
                />
            </div>
            <div className="h-[64vh]">
                <CustomTableCompoent
                    headers={SINGLEBILLHISTORY_COLOUMNS}
                    rows={rows}
                    onRateChange={handleRateChange}
                    editable={true}

                />
            </div>
            <div className=" fixed bottom-16 right-5 font-bold gap-4 text-[22px]  flex justify-end">
                Total Amount : {Number(totalAmount).toLocaleString("en-IN")}
            </div>
            <div className=" fixed bottom-5 right-5 flex gap-4 mt-3">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-cloud-download"
                    onClick={handleSaveData}
                />
            </div>
            {showPaymentPopup && (
                <CustomPopUpComponet
                    isbillingHistory={true}
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