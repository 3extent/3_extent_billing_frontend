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


function Repair() {
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(STATUS_OPTIONS[0]);
    const [selectedRepair, setSelectedRepair] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
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
                "Repairer Name": repair.repair_remark || "-",
                Accessories: repair.accessories || "-",
                Status: repair.status || "-",
                Action: (
                    <button
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                        onClick={() => {
                            setSelectedRepair(repair);
                            setModalOpen(true);
                        }}
                    >
                        Accept
                    </button>
                ),
            }));
            console.log("Formatted Rows:", repairFormattedRows);
            setRows(repairFormattedRows);
        } else {
            console.log("Error fetching repairs");
        }
    };
    const getAllRepairs = () => {
        apiCall({
            method: "GET",
            url: `${API_URLS.PRODUCTS}?status=IN_REPAIRING,REPAIRED`,
            data: {},
            callback: getRepairsCallBack,
            setLoading
        });
    };
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
            <div className="mb-10 mt-5 grid grid-cols-4">
                <InputComponent
                    label="IMEI"
                    type="text"
                    name="imei_number"
                    placeholder="IMEI"
                    maxLength={15}
                    numericOnly={true}
                    inputClassName="w-[%]40"
                    labelClassName="font-serif font-bold"

                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={STATUS_OPTIONS}
                    className="w-[190px]"
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
