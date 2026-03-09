import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useEffect, useState } from "react";
import { API_URLS } from "../../../Util/AppConst";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import moment from "moment";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import CustomTableComponent from "../../CustomComponents/CustomTableComponent/CustomTableComponent";

function MaintenanceDashboard() {
    const [title, setTitle] = useState();
    const fromDate = moment().subtract('days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');
    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);
    const [selectAllDates, setSelectAllDates] = useState(false);
    const [totalRow, setTotalRow] = useState(null);
    const [showTotalRow, setShowTotalRow] = useState(false);
    const [loading, setLoading] = useState(false);
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const [columns, setColumns] = useState([]);
    const navigate = useNavigate();
    const navigateAddMaintanance = () => {
        navigate("/addExpense")
    }
    const [rows, setRows] = useState([]);
    const getMaintenanceCallBack = (response) => {
        if (response.status === 200) {
            const maintenanceFormattedRows = response.data?.maintenanceCriteriaList.map((expense, index) => ({
                "Serial Number": index + 1,
                "Expense Title": expense.title,
                "Total Amount": expense.total_expenses_of_maintenance_criteria,
                id: expense._id
            }));

            setTotalRow({
                _id: "total",
                "Total Amount": Number(response.data.total_expenses_of_maintenance || 0).toLocaleString("en-IN"),
            });

            setRows(maintenanceFormattedRows);
            const maintenanceDashboardMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Maintenance"  && item.name?.level !== 1
            );

            if (maintenanceDashboardMenuItem) {
                const headers = maintenanceDashboardMenuItem.show_table_columns.map(col => col.name);
                setColumns(headers);
            } else {
                setColumns([]);
            }

        } else {
            console.log("Failed to fetch maintenance data");
        }
    };

    const getMaintenanceData = ({ title, from, to, selectAllDates } = {}) => {

        let url = `${API_URLS.MAINTENANCE_CRITERIA}?`;
        if (title) {
            url += `&title=${title}`
        }

        if (!selectAllDates) {
            if (from) url += `&from=${moment.utc(from).startOf('day').valueOf()}`;
            if (to) url += `&to=${moment.utc(to).endOf('day').valueOf()}`;
        }

        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getMaintenanceCallBack,
            setLoading: setLoading
        });

    };

    useEffect(() => {
        setFrom(fromDate);
        setTo(toDate);
        getMaintenanceData({ from, to });
    }, []);

    const handleDateChange = (value, setDate) => {
        const today = moment().format('YYYY-MM-DD');
        if (value > today) {
            setDate(today);
        } else {
            setDate(value);
        }
    };

    const handleSearchFilter = () => {
        getMaintenanceData({ title, from, to, selectAllDates });
    }

    const handleResetFilter = () => {
        setTitle('');
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getMaintenanceData({ title, from, to });
    }

    const handleRowClick = (row) => {
        navigate(`/singleExpenseDetails/${row.id}`);
    };

    return (
        <div>
            {loading && <Spinner />}
            <div className="mb-5">

                <CustomHeaderComponent
                    name="Maintenance Dashboard"
                    icon="fa fa-plus-circle"
                    label="Add Expense"
                    onClick={navigateAddMaintanance}
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />

            </div>
            <div>

                <div className='flex items-center gap-4'>

                    <InputComponent
                        type="text"
                        placeholder="Enter Expense Title"
                        inputClassName="mb-5 w-[190px]"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className='flex items-center gap-2 text-sm'>
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
                    />

                    <PrimaryButtonComponent
                        label="Reset"
                        icon="fa fa-refresh"
                        onClick={handleResetFilter}
                    />

                </div>
            </div>

            <CustomTableComponent
                maxHeight="h-[55vh]"
                headers={columns}
                rows={rows}
                totalRow={totalRow}
                onRowClick={handleRowClick}
                showTotalRow={showTotalRow}
            />
            {rows.length > 0 && (
                <div className="flex justify-end">
                    <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                        <i className="fa fa-circle-o" aria-hidden="true"></i>
                    </button>
                </div>
            )}

        </div>
    )
} export default MaintenanceDashboard;