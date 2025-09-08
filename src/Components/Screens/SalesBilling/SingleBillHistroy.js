import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { SINGLEBILLHISTORY_COLOUMNS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import { useParams } from "react-router-dom";

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
            const singleBillHistrotFormattedRows = [{
                "Bill ID":  bill._id,
                "Date": bill.createdAt,
                "Customer Name": bill.customer.name,
                "Contact Number": bill.customer.contact_number,
                "Total Amount": bill.total_amount,
                "Remaining Amount": bill.remaining_amount,
                "Profit":bill.profit
            }]
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
    return (
        <div>
            <CustomTableCompoent
                headers={SINGLEBILLHISTORY_COLOUMNS}
                rows={rows}
            />
        </div>

    );
}