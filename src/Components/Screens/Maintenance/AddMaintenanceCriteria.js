import { toast } from "react-toastify";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import {  useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate } from "react-router-dom";

function AddMaintenanceCriteria() {
    const navigate = useNavigate();
    const [criteriaData, setCriteriaData] = useState({
        title: ""
    });
    const [error, setError] = useState({ title: "" });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setError(prev => ({ ...prev, [name]: "" }));
        setCriteriaData({ ...criteriaData, [name]: value });
    };

    const addExpenseTitleCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            console.log('response: ', response);
            toast.success("Criteria added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setCriteriaData({ title: "" });
            setTimeout(() => {
                navigate("/addExpense");
            }, 2000);

        } else {
            const errorMsg = response?.data?.error || "Something went wrong";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const submitExpenseTitle = () => {

        if (criteriaData.title.trim() === "") {
            setError({ title: "Please enter expense title" });
            return;
        }
        setError("");
        apiCall({
            method: "POST",
            url: API_URLS.MAINTENANCE_CRITERIA,
            data: criteriaData,
            callback: addExpenseTitleCallback,
            setLoading: setLoading,
        });
    }

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif mb-4"> Add Expense Title </div>

            {error.title && (
                <div className="text-red-600 mt-1 ml-1">
                    {error.title}
                </div>
            )}
            <InputComponent
                label="Expense Title"
                type="text"
                name="title"
                placeholder="Enter Expense Title"
                inputClassName="w-[40%]"
                labelClassName="font-bold"
                value={criteriaData.title}
                onChange={handleInputChange}
            />
            <div className="flex mt-10 gap-5">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-bookmark-o"
                    onClick={submitExpenseTitle}
                />
            </div>
        </div>
    );

} export default AddMaintenanceCriteria;