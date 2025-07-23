
import React, { useState } from 'react';
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import BulkOfProduct from "./BulkOfProduct";
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import Barcode from 'react-barcode';

function StockIn() {
    const selectType = ['Single Product', 'Multiple Product'];
    const selectGrade = ['a', 'b', ''];
    const selectBox = ['yes', 'No'];
    const selectSource = ['Amazon', 'NA', 'Messho'];

    const [stockType, setStockType] = useState('Single Product');
    const [modelName, setModelName] = useState('');
    const [grade, setGrade] = useState('');
    const [imei, setImei] = useState('');
    const [saved, setSaved] = useState(false);
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const handleSave = () => {
        if (!modelName || !grade || !imei) {
            alert("Please fill Model Name, Grade and IMEI to generate barcode.");
            return;
        }
        setSaved(true);
    };
    const barcodeValue = `${modelName}${grade}${imei}`;
    return (
        <div className='w-full p-4'>
            <div className='text-xl font-serif mb-4'>Add Product</div>
            <div className="w-full  items-center mb-2">
                <div className="w-[40%] ">
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
            {stockType === 'Single Product' ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                    <InputComponent
                        label="Model Name"
                        type="text"
                        placeholder="Model Name"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        inputClassName="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <InputComponent
                        label="Date"
                        type="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Enter your Date"
                        inputClassName="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <DropdownCompoent
                        label="Grade"
                        options={selectGrade}
                        placeholder="Select Grade"
                        value={grade}
                        onChange={(val) => setGrade(val)}
                        className="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <InputComponent
                        label="Buying Price"
                        type="text"
                        placeholder="Buying Purchase Price"
                        inputClassName="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <InputComponent
                        label="Rate"
                        type="text"
                        placeholder="Rate Selling Price"
                        inputClassName="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <InputComponent
                        label="IMEI"
                        type="text"
                        placeholder="IMEI"
                        value={imei}
                        onChange={(e) => setImei(e.target.value)}
                        inputClassName="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <InputComponent
                        label="Engineer Name"
                        type="text"
                        placeholder="Engineer Name"
                        inputClassName="w-[80%]"
                        labelClassName="font-serif font-bold" />
                    <InputComponent
                        label="QC Remark"
                        type="text"
                        placeholder="QC Remark"
                        inputClassName="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <DropdownCompoent
                        label="Source"
                        options={selectSource}
                        placeholder="Select Source"
                        className="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                    <DropdownCompoent
                        label="BOX"
                        options={selectBox}
                        placeholder="Select Box"
                        className="w-[80%]"
                        labelClassName="font-serif font-bold"
                    />
                </div>


            ) : (
                <BulkOfProduct />
            )}
            <div className="mt-4 flex justify-center">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-cloud-download"
                    buttonClassName="text-xl font-bold py-2 px-5 w-[20%]"
                    onClick={handleSave}
                />
            </div>
            {saved && modelName && grade && imei && (
                <div className="mt-6 flex justify-center">
                    <div className="bg-white p-4 border border-gray-300 shadow text-center">
                        <div className="font-serif mb-2">
                            {/* <strong>Barcode:</strong> {barcodeValue} */}
                            <div> {modelName}</div>
                            <div><strong>Grade:</strong> {grade}</div>
                            {/* <div><strong>IMEI:</strong> {imei}</div> */}
                        </div>
                        <Barcode value={imei} />
                    </div>
                </div>
            )}

        </div>

    );
}

export default StockIn;
