import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS, PAYMENTSTATUS_OPTIONS } from "./Constants";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import { exportToExcel } from "../../../Util/Utility";
import moment from "moment";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
function Billinghistory() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [customerName, setCustomerName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [selectAllDates, setSelectAllDates] = useState(false);
    const formatDate = (date) => date.toISOString().split('T')[0];
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const todayFormatted = formatDate(today);
    const sevenDaysAgoFormatted = formatDate(sevenDaysAgo);
    useEffect(() => {
        setFrom(sevenDaysAgoFormatted);
        setTo(todayFormatted);
        getBillinghistoryAllData({});
    }, []);
    const getBilllinghistoryCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const billingformattedRows = response.data.map((bill, index) => ({
                "Bill id": index + 1,
                "Date": moment(bill.createdAt).format('ll'),
                "Customer Name": bill.customer.name,
                "Contact Number": bill.customer.contact_number,
                "Total Amount": bill.payable_amount,
                "Remaining Amount": bill.pending_amount,
                _id: bill._id
            }));
            console.log("Formatted Billing Rows: ", billingformattedRows);
            setRows(billingformattedRows);
        } else {
            console.log("Error");
        }
    }
    const getBillinghistoryAllData = ({ contactNo, paymentStatus, customerName, }) => {
        let url = "https://3-extent-billing-backend.vercel.app/api/billings?";
        if (customerName) {
            url += `&customer_name=${customerName}`
        }
        if (contactNo) {
            url += `&contact_number=${contactNo}`
        }
        if (paymentStatus) {
            url += `&status=${paymentStatus}`
        }
        if (!selectAllDates) {
            if (from) url += `&from=${moment(from).valueOf()}`;
            if (to) url += `&to=${moment(to).valueOf()}`;
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
        const todayFormatted = new Date().toISOString().split('T')[0];
        if (value > todayFormatted) {
            setDate(todayFormatted);
        } else {
            setDate(value);
        }
    };
    const handleRowClick = (row) => {
        if (row._id) {
            navigate(`/singleBillHistory/${row._id}`);
        }
    };
    const handleSearchFilter = () => {
        getBillinghistoryAllData({ contactNo, paymentStatus, customerName, from, to });
    }
    const handleResetFilter = () => {
        setContactNo("");
        setCustomerName("");
        setPaymentStatus("");
        setFrom(sevenDaysAgoFormatted);
        setTo(todayFormatted);
        setSelectAllDates();
        getBillinghistoryAllData({});
    }
    const handleExportToExcel = () => {
        exportToExcel(rows, "BillingHistory.xlsx");
    };
    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Billing History"
                icon="fa fa-file-excel-o"
                label="Export to Excel"

                onClick={handleExportToExcel}
            />
            <div className="flex items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Customer Name"
                    inputClassName="w-[190px] mb-5"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    inputClassName="w-[180px] mb-5"
                    value={contactNo}
                    maxLength={10}
                    onChange={(e) => setContactNo(e.target.value)}
                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    options={PAYMENTSTATUS_OPTIONS}
                    className="w-[180px]"
                />
                <InputComponent
                    type="date"
                    placeholder="Start Date"
                    inputClassName="w-[190px] mb-5"
                    value={from}
                    max={todayFormatted}
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />
                <InputComponent
                    type="date"
                    placeholder="End Date"
                    inputClassName="w-[190px] mb-5"
                    value={to}
                    min={from}
                    max={todayFormatted}
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
            <div className='flex justify-end mb-2 gap-4'>
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
            <div className="h-[64vh]">
                <CustomTableCompoent
                    headers={BILLINGHISTORY_COLOUMNS}
                    rows={rows}
                    onRowClick={handleRowClick}
                />
            </div>
        </div>
    )
}
export default Billinghistory;