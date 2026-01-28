import { useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { CUSTOMER_COLOUMS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import CustomTableComponent from "../../CustomComponents/CustomTableComponent/CustomTableComponent";
export default function Customer() {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState();
    const [contactNo, setContactNumber] = useState();
    const [loading, setLoading] = useState(false);
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const [allColumns, setAllColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [hiddenDropdownColumns, setHiddenDropdownColumns] = useState([]);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const toggleColumn = (columnName) => {
        setColumns(columns => {
            if (columns.includes(columnName)) {
                return columns.filter(col => col !== columnName);
            }
            let newColumns = [...columns];
            const actionIndex = newColumns.indexOf("Actions");
            if (actionIndex !== -1) {
                newColumns.splice(actionIndex, 0, columnName);
            } else {
                newColumns.push(columnName);
            }
            return newColumns;
        });

        setHiddenColumns(columns =>
            columns.includes(columnName)
                ? columns.filter(col => col !== columnName)
                : [...columns, columnName]
        );
    };

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
            const customerFormttedRows = response.data.users.map((customer) => ({
                "Name": customer.name,
                "Contact Number": customer.contact_number,
                "Firm Name": customer.firm_name,
                "Address": customer.address,
                "State": customer.state,
                "GST Number": customer.gst_number,
                "PAN Number": customer.pan_number,
                "Actions": (
                    <div className="flex justify-end">
                        <div
                            title="Edit"
                            onClick={() => navigate(`/addcustomer/${customer._id}`)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-pencil text-gray-700 text-sm" />
                        </div>
                    </div>
                ),
                id: customer._id
            }))
            setRows(customerFormttedRows);

            const customersMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Customer"
            );
            if (customersMenuItem) {
                const showCols =
                    customersMenuItem.show_table_columns.map(col => col.name);

                const hiddenCols =
                    customersMenuItem.hidden_dropdown_table_columns?.map(col => col.name);

                setAllColumns([...showCols, ...hiddenCols]);
                setColumns(showCols);
                setHiddenColumns(hiddenCols);
                setHiddenDropdownColumns(hiddenCols);
            }

        } else {
            console.log("Error");
        }
    }
    const getCustomerAllData = ({ customerName, contactNo }) => {
        let url = `${API_URLS.USERS}?role=CUSTOMER`;
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
                    numericOnly={true}
                    maxLength={10}
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
            <CustomTableComponent
                maxHeight="h-[65vh]"
                headers={columns}
                rows={rows}
                hiddenDropdownColumns={hiddenDropdownColumns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
            />
        </div>
    );
}
