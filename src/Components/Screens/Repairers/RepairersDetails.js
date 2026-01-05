import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { Spinner } from "../../../Util/AxiosUtils";
import { REPAIRER_DETAILS_HEADERS, STATUS_OPTIONS } from "../Repair/Constants";
import { toast } from "react-toastify";
import moment from "moment";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";

export default function RepairersDetails() {
    const navigate = useNavigate();
    const { repairer_id } = useParams();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [imeiNumber, setIMEINumber] = useState('');
    const [totalRow, setTotalRow] = useState(null);
    const fromDate = moment().format("YYYY-MM-DD");
    const toDate = moment().format("YYYY-MM-DD");

    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);
    const [selectAllDates, setSelectAllDates] = useState(false);
    const [showTotalRow, setShowTotalRow] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleDateChange = (value, setDate) => {
        const today = moment().format('YYYY-MM-DD');
        if (value > today) {
            setDate(today);
        } else {
            setDate(value);
        }
    };
    const getRepairerDetailsCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            const repairer = response.data.user;
            const repairedFormattedRows = repairer.products.map((item) => ({
                "Repair Started": item.repair_started_at
                    ? moment(item.repair_started_at).format("ll")
                    : "-",
                "Repair Completed": item.repair_completed_at
                    ? moment(item.repair_completed_at).format("ll")
                    : "-",
                "IMEI NO": item.imei_number,
                Model: item.model.name,
                "Purchase Price": item.purchase_price,
                "Part Cost": item.part_cost,
                "Repairer Cost": item.repairer_cost,
                Status: item.status,
                id: item._id
            }));
            setTotalRow({
                _id: "total",
                "Purchase Price": Number(response.data.purchase_total_of_all_products || 0).toLocaleString("en-IN"),
                "Part Cost": Number(response.data.total_parts_cost_used || 0).toLocaleString("en-IN"),
                "Repairer Cost": Number(response.data.total_payable_amount || 0).toLocaleString("en-IN"),
            });
            console.log("Formatted Repairer Rows:", repairedFormattedRows);
            setRows(repairedFormattedRows);
        } else {
            toast.error("Failed to fetch repairer details");
        }
    };
    const getRepairerDetails = ({ imeiNumber, status, from, to, selectAllDates } = {}) => {
        if (!repairer_id) return;
        setLoading(true);
        let url = `${API_URLS.USERS}/${repairer_id}?`;
        if (status === "AVAILABLE & REPAIRED") {
            url += "&status=AVAILABLE&is_repaired=true";
        } else if (status === "IN_REPAIRING") {
            url += "&status=IN_REPAIRING";
        }

        if (imeiNumber) url += `&imei_number=${imeiNumber}`;
        if (!selectAllDates) {
            if (from) url += `&repair_from=${moment.utc(from).valueOf()}`;
            if (to) url += `&repair_to=${moment.utc(to).endOf("day").valueOf()}`;
        }
        apiCall({
            method: "GET",
            // url: `${API_URLS.USERS}/${repairer_id}`,
            url: url,
            data: {},
            callback: getRepairerDetailsCallback,
            setLoading: setLoading
        });
    };

    useEffect(() => {
        getRepairerDetails({ from, to, selectAllDates, status });
    }, [repairer_id]);
    const handleSearchFilter = () => {
        getRepairerDetails({ imeiNumber, status, from, to, selectAllDates });
    };
    const handleResetFilter = () => {
        setIMEINumber("");
        setStatus("");
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);

        getRepairerDetails({ from: fromDate, to: toDate });
    };
    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Repairer Details"
                label="Back"
                icon="fa fa-arrow-left"
                onClick={handleBack}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="flex items-center gap-4 mt-4">
                <input
                    type="text"
                    placeholder="Enter IMEI NO"
                    value={imeiNumber}
                    onChange={(e) => setIMEINumber(e.target.value)}
                    className="border p-2 rounded w-[180px]"
                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={STATUS_OPTIONS}
                    className="w-[190px] mt-2"
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
                    inputClassName="w-[180px] mb-5"
                    value={from}
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />

                <InputComponent
                    type="date"
                    inputClassName="w-[180px] mb-5"
                    value={to}
                    onChange={(e) => handleDateChange(e.target.value, setTo)}
                    disabled={selectAllDates}
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    onClick={handleResetFilter}
                />
            </div>
            <CustomTableCompoent
                maxHeight="h-[60vh]"
                headers={REPAIRER_DETAILS_HEADERS}
                rows={rows}
                totalRow={totalRow}
                showTotalRow={showTotalRow}
            />
            <div className="flex justify-end">
                <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}
