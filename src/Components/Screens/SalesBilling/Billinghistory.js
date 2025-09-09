import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS, PAYMENTSTATUS_OPTIONS } from "./Constants";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import { exportToExcel } from "../../../Util/Utility";
function Billinghistory() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [customerName, setCustomerName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectAllDates, setSelectAllDates] = useState(false);
    const formatDate = (date) => date.toISOString().split('T')[0];
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const todayFormatted = formatDate(today);
    const sevenDaysAgoFormatted = formatDate(sevenDaysAgo);
    useEffect(() => {
        setStartDate(sevenDaysAgoFormatted);
        setEndDate(todayFormatted);
        getBillinghistoryAllData({});
    }, []);
    const getBilllinghistoryCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const billingformattedRows = response.data.map((bill, index) => ({
                "Bill id": index + 1,
                "Date": bill.createdAt,
                "Customer Name": bill.customer.name,
                "Contact Number": bill.customer.contact_number,
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
            if (startDate) url += `&startDate=${startDate}`;
            if (endDate) url += `&endDate=${endDate}`;
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
        getBillinghistoryAllData({ contactNo, paymentStatus, customerName, startDate, endDate });
    }
    const handleResetFilter = () => {
        setContactNo("");
        setCustomerName("");
        setPaymentStatus("");
        setStartDate(sevenDaysAgoFormatted);
        setEndDate(todayFormatted);
        setSelectAllDates();
        getBillinghistoryAllData({});
    }

    const handleExportToExcel = () => {
        exportToExcel(rows, "BillingHistory.xlsx");
    };

    return (
        <div>
            {loading && <Spinner />}
            <div className='text-xl font-serif mb-4'>Billing History</div>
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
                <label className='flex items-center gap-2 text-sm'>
                    <input
                        type="checkbox"
                        checked={selectAllDates}
                        onChange={(e) => setSelectAllDates(e.target.checked)}
                    />
                    All Data
                </label>
                <InputComponent
                    type="date"
                    placeholder="Start Date"
                    inputClassName="w-[190px] mb-5"
                    value={startDate}
                    max={todayFormatted}
                    onChange={(e) => handleDateChange(e.target.value, setStartDate)}
                    disabled={selectAllDates}
                />
                <InputComponent
                    type="date"
                    placeholder="End Date"
                    inputClassName="w-[190px] mb-5"
                    value={endDate}
                    min={startDate}
                    max={todayFormatted}
                    onChange={(e) => handleDateChange(e.target.value, setEndDate)}
                    disabled={selectAllDates}
                />
            </div>
            <div className='flex justify-end mb-2'>
                <PrimaryButtonComponent
                    label="Search"
                    buttonClassName=" py-1 px-5 text-xl font-bold"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    buttonClassName="ml-5 py-1 px-5 text-xl font-bold"
                    onClick={handleResetFilter}
                />
                <PrimaryButtonComponent
                    label="Export to Excel"
                    buttonClassName="ml-5 py-1 px-5 text-xl font-bold"
                    onClick={handleExportToExcel} 
                />
            </div>
            <div>
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