import { useNavigate } from "react-router-dom";
import CustomHeaderComponent from "../../CustomComponents/CustomHeaderComponent/CustomHeaderComponent";
import CustomTableComponent from "../../CustomComponents/CustomTableComponent/CustomTableComponent";
import { useEffect, useState } from "react";
import { apiCall } from "../../../Util/AxiosUtils";
import { API_URLS } from "../../../Util/AppConst";

function PartList() {
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const handleback = () => {
        navigate(-1);
    }

    useEffect(() => {
        getPartshopsDetails();
    }, [])

    const getPartshopsDetailsCallback = (response) => {
        // setLoading(false);
        if (response.status === 200) {
            console.log('response: ', response);
            const part = response.data.user;
            const partshopsRows = part.part.map((part) => ({
                Model: part.product.model.name,
                "Part Name": part.part_name,
                "Part Cost": part.cost,
                "Repairer": part.shop.name,
            }));

            setRows(partshopsRows);
            // const partsSubMenuItem = loggedInUser?.role?.sub_menu_items?.find(
            //     item => item.name?.name === "Single Shop Details"
            // );

            // if (partsSubMenuItem) {
            //     const headers = partsSubMenuItem.show_table_columns.map(col => col.name);
            //     setColumns(headers);
            // }

        }
    }

    const getPartshopsDetails = () => {
        apiCall({
            method: "GET",
            url: API_URLS.MAINTENANCE_ACTIVITY,
            data: {},
            callback: getPartshopsDetailsCallback,
            // setLoading:setloading,
        });
    };

    return (
        <div>
            <div>
                <CustomHeaderComponent
                    name="Single Shop Part Details"
                    label="Back"
                    icon="fa fa-arrow-left"
                    onClick={handleback}
                    buttonClassName="py-1 px-3 text-sm font-bold"
                />
            </div>

            <CustomTableComponent
                rows={rows}
                maxHeight="h-[60vh]"
                // totalRow={totalRow}
                // showTotalRow={showTotalRow}
                headers={columns}
            />
        </div>
    );
} export default PartList;