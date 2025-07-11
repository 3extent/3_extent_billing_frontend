import { useState } from "react";

import ListOfProducts from "../Products/ListOfProducts";
import Supplier from "../Supplier/Supplier";
import Customer from "../Customer/Customer";
import SellsBilling from "../SellsBilling/SellsBilling";
import Brands from "../Brands/Brands";
export default function Dashboard() {
    const [menuItems, setMenuItems] = useState([
        { icon: "fa fa-calculator", label: "Sells Billing" },
        { icon: "fa fa-plus-circle", label: "Stock In" },
        { icon: "fa fa-list-alt", label: "Products" },
        { icon: "fa fa-blind", label: "Supplier" },
        { icon: "fa fa-user-circle-o", label: "Customer" },
        { icon: "fa fa-android", label: "Brands" },
    ])
    const [selectedMenu, setSelectedMenu] = useState("Sells Billing");
    return (
        <div className="w-[100%] flex">

            <div className="space-y-2 px-4 pt-4 w-[20%] bg-slate-800 text-white h-screen ">


                <div className="font-semibold text-xl pb-6 pl-4 pr-3"><i class="fa fa-file-text-o mr-4" aria-hidden="true"></i>
                    3_Extent</div>

                {menuItems.map((item, index) => (
                    <div key={index} className="flex items-center cursor-pointer pl-4 py-2 hover:bg-slate-600 rounded transform hover:scale-110"
                        onClick={() => setSelectedMenu(item.label)}>
                        <span className="mr-3">
                            <i className={item.icon} aria-hidden="true"></i>
                        </span>
                        <span>{item.label}</span>
                    </div>
                ))}
                <div className="bottom-10 fixed justify-center cursor-pointer pl-4 transform hover:scale-110"><i class="fa fa-sign-out mr-2" aria-hidden="true"></i>Logout</div>
            </div>
            <div className="w-[80%] p-5">
                {selectedMenu === "Products" && <ListOfProducts />}
                {selectedMenu === "Supplier" && <Supplier />}
                {selectedMenu === "Customer" && <Customer />}
                {selectedMenu === "Sells Billing" && <SellsBilling />}
                {selectedMenu === "Brands" && <Brands />}
            </div>
        </div>
    );
};

