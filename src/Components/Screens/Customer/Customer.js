import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { CUSTOMER_COLOUMS } from "./Constants";
import { makeRequest } from "../../../Util/AxiosUtils";
export default function Customer() {
    const [rows,setRows]=useState([]);
     useEffect(() => {
            makeRequest({
                method: 'GET',
                url: 'https://3-extent-billing-backend.vercel.app/api/users?role=CUSTOMER',
                data: {},
                callback: (response) => {
                    console.log('response: ', response);
                    if (response.status === 200) {
                        const customerFormttedRows=response.data.map((customer)=>({
                            "Customer Name":customer.name,
                            "Contact No":customer.contact_number,
                            "Customer Type":customer.type,
                            "Address":customer.address,
                            "state":customer.state,
                            "GST No":customer.gst_number,
                        }))
                        setRows(customerFormttedRows);
                    } else {
                        console.log("Error");
                    }
                }
            })
        }, []);
    const CostomerTypes = ['a', 'b'];
    return (
        <div className="w-full">
            <div className="text-xl font-serif">List Of Customer Information</div>
            <div className="flex items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Customer Name"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                />
                <DropdownCompoent
                    options={CostomerTypes}
                    placeholder="Select Customer Type"
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