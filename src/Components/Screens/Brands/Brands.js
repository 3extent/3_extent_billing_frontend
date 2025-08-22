
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { BRANDS_COLOUMNS } from "./Constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall } from "../../../Util/AxiosUtils";
function Brands() {
    const [rows, setRows] = useState([]);
    const [brandName, setBrandName] = useState('');
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const navigateAddBrands = () => {
        navigate("/addbrands")
    }
    useEffect(() => {
        getBrandsAllData({});
    }, []);
    const getBrandsCallBack = (response) => {
        // setLoading(false);
        console.log('response: ', response);
        if (response.status === 200) {
            const brandsFormattedRows = response.data.map((brand) => ({
                "No": brand.brand_id,
                "Brand Name": brand.name
            }));
            setRows(brandsFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getBrandsAllData = ({ brandName }) => {
        // setLoading(true);
        let url = "https://3-extent-billing-backend.vercel.app/api/brands";
        if (brandName) {
            url += `?name=${brandName}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBrandsCallBack,
        })
    };
    const handleSearchFilter = () => {
        getBrandsAllData({ brandName });
    }
    const handleResetFilter = () => {
        setBrandName('');
        getBrandsAllData({});
    }
    return (
        <div className='w-full'>
            {/* {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-gray-600 border-b-transparent animate-spin [animation-direction:reverse]"></div>
                    </div>
                </div>
                // <div className="absolute inset-0 flex items-center justify-center">
                //     <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin border-t-black"></div>
                // </div>
            )} */}
            <CustomHeaderComponent
                name="Brands"
                label="Add Brands"
                icon="fa fa-plus-circle"
                onClick={navigateAddBrands}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="Enter Brand Name"
                    inputClassName="w-[190px] mb-5"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                />
                <PrimaryButtonComponent
                    label="Search"
                    buttonClassName="mt-1 py-1 px-5 text-xl font-bold"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    buttonClassName="mt-1 py-1 px-5 text-xl font-bold"
                    onClick={handleResetFilter}
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
