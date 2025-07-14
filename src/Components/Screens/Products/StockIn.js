
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

            {/* <div className='flex items-center gap-4 mb-6'> */}
            <div className='grid grid-cols-2 gap-x-5 gap-y-2'>
                <DropdownCompoent
                    label="Type of Stock in"
                    options={selectType}
                    placeholder="Select Type"
                    value={stockType}
                    onChange={(val) => setStockType(val)}
                    className="w-[49%]"
                />
            </div>

            {stockType === 'Single Product' ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                    <InputComponent label="Model Name" type="text" placeholder="Model Name" inputClassName="w-[49%]" />
                    <InputComponent label="Date" type="Date" placeholder="Enter your Date" inputClassName="w-[49%]" />
                    <DropdownCompoent label="Grade" options={selectGrade} placeholder="Select Grade" className="w-[49%]" />
                    <InputComponent label="Buying Price" type="text" placeholder="Buying Purchase Price" inputClassName="w-[49%]" />
                    <InputComponent label="Rate" type="text" placeholder="Rate Selling Price" inputClassName="w-[49%]" />
                    <InputComponent label="IMEI" type="text" placeholder="IMEI" inputClassName="w-[49%]" />
                    <InputComponent label="Engineer Name" type="text" placeholder="Engineer Name" inputClassName="w-[49%]" />
                    <InputComponent label="QC Remark" type="text" placeholder="QC Remark" inputClassName="w-[49%]" />
                    <DropdownCompoent label="Source" options={selectSource} placeholder="Select Source" className="w-[49%]" />
                    <DropdownCompoent label="BOX" options={selectBox} placeholder="Select Box" className="w-[49%]" />
                </div>
            ) : (
                <BulkOfProduct />
            )}
        </div>
    );
}

export default StockIn;
