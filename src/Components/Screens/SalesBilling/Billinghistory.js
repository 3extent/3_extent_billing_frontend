import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { BILLINGHISTORY_COLOUMNS } from "./Constants";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall } from "../../../Util/AxiosUtils";

function Billinghistory() {
    const [rows, setRows] = useState([]);
     useEffect(() => {
             getBillinghistoryAllData();
        }, []);
        const  getBilllinghistoryCallBack = (response) => {
            console.log('response: ', response);
             if (response.status === 200) {
            const billingformattedRows = response.data.map((bill) => ({
                "Bill id": bill._id,
                "Date": bill.date,
                "Customer Name": bill.customer_name,
                "Contact Number": bill.contact_number,
                "Total Bill": bill.total_amount,
            }));
               console.log("Formatted Billing Rows: ", billingformattedRows);
            setRows(billingformattedRows);
            } else {
                console.log("Error");
            }
        }
        
        const getBillinghistoryAllData = () => {
            apiCall({
                method: 'GET',
                url: "https://3-extent-billing-backend.vercel.app/api/billings",
                data: {},
                callback: getBilllinghistoryCallBack,
            })
        }

    return (
        <div>
             <div className='text-xl font-serif mb-4'>Billing History</div>
            <div className="flex items-center gap-4 ">
                            <InputComponent
                                type="text"
                                placeholder="Customer Name"
                                inputClassName="mb-5"
                               
                            />
                             <InputComponent
                                type="number"
                                placeholder="Contact No"
                                inputClassName="mb-5"
                               
                            />
                             <InputComponent
                                type="text"
                                placeholder="Status"
                                inputClassName="mb-5"
                               
                            />
                              <InputComponent
                                type="date"
                                placeholder="Date"
                                inputClassName="mb-5"
                               
                            />
                            
            
                        </div>
                        <div className='flex justify-end mb-2'>
                                        <PrimaryButtonComponent
                                            label="Search"
                                            buttonClassName=" py-1 px-5 text-xl font-bold"
                                            
                                        />
                                        <PrimaryButtonComponent
                                            label="Reset"
                                            buttonClassName="ml-5 py-1 px-5 text-xl font-bold"
                                            
                                        />
                                    </div>
            <div>
                <CustomTableCompoent
                    headers={BILLINGHISTORY_COLOUMNS}
                    rows={rows}
                />
            </div>
        </div>
    )

}
export default Billinghistory;