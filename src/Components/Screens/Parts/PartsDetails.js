import { Navigate, useNavigate, useParams } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { PARTS_DETAILS_HEADERS } from "./Constants";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";

function PartsDetails() {
    const navigate = useNavigate();
    const { shop_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [totalRow, setTotalRow] = useState(null);
    const [imeiNumber, setIMEINumber] = useState("");
    const [repairerName, setRepairerName] = useState('');
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
        const today = moment().format("YYYY-MM-DD");
        if (value > today) setDate(today);
        else setDate(value);
    };
    const getPartsDetailsCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            console.log('response: ', response);
            const shop = response.data.user;
            const partsRows = shop.repair_activities.map((activity) => ({
                "Repair Started": activity.product.repair_started_at
                    ? moment(activity.product.repair_started_at).format("ll")
                    : "-",
                "Repair Completed": activity.product.repair_completed_at
                    ? moment(activity.product.repair_completed_at).format("ll")
                    : "-",
                "IMEI NO": activity.product.imei_number,
                Model: activity.product.model.name,
                "Part Name": activity.part_name,
                "Amount": activity.cost,
                "Repairer Name": activity.repairer?.name || "",
                id: activity._id,
            }));
            setTotalRow({
                _id: "total",
                "Amount": Number(response.data.total_payable_amount_of_parts || 0).toLocaleString("en-IN"),

            });
            setRows(partsRows);
        }
    }
    const getPartsDetails = ({ imeiNumber, repairerName, from, to, selectAllDates } = {}) => {
        if (!shop_id) return;
        setLoading(true);
        let url = `${API_URLS.USERS}/${shop_id}?`;
        if (imeiNumber) url += `&imei_number=${imeiNumber}`;
        if (repairerName) url += `&repairer_name=${repairerName}`;
        if (!selectAllDates) {
            if (from) url += `&repair_from=${moment.utc(from).startOf("day").valueOf()}`;
            if (to) url += `&repair_to=${moment.utc(to).endOf("day").valueOf()}`;
        }

        apiCall({
            method: "GET",
            url,
            data: {},
            callback: getPartsDetailsCallback,
            setLoading,
        });
    };
    useEffect(() => {
        getPartsDetails({ from, to, selectAllDates });
    }, [shop_id]);
    const handleSearchFilter = () => {
        getPartsDetails({ imeiNumber, repairerName, from, to, selectAllDates });
    };

    const handleResetFilter = () => {
        setIMEINumber("");
        setRepairerName("");
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getPartsDetails({ from: fromDate, to: toDate });
    };
    return (
        <div className="w-full">
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Single Shop Details"
                label="Back"
                icon="fa fa-arrow-left"
                onClick={handleBack}
                buttonClassName="py-1 px-3 text-sm font-bold"

            />
            <div className="flex items-center gap-4 mt-4 mb-4">
                <InputComponent
                    type="text"
                    placeholder="Enter IMEI NO"
                    numericOnly
                    maxLength={15}
                    value={imeiNumber}
                    onChange={(e) => setIMEINumber(e.target.value)}
                    inputClassName="mb-2 w-[190px]"
                />
                <InputComponent
                    type="text"
                    placeholder="Repairer Name"
                    value={repairerName}
                    onChange={(e) => setRepairerName(e.target.value)}
                    inputClassName="w-[190px] mb-2"
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
                headers={PARTS_DETAILS_HEADERS}
                rows={rows}
                maxHeight="h-[60vh]"
                totalRow={totalRow}
                showTotalRow={showTotalRow}
            />
            <div className="flex justify-end">
                <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    )
} export default PartsDetails;