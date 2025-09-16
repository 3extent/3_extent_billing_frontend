import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { SINGLEBILLHISTORY_COLOUMNS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import { useParams } from "react-router-dom";
import { exportToExcel } from "../../../Util/Utility";
import moment from "moment";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
export default function SingleBillHistory() {
    const { billId } = useParams();
    const [rows, setRows] = useState([]);
    const [customerInfo, setCustomerInfo] = useState();
    useEffect(() => {
        if (billId) {
            getSingleBillHistroyAllData(billId);
        }
    }, [billId]);
    const getSingleBillHistroyCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const bill = response.data;
            setCustomerInfo({
                name: bill.customer?.name,
                contact: bill.customer?.contact_number,
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
                "Accessories": product.accessories
            }));
            setRows(singleBillHistrotFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const getSingleBillHistroyAllData = (id) => {
        let url = `https://3-extent-billing-backend.vercel.app/api/billings/${id}`;
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getSingleBillHistroyCallBack,
        })
    };
    const handleExportToExcel = () => {
        exportToExcel(rows, "SingleBillHistory.xlsx");
    };
    return (
        <div>
            <CustomHeaderComponent
                name="Details of bill"
                label="Export to Excel"
                onClick={handleExportToExcel}
            />
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
            <div>
                <CustomTableCompoent
                    headers={SINGLEBILLHISTORY_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>

    );
}