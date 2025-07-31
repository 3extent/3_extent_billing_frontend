
import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { MODELS_COLOUMNS } from "./Constants";
export default function Models() {
    const navigate=useNavigate();
    const navigateAddModels=()=>{
        navigate("/addmodels")
    }
    const rows = [{
        "No": 1,
        "Model Name": "Apple iphone 6",
        "Qty": 2
    },
    {
        "No": 2,
        "Model Name": "samsung s25 ultra",
        "Qty": 1
    }
    ]
    return (
        <div>
            <CustomHeaderComponent
                name="Models"
                label="Add Models"
                icon="fa fa-plus-circle"
                buttonclassName="py-1 text-sm"
                onClick={navigateAddModels} 
                buttonClassName="py-1 px-3 text-sm font-bold"/>
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