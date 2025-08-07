
import { useEffect, useState } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { MODELS_COLOUMNS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
export default function Models() {
    const [rows, setRows] = useState([]);
    const [modelName, setModelName] = useState();
    const [brandName, setBrandName] = useState();
    const [brandOptions, setBrandOptions] = useState([]);
    const navigate = useNavigate();
    const navigateAddModels = () => {
        navigate("/addmodels")
    }
    useEffect(() => {
        getModelsAllData();
        getBrandsAllData();
    }, []);
    const getModelsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const modelFormattedaRows = response.data.map((model, index) => ({
                "No": index + 1,
                "Model Name": model.name,
                "Qty": model.qty
            }))
            setRows(modelFormattedaRows);
        } else {
            console.log("Error");
        }
    }
    const getModelsAllData = () => {
        let url = "https://3-extent-billing-backend.vercel.app/api/models?";
        if (modelName) {
            url += `&modelName=${modelName}`
        }
        if(brandName){
            console.log('brandName: ', brandName);
            url +=`&brandName=${brandName}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getModelsCallBack,
        })
    }
    const getBrandsAllData = () => {
        let url = "https://3-extent-billing-backend.vercel.app/api/brands";
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBrandsCallBack,
        })
    };
    const getBrandsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const brands = response.data.map(brand=>brand.name);
            setBrandOptions(brands);
            console.log('brands: ', brands);
        } else {
            console.log("Error");
        }
    }
    const handleSearchFilter = () => {
        getModelsAllData();
    }
    const handleResetFilter = () => {
        setBrandName('');
        setModelName('');
        getModelsAllData();
    }
    return (
        <div>
            <CustomHeaderComponent
                name="Models"
                label="Add Models"
                icon="fa fa-plus-circle"
                buttonclassName="py-1 text-sm"
                onClick={navigateAddModels}
                buttonClassName="py-1 px-3 text-sm font-bold" />
            <div className="flex items-center gap-4">
                <CustomDropdownInputComponent
                    dropdownClassName="w-full mt-1"
                    placeholder="Enter a brand"
                    value={brandName}
                    onChange={(value) => setBrandName(value)}
                    options={brandOptions}
                />
                <InputComponent
                    type="text"
                    placeholder="Enter Models Name"
                    inputClassName="w-[full] mb-5"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                />
                <PrimaryButtonComponent
                    label="Search"
                    buttonClassName="mt-1 py-1 px-5 text-xl font-bold"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    buttonClassName="mt-1 py-1 px-5 text-xl font-bold"
                    onClick={handleResetFilter}
                />
            </div>
            <CustomTableCompoent
                headers={MODELS_COLOUMNS}
                rows={rows}
            />
        </div>
    );
}