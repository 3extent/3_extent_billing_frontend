import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DashboardSidebar() {
    const [menuItems, setMenuItems] = useState([
        { icon: "fa fa-calculator", label: "Sales Billing" },
        { icon: "fa fa-plus-circle", label: "Stock In" },
        { icon: "fa fa-list-alt", label: "Products" },
        { icon: "fa fa-blind", label: "Supplier" },
        { icon: "fa fa-user-circle-o", label: "Customer" },
        { icon: "fa fa-android", label: "Brands" },
        { icon: "fa fa-th-large", label: "Models" }
    ])
    const navigate = useNavigate();
    const handleNavigateLogin = () => {
        navigate("/")
    }
    return (
        <div>
            <div className="w-[100%] flex">
                <div className={`space-y-2 px-4 pt-5 w-[100%] bg-slate-800 text-white h-screen `}>
                    <div className="font-semibold text-xl pb-6 pl-4 pr-3">
                        <i class="fa fa-file-text-o mr-4" aria-hidden="true"></i>
                        3_EXTENT
                    </div>
                    {menuItems.map((item, index) => (
                        <div key={index} className="flex items-center cursor-pointer pl-4 py-2  hover:bg-slate-600 rounded transform hover:scale-110 hover:font-blod">
                            <span className="mr-3">
                                <i className={item.icon} aria-hidden="true"></i>
                            </span>
                            <span className="hover:font-bold">{item.label}</span>
                        </div>
                    ))}
                    <div className="bottom-10 fixed justify-center cursor-pointer pl-4 transform hover:scale-110" onClick={handleNavigateLogin}><i class="fa fa-sign-out mr-2" aria-hidden="true"></i>Logout</div>
                </div>
            </div >
        </div>
    );
}