import { useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";

function AddMaintanance() {
    const [maintenanceData, setMaintenanceData] = useState({
        title: "",
        description: "",
        paid_by: "",
        date: "",
        amount: ""
    });
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const uppercasedValue = value.toUpperCase();
        setMaintenanceData({ ...maintenanceData, [name]: uppercasedValue });
    };
    const handleFileChange = (event) => {
        setMaintenanceData({ ...maintenanceData, image: event.target.files[0] });
    };

    return (
        <div className="w-full">
            <div className="text-xl font-serif mb-6">Add Maintenance</div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2">
                <InputComponent
                    label="Title"
                    name="title"
                    type="text"
                    value={maintenanceData.title}
                    onChange={handleInputChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Description"
                    name="description"
                    type="text"
                    value={maintenanceData.description}
                    onChange={handleInputChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Paid By"
                    name="paid_by"
                    type="text"
                    value={maintenanceData.paid_by}
                    onChange={handleInputChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Date"
                    name="date"
                    type="date"
                    value={maintenanceData.date}
                    onChange={handleInputChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />
                <InputComponent
                    label="Amount"
                    name="amount"
                    type="text"
                    value={maintenanceData.amount}
                    onChange={handleInputChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />

                <InputComponent
                    label="Upload Image"
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                    inputClassName="w-[80%]"
                    labelClassName="font-serif font-bold"
                />

            </div>
            <div className="mt-10 flex justify-center gap-5">
                <PrimaryButtonComponent
                    label="Back"
                    icon="fa fa-arrow-left"
                />
                <PrimaryButtonComponent
                    label="Submit"
                    icon="fa fa-save"
                />
            </div>
        </div>
    );
} export default AddMaintanance