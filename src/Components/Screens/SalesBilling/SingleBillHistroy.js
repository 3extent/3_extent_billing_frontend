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
// import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
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

    const [totalAmount, setTotalAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [fixPendingAmount, setFixPendingAmount] = useState(0);


    //New amounts
    const [cashPaidPopup, setCashPaidPopup] = useState(0);
    const [onlinePaidPopup, setOnlinePaidPopup] = useState(0);
    const [cardPaidPopup, setCardPaidPopup] = useState(0);

    const [existingPaidAmount, setExistingPaidAmount] = useState([]);
    const [advanceAmount, setAdvanceAmount] = useState(0);


    const [loading, setLoading] = useState(false);
    const [showTotalRow, setShowTotalRow] = useState(false);

    const [totalRow, setTotalRow] = useState(null);

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
        const totalDue = rows.reduce((sum, row) => sum + Number(row["Rate"] || 0), 0);

        const paidCash = Number(existingPaidAmount.find(p => p.method === "cash")?.amount || 0);
        const paidOnline = Number(existingPaidAmount.find(p => p.method === "online")?.amount || 0);
        const paidCard = Number(existingPaidAmount.find(p => p.method === "card")?.amount || 0);

        let totalPaid = paidCash + paidOnline + paidCard;

        let newCash = paidCash;
        let newOnline = paidOnline;
        let newCard = paidCard;

        let advance = 0;
        let pending = 0;

        if (totalPaid >= totalDue) {
            // fully paid
            advance = totalPaid - totalDue;
            pending = 0;

            let reduce = totalPaid - totalDue; // how much extra we need to reduce from paid

            // Deduct in order: cash → online → card
            if (newCash >= reduce) {
                newCash -= reduce;
                reduce = 0;
            } else {
                reduce -= newCash;
                newCash = 0;

                if (newOnline >= reduce) {
                    newOnline -= reduce;
                    reduce = 0;
                } else {
                    reduce -= newOnline;
                    newOnline = 0;
                    newCard = Math.max(0, newCard - reduce);
                    reduce = 0;
                }
            }
        } else if (totalPaid > 0) {
            // partially paid
            pending = totalDue - totalPaid;
            advance = 0;
        } else {
            // unpaid
            pending = totalDue;
            advance = 0;
        }

        setTotalAmount(totalDue);
        setPendingAmount(pending);
        setAdvanceAmount(advance);
        setExistingPaidAmount([
            { method: "cash", amount: newCash },
            { method: "online", amount: newOnline },
            { method: "card", amount: newCard },
        ]);
    }, [rows]);


    useEffect(() => {
        let paymentAmount = Number(fixPendingAmount) - Number(cardPaidPopup) - Number(onlinePaidPopup) - Number(cashPaidPopup)
        setPendingAmount(paymentAmount)
    }, [cashPaidPopup, onlinePaidPopup, cardPaidPopup])



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

    const getSingleBillHistroyAllData = (id) => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.BILLING}/${id}`,
            data: {},
            callback: getSingleBillHistroyCallBack,
            setLoading: setLoading
        })
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
                netTotal: bill.net_total,
                cGst: bill.c_gst,
                sGst: bill.s_gst,
                date: moment((bill.created_at)).format('ll')
            });
            setCustomerName(bill.customer?.name || "");
            setSelectedContactNo(bill.customer?.contact_number || "");
            setTotalAmount(Number(bill.payable_amount || 0));
            setPendingAmount(Number(bill.pending_amount || 0));

            setExistingPaidAmount(bill.paid_amount)

            const singleBillHistrotFormattedRows = bill.products.map((product, index) => ({
                "Sr.No": index + 1,
                "IMEI NO": product.imei_number,
                "Brand": product.model.brand?.name,
                "Model": product.model?.name,
                "Rate": product.sold_at_price,
                "Sale Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "GST Purchase Price": product.gst_purchase_price,
                "QC-Remark": product.qc_remark,
                "Grade": product.grade,
                "Accessories": product.accessories,
                status: product.status,
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
            setTotalRow({
                "Sr.No": "Total",
                "IMEI NO": "",
                Brand: "",
                Model: "",
                "Rate": response.data.totalRate?.toLocaleString("en-IN") || 0,
                "Sale Price": response.data.totalSalesPrice?.toLocaleString("en-IN") || 0,
                "Purchase Price": response.data.totalPurchasePrice?.toLocaleString("en-IN") || 0,
                "QC-Remark": "",
                Grade: "",
                Accessories: ""
            });
            setSingleBill(bill);
            setRows(singleBillHistrotFormattedRows);
        } else {
            console.log("Error");
        }
    }

    const handleRateChange = (index, newRate) => {
        console.log('newRate: ', newRate);
        const updatedRows = [...rows];
        updatedRows[index]["Rate"] = Number(newRate);
        setRows(updatedRows);
        console.log('updatedRows: ', updatedRows);
    };

    const handleDeleteRow = (imeiNumber) => {
        setRows((currentRows) => {
            if (currentRows.length <= 1) {
                toast.warning("At least one product must remain in the bill!", {
                    position: "top-center",
                    autoClose: 2000,
                });
                return currentRows;
            }
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
                "GST Purchase Price": product.gst_purchase_price,
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
        handleBillSaveData();
    }

    const handleCancelPopup = () => {
        setCashPaidPopup(0);
        setOnlinePaidPopup(0);
        setCardPaidPopup(0);
        setPendingAmount(Number(fixPendingAmount))
        setShowPaymentPopup(false);
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
            customerInfo.firmname,
            customerInfo.netTotal,
            customerInfo.cGst,
            customerInfo.sGst,
        );
    }

    const saveBillCallback = (response) => {
        if (response.status === 200) {
            if (pendingAmount > 0) {
                setShowPaymentPopup(true);
            }
        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving bill.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
        }

    }

    const handleBillSaveData = () => {
        if (!billId) return;
        const billsData = {
            customer_name: customerName,
            contact_number: selectedContactNo,
            products: rows.map((row) => ({
                imei_number: row["IMEI NO"],
                rate: row["Rate"],
            })),
            paid_amount: existingPaidAmount,
            payable_amount: totalAmount,
            pending_amount: pendingAmount,
            advance_amount: advanceAmount
        };
        console.log('billsData: ', billsData)
        apiCall({
            method: 'PUT',
            url: `${API_URLS.BILLING}/${billId}`,
            data: billsData,
            callback: saveBillCallback,
        })
        console.log('billsData: ', billsData);
    };

    const paymentUpdateCallback = (response) => {
        if (response.status === 200) {
            toast.success("Payment updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setShowPaymentPopup(false);
            navigate("/billinghistory");
            generateAndSavePdf(
                response.data.customer?.name,
                response.data.invoice_number,
                response.data.customer?.contact_number,
                response.data.customer?.address,
                response.data.customer?.gst_number,
                response.data.products,
                response.data.payable_amount,
                response.data.customer?.firm_name,
                response.data.net_total,
                response.data.c_gst,
                response.data.s_gst
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

    const handlePrintButton = () => {
        if (!billId) return;
        const cash = Number(cashPaidPopup || 0);
        const online = Number(onlinePaidPopup || 0);
        const cardAmt = Number(cardPaidPopup || 0);
        const paymentData = {
            payable_amount: totalAmount,
            paid_amount: [
                { method: "cash", amount: cash },
                { method: "online", amount: online },
                { method: "card", amount: cardAmt },
            ],
        };
        apiCall({
            method: "PUT",
            url: `${API_URLS.BILLING}/payment/${billId}`,
            data: paymentData,
            callback: paymentUpdateCallback,
            setLoading: setLoading,
        });
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
            {/* <div className="flex items-center gap-3 mb-6">
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
            </div> */}
            <div className="h-[40vh]">
                <CustomTableCompoent
                    headers={SINGLEBILLHISTORY_COLOUMNS}
                    rows={rows}
                    totalRow={totalRow}
                    onRateChange={handleRateChange}
                    editable={true}
                    showTotalRow={showTotalRow}
                />
            </div>
            <div className="flex justify-end">
                <button
                    className="rounded-full"
                    onClick={() => setShowTotalRow(!showTotalRow)}
                >
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
            <div className=" fixed bottom-16 right-5 font-bold gap-4 text-[22px]  flex justify-end">
                <div>Advance Amount: {Number(advanceAmount).toLocaleString("en-IN")}</div>
                <div>Total Amount: {Number(totalAmount).toLocaleString("en-IN")}</div>
                <div>Remaining Amount: {Number(pendingAmount).toLocaleString("en-IN")}</div>
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
                    totalAmount={fixPendingAmount}
                    cashAmount={cashPaidPopup}
                    onlineAmount={onlinePaidPopup}
                    card={cardPaidPopup}
                    pendingAmount={pendingAmount}
                    setCashAmount={setCashPaidPopup}
                    setOnlineAmount={setOnlinePaidPopup}
                    setCard={setCardPaidPopup}
                    handleCancelButton={handleCancelPopup}
                    handlePrintButton={handlePrintButton}
                />
            )}
        </div>
    );
}