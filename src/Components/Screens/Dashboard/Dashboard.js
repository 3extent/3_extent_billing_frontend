
import ListOfProducts from "../Products/ListOfProducts";
import Supplier from "../Supplier/Supplier";
import Customer from "../Customer/Customer";
import StockIn from "../Products/StockIn";
import Brands from "../Brands/Brands";
import SalesBilling from "../SalesBilling/SalesBilling";
import Models from "../Brands/Models";
import { useState } from "react";
import AddModels from "../Brands/AddModels";
import AddBrands from "../Brands/AddBrands";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState([
        { icon: "fa fa-calculator", label: "Sales Billing" },
        { icon: "fa fa-plus-circle", label: "Stock In" },
        { icon: "fa fa-list-alt", label: "Products" },
        { icon: "fa fa-blind", label: "Supplier" },
        { icon: "fa fa-user-circle-o", label: "Customer" },
        { icon: "fa fa-android", label: "Brands" },
        { icon: "fa fa-th-large", label: "Models" }
    ])
    const [selectedMenu, setSelectedMenu] = useState("Sales Billing");
    const navigate=useNavigate();
    const handleNavigateLogin=()=>{
        navigate("/")
    }
    return (
        <div className="w-[100%] flex">
            <div className={`space-y-2 px-4 pt-5 ${isCollapsed ? 'w-[80px]' : 'w-[20%]'} bg-slate-800 text-white h-screen transition-all duration-300`}>
                {/* <div className="space-y-2 px-4 pt-5 w-[20%] bg-slate-800 text-white h-screen "> */}
                <div className="font-semibold text-xl pb-6 pl-4 pr-3">
                    {!isCollapsed && (
                        <>
                            <i class="fa fa-file-text-o mr-4" aria-hidden="true"></i>
                            3_EXTENT
                        </>
                    )}
                </div>
                <button  className=""onClick={() => setIsCollapsed(!isCollapsed)}><i class="fa fa-times-circle-o" aria-hidden="true"></i></button>
                {menuItems.map((item, index) => (
                    <div key={index} className="flex items-center cursor-pointer pl-4 py-2  hover:bg-slate-600 rounded transform hover:scale-110 hover:font-blod"
                        onClick={() => setSelectedMenu(item.label)}>
                        <span className="mr-3">
                            <i className={item.icon} aria-hidden="true"></i>
                        </span>
                        {!isCollapsed && <span className="hover:font-bold">{item.label}</span>}
                    </div>
                ))}
                <div className="bottom-10 fixed justify-center cursor-pointer pl-4 transform hover:scale-110" onClick={handleNavigateLogin}><i class="fa fa-sign-out mr-2" aria-hidden="true"></i> {!isCollapsed && "Logout"}</div>
            </div>
            <div className="w-[80%] p-5">
                {selectedMenu === "Products" && <ListOfProducts />}
                {selectedMenu === "Supplier" && <Supplier />}
                {selectedMenu === "Customer" && <Customer />}
                {selectedMenu === "Stock In" && < StockIn />}
                {selectedMenu === "Sales Billing" && <SalesBilling />}
                {selectedMenu === "Brands" && <Brands NavigateAddBrands={() => setSelectedMenu("Add Brand")} />}
                {selectedMenu === "Models" && <Models NavigateAddModels={() => setSelectedMenu("Add Model")} />}
                {selectedMenu === "Add Brand" && <AddBrands/>}
                {selectedMenu === "Add Model" && <AddModels />}
            </div>
        </div >
    );
};

