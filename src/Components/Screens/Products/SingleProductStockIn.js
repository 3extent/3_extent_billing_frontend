import React, { useState } from 'react';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import CustomBarcodePrintComponent from '../../CustomComponents/CustomBarcodePrintComponent/CustomBarcodePrintComponent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { BOX_OPTIONS, GRADE_OPTIONS, SOURCE_OPTIONS } from './Constants';
import { apiCall } from '../../../Util/AxiosUtils';

function SingleProductStockIn() {
    const [modelName, setModelName] = useState('');
    const [grade, setGrade] = useState('');
    const [imei, setImei] = useState('');
    const [showBarcode, setShowBarcode] = useState(false)
    const [productData, setProductData] = useState({
        modelName: '',
        date: '',
        grade: '',
        buyingPrice: '',
        rate: '',
        imei: '',
        engineerName: '',
        qcRemark: '',
        source: '',
        box: '',
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };
    const stockInCallback = (response) => {
        console.log('response:', response);
        if (response.status === 200) {
            setProductData({
                modelName: '',
                date: '',
                grade: '',
                buyingPrice: '',
                rate: '',
                imei: '',
                engineerName: '',
                qcRemark: '',
                source: '',
                box: '',
            });
        } else {
            console.log("error")
        }
    };
    const saveProductStockIn = () => {
        const payload = {
            products: [productData]
        };

        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/products",
            data: payload,
            callback: stockInCallback
        });
    };
    const handleSave = () => {
        if (!modelName || !grade || !imei) {
            alert("Please fill Model Name, Grade and IMEI to generate barcode.");
            return;
        }
        setShowBarcode(true)
        setTimeout(() => {
            window.print();
        }, 500);
    }
    return (
        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            <InputComponent
                label="Model Name"
                type="text"
                name="modelName"
                placeholder="Model Name"
                value={productData.modelName}
                onChange={handleInputChange}
                // onChange={(e) => setModelName(e.target.value)}
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <InputComponent
                label="Date"
                type="Date"
                name="date"
                placeholder="Enter your Date"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.date}
                onChange={handleInputChange}
            />
            <DropdownCompoent
                label="Grade"
                options={GRADE_OPTIONS}
                placeholder="Select Grade"
                className="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.grade}
                onChange={(val) => setGrade(val)}
            // onChange={(val) => handleDropdownChange("grade", val)}
            />
            <InputComponent
                label="Buying Price"
                type="text"
                name="buyingPrice"
                placeholder="Buying Purchase Price"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.buyingPrice}
                onChange={handleInputChange}
            />
            <InputComponent
                label="Rate"
                type="text"
                name="rate"
                placeholder="Rate Selling Price"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.rate}
                onChange={handleInputChange}
            />
            <InputComponent
                label="IMEI"
                type="text"
                name="imei"
                placeholder="IMEI"
                // value={imei}
                // onChange={(e) => setImei(e.target.value)}
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.imei}
                onChange={handleInputChange}
            />
            <InputComponent
                label="Engineer Name"
                type="text"
                name="engineerName"
                placeholder="Engineer Name"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.engineerName}
                onChange={handleInputChange}
            />
            <InputComponent
                label="QC Remark"
                type="text"
                name="qcRemark"
                placeholder="QC Remark"
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.qcRemark}
                onChange={handleInputChange}
            />
            <DropdownCompoent
                label="Source"
                options={SOURCE_OPTIONS}
                placeholder="Select Source"
                className="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.source}
                // onChange={(val) => handleDropdownChange("source", val)}
                onChange={handleInputChange}
            />
            <DropdownCompoent
                label="BOX"
                options={BOX_OPTIONS}
                placeholder="Select Box"
                className="w-[80%]"
                labelClassName="font-serif font-bold"
                value={productData.box}
                // onChange={(val) => handleDropdownChange("box", val)}
                onChange={handleInputChange}
            />

            <div className="col-span-2 mt-4 flex justify-center">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    // onClick={handleSave}
                    buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
                    onClick={saveProductStockIn}

                />
            </div>
            {showBarcode && (
                <CustomBarcodePrintComponent
                    modelName={modelName}
                    grade={grade}
                    imei={imei}
                />
            )}
        </div>
    );
}

export default SingleProductStockIn;