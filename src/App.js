import Login from './Components/Screens/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
import ListOfProducts from './Components/Screens/Products/ListOfProducts';
import Supplier from "./Components/Screens/Supplier/Supplier";
import CustomTableCompoent from './Components/CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from './Components/CustomComponents/DropdownCompoent/DropdownCompoent';
import StockIn from './Components/Screens/Products/StockIn';
import BulkOfProduct from './Components/Screens/Products/BulkOfProduct';
// import Customer from './Components/Screens/Customer/Customer';
// import SellsBilling from './Components/Screens/SellsBilling/SellsBilling';
import Customer from './Components/Screens/Customer/Customer';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
              {/* <Route path="/" element={<StockIn/>} /> */}
             
                 {/* <Route path="/" element={< BulkOfProduct/>} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
