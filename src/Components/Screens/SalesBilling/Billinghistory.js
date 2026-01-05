import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS, PAYMENTSTATUS_OPTIONS } from "./Constants";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { exportToExcel, generateAndSavePdf } from "../../../Util/Utility";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";
import { API_URLS } from "../../../Util/AppConst";
import { toast } from "react-toastify";
import CustomConfirmationPopup from "../../CustomComponents/CustomPopUpCompoent/CustomConfirmationPopup";
function Billinghistory({ isDraft = false }) {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const [billingProductData, setBillingProductData] = useState([]);

    const [loading, setLoading] = useState(false)

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

    const [billDelete, setBillDelete] = useState(null)

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
    const [showTotalRow, setShowTotalRow] = useState(false);
    const [totalRow, setTotalRow] = useState(null);
    const toggleableColumns = ["Profit"];

    const [hiddenColumns, setHiddenColumns] = useState([
        "Profit",
    ]);

    const [dynamicHeaders, setDynamicHeaders] = useState(() => {
        return BILLINGHISTORY_COLOUMNS.filter(
            (col) => !["Profit",].includes(col)
        );
    });

    const toggleColumn = (columnName) => {
        if (!toggleableColumns.includes(columnName)) return;
        if (dynamicHeaders.includes(columnName)) {
            setDynamicHeaders(dynamicHeaders.filter(col => col !== columnName));
            setHiddenColumns([...hiddenColumns, columnName]);
        } else {
            let newHeaders = [...dynamicHeaders];
            const gradeIndex = newHeaders.indexOf("Grade");
            if (gradeIndex !== +1) {
                newHeaders.splice(gradeIndex, 0, columnName);

            } else {
                newHeaders.push(columnName);
            }
            setDynamicHeaders(newHeaders);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        };
    };
    useEffect(() => {
        getBillData();
    }, [isDraft]);
    useEffect(() => {
        setFrom(from);
        setTo(to);
        getBillData({ from, to });
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
    const handleDeleteBillCallback = (response) => {
        if (response.status === 200) {
            toast.success("Bill deleted successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            getBillData();
        } else {
            const errorMsg = response?.data?.error || "Failed to delete bill";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
        setShowConfirmationPopup(false);
        setBillDelete(null);
    };
    const handleDeleteBill = () => {
        if (!billDelete) return;

        apiCall({
            method: "DELETE",
            url: `${API_URLS.BILLING}/${billDelete}`,
            data: {},
            setLoading: setLoading,
            callback: handleDeleteBillCallback,
        });
    };

    const handleCancelConfirmPopup = () => {
        setShowConfirmationPopup(false);
        setBillDelete(null);
    }

    const getBillCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            setBillingProductData(response.data.billings)
            const billingformattedRows = response.data.billings.map((bill, index) => ({
                "Bill id": index + 1,
                "Date": moment(bill.created_at).format('ll'),
                "Customer Name": bill.customer?.name,
                "Firm Name": bill.customer?.firm_name || "-",
                "Contact Number": bill.customer?.contact_number,
                "Total Amount": bill.payable_amount,
                "Remaining Amount": bill.pending_amount,
                "Profit": bill.actualProfit,
                "Total Products": bill.products.length,
                _id: bill._id,
                "Actions": (
                    <div className="flex items-center justify-end gap-2">
                        <div
                            title="delete"
                            className="flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer w-10 h-10 min-w-[40px] min-h-[40px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setBillDelete(bill._id);
                                setShowConfirmationPopup(true)
                            }}
                        >
                            <i className="fa fa-trash text-gray-700 text-lg" />
                        </div>
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
                                    bill.payable_amount,
                                    bill.customer?.firm_name,
                                    bill.net_total,
                                    bill.c_gst,
                                    bill.s_gst
                                );
                            }}
                        />

                    </div>
                )
            }));
            console.log('billingformattedRows: ', billingformattedRows);
            if (!isDraft) {
                setTotalRow({
                    _id: "total",
                    "Bill id": "Total",
                    "Date": "",
                    "Customer Name": "",
                    "Contact Number": "",
                    "Total Amount": response.data.totalAmount?.toLocaleString("en-IN") || 0,
                    "Remaining Amount": response.data.totalRemaining?.toLocaleString("en-IN") || 0,
                    "Profit": response.data.totalProfit,
                    "Total Products": response.data.totalProducts || 0,
                    "Actions": ""
                });
            }
            setRows(billingformattedRows);
        } else {
            console.log("Error");
        }
    }
    const getBillData = () => {
        let url = `${API_URLS.BILLING}?`;
        if (isDraft) {
            url += `status=DRAFTED`;
        }

        if (customerName) {
            url += `&customer_name=${customerName}`
        }
        if (contactNo) {
            url += `&contact_number=${contactNo}`
        }
        if (!isDraft && paymentStatus) {
            url += `&status=${paymentStatus}`;
        }
        if (imeiNumber) {
            url += `&imei_number=${imeiNumber}`
        }
        if (!selectAllDates) {
            if (from) url += `&from=${moment.utc(from).startOf('day').valueOf()}`;
            if (to) url += `&to=${moment.utc(to).endOf('day').valueOf()}`;
        }

        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBillCallBack,
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
            const path = isDraft
                ? `/singleDraftBillHistroy/${row._id}`
                : `/singleBillHistory/${row._id}`;
            navigate(path);
        }
    };

    const handleNavigateBillHistroy = () => {
        navigate(-1);
    }
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
            toast.success("Payment updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/billinghistory")
            handleCancelPopup();
            getBillData();
        }
    };

    const handleSavePayment = () => {
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
            url: `${API_URLS.BILLING}/payment/${selectedBill._id}`,
            data: updatedPayment,
            callback: handlePaymentUpdateCallback,
            setLoading: setLoading,
        });
        setShowPaymentPopup(false);
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
    };
    const handleSearchFilter = () => getBillData({ contactNo, paymentStatus, customerName, from, to, selectAllDates, imeiNumber });

    const handleResetFilter = () => {
        setContactNo("");
        setCustomerName("");
        setPaymentStatus("");
        setIMEINumber("");
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getBillData({ from, to });
    }

    const ProductExportData = () => {
        const data = [];

        billingProductData.map((bill) => {
            bill.products.map((product) => {
                data.push({
                    "Date": moment(bill.created_at).format('ll'),
                    "Invoice No": bill.invoice_number,
                    "Customer Name": bill.customer?.name,
                    "Contact No": bill.customer?.contact_number,
                    "IMEI No": product.imei_number,
                    "Model": product.model?.name,
                    "Grade": product.grade,
                    "Engineer": product.engineer_name,
                    "Sale Price": product.sold_at_price,
                    "Purchase Price": product.purchase_price,
                    "Repair Cost": product.repair_cost,
                    "Profit": product.profitToShow,
                    "Payment Status": bill.status,
                });
            });
        });

        return data;
    };

    const handleExportToExcel = () => {
        if (!billingProductData.length) {
            toast.error("No data to export");
            return;
        }

        const exportData = ProductExportData();

        exportToExcel(
            exportData,
            `Product_datewise_${from}_to_${to}.xlsx`,
            null,
            Object.keys(exportData[0])
        );
    };
    console.log('rows: ', rows);
    return (
        <div>
            {loading && <Spinner />}
            <div className="flex justify-between items-center">
                <div className="text-xl font-serif">{isDraft ? "Drafted Bill History" : "Billing History"}</div>
                <div className="flex gap-3">
                    <PrimaryButtonComponent
                        label="Back"
                        icon="fa fa-arrow-left"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={handleNavigateBillHistroy}
                    />
                    {!isDraft && (
                        <PrimaryButtonComponent
                            label="Export to Excel"
                            icon="fa fa-file-excel-o"
                            onClick={handleExportToExcel}
                        />
                    )}

                </div>
            </div>
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
                {!isDraft && (
                    <DropdownCompoent
                        placeholder="Select status"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        options={PAYMENTSTATUS_OPTIONS}
                        className="w-[180px] mt-3"
                    />
                )}
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
            <CustomTableCompoent
                maxHeight="h-[60vh]"
                headers={dynamicHeaders}
                rows={rows}
                totalRow={totalRow}
                onRowClick={handleRowClick}
                toggleableColumns={toggleableColumns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
                showTotalRow={!isDraft && showTotalRow}
            />
            {!isDraft && (
                <div className="flex justify-end">
                    <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                        <i className="fa fa-circle-o" aria-hidden="true"></i>
                    </button>
                </div>
            )}
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
                    handleSaveButton={handleSavePayment}
                    isbillingHistory={isDraft}
                    handlePrintButton={isDraft ? handleSavePayment : handleSavePayment}
                />
            )}

            {showConfirmationPopup && (
                <CustomConfirmationPopup
                    handleCancelButton={handleCancelConfirmPopup}
                    handleDeleteButton={handleDeleteBill}
                />
            )}


        </div>
    )
}
export default Billinghistory;