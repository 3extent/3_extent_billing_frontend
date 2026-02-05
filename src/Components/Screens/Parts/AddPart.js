import { useCallback, useEffect, useState } from "react";
import DropdownComponent from "../../CustomComponents/DropdownComponent/DropdownComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";

function AddPart() {

    const [shopNameOptions, setshopNameOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([])
    const [errors, setErrors] = useState("");

    const navigate = useNavigate();
    const [PartData, setPartData] = useState({
        part_name: "",
        part_cost: "",
        shop_name: "",
        model_name: ""

    });


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setErrors(prev => ({ ...prev, [name]: "" }));
        setPartData({ ...PartData, [name]: value });
    };

    const getShopCallBack = (response) => {
        if (response.status === 200) {
            const shops = response.data.users.map(shop => shop.name);
            setshopNameOptions(shops);
        } else {
            console.log("Error fetching shops");
        }
    };

    const handleValidation = () => {
        const newErrors = {};
        if (!PartData.model_name.trim()) {
            newErrors.model_name = "Please Select Model";
        }
        if (!PartData.part_name.trim()) {
            newErrors.part_name = "Please Enter Part Name";
        }
        if (!PartData.part_cost.trim()) {
            newErrors.part_cost = "Part Cost is required";
        }
        if (!PartData.shop_name.trim()) {
            newErrors.shop_name = "Please select Shop Name";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getShopAllData = useCallback(() => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.USERS}?role=PARTS_SHOP`,
            data: {},
            callback: getShopCallBack,
        });
    }, []);

    const addpartCallback = (response) => {
        if (response.status === 200) {
            toast.success("Part added successfully!!", {
                position: "top-center",
                autoClose: 2000,
            });
            navigate("/partshopDetails");
        }
        else {
            const errorMsg = response?.data?.error || "Failed to add part";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };


    const addPartDetails = () => {
        if (!handleValidation()) return;

        apiCall({
            method: "POST",
            url: API_URLS.PART,
            data: PartData,
            callback: addpartCallback,
            // setLoading: setLoading
        });
    };
    const getModelsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const models = response.data.map(model => model.name);
            setModelOptions(models);
            console.log('models: ', models);
        } else {
            console.log("Error");
        }
    }
    const getModelsAllData = useCallback(() => {
        apiCall({
            method: 'GET',
            url: API_URLS.MODEL,
            data: {},
            callback: getModelsCallBack,
        })
    }, []);

    useEffect(() => {
        getShopAllData();
        getModelsAllData();
    }, [getShopAllData,]);

    const handleBack = () => {
        navigate(-1);
    };
    return (
        <div>
            <div className="text-xl font-serif mb-4">Add Part</div>
            <div className="grid grid-cols-2">
                <CustomDropdownInputComponent
                    name="Model Name"
                    type="text"
                    placeholder="Select a Model"
                    dropdownClassName="w-[90%] "
                    options={modelOptions}
                    value={PartData.model_name}
                    onChange={(value) => {
                        setPartData({ ...PartData, model_name: value });
                        setErrors((prev) => ({ ...prev, model_name: "" }));
                    }}
                    error={errors.model_name}
                />
                <DropdownComponent
                    label="Shop Name"
                    name="shop_name"
                    placeholder="Select Shop Name"
                    value={PartData.shop_name}
                    options={shopNameOptions}
                    onChange={handleInputChange}
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                    error={errors.shop_name}
                />
            </div>
            <div className="grid grid-cols-2 mt-3">
                <InputComponent
                    label="Part Name"
                    name="part_name"
                    type="text"
                    value={PartData.part_cost.amount}
                    onChange={handleInputChange}
                    inputClassName="w-[90%]"
                    labelClassName="font-serif font-bold mb-1"
                    error={errors.part_name}

                />

                <InputComponent
                    label="Part Cost"
                    name="part_cost"
                    type="text"
                    numericOnly
                    value={PartData.part_cost}
                    onChange={handleInputChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    error={errors.part_cost}

                />
            </div>
            <div className="flex mt-10 gap-5">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-bookmark-o"
                    onClick={addPartDetails}
                />
            </div>


        </div>

    );
} export default AddPart;