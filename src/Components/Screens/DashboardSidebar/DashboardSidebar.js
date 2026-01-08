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
        if (item.name === "Sales Billing") {
            navigate("/salesbilling");
        }
        if (item.name === "Stock In") {
            navigate("/stockin");
        }
        if (item.name === "Products") {
            navigate("/products");
        }
        if (item.name === "Supplier") {
            navigate("/supplier");
        }
        if (item.name === "Customer") {
            navigate("/customer");
        }
        if (item.name === "Brands") {
            navigate("/brands");
        }
        if (item.name === "Models") {
            navigate("/models");
        }
        if (item.name === "Repair Dashboard") {
            navigate("/repair");
        }
        if (item.name === "Repairers") {
            navigate("/repairers");
        }
        if (item.name === "Maintenance") {
            navigate("/maintenance");
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
                                <i className={item.icon} aria-hidden="true"></i>
                            </span>
                            <span className="hover:font-bold text-sm">{item.name}</span>
                        </div>
                    ))}
                    <div className="bottom-10 fixed justify-center cursor-pointer pl-4 text-sm transform hover:scale-110" onClick={handleLogout}><i class="fa fa-sign-out mr-2" aria-hidden="true"></i>Logout</div>
                </div>
            </div >
        </div>
    );
}