import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiCall, Spinner } from "../../../Util/AxiosUtils";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableCompoent from "../../CustomComponents/CustomTableCompoent/CustomTableCompoent";
import { API_URLS } from "../../../Util/AppConst";
import { toast } from "react-toastify";
import { SINGLE_SUPPLIER_DETAILS, STATUS_OPTIONS } from "./Constants";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import moment from "moment";
import DropdownCompoent from "../../CustomComponents/DropdownCompoent/DropdownCompoent";


export default function SupplierDetails() {
    const [imeiNumber, setIMEINumber] = useState();
    const [grade, setGrade] = useState();
    const [modelName, setModelName] = useState();
    const [status, setStatus] = useState('');
    const [brandOptions, setBrandOptions] = useState([]);
    const [brandName, setBrandName] = useState('');

    const fromDate = moment().subtract('days').format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');
    const [from, setFrom] = useState(fromDate);
    const [to, setTo] = useState(toDate);

    const [selectAllDates, setSelectAllDates] = useState(false);

    const navigate = useNavigate();
    const { supplier_id } = useParams();

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        setFrom(fromDate);
        setTo(toDate);
        getSupplierDetails({ from, to });
        getBrandsAllData();
    }, [supplier_id]);

    const getBrandsAllData = () => {
        let url = API_URLS.BRANDS;
        apiCall({
            method: 'GET',
            url: url,
            data: {},
            callback: getBrandsCallBack,
            setLoading: setLoading
        })
    };
    const getBrandsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const brands = response.data.map(brand => brand.name);
            setBrandOptions(brands);
        } else {
            console.log("Error");
        }
    }

    const getSupplierDetailsCallback = (response) => {
        setLoading(false);
        if (response.status === 200) {
            const supplier = response.data;
            const formattedRows = supplier.products.map((product) => ({
                "Date": moment(product.created_at).format('ll'),
                "IMEI Number": product.imei_number,
                "Model Name": product.model?.name,
                "Brand Name": product.model?.brand?.name,
                "Purchase Price": product.purchase_price,
                "grade": product.grade,
                id: product._id
            }));

            setRows(formattedRows);
        } else {
             toast.error("Failed to fetch supplier details");
        }
    };

    const getSupplierDetails = ({ imeiNumber, modelName,grade,brandName,status, from, to, selectAllDates } = {}) => {
        if (!supplier_id) return;
        setLoading(true);
        let url = `${API_URLS.USERS}/${supplier_id}?`;
        if (imeiNumber) {
            url += `&imei_number=${imeiNumber}`
        } if (modelName) {
            url += `&modelName=${modelName}`
        }
        if (grade) {
            url += `&grade=${grade}`
        }
        if (modelName) {
            url += `&modelName=${modelName}`
        }
        if (brandName) {
            url += `&brandName=${brandName}`
        }
        if (status) {
            url += `&status=${status}`
        }

        if (!selectAllDates) {
            if (from) url += `&from=${moment.utc(from).valueOf()}`;
            if (to) url += `&to=${moment.utc(to).endOf('day').valueOf()}`;
        }
        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getSupplierDetailsCallback,
            setLoading: setLoading
        });
    };



    const handleDateChange = (value, setDate) => {
        const today = moment().format('YYYY-MM-DD');
        if (value > today) {
            setDate(today);
        } else {
            setDate(value);
        }
    };
    const handleSearchFilter = () => {
        getSupplierDetails({ imeiNumber, modelName, brandName,grade,status, from, to, selectAllDates });
    }
    const handleResetFilter = () => {
        setModelName('');
        setIMEINumber('');
        setFrom(fromDate);
        setTo(toDate);
        setSelectAllDates(false);
        getSupplierDetails({ from, to, });
    }

    return (
        <div>
            {loading && <Spinner />}
            <CustomHeaderComponent
                name="Single Supplier Details"
                label="Back"
                icon="fa fa-arrow-left"
                onClick={handleBack}
                buttonClassName="py-1 px-3 text-sm font-bold"
            />
            <div className='flex items-center gap-4'>
                <InputComponent
                    type="text"
                    placeholder="Enter IMEI NO"
                    inputClassName="mb-2 w-[190px]"
                    value={imeiNumber}
                    numericOnly={true}
                    maxLength={15}
                    onChange={(e) => setIMEINumber(e.target.value)}
                />
                <DropdownCompoent
                    placeholder="Select Brands"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    options={brandOptions}
                    className="mt-3 w-[190px]"
                />
                <InputComponent
                    type="text"
                    placeholder="Enter Models Name"
                    inputClassName="mb-2 w-[190px]"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                />
                <DropdownCompoent
                    placeholder="Select status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={STATUS_OPTIONS}
                    className="w-[190px] mt-3"
                />
                < InputComponent
                    type="text"
                    placeholder="Enter Grade"
                    inputClassName="mb-2 w-[190px]"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                />
            </div>

            <div className='flex items-center gap-4'>
                <label className='flex items-center gap-2 text-sm'>
                    <input
                        type="checkbox"
                        checked={selectAllDates}
                        onChange={(e) => setSelectAllDates(e.target.checked)}
                    />
                    All Data
                </label>
                <InputComponent
                    type="date"
                    inputClassName="w-[190px] mb-5"
                    value={from}
                    onChange={(e) => handleDateChange(e.target.value, setFrom)}
                    disabled={selectAllDates}
                />
                <InputComponent
                    type="date"
                    inputClassName="w-[190px] mb-5"
                    value={to}
                    onChange={(e) => handleDateChange(e.target.value, setTo)}
                    disabled={selectAllDates}
                />
                <PrimaryButtonComponent
                    label="Search"
                    icon="fa fa-search"
                    onClick={handleSearchFilter}
                />
                <PrimaryButtonComponent
                    label="Reset"
                    icon="fa fa-refresh"
                    onClick={handleResetFilter}
                />
            </div>
            <CustomTableCompoent
                maxHeight="h-[60vh]"
                headers={SINGLE_SUPPLIER_DETAILS}
                rows={rows}
            />
        </div>
    );
}