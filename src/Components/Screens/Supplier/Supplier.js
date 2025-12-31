import { useEffect, useState, useCallback } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";
function Supplier() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [supplierName, setSupplierName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [pendingAmount, setPendingAmount] = useState(0);

    useEffect(() => {
         if (!selectedSupplier) return;
        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const paidTotal = cash + online + cardAmt;
        const pending = pendingAmount - paidTotal;
        setPendingAmount(pending);
    }, [cashAmount, card, onlineAmount]);

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
                "Supplier Type": supplier.type,
                "Total Supplier Cost": supplier.total_supplier_cost,
                "Total Paid": supplier.total_paid,
                "Total Remaining":supplier.total_supplier_Remaining,
                "Action": (
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
                        <PrimaryButtonComponent
                            label="Pay"
                            buttonClassName="py-1 px-3 text-[12px] font-semibold"
                            onClick={(event) => {
                                event.stopPropagation();
                                handlePayClick(supplier);
                            }}
                        />
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
    const handlePayClick = (supplier) => {
        setSelectedSupplier(supplier);
        // setPendingAmount((supplier.total_supplier_cost || 0) - (supplier.total_paid || 0));
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(true);
    };

    const handleCancelPopup = () => {

        // setSelectedSupplier("");
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
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
            <div className="h-[75vh]">
                <CustomTableCompoent
                    headers={SUPPLIER_COLUMNS}
                    rows={rows}
                    onRowClick={handleRowClick}

                />
            </div>
            {showPaymentPopup && selectedSupplier && (
                <CustomPopUpComponet
                    totalAmount={selectedSupplier.total_supplier_cost || 0}
                    pendingAmount={pendingAmount}
                    cashAmount={cashAmount}
                    onlineAmount={onlineAmount}
                    card={card}
                    setCashAmount={setCashAmount}
                    setOnlineAmount={setOnlineAmount}
                    setCard={setCard}
                    handleCancelButton={handleCancelPopup}
                // handleSaveButton={handleSavePayment} 
                />
            )}

        </div>
    );
}
export default Supplier;
