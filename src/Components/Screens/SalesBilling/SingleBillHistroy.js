import { useEffect, useState } from "react";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { SINGLEBILLHISTORY_COLOUMNS } from "./Constants";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { exportToExcel, generateAndSavePdf } from "../../../Util/Utility";
import { API_URLS } from "../../../Util/AppConst";
export default function SingleBillHistory() {
    const { billId } = useParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [singleBill, setSingleBill] = useState([])
    const [customerInfo, setCustomerInfo] = useState();
    const [loading, setLoading] = useState(false);
    const [showTotalRow, setShowTotalRow] = useState(false);
    const toggleableColumns = ["Purchase Price", "QC-Remark", "GST Purchase Price", "Supplier Name"];

    const [hiddenColumns, setHiddenColumns] = useState([
        "Purchase Price",
        "QC-Remark",
        "GST Purchase Price",
        "Supplier Name"
    ]);

     const [dynamicHeaders, setDynamicHeaders] = useState(() => {
        return SINGLEBILLHISTORY_COLOUMNS.filter(
            (col) => !["Purchase Price", "QC-Remark", "GST Purchase Price", "Supplier Name"].includes(col)
        );
    });

     const toggleColumn = (columnName) => {
        if (!toggleableColumns.includes(columnName)) return;
        if (dynamicHeaders.includes(columnName)) {
            setDynamicHeaders(dynamicHeaders.filter(col => col !== columnName));
            setHiddenColumns([...hiddenColumns, columnName]);
        } else {
            let newHeaders = [...dynamicHeaders];
            if (columnName === "Purchase Price" || columnName === "GST Purchase Price") {
                const rateIndex = newHeaders.indexOf("Rate");
                if (rateIndex !== -1) newHeaders.splice(rateIndex + 1, 0, columnName);
                else newHeaders.push(columnName);
            } else {
                newHeaders.push(columnName);
            }
            setDynamicHeaders(newHeaders);
            setHiddenColumns(hiddenColumns.filter(col => col !== columnName));
        };
    };

    useEffect(() => {
        if (billId) {
            getSingleBillHistroyAllData(billId);
        }
    }, [billId]);
    const getSingleBillHistroyCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const bill = response.data.billing;
            setCustomerInfo({
                name: bill.customer?.name,
                contact: bill.customer?.contact_number,
                invoice: bill.invoice_number,
                address: bill.customer?.address,
                gstno: bill.customer?.gst_number,
                firmname: bill.customer?.firm_name,
                amount: bill.payable_amount,
                netTotal: bill.net_total,
                cGst: bill.c_gst,
                sGst: bill.s_gst,
                date: moment((bill.created_at)).format('ll')
            });
            const singleBillHistrotFormattedRows = bill.products.map((product, index) => ({
                "Sr.No": index + 1,
                "IMEI NO": product.imei_number,
                "Brand": product.model.brand?.name,
                "Model": product.model?.name,
                "Rate": product.sold_at_price,
                "Sale Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "GST Purchase Price": product.gst_purchase_price,
                "QC-Remark": product.qc_remark,
                "Grade": product.grade,
                "Accessories": product.accessories,
                "Supplier Name": product.supplier?.name,
            }));
            singleBillHistrotFormattedRows.push({
                _id: "total",
                "Sr.No": "Total",
                "IMEI NO": "",
                Brand: "",
                Model: "",
                "Rate": response.data.totalRate?.toLocaleString("en-IN") || 0,
                "Sale Price": response.data.totalSalesPrice?.toLocaleString("en-IN") || 0,
                "Purchase Price": response.data.totalPurchasePrice?.toLocaleString("en-IN") || 0,
                "QC-Remark": "",
                Grade: "",
                Accessories: "",
            });
            setSingleBill(bill);
            setRows(singleBillHistrotFormattedRows);
        } else {
            console.log("Error");
        }
    }
    const handleGenaratePdf = () => {
        generateAndSavePdf(
            customerInfo.name,
            customerInfo.invoice,
            customerInfo.contact,
            customerInfo.address,
            customerInfo.gstno,
            singleBill.products,
            customerInfo.amount,
            customerInfo.firmname,
            customerInfo.netTotal,
            customerInfo.cGst,
            customerInfo.sGst,
        );
    }
    const getSingleBillHistroyAllData = (id) => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.BILLING}/${id}`,
            data: {},
            callback: getSingleBillHistroyCallBack,
            setLoading: setLoading
        })
    };
    const handleNavigateBillHistroy = () => {
        navigate(-1);
    }
    const handleExportToExcel = () => {
        exportToExcel(rows, "billData.xlsx", customerInfo);
    };
    return (
        <div>
            {loading && <Spinner />}
            <div className="flex justify-between items-center">
                <div className="text-xl font-serif">Details of bill</div>
                <div className="flex gap-4">
                    <PrimaryButtonComponent
                        label="Back"
                        icon="fa fa-arrow-left"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={handleNavigateBillHistroy}
                    />
                    <PrimaryButtonComponent
                        label="Print"
                        icon="fa fa-print"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={handleGenaratePdf}
                    />
                    <PrimaryButtonComponent
                        label="Export to Excel"
                        icon="fa fa-file-excel-o"
                        onClick={handleExportToExcel}
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
                            Firm Name :<span className="font-normal text-[14px]">{customerInfo.firmname || "-"}</span>
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
                    headers={dynamicHeaders}
                    rows={rows}
                    toggleableColumns={toggleableColumns}
                    hiddenColumns={hiddenColumns}
                    onToggleColumn={toggleColumn}
                    showTotalRow={showTotalRow}
                />
            </div>
            <div className="flex justify-end">
                <button
                    className="rounded-full"
                    onClick={() => setShowTotalRow(!showTotalRow)}
                >
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}