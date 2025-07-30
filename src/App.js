import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);
  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex">
          <div className="w-[20%]">
            <DashboardSidebar onLogout={() => setIsLoggedIn(false)} />
          </div>
          <div className="w-[80%] p-4">
            <Routes>
              <Route path="/" element={<SalesBilling />} />
              <Route path="/salesbilling" element={<SalesBilling />} />
              <Route path="/products" element={<ListOfProducts />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/models" element={<Models />} />
              <Route path="/stockin" element={<StockIn />} />
              <Route path="/addbrands" element={<AddBrands />} />
              <Route path="/addmodels" element={<AddModels />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        </Routes>
      )}
    </Router>
  );
}
export default App;
