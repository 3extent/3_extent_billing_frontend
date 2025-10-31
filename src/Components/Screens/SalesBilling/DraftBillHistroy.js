import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import moment from "moment";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { generateAndSavePdf } from "../../../Util/Utility";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";
export default function DraftBillHistroy() {
    const [loading, setLoading] = useState(false)
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [selectedBill, setSelectedBill] = useState(null);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [rows, setRows] = useState([]);
    useEffect(() => {
        getDraftBillHistory();
    }, []);
    useEffect(() => {
        if (!selectedBill) return;
        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);

        const paidTotal = cash + online + cardAmt;
        const pending = selectedBill.pending_amount - paidTotal;
        setPendingAmount(pending);
    }, [cashAmount, card, onlineAmount, selectedBill]);

    const handleCancelPopup = () => {
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
    };

    const getDraftBillHistory = () => {
        let url = `https://3-extent-billing-backend.vercel.app/api/billings?status=DRAFTED`;
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: (response) => {
                if (response.status === 200) {
                    const draftFormattedRows = response.data.map((bill, index) => ({
                        "Bill id": index + 1,
                        "Date": moment(bill.created_at).format('ll'),
                        "Customer Name": bill.customer.name,
                        "Contact Number": bill.customer.contact_number,
                        "Total Amount": bill.payable_amount,
                        "Remaining Amount": bill.pending_amount,
                        "Profit": bill.profit,
                        _id: bill._id,
                        status: "DRAFTED",
                        "Actions": (
                            <div className="flex items-center justify-end gap-2">
                                <div 
                                    title="Edit"
                                    className="h-8 w-8  flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                >
                                    <i className="fa fa-pencil text-gray-700 text-sm" />
                                </div>
                                <div
                                    title="delete"
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                >
                                    <i className="fa fa-trash-o text-gray-700 text-sm" />
                                </div>
                                <div>
                                    {Number(bill.pending_amount) > 0 && (
                                        <PrimaryButtonComponent
                                            label="Pay"
                                            buttonClassName="py-1 px-3 text-[12px] font-semibold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlepaymentMethod(bill);
                                            }}
                                            disabled={Number(bill.pending_amount) === 0}
                                        />
                                    )}
                                </div>
                                <PrimaryButtonComponent
                                    label="Print"
                                    icon="fa fa-print"
                                    buttonClassName="py-1 px-3 text-[12px] font-semibold"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        generateAndSavePdf(
                                            bill.customer.name,
                                            bill.invoice_number,
                                            bill.customer.contact_number,
                                            bill.customer.address,
                                            bill.customer.gst_number,
                                            bill.products,
                                            bill.payable_amount
                                        );
                                    }}
                                />
                            </div>
                        )

                    }));
                    setRows(draftFormattedRows);
                } else {
                    console.log("Error fetching draft bills");
                }
            }
        });
        const handlepaymentMethod = (bill) => {
            if (Number(bill.pending_amount) === 0) {
                return;
            }
            setSelectedBill(bill);
            setPendingAmount(bill.pending_amount);
            setShowPaymentPopup(true);
        };
    };

    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif mb-10">Drafted Bill History</div>
            <div className="h-[70vh]">
                <CustomTableCompoent
                    headers={BILLINGHISTORY_COLOUMNS}
                    rows={rows}
                />
            </div>
            {showPaymentPopup && selectedBill && (
                <CustomPopUpComponet
                    totalAmount={selectedBill.pending_amount}
                    cashAmount={cashAmount}
                    onlineAmount={onlineAmount}
                    card={card}
                    pendingAmount={pendingAmount}
                    setCashAmount={setCashAmount}
                    setOnlineAmount={setOnlineAmount}
                    setCard={setCard}
                    handleCancelButton={handleCancelPopup}
                    isbillingHistory={true}
                // handlePrintButton={handlePrintButton}
                />
            )}
        </div>
    );
}