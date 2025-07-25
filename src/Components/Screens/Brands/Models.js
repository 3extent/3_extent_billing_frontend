
import { useEffect } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { MODELS_COLOUMNS } from "./Constants";
import { makeRequest } from "../../../Util/AxiosUtils";
export default function Models({ NavigateAddModels }) {
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
     useEffect(() => {
            makeRequest({
                method: 'GET',
                url: 'https://3-extent-billing-backend.vercel.app/api/users',
                data: rows,
                callback: (response) => {
                    console.log('response: ', response);
                    if (response.status === 200) {
                        console.log('response.data: ', response.data);
                        console.log("Success");
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
                onClick={NavigateAddModels} />
            <div>
                <InputComponent
                    type="text"
                    placeholder="Enter Models Name"
                    inputClassName="w-[20%]"
                />
            </div>
            <CustomTableCompoent
                headers={MODELS_COLOUMNS}
                rows={rows}
            />
        </div>
    );
}