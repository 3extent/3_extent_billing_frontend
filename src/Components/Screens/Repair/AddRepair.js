import { useCallback, useEffect, useState } from "react";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { ACCESSORIES_OPTIONS, GRADE_OPTIONS } from "./Constants";
import { toast } from "react-toastify";

function AddRepair() {
    const [productData, setProductData] = useState({
        imei_number: "",
        brand_name: "",
        model_name: "",
        grade: "",
        purchase_price: "",
        sales_price: "",
        engineer_name: "",
        qc_remark: "",
        repairer_name: "",
        accessories: ""
    });
    const [brandOptions, setBrandOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProductData({ ...productData, [name]: value });
    };
    const handleBrandProductData = (value) => {
        setProductData(productData => ({ ...productData, brand_name: value }));
    };

    const handleModelProductData = (value) => {
        setProductData(productData => ({ ...productData, model_name: value }));
    };
    const getBrandsCallBack = (response) => {
        if (response.status === 200) {
            const brands = response.data.map(brand => brand.name);
            setBrandOptions(brands);
        } else {
            console.log("Error fetching brands");
        }
    };
    const getBrandsAllData = useCallback(() => {
        apiCall({
            method: "GET",
            url: API_URLS.BRANDS,
            data: {},
            callback: getBrandsCallBack,
            setLoading: setLoading
        });
    }, []);

    const getModelsCallBack = (response) => {
        if (response.status === 200) {
            const models = response.data.map(model => model.name);
            setModelOptions(models);
        } else {
            console.log("Error fetching models");
        }
    };
    const getModelsAllData = useCallback(() => {
        apiCall({
            method: "GET",
            url: API_URLS.MODEL,
            data: {},
            callback: getModelsCallBack,
            setLoading: setLoading
        });
    }, []);
    const addRepairCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            toast.success("Repair added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setProductData({
                imei_number: "",
                brand_name: "",
                model_name: "",
                grade: "",
                purchase_price: "",
                sales_price: "",
                engineer_name: "",
                qc_remark: "",
                repairer_name: "",
                accessories: ""
            });
        } else {
            const errorMsg = response?.data?.error || "Failed to add repair";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const saveRepairData = () => {
        setLoading(true);
        apiCall({
            method: "POST",
            url: API_URLS.REPAIRS,
            data: productData,
            callback: addRepairCallback,
            setLoading: setLoading
        });
    };
    useEffect(() => {
        getBrandsAllData();
        getModelsAllData();
    }, [getBrandsAllData, getModelsAllData]);

    return (
        <div>
            {loading && <Spinner />}
            <div className="w-full mb-4">
                <InputComponent
                    label="IMEI"
                    type="text"
                    name="imei_number"
                    placeholder="IMEI"
                    maxLength={15}
                    numericOnly={true}
                    inputClassName="w-[30%]"
                    labelClassName="font-serif font-bold"
                />
            </div>
            <div className="grid grid-cols-3 mt-2 gap-x-5 gap-y-1">
                <CustomDropdownInputComponent
                    name="Brand Name"
                    dropdownClassName="w-[80%]"
                    placeholder="Enter Brand Name"
                    labelClassName="font-serif font-bold"
                    options={brandOptions}
                    value={productData.brand_name}
                    onChange={handleBrandProductData}

                />
                <CustomDropdownInputComponent
                    name="Model Name"
                    dropdownClassName="w-[80%]"
                    placeholder="Enter Model Name"
                    labelClassName="font-serif font-bold"
                    options={modelOptions}
                    value={productData.model_name}
                    onChange={handleModelProductData}

                />
                <DropdownCompoent
                    label="Grade"
                    name="grade"
                    placeholder="Select Grade"
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                    options={GRADE_OPTIONS}
                    value={productData.grade}
                    onChange={handleInputChange}

                />
                <InputComponent
                    label="Purchase Price"
                    type="text"
                    name="purchase_price"
                    placeholder="Buying Purchase Price"
                    numericOnly={true}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={productData.purchase_price}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="Sales Price"
                    type="text"
                    name="sales_price"
                    placeholder="Rate Selling Price"
                    numericOnly={true}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={productData.sales_price}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="IMEI"
                    type="text"
                    name="imei_number"
                    placeholder="IMEI"
                    maxLength={15}
                    numericOnly={true}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={productData.imei_number}
                    onChange={handleInputChange}

                />
                <InputComponent
                    label="Enginner Name "
                    type="text"
                    name="engineer_name"
                    placeholder="Enginner Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={productData.engineer_name}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="QC Remark"
                    type="text"
                    name="qc_remark"
                    placeholder="QC Remark"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={productData.qc_remark}
                    onChange={handleInputChange}
                />
                <InputComponent
                    label="Repairer Name"
                    type="text"
                    name="repairer_name"
                    placeholder="Enter Repairer Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={productData.repairer_name}
                    onChange={handleInputChange}
                />
                <DropdownCompoent
                    label="Accessories"
                    name="accessories"
                    placeholder="Select Box"
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                    options={ACCESSORIES_OPTIONS}
                    value={productData.accessories}
                    onChange={handleInputChange}
                />
                <div className="col-span-3 mt-5 flex justify-center gap-4">
                    <PrimaryButtonComponent
                        label="Save"
                        icon="fa fa-save"
                        onClick={saveRepairData}
                    />
                </div>
            </div>
        </div>

    )
} export default AddRepair;