import { useEffect, useState, useCallback } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import { toast } from "react-toastify";
import CustomPopUpComponent from "../../CustomComponents/CustomPopUpComponent/CustomPopUpComponent";
function Supplier() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [supplierName, setSupplierName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(null);
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const [allColumns, setAllColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [hiddenDropdownColumns, setHiddenDropdownColumns] = useState([]);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [pendingAmount, setPendingAmount] = useState(0);

    const [showTotalRow, setShowTotalRow] = useState(false);

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


    useEffect(() => {
        if (!selectedSupplier) return;

        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);

        const paidTotal = cash + online + cardAmt;

        const pending = selectedSupplier.pending_amount - paidTotal;
        setPendingAmount(pending);
    }, [cashAmount, card, onlineAmount, selectedSupplier]);

    const navigateAddSupplier = () => {
        navigate("/addsupplier")
    }

    const getSupplierCallBack = useCallback((response) => {
        console.log('response: ', response);

        if (response.status === 200) {
            const supplierFormattedRows = response.data.users.map((supplier) => ({
                "Name": supplier.name,
                "Contact Number": supplier.contact_number,
                "GST Number": supplier.gst_number,
                "State": supplier.state,
                "Address": supplier.address,
                "Contact Number 2": supplier.contact_number2,
                "Firm Name": supplier.firm_name,
                "Supplier Type": supplier.type,
                "Total Amount": supplier.payable_amount,
                "Paid Amount": supplier.paid_amount?.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
                "Remaining Amount": supplier.pending_amount,
                "Actions": (
                    <div className="flex gap-2 justify-end">
                        <div
                            title="Edit"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/addsupplier/${supplier._id}`);
                            }}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-pencil text-gray-700 text-sm" />
                        </div>
                        {Number(supplier.pending_amount) > 0 && (
                            <PrimaryButtonComponent
                                label="Pay"
                                icon="fa fa-inr"
                                iconOnly={true}
                                buttonClassName="py-1 px-3 text-[12px] font-semibold"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handlePayClick(supplier);
                                }}
                                disabled={Number(supplier.pending_amount) === 0}

                            />
                        )}
                    </div>
                ),
                id: supplier._id
            }));

            setTotalRow({
                _id: "total",
                "Total Amount": Number(response.data.payable_amount_of_all_users || 0).toLocaleString("en-IN"),
                "Paid Amount": Number(response.data.paid_amount_of_all_users || 0).toLocaleString("en-IN"),
                "Remaining Amount": Number(response.data.pending_amount_of_all_users || 0).toLocaleString("en-IN"),
            });

            setRows(supplierFormattedRows);
            const supplierMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Supplier"
            );
            if (supplierMenuItem) {
                const showCols =
                    supplierMenuItem.show_table_columns.map(col => col.name);

                const hiddenCols =
                    supplierMenuItem.hidden_dropdown_table_columns?.map(col => col.name);

                setAllColumns([...showCols, ...hiddenCols]); //  all
                setColumns(showCols);                        //  only visible
                setHiddenColumns(hiddenCols);                //  hidden
                setHiddenDropdownColumns(hiddenCols);        // checkbox list
            }
        } else {
            console.log("Error");
        }
    }, [navigate]);
    const getSupplierAllData = useCallback(({ supplierName, contactNo } = {}) => {
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
        getSupplierAllData();
    }, [getSupplierAllData]);


    const handleSearchFilter = () => {
        getSupplierAllData({ supplierName, contactNo });
    }
    const handleResetFilter = () => {
        setSupplierName('');
        setContactNo('');
        getSupplierAllData();
    }
    const handlePayClick = (supplier) => {
        if (Number(supplier.pending_amount) === 0) return;
        setSelectedSupplier(supplier);
        setPendingAmount(Number(supplier.pending_amount));
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(true);
    };

    const handleCancelPopup = () => {
        setSelectedSupplier(null);
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setPendingAmount(0);
        setShowPaymentPopup(false);
    };

    const handleSupplierPaymentCallback = (response) => {
        if (response.status === 200) {
            toast.success("Payment supplier updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            handleCancelPopup();
            getSupplierAllData();
        }
    };

    const handleSavePayment = () => {
        if (!selectedSupplier) return;

        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const paidTotal = cash + online + cardAmt;

        const updatedPayment = {
            payable_amount: selectedSupplier.payable_amount,
            paid_amount: [
                { method: "cash", amount: cash },
                { method: "online", amount: online },
                { method: "card", amount: cardAmt },
            ],
            pending_amount: selectedSupplier.pending_amount - paidTotal,
        };
        apiCall({
            method: 'PUT',
            url: `${API_URLS.USERS}/payment/${selectedSupplier._id}`,
            data: updatedPayment,
            callback: handleSupplierPaymentCallback,
            setLoading: setLoading,
        });
        setShowPaymentPopup(false);
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
    };

    const handleRowClick = (row) => {
        navigate(`/supplierDetails/${row.id}`);
    };

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
                headers={columns}
                rows={rows}
                totalRow={totalRow}
                hiddenDropdownColumns={hiddenDropdownColumns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
                onRowClick={handleRowClick}
                showTotalRow={showTotalRow}

            />
            <div className="flex justify-end">
                <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
            {showPaymentPopup && selectedSupplier && (
                <CustomPopUpComponent
                    totalAmount={selectedSupplier.pending_amount}
                    pendingAmount={pendingAmount}
                    cashAmount={cashAmount}
                    onlineAmount={onlineAmount}
                    card={card}
                    setCashAmount={setCashAmount}
                    setOnlineAmount={setOnlineAmount}
                    setCard={setCard}
                    handleCancelButton={handleCancelPopup}
                    handleSaveButton={handleSavePayment}
                />
            )}
        </div>
    );
}
export default Supplier;
