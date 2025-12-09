import { useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { GRADE_OPTIONS } from "./Constants";

export default function AcceptRepair({ open, repair, onClose, onSubmit }) {
    const [charges, setCharges] = useState(repair?.repair_cost || "");
    const [grade, setGrade] = useState(repair?.grade || "");
    const [remark, setRemark] = useState(repair?.repair_remark || "");

    useEffect(() => {
        setCharges(repair?.repair_cost || "");
        setGrade(repair?.grade || "");
        setRemark(repair?.repair_remark || "");
    }, [repair]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white shadow-lg w-[40%] rounded-[10px]">
                <div className="text-lg py-5 font-bold  pl-7 bg-slate-900 text-white font-serif rounded-t-[10px]">Accept Repair</div>
                <div className="pb-3">
                    <div className="flex flex-col gap-3 p-6">
                        <InputComponent
                            label="Charges"
                            type="text"
                            numericOnly
                            value={charges}
                            onChange={(e) => setCharges(e.target.value)}
                            inputClassName="w-full"
                            labelClassName="font-bold"
                        />
                        <DropdownCompoent
                            label="Grade"
                            options={GRADE_OPTIONS}
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="w-full"
                            labelClassName="font-bold"
                        />
                        <InputComponent
                            label="QC Remark"
                            type="text"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            inputClassName="w-full"
                            labelClassName="font-bold"
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
                            onClick={() => onSubmit({ charges, grade, remark })}
                            className="bg-green-500 text-white hover:bg-green-600 px-3 py-1"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
