
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import { apiCall } from '../../../Util/AxiosUtils';
import { excelDownload, handleBarcodePrint } from '../../../Util/Utility';
import { toast } from 'react-toastify';
function BulkOfProduct() {
    const [excelData, setExcelData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [error, setError] = useState('');
    const handleAddProductData = () => {
        if (excelData.length === 0) {
            setError("Please upload an Excel file.");
            return;
        }
        setError("");
        const bulkOfProductformatteddata = excelData.map((row) => ({
            model_name: row["Model Name"],
            imei_number: row["IMEI"],
            sales_price: row["Sales Price"],
            purchase_price: row["Purchase Price"],
            grade: row["Grade"],
            engineer_name: row["Engineer Name"],
            accessories: row["Accessories"],
            supplier_name: row["Supplier"],
            qc_remark: row["QC Remark"],
        }));
        setExcelData(bulkOfProductformatteddata)
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/products/bulk",
            data: bulkOfProductformatteddata,
            callback: stockInCallback,
        });
    }
    const stockInCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            response?.data?.results?.successful?.map(singleElement => {
                return handleBarcodePrint({
                    modelName: singleElement.product.model.name,
                    grade: singleElement.product.grade,
                    imei_number: singleElement.product.imei_number
                })
            })
        } else {
            const errorMsg = response?.data?.error || "Failed to upload file";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const handleDownloadExcel = () => {
        excelDownload();
    }
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
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
        };
        reader.readAsBinaryString(file);
    };
    const tableHeaders = excelData.length > 0 ? Object.keys(excelData[0]) : [];
    return (
        <div className="w-full">
            <div className=' gap-10 items-center'>
                {error && (
                    <div className="text-red-600 text-sm ">{error}</div>
                )}
                <InputComponent
                    label="Upload Excel File"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    inputClassName="w-[30%] p-10"
                />

            </div>
            {showTable && excelData.length > 0 && (
                <div className="mt-6">
                    <CustomTableCompoent headers={tableHeaders} rows={excelData} />
                </div>
            )}
            <div className='flex justify-center gap-4 mt-4'>
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    onClick={handleAddProductData}
                />
                <PrimaryButtonComponent
                    label="Download"
                    icon="fa fa-download"
                    onClick={handleDownloadExcel}
                />
            </div>
        </div>
    );
}
export default BulkOfProduct;
