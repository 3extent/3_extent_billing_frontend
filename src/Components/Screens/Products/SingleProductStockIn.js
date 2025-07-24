import React, { useState } from 'react';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import CustomBarcodePrintComponent from '../../CustomComponents/CustomBarcodePrintComponent/CustomBarcodePrintComponent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';

function SingleProductStockIn() {
    const selectGrade = ['A', 'B', 'C', 'D', 'Packpic', 'OK', 'SC', 'Open'];
    const selectBox = ['yes', 'No'];
    const selectSource = ['Amazon', 'NA', 'Messho'];
    const [modelName, setModelName] = useState('');
    const [grade, setGrade] = useState('');
    const [imei, setImei] = useState('');
    const [showBarcode, setShowBarcode] = useState(false)
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
                labelClassName="font-serif font-bold"
            />
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

            <div className="col-span-2 mt-4 flex justify-center">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    className="w-[200px]"
                    onClick={handleSave}
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
