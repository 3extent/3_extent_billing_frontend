import { useEffect, useState } from "react";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate, useParams, } from "react-router-dom";
import { toast } from "react-toastify";
export default function AddModels() {
    const navigate = useNavigate();
    const { model_id } = useParams();
    const handleBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        getBrandsAllData();
    }, [])
    useEffect(() => {
        getModelData();
    }, [model_id]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [possibleCombinations, setPossibleCombinations] = useState([]);
    const [selectedCombinations, setSelectedCombinations] = useState([]);
    const [showData, setShowData] = useState(false);
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({
    });
    const [modelData, setModelData] = useState({
        brand_name: "",
        name: "",
        RAM: "",
        storage: ""
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setModelData({ ...modelData, [name]: value });
        setErrors((prevError) => ({
            ...prevError,
            [name]: "",
        }));
    };
    const handleShowCombinations = async () => {
        const ramOptions = modelData.RAM
            ? modelData.RAM.split(",").map((ram) => ram.trim())
            : [];
        const storageOptions = modelData.storage
            ? modelData.storage.split(",").map((storage) => storage.trim())
            : [];
        const newErrors = {};
        if (!modelData.brand_name.trim()) newErrors.brand_name = "Please enter Brand Name";
        if (!modelData.name.trim()) newErrors.name = "Please enter Model Name";
        if (ramOptions.length === 0) newErrors.RAM = "Please enter RAM";
        if (storageOptions.length === 0) newErrors.storage = "Please enter Storage";
        if (Object.keys(newErrors).length > 0) {
            setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
            return;
        }
        const combinations = [];
        if (ramOptions.length && storageOptions.length) {
            ramOptions.forEach((ram) => {
                storageOptions.forEach((storage) => {
                    combinations.push({ ram, storage });
                });
            });
        }
        if (!ramOptions.length && storageOptions.length) {
            storageOptions.forEach((storage) => {
                combinations.push({ ram: '', storage });
            });
        }
        setPossibleCombinations(combinations);
        setShowData(true);
    };
    const handleCheckboxChange = (event) => {
        const value = JSON.parse(event.target.value);
        if (event.target.checked) {
            setSelectedCombinations((possibleCombinations) => [...possibleCombinations, value]);
            setErrors((prevErrors) => ({
                ...prevErrors,
                combination: ""
            }));

        } else {
            setSelectedCombinations((possibleCombinations) => possibleCombinations.filter(
                (combo) => combo.ram !== value.ram || combo.storage !== value.storage));
        };
    }
    const handleValidation = () => {
        const newErrors = {};
        if (!modelData.brand_name.trim()) newErrors.brand_name = "Please enter Brand Name";
        if (!modelData.name.trim()) newErrors.name = "Please enter Model Name";
        if (!model_id) {
            if (!modelData.RAM.trim()) newErrors.RAM = "Please enter RAM";
            if (!modelData.storage.trim()) newErrors.storage = "Please enter Storage";
            if (selectedCombinations.length === 0)
                newErrors.combination = "Please select at least one RAM/Storage combination";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const saveModel = () => {
        if (!handleValidation()) return;
        if (model_id) {
            editModelData();
        } else {
            addModelData();
        };
    };
    const addModelCallback = (response) => {
        console.log("response:", response);
        if (response.status === 201) {
            toast.success("Model added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setModelData({
                brand_name: "",
                name: "",
                RAM: "",
                storage: ""
            });
            setSelectedCombinations([]);
            setPossibleCombinations([]);
            setShowData(false);
            setTimeout(() => {
                navigate("/models");
            }, 2000);
        } else {
            const errorMsg = response?.data?.error || "Failed to add model";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
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
            const brands = response.data.map(brand => brand.name);
            setBrandOptions(brands);
            console.log('brands: ', brands);
        } else {
            console.log("Error");
        }
    }
    const submitCallback = (response) => {
        if (response.status === 200) {
            toast.success("Model updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/models");
        } else {
            console.log('response: ', response);
            const errorMsg = response?.data?.error || "Failed to update model";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const addModelData = () => {
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/models",
            data: {
                brand_name: modelData.brand_name,
                name: modelData.name,
                ramStorage: selectedCombinations
            },
            callback: addModelCallback,
            setLoading: setLoading
        });
    }
    const editModelData = () => {
        apiCall({
            method: "PUT",
            url: `https://3-extent-billing-backend.vercel.app/api/models/${model_id}`,
            data: {
                brand_name: modelData.brand_name,
                name: modelData.name,
            },
            callback: submitCallback,
            setLoading: setLoading
        });
    }
    const getModelData = () => {
        apiCall({
            method: "GET",
            url: `https://3-extent-billing-backend.vercel.app/api/models/${model_id}`,
            data: {},
            callback: (response) => {
                setLoading(false);
                if (response.status === 200) {
                    setModelData({ name: response.data.name, brand_name: response.data.brand.name });
                } else {
                    setErrors("Failed to fetch model data");
                }
            },
            setLoading: setLoading
        });
    }
    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif mb-4">{model_id ? "Edit Model" : "Add Model"}</div>
            <div className="grid grid-cols-2">
                <div>
                    <CustomDropdownInputComponent
                        name="Brand Name"
                        type="text"
                        placeholder="Select a brand"
                        dropdownClassName="w-[90%]"
                        options={brandOptions}
                        value={modelData.brand_name}

                        onChange={(value) => {
                            setModelData({ ...modelData, brand_name: value });
                            setErrors((prev) => ({ ...prev, brand_name: "" }));
                        }}
                        error={errors.brand_name}
                    />
                </div>
                <div>
                    <InputComponent
                        label="Model Name"
                        name="name"
                        type="text"
                        placeholder="Enter Model Name"
                        inputClassName="w-[80%]"
                        labelClassName="font-bold"
                        value={modelData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                </div>
            </div>
            {!model_id && (
                <>
                    <div className="grid grid-cols-2 mt-3">
                        <div>
                            <InputComponent
                                label="RAM"
                                name="RAM"
                                type="text"
                                placeholder="Enter RAM"
                                inputClassName="w-[90%]"
                                labelClassName="font-bold"
                                value={modelData.RAM}
                                onChange={handleInputChange}
                                error={errors.RAM}
                            />
                        </div>
                        <div>
                            <InputComponent
                                label="Storage"
                                name="storage"
                                type="text"
                                placeholder="Enter Storage"
                                inputClassName="w-[80%]"
                                labelClassName="font-bold"
                                value={modelData.storage}
                                onChange={handleInputChange}
                                error={errors.storage}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-5">
                        <PrimaryButtonComponent
                            label="Show Combination"
                            buttonClassName="mt-2 py-1 px-5 text-sm font-blod"
                            onClick={handleShowCombinations}
                        />
                    </div>
                    {showData && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Possible Combinations (RAM/Storage):</h3>
                            <ul className="">
                                <div className="grid grid-cols-2  md:grid-cols-11">
                                    {possibleCombinations.map((combo, index) => (
                                        <li key={index} className="flex list-none">
                                            <input
                                                type="checkbox"
                                                id={`combo-${index}`}
                                                value={JSON.stringify(combo)}
                                                onChange={handleCheckboxChange}

                                            />
                                            <label htmlFor={`combo-${index}`} className="ml-2">
                                                {combo.ram ? `${combo.ram}/${combo.storage}GB` : `${combo.storage}GB`}

                                            </label>
                                        </li>
                                    ))}
                                </div>
                                {errors.combination && (
                                    <span className="text-red-500 text-sm mt-1">
                                        {errors.combination}
                                    </span>
                                )}
                            </ul>

                        </div>
                    )}
                </>
            )}
            <div className="flex justify-center mt-3">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    buttonClassName="mt-2 py-1 px-5 mr-10 text-xl font-bold"
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-bookmark-o"
                    buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
                    onClick={saveModel}
                />
            </div>
        </div>
    );
}
