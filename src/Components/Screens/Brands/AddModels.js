import { useEffect, useState } from "react";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
export default function AddModels() {
     const navigate = useNavigate();
          const handleBack = () => {
        navigate(-1);
    };
    const [brandOptions, setBrandOptions] = useState([]);
    const [possibleCombinations, setPossibleCombinations] = useState([]);
    const [selectedCombinations, setSelectedCombinations] = useState([]);
    const [showData, setShowData] = useState(false);
    const[loading,setLoading]=useState(false)
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
      ramOptions.forEach((RAM) => {
        storageOptions.forEach((storage) => {
          combinations.push(`${RAM}/${storage}GB`);
        });
      });
    }
    if (!ramOptions.length && storageOptions.length) {
      storageOptions.forEach((storage) => {
        combinations.push(`${storage}GB`);
      });
    }
    setPossibleCombinations(combinations);
    setShowData(true);
  };
    const handleCheckboxChange = (event) => {
        const value = event.target.value;
        if (event.target.checked) {
            setSelectedCombinations((possibleCombinations) => [...possibleCombinations, value]);
        } else {
            setSelectedCombinations((possibleCombinations) => possibleCombinations.filter((combo) => combo !== value));
        }
    };
    const addModelCallback = (response) => {
        console.log("response:", response);
        if (response.status === 200) {
            setModelData({
                brand_name: "",
                name: "",
                RAM: "",
                storage: ""
            });
            setSelectedCombinations([]);
            setPossibleCombinations([]);
            setShowData(false);
        } else {
            console.log("error");
        }
    };
    const addModel = () => {
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
    };
    useEffect(() => {
        getBrandsAllData();
    }, []);
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
    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif mb-4">Add Model</div>
            <div className="grid grid-cols-2">
                <CustomDropdownInputComponent
                     name="Brand Name"
                     type="text"
                    placeholder="Select a brand"
                    dropdownClassName="w-[90%]"
                    options={brandOptions}
                    value={modelData.brand_name}
                    onChange={(value) => setModelData({ ...modelData, brand_name: value })}
                />
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
            </div>
            <div className="grid grid-cols-2 mt-3">
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
                                        value={combo}
                                        onChange={handleCheckboxChange}

                                    />
                                    <label htmlFor={`combo-${index}`} className="ml-2">{combo}</label>
                                </li>
                            ))}
                        </div>
                    </ul>
                </div>
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
