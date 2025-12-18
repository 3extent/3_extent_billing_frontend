import { useCallback, useEffect, useState } from "react";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { ACCESSORIES_OPTIONS, GRADE_OPTIONS } from "./Constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddRepair() {
    const [productData, setProductData] = useState({
        id: "",
        imei_number: "",
        brand_name: "",
        model_name: "",
        grade: "",
        purchase_price: "",
        engineer_name: "",
        issue: "",
        accessories: "",
        repairer_name: "",
        repairer_contact_no: "",
    });
    const [brandOptions, setBrandOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([]);
    const [imeiOptions, setImeiOptions] = useState([]);
    const [selectedImei, setSelectedImei] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [repairers, setRepairers] = useState([]);
    const [repairerNames, setRepairerNames] = useState([]);
    const [repairerContacts, setRepairerContacts] = useState([]);
    const navigate = useNavigate();
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setErrors(prev => ({ ...prev, [name]: "" }));
        setProductData({ ...productData, [name]: value });
    };
    const handleRepairerChange = (value) => {
        const selected = repairers.find((item) => item.name === value);
        setProductData({
            ...productData,
            repairer_name: value,
            repairer_contact_number: selected?.contact || "",
        });
    };

    const handleRepairContactChange = (value) => {
        const selected = repairers.find((item) => item.contact === value);
        setProductData({
            ...productData,
            repairer_contact_number: value,
            repairer_name: selected?.name || "",
        });
    };
    const handleBrandProductData = (value) => {
        setErrors(prev => ({ ...prev, brand_name: "" }));
        setProductData(productData => ({ ...productData, brand_name: value }));
    };

    const handleModelProductData = (value) => {
        setErrors(prev => ({ ...prev, model_name: "" }));
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
    const getAllImeis = () => {
        let url = `${API_URLS.PRODUCTS}?status=AVAILABLE,RETURN`;
        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getImeisCallback,
        });
    };
    const getImeisCallback = (response) => {
        if (response.status === 200) {
            const imeis = response.data.map(item => item.imei_number);
            setImeiOptions(imeis);
        } else {
            console.error("IMEI numbers fetching error");
        }
    };
    const getProductDataByIMEI = (imei) => {
        if (!imei) return;
        // const url = `${API_URLS.PRODUCTS}?imei_number=${imei}`;
        const url = `${API_URLS.PRODUCTS}?imei_number=${imei}&status=AVAILABLE,RETURN`;

        apiCall({
            method: "GET",
            url,
            data: {},
            callback: getProductDataCallback,
            setLoading: setLoading
        });
    };
    const getProductDataCallback = (response) => {
        if (response.status === 200 && response.data.length > 0) {
            const product = response.data[0];
            setProductData({
                id: product.id ?? product._id ?? "",
                imei_number: product.imei_number || "",
                brand_name: product.brand?.name || (product.model?.brand?.name || ""),
                model_name: product.model?.name || "",
                grade: product.grade || "",
                purchase_price: product.purchase_price || "",
                engineer_name: product.engineer_name || "",
                accessories: product.accessories || "",
                issue: "",
                repairer_name: "",
                repairer_contact_number: ""
            });
        } else {
            toast.error("This IMEI is not AVAILABLE or RETURN.");
            setProductData({
                id: "",
                imei_number: "",
                brand_name: "",
                model_name: "",
                grade: "",
                purchase_price: "",
                engineer_name: "",
                accessories: "",
                issue: "",
                repairer_name: "",
                repairer_contact_number: ""
            });
        }
    };
    const updateRepairCallback = (response) => {
        setLoading(false);
        console.log("Response from PUT request:", response);
        if (response.status === 200) {
            toast.success("Repair details updated successfully!");
            navigate("/repair");
        } else {
            toast.error("Failed to update repair details");
            console.error(response);
        }
    };
    const handleValidation = () => {
        const newErrors = {};

        if (!selectedImei.trim()) newErrors.imei_number = "Please select IMEI Number";
        if (!productData.brand_name.trim()) newErrors.brand_name = "Please select Brand Name";
        if (!productData.model_name.trim()) newErrors.model_name = "Please select Model Name";
        if (!productData.grade.trim()) newErrors.grade = "Please select Grade";
        if (!productData.purchase_price.trim() || isNaN(productData.purchase_price))
            newErrors.purchase_price = "Please enter valid Purchase Price";
        if (!productData.engineer_name.trim()) newErrors.engineer_name = "Please enter Engineer Name";
        if (!productData.issue.trim()) newErrors.issue = "Please describe the Issue";
        // if (!productData.accessories.trim()) newErrors.accessories = "Please select Accessories";
        // if (!productData.repairer_name.trim()) newErrors.repairer_name = "Please select Repairer";
        // if (!productData.repair_contact_no.trim()) newErrors.repair_contact_no = "Repair contact is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const saveRepairData = () => {
        if (!handleValidation()) return;
        if (!productData.id) {
            toast.error("No product selected for repair");
            return;
        }
        setLoading(true);
        const payload = {
            issue: productData.issue,
            repairer_name: productData.repairer_name,
            repairer_contact_number: productData.repairer_contact_number,
            status: "IN_REPAIRING",
            repair_by: productData.selectedRepairerId,
        };
        apiCall({
            method: "PUT",
            url: `${API_URLS.PRODUCTS}/${productData.id}/repair`,
            data: payload,
            callback: updateRepairCallback,
            setLoading,
        });
    };
    const getRepairersCallback = (response) => {
        if (response.status === 200) {
            const data = response.data.map((item) => ({
                name: item.name,
                contact: item.contact_number,
            }));

            setRepairers(data);
            setRepairerNames(data.map((item) => item.name));
            setRepairerContacts(data.map((item) => item.contact));
        }
    };
    const getAllRepairers = useCallback(() => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.USERS}?role=REPAIRER`,
            data: {},
            callback: getRepairersCallback,
        });
    }, []);
    useEffect(() => {
        getBrandsAllData();
        getModelsAllData();
        getAllImeis();
        getAllRepairers();
    }, [getBrandsAllData, getModelsAllData, getAllRepairers]);
    useEffect(() => {
        if (selectedImei.length === 15) {
            getProductDataByIMEI(selectedImei);
        }
    }, [selectedImei]);
    const isImeiSelected = !!productData.id;
    return (
        <div>
            {loading && <Spinner />}
            <div className="grid grid-cols-3 mt-2 gap-x-5 gap-y-1">
                <CustomDropdownInputComponent
                    name="IMEI Number"
                    dropdownClassName="w-[190px]"
                    labelClassName="font-serif font-bold"
                    placeholder="Scan IMEI No"
                    value={selectedImei}
                    maxLength={15}
                    numericOnly={true}
                    onChange={(value) => setSelectedImei(value)}
                    options={
                        selectedImei.length >= 11
                            ? imeiOptions.filter((imei) => imei.startsWith(selectedImei))
                            : []
                    }
                    error={errors.imei_number}
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
                    error={errors.brand_name}
                    disabled={isImeiSelected}

                />
                <CustomDropdownInputComponent
                    name="Model Name"
                    dropdownClassName="w-[80%]"
                    placeholder="Enter Model Name"
                    labelClassName="font-serif font-bold"
                    options={modelOptions}
                    value={productData.model_name}
                    onChange={handleModelProductData}
                    error={errors.model_name}
                    disabled={isImeiSelected}

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
                    error={errors.grade}
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
                    error={errors.purchase_price}
                    disabled={isImeiSelected}
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
                    error={errors.engineer_name}
                    disabled={isImeiSelected}
                />
                <InputComponent
                    label="Issue"
                    type="text"
                    name="issue"
                    placeholder="Issue"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={productData.issue}
                    onChange={handleInputChange}
                    error={errors.issue}
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
                <CustomDropdownInputComponent
                    name="Repairer Name"
                    placeholder="Select Repairer"
                    options={repairerNames}
                    value={productData.repairer_name}
                    onChange={handleRepairerChange}
                    dropdownClassName="w-[80%]"
                />
                <CustomDropdownInputComponent
                    name="Contact Number"
                    placeholder="Select Contact Number"
                    options={repairerContacts}
                    value={productData.repairer_contact_number}
                    onChange={handleRepairContactChange}
                    dropdownClassName="w-[80%]"
                    numericOnly={true}
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