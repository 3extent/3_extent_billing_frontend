import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Components/Screens/Login/Login';
import ListOfProducts from './Components/Screens/Products/ListOfProducts';
import Supplier from "./Components/Screens/Supplier/Supplier";
import StockIn from './Components/Screens/Products/StockIn';
import Customer from './Components/Screens/Customer/Customer';
import DashboardSidebar from './Components/Screens/DashboardSidebar/DashboardSidebar';
import Brands from './Components/Screens/Brands/Brands';
import Models from './Components/Screens/Brands/Models';
import SalesBilling from './Components/Screens/SalesBilling/SalesBilling';
import AddBrands from './Components/Screens/Brands/AddBrands';
import AddModels from './Components/Screens/Brands/AddModels';
import AddSupplier from './Components/Screens/Supplier/AddSupplier';
import AddCustomer from './Components/Screens/Customer/AddCustomer';
function App() {

  const [loginStatus, setLoginStatus] = useState(false);
  useEffect(() => {
    console.log(`localStorage.getItem("isAuthenticated")`, localStorage.getItem("isAuthenticated"));
    setLoginStatus(localStorage.getItem("isAuthenticated"))
  }, [localStorage.getItem("isAuthenticated")])

  console.log('loginStatus: ', loginStatus);
  console.log('window.location.pathname === ' / ': ', window.location.pathname);
  return (
    <Router>
      <div className="flex">
        {window.location.pathname === '/'
          ? <div></div>
          : <div className="w-[20%]">
            <DashboardSidebar />
          </div>}
        <div className={loginStatus && "w-[80%] p-4"}>
          <Routes>
            {/* {loginStatus */}
            {/* ?  */}
            <Route path="/salesbilling" element={<SalesBilling />} />
            {/* :  */}
            <Route path="/" element={<Login />} />
            {/* } */}
            <Route path="/products" element={<ListOfProducts />} />
            <Route path="/supplier" element={<Supplier />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/models" element={<Models />} />
            <Route path="/stockin" element={<StockIn />} />
            <Route path="/addbrands" element={<AddBrands />} />
            <Route path="/addmodels" element={<AddModels />} />
            <Route path="/addcustomer" element={<AddCustomer />} />
            <Route path="/addsupplier" element={<AddSupplier />} />
          </Routes>
        </div>
      </div>

    </Router>
  );
}
export default App;
