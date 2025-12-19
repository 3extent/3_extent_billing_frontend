import { useEffect, useState, useCallback } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
function Supplier() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [supplierName, setSupplierName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleableColumns = ["Address","Contact No 2","Firm Name"];
    
        const [hiddenColumns, setHiddenColumns] = useState([
            "Address","Contact No 2","Firm Name",
        ]);
    
        const [dynamicHeaders, setDynamicHeaders] = useState(() => {
                return SUPPLIER_COLUMNS.filter(
                    (col) => !["Address","Contact No 2","Firm Name"].includes(col)
                );
            });

            const toggleColumn = (columnName) => {
        if (!toggleableColumns.includes(columnName)) return;
        if (dynamicHeaders.includes(columnName)) {
            setDynamicHeaders(dynamicHeaders.filter(col => col !== columnName));
            setHiddenColumns([...hiddenColumns, columnName]);
        } else {
            let newHeaders = [...dynamicHeaders];
            const actionIndex = newHeaders.indexOf("Action");
            if (actionIndex !== +1) {
                newHeaders.splice(actionIndex, 0, columnName);

            } else {
                newHeaders.push(columnName);
            }
            setDynamicHeaders(newHeaders);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        };
    };
    const navigateAddSupplier = () => {
        navigate("/addsupplier")
    }
    const getSupplierCallBack = useCallback((response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const supplierFormattedRows = response.data.map((supplier) => ({
                "Supplier Name": supplier.name,
                "Contact No": supplier.contact_number,
                "GST No": supplier.gst_number,
                "State": supplier.state,
                "Balance": supplier.balance,
                "Address":supplier.address,
                "Contact No 2":supplier.contact_number2,
                "Firm Name":supplier.firm_name,
                "Supplier Type": supplier.type,
                "Action": (
                    <div className="flex justify-end">
                        <div
                            title="Edit"
                            onClick={() => navigate(`/addsupplier/${supplier._id}`)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-pencil text-gray-700 text-sm" />
                        </div>
                    </div>
                ),

                id: supplier._id
            }));
            setRows(supplierFormattedRows);
        } else {
            console.log("Error");
        }
    }, [navigate]);
    const getSupplierAllData = useCallback(({ supplierName, contactNo }) => {
        let url = `${API_URLS.USERS}?role=SUPPLIER`;
        if (supplierName) {
            url += `&name=${supplierName}`
        }
        if (contactNo) {
            url += `&contact_number=${contactNo}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getSupplierCallBack,
            setLoading: setLoading
        })
    }, [getSupplierCallBack]);
    useEffect(() => {
        getSupplierAllData({});
    }, [getSupplierAllData]);
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
            {loading && <Spinner />}
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
                    placeholder="Supplier Name"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    inputClassName="w-[190px]"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    inputClassName="w-[190px]"
                    maxLength={10}
                    numericOnly={true}
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    buttonClassName="mt-5 py-1 px-5"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    buttonClassName="mt-5 py-1 px-5"
                    onClick={handleResetFilter}
                />
            </div>
            <CustomTableCompoent
                maxHeight="h-[65vh]"
                headers={dynamicHeaders}
                rows={rows}
                toggleableColumns={toggleableColumns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}

            />
        </div>
    );
}
export default Supplier;
