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
function Billinghistory() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false)
    const [customerName, setCustomerName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');
    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);
    const [selectAllDates, setSelectAllDates] = useState(false);
    useEffect(() => {
        setFrom(from);
        setTo(to);
        getBillinghistoryAllData({ from, to });
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
                _id: bill._id,
                "Actions": (
                    <PrimaryButtonComponent
                        label="print"
                        icon="fa fa-print"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={() => generateAndSavePdf(
                            bill.customer.name,
                            bill.customer.contact_number,
                            bill.customer.address,
                            bill.customer.gst_number,
                            rows,
                        )
                        }
                    />
                )
            }));
            console.log("Formatted Billing Rows: ", billingformattedRows);
            setRows(billingformattedRows);
        } else {
            console.log("Error");
        }
    }
    const getBillinghistoryAllData = ({ contactNo, paymentStatus, customerName, from, to, selectAllDates }) => {
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
    const handleSearchFilter = () => {
        getBillinghistoryAllData({ contactNo, paymentStatus, customerName, from, to, selectAllDates });
    }
    const handleResetFilter = () => {
        setContactNo("");
        setCustomerName("");
        setPaymentStatus("");
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(selectAllDates);
        getBillinghistoryAllData({ from, to, selectAllDates });
    }
    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif">Billing History</div>
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
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />
                <InputComponent
                    type="date"
                    placeholder="End Date"
                    inputClassName="w-[190px] mb-5"
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