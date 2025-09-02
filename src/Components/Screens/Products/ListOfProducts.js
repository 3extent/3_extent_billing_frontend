
import React, { useEffect, useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from '../../CustomComponents/DropdownCompoent/DropdownCompoent';
import { PRODUCT_COLOUMNS, STATUS_OPTIONS } from './Constants';
import { apiCall, Spinner } from '../../../Util/AxiosUtils';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
function ListOfProducts() {
    // const getTodayDate = () => new Date().toISOString().split("T")[0];
    const [rows, setRows] = useState([]);
    const [imeiNumber, setIMEINumber] = useState();
    const [grade, setGrade] = useState();
    const [modelName, setModelName] = useState();
    const [brandName, setBrandName] = useState('');
    const [status, setStatus] = useState('Available');
    const [brandOptions, setBrandOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    useEffect(() => {
        getProductsAllData({});
        getBrandsAllData();
    }, []);
    const getProductsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const productFormattedRows = response.data.map((product) => ({
                "Date": product.createdAt,
                "IMEI NO": product.imei_number,
                "Model": typeof product.model === 'object' ? product.model.name : product.model,
                "Brand": typeof product.brand === 'object' ? product.model.brand : product.model.brand.name,
                "Sales Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Barcode": product.barcode
            }))
            setRows(productFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getProductsAllData = ({ imeiNumber, grade, modelName, brandName, status }) => {
        let url = 'https://3-extent-billing-backend.vercel.app/api/products?';
        if (imeiNumber) {
            url += `&imei_number=${imeiNumber}`
        }
        if (grade) {
            url += `&grade=${grade}`
        }
        // else if (date) {
        //     const timestamp = new Date(date).getTime();
        //     url += `&createdAt=${timestamp}`
        // }
        if (modelName) {
            url += `&modelName=${modelName}`
        }
        if (brandName) {
            url += `&brandName=${brandName}`
        }
        if (status) {
            url += `&status=${status}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getProductsCallBack,
            setLoading: setLoading
        })
    }
    const getBrandsAllData = () => {
        let url = "https://3-extent-billing-backend.vercel.app/api/brands";
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBrandsCallBack,
            setLoading: setLoading

        })
    };
    const getBrandsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const brands = response.data.map(brand => brand.name);
            setBrandOptions(brands);
        } else {
            console.log("Error");
        }
    }
    const handleSearchFilter = () => {
        getProductsAllData({ imeiNumber, grade, modelName, brandName, status });
    }
    const handleResetFilter = () => {
        setModelName('');
        setGrade('');
        setIMEINumber('');
        setBrandName('');
        setStatus();
        getProductsAllData({});
    }
    return (
        <div className='w-full'>
            {loading && <Spinner />}
            <div className='text-xl font-serif'>List Of Products</div>
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="Enter IMEI NO"
                    inputClassName="mb-2 w-[190px]"
                    value={imeiNumber}
                    maxlength={15}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,15}$/.test(value)) {
                            setIMEINumber(value);
                        }
                    }}
                />
                <DropdownCompoent
                    placeholder="Select Brands"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    options={brandOptions}
                    className="mt-3 w-[190px]"
                />
                <InputComponent
                    type="text"
                    placeholder="Enter Models Name"
                    inputClassName="mb-2 w-[190px]"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                />
                < InputComponent
                    type="text"
                    placeholder="Enter Grade"
                    inputClassName="mb-2 w-[190px]"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={STATUS_OPTIONS}
                    className="w-[190px] mt-3"
                />
            </div>
            <div className='flex items-center gap-4 '>
                <InputComponent
                    type="date"
                    placeholder="Start Date"
                    inputClassName="w-[190px] mb-5"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <InputComponent
                    type="date"
                    placeholder="End Date"
                    inputClassName="w-[190px] mb-5"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <PrimaryButtonComponent
                    label="Search"
                    buttonClassName=" py-1 px-5 text-xl font-bold"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    buttonClassName="py-1 px-5 text-xl font-bold"
                    onClick={handleResetFilter}
                />
            </div>
            <div>
                <CustomTableCompoent
                    headers={PRODUCT_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    );
}
export default ListOfProducts;
