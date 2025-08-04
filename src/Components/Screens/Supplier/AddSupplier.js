import { useNavigate } from "react-router-dom";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { SUPPLIER_TYPE_OPTIONS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import { useEffect, useState } from "react";

function AddSupplier() {
    const navigate = useNavigate();
    const [supplierData, setSupplierData] = useState({
        name: "",
        firm_name: "",
        state: "",
        address: "",
        contact_number: "",
        contact_number_2: "",
        gst_number: "",
        email: "",
        type: "",
        role: "SUPPLIER",
    });
    useEffect(() => {
        addSupplier();
    }, []);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSupplierData({ ...supplierData, [name]: value });
    };
    const addSupplierCallback = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            setSupplierData({
                name: "",
                firm_name: "",
                state: "",
                address: "",
                contact_number: "",
                contact_number_2: "",
                gst_number: "",
                email: "",
                type: "",
                role: "SUPPLIER",
            });
        } else {
            console.log("Error");
        }
    };
    const addSupplier = () => {
        apiCall({
            method: "POST",
            url: "https://3-extent-billing-backend.vercel.app/api/users",
            data: supplierData,
            callback: addSupplierCallback,
        });
    };
    return (
        <div className="w-full">
            <div className='text-xl font-serif mb-4'>Add Supplier</div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Supplier Name"
                    type="text"
                    name="name"
                    placeholder="Supplier Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.name}
                    onChange={handleInputChange}
                />
                <InputComponent
                    name="firm_name"
                    label="Firm Name"
                    type="text"
                    placeholder="Firm Name"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.firm_name}
                    onChange={handleInputChange}
                />
                <InputComponent
                    name="state"
                    label="State"
                    type="text"
                    placeholder="State"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.state}
                    onChange={handleInputChange}
                />
                <InputComponent
                    name="address"
                    label="Address"
                    type="text"
                    placeholder="Address"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.address}
                    onChange={handleInputChange}
                />
                <InputComponent
                    name="contact_number"
                    label="Contact No 1"
                    type="text"
                    placeholder="Contact No 1"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.contact_number}
                    onChange={handleInputChange}
                />
                <InputComponent
                    name="contact_number_2"
                    label="Contact No 2"
                    type="text"
                    placeholder="Contact No 2"
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.contact_number_2}
                    onChange={handleInputChange}
                />
                <InputComponent
                    name="gst_number"
                    label="GST No."
                    type="text"
                    placeholder="GST No."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.gst_number}
                    onChange={handleInputChange}
                />
                <InputComponent
                    name="email"
                    label="Email ID."
                    type="text"
                    placeholder="Email ID."
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.email}
                    onChange={handleInputChange}

                />
                <DropdownCompoent
                    name="type"
                    label="Supplier Type"
                    options={SUPPLIER_TYPE_OPTIONS}
                    placeholder="Supplier Type"
                    className="w-[80%]"
                    labelClassName="font-serif font-bold"
                    value={supplierData.type}
                    onChange={handleInputChange}

                />
            </div>
            <div className="mt-4 flex justify-center">
                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-save"
                    buttonClassName="mt-2 py-1 px-5 text-xl font-bold"
                    onClick={addSupplier}
                />
            </div>
        </div>

    )
} export default AddSupplier;