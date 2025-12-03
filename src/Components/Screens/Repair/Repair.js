import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { REPAIR_OPTIONS } from "./Constants";
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";


function Repair() {
    const navigate = useNavigate();
    // const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigateAddRepair = () => {
        navigate("/addrepair")
    }
    const rows = [
        { Brand: "apple" }
    ];
    const getRepairsCallBack = (response) => {
        if (response.status === 200) {
            const repairFormattedRows = response.data.map((repair) => ({
                Brand: repair.brand_name,
                Model: repair.model_name,
                IMEI: repair.imei_number,
                Grade: repair.grade,
                PurchasePrice: repair.purchase_price,
                Engineer: repair.engineer_name,
                Charges: repair.charges,
                Issue: repair.issue,
                Repairer: repair.repairer_name,
                Accessories: repair.accessories,
                id: repair._id
            }));
            // setRows(repairFormattedRows);
        } else {
            console.log("Error fetching repairs");
        }
    };
    const getAllRepairs = () => {
        apiCall({
            method: "GET",
            url: API_URLS.REPAIRS,
            data: {},
            callback: getRepairsCallBack,
            setLoading: setLoading
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
            <div className="mb-10 mt-5">
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
            </div>
            <div className="h-[75vh]">
                <CustomTableCompoent
                    headers={REPAIR_OPTIONS}
                    rows={rows}
                />
            </div>
        </div>

    )
} export default Repair;
