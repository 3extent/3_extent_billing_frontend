import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
import { makeRequest } from "../../../Util/AxiosUtils";
function Supplier() {
    const [rows,setRows] =useState([]);
    useEffect(() => {
        makeRequest({
            method: 'GET',
            url: 'https://3-extent-billing-backend.vercel.app/api/users?role=SUPPLIER',
            data: {},
            callback: (response) => {
                console.log('response: ', response);
                if (response.status === 200) {
                   const supplierFormattedRows = response.data.map((supplier) => ({
                    "Supplier Name": supplier.name,
                    "Contact No": supplier.contact_number,
                    "GST No": supplier.gst_number,
                    "State": supplier.state,            
                    "Balance": supplier.balance,          
                    "Supplier Type": supplier.type
                }));
                setRows(supplierFormattedRows);
                } else {
                    console.log("Error");
                }
            }
        })
    }, []);
    return (
        <div className="w-full">
            <div className="text-xl font-serif">List Of Suppiler Information</div>
            <div className="grid grid-cols-4 items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Suppiler Name"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                />
            </div>
            <CustomTableCompoent
                headers={SUPPLIER_COLUMNS}
                rows={rows}
            />

        </div>
    );
}
export default Supplier;