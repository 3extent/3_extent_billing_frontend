
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
import CustomDropdownInputComponent from '../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent';
import { API_URLS } from '../../../Util/AppConst';
function ListOfProducts() {
    const [rows, setRows] = useState([]);
    const [imeiNumber, setIMEINumber] = useState();
    const [grade, setGrade] = useState();
    const [modelName, setModelName] = useState();
    const [brandName, setBrandName] = useState('');
    const [status, setStatus] = useState(STATUS_OPTIONS[0]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const fromDate = moment().subtract('days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');
    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);
    const [supplierName, setSupplierName] = useState('');
    const [supplierOptions, setSupplierOptions] = useState([]);

    const [selectAllDates, setSelectAllDates] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setFrom(fromDate);
        setTo(toDate);
        getProductsAllData({ from, to, status });
        getBrandsAllData();
        getSuppliersAllData();
    }, []);
    const getSuppliersAllData = () => {
        let url = `${API_URLS.USERS}?role=SUPPLIER`;
        apiCall({
            method: 'GET',
            url,
            data: {},
            callback: getSuppliersCallBack,
            setLoading: setLoading,
        });
    };
    const getSuppliersCallBack = (response) => {
        if (response.status === 200) {
            const suppliers = response.data.map(supplier => supplier.name);
            setSupplierOptions(suppliers);
        } else {
            console.log("Error fetching suppliers");
        }
    };
    const getProductsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const productFormattedRows = response.data.map((product) => ({
                "Date": moment(product.created_at).format('ll'),
                "IMEI NO": product.imei_number,
                "Model": typeof product.model === 'object' ? product.model.name : product.model,
                "Brand": typeof product.brand === 'object' ? product.model.brand : product.model.brand.name,
                "Supplier": typeof product.supplier === 'object' ? product.supplier.name : product.supplier || '-',
                "QC Remark": product.qc_remark || '-',
                "Sales Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                id: product._id,
                "Actions": (
                    <div className='flex items-center justify-end gap-2'>
                        {product.status !== 'SOLD' && (
                            <div className='flex justify-end'>
                                <div
                                    title="Edit"
                                    onClick={() => navigate(`/stockin/${product._id}`)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                >
                                    <i className="fa fa-pencil text-gray-700 text-sm" />
                                </div>
                            </div>
                        )}
                        <PrimaryButtonComponent
                            label="Barcode"
                            icon="fa fa-barcode"
                            iconOnly={true}
                            buttonClassName="py-1 px-3 text-[12px] font-semibold"
                            onClick={
                                () => handleBarcodePrint([{ modelName: product.model.name, grade: product.grade, imei_number: product.imei_number }])
                            }
                        />

                    </div>
                )
            }));
            setRows(productFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getProductsAllData = ({ imeiNumber, grade, modelName, brandName, supplierName, status, from, to, selectAllDates }) => {
        let url = `${API_URLS.PRODUCTS}?`;
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
        if (supplierName) {
            url += `&supplierName=${supplierName}`;
        }
        if (status) {
            url += `&status=${status}`
        }
        if (!selectAllDates) {
            if (from) url += `&from=${moment.utc(from).valueOf()}`;
            if (to) url += `&to=${moment.utc(to).endOf('day').valueOf()}`;
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
        let url = API_URLS.BRANDS;
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
        getProductsAllData({ imeiNumber, grade, modelName, brandName, supplierName, status, from, to, selectAllDates });
    }
    const handleDateChange = (value, setDate) => {
        const today = moment().format('YYYY-MM-DD');
        if (value > today) {
            setDate(today);
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
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getProductsAllData({ from, to, status: STATUS_OPTIONS[0] });
        getSuppliersAllData();

    }
    const handleExportToExcel = () => {
        exportToExcel(rows, "ProductList.xlsx");
    };
    return (
        <div className='w-full'>
            {loading && <Spinner />}
            <div className='flex justify-between items-center mb-4'>
                <div className='text-xl font-serif'>List Of Products</div>
                <PrimaryButtonComponent
                    label="Export to Excel"
                    icon="fa fa-file-excel-o"
                    buttonClassName="py-1 px-5 text-sm font-bold"
                    onClick={handleExportToExcel}
                />
            </div>
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="Enter IMEI NO"
                    inputClassName="mb-2 w-[190px]"
                    value={imeiNumber}
                    numericOnly={true}
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
                <CustomDropdownInputComponent
                    dropdownClassName="w-[190px] mt-3"
                    placeholder="Select Supplier"
                    value={supplierName}
                    onChange={(value) => setSupplierName(value)}
                    options={supplierOptions}

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
            </div>
            <div className='flex items-center gap-4'>
                <DropdownCompoent
                    placeholder="Select status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={STATUS_OPTIONS}
                    className="w-[190px]"
                />
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
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />
                <InputComponent
                    type="date"
                    inputClassName="w-[190px] mb-5"
                    value={to}
                    onChange={(e) => handleDateChange(e.target.value, setTo)}
                    disabled={selectAllDates}
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    onClick={handleResetFilter}
                />
            </div>
            <div className="h-[60vh]">
                <CustomTableCompoent
                    headers={PRODUCT_COLOUMNS}
                    rows={rows}
                />
            </div>

        </div>
    );
}
export default ListOfProducts;
