import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function DashboardSidebar({ onLogout }) {
    
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
    const menuItems = loggedInUser?.role?.menu_items || [];

    console.log('loggedInUser: ', loggedInUser);
    // const [menuItems, setMenuItems] = useState(loggedInUser?.role?.menu_items)
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(null);
    const sidebarRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const structuredMenu = useMemo(() => {

        const parents = [];
        const parentMap = {};

        menuItems.map(item => {
            if (item.name?.level === 1) {
                parentMap[item.name._id] = {
                    parent: item,
                    children: []
                };
                parents.push(parentMap[item.name._id]);
            }
        });

        menuItems.map(item => {
            if (item.name?.level === 2 && item.name?.parent?._id) {
                const parentId = item.name.parent._id;
                if (parentMap[parentId]) {
                    parentMap[parentId].children.push(item);
                }
            }
        });

        return parents;

    }, [menuItems]);

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("token");

        // Call the callback to update parent state
        if (onLogout) {
            onLogout();
        }
        navigate("/");
    };
    // const handleMenuClick = (item) => {
    //     const menuName = item.name?.name;
    //     if (menuName === "Sales Billing") {
    //         navigate("/salesbilling");
    //     }
    //     if (menuName === "Billing History") {
    //         navigate("/billinghistory");
    //     }
    //     if (menuName === "Drafted Bills") {
    //         navigate("/draftbillhistroy");
    //     }

    //     if (menuName === "Stock In") {
    //         navigate("/stockin");
    //     }
    //     if (menuName === "Products") {
    //         navigate("/products");
    //     }
    //     if (menuName === "Supplier") {
    //         navigate("/supplier");
    //     }
    //     if (menuName === "Customer") {
    //         navigate("/customer");
    //     }
    //     if (menuName === "Brands") {
    //         navigate("/brands");
    //     }
    //     if (menuName === "Models") {
    //         navigate("/models");
    //     }
    //     if (menuName === "Repair Dashboard") {
    //         navigate("/repair");
    //     }
    //     if (menuName === "Repairers") {
    //         navigate("/repairers");
    //     }
    //     if (menuName === "Parts Shops") {
    //         navigate("/partshop")
    //     }
    //     if (menuName === "Maintenance") {
    //         navigate("/maintenanceDashboard");
    //     }

    // }
    const handleMenuClick = (item) => {
        setOpenMenu(null);

        const menuName = item.name?.name;

        if (menuName === "Sales Billing") navigate("/salesbilling");
        else if (menuName === "Billing History") navigate("/billinghistory");
        else if (menuName === "Drafted Bills") navigate("/draftbillhistroy");
        else if (menuName === "Stock In") navigate("/stockin");
        else if (menuName === "Products") navigate("/products");
        else if (menuName === "Supplier") navigate("/supplier");
        else if (menuName === "Customer") navigate("/customer");
        else if (menuName === "Brands") navigate("/brands");
        else if (menuName === "Models") navigate("/models");
        else if (menuName === "Repair Dashboard") navigate("/repair");
        else if (menuName === "Repairers") navigate("/repairers");
        else if (menuName === "Parts Shops") navigate("/partshop");
        else if (menuName === "Maintenance") navigate("/maintenanceDashboard");
    };


    return (

        <div>
            <div
                ref={sidebarRef}

                className={`space-y-2 px-4 pt-5 w-[100%] bg-slate-800 text-white h-screen`}>
                <div className="font-semibold text-xl pb-6 pl-4 pr-3">
                    <i class="fa fa-file-text-o mr-4" aria-hidden="true"></i>
                    3_EXTENT
                </div>
                {structuredMenu?.map(({ parent, children }) => {
                    const hasChildren = children.length > 0;
                    const isOpen = openMenu === parent._id;
                    return (


                        <div key={parent._id} className="relative">
                            <div
                                onClick={() => {
                                    if (hasChildren) {
                                        setOpenMenu(isOpen ? null : parent._id);
                                    } else {
                                        handleMenuClick(parent);
                                    }
                                }}

                                // onClick={() => handleMenuClick(item)}
                                className="flex justify-between items-center cursor-pointer pl-4 py-2 hover:bg-white hover:text-black">


                                {/* className="flex items-center cursor-pointer pl-4 py-2  hover:bg-slate-600 rounded transform hover:scale-110 hover:font-blod"> */}
                                <div className="flex items-center">
                                    <i className={`${parent.name?.icon} mr-3`} />
                                    <span>{parent.name?.name}</span>
                                </div>
                                {/* {hasChildren && <span>{isOpen ? "▼" : "▶"}</span>} */}
                                {hasChildren && isOpen && (
                                    <span>▶</span>
                                )}
                            </div>
                            {hasChildren && isOpen && (
                                <div className="absolute left-full top-0 ml-3 w-56 bg-slate-700  shadow-lg z-50">
                                    {children.map(child => (
                                        <div
                                            key={child._id}

                                            onClick={() => handleMenuClick(child)}
                                            className="px-4 py-3 text-md cursor-pointer hover:bg-gray-400 hover:text-black hover:font-bold"
                                        >
                                            <div className="flex items-center">
                                                <i className={`${child.name?.icon} mr-3`} />
                                                <span>{child.name?.name}</span>
                                            </div>

                                            {/* {child.name?.name} */}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    );
                })}


                {/* 
                           <span className="mr-3">
                                <i className={item.name?.icon} aria-hidden="true"></i>
                         </span>
                             <span className="hover:font-bold text-sm">{item.name?.name}</span>
                       </div>
                     ))} */}
                <div className="bottom-10 fixed justify-center cursor-pointer pl-4 text-sm transform hover:scale-110"
                    onClick={handleLogout}
                >
                    <i class="fa fa-sign-out mr-2" aria-hidden="true"></i>
                    Logout
                </div>

            </div >
        </div >
    );
}