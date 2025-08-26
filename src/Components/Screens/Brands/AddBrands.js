
import { useEffect, useState } from "react";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function AddBrands() {
    const navigate = useNavigate();
    const [brandData, setBrandData] = useState({
        name: ""
    });
    const [loading, setLoading] = useState(false); 
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBrandData({ ...brandData, [name]: value });
    };
    const addBrandCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            console.log('response: ', response);
            setBrandData({ name: "" });
            toast.success("Brand name succesful", {
                position: "top-right",
                hideProgressBar: true,
                theme: "light",
                closeButton: false,
            });
            navigate("/brands")
        } else {
            console.log("Error while adding brand");
        }
    };
    const addBrand = () => {
        if (brandData.name.trim() === "") {
            toast.error("Please Enter Brand name", {
                position: "top-right",
                hideProgressBar: true,
                theme: "light",
                closeButton: false,
            });
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
