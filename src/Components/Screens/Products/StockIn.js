
import React, { useState } from 'react';
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import BulkOfProduct from "./BulkOfProduct";

function StockIn() {
    const selectType = ['Single Product', 'Multiple Product'];
    const selectGrade = ['a', 'b'];
    const selectBox = ['yes', 'No'];
    const selectSource = ['Amazon', 'NA', 'Messho'];

    const [stockType, setStockType] = useState('Single Product');

    return (
        <div className='w-full p-4'>
            <div className='text-xl font-serif mb-4'>Add Product</div>

            <div className='flex items-center gap-4 mb-6'>
                <DropdownCompoent
                    label="Type of Stock in"
                    options={selectType}
                    placeholder="Select Type"
                    value={stockType}
                    onChange={(val) => setStockType(val)}
                />
            </div>

            {stockType === 'Single Product' ? (
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                    <InputComponent label="Model Name" type="text" placeholder="Model Name" />
                    <InputComponent label="Date" type="Date" placeholder="Enter your Date" />
                    <DropdownCompoent label="Grade" options={selectGrade} placeholder="Select Grade" />
                    <InputComponent label="Buying Price" type="text" placeholder="Buying Purchase Price" />
                    <InputComponent label="Rate" type="text" placeholder="Rate Selling Price" />
                    <InputComponent label="IMEI" type="text" placeholder="IMEI" />
                    <InputComponent label="Engineer Name" type="text" placeholder="Engineer Name" />
                    <InputComponent label="QC Remark" type="text" placeholder="QC Remark" />
                    <DropdownCompoent label="Source" options={selectSource} placeholder="Select Source" />
                    <DropdownCompoent label="BOX" options={selectBox} placeholder="Select Box" />
                </div>
            ) : (
                <BulkOfProduct />
            )}
        </div>
    );
}

export default StockIn;
