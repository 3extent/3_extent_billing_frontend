function Dashboard() {
    const menuItems = [
        { icon: "fa fa-tachometer", label: "Dashboard" },
        { icon: "fa fa-list-alt", label: "Products" },
        { icon: "fa fa-android", label: "Brands" },
        { icon: "fa fa-blind", label: "Supplier" },
        { icon: "fa fa-plus-circle", label: "Stock In" },
        { icon: "fa fa-user-circle-o", label: "Customer" },
        { icon: "fa fa-calculator", label: "Sells Billing" },
    ];
    return (
        <div className="w-[100%]">
            <div className="space-y-2 pl-4 pt-4 w-[20%] bg-slate-800 text-white font-bold text-2xl h-screen">
                {menuItems.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <span className="mr-3">
                            <i className={item.icon} aria-hidden="true"></i>
                        </span>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
            <div className="w-[80%]">

            </div>
        </div>
    );
}
export default Dashboard;