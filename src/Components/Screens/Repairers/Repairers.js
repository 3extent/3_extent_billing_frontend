import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { REPAIRERS_OPTIONS } from "../Repair/Constants";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useCallback, useEffect, useState } from "react";
import { API_URLS } from "../../../Util/AppConst";
import { toast } from "react-toastify";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";

function Repairers() {
    const navigate = useNavigate();
    const navigateAddRepairers = () => {
        navigate("/addrepairers")
    }

    const [totalRow, setTotalRow] = useState(null);
    const [rows, setRows] = useState([]);
    const [repairerName, setRepairerName] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [selectedRepairer, setSelectedRepairer] = useState(null);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [pendingAmount, setPendingAmount] = useState(0);
    const [showTotalRow, setShowTotalRow] = useState(false);
    const toggleableColumns = ["State", "Address", "GST Number"];

    const [hiddenColumns, setHiddenColumns] = useState([
        "State",
        "Address",
        "GST Number"
    ]);

    const [dynamicHeaders, setDynamicHeaders] = useState(() => {
        return REPAIRERS_OPTIONS.filter(
            (col) => !["State", "Address", "GST Number"].includes(col)
        );
    });
    const toggleColumn = (columnName) => {
        if (!toggleableColumns.includes(columnName)) return;

        if (dynamicHeaders.includes(columnName)) {
            setDynamicHeaders(dynamicHeaders.filter(col => col !== columnName));
            setHiddenColumns([...hiddenColumns, columnName]);
        } else {
            let newHeaders = [...dynamicHeaders];

            const actionIndex = newHeaders.indexOf("Actions");
            if (actionIndex !== -1) {
                newHeaders.splice(actionIndex, 0, columnName);
            } else {
                newHeaders.push(columnName);
            }

            setDynamicHeaders(newHeaders);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        }
    };


    const getRepairersCallback = useCallback((response) => {
        console.log("API Response:", response);
        if (response.status === 200) {
            const RepairedFormattedRows = response.data.users.map((repairer) => ({
                "Repairer Name": repairer.name,
                "Firm Name": repairer.firm_name,
                "GST Number": repairer.gst_number,
                "Contact": repairer.contact_number,
                "State": repairer.state,
                "Address": repairer.address,
                "Total Part Cost": repairer.total_part_cost,
                "Total Repairer Cost": repairer.payable_amount,
                "Total Paid": repairer.paid_amount?.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
                "Total Repairer Remaining": repairer.pending_amount,
                "Actions": (
                    <div className="flex gap-2 justify-end">
                        <div
                            title="Edit"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/addrepairers/${repairer._id}`);
                            }}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-pencil text-gray-700 text-sm" />
                        </div>
                        {Number(repairer.pending_amount) > 0 && (
                            <PrimaryButtonComponent
                                label="Pay"
                                buttonClassName="py-1 px-3 text-[12px] font-semibold"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePayClick(repairer);
                                }}
                                disabled={Number(repairer.pending_amount) === 0}
                            />
                        )}
                    </div>
                ),

                id: repairer._id
            }));
            setTotalRow({
                _id: "total",
                "Repairer Name": "Total",
                "Total Part Cost": Number(response.data.part_cost_of_all_users || 0).toLocaleString("en-IN"),
                "Total Repairer Cost": (response.data.payable_amount_of_all_users || 0).toLocaleString("en-IN"),
                "Total Paid": Number(response.data.paid_amount_of_all_users || 0).toLocaleString("en-IN"),
                "Total Repairer Remaining": Number(response.data.pending_amount_of_all_users || 0).toLocaleString("en-IN"),
            });

            setRows(RepairedFormattedRows);
            console.log("Formatted Rows:", RepairedFormattedRows);
        } else {
            const errorMsg = response?.data?.error || "Failed to fetch repairers";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    }, []);
    const getAllRepairers = useCallback(({ repairerName, contactNo } = {}) => {
        let url = `${API_URLS.USERS}?role=REPAIRER`;

        if (repairerName) url += `&name=${repairerName}`;
        if (contactNo) url += `&contact_number=${contactNo}`;
        console.log("Fetching repairers from URL:", url);
        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getRepairersCallback,
            setLoading: setLoading
        });
    }, [getRepairersCallback]);

    const handleSearchFilter = () => {
        console.log("Search clicked with:", { repairerName, contactNo });
        getAllRepairers({ repairerName, contactNo });
    }

    const handleResetFilter = () => {
        setRepairerName("");
        setContactNo("");
        console.log("Reset filters");
        getAllRepairers();
    };

    useEffect(() => {
        console.log("Component mounted: fetching all repairers");
        getAllRepairers();
    }, [getAllRepairers]);

    useEffect(() => {
        if (!selectedRepairer) return;
        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const paidTotal = cash + online + cardAmt;
        const pending = Number(selectedRepairer.pending_amount) - paidTotal;
        setPendingAmount(pending);
    }, [cashAmount, onlineAmount, card, selectedRepairer]);
    const handlePayClick = (repairer) => {
        if (Number(repairer.pending_amount) === 0) return;
        setSelectedRepairer(repairer);
        setPendingAmount(Number(repairer.pending_amount));
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(true);
    };
    const handleCancelPopup = () => {
        setShowPaymentPopup(false);
        setSelectedRepairer(null);
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setPendingAmount(0);
    };
    const handleRepairerPaymentCallback = (response) => {
        if (response.status === 200) {
            toast.success("Repairer payment updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            handleCancelPopup();
            getAllRepairers();
        } else {
            const errorMsg = response?.data?.error || "Repairer payment failed";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const handleSaveRepairerPayment = () => {
        if (!selectedRepairer) return;

        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const paidTotal = cash + online + cardAmt;
        console.log("Selected Repairer:", selectedRepairer.name);
        console.log("Cash Amount Entered:", cash);
        console.log("Online Amount Entered:", online);
        console.log("Card Amount Entered:", cardAmt);
        console.log("Total Paid Entered:", paidTotal);
        console.log("Repairer's Total Payable Amount:", selectedRepairer.payable_amount);
        console.log("Repairer's Total Paid Already:", selectedRepairer.total_paid);
        console.log("Calculated Pending Amount:", pendingAmount);
        const payload = {
            payable_amount: Number(selectedRepairer.pending_amount),
            total_part_cost: Number(selectedRepairer.total_part_cost),
            paid_amount: [
                { method: "cash", amount: cash },
                { method: "online", amount: online },
                { method: "card", amount: cardAmt },
            ],
            pending_amount: Number(selectedRepairer.pending_amount) - paidTotal,
        };
        console.log("Repairer Payment Payload:", payload);
        apiCall({
            method: "PUT",
            url: `${API_URLS.USERS}/payment/${selectedRepairer._id}`,
            data: payload,
            callback: handleRepairerPaymentCallback,
            setLoading: setLoading
        });
    };
    const handleRowClick = (row) => {
        navigate(`/repairerDetails/${row.id}`);
    };
    return (
        <div className="w-full">
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="List Of Repairer Information"
                label="Add Repairer"
                icon="fa fa-plus-circle"
                onClick={navigateAddRepairers}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="flex items-center gap-4 mb-5">
                <InputComponent
                    type="text"
                    placeholder="Repairer Name"
                    value={repairerName}
                    onChange={(e) => setRepairerName(e.target.value)}
                    inputClassName="w-[190px]"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    numericOnly={true}
                    maxLength={10}
                    inputClassName="w-[190px]"
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
                onRowClick={handleRowClick}
                totalRow={totalRow}
                showTotalRow={showTotalRow}
                toggleableColumns={toggleableColumns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
            />
            <div className="flex justify-end">
                <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
            {showPaymentPopup && selectedRepairer && (
                <CustomPopUpComponet
                    totalAmount={Number(selectedRepairer.pending_amount)}
                    pendingAmount={pendingAmount}
                    cashAmount={cashAmount}
                    onlineAmount={onlineAmount}
                    card={card}
                    setCashAmount={setCashAmount}
                    setOnlineAmount={setOnlineAmount}
                    setCard={setCard}
                    handleCancelButton={handleCancelPopup}
                    handleSaveButton={handleSaveRepairerPayment}
                />
            )}

        </div>
    )
} export default Repairers;