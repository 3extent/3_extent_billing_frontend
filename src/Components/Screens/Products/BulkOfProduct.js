
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function BulkOfProduct() {
    const [inputValue, setInputValue] = useState('');
    const [excelData, setExcelData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };t 

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
            setShowTable(false); // Hide table on new upload
            console.log('Imported Excel Data:', jsonData);
        };

        reader.readAsBinaryString(file);
    };

    const handleButtonClick = () => {
        console.log('Input value:', inputValue);
        console.log('Excel data:', excelData);
        setShowTable(true); // Show table after button click
    };

    // Get table headers from excelData keys
    const headers = excelData.length > 0 ? Object.keys(excelData[0]) : [];

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Bulk Product Import</h2>

            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter some value"
                className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 border rounded-md mb-4"
            />

            <button
                onClick={handleButtonClick}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                Process Bulk
            </button>

            {/* Show table only after button click and if excelData exists */}
            {showTable && excelData.length > 0 && (
                <div className="mt-6 overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                {headers.map((header) => (
                                    <th
                                        key={header}
                                        className="border border-gray-300 px-4 py-2 text-left"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {headers.map((header) => (
                                        <td key={header} className="border border-gray-300 px-4 py-2">
                                            {row[header]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BulkOfProduct;
