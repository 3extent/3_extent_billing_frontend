
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
            <h2>List Of Products</h2>

            <div className='mb-10 w-[50%] flex gap-4'>
                <InputComponent
                    label="Date:"
                    type="Date"
                    placeholder="Enter your Date"
                    className="p-2 rounded-md  border-gray-300"
                />
                <InputComponent
                    label="Brand:"
                    type="text"
                    placeholder="Enter your Brand"
                    className="p-2 rounded-md  border-gray-300"
                />
                <InputComponent
                    label="Model:"
                    type="text"
                    placeholder="Enter your Model"
                    className="p-2 rounded-md  border-gray-300"
                />
                <InputComponent
                    label="Grade:"
                    type="text"
                    placeholder="Enter your Grade"
                    className="p-2 rounded-md  border-gray-300"
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
