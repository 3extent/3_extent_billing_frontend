import { useEffect } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { SUPPLIER_COLUMNS } from "./Constants";
import { makeRequest } from "../../../Util/AxiosUtils";
function Supplier() {
    const rows = [
        {
            "Supplier Name": "Nikita Kadam",
            "Contact No": "1234567890",
            "GST No": "27ABCDE1234F1Z5",
            "State": "Maharastra",
            "Balance": "70000",
            "Supplier Type": "wholesale",
        },
        {
            "Supplier Name": "Shardul Pawar",
            "Contact No": "1234567890",
            "GST No": "27ABCDE1234F1Z5",
            "State": "Maharastra",
            "Balance": "80000",
            "Supplier Type": "wholesale",
        }
    ];
    useEffect(() => {
        makeRequest({
            method: 'GET',
            url: 'https://3-extent-billing-backend.vercel.app/api/users?role=SUPPLIER',
            data: {},
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
        <div className="w-full">
            <div className="text-xl font-serif">List Of Suppiler Information</div>
            <div className="grid grid-cols-4 items-center gap-4 ">
                <InputComponent
                    type="text"
                    placeholder="Suppiler Name"
                />
                <InputComponent
                    type="text"
                    placeholder="Contact No"
                />
            </div>
            <CustomTableCompoent
                headers={SUPPLIER_COLUMNS}
                rows={rows}
            />

        </div>
    );
}
export default Supplier;