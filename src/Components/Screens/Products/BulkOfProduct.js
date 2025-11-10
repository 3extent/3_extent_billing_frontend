
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import { apiCall, Spinner } from '../../../Util/AxiosUtils';
import { handleBarcodePrint } from '../../../Util/Utility';
import { toast } from 'react-toastify';
import { API_URLS } from '../../../Util/AppConst';
function BulkOfProduct() {
    const [excelData, setExcelData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleAddProductData = () => {
        if (excelData.length === 0) {
            setError("Please upload an Excel file.");
            return;
        }
        setError("");
        const bulkOfProductformatteddata = excelData.map((row) => ({
            brand_name: row["Brand Name"] ? row["Brand Name"].trim().toUpperCase() : "",
            model_name: row["Model Name"] ? row["Model Name"].trim().toUpperCase() : "",
            imei_number: row["IMEI"],
            sales_price: row["Sales Price"],
            purchase_price: row["Purchase Price"],
            grade: row["Grade"],
            engineer_name: row["Engineer Name"],
            accessories: row["Accessories"] ? row["Accessories"].trim().toUpperCase() : "",
            supplier_name: row["Supplier"] ? row["Supplier"].trim().toUpperCase() : "",
            qc_remark: row["QC Remark"],
        }));
        apiCall({
            method: "POST",
            url: `${API_URLS.PRODUCTS}/bulk`,
            data: bulkOfProductformatteddata,
            callback: stockInCallback,
            setLoading: setLoading,
        });
    }
    const stockInCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            let barcodeArray = response?.data?.products?.map(singleElement => {

                console.log('singleElement: ', singleElement);
                return {
                    modelName: singleElement.model.name,
                    grade: singleElement.grade,
                    imei_number: singleElement.imei_number
                }
            })
            handleBarcodePrint(barcodeArray)

            handleResetData();
        } else {
            const errorMsg = response?.data?.error || "Failed to upload file";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const handleResetData = () => {
        setExcelData([]);
        setShowTable(false);
        setError('');
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
    }
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            if (jsonData.length > 0) {
                setError('');
                setExcelData(jsonData);
                setShowTable(true);
                console.log('Imported Excel Data:', jsonData);
            }
            setLoading(false);
        };
        reader.readAsBinaryString(file);
    };
    const tableHeaders = excelData.length > 0 ? Object.keys(excelData[0]) : [];
    return (
        <div className="w-full">
            {loading && <Spinner />}
            <div className='flex gap-10 items-center'>
                {error && (
                    <div className="text-red-600 text-sm ">{error}</div>
                )}
                <InputComponent
                    label="Upload Excel File"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    inputClassName="w-[100%] p-10"
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    buttonClassName="mt-5"
                    onClick={handleResetData}
                />

            </div>
            {showTable && excelData.length > 0 && (
                <div className=" mt-6 h-[44vh]">
                    <CustomTableCompoent headers={tableHeaders} rows={excelData} />
                </div>
            )}
            <div className='flex justify-center gap-4 mt-10'>
                {excelData.length > 0 && (
                    <PrimaryButtonComponent
                        label="Save"
                        icon="fa fa-save"
                        onClick={handleAddProductData}
                    />
                )}
            </div>
        </div>
    );
}
export default BulkOfProduct;
