
import React, { useRef, useState } from 'react';
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import BulkOfProduct from "./BulkOfProduct";
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import CustomBarcodePrintComponent from '../../CustomBarcodePrintComponent/CustomBarcodePrintComponent';


function StockIn() {
    const selectType = ['Single Product', 'Multiple Product'];
    const selectGrade = ['A', 'B', 'C', 'D', 'Packpic', 'OK', 'SC', 'Open'];
    const selectBox = ['yes', 'No'];
    const selectSource = ['Amazon', 'NA', 'Messho'];

    const [stockType, setStockType] = useState('Single Product');
    const [modelName, setModelName] = useState('');
    const [grade, setGrade] = useState('');
    const [imei, setImei] = useState('');
    // const [saved, setSaved] = useState(false);
    const barcodeRef = useRef();
    const handleSave = () => {
        if (!modelName || !grade || !imei) {
            alert("Please fill Model Name, Grade and IMEI to generate barcode.");
            return;
        }
        // setSaved(true);
        barcodeRef.current?.handlePrint();
    };
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
                        // onChange={(val) => {
                        //     setStockType(val);
                        //     setSaved(false); // reset on switch
                        // }}
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
                    // icon="fa fa-cloud-download"
                    icon="fa fa-save"
                    // className="w-full"
                    className="w-[200px]"
                    onClick={handleSave}
                />
            </div>
            {/* {saved && modelName && grade && imei && (
                <CustomBarcodePrintComponent
                    modelName={modelName}
                    grade={grade}
                    imei={imei}
                />
            )} */}
            <CustomBarcodePrintComponent
                ref={barcodeRef}
                modelName={modelName}
                grade={grade}
                imei={imei}
            />

        </div>

    );
}

export default StockIn;
