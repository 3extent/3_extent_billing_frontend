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
import { toast } from "react-toastify";
export default function SingleBillHistory() {
    const { billId } = useParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [singleBill, setSingleBill] = useState([])
    const [customerInfo, setCustomerInfo] = useState();
    const [loading, setLoading] = useState(false);
    const [showTotalRow, setShowTotalRow] = useState(false);

    const [totalAmount, setTotalAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);

    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");

    const [selectedContactNo, setSelectedContactNo] = useState("");
    const [customerName, setCustomerName] = useState("");

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);

    useEffect(() => {
        if (billId) {
            getSingleBillHistroyAllData(billId);
        }
    }, [billId]);

    // useEffect(() => {
    //     const cash = Number(cashAmount);
    //     const online = Number(onlineAmount);
    //     const cardAmt = Number(card);
    //     const pending = Number(pendingAmount) - Number(cash) + Number(online) + Number(cardAmt);
    //     setPendingAmount(pending);
    // }, [cashAmount, card, onlineAmount,]);

    // Total calculate
    useEffect(() => {
        const total = rows.reduce((sum, row) => {
            if (!row["IMEI NO"]) return sum;
            const rate = parseFloat(
                String(row["Rate"]).replace(/\D/g, ""),
            );
            return sum + (isNaN(rate) ? 0 : rate);
        }, 0);
        setTotalAmount(total);
    }, [rows]);

    // pending amount calculate

    const [prevRows, setPrevRows] = useState([]);
    useEffect(() => {

        const prevTotal = prevRows.reduce((sum, row) => {
            // console.log('prevTotal: ', prevTotal);
            const rate = parseFloat(String(row["Rate"]).replace(/\D/g, "")) || 0;
            return sum + rate;
        }, 0);

        const currentTotal = rows.reduce((sum, row) => {
            // console.log('currentTotal: ', currentTotal);
            const rate = parseFloat(String(row["Rate"]).replace(/\D/g, "")) || 0;
            return sum + rate;
        }, 0);

        const diff = prevTotal - currentTotal;
        console.log('diff: ', diff);

        if (diff > 0) {
            setPendingAmount(prev => prev - diff);
           
            
            // console.log('prev - diff: ', prev - diff);
        }
        setPrevRows(rows);
         console.log('prev => prev - diff: ', prev => prev - diff);
         console.log('prevTotal: ', prevTotal);
    console.log('currentTotal: ', currentTotal);

    }, [rows]);
     
    const handleCancelPopup = () => {
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
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
            setPendingAmount(Number(bill.pending_amount || 0));

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
            // singleBillHistrotFormattedRows.push({
            //     _id: "total",
            //     "Sr.No": "Total",
            //     "IMEI NO": "",
            //     Brand: "",
            //     Model: "",
            //     "Rate": response.data.totalRate?.toLocaleString("en-IN") || 0,
            //     "Sale Price": response.data.totalSalesPrice?.toLocaleString("en-IN") || 0,
            //     "Purchase Price": response.data.totalPurchasePrice?.toLocaleString("en-IN") || 0,
            //     "QC-Remark": "",
            //     Grade: "",
            //     Accessories: "",
            // });
            setSingleBill(bill);
            setRows(singleBillHistrotFormattedRows);
        } else {
            console.log("Error");
        }
    }
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
    const getSingleBillHistroyAllData = (id) => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.BILLING}/${id}`,
            data: {},
            callback: getSingleBillHistroyCallBack,
            setLoading: setLoading
        })
    };

    const handleSaveData = () => {
        // if (pendingAmount) {
        //     toast.warning("Please add products before proceeding to payment.", { position: "top-center", autoClose: 2000 });
        //     return;
        // }
        handleBillSaveData();
    };

    const handleBillSaveData = () => {
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
            callback: saveBillCallback,
        });
    };

    const saveBillCallback = (response) => {
        if (response.status === 200) {
            setShowPaymentPopup(true);
        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving bill.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
        }
    }


    const handlePrintButton = () => {
        if (!billId) return;
        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const totalPaid = cash + online + cardAmt;

        const paymentData = {
            payable_amount: totalAmount,
            paid_amount: [
                { method: "cash", amount: cash },
                { method: "online", amount: online },
                { method: "card", amount: cardAmt },
            ],
            pending_amount: totalAmount - totalPaid,
        };
        apiCall({
            method: "PUT",
            url: `${API_URLS.BILLING}/payment/${billId}`,
            data: paymentData,
            callback: paymentUpdateCallback,
            setLoading: setLoading,
        });
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
                            Customer Name : <span className="font-normal text-[14px]">{customerInfo.name}</span>
                        </div>
                        <div className="text-[16px] font-semibold">
                            Firm Name : <span className="font-normal text-[14px]">{customerInfo.firmname || "-"}</span>
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
            <div className="h-[50vh]">
                <CustomTableCompoent
                    headers={SINGLEBILLHISTORY_COLOUMNS}
                    rows={rows}
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
                <div>Total Amount : {Number(totalAmount).toLocaleString("en-IN")}</div>
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
                    totalAmount={pendingAmount}
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