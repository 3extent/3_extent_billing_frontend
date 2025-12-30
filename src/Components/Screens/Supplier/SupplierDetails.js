import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { API_URLS } from "../../../Util/AppConst";
import { toast } from "react-toastify";
import { SUPPLIER_DETAILS_HEADERS } from "./Constants";

export default function SupplierDetails() {
    const navigate = useNavigate();
    const { supplier_id } = useParams();

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);

    const handleBack = () => {
        navigate(-1);
    };

    const getSupplierDetailsCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            const supplier = response.data;
            const formattedRows = supplier.products.map((item) => ({
                Model: item.model?.name || "-",
                IMEI: item.imei_number || "-",
                id: item._id
            }));

            setRows(formattedRows);
        } else {
            toast.error("Failed to fetch supplier details");
        }
    };

    const getSupplierDetails = () => {
        if (!supplier_id) return;
        setLoading(true);
        apiCall({
            method: "GET",
            url: `${API_URLS.USERS}/${supplier_id}`,
            data: {},
            callback: getSupplierDetailsCallback,
            setLoading: setLoading
        });
    };

    useEffect(() => {
        getSupplierDetails();
    }, [supplier_id]);

    return (
        <div className="p-5">
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Supplier Details"
                label="Back"
                icon="fa fa-arrow-left"
                onClick={handleBack}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />

            <div className="h-[75vh] mt-4">
                <CustomTableCompoent
                    headers={SUPPLIER_DETAILS_HEADERS}
                    rows={rows}
                />
            </div>
        </div>
    );
}