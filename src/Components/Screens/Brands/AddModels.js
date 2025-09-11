import { useEffect, useState } from "react";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate, useParams, } from "react-router-dom";
export default function AddModels() {
    const navigate = useNavigate();
    const { model_id } = useParams();
    const handleBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        getBrandsAllData();
        getModelData();
    }, [model_id]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [possibleCombinations, setPossibleCombinations] = useState([]);
    const [selectedCombinations, setSelectedCombinations] = useState([]);
    const [showData, setShowData] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        brand_name: "",
        name: "",
        RAM: "",
        storage: ""
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
    };
    const handleShowCombinations = async () => {
        const ramOptions = modelData.RAM
            ? modelData.RAM.split(",").map((ram) => ram.trim())
            : [];
        const storageOptions = modelData.storage
            ? modelData.storage.split(",").map((storage) => storage.trim())
            : [];
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
        } else {
            setSelectedCombinations((possibleCombinations) => possibleCombinations.filter(
                (combo) => combo.ram !== value.ram || combo.storage !== value.storage));
        };
    }
    const addModel = () => {
        let errors = {
            brand_name: "",
            name: "",
            RAM: "",
            storage: ""
        };
        let hasError = false;

        if (modelData.brand_name.trim() === "") {
            errors.brand_name = "Please enter Brand Name";
            hasError = true;
        }
        if (modelData.name.trim() === "") {
            errors.name = "Please enter Model Name";
            hasError = true;
        }
        if (!model_id) {
            if (modelData.RAM.trim() === "") {
                errors.RAM = "Please enter RAM";
                hasError = true;
            }
            if (modelData.storage.trim() === "") {
                errors.storage = "Please enter Storage";
                hasError = true;
            }
            if (selectedCombinations.length === 0) {
                setError("Please select at least one RAM/Storage combination");
                hasError = true;
            }
        }
        if (hasError) {
            setError(errors);
            return;
        }
        setError({
            brand_name: "",
            name: "",
            RAM: "",
            storage: ""
        });
        if (model_id) {
            editModelData();
        } else {
            addModelData();
        };
    };
    const addModelCallback = (response) => {
        console.log("response:", response);
        if (response.status === 201) {
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
            setTimeout(() => {
                navigate("/models");
            }, 2000);
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
            navigate("/models");
        } else {
            setError("Error occurred while saving models");
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
        if (!model_id) return;
        apiCall({
            method: "GET",
            url: `https://3-extent-billing-backend.vercel.app/api/models/${model_id}`,
            data: {},
            callback: (response) => {
                setLoading(false);
                if (response.status === 200) {
                    setModelData({ name: response.data.name, brand_name: response.data.brand.name });
                } else {
                    setError("Failed to fetch model data");
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
                        onChange={(value) => setModelData({ ...modelData, brand_name: value })}

                    />
                    {error.brand_name && (
                        <div className="text-red-600 mt-1 ml-1">{error.brand_name}</div>
                    )}
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
                    />
                    {error.name && (
                        <div className="text-red-600 mt-1 ml-1">{error.name}</div>
                    )}
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
                            />
                            {error.RAM && (
                                <div className="text-red-600 mt-1 ml-1">{error.RAM}</div>
                            )}
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
                            />
                            {error.storage && (
                                <div className="text-red-600 mt-1 ml-1">{error.storage}</div>
                            )}
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
                    onClick={addModel}
                />
            </div>
        </div>
    );
}
