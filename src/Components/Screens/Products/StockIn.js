
import React, { useState } from 'react';
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import SingleProductStockIn from './SingleProductStockIn';
import BulkOfProduct from "./BulkOfProduct";
import { STOCK_TYPE_OPTIONS } from './Constants';
import { useParams } from 'react-router-dom';
function StockIn() {
    const [stockType, setStockType] = useState('Single Product');
    const { product_id } = useParams();
    const handleInputChange = (event) => {
        setStockType(event.target.value);
    };
    return (
        <div className='w-full p-4'>
            <div className='text-xl font-serif mb-4'>{product_id ? "Edit Product" : "Add Product"}</div>
            {!product_id && (
                <div className="w-full mb-4">
                    <div className="w-[40%]">
                        <label className="text-xl font-serif font-bold text-gray-800 mb-1 text-center">
                            Type Of Stock In
                        </label>
                        <DropdownCompoent
                            options={STOCK_TYPE_OPTIONS}
                            placeholder="Select Type"
                            value={stockType}
                            onChange={handleInputChange}
                            className="w-[70%]"
                        />
                    </div>
                </div>
            )}

            {stockType === 'Single Product' ? <SingleProductStockIn /> : <BulkOfProduct />}
        </div>
    );
}
export default StockIn;
