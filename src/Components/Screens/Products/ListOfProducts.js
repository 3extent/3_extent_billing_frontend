
import React, { useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from '../../CustomComponents/DropdownCompoent/DropdownCompoent';
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
    const selectBrands = ['apple', 'xiaomi'];
    const selectModels = ['apple iphone 14', 'xiaomi redmi note 13'];
    return (
        <div className='w-full'>
            <div className='text-xl font-serif'>List Of Products</div>
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="Date"
                    placeholder="Enter your Date"
                />
                <DropdownCompoent
                    options={selectBrands}
                    placeholder="Select Brands"
                />
                <DropdownCompoent
                    options={selectModels}
                    placeholder="Select Models"
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
