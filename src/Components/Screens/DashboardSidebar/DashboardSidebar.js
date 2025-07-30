import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DashboardSidebar({ onLogout }) {
    const [menuItems, setMenuItems] = useState([
        { icon: "fa fa-calculator", label: "Sales Billing", path: "/salesbilling" },
        { icon: "fa fa-plus-circle", label: "Stock In", path: "/stockin" },
        { icon: "fa fa-list-alt", label: "Products", path: "/products" },
        { icon: "fa fa-blind", label: "Supplier", path: "/supplier" },
        { icon: "fa fa-user-circle-o", label: "Customer", path: "/customer" },
        { icon: "fa fa-android", label: "Brands", path: "/brands" },
        { icon: "fa fa-th-large", label: "Models", path: "/models" }
    ])
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        onLogout();
        navigate("/login");
    };
    const handleMenuClick = (path) => {
        navigate(path);
    }
    return (
        <div>
            <div>
                <div className={`space-y-2 px-4 pt-5 w-[100%] bg-slate-800 text-white h-screen `}>
                    <div className="font-semibold text-xl pb-6 pl-4 pr-3">
                        <i class="fa fa-file-text-o mr-4" aria-hidden="true"></i>
                        3_EXTENT
                    </div>
                    {menuItems.map((item, index) => (
                        <div key={index}
                            onClick={() => handleMenuClick(item.path)}
                            className="flex items-center cursor-pointer pl-4 py-2  hover:bg-slate-600 rounded transform hover:scale-110 hover:font-blod">
                            <span className="mr-3">
                                <i className={item.icon} aria-hidden="true"></i>
                            </span>
                            <span className="hover:font-bold">{item.label}</span>
                        </div>
                    ))}
                    <div className="bottom-10 fixed justify-center cursor-pointer pl-4 transform hover:scale-110" onClick={handleLogout}><i class="fa fa-sign-out mr-2" aria-hidden="true"></i>Logout</div>
                </div>
            </div >
        </div>
    );
}