import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
import { apiCall} from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
function Supplier() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const navigateAddSupplier = () => {
        navigate("/addsupplier")
    }
    useEffect(() => {
        apiCall({
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
            <CustomHeaderComponent
                name="List of Supplier Information"
                icon="fa fa-plus-circle"
                label="Add Supplier"
                onClick={navigateAddSupplier}
                buttonClassName="py-1 px-3 text-sm font-bold"

            />
            <div className="flex items-center gap-4 mb-5">
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