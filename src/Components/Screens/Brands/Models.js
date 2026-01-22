
import { useEffect, useState } from "react";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate } from "react-router-dom";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import { API_URLS } from "../../../Util/AppConst";
export default function Models() {
    const [rows, setRows] = useState([]);
    const [modelName, setModelName] = useState();
    const [brandName, setBrandName] = useState("");
    const [brandOptions, setBrandOptions] = useState([]);
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const navigateAddModels = () => {
        navigate("/addmodels")
    }
    useEffect(() => {
        getModelsAllData({});
        getBrandsAllData();
    }, []);
    const getModelsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const modelFormattedaRows = response.data.map((model, index) => ({
                "Serial Number": index + 1,
                "Model": model.name,
                "Brand": model.brand.name,
                "Actions": (
                    <div className="flex justify-end">
                        <div
                            title="Edit"
                            onClick={() => navigate(`/addmodels/${model._id}`)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-pencil text-gray-700 text-sm" />
                        </div>
                    </div>
                ),

                id: model._id
            }))
            setRows(modelFormattedaRows);
             const modelsMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Models"
            );

            if (modelsMenuItem) {
                const headers = modelsMenuItem.show_table_columns.map(col => col.name);
                setColumns(headers);
            }

        } else {
            console.log("Error");
        }
    }
    const getModelsAllData = ({ brandName, modelName }) => {
        let url = `${API_URLS.MODEL}?`;
        if (modelName) {
            url += `&modelName=${modelName}`
        }
        if (brandName) {
            url += `&brandName=${brandName}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getModelsCallBack,
            setLoading: setLoading
        })
    }
    const getBrandsAllData = () => {
        apiCall({
            method: 'GET',
            url: API_URLS.BRANDS,
            data: {},
            callback: getBrandsCallBack,
        })
    };
    const getBrandsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const brands = response.data.map(brand => brand.name);
            setBrandOptions(brands);
            if (!brandName) {
                setBrandName("");
            }
            console.log('brands: ', brands);
        } else {
            console.log("Error");
        }
    }
    const handleSearchFilter = () => {
        getModelsAllData({ brandName, modelName });
    }
    const handleResetFilter = () => {
        setBrandName('');
        setModelName('');
        getModelsAllData({});
    }
    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Models"
                label="Add Models"
                icon="fa fa-plus-circle"
                buttonclassName="py-1 text-sm"
                onClick={navigateAddModels}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className="flex items-center gap-4">
                <CustomDropdownInputComponent
                    dropdownClassName="w-[190px] mt-1"
                    placeholder="Enter a brand"
                    value={brandName}
                    onChange={(value) => setBrandName(value)}
                    options={brandOptions}
                />
                <InputComponent
                    type="text"
                    placeholder="Enter Models Name"
                    inputClassName="w-[190px] mb-5"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    buttonClassName="mt-1 py-1 px-5"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    buttonClassName="mt-1 py-1 px-5"
                    onClick={handleResetFilter}
                />
            </div>
            <CustomTableCompoent
                maxHeight="h-[75vh]"
                headers={columns}
                rows={rows}
            />
        </div>
    );
}