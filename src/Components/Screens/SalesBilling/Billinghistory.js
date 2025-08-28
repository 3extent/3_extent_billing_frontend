import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS, PAYMENTSTATUS_OPTIONS } from "./Constants";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall } from "../../../Util/AxiosUtils";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";

function Billinghistory() {
    const [rows, setRows] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [date, setDate] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    useEffect(() => {
        getBillinghistoryAllData({});
    }, []);
    const getBilllinghistoryCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const billingformattedRows = response.data.map((bill) => ({
                "Bill id": bill.bill_id,
                "Date": bill.createdAt,
                "Customer Name": bill.customer.name,
                "Contact Number": bill.customer.contact_number
            }));
            console.log("Formatted Billing Rows: ", billingformattedRows);
            setRows(billingformattedRows);
        } else {
            console.log("Error");
        }
    }
    const getBillinghistoryAllData = ({ contactNo, paymentStatus, customerName }) => {
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

        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBilllinghistoryCallBack,
        })
    }
    const handleSearchFilter = () => {
        getBillinghistoryAllData({ contactNo, paymentStatus, customerName });
    }
    const handleResetFilter = () => {
        setContactNo("");
        setCustomerName("");
        setPaymentStatus("");
        setDate("");
        getBillinghistoryAllData({});
    }
    return (
        <div>
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
                    type="number"
                    placeholder="Contact No"
                    inputClassName="w-[190px] mb-5"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    options={PAYMENTSTATUS_OPTIONS}
                    className="w-[190px]"
                />
                <InputComponent
                    type="date"
                    placeholder="Date"
                    inputClassName="w-[190px] mb-5"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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
            </div>
            <div>
                <CustomTableCompoent
                    headers={BILLINGHISTORY_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    )

}
export default Billinghistory;