
import React, { useEffect, useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import { STATUS_OPTIONS } from './Constants';
import { apiCall, Spinner } from '../../../Util/AxiosUtils';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { exportToExcel, handleBarcodePrint } from '../../../Util/Utility';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import CustomDropdownInputComponent from '../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent';
import { API_URLS } from '../../../Util/AppConst';
import DropdownComponent from '../../CustomComponents/DropdownComponent/DropdownComponent';
import CustomTableComponent from '../../CustomComponents/CustomTableComponent/CustomTableComponent';
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
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const [allColumns, setAllColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const [hiddenDropdownColumns, setHiddenDropdownColumns] = useState([]);
    const navigate = useNavigate();

    const [hiddenColumns, setHiddenColumns] = useState([]);
    const toggleColumn = (columnName) => {

        setColumns(columns => {

            if (columns.includes(columnName)) {
                return columns.filter(col => col !== columnName);
            }

            let newColumns = [...columns];

            const actionIndex = newColumns.indexOf("Actions");
            if (actionIndex !== -1) {
                newColumns.splice(actionIndex, 0, columnName);
            } else {
                newColumns.push(columnName);
            }


            return newColumns;
        });

        setHiddenColumns(columns =>
            columns.includes(columnName)
                ? columns.filter(col => col !== columnName)
                : [...columns, columnName]
        );
    };

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
            const suppliers = response.data.users.map(supplier => supplier.name);
            setSupplierOptions(suppliers);
        } else {
            console.log("Error fetching suppliers");
        }
    };


    const getProductsCallBack = (response) => {
        console.log('response: ', response);

        if (response.status === 200) {
            const productFormattedRows = response.data.products.map((product) => ({
                "Date": moment(product.created_at).format('ll'),
                "IMEI Number": product.imei_number,
                "Model": typeof product.model === 'object' ? product.model.name : product.model,
                "Brand": typeof product.brand === 'object' ? product.model.brand : product.model.brand.name,
                "Supplier": typeof product.supplier === 'object' ? product.supplier.name : product.supplier,
                "QC Remark": product.qc_remark,
                "Sales Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Engineer": product.engineer_name,
                "Accessories": product.accessories,
                "GST Purchase Price": product.gst_purchase_price,
                "Part Cost": product.repair_parts?.reduce(
                    (sum, part) => sum + Number(part.cost || 0),
                    0
                ),
                "Repairer Cost": product.repairer_cost,
                "Repairer": product.repair_by?.name,
                "Repair Remark": product.repair_remark,
                "Purchase Price Including Expenses": product.purchase_cost_including_expenses,
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
                            iconOnly={true}
                            icon="fa fa-print"
                            buttonClassName="py-1 px-3 text-[12px] font-semibold"
                            onClick={
                                () => handleBarcodePrint([{ modelName: product.model.name, grade: product.grade, imei_number: product.imei_number }])
                            }
                        />

                    </div>
                )
            }));

            setRows(productFormattedRows);
            console.log('productFormattedRows: ', productFormattedRows);
            const ProductsMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Products" && item.name?.level !== 1
            );
            if (ProductsMenuItem) {
                const showCols =
                    ProductsMenuItem.show_table_columns.map(col => col.name);

                const hiddenCols =
                    ProductsMenuItem.hidden_dropdown_table_columns?.map(col => col.name);

                setAllColumns([...showCols, ...hiddenCols]); //  all
                setColumns(showCols);                        //  only visible
                setHiddenColumns(hiddenCols);                //  hidden
                setHiddenDropdownColumns(hiddenCols);        // checkbox list
            }

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
        // if (status === "AVAILABLE & REPAIRED") {
        //     url += "&status=AVAILABLE&is_repaired=true";
        // } else if (status) {
        //     url += `&status=${status}`;
        // }

        if (status === "AVAILABLE") {
            url += "&status=AVAILABLE&is_repaired=false";
        }
        else if (status === "ALL AVAILABLE") {
            url += "&status=AVAILABLE";
        }
        else if (status === "AVAILABLE & REPAIRED") {
            url += "&status=AVAILABLE&is_repaired=true";
        }
        else if (status) {
            url += `&status=${status}`;
        }

        if (!selectAllDates) {
            if (from) url += `&from=${moment.utc(from).startOf('day').valueOf()}`;
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
        setSupplierName('');
        setStatus(STATUS_OPTIONS[0]);
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getProductsAllData({ from, to, status: STATUS_OPTIONS[0] });
        getSuppliersAllData();

    }
    const handleExportToExcel = () => {
        exportToExcel(rows, "ProductList.xlsx", null, columns);
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
                <DropdownComponent
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
                <DropdownComponent
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
            <CustomTableComponent
                maxHeight="h-[50vh]"
                headers={columns}
                rows={rows}
                hiddenDropdownColumns={hiddenDropdownColumns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
            />
        </div>
    );
}
export default ListOfProducts;
