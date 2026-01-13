import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import { PART_SHOP_OPTIONS } from "./Constants";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { useCallback, useEffect, useState } from "react";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import { toast } from "react-toastify";
import { API_URLS } from "../../../Util/AppConst";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import CustomPopUpComponet from "../../CustomComponents/CustomPopUpCompoent/CustomPopUpComponet";

function PartShop() {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [shopName, setShopName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [showTotalRow, setShowTotalRow] = useState(false);
    const [totalRow, setTotalRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    const [cashAmount, setCashAmount] = useState("");
    const [onlineAmount, setOnlineAmount] = useState("");
    const [card, setCard] = useState("");
    const [pendingAmount, setPendingAmount] = useState(0);

    const navigateAddShop = () => {
        navigate("/addshop");
    };
    useEffect(() => {
        if (!selectedShop) return;

        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);

        const paidTotal = cash + online + cardAmt;
        setPendingAmount(
            Number(selectedShop.pending_amount) - paidTotal
        );
    }, [cashAmount, onlineAmount, card, selectedShop]);

    const getShopsCallback = useCallback((response) => {
        if (response.status === 200) {
            const formattedRows = response.data.users.map((shop) => ({
                id: shop._id,
                "Shop Name": shop.name,
                "Contact": shop.contact_number,
                "State": shop.state,
                "Address": shop.address,
                "GST Number": shop.gst_number,
                "Actions": (
                    <div className="flex justify-end gap-2">
                        <PrimaryButtonComponent
                            label="Pay"
                            buttonClassName="py-1 px-3 text-[12px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePayClick(shop);
                            }}
                        />
                    </div>
                )
            }))
            setTotalRow({
                _id: "total",
                "Total Paid": Number(response.data.paid_amount_of_all_users || 0).toLocaleString("en-IN"),
            });
            setRows(formattedRows);
        } else {
            const errorMsg = response?.data?.error || "Failed to add shop";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    }, []);

    const getAllShops = useCallback(({ shopName, contactNo } = {}) => {
        let url = `${API_URLS.USERS}?role=PARTS_SHOP`;
        if (shopName) url += `&name=${shopName}`;
        if (contactNo) url += `&contact_number=${contactNo}`;

        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getShopsCallback,
            setLoading
        });
    }, [getShopsCallback]);

    useEffect(() => {
        getAllShops();
    }, [getAllShops]);

    const handleSearchFilter = () => getAllShops({ shopName, contactNo });
    const handleResetFilter = () => {
        setShopName("");
        setContactNo("");
        getAllShops();
    };
    const handlePayClick = (shop) => {
        if (Number(shop.pending_amount) === 0) return;

        setSelectedShop(shop);
        setPendingAmount(Number(shop.pending_amount));
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setShowPaymentPopup(true);
    };

    const handleCancelPopup = () => {
        setShowPaymentPopup(false);
        setSelectedShop(null);
        setCashAmount("");
        setOnlineAmount("");
        setCard("");
        setPendingAmount(0);
    };
    const handleShopPaymentCallback = (response) => {
        if (response.status === 200) {
            toast.success("Part shop payment updated successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            handleCancelPopup();
            getAllShops();
        } else {
            const errorMsg = response?.data?.error || "Part shop payment failed";
            toast.error(errorMsg, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };
    const handleSaveShopPayment = () => {
        if (!selectedShop) return;

        const cash = Number(cashAmount || 0);
        const online = Number(onlineAmount || 0);
        const cardAmt = Number(card || 0);
        const paidTotal = cash + online + cardAmt;

        const payload = {
            payable_amount: Number(selectedShop.pending_amount),
            paid_amount: [
                { method: "cash", amount: cash },
                { method: "online", amount: online },
                { method: "card", amount: cardAmt },
            ],
            pending_amount: Number(selectedShop.pending_amount) - paidTotal,
        };

        apiCall({
            method: "PUT",
            url: `${API_URLS.USERS}/payment/${selectedShop._id}`,
            data: payload,
            callback: handleShopPaymentCallback,
            setLoading
        });
    };

    const handleRowClick = (row) => {
        navigate(`/partshopDetails/${row.id}`);
    };

    return (
        <div className="w-full">
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Part Shop List"
                label="Add Shop"
                icon="fa fa-plus-circle"
                onClick={navigateAddShop}
            />
            <div className="flex items-center gap-4 mb-5">
                <InputComponent
                    type="text"
                    placeholder="Shop Name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    inputClassName="w-[190px]"
                />

                <InputComponent
                    type="text"
                    placeholder="Contact No"
                    numericOnly
                    maxLength={10}
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    inputClassName="w-[190px]"
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    buttonClassName="mt-5 py-1 px-5"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    buttonClassName="mt-5 py-1 px-5"
                    onClick={handleResetFilter}
                />
            </div>
            <CustomTableCompoent
                headers={PART_SHOP_OPTIONS}
                rows={rows}
                maxHeight="h-[65vh]"
                totalRow={totalRow}
                showTotalRow={showTotalRow}
                onRowClick={handleRowClick}
            />
            <div className="flex justify-end">
                <button className="rounded-full" onClick={() => setShowTotalRow(!showTotalRow)}>
                    <i className="fa fa-circle-o" aria-hidden="true"></i>
                </button>
            </div>
            {showPaymentPopup && selectedShop && (
                <CustomPopUpComponet
                    totalAmount={Number(selectedShop.pending_amount)}
                    pendingAmount={pendingAmount}
                    cashAmount={cashAmount}
                    onlineAmount={onlineAmount}
                    card={card}
                    setCashAmount={setCashAmount}
                    setOnlineAmount={setOnlineAmount}
                    setCard={setCard}
                    handleCancelButton={handleCancelPopup}
                    handleSaveButton={handleSaveShopPayment}
                />
            )}
        </div >
    )

} export default PartShop;