
import React, { useEffect, useState } from 'react';
import InputComponent from '../../CustomComponents/InputComponent/InputComponent';
import CustomTableCompoent from '../../CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from '../../CustomComponents/DropdownCompoent/DropdownCompoent';
import { BRAND_OPTIONS, MODEL_OPTIONS, PRODUCT_COLOUMNS } from './Constants';
import { apiCall } from '../../../Util/AxiosUtils';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
function ListOfProducts() {
    const [rows, setRows] = useState([]);
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    useEffect(() => {
        getProductsAllData();
    }, []);
    const getProductsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const productFormattedRows = response.data.map((product) => ({
                "date": product.date,
                "IMEI NO": product.imei_number,
                "Company Name": product.brand,
                "Product Name": product.model,
                "Sales Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Barcode": product.barcode
            }))
            setRows(productFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getProductsAllData = () => {
        apiCall({
            method: 'GET',
            url: 'https://3-extent-billing-backend.vercel.app/api/products',
            data: {},
            callback: getProductsCallBack,
        })
    }
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
                <InputComponent
                    type="text"
                    placeholder="Enter IMEI NO"
                    inputClassName="mb-5"
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
