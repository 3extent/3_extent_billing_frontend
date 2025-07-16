
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
export default function Models() {
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
                label="Add"
                className="w-[30%] mt-2 py-1 "
                icon="fa fa-plus-circle"
            />
            <div>
                <InputComponent
                    type="text"
                    placeholder="Enter Models Name"
                    inputClassName="w-full"
                />
            </div>
            <CustomTableCompoent
                headers={headers}
                rows={rows}
            />
        </div>
    );
}