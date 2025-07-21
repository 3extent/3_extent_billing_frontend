
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
export default function Models({ NavigateAddModels }) {
    const headers = [
        "No",
        "Model Name",
        "Qty"
    ];
    const rows = [{
        "No": 1,
        "Model Name": "Apple iphone 6",
        "Qty": 2
    },
    {
        "No": 2,
        "Model Name": "samsung s25 ultra",
        "Qty": 1
    },
    ]
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
                headers={headers}
                rows={rows}
            />
        </div>
    );
}