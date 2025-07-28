
import React, { useEffect, useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from '../../CustomComponents/DropdownCompoent/DropdownCompoent';
import { PRODUCT_COLOUMNS } from './Constants';
import { makeRequest } from '../../../Util/AxiosUtils';
function ListOfProducts() {
    const [rows,setRows]=useState([]);
    useEffect(() => {
        makeRequest({
            method: 'GET',
            url: 'https://3-extent-billing-backend.vercel.app/api/products',
            data:{},
            callback: (response) => {
                console.log('response: ', response);
                if (response.status === 200) {
                    const productFormattedRows=response.data.map((product)=>({
                        "date":product.date,
                        "IMEI NO":product.imei_number,
                        "Company Name":product.brand,
                        "Product Name":product.model,
                        "Sales Price":product.sales_price,
                        "Purchase Price":product.purchase_price,
                        "Grade":product.grade,
                        "Barcode":product.barcode
                    }))
                    setRows(productFormattedRows);
                } else {
                    console.log("Error");
                }
            }
        })
    }, []);
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
                    placeholder="Enter IMEI NO"
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
