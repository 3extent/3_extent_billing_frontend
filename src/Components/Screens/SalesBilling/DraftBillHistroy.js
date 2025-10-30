import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS } from "./Constants";
import { apiCall } from "../../../Util/AxiosUtils";
import moment from "moment";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
export default function DraftBillHistroy() {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        getDraftBillHistory();
    }, []);

    const getDraftBillHistory = () => {
        let url = `https://3-extent-billing-backend.vercel.app/api/billings`;
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: (response) => {
                if (response.status === 200) {
                    const draftFormattedRows = response.data.map((bill, index) => ({
                        "Bill id": index + 1,
                        "Date": moment(bill.created_at).format('ll'),
                        "Customer Name": bill.customer.name,
                        "Contact Number": bill.customer.contact_number,
                        "Total Amount": bill.payable_amount,
                        "Remaining Amount": bill.pending_amount,
                        "Profit": bill.profit,
                        _id: bill._id,
                        "Status": bill.status || "Draft",
                        "Actions": (
                            <div className="flex items-center justify-end gap-2">
                                <div>
                                    <PrimaryButtonComponent
                                        label="Pay"
                                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                                    />
                                </div>
                                <PrimaryButtonComponent
                                    label="Print"
                                    icon="fa fa-print"
                                    buttonClassName="py-1 px-3 text-[12px] font-semibold"
                                />
                            </div>
                        )

                    }));
                    setRows(draftFormattedRows);
                } else {
                    console.log("Error fetching draft bills");
                }
            }
        });
    };
    return (

        <div>
            <div className="text-xl font-serif">Draft Bill History</div>
            <div>
            <CustomTableCompoent
                headers={BILLINGHISTORY_COLOUMNS}
                rows={rows}
            />
            </div>
        </div>
    );
}