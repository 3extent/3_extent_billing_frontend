
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import { apiCall } from '../../../Util/AxiosUtils';
function BulkOfProduct() {
    const [inputValue, setInputValue] = useState('');
    const [excelData, setExcelData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const handleAddProductData = () => {
        const bulkOfProductformatteddata = excelData.map((row) => ({
            model_name: row["Model Name"],
            imei: row["IMEI"],
            sales_price: row["Sales Price"],
            purchase_price: row["Purchase Price"],
            grade: row["Grade"],
            engineer_name: row["Engineer Name"],
            accessories: row["Accessories"],
            supplier_name: row["Supplier_name"],
            qc_remark: row["QC_Remark"],
        }));
        setExcelData(bulkOfProductformatteddata)
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/products",
            data: bulkOfProductformatteddata,
            callback: stockInCallback,
        });
    }
    const stockInCallback = (response) => {
        if (response.status === 200) {
        } else {
            console.log("error")
        }
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = evt.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(jsonData);
            setShowTable(true);
            console.log('Imported Excel Data:', jsonData);
        };
        reader.readAsBinaryString(file);
    };
    // const handleButtonClick = () => {
    //     console.log('Input value:', inputValue);
    //     console.log('Excel data:', excelData);
    //     setShowTable(true);
    // };
    const tableHeaders = excelData.length > 0 ? Object.keys(excelData[0]) : [];
    return (
        <div className="w-full">
            <div className='flex gap-10 items-center'>
                <InputComponent
                    label="Upload Excel File"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    inputClassName="w-full p-10"
                />
                {/* <PrimaryButtonComponent
                    label="Continue"
                    onClick={handleButtonClick}
                    buttonClassName="mt-5 py-2 px-5 text-xl font-bold"
                /> */}
            </div>
            {showTable && excelData.length > 0 && (
                <div className="mt-6">
                    <CustomTableCompoent headers={tableHeaders} rows={excelData} />
                </div>
            )}
            <div className='flex justify-center'>
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    buttonClassName="mt-2 py-2 px-5 text-xl font-bold"
                    onClick={handleAddProductData}
                />
            </div>
        </div>
    );
}
export default BulkOfProduct;
