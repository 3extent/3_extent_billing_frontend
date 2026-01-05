import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { API_URLS } from "../../../Util/AppConst";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import { toast } from "react-toastify";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";
import { generateAndSavePdf } from "../../../Util/Utility";
import { SINGLEDRAFTBILLHISTORY_COLOUMNS } from "./Constants";
export default function SingleDraftBillHistory() {
    const { draftBillId } = useParams();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [customerInfo, setCustomerInfo] = useState();
    const [imeiOptions, setImeiOptions] = useState([]);
    const [selectedImei, setSelectedImei] = useState("");
    const [contactNoOptions, setContactNoOptions] = useState([]);
    const [selectedContactNo, setSelectedContactNo] = useState("");
    const [customers, setCustomers] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (draftBillId) {
            getAllImeis();
            getCustomerAllData();
            getSingleBillHistroyAllData(draftBillId);
        }
    }, [draftBillId]);
    useEffect(() => {
        if (selectedImei.length === 15) {
            addRow(selectedImei);
        }
    }, [selectedImei]);
    useEffect(() => {
        const cash = Number(cashAmount);
        const online = Number(onlineAmount);
        const cardAmt = Number(card);
        const pending = totalAmount - (cash + online + cardAmt);
        setPendingAmount(pending);
    }, [cashAmount, card, onlineAmount, totalAmount, pendingAmount]);
    useEffect(() => {
        const total = rows.reduce((sum, row) => sum + Number(row["Rate"] || 0), 0);
        setTotalAmount(total);
    }, [rows]);
    const handleCancelPopup = () => {
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
    };
    const handleRateChange = (index, newRate) => {
        const updatedRows = [...rows];
        updatedRows[index]["Rate"] = Number(newRate);
        setRows(updatedRows);
    };
    const getCustomerAllData = () => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.USERS}?role=CUSTOMER`,
            data: {},
            callback: getCustomersCallback,
            setLoading: setLoading
        });
    };
    const getCustomersCallback = (response) => {
        if (response.status === 200) {
            setCustomers(response.data.users);
            const contactNos = response.data.users.map(customer => customer.contact_number);
            setContactNoOptions(contactNos);
        } else {
            console.error("Customer contact numbers fetching error");
        }
    };
    const handleContactNoChange = (value) => {
        setSelectedContactNo(value);
        if (!value) {
            setCustomerName("");
            return;
        }
        const customer = customers.find(customer => customer.contact_number === value);
        if (customer) {
            setCustomerName(customer.name);
        } else {
            setCustomerName("");
        }
    };
    const handleDeleteRow = (imeiNumber) => {
        setRows((currentRows) => {
            const updatedRows = [...currentRows];
            const index = updatedRows.findIndex(row => row["IMEI NO"] === imeiNumber);
            if (index !== -1) {
                updatedRows.splice(index, 1);
            }
            const newRows = updatedRows.map((row, index) => ({
                ...row,
                "Sr.No": index + 1,
            }));
            return newRows;
        });
    };
    const getSingleDraftBillHistroyCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const bill = response.data.billing;
            setCustomerInfo({
                invoice: bill.invoice_number,
                address: bill.customer?.address,
                gstno: bill.customer?.gst_number,
                amount: bill.payable_amount,
                date: moment((bill.created_at)).format('ll')
            });
            setCustomerName(bill.customer?.name || "");
            setSelectedContactNo(bill.customer?.contact_number || "");
            const singleBillHistrotFormattedRows = bill.products.map((product, index) => ({
                "Sr.No": index + 1,
                "IMEI NO": product.imei_number,
                "Brand": product.model.brand?.name,
                "Model": product.model?.name,
                "Rate": product.sold_at_price || product.sales_price,
                "Sale Price": product.sales_price,
                "Purchase Price": product.purchase_price,
                "QC-Remark": product.qc_remark,
                "Grade": product.grade,
                "Accessories": product.accessories,
                "Action": (
                    <div className="flex justify-end">
                        <div
                            title="delete"
                            onClick={() => handleDeleteRow(product.imei_number)}
                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        >
                            <i className="fa fa-trash text-gray-700 text-sm" />
                        </div>
                    </div>
                ),
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
    const getAllImeis = () => {
        let url = `${API_URLS.PRODUCTS}?status=AVAILABLE,RETURN`;
        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getImeisCallback,
        });
    };
    const getImeisCallback = (response) => {
        if (response.status === 200) {
            const imeis = response.data.products.map(item => item.imei_number);
            setImeiOptions(imeis);
        } else {
            console.error("IMEI numbers fetching error");
        }
    };
    const handleSaveData = () => {
        if (totalAmount <= 0) {
            toast.warning("Please add products before proceeding to payment.", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }
        handledraftSaveData();
    }
    const paymentUpdateCallback = (response) => {
        if (response.status === 200) {
            toast.success("Payment updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setShowPaymentPopup(false);
            navigate("/billinghistory");
            generateAndSavePdf(
                response.data.customer?.name,
                response.data.invoice_number,
                response.data.customer?.contact_number,
                response.data.customer?.address,
                response.data.customer?.gst_number,
                response.data.products,
                response.data.payable_amount,
                response.data.customer?.firm_name,
                response.data.net_total,
                response.data.c_gst,
                response.data.s_gst
            );

        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving bill.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
            setShowPaymentPopup(false);
        }
    };
    const handlePrintButton = () => {
        if (!draftBillId) return;
        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const totalPaid = cash + online + cardAmt;

        const paymentData = {
            payable_amount: totalAmount,
            paid_amount: [
                { method: "cash", amount: cash },
                { method: "online", amount: online },
                { method: "card", amount: cardAmt },
            ],
            pending_amount: totalAmount - totalPaid,
        };
        apiCall({
            method: "PUT",
            url: `${API_URLS.BILLING}/payment/${draftBillId}`,
            data: paymentData,
            callback: paymentUpdateCallback,
            setLoading: setLoading,
        });
    };
    const draftCallback = (response) => {
        if (response.status === 200) {
            toast.success("Draft saved successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setRows([]);
            setSelectedImei("");
            setCustomerName("");
            setSelectedContactNo("");
            setCashAmount("");
            setOnlineAmount("");
            setCard("");
            setPendingAmount(0);
            navigate("/draftbillhistroy");
        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving draft.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
        }
    }
    const handleDraftData = () => {
        if (!draftBillId) return;
        const billsData = {
            customer_name: customerName,
            contact_number: selectedContactNo,
            products: rows.map((row) => ({
                imei_number: row["IMEI NO"],
                rate: row["Rate"],
            })),
            paid_amount: [
                { method: "cash", amount: Number(cashAmount) },
                { method: "online", amount: Number(onlineAmount) },
                { method: "card", amount: Number(card) },
            ],
            payable_amount: totalAmount,
            pending_amount: totalAmount,
            status: "DRAFTED"
        };
        apiCall({
            method: 'PUT',
            url: `${API_URLS.BILLING}/${draftBillId}`,
            data: billsData,
            callback: draftCallback,
        })
    };
    const saveDraftCallback = (response) => {
        if (response.status === 200) {
            setShowPaymentPopup(true);
        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving draft.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
        }
    }
    const handledraftSaveData = () => {
        if (!draftBillId) return;
        const billsData = {
            customer_name: customerName,
            contact_number: selectedContactNo,
            products: rows.map((row) => ({
                imei_number: row["IMEI NO"],
                rate: row["Rate"],
            })),
            paid_amount: [
                { method: "cash", amount: Number(cashAmount) },
                { method: "online", amount: Number(onlineAmount) },
                { method: "card", amount: Number(card) },
            ],
            payable_amount: totalAmount,
            pending_amount: totalAmount,
            status: "DRAFTED"
        };
        apiCall({
            method: 'PUT',
            url: `${API_URLS.BILLING}/${draftBillId}`,
            data: billsData,
            callback: saveDraftCallback,
        })
    };
    const addRow = (imei) => {
        apiCall({
            method: "GET",
            url: `${API_URLS.PRODUCTS}?imei_number=${imei}`,
            data: {},
            callback: (response) => {
                if (response.status === 200 && response.data.products.length > 0) {
                    const product = response.data.products[0];
                    if (!product || (product.status !== "AVAILABLE" && product.status !== "RETURN")) {
                        toast.warning("Product is already sold !", { position: "top-center", autoClose: 2000 });
                        setSelectedImei("");
                        return;
                    }
                    const newRow = {
                        "Sr.No": rows.length + 1,
                        "IMEI NO": product.imei_number,
                        "Brand": product.model?.brand?.name,
                        "Model": product.model?.name,
                        "Rate": product.sales_price,
                        "Sale Price": product.sales_price,
                        "Purchase Price": product.purchase_price,
                        "QC-Remark": product.qc_remark,
                        "Grade": product.grade,
                        "Accessories": product.accessories,
                        "Action": (
                            <div className="flex justify-end">
                                <div
                                    title="delete"
                                    onClick={() => handleDeleteRow(product.imei_number)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                >
                                    <i className="fa fa-trash text-gray-700 text-sm" />
                                </div>
                            </div>
                        ),
                    };

                    setRows(Rows => [...Rows, newRow]);
                    setSelectedImei("");
                }
            },
            setLoading: setLoading
        });
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
            <div className="mt-2">
                {customerInfo && (
                    <div className="">
                        <div className="text-[16px] font-semibold">
                            Date: <span className="font-normal text-[14px]">{customerInfo.date}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3">
                <CustomDropdownInputComponent
                    label="IMEI No :"
                    dropdownClassName="w-[190px]"
                    placeholder="Scan IMEI No"
                    value={selectedImei}
                    maxLength={15}
                    numericOnly={true}
                    onChange={(value) => setSelectedImei(value)}
                    options={
                        selectedImei.length >= 11
                            ? imeiOptions.filter((imei) => imei.startsWith(selectedImei))
                            : []
                    }
                />
                <CustomDropdownInputComponent
                    dropdownClassName="w-[190px] "
                    placeholder="Select Contact No"
                    value={selectedContactNo}
                    maxLength={10}
                    numericOnly={true}
                    onChange={handleContactNoChange}
                    options={contactNoOptions}
                />
                <InputComponent
                    type="text"
                    placeholder="Enter Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    inputClassName="w-[190px] mb-6"
                />
            </div>
            <CustomTableCompoent
                maxHeight="h-[60vh]"
                headers={SINGLEDRAFTBILLHISTORY_COLOUMNS}
                rows={rows}
                onRateChange={handleRateChange}
                editable={true}
            />
            <div className=" fixed bottom-16 right-5 font-bold gap-4 text-[22px]  flex justify-end">
                Total Amount : {Number(totalAmount).toLocaleString("en-IN")}
            </div>
            <div className=" fixed bottom-5 right-5 flex gap-4 mt-3">
                <PrimaryButtonComponent
                    label="Save"
                    icon="fa fa-cloud-download"
                    onClick={handleSaveData}
                />
                <PrimaryButtonComponent
                    label="Draft"
                    icon="fa fa-pencil-square-o"
                    onClick={handleDraftData}
                />
            </div>
            {showPaymentPopup && (
                <CustomPopUpComponet
                    isbillingHistory={true}
                    totalAmount={totalAmount}
                    cashAmount={cashAmount}
                    onlineAmount={onlineAmount}
                    card={card}
                    pendingAmount={pendingAmount}
                    setCashAmount={setCashAmount}
                    setOnlineAmount={setOnlineAmount}
                    setCard={setCard}
                    handleCancelButton={handleCancelPopup}
                    handlePrintButton={handlePrintButton}
                />
            )}
        </div>

    );
}