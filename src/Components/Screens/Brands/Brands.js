
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { BRANDS_COLOUMNS } from "./Constants";
import { useEffect, useState } from "react";
import { makeRequest } from "../../../Util/AxiosUtils";
function Brands({ NavigateAddBrands }) {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        makeRequest({
            method: 'GET',
            url: 'https://3-extent-billing-backend.vercel.app/api/brands',
            data: {},
            callback: (response) => {
                console.log('response: ', response);
                if (response.status === 200) {
                    const brandsFormattedRows = response.data.map((brand, index) => ({
                        "No": index + 1,
                        "Brand Name": brand.name
                    }));
                    setRows(brandsFormattedRows);
                } else {
                    console.log("Error");
                }
            }
        })
    }, []);
    return (
        <div className='w-full'>
            <CustomHeaderComponent
                name="Brands"
                label="Add Brands"
                buttonclassName="py-1 text-sm"
                className="w-[full] mt-2 "
                icon="fa fa-plus-circle"
                onClick={NavigateAddBrands} />
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="Enter Brand Name"
                    inputClassName="w-full"
                />

            </div>
            <div>
                <CustomTableCompoent
                    headers={BRANDS_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    );
} export default Brands;
