import Login from './Components/Screens/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
import CustomHeaderComponent from './Components/CustomComponents/CustomHeaderComponent/CustomHeaderComponent';

import ListOfProducts from './Components/Screens/Products/ListOfProducts';
import Supplier from "./Components/Screens/Supplier/Supplier";
import CustomTableCompoent from './Components/CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from './Components/CustomComponents/DropdownCompoent/DropdownCompoent';
import StockIn from './Components/Screens/Products/StockIn';
import BulkOfProduct from './Components/Screens/Products/BulkOfProduct';
// import Customer from './Components/Screens/Customer/Customer';
// import SellsBilling from './Components/Screens/SellsBilling/SellsBilling';
import Customer from './Components/Screens/Customer/Customer';
import DashboardSidebar from './Components/Screens/DashboardSidebar/DashboardSidebar';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
              {/* <Route path="/" element={<DashboardSidebar/>} /> */}
             
                 {/* <Route path="/" element={< BulkOfProduct/>} /> */}
          <Route path="/dashboard" element={<Dashboard />} /> 
        </Routes>
      </Router>
    </div>
  );
}
export default App;
