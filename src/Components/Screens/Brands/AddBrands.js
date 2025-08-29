
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useNavigate } from "react-router-dom";
export default function AddBrands() {
    const navigate = useNavigate();
    const [brandData, setBrandData] = useState({
        name: ""
    });
    const [loading, setLoading] = useState(false); 
     const [error, setError] = useState("");
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBrandData({ ...brandData, [name]: value });
        setError("");
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
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/brands",
            data: brandData,
            callback: addBrandCallback,
             setLoading: setLoading,
        });
    };
    return (
        <div>
            {loading && <Spinner />}
            <div className="text-xl font-serif mb-4">Add Brand</div>
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
            <PrimaryButtonComponent
                label="Submit"
                icon="fa fa-bookmark-o"
                buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
                onClick={addBrand}
            />
        </div>
    );
}
