
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
export default function AddBrands() {
    const navigate = useNavigate();
    const { brand_id } = useParams();
    const handleBack = () => {
        navigate(-1);
    };
    const [brandData, setBrandData] = useState({
        name: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        getBrandData();
    }, [brand_id]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const hasSpecialChar = /[^a-zA-Z ]/.test(value);
        if (hasSpecialChar) {
            setError("Special characters not allow");
        } else {
            setError("");
        }
        setBrandData({ ...brandData, [name]: value });
    };
    const submitCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            navigate("/brands");
        } else {
            setError("Error occurred while saving brand");
        }
    };
    const deleteCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            navigate("/brands");
        } else {
            setError("Error occurred while deleting brand");
        }
    };
    const addBrandCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            console.log('response: ', response);
            setBrandData({ name: "" });
            navigate("/brands")
        } else {
            console.log("Error while adding brand");
        }
    };
    const addBrand = () => {
        if (brandData.name.trim() === "") {
            console.log("Please enter brand name");
            setError("please Enter Brand Name");
            return;
        }
        if (/[^a-zA-Z ]/.test(brandData.name)) {
            setError("Special characters not allow");
            return;
        }
        setError("");

        if (brand_id) {
            editBrandData();
        } else {
            addBrandData();
        };
    }
    const addBrandData = () => {
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/brands",
            data: brandData,
            callback: addBrandCallback,
            setLoading: setLoading,
        });
    }
    const editBrandData = () => {
        apiCall({
            method: "PUT",
            url: `https://3-extent-billing-backend.vercel.app/api/brands/${brand_id}`,
            data: brandData,
            callback: submitCallback,
            setLoading: setLoading
        });
    }
    const getBrandData = () => {
        apiCall({
            method: "GET",
            url: `https://3-extent-billing-backend.vercel.app/api/brands/${brand_id}`,
            data: {},
            callback: (response) => {
                setLoading(false);
                if (response.status === 200) {
                    setBrandData({ name: response.data.name });
                } else {
                    setError("Failed to fetch brand data");
                }
            },
            setLoading: setLoading
        });
    }
    const handleDelete = () => {
        setLoading(true);
        apiCall({
            method: "DELETE",
            url: `https://3-extent-billing-backend.vercel.app/api/brands/${brand_id}`,
            data: {},
            callback: deleteCallback,
            setLoading: setLoading
        });
    };
    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif mb-4">{brand_id ? "Edit Brand" : "Add Brand"}</div>
            {error && (
                <div className="text-red-600 mt-1 ml-1">
                    {error}
                </div>
            )}
            <InputComponent
                label="Brand Name"
                type="text"
                name="name"
                placeholder="Enter Brand Name"
                inputClassName="w-[40%]"
                labelClassName="font-bold"
                value={brandData.name}
                onChange={handleInputChange}
            />
            <div className="flex mt-2 gap-4">
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
                    onClick={addBrand}
                />
                {brand_id && (
                    <PrimaryButtonComponent
                        label="Delete"
                        icon="fa fa-trash"
                        buttonClassName="mt-2 py-1 px-5 text-xl font-bold text-white bg-red-400 bg-opacity-90 hover:bg-red-700"
                        onClick={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}
