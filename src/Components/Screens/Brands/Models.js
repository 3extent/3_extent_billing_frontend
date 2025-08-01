
import { useEffect, useState } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { MODELS_COLOUMNS } from "./Constants";
import { apiCall, makeRequest } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
export default function Models() {
    const navigate = useNavigate();
    const navigateAddModels = () => {
        navigate("/addmodels")
    }
    const [rows, setRows] = useState([]);
    useEffect(() => {
        apiCall({
            method: 'GET',
            url: 'https://3-extent-billing-backend.vercel.app/api/models',
            data: {},
            callback: (response) => {
                console.log('response: ', response);
                if (response.status === 200) {
                    const modelFormattedaRows = response.data.map((model, index) => ({
                        "No": index + 1,
                        "Model Name": model.name,
                        "Qty": model.qty
                    }))
                    setRows(modelFormattedaRows);
                } else {
                    console.log("Error");
                }
            }
        })
    }, []);
    return (
        <div>
            <CustomHeaderComponent
                name="Models"
                label="Add Models"
                icon="fa fa-plus-circle"
                buttonclassName="py-1 text-sm"
                onClick={navigateAddModels}
                buttonClassName="py-1 px-3 text-sm font-bold" />
            <div>
                <InputComponent
                    type="text"
                    placeholder="Enter Models Name"
                    inputClassName="w-[20%] mb-5"
                />
            </div>
            <CustomTableCompoent
                headers={MODELS_COLOUMNS}
                rows={rows}
            />
        </div>
    );
}