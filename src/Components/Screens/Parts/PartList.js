import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableComponent from "../../CustomComponents/CustomTableComponent/CustomTableComponent";
import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import DropdownComponent from "../../CustomComponents/DropdownComponent/DropdownComponent";

function PartList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [shopName, setShopName] = useState();
    const [shopOptions, setShopOptions] = useState([])

    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const handleback = () => {
        navigate(-1);
    }

    useEffect(() => {
        getPartshopsDetails();
        getShopsAllData();
    }, [])

    const getPartshopsDetailsCallback = (response) => {
        setLoading(false);

        if (response.status === 200) {
            const part = response.data;

            const partshopsRows = part.parts.map((part) => ({
                Model: part.model?.name,
                "Part Name": part.part_name,
                "Part Cost": part.part_cost,
                "Repairer": part.shop?.name,
            }));

            setRows(partshopsRows);

            const partsSubMenuItem = loggedInUser?.role?.menu_items?.find(
                item => item.name?.name === "Parts List"
            );

            if (partsSubMenuItem) {
                const headers = partsSubMenuItem.show_table_columns.map(col => col.name);
                setColumns(headers);
            }
        }
    };

    const getPartshopsDetails = useCallback(({ shopName } = {}) => {
        let url = API_URLS.PART;
        if (shopName) url += `?shop=${shopName}`;
        apiCall({
            method: "GET",
            url: url,
            data: {},
            callback: getPartshopsDetailsCallback,
            // setLoading:setloading,
        });
    }, [getPartshopsDetailsCallback]);

    const getShopsAllData = () => {
        apiCall({
            method: 'GET',
            url: `${API_URLS.USERS}?role=PARTS_SHOP`,
            data: {},
            callback: getShopsCallBack,
        })
    };
    const getShopsCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            const shopsData = response.data.users || [];
            const shops = shopsData.map(shop => shop.name);
            setShopOptions(shops);

        } else {
            console.log("Error");
        }
    }

    const handleSearchFilter = () => getPartshopsDetails({ shopName });

    const handleResetFilter = () => {
        setShopName("");
        getPartshopsDetails();
    };

    return (
        <div>
            <div>
                <CustomHeaderComponent
                    name="Shop Part List"
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleback}
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />
                <div className="flex items-center gap-4 mb-5">
                    <DropdownComponent
                        placeholder="Select Shop"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        options={shopOptions}
                        className="mt-3 w-[190px]"
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
            </div>


            <CustomTableComponent
                rows={rows}
                maxHeight="h-[60vh] mt-5"
                // totalRow={totalRow}
                // showTotalRow={showTotalRow}
                headers={columns}
            />
        </div>
    );
} export default PartList;