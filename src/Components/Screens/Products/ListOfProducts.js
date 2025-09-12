
import React, { useEffect, useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from '../../CustomComponents/DropdownCompoent/DropdownCompoent';
import { PRODUCT_COLOUMNS, STATUS_OPTIONS } from './Constants';
import { apiCall, Spinner } from '../../../Util/AxiosUtils';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { exportToExcel, handleBarcodePrint } from '../../../Util/Utility';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
function ListOfProducts() {
    const [rows, setRows] = useState([]);
    const [imeiNumber, setIMEINumber] = useState();
    const [grade, setGrade] = useState();
    const [modelName, setModelName] = useState();
    const [brandName, setBrandName] = useState('');
    const [status, setStatus] = useState('Available');
    const [brandOptions, setBrandOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [selectAllDates, setSelectAllDates] = useState(false);
    const formatDate = (date) => date.toISOString().split('T')[0];
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const todayFormatted = formatDate(today);
    const sevenDaysAgoFormatted = formatDate(sevenDaysAgo);
    const navigate = useNavigate();
    useEffect(() => {
        setFrom(sevenDaysAgoFormatted);
        setTo(todayFormatted);
        getProductsAllData({});
        getBrandsAllData();
    }, []);

    const getProductsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const productFormattedRows = response.data.map((product) => ({
                "Date": moment(Number(product.created_at)).format('lll'),
                "IMEI NO": product.imei_number,
                "Model": typeof product.model === 'object' ? product.model.name : product.model,
                "Brand": typeof product.brand === 'object' ? product.model.brand : product.model.brand.name,
                "Sales Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                id: product._id,
                "Barcode": (
                    <PrimaryButtonComponent
                        label="Barcode"
                        icon="fa fa-print"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={() => handleBarcodePrint({ modelName: product.model.name, grade: product.grade, imei_number: product.imei_number })}
                    />
                )
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
        if (modelName) {
            url += `&modelName=${modelName}`
        }
        if (brandName) {
            url += `&brandName=${brandName}`
        }
        if (status) {
            url += `&status=${status}`
        }
        console.log('from.valueOf(): ', moment(from).valueOf());
        console.log('to.valueOf(): ', moment(to).valueOf());
        if (!selectAllDates) {
            if (from) url += `&from=${moment(from).valueOf()}`;
            if (to) url += `&to=${moment(to).valueOf()}`;
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
        getProductsAllData({ imeiNumber, grade, modelName, brandName, status, from, to });
    }
    const handleDateChange = (value, setDate) => {
        const todayFormatted = new Date().toISOString().split('T')[0];
        if (value > todayFormatted) {
            setDate(todayFormatted);
        } else {
            setDate(value);
        }
    };
    const handleResetFilter = () => {
        setModelName('');
        setGrade('');
        setIMEINumber('');
        setBrandName('');
        setStatus();
        setFrom(sevenDaysAgoFormatted);
        setTo(todayFormatted);
        setSelectAllDates();
        getProductsAllData({});
    }
    const handleExportToExcel = () => {
        exportToExcel(rows, "ProductList.xlsx");
    };
    const handleRowClick = (row) => {
        if (row?.id) {
            navigate(`/stockin/${row.id}`);
        }
    };
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
                    maxLength={15}
                    onChange={(e) => setIMEINumber(e.target.value)}
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
            <div className='flex items-center gap-4'>
                <label className='flex items-center gap-2 text-sm'>
                    <input
                        type="checkbox"
                        checked={selectAllDates}
                        onChange={(e) => setSelectAllDates(e.target.checked)}
                    />
                    All Data
                </label>
                <InputComponent
                    type="date"
                    inputClassName="w-[190px] mb-5"
                    value={from}
                    max={todayFormatted}
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />
                <InputComponent
                    type="date"
                    inputClassName="w-[190px] mb-5"
                    value={to}
                    min={from}
                    max={todayFormatted}
                    onChange={(e) => handleDateChange(e.target.value, setTo)}
                    disabled={selectAllDates}
                />
                <PrimaryButtonComponent
                    label="Search"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    onClick={handleResetFilter}
                />
                <PrimaryButtonComponent
                    label="Export to Excel"
                    onClick={handleExportToExcel}
                />
            </div>
            <div>
                <CustomTableCompoent
                    headers={PRODUCT_COLOUMNS}
                    rows={rows}
                    onRowClick={handleRowClick}
                />
            </div>
        </div>
    );
}
export default ListOfProducts;
