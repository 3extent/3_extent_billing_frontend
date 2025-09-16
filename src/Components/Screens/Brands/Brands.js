
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { BRANDS_COLOUMNS } from "./Constants";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
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
            const brandsFormattedRows = response.data.map((brand, index) => ({
                "No": index + 1,
                "Brand Name": brand.name,
                "Action": (
                    <div className="flex justify-end">
                        <div
                            title="Edit"
                            onClick={() => navigate(`/addbrands/${brand._id}`)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-pencil text-gray-700 text-sm" />
                        </div>
                    </div>
                ),

                id: brand._id
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
    return (
        <div className='w-full'>
            {loading && <Spinner />}
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
                    icon="fa fa-search"
                    buttonClassName="mt-1 py-1 px-5"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    buttonClassName="mt-1 py-1 px-5"
                    onClick={handleResetFilter}
                />
            </div>
            <div  className="h-[500px]">
                <CustomTableCompoent
                    headers={BRANDS_COLOUMNS}
                    rows={rows}
                    maxHeight="h-full"
                />
            </div>
        </div>
    );
} export default Brands;
