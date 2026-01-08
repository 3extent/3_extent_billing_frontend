import { useCallback, useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import { apiCall } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CustomTextAreaComponent from "../../CustomComponents/CustomTextAreaComponent/CustomTextAreaComponent";
import { EXPENSETITLE_COLOUMNS } from "./Constant";

function AddExpense() {

    const navigate = useNavigate();
    const [imageBase64, setImageBase64] = useState("");
    const [paidByOptions, setPaidByOptions] = useState([]);
    const today = moment().format("YYYY-MM-DD");
    const [errors, setErrors] = useState("");

    const [maintenanceData, setMaintenanceData] = useState({
        title: "",
        description: "",
        paid_by: "",
        date: today,
        amount: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setErrors(prev => ({ ...prev, [name]: "" }));
        setMaintenanceData({ ...maintenanceData, [name]: value });
    };

    const handleDateChange = (e) => {
        setMaintenanceData({
            ...maintenanceData,
            date: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result);
        };
        reader.readAsDataURL(file);
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

    useEffect(() => {
        getAdmins();
    }, [getAdmins]);


    const handleValidation = () => {
        const newErrors = {};
        if (!maintenanceData.title.trim()) {
            newErrors.title = "Please select expense title";
        }
        if (!maintenanceData.description.trim()) {
            newErrors.description = "Description is required";
        }
        if (!maintenanceData.paid_by.trim()) {
            newErrors.paid_by = "Please select paid by required";
        }
        if (!maintenanceData.amount.trim()) {
            newErrors.amount = "Amount is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addMaintenanceCallback = (response) => {
        if (response.status === 200) {
            toast.success("Expense added successfully!!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate(-1);
        }
        else {
            const errorMsg = response?.data?.error || "Failed to add Expense";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };


    const saveMaintenance = () => {
        if (!handleValidation()) return;
        const requestData = {
            ...maintenanceData,
            date: moment.utc(maintenanceData.date, "YYYY-MM-DD").valueOf(),
            image: imageBase64,
        };
        apiCall({
            method: "POST",
            url: API_URLS.MAINTENANCE,
            data: requestData,
            callback: addMaintenanceCallback,
        });
    };

    const handleBack = () => {
        navigate(-1);
    };
    
    return (
        <div className="w-full">

            <div className="text-xl font-serif mb-6">Add Expense</div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <DropdownCompoent
                    label="Expense Title"
                    name="title"
                    options={EXPENSETITLE_COLOUMNS}
                    placeholder="Select expense title"
                    value={maintenanceData.title}
                    onChange={handleInputChange}
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                    error={errors.title}
                />

                <CustomTextAreaComponent
                    label="Description"
                    name="description"
                    value={maintenanceData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    rows={1}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    error={errors.description}
                />

                <InputComponent
                    label="Amount"
                    name="amount"
                    type="text"
                    value={maintenanceData.amount}
                    onChange={handleInputChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    error={errors.amount}
                />

                <InputComponent
                    label="Date"
                    name="date"
                    type="date"
                    value={maintenanceData.date}
                    onChange={handleDateChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />

                <DropdownCompoent
                    label="Paid By"
                    name="paid_by"
                    options={paidByOptions}
                    placeholder="Select Paid By"
                    value={maintenanceData.paid_by}
                    onChange={handleInputChange}
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                    error={errors.paid_by}
                />

                <InputComponent
                    label="Upload Image"
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
            </div>

            <div className="mt-10 flex justify-center gap-5">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                />

                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-save"
                    onClick={saveMaintenance}
                />
            </div>
        </div>
    );
} export default AddExpense;