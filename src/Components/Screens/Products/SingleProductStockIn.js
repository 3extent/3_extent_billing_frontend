import React, { useEffect, useState } from 'react';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import CustomBarcodePrintComponent from '../../CustomComponents/CustomBarcodePrintComponent/CustomBarcodePrintComponent';
import PrimaryButtonComponent from '../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent';
import { BOX_OPTIONS, GRADE_OPTIONS, SOURCE_OPTIONS } from './Constants';
import CustomDropdownInputComponent from '../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent';
import { apiCall } from '../../../Util/AxiosUtils';

function SingleProductStockIn() {
    const [modelName, setModelName] = useState('');
    const [grade, setGrade] = useState('');
    const [imei, setImei] = useState('');
    const [showBarcode, setShowBarcode] = useState(false)
    const [modelOptions, setModelOptions] = useState([]);
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
    useEffect(() => {
        getModelsAllData();
    }, []);
    const getModelsAllData = () => {
        let url = "https://3-extent-billing-backend.vercel.app/api/models";
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getModelsCallBack,
        })
    }
    const getModelsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const models = response.data.map(model => model.name);
            setModelOptions(models);
            if (!modelName) {
                setModelName("");
            }
        } else {
            console.log("Error");
        }
    }
    return (
        <div className="grid grid-cols-2 gap-x-5 gap-y-2">
            {/* <InputComponent
                label="Model Name"
                type="text"
                placeholder="Model Name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                inputClassName="w-[80%]"
                labelClassName="font-serif font-bold"
            /> */}
            <CustomDropdownInputComponent
                name="Model Name"
                dropdownClassName="w-[80%]"
                placeholder="Enter Model Name"
                value={modelName}
                onChange={(value) => setModelName(value)}
                options={modelOptions}
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
                options={GRADE_OPTIONS}
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
                options={SOURCE_OPTIONS}
                placeholder="Select Source"
                className="w-[80%]"
                labelClassName="font-serif font-bold"
            />
            <DropdownCompoent
                label="BOX"
                options={BOX_OPTIONS}
                placeholder="Select Box"
                className="w-[80%]"
                labelClassName="font-serif font-bold"
            />

            <div className="col-span-2 mt-4 flex justify-center">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-save"
                    onClick={handleSave}
                    buttonClassName="mt-2 py-1 px-5 text-xl font-bold"

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