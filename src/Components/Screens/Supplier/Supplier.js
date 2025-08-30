import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
function Supplier() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [supplierName, setSupplierName] = useState();
    const [contactNo, setContactNo] = useState();
        const [loading, setLoading] = useState(false);
    const navigateAddSupplier = () => {
        navigate("/addsupplier")
    }
    useEffect(() => {
        getSupplierAllData({});
    }, []);
    const getSupplierCallBack = (response) => {
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
    const getSupplierAllData = ({ supplierName, contactNo }) => {
        let url = "https://3-extent-billing-backend.vercel.app/api/users?role=SUPPLIER"
        if (supplierName) {
            url += `&name=${supplierName}`
        } if (contactNo) {
            url += `&contact_number=${contactNo}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getSupplierCallBack,
             setLoading: setLoading
        })
    }
    const handleSearchFilter = () => {
        getSupplierAllData({ supplierName, contactNo });
    }
    const handleResetFilter = () => {
        setSupplierName('');
        setContactNo('');
        getSupplierAllData({});
    }
    return (
        <div className="w-full">
             {loading && <Spinner/>}
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
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    inputClassName="w-[190px]"
                />
                <InputComponent
                    type="number"
                    placeholder="Contact No"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    inputClassName="w-[190px]"
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
            <CustomTableCompoent
                headers={SUPPLIER_COLUMNS}
                rows={rows}
            />
        </div>
    );
}
export default Supplier;
