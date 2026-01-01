import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { REPAIR_OPTIONS, STATUS_OPTIONS } from "./Constants";
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import AcceptRepair from "./AcceptRepair";
import { toast } from "react-toastify";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import moment from "moment";
function Repair() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("IN_REPAIRING");
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [imeiNumber, setIMEINumber] = useState();

    const fromDate = moment().format("YYYY-MM-DD");
    const toDate = moment().format("YYYY-MM-DD");

    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);
    const [selectAllDates, setSelectAllDates] = useState(false);
    const [showTotalRow, setShowTotalRow] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const toggleableColumns = ["Engineer Name", "Repairer Remark"];
    const [hiddenColumns, setHiddenColumns] = useState([...toggleableColumns]);
    const [dynamicHeaders, setDynamicHeaders] = useState(() => {
        return REPAIR_OPTIONS.filter(col => !toggleableColumns.includes(col));
    });

    const navigateAddRepair = () => {
        navigate("/addrepair")
    }
    const toggleColumn = (columnName) => {
        if (!toggleableColumns.includes(columnName)) return;

        if (dynamicHeaders.includes(columnName)) {
            setDynamicHeaders(dynamicHeaders.filter(col => col !== columnName));
            setHiddenColumns([...hiddenColumns, columnName]);
        } else {
            let newHeaders = [...dynamicHeaders];
            const actionIndex = newHeaders.indexOf("Action");
            if (actionIndex !== -1) {
                newHeaders.splice(actionIndex, 0, columnName);
            } else {
                newHeaders.push(columnName);
            }
            setDynamicHeaders(newHeaders);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        }
    };

    const getRepairsCallBack = (response) => {
        console.log("API Response:", response);
        if (response.status === 200) {
            const repairFormattedRows = response.data.products.map((repair) => ({
                _id: repair._id,
                "Repair Started": repair.repair_started_at
                    ? moment(repair.repair_started_at).format("ll")
                    : "-",
                "Repair Completed": repair.repair_completed_at
                    ? moment(repair.repair_completed_at).format("ll")
                    : "-",

                IMEI: repair.imei_number,
                Brand: repair.model?.brand?.name,
                Model: repair.model?.name,
                Grade: repair.grade,
                "Purchase Price": repair.purchase_price,
                "Part Cost": repair.part_cost,
                "Repairer Cost": repair.repairer_cost,
                "Engineer Name": repair.engineer_name,
                "Repairer Remark": repair.repair_remark,
                "Repairer": repair.repair_by?.name,
                Accessories: repair.accessories,
                Status: repair.status,
                Action: repair.status === "IN_REPAIRING" && (
                    <PrimaryButtonComponent
                        label="Accept"
                        buttonClassName="py-1 px-3 text-sm bg-green-600 text-white rounded"
                        onClick={() => {
                            console.log("Selected repair object:", repair);
                            setSelectedRepair(repair);
                            setModalOpen(true);
                        }}
                    />
                ),
            }));
            repairFormattedRows.push({
                _id: "total",
                "Purchase Price": Number(response.data.purchase_total_of_all_products || 0).toLocaleString("en-IN"),
                "Part Cost": Number(response.data.part_cost_of_all_products || 0).toLocaleString("en-IN"),
                "Repairer Cost": Number(response.data.repairer_cost_of_all_products || 0).toLocaleString("en-IN"),
            });
            console.log("Formatted Rows:", repairFormattedRows);
            setRows(repairFormattedRows);
        } else {
            console.log("Error fetching repairs");
        }
    };
    // const getAllRepairs = ({ imeiNumber, }) => {
    const getAllRepairs = ({ imeiNumber, status, from, to, selectAllDates } = {}) => {
        console.log("Status selected:", status, "IMEI:", imeiNumber);
        let url = `${API_URLS.PRODUCTS}?`;
        if (status === "AVAILABLE & REPAIRED") {
            url += "status=AVAILABLE&is_repaired=true";
        } else if (status === "IN_REPAIRING") {
            url += "status=IN_REPAIRING";
        }
        if (imeiNumber) {
            url += `&imei_number=${imeiNumber}`
        }
        if (!selectAllDates) {
            if (from) url += `&repair_from=${moment.utc(from).valueOf()}`;
            if (to) url += `&repair_to=${moment.utc(to).endOf("day").valueOf()}`;
        }
        apiCall({
            method: "GET",
            url,
            data: {},
            callback: getRepairsCallBack,
            setLoading
        });
    };
    const handleDateChange = (value, setDate) => {
        const today = moment().format("YYYY-MM-DD");
        if (value > today) {
            setDate(today);
        } else {
            setDate(value);
        }
    };
    const handleSearchFilter = () => {
        getAllRepairs({ imeiNumber, status, from, to, selectAllDates });
    }
    const handleResetFilter = () => {
        setIMEINumber('');
        setStatus("IN_REPAIRING");
        // getAllRepairs();
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getAllRepairs({ from: fromDate, to: toDate, status });
    }
    const acceptRepairCallback = (response) => {
        setLoading(false);
        setModalOpen(false);
        setSelectedRepair(null);

        if (response.status === 200) {
            toast.success("Repair accepted successfully!");
            getAllRepairs({ imeiNumber, status, from, to, selectAllDates });
        } else {
            toast.error("Failed to accept repair");
            console.error(response);
        }
    };
    const handleAcceptSubmit = ({ partCost, repairerCost, grade, remark, imei }) => {
        if (!selectedRepair?._id) {
            toast.error("Repair ID missing!");
            return;
        }

        setLoading(true);

        const payload = {
            part_cost: partCost,
            repairer_cost: repairerCost,
            repair_remark: remark,
            status: "REPAIRED",
            grade: grade,
            imei_number: imei,
            repair_by: selectedRepair.repair_by?._id,
        };
        apiCall({
            method: "PUT",
            url: `${API_URLS.PRODUCTS}/${selectedRepair._id}/repair`,
            data: payload,
            callback: acceptRepairCallback,
        });
    };

    // useEffect(() => {
    //     getAllRepairs();
    // }, []);
    useEffect(() => {
        getAllRepairs({ from, to, selectAllDates, status });
    }, []);
    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Repair Dashboard"
                label="Send for Repair"
                icon="fa fa-plus-circle"
                onClick={navigateAddRepair}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="flex items-center gap-4">
                <InputComponent
                    placeholder="Enter IMEI NO"
                    value={imeiNumber}
                    maxLength={15}
                    numericOnly={true}
                    inputClassName="mb-2 w-[190px]"
                    labelClassName="font-serif font-bold"
                    onChange={(e) => setIMEINumber(e.target.value)}

                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={STATUS_OPTIONS}
                    className="w-[190px] mt-3"
                />
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={selectAllDates}
                        onChange={(e) => setSelectAllDates(e.target.checked)}
                    />
                    All Data
                </label>

                <InputComponent
                    type="date"
                    inputClassName="w-[190px] mb-5"
                    value={from}
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />

                <InputComponent
                    type="date"
                    inputClassName="w-[190px] mb-5"
                    value={to}
                    onChange={(e) => handleDateChange(e.target.value, setTo)}
                    disabled={selectAllDates}
                />

                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    onClick={handleSearchFilter}
                    buttonClassName="mt-1 py-1 px-5"
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    onClick={handleResetFilter}
                    buttonClassName="mt-1 py-1 px-5"
                />
            </div>
            {rows.length > 0 && (
                <div className="relative mb-2">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="px-2 py-1 border rounded hover:bg-gray-200"
                        title="Show columns"
                    >
                        <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                    </button>
                    {showDropdown && (
                        <div className="absolute bg-white border shadow-md mt-1 rounded w-48 z-10 max-h-48 overflow-auto">
                            {toggleableColumns.map((col) => (
                                <label
                                    key={col}
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={dynamicHeaders.includes(col)}
                                        onChange={() => toggleColumn(col)}
                                        className="mr-2"
                                        onFocus={() => setShowDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
                                    />
                                    {col}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="h-[60vh]">
                <CustomTableCompoent
                    headers={dynamicHeaders}
                    rows={rows}
                    showTotalRow={showTotalRow}
                />
            </div>
            <div className="flex justify-end">
                <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
            <AcceptRepair
                open={modalOpen}
                repair={selectedRepair}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAcceptSubmit}
            />
        </div>

    )
} export default Repair;
