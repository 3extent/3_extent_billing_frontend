import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS, PAYMENTSTATUS_OPTIONS } from "./Constants";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { generateAndSavePdf } from "../../../Util/Utility";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";
import { API_URLS } from "../../../Util/AppConst";
function Billinghistory() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [selectedBill, setSelectedBill] = useState(null);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [customerName, setCustomerName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [imeiNumber, setIMEINumber] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const fromDate = moment().subtract('days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');
    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);
    const [selectAllDates, setSelectAllDates] = useState(false);
    useEffect(() => {
        setFrom(from);
        setTo(to);
        getBillinghistoryAllData({ from, to });
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
    const getBilllinghistoryCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const billingformattedRows = response.data.billings.map((bill, index) => ({
                "Bill id": index + 1,
                "Date": moment(bill.created_at).format('ll'),
                "Customer Name": bill.customer.name,
                "Contact Number": bill.customer.contact_number,
                "Total Amount": bill.payable_amount,
                "Remaining Amount": bill.pending_amount,
                "Profit": bill.profit,
                "Total Products": bill.products.length,
                _id: bill._id,
                "Actions": (
                    <div className="flex items-center justify-end gap-2">
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
            billingformattedRows.push({
                _id: "total",
                "Bill id": "Total",
                "Date": "",
                "Customer Name": "",
                "Contact Number": "",
                "Total Amount": response.data.totalAmount?.toLocaleString("en-IN") || 0,
                "Remaining Amount": response.data.totalRemaining?.toLocaleString("en-IN") || 0,
                "Profit": response.data.totalProfit?.toLocaleString("en-IN") || 0,
                "Total Products": response.data.totalProducts || 0,
                "Actions": ""
            });
            setRows(billingformattedRows);
        } else {
            console.log("Error");
        }
    }
    const getBillinghistoryAllData = ({ contactNo, paymentStatus, customerName, from, to, selectAllDates, imeiNumber }) => {
        let url = `${API_URLS.BILLING}?`;
        if (customerName) {
            url += `&customer_name=${customerName}`
        }
        if (contactNo) {
            url += `&contact_number=${contactNo}`
        }
        if (paymentStatus) {
            url += `&status=${paymentStatus}`
        }
        if (imeiNumber) {
            url += `&imei_number=${imeiNumber}`
        }
        if (!selectAllDates) {
            if (from) url += `&from=${moment.utc(from).valueOf(from)}`;
            if (to) url += `&to=${moment.utc(to).endOf('day').valueOf(to)}`;
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBilllinghistoryCallBack,
            setLoading: setLoading
        })
    }
    const handleDateChange = (value, setDate) => {
        const today = moment().format('YYYY-MM-DD');
        if (value > today) {
            setDate(today);
        } else {
            setDate(value);
        }
    };
    const handleRowClick = (row) => {
        if (row._id) {
            navigate(`/singleBillHistory/${row._id}`);
        }
    };
    const handlepaymentMethod = (bill) => {
        if (Number(bill.pending_amount) === 0) {
            return;
        }
        setSelectedBill(bill);
        setPendingAmount(bill.pending_amount);
        setShowPaymentPopup(true);
    };
    const handleCancelPopup = () => {
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
    };
    const handlePaymentUpdateCallback = (response) => {
        if (response.status === 200) {
            handleCancelPopup();
            getBillinghistoryAllData({
                contactNo,
                paymentStatus,
                customerName,
                from,
                to,
                selectAllDates,
                imeiNumber
            });
        }
    };

    const handleSaveButton = () => {
        if (!selectedBill) return;
        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const paidTotal = cash + online + cardAmt;
        const updatedPayment = {
            payable_amount: selectedBill.pending_amount,
            paid_amount: [
                { method: "cash", amount: cash },
                { method: "online", amount: online },
                { method: "card", amount: cardAmt },
            ],
            pending_amount: selectedBill.pending_amount - paidTotal,
        };
        apiCall({
            method: 'PUT',
            url: `${API_URLS.BILLING}/${selectedBill._id}`,
            data: updatedPayment,
            callback: handlePaymentUpdateCallback,
            setLoading: setLoading,
        });
        setShowPaymentPopup(false);
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
    };

    const handleSearchFilter = () => {
        getBillinghistoryAllData({ contactNo, paymentStatus, customerName, from, to, selectAllDates, imeiNumber });
    }
    const handleResetFilter = () => {
        setContactNo("");
        setCustomerName("");
        setPaymentStatus("");
        setIMEINumber("");
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getBillinghistoryAllData({ from, to });
    }
    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif">Billing History</div>
            <div className="flex items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Customer Name"
                    inputClassName="w-[190px] mb-2"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    inputClassName="w-[180px] mb-2"
                    value={contactNo}
                    maxLength={10}
                    onChange={(e) => setContactNo(e.target.value)}
                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    options={PAYMENTSTATUS_OPTIONS}
                    className="w-[180px] mt-3"
                />
                <InputComponent
                    type="date"
                    placeholder="Start Date"
                    inputClassName="w-[190px] mb-2"
                    value={from}
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />
                <InputComponent
                    type="date"
                    placeholder="End Date"
                    inputClassName="w-[190px] mb-2"
                    value={to}
                    onChange={(e) => handleDateChange(e.target.value, setTo)}
                    disabled={selectAllDates}
                />
                <label className='flex items-center gap-2 text-sm'>
                    <input
                        type="checkbox"
                        checked={selectAllDates}
                        onChange={(e) => setSelectAllDates(e.target.checked)}
                    />
                    All Data
                </label>
            </div>
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="IMEI NO"
                    inputClassName="mb-5 w-[190px] "
                    value={imeiNumber}
                    numericOnly={true}
                    maxLength={15}
                    onChange={(e) => setIMEINumber(e.target.value)}
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    onClick={handleResetFilter}
                />
            </div>
            <div className="h-[60vh]">
                <CustomTableCompoent
                    headers={BILLINGHISTORY_COLOUMNS}
                    rows={rows}
                    onRowClick={handleRowClick}
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
                    handleSaveButton={handleSaveButton}
                />
            )}
        </div>
    )
}
export default Billinghistory;