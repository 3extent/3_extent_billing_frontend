import { useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { GRADE_OPTIONS } from "./Constants";

export default function AcceptRepair({ open, repair, onClose, onSubmit }) {
    const [repairData, setRepairData] = useState({
        charges: repair?.repair_cost || "",
        grade: repair?.grade || "",
        remark: repair?.repair_remark || "",
        imei: repair?.imei_number || "",
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (repair) {
            setRepairData({
                imei: repair.imei_number || "",
                charges: repair.repair_cost || "",
                grade: repair.grade || "",
                remark: repair.repair_remark || ""
            });
            setErrors({});
        }
    }, [repair]);
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRepairData({ ...repairData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };
    const handleValidation = () => {
        const newErrors = {};
        if (!repairData.imei || !repairData.imei.trim()) {
            newErrors.imei = "Please enter IMEI number";
        } else if (repairData.imei.length !== 15) {
            newErrors.imei = "IMEI must be 15 digits";
        }
        if (!repairData.charges.trim()) newErrors.charges = "Please enter charges";
        if (!repairData.remark.trim()) newErrors.remark = "Please enter repair remark";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = () => {
        if (!handleValidation()) return;
        onSubmit({ ...repairData });
    };
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white shadow-lg w-[40%] rounded-[10px]">
                <div className="text-lg py-5 font-bold  pl-7 bg-slate-900 text-white font-serif rounded-t-[10px]">Accept Repair</div>
                <div className="pb-3">
                    <div className="flex flex-col gap-3 p-6">
                        <InputComponent
                            label="IMEI Number"
                            name="imei"
                            value={repairData.imei}
                            onChange={handleInputChange}
                            inputClassName="w-full"
                            labelClassName="font-bold"
                            numericOnly
                            maxLength={15}
                            error={errors.imei}
                        />
                        <InputComponent
                            label="Charges"
                            type="text"
                            name="charges"
                            numericOnly
                            value={repairData.charges}
                            onChange={handleInputChange}
                            inputClassName="w-full"
                            labelClassName="font-bold"
                            error={errors.charges}
                        />
                        <DropdownCompoent
                            label="Grade"
                            name="grade"
                            options={GRADE_OPTIONS}
                            value={repairData.grade}
                            onChange={handleInputChange}
                            className="w-full"
                            labelClassName="font-bold"
                        />

                        <InputComponent
                            label="Repair Remark"
                            type="text"
                            name="remark"
                            value={repairData.remark}
                            onChange={handleInputChange}
                            inputClassName="w-full"
                            labelClassName="font-bold"
                            error={errors.remark}
                        />

                    </div>
                    <div className="mt-3 flex justify-end gap-2 p-2">
                        <PrimaryButtonComponent
                            label="Cancel"
                            onClick={onClose}
                            className="bg-gray-300 text-black hover:bg-gray-400 px-3 py-1"
                        />
                        <PrimaryButtonComponent
                            label="Accept"
                            onClick={handleSubmit}
                            className="bg-green-500 text-white hover:bg-green-600 px-3 py-1"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
