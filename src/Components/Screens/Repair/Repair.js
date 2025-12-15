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
function Repair() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [imeiNumber, setIMEINumber] = useState();
    const navigateAddRepair = () => {
        navigate("/addrepair")
    }
    const getRepairsCallBack = (response) => {
        console.log("API Response:", response);
        if (response.status === 200) {
            const repairFormattedRows = response.data.map((repair) => ({
                _id: repair._id,
                IMEI: repair.imei_number || "-",
                Brand: repair.model?.brand?.name || "-",
                Model: repair.model?.name || "-",
                Grade: repair.grade || "-",
                "Purchase Price": repair.purchase_price || "-",
                Charges: repair.repair_cost !== null ? repair.repair_cost : "-",
                "Engineer Name": repair.engineer_name || "-",
                "Repairer Remark": repair.repair_remark || "-",
                "Repairer": repair.repair_by?.name || "-",
                Accessories: repair.accessories || "-",
                Status: repair.status || "-",
                Action: repair.status === "IN_REPAIRING" && (
                    <PrimaryButtonComponent
                        label="Accept"
                        buttonClassName="py-1 px-3 text-sm bg-green-600 text-white rounded"
                        onClick={() => {
                            setSelectedRepair(repair);
                            setModalOpen(true);
                        }}
                    />
                ),

            }));
            console.log("Formatted Rows:", repairFormattedRows);
            setRows(repairFormattedRows);
        } else {
            toast.error("Error fetching repairs");
        }
    };
    // const getAllRepairs = ({ imeiNumber, }) => {
    const getAllRepairs = ({ imeiNumber, status } = {}) => {
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
        apiCall({
            method: "GET",
            url,
            data: {},
            callback: getRepairsCallBack,
            setLoading
        });
    };
    const handleSearchFilter = () => {
        getAllRepairs({ imeiNumber, status });
    }
    const handleResetFilter = () => {
        setIMEINumber('');
        setStatus('');
        getAllRepairs();
    }
    const acceptRepairCallback = (response) => {
        setLoading(false);
        setModalOpen(false);
        setSelectedRepair(null);

        if (response.status === 200) {
            toast.success("Repair accepted successfully!");
            getAllRepairs();
        } else {
            toast.error("Failed to accept repair");
            console.error(response);
        }
    };
    const handleAcceptSubmit = ({ charges, grade, remark }) => {
        if (!selectedRepair?._id) {
            toast.error("Repair ID missing!");
            return;
        }

        setLoading(true);

        const payload = {
            repair_cost: charges,
            grade,
            repair_remark: remark,
            status: "REPAIRED",
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
        getAllRepairs();
    }, []);
    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="List Of Repair Information"
                label="Add Repair"
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
            <div className="h-[75vh]">
                <CustomTableCompoent
                    headers={REPAIR_OPTIONS}
                    rows={rows}
                />
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
