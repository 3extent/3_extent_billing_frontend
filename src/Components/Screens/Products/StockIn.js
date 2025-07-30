
import React, { useState } from 'react';
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import SingleProductStockIn from './SingleProductStockIn';
import BulkOfProduct from "./BulkOfProduct";

function StockIn() {
    const selectType = ['Single Product', 'Multiple Product'];
    const [stockType, setStockType] = useState('Single Product');

    return (
        <div className='w-full p-4'>
            <div className='text-xl font-serif mb-4'>Add Product</div>
            <div className="w-full mb-4">
                <div className="w-[40%]">
                    <label className="text-xl font-serif font-bold text-gray-800 mb-1 text-center">
                        Type of Stock in
                    </label>
                    <DropdownCompoent
                        options={selectType}
                        placeholder="Select Type"
                        value={stockType}
                        onChange={(val) => setStockType(val)}
                        className="w-full"
                    />
                </div>
            </div>

            {stockType === 'Single Product' ? <SingleProductStockIn /> : <BulkOfProduct />}
        </div>
    );
}

export default StockIn;
