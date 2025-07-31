
import React, { useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from '../../CustomComponents/DropdownCompoent/DropdownCompoent';
import { BRAND_OPTIONS, MODEL_OPTIONS, PRODUCT_COLOUMNS } from './Constants';
function ListOfProducts() {
    const rows = [
        {
            "Date": "2025-07-08",
            "Company Name": "Samsung",
            "Product Name": "Galaxy S21",
            "IMEI NO": "123456789012345",
            "Sales Price": 50000,
            "Purchase Price": 45000,
            "Grade": "A",
            "Barcode": ""
        },
        {
            "Customer Name": "Jane Smith",
            "Bill": "INV002",
            "Date": "2025-07-07",
            "Company Name": "Apple",
            "Product Name": "iPhone 13",
            "IMEI NO": "987654321098765",
            "Sales Price": 70000,
            "Purchase Price": 65000,
            "Grade": "B",
            "Barcode": ""
        }
    ];
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    return (
        <div className='w-full'>
            <div className='text-xl font-serif'>List Of Products</div>
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="Date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    inputClassName="mb-5"
                />
                <DropdownCompoent
                    options={BRAND_OPTIONS}
                    placeholder="Select Brands"
                />
                <DropdownCompoent
                    options={MODEL_OPTIONS}
                    placeholder="Select Models"
                />
            </div>
            <div>
                <CustomTableCompoent
                    headers={PRODUCT_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    );
}
export default ListOfProducts;
