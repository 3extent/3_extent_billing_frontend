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
    useEffect(() => {
        if (billId) {
            getSingleBillHistroyAllData(billId);
        }
    }, [billId]);
    const getSingleBillHistroyCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const bill = response.data;
            const singleBillHistrotFormattedRows = bill.products.map((product, index) => ({
                "Sr.No": index + 1,
                "Date": moment(Number(product.created_at)).format('ll'),
                "IMEI NO": product.imei_number,
                "Brand": product.brand?.name,       // safely access nested object property
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
            <div className="mb-2">
                <PrimaryButtonComponent
                    label="Export to Excel"
                    buttonClassName="mt-4 py-2 px-5 text-xl font-bold"
                    onClick={handleExportToExcel}
                />
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