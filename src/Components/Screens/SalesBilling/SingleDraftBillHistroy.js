import { useNavigate, useParams } from "react-router-dom";
import { SINGLEBILLHISTORY_COLOUMNS } from "./Constants";
import { useEffect, useState } from "react";
import moment from "moment";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { API_URLS } from "../../../Util/AppConst";
export default function SingleDraftBillHistory() {
    const { draftBillId } = useParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [customerInfo, setCustomerInfo] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (draftBillId) {
            getSingleBillHistroyAllData(draftBillId);
        }
    }, [draftBillId]);
    const getSingleDraftBillHistroyCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const bill = response.data;
            setCustomerInfo({
                name: bill.customer?.name,
                contact: bill.customer?.contact_number,
                invoice: bill.invoice_number,
                address: bill.customer?.address,
                gstno: bill.customer?.gst_number,
                amount: bill.payable_amount,
                date: moment((bill.created_at)).format('ll')
            });
            const singleBillHistrotFormattedRows = bill.products.map((product, index) => ({
                "Sr.No": index + 1,
                "IMEI NO": product.imei_number,
                "Brand": product.model.brand?.name,
                "Model": product.model?.name,
                "Rate": product.sales_price,
                "QC-Remark": product.qc_remark,
                "Grade": product.grade,
                "Accessories": product.accessories,
            }));
            setRows(singleBillHistrotFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getSingleBillHistroyAllData = (id) => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.BILLING}/${id}`,
            data: {},
            callback: getSingleDraftBillHistroyCallBack,
            setLoading: setLoading
        })
    };
    const handleNavigateDraftedBillHistroy = () => {
        navigate(-1);
    }
    return (
        <div>
            {loading && <Spinner />}
            <div className="flex justify-between items-center">
                <div className="text-xl font-serif">Details Of Drafted Bill</div>
                <div className="flex gap-4">
                    <PrimaryButtonComponent
                        label="Back"
                        icon="fa fa-arrow-left"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={handleNavigateDraftedBillHistroy}
                    />
                </div>
            </div>
            <div className="my-5">
                {customerInfo && (
                    <div className="">
                        <div className="text-[16px] font-semibold">
                            Customer Name :<span className="font-normal text-[14px]">{customerInfo.name}</span>
                        </div>
                        <div className="text-[16px] font-semibold">
                            Contact Number : <span className="font-normal text-[14px]">{customerInfo.contact}</span>
                        </div>
                        <div className="text-[16px] font-semibold">
                            Date: <span className="font-normal text-[14px]">{customerInfo.date}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="h-[64vh]">
                <CustomTableCompoent
                    headers={SINGLEBILLHISTORY_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    );
}