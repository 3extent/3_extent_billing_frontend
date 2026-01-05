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
import { handleBarcodePrint } from "../../../Util/Utility";
function RepairDashboard() {
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
    const [totalRow, setTotalRow] = useState(null);
    const [showTotalRow, setShowTotalRow] = useState(false);
    const toggleableColumns = [
        "Purchase Price",
        "Repairer Remark",
        "Engineer Name"
    ];

    const [hiddenColumns, setHiddenColumns] = useState([
        "Purchase Price",
        "Repairer Remark",
        "Engineer Name"
    ]);

    const [dynamicHeaders, setDynamicHeaders] = useState(() => {
        return REPAIR_OPTIONS.filter(
            (col) =>
                !["Purchase Price", "Repairer Remark", "Engineer Name"].includes(col)
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
            if (actionIndex !== -1) {
                newHeaders.splice(actionIndex, 0, columnName);
            } else {
                newHeaders.push(columnName);
            }

            setDynamicHeaders(newHeaders);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        }
    };


    const navigateAddRepair = () => {
        navigate("/sendforrepair")
    }


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
            setTotalRow({
                _id: "total",
                "Purchase Price": Number(response.data.purchase_total_of_all_products || 0).toLocaleString("en-IN"),
                "Part Cost": Number(response.data.part_cost_of_all_products || 0).toLocaleString("en-IN"),
                "Repairer Cost": Number(response.data.repairer_cost_of_all_products || 0).toLocaleString("en-IN"),
            });
            setRows(repairFormattedRows);

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
            url += "&status=AVAILABLE&is_repaired=true";
        } else if (status === "IN_REPAIRING") {
            url += "&status=IN_REPAIRING";
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
            toast.success("Repair accepted successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            if (selectedRepair.imei_number !== response.data.imei_number) {

                handleBarcodePrint([{
                    modelName: response.data.model.name,
                    grade: response.data.grade,
                    imei_number: response.data.imei_number
                }])
                getAllRepairs({ imeiNumber, status, from, to, selectAllDates });
            } else {
                getAllRepairs({ imeiNumber, status, from, to, selectAllDates });
            }

        } else {
            toast.error("Failed to accept repair!", {
                position: "top-center",
                autoClose: 2000,
            });
            console.error(response);
        }
    };
    const handleAcceptSubmit = ({ partCost, repairerCost, grade, remark, imei, qc_remark, }) => {
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
            qc_remark: qc_remark,
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
            <CustomTableCompoent
                maxHeight="h-[60vh]"
                headers={dynamicHeaders}
                rows={rows}
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
            <AcceptRepair
                open={modalOpen}
                repair={selectedRepair}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAcceptSubmit}
            />
        </div>

    )
} export default RepairDashboard;
