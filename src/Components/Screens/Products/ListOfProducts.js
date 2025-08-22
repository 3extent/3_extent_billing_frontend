
import React, { useEffect, useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from '../../CustomComponents/DropdownCompoent/DropdownCompoent';
import { PRODUCT_COLOUMNS, STATUS_OPTIONS } from './Constants';
import { apiCall } from '../../../Util/AxiosUtils';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
function ListOfProducts() {
    // const getTodayDate = () => new Date().toISOString().split("T")[0];
    const [rows, setRows] = useState([]);
    const [imeiNumber, setIMEINumber] = useState();
    const [grade, setGrade] = useState();
    const [modelName, setModelName] = useState();
    const [brandName, setBrandName] = useState('');
    const [status, setStatus]=useState();
    const [brandOptions, setBrandOptions] = useState([]);
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    // const [date, setDate] = useState(getTodayDate);
    useEffect(() => {
        getProductsAllData();
        getBrandsAllData();
    }, []);
    const getProductsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const productFormattedRows = response.data.map((product) => ({
                "Date":product.createdAt,
                "IMEI NO": product.imei_number,
                "Product Name": typeof product.model === 'object' ? product.model.name : product.model,
                "Brand Name": typeof product.brand === 'object' ? product.model.brand : product.model.brand.name,
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
    const getProductsAllData = () => {
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
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getProductsCallBack,
        })
    }
    const getBrandsAllData = () => {
        let url = "https://3-extent-billing-backend.vercel.app/api/brands";
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBrandsCallBack,
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
        getProductsAllData();
    }
    const handleResetFilter = () => {
        //  setDate(getTodayDate());
        setModelName('');
        setGrade('');
        setIMEINumber('');
        setBrandName('');
        getProductsAllData();
    }
    return (
        <div className='w-full'>
            <div className='text-xl font-serif'>List Of Products</div>
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    inputClassName="w-[190px] mb-2"
                />
                <DropdownCompoent
                    placeholder="Select Brands"
                    value={brandName}
                    onChange={(value) => setBrandName(value)}
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
                <InputComponent
                    type="number"
                    placeholder="Enter IMEI NO"
                    inputClassName="mb-2 w-[190px]"
                    value={imeiNumber}
                    onChange={(e) => setIMEINumber(e.target.value)}
                />
                <InputComponent
                    type="text"
                    placeholder="Enter Grade"
                    inputClassName="mb-2 w-[190px]"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                />
            </div>
            <div className='flex items-center gap-4 mb-5'>
                <DropdownCompoent
                    placeholder="Select status"
                    value={status}
                    onChange={(value) => setStatus(value)}
                    options={STATUS_OPTIONS}
                    className="w-[190px]"
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
