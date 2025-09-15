import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { SINGLEBILLHISTORY_COLOUMNS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import { useParams } from "react-router-dom";
import { exportToExcel } from "../../../Util/Utility";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import moment from "moment";
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
                contact: bill.customer?.contact_number
            });
            const singleBillHistrotFormattedRows = bill.products.map((product, index) => ({
                "Sr.No": index + 1,
                "Date": moment(Number(product.created_at)).format('ll'),
                "IMEI NO": product.imei_number,
                "Brand": product.model.brand?.name,   
                "Model": product.model?.name,
                "Rate": product.sales_price,
                "Purchase Price": product.purchase_price,
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
            <div className="text-xl font-serif mb-4">Details of bill</div>
            <div className=" flex justify-between items-center mb-3">
                {customerInfo && (
                    <div className="">
                        <div className="text-[16px] font-semibold">
                            Customer Name :<span className="font-normal text-[14px]">{customerInfo.name}</span>
                        </div>
                        <div className="text-[16px] font-semibold">
                            Contact Number : <span className="font-normal text-[14px]">{customerInfo.contact}</span>
                        </div>
                    </div>
                )}
                <div>
                    <PrimaryButtonComponent
                        label="Export to Excel"
                        onClick={handleExportToExcel}
                    />
                </div>
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