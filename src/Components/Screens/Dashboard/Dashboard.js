import { useState } from "react";
import ListOfProducts from "../Products/ListOfProducts";
export default function Dashboard() {
    const [menuItems, setMenuItems] = useState([
        { icon: "fa fa-calculator", label: "Sells Billing" },
        { icon: "fa fa-plus-circle", label: "Stock In" },
        { icon: "fa fa-list-alt", label: "Products" },
        { icon: "fa fa-blind", label: "Supplier" },
        { icon: "fa fa-user-circle-o", label: "Customer" },
        { icon: "fa fa-android", label: "Brands" },
    ])
    const [selectedMenu, setSelectedMenu] = useState("Products");
    return (
        <div className="w-[100%] flex">
            <div className="space-y-2 pl-4 pt-4 w-[20%] bg-slate-800 text-white font-semibold text-2xl h-screen">
                {menuItems.map((item, index) => (
                    <div key={index} className="flex items-center"
                        onClick={() => setSelectedMenu(item.label)}>
                        <span className="mr-3">
                            <i className={item.icon} aria-hidden="true"></i>
                        </span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
            <div className="w-[80%] border-2  bg-[rgb(175,171,171)]">
                {selectedMenu === "Products" && <ListOfProducts />}
            </div>
        </div>
    );
};

