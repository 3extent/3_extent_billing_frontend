
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { BRANDS_COLOUMNS } from "./Constants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { exportToExcel } from "../../../Util/Utility";
function Brands() {
    const [rows, setRows] = useState([]);
    const [brandName, setBrandName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const navigateAddBrands = () => {
        navigate("/addbrands")
    }
    useEffect(() => {
        getBrandsAllData({});
    }, []);
    const getBrandsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const brandsFormattedRows = response.data.map((brand,index) => ({
                "No":index + 1,
                "Brand Name": brand.name
            }));
            setRows(brandsFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getBrandsAllData = ({ brandName }) => {
        let url = "https://3-extent-billing-backend.vercel.app/api/brands";
        if (brandName) {
            url += `?name=${brandName}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBrandsCallBack,
                 setLoading: setLoading
        })
    };
    const handleSearchFilter = () => {
        getBrandsAllData({ brandName });
    }
    const handleResetFilter = () => {
        setBrandName('');
        getBrandsAllData({});
    }
    
    const handleExportToExcel = () => {
        exportToExcel(rows, "BrandsData.xlsx");  
    };
    return (
        <div className='w-full'>
             {loading && <Spinner/>}
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
                <PrimaryButtonComponent
                    label="Export to Excel"
                    buttonClassName="mt-1 py-1 px-5 text-xl font-bold"
                    onClick={handleExportToExcel} 
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
