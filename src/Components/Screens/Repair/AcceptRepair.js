import { useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { GRADE_OPTIONS } from "./Constants";
export default function AcceptRepair({ open, repair, onClose, onSubmit, shopOptions }) {
    const [repairData, setRepairData] = useState({
        // partCost: repair?.part_cost || "",
        repairerCost: repair?.repairer_cost || "",
        grade: repair?.grade || "",
        remark: repair?.repair_remark || "",
        qc_remark: repair?.qc_remark || "",
        imei: repair?.imei_number || "",
        parts: [{ name: "", cost: "", shopName: "" }]
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (repair) {
            setRepairData({
                imei: repair.imei_number || "",
                // partCost: repair.part_cost || "",
                repairerCost: repair.repairer_cost || "",
                grade: repair.grade || "",
                remark: repair.repair_remark || "",
                qc_remark: repair?.qc_remark || "",
                parts: [{ name: "", cost: "", shopName: "" }]


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
        // if (!repairData.partCost) newErrors.partCost = "Please enter part cost";
        if (!repairData.repairerCost) {
            newErrors.repairerCost = "Please enter repairer cost";
        }
        if (!repairData.remark || !repairData.remark.trim()) {
            newErrors.remark = "Please enter repair remark";
        }
        if (!repairData.qc_remark || !repairData.qc_remark.trim()) {
            newErrors.qc_remark = "Please enter QC remark";
        }
        repairData.parts.map((part) => {
            if (part.shopName || part.name || part.cost) {
                if (!part.shopName || !part.name || !part.cost) {
                    newErrors.parts = "Please fill all part details";
                }
            }
            return null;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handlePartChange = (index, field, value) => {
        const updatedParts = [...repairData.parts];
        updatedParts[index][field] = value;
        setRepairData({ ...repairData, parts: updatedParts });
        if (errors.parts) {
            setErrors({ ...errors, parts: "" });
        }
    };

    const addPart = () => {
        setRepairData({
            ...repairData,
            parts: [...repairData.parts, { name: "", cost: "", shopName: "" }]
        });
    };

    const removePart = (index) => {
        const updatedParts = repairData.parts.filter((_, i) => i !== index);
        setRepairData({ ...repairData, parts: updatedParts });
    };

    const handleSubmit = () => {
        if (!handleValidation()) return;
        onSubmit({ ...repairData });
    };
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white shadow-lg w-[60%] rounded-[10px]  max-h-[90vh]  overflow-y-auto">
                <div className="text-lg py-5 font-bold  pl-7 bg-slate-900 text-white font-serif rounded-t-[10px]">Accept Repair</div>
                <div className="pb-3">
                    {/* <div className="flex flex-col gap-3 p-6"> */}
                    <div className="grid grid-cols-2 gap-4 p-6">
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
                        {/* <InputComponent
                            label="Part Cost"
                            name="partCost"
                            numericOnly
                            value={repairData.partCost}
                            onChange={handleInputChange}
                            error={errors.partCost}
                            inputClassName="w-full"
                            labelClassName="font-bold"
                        /> */}

                        <InputComponent
                            label="Repairer Cost"
                            name="repairerCost"
                            numericOnly
                            value={repairData.repairerCost}
                            onChange={handleInputChange}
                            error={errors.repairerCost}
                            inputClassName="w-full"
                            labelClassName="font-bold"
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
                        <InputComponent
                            label="QC Remark"
                            type="text"
                            name="qc_remark"
                            placeholder="QC Remark"
                            inputClassName="w-full"
                            labelClassName="font-bold"
                            value={repairData.qc_remark}
                            onChange={handleInputChange}
                            error={errors.qc_remark}
                        />
                        <div className="col-span-2">
                            <label className="font-bold mb-2 block">Parts</label>

                            {repairData.parts.map((part, idx) => (
                                <div key={idx} className="flex gap-3 items-end mb-2">
                                    <DropdownCompoent
                                        label="Shop Name"
                                        value={part.shopName}
                                        options={shopOptions}
                                        onChange={(e) =>
                                            handlePartChange(idx, "shopName", e.target.value)
                                        }
                                        labelClassName="font-bold"
                                    />


                                    <InputComponent
                                        label="Part Name"
                                        value={part.name}
                                        onChange={(e) =>
                                            handlePartChange(idx, "name", e.target.value)
                                        }
                                        inputClassName="w-full"
                                        containerClassName="w-1/2 flex flex-col"
                                        labelClassName="font-bold"

                                    />

                                    <InputComponent
                                        label="Part Cost"
                                        numericOnly
                                        value={part.cost}
                                        onChange={(e) =>
                                            handlePartChange(idx, "cost", e.target.value)
                                        }
                                        inputClassName="w-full"
                                        labelClassName="font-bold"
                                    />
                                    {repairData.parts.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePart(idx)}
                                            className="text-black px-3 py-1 rounded flex items-center justify-center mb-3"
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    )}

                                </div>
                            ))}

                            {errors.parts && (
                                <div className="text-red-500 text-sm">{errors.parts}</div>
                            )}
                            <PrimaryButtonComponent
                                label="Add Part"
                                onClick={addPart}
                                className="bg-blue-500 text-white px-4 py-1"
                            />
                        </div>
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
