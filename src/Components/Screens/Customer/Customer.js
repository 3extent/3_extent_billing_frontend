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
    const navigateAddCustomer = () => {
        navigate("/addcustomer")
    }
    const [rows, setRows] = useState([]);
    useEffect(() => {
        getCustomerAllData();
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
    const getCustomerAllData = () => {
        apiCall({
            method: 'GET',
            url: 'https://3-extent-billing-backend.vercel.app/api/users?role=CUSTOMER',
            data: {},
            callback: getCustomerCallBack,
        })
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
            <div className="flex items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Customer Name"
                    inputClassName="mb-5"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    inputClassName="mb-5"
                />
                <DropdownCompoent
                    options={CUSTOMER_TYPE_OPTIONS}
                    placeholder="Select Customer Type"
                />
                <PrimaryButtonComponent
                    label="Search"
                    buttonClassName=" py-1 px-5 text-xl font-bold"
                />
                <PrimaryButtonComponent
                    label="Reset"
                    buttonClassName=" py-1 px-5 text-xl font-bold"
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