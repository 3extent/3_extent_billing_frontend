import { useCallback, useEffect, useState } from "react";
import { SINGLE_EXPENSE_DETAILS_COLUMNS } from "./Constant";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import moment from "moment";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import DropdownComponent from "../../CustomComponents/DropdownComponent/DropdownComponent";
import CustomTableComponent from "../../CustomComponents/CustomTableComponent/CustomTableComponent";

function SingleExpenseDetails() {
    const location = useLocation();
    const [rows, setRows] = useState([]);
    const [expenseTitle, setExpenseTitle] = useState("");
    const [paidByOptions, setPaidByOptions] = useState();
    const [paidBy, setPaidBy] = useState("");
    const fromDate = moment().subtract('days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');
    // const [from, setFrom] = useState(fromDate);
    // const [to, setTo] = useState(toDate);
    // const [selectAllDates, setSelectAllDates] = useState(false);
    const [from, setFrom] = useState(location.state?.from || fromDate);

    const [to, setTo] = useState(location.state?.to || toDate);

    const [selectAllDates, setSelectAllDates] = useState(
        location.state?.selectAllDates || false
    );
    const [totalRow, setTotalRow] = useState(null);
    const [showTotalRow, setShowTotalRow] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const { expense_id } = useParams();
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const [columns, setColumns] = useState([]);
    const handleDateChange = (value, setDate) => {
        const today = moment().format('YYYY-MM-DD');
        if (value > today) {
            setDate(today);
        } else {
            setDate(value);
        }
    };

    const getSingleExpenseTitlecallback = (response) => {
        if (response.status === 200) {
            setExpenseTitle(response.data.maintenanceCriteria?.title);
            const singleExpenseTitleFormattedRows = response.data?.maintenanceCriteria?.activities.map((expense, index) => ({
                "Serial Number": index + 1,
                "Date": moment(expense.created_at).format('ll'),
                "Description": expense.description,
                "Amount": expense.amount,
                "Paid By": expense.paid_by?.name,
                id: expense._id
            }));
            setTotalRow({
                _id: "total",
                "Amount": Number(response.data.total_expenses_of_maintenance_criteria || 0).toLocaleString("en-IN"),
            });
            setRows(singleExpenseTitleFormattedRows);
            const singleExpenseSubMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Single Maintenance Criteria"
            );

            if (singleExpenseSubMenuItem) {
                const headers = singleExpenseSubMenuItem.show_table_columns.map(col => col.name);
                setColumns(headers);
            }

        } else {
            console.log("Failed to fetch maintenance data");
        }
    };

    const getSingleExpenseTitleData = ({ paidBy, from, to, selectAllDates } = {}) => {
        if (!expense_id) return;
        let url = `${API_URLS.MAINTENANCE_CRITERIA}/${expense_id}?`;

        if (paidBy) {
            url += `&paid_by=${paidBy}`
        }
        if (!selectAllDates) {
            if (from) url += `&from=${moment.utc(from).startOf('day').valueOf()}`;
            if (to) url += `&to=${moment.utc(to).endOf('day').valueOf()}`;
        }

        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getSingleExpenseTitlecallback,
            setLoading: setLoading
        });

    };

    const getAdminCallBack = (response) => {
        if (response.status === 200) {
            const admins = response.data.users.map(user => user.name);
            setPaidByOptions(admins);
        } else {
            console.log("Failed to fetch admin users");
        }
    };

    const getAdmins = useCallback(() => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.USERS}?role=ADMIN`,
            data: {},
            callback: getAdminCallBack,
        });
    }, []);


    const handleSearchFilter = () => {
        getSingleExpenseTitleData({ paidBy, from, to, selectAllDates });
    }

    const handleResetFilter = () => {
        setPaidBy("");
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getSingleExpenseTitleData({ paidBy, from, to });
    }

    useEffect(() => {
        // setFrom(fromDate);
        // setTo(toDate);
        getAdmins();
        getSingleExpenseTitleData({ from, to, selectAllDates });
    }, [expense_id, getAdmins]);

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <div>
            {loading && <Spinner />}
            <div>
                <CustomHeaderComponent
                    name={expenseTitle}
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />
            </div>

            <div className='flex items-center gap-4'>

                <DropdownComponent
                    placeholder="Paid By"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    options={paidByOptions}
                    className=" w-[190px]"
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

            <CustomTableComponent
                maxHeight="h-[55vh]"
                // headers={SINGLE_EXPENSE_DETAILS_COLUMNS}
                rows={rows}
                totalRow={totalRow}
                showTotalRow={showTotalRow}
                headers={columns}
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
}
export default SingleExpenseDetails;