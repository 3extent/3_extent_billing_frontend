import { useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { SINGLE_EXPENSE_DETAILS_COLUMNS } from "./Constant";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import moment from "moment";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";

function SingleExpenseDetails() {
    // const [rows, setRows] = useState();
    const [title, setTitle] = useState();
    const fromDate = moment().subtract('days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');
    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);
    const [selectAllDates, setSelectAllDates] = useState(false);
    const navigate = useNavigate();
    const rows = [
        {
            "Sr.No": "1",
            "Expense Title": "AC Repair",
            "Date": "2025-12-01",
            "Amount": "500",
        },

        {
            "Sr.No": "2",
            "Expense Title": "Plumbing Fix",
            "Paid By": "Jane Smith",
            Date: "2025-12-05",
            "Amount": "300",
        },
    ];
    const handleDateChange = (value, setDate) => {
        const today = moment().format('YYYY-MM-DD');
        if (value > today) {
            setDate(today);
        } else {
            setDate(value);
        }
    };

    const getMaintenanceCallBack = (response) => {
        if (response.status === 200) {
            const maintenanceFormattedRows = response.data.map((expense, index) => ({
                "Sr.No": index + 1,
                "Date": moment(expense.created_at).format('ll'),
                "Expense Title": expense.title,
                "Description": expense.description,
                "Total Amount": expense.amount,
                id: expense._id
            }));
            // setRows(maintenanceFormattedRows);
        } else {
            console.log("Failed to fetch maintenance data");
        }
    };

    const getMaintenanceData = (({ title, from, to, selectAllDates }) => {
        let url = `${API_URLS.MAINTENANCE}?`;
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
        });
    }, []);

    const handleSearchFilter = () => {
        //  getMaintenanceData({ from, to, selectAllDates });
    }

    const handleResetFilter = () => {

        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        // getMaintenanceData({ from, to });
    }

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <div>
            <div>
                <CustomHeaderComponent
                    name="Single Expense Details"
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />
            </div>
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="Enter expense title"
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
            <CustomTableCompoent
                maxHeight="h-60vh"
                headers={SINGLE_EXPENSE_DETAILS_COLUMNS}
                rows={rows}
            />
        </div>
    )
}
export default SingleExpenseDetails;