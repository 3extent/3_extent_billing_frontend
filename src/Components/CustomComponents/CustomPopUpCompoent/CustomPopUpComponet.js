import InputComponent from "../InputComponent/InputComponent";
import PrimaryButtonComponent from "../PrimaryButtonComponent/PrimaryButtonComponent";
export default function CustomPopUpComponet({ totalAmount, cashAmount, onlineAmount, card, pendingAmount, handleCancelButton, handlePrintButton, setCashAmount, setOnlineAmount, setCard }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white shadow-lg w-[40%] rounded-[10px]">
                <div className="text-lg py-5 font-bold  pl-7 bg-slate-900 text-white font-serif rounded-t-[10px]">Payment Method</div>
                <div className="pb-5">
                    <div className="my-5">
                        <span className="font-bold gap-4 ml-7 text-[18px]">
                            Total Amount : {Number(totalAmount).toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="flex gap-4 items-center justify-center mt-5">
                        <InputComponent
                            label="CASH"
                            type="text"
                            value={cashAmount}
                            labelClassName="font-bold"
                            onChange={(e) => setCashAmount(e.target.value)}
                            inputClassName=" w-[150px]"
                        />
                        <InputComponent
                            label="ONLINE"
                            type="text"
                            placeholder=""
                            value={onlineAmount}
                            labelClassName="font-bold"
                            onChange={(e) => setOnlineAmount(e.target.value)}
                            inputClassName="w-[150px] "
                        />
                        <InputComponent
                            label="CARD"
                            type="text"
                            placeholder=""
                            value={card}
                            labelClassName="font-bold"
                            onChange={(e) => setCard(e.target.value)}
                            inputClassName="w-[150px] "
                        />
                    </div>
                    <div className="my-5">
                        <span className="font-bold gap-4 ml-7 text-[18px]">
                            Pending Amount : {Number(pendingAmount).toLocaleString("en-IN")}
                        </span>
                    </div>
                    <div className="flex justify-end gap-3 mt-3 mr-7">
                        <PrimaryButtonComponent
                            label="Cancel"
                            buttonClassName="py-1 px-3 text-sm font-bold bg-transparent text-black"
                            onClick={handleCancelButton}
                        />
                        <PrimaryButtonComponent
                            label="Print"
                            buttonClassName="py-1 px-3 text-sm font-bold "
                            onClick={handlePrintButton}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}