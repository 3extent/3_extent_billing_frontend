
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { BRANDS_COLOUMNS } from "./Constants";
import { useEffect, useState } from "react";
import { apiCall } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
function Brands() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const navigateAddBrands = () => {
        navigate("/addbrands")
    }
    useEffect(() => {
        apiCall({
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
                icon="fa fa-plus-circle"
                onClick={navigateAddBrands}
                buttonClassName="py-1 px-3 text-sm font-bold" />

            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="Enter Brand Name"
                    inputClassName="w-[full] mb-5"
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
