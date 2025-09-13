import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { CUSTOMER_COLOUMS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { exportToExcel } from "../../../Util/Utility.js";
export default function Customer() {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState();
    const [contactNo, setContactNumber] = useState();
    const [loading, setLoading] = useState(false);
    const navigateAddCustomer = () => {
        navigate("/addcustomer")
    }
    const [rows, setRows] = useState([]);
    useEffect(() => {
        getCustomerAllData({});
    }, []);
    const getCustomerCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const customerFormttedRows = response.data.map((customer) => ({
                "Customer Name": customer.name,
                "Contact No": customer.contact_number,
                "Address": customer.address,
                "State": customer.state,
                "GST No": customer.gst_number,
                "PAN No": customer.pan_number,
                id: customer._id
            }))
            setRows(customerFormttedRows);
        } else {
            console.log("Error");
        }
    }
    const getCustomerAllData = ({ customerName, contactNo }) => {
        let url = 'https://3-extent-billing-backend.vercel.app/api/users?role=CUSTOMER';
        if (customerName) {
            url += `&name=${customerName}`
        } if (contactNo) {
            url += `&contact_number=${contactNo}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getCustomerCallBack,
            setLoading: setLoading
        })
    }
    const handleSearchFilter = () => {
        getCustomerAllData({ customerName, contactNo });
    }
    const handleResetFilter = () => {
        setContactNumber('');
        setCustomerName('');
        getCustomerAllData({});
    }
    const handleExportToExcel = () => {
        exportToExcel(rows, "CustomerData.xlsx");
    };
    const handleRowClick = (row) => {
        if (row?.id) {
            navigate(`/addcustomer/${row.id}`);
        }
    };
    return (
        <div className="w-full">
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="List Of Customer Information"
                label="Add Customer"
                icon="fa fa-plus-circle"
                onClick={navigateAddCustomer}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="flex items-center gap-4 mb-5">
                <InputComponent
                    type="text"
                    placeholder="Customer Name"
                    inputClassName="w-[190px]"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    inputClassName="w-[190px]"
                    value={contactNo}
                    onChange={(e) => setContactNumber(e.target.value)}
                    maxLength={10}
                />
                <PrimaryButtonComponent
                    label="Search"
                    buttonClassName="mt-5 py-1 px-5 text-xl font-bold"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    buttonClassName="mt-5 py-1 px-5 text-xl font-bold"
                    onClick={handleResetFilter}
                />
                <PrimaryButtonComponent
                    label="Export to Excel"
                    buttonClassName="mt-5 py-1 px-5 text-xl font-bold"
                    onClick={handleExportToExcel}
                />
            </div>
            <div>
                <CustomTableCompoent
                    headers={CUSTOMER_COLOUMS}
                    rows={rows}
                    onRowClick={handleRowClick}
                />
            </div>
        </div>
    );
}