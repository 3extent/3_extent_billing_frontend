
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
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
        if (brand_id) {
            getBrandData();
        }
    }, [brand_id]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const uppercasedValue = value.toUpperCase();
        const hasSpecialChar = /[^a-zA-Z ]/.test(uppercasedValue);
        if (hasSpecialChar) {
            setError("Special characters not allow");
        } else {
            setError("");
        }
        setBrandData({ ...brandData, [name]: uppercasedValue });
    };
    const submitCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            toast.success("Brand updated successfully!", { position: "top-center", autoClose: 2000 });
            navigate("/brands");
        } else {
            const errorMsg = response?.data?.error || "Error occurred while saving brand";
            toast.error(errorMsg, { position: "top-center", autoClose: 2000 });
        }
    };
    const addBrandCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            console.log('response: ', response);
            toast.success("Brand added successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setBrandData({ name: "" });
            setTimeout(() => {
                navigate("/brands");
            }, 2000);
        } else {
            const errorMsg = response?.data?.error || "Something went wrong";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const addBrand = () => {
        if (brandData.name.trim() === "") {
            console.log("Please enter brand name");
            setError("Please enter brand name");
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
                if (response.status === 200) {
                    setBrandData({ name: response.data.name });
                } else {
                    setError("Failed to fetch brand data");
                }
            },
            setLoading: setLoading
        });
    }
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
            <div className="flex mt-10 gap-5">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"        
                    onClick={handleBack}
                />
                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-bookmark-o"
                    onClick={addBrand}
                />
            </div>
        </div>
    );
}
