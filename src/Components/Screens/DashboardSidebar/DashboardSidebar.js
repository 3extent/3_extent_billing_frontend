import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DashboardSidebar({ onLogout }) {
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    console.log('loggedInUser: ', loggedInUser);
    const [menuItems, setMenuItems] = useState(loggedInUser?.role?.menu_items)
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("loggedInUser");
        // Call the callback to update parent state
        if (onLogout) {
            onLogout();
        }
        navigate("/");
    };
    const handleMenuClick = (item) => {
        const menuName = item.name?.name;
        if (menuName === "Sales Billing") {
            navigate("/salesbilling");
        }
        if (menuName === "Stock In") {
            navigate("/stockin");
        }
        if (menuName === "Products") {
            navigate("/products");
        }
        if (menuName === "Supplier") {
            navigate("/supplier");
        }
        if (menuName === "Customer") {
            navigate("/customer");
        }
        if (menuName === "Brands") {
            navigate("/brands");
        }
        if (menuName === "Models") {
            navigate("/models");
        }
        if (menuName === "Repair Dashboard") {
            navigate("/repair");
        }
        if (menuName === "Repairers") {
            navigate("/repairers");
        }
        if (menuName === "Parts Shops") {
            navigate("/partshop")
        }
        if (menuName === "Maintenance") {
            navigate("/maintenanceDashboard");
        }

    }
    return (
        <div>
            <div>
                <div className={`space-y-2 px-4 pt-5 w-[100%] bg-slate-800 text-white h-screen`}>
                    <div className="font-semibold text-xl pb-6 pl-4 pr-3">
                        <i class="fa fa-file-text-o mr-4" aria-hidden="true"></i>
                        3_EXTENT
                    </div>
                    {menuItems.map((item, index) => (
                        <div key={index}
                            onClick={() => handleMenuClick(item)}
                            className="flex items-center cursor-pointer pl-4 py-2  hover:bg-slate-600 rounded transform hover:scale-110 hover:font-blod">
                            <span className="mr-3">
                                <i className={item.name?.icon} aria-hidden="true"></i>
                            </span>
                            <span className="hover:font-bold text-sm">{item.name?.name}</span>
                        </div>
                    ))}
                    <div className="bottom-10 fixed justify-center cursor-pointer pl-4 text-sm transform hover:scale-110" onClick={handleLogout}><i class="fa fa-sign-out mr-2" aria-hidden="true"></i>Logout</div>
                </div>
            </div >
        </div>
    );
}