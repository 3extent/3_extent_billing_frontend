
import React, { useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
function ListOfProducts() {
    const headers = [
        "Customer Name",
        "Bill",
        "Date",
        "Company Name",
        "Product Name",
        "IMEI NO",
        "QTY",
        "Sales",
        "Purches",
        "Profit",
        "Grade",
    ]
    const rows = [
        {
            "Customer Name": "John Doe",
            "Bill": "INV001",
            "Date": "2025-07-08",
            "Company Name": "Samsung",
            "Product Name": "Galaxy S21",
            "IMEI NO": "123456789012345",
            "QTY": 1,
            "Sales": 50000,
            "Purches": 45000,
            "Profit": 5000,
            "Grade": "A"
        },
        {
            "Customer Name": "Jane Smith",
            "Bill": "INV002",
            "Date": "2025-07-07",
            "Company Name": "Apple",
            "Product Name": "iPhone 13",
            "IMEI NO": "987654321098765",
            "QTY": 1,
            "Sales": 70000,
            "Purches": 65000,
            "Profit": 5000,
            "Grade": "B"
        }
    ];
    return (
        <div>
            <div className='text-xl font-serif'>List Of Products</div>
            <div className='flex gap-4'>
                <InputComponent
                    type="Date"
                    placeholder="Enter your Date"
                />
                <InputComponent
                    type="text"
                    placeholder="Enter your Brand"
                />
                <InputComponent
                    type="text"
                    placeholder="Enter your Model"
                />
                <InputComponent
                    type="text"
                    placeholder="Enter your Grade"
                />

            </div>
            <div>
                <CustomTableCompoent
                    headers={headers}
                    rows={rows}
                />
            </div>
        </div>
    );
}
export default ListOfProducts;
