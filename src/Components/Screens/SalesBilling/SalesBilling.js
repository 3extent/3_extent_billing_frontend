import { useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import CustomDropdownInputComponent from "../../CustomComponents/CustomDropdownInputComponent/CustomDropdownInputComponent";
import { useNavigate } from "react-router-dom";
import { exportToExcel, generateAndSavePdf } from "../../../Util/Utility";
import moment from "moment";
import { toast } from "react-toastify";
import { API_URLS } from "../../../Util/AppConst";
import CustomPopUpComponent from "../../CustomComponents/CustomPopUpComponent/CustomPopUpComponent";
import CustomTableComponent from "../../CustomComponents/CustomTableComponent/CustomTableComponent";
import * as XLSX from "xlsx";
export default function SalesBilling() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const [allColumns, setAllColumns] = useState([]);
    const [columns, setColumns] = useState([]);
    const navigate = useNavigate();


    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);
    const [hiddenDropdownColumns, setHiddenDropdownColumns] = useState([]);
    const [hiddenColumns, setHiddenColumns] = useState([]);

    const handleDeleteRow = (imeiNumber) => {
        setRows((currentRows) => {
            const updatedRows = [...currentRows];
            const index = updatedRows.findIndex(row => row["IMEI Number"] === imeiNumber);
            if (index !== -1) {
                updatedRows.splice(index, 1);
            }
            const newRows = updatedRows.map((row, index) => ({
                ...row,
                "Serial Number": index + 1,
            }));
            return newRows;
        });
    };

    const [imeiOptions, setImeiOptions] = useState([]);
    const [selectedImei, setSelectedImei] = useState("");
    const [contactNoOptions, setContactNoOptions] = useState([]);
    const [selectedContactNo, setSelectedContactNo] = useState("");
    const [customers, setCustomers] = useState([]);
    const [customerName, setCustomerName] = useState("");

    const handleRateChange = (index, newRate) => {
        console.log('newRate: ', newRate);
        const updatedRows = [...rows];
        updatedRows[index]["Rate"] = Number(newRate) || 0;
        setRows(updatedRows);
    };
    useEffect(() => {
        getAllImeis();
        getCustomerAllData();
    }, []);
    useEffect(() => {
        if (selectedImei.length === 15) {
            getsalesbillingAllData();
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
    const getsalesbillingCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const filteredData = response.data.products.filter(
                (product) => product.status === "AVAILABLE" || product.status === "RETURN"
            );
            if (filteredData.length === 0) {
                toast.warn("Product is already sold.", {
                    position: "top-center",
                    autoClose: 2000,
                });
                setSelectedImei("");
                return;
            }
            const productFormattedRows = response.data.products.map((product, index) => ({
                "Serial Number": rows.length + index + 1,
                "Date": moment(Number(product.created_at)).format('ll'),
                "IMEI Number": product.imei_number,
                "Brand": product?.model.brand?.name || product?.brand,
                "Model": product?.model?.name || product?.model,
                "Rate": product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Accessories": product.accessories,
                "QC Remark": product.qc_remark,
                "Supplier": product?.supplier?.name,
                "Purchase Price Including Expenses": product.purchase_cost_including_expenses,
                "Status": product.status,
                is_repaired: product.is_repaired,
                "Actions": (
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
            console.log('productFormattedRows: ', productFormattedRows);
            const salesBillingsMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Sales Billing"
            );

            if (salesBillingsMenuItem) {
                const showCols =
                    salesBillingsMenuItem.show_table_columns.map(col => col.name);

                const hiddenCols =
                    salesBillingsMenuItem.hidden_dropdown_table_columns?.map(col => col.name);

                setAllColumns([...showCols, ...hiddenCols]); //  all
                setColumns(showCols);                        //  only visible
                setHiddenColumns(hiddenCols);                //  hidden
                setHiddenDropdownColumns(hiddenCols);        // checkbox list
            }


            const existingImeis = rows.map(row => row["IMEI Number"]);
            const newUniqueRows = productFormattedRows.filter(
                row => !existingImeis.includes(row["IMEI Number"])
            );

            if (newUniqueRows.length > 0) {
                setRows(Rows => [...Rows, ...newUniqueRows]);
            }
            setSelectedImei("");
        } else {
            console.log("Error");
        }
    }

    const toggleColumn = (columnName) => {

        setColumns(columns => {

            if (columns.includes(columnName)) {
                return columns.filter(col => col !== columnName);
            }

            let newColumns = [...columns];

            if (columnName === "Purchase Price") {
                const rateIndex = newColumns.indexOf("Rate");
                if (rateIndex !== -1) {
                    newColumns.splice(rateIndex + 1, 0, columnName);
                }
            }

            if (columnName === "Supplier" || columnName === "QC Remark" || columnName === "Purchase Price Including Expenses") {
                const actionIndex = newColumns.indexOf("Actions");
                if (actionIndex !== -1) {
                    newColumns.splice(actionIndex, 0, columnName);
                } else {
                    newColumns.push(columnName);
                }
            }

            return newColumns;
        });

        setHiddenColumns(columns =>
            columns.includes(columnName)
                ? columns.filter(col => col !== columnName)
                : [...columns, columnName]
        );
    };

    const getsalesbillingAllData = () => {
        let url = `${API_URLS.PRODUCTS}?status=AVAILABLE,RETURN`;
        if (selectedImei) {
            url += `&imei_number=${selectedImei}`
        }
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getsalesbillingCallBack,
            setLoading: setLoading
        })
    }
    console.log("rows", rows);
    const billsCallback = (response) => {
        console.log("response: ", response);
        if (response.status === 200) {
            toast.success("Bill saved successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            setRows([]);
            setSelectedImei("");
            setCustomerName("");
            setSelectedContactNo("");
            setOnlineAmount("");
            setCashAmount("");
            setCard("");
            setShowPaymentPopup(false);
            setPendingAmount(0);
            navigate("/billinghistory");
            console.log('response.customer?.name: ', response.customer?.name);
            console.log('response.customer?.contact_number: ', response.customer?.contact_number);
            generateAndSavePdf(
                response.data.billing.customer?.name,
                response.data.billing.invoice_number,
                response.data.billing.customer?.contact_number,
                response.data.billing.customer?.address,
                response.data.billing.customer?.gst_number,
                response.data.billing.products,
                response.data.billing.payable_amount,
                response.data.billing.customer?.firm_name,
                response.data.billing.net_total,
                response.data.billing.c_gst,
                response.data.billing.s_gst,
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
    const handleCancelPopup = () => {
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(false);
    };
    const handleSaveData = () => {
        if (totalAmount <= 0) {
            toast.warning("Please add products before proceeding to payment.", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }
        setShowPaymentPopup(true);
    };
    const handlePrintButton = () => {
        const billsData = {
            customer_name: customerName,
            contact_number: selectedContactNo,
            products: rows.map((row) => ({
                imei_number: row["IMEI Number"],
                rate: row["Rate"],
            })),
            paid_amount: [
                { method: "cash", amount: Number(cashAmount) },
                { method: "online", amount: Number(onlineAmount) },
                { method: "card", amount: Number(card) },
            ],
            payable_amount: totalAmount,
            pending_amount: pendingAmount,
        };
        apiCall({
            method: 'POST',
            url: API_URLS.BILLING,
            data: billsData,
            callback: billsCallback,
            setLoading: setLoading
        })
    };
    const draftCallback = (response, navigateAfterSave = true) => {
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
            if (navigateAfterSave) navigate("/draftbillhistroy");
        } else {
            const errorMsg = response?.data?.error || "Something went wrong while saving draft.";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 3000,
            });
        }
    }
    const handleDraftData = (navigateAfterSave = true) => {
        const billsData = {
            customer_name: customerName,
            contact_number: selectedContactNo,
            products: rows.map((row) => ({
                imei_number: row["IMEI Number"],
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
            method: 'POST',
            url: API_URLS.BILLING,
            data: billsData,
            callback: (response) => draftCallback(response, navigateAfterSave),
            setLoading: setLoading,
        })
    };
    const handleExportToExcel = () => {
        exportToExcel(rows, "salesbillingData.xlsx", null, columns);
    };
    const navigateAddCustomer = () => {
        if (rows.length > 0) handleDraftData(false);
        navigate("/addcustomer");
    };

    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const workbook = XLSX.read(evt.target.result, { type: "binary" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            if (!jsonData.length) {
                toast.error("Excel is empty");
                return;
            }

            processExcelData(jsonData);
        };

        reader.readAsBinaryString(file);
        e.target.value = null;
    };


    const processExcelData = (data) => {
        const imeiList = [];
        const rateMap = {};
        const errors = [];

        data.forEach((row, index) => {
            const imei = String(row["IMEI Number"] || "").trim();
            const rate = Number(row["Rate"] || 0);

            if (!/^\d{15}$/.test(imei)) {
                errors.push(`Row ${index + 1}: Invalid IMEI`);
                return;
            }

            if (!rate || rate <= 0) {
                errors.push(`Row ${index + 1}: Invalid Rate`);
                return;
            }

            imeiList.push(imei);
            rateMap[imei] = rate;
        });

        if (errors.length) {
            toast.error(errors[0]);
            return;
        }
        fetchBulkProductsParallel(imeiList, rateMap);
    };

   const fetchBulkProductsParallel = async (imeiList, rateMap) => {
    setLoading(true);

    try {
        const requests = imeiList.map((imei) => {
            const url = `${API_URLS.PRODUCTS}?status=AVAILABLE,RETURN&imei_number=${imei}`;

            return new Promise((resolve) => {
                apiCall({
                    method: "GET",
                    url,
                    callback: (res) => {
                        if (res.status === 200 && res.data.products.length > 0) {
                            resolve(res.data.products);
                        } else {
                            toast.error(`IMEI ${imei} not found`);
                            resolve([]);
                        }
                    },
                });
            });
        });

        const results = await Promise.all(requests);

        const allProducts = results.flat();

        handleBulkResponse(allProducts, rateMap);

    } catch (error) {
        console.error("Bulk fetch error:", error);
        toast.error("Bulk fetch failed");
    }

    setLoading(false);
};

    const handleBulkResponse = (products, rateMap) => {

        const salesBillingsMenuItem = loggedInUser?.role?.menu_items?.find(
            item => item.name?.name === "Sales Billing"
        );

        if (salesBillingsMenuItem) {
            const showCols = salesBillingsMenuItem.show_table_columns.map(col => col.name);
            const hiddenCols = salesBillingsMenuItem.hidden_dropdown_table_columns?.map(col => col.name);

            setAllColumns([...showCols, ...hiddenCols]);
            setColumns(showCols);
            setHiddenColumns(hiddenCols);
            setHiddenDropdownColumns(hiddenCols);
        }

        const existingImeis = new Set(rows.map(row => row["IMEI Number"]));

        const newRows = products
            .filter(product =>
                (product.status === "AVAILABLE" || product.status === "RETURN") &&
                !existingImeis.has(product.imei_number)
            )
            .map((product, index) => ({
                "Serial Number": rows.length + index + 1,
                "Date": moment(Number(product.created_at)).format('ll'),
                "IMEI Number": product.imei_number,
                "Brand": product?.model?.brand?.name || product?.brand,
                "Model": product?.model?.name || product?.model,
                "Rate": rateMap[product.imei_number] || product.sales_price,
                "Purchase Price": product.purchase_price,
                "Grade": product.grade,
                "Accessories": product.accessories,
                "QC Remark": product.qc_remark,
                "Supplier": product?.supplier?.name,
                "Purchase Price Including Expenses": product.purchase_cost_including_expenses,
                "Status": product.status,
                is_repaired: product.is_repaired,
                "Actions": (
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

        setRows(prev => [...prev, ...newRows]);
    };
    return (
        <div>
            {loading && <Spinner />}

            <div className="flex justify-between items-center">

                <div className="text-xl font-serif">Sales Billing</div>

                <div className="flex gap-4">
                    <PrimaryButtonComponent
                        label="Add Customer"
                        icon="fa fa-plus"
                        buttonClassName="py-1 px-3 text-[12px] font-semibold"
                        onClick={navigateAddCustomer}
                    />


                </div>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <InputComponent
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelUpload}
                        inputClassName="w-[230px] "
                    />
                </div>
                <div>
                    <PrimaryButtonComponent
                        label="Export to Excel"
                        icon="fa fa-file-excel-o"
                        onClick={handleExportToExcel}
                        buttonClassName="mt-7"
                    />
                </div>
            </div>

            <div className="flex justify-between items-center ">


                <div className="flex items-center gap-3">

                    <CustomDropdownInputComponent
                        label="IMEI No :"
                        dropdownClassName="w-[190px] z-[999]"
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
                        dropdownClassName="w-[190px]  z-[999]"
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
            </div>

            <CustomTableComponent
                maxHeight="h-[45vh]  !lg:h-[65vh]"
                headers={columns}
                rows={rows}
                onRateChange={handleRateChange}
                autoScrollBottom={true}
                editable={true}
                hiddenDropdownColumns={hiddenDropdownColumns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
            />

            <div className="fixed bottom-16 right-5 font-bold gap-4 text-[22px]  flex justify-end">
                Total Amount : {Number(totalAmount).toLocaleString("en-IN")}
            </div>

            <div className="fixed bottom-5 right-5 flex gap-4 mt-3">

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
                <CustomPopUpComponent
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
