import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { CUSTOMER_COLOUMS, CUSTOMER_TYPE_OPTIONS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
export default function Customer() {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState();
    const [contactNo, setContactNumber] = useState();
    const [customerType, setCustomerType] = useState();
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
                "Customer Type": customer.type,
                "Address": customer.address,
                "state": customer.state,
                "GST No": customer.gst_number,
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
        } if (customerType) {
            url += `&type=${customerType}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getCustomerCallBack,
        })
    }
    const handleSearchFilter = () => {
        getCustomerAllData({ customerName, contactNo });
    }
    const handleResetFilter = () => {
        setContactNumber('');
        setCustomerName('');
        setCustomerType('');
        getCustomerAllData({});
    }
    return (
        <div className="w-full">
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
                    type="number"
                    placeholder="Contact No"
                    inputClassName="w-[190px]"
                    value={contactNo}
                    onChange={(e) => setContactNumber(e.target.value)}
                />
                <DropdownCompoent
                    options={CUSTOMER_TYPE_OPTIONS}
                    placeholder="Select Customer Type"
                    value={customerType}
                    onChange={(value) => setCustomerType(value)}
                    className="w-[200px] mt-6"
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
            </div>
            <div>
                <CustomTableCompoent
                    headers={CUSTOMER_COLOUMS}
                    rows={rows}
                />
            </div>
        </div>
    );
}