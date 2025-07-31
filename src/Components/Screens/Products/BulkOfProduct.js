
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';

function BulkOfProduct() {
    const [inputValue, setInputValue] = useState('');
    const [excelData, setExcelData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
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
            setShowTable(false);
            console.log('Imported Excel Data:', jsonData);
        };

        reader.readAsBinaryString(file);
    };

    const handleButtonClick = () => {
        console.log('Input value:', inputValue);
        console.log('Excel data:', excelData);
        setShowTable(true);
    };
    const tableHeaders = excelData.length > 0 ? Object.keys(excelData[0]) : [];

    return (
        <div className="w-full">
            <div className='flex  justify-center items-center w-full gap-7'>
                <InputComponent
                    label="Upload Excel File"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    inputClassName="w-[80%] p-10"
                />
                <PrimaryButtonComponent
                    label="Continue"
                    onClick={handleButtonClick}
                    buttonClassName="mt-5 py-1 px-5 text-xl font-bold"
                />
            </div>
            {showTable && excelData.length > 0 && (
                <div className="mt-6">
                    <CustomTableCompoent headers={tableHeaders} rows={excelData} />
                </div>
            )}
        </div>
    );
}

export default BulkOfProduct;
