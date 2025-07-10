import Login from './Components/Screens/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
import ListOfProducts from './Components/Screens/Products/ListOfProducts';
import Supplier from "./Components/Screens/Supplier/Supplier";
import CustomTableCompoent from './Components/CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from './Components/CustomComponents/DropdownCompoent/DropdownCompoent';
import Customer from './Components/Screens/Customer/Customer'
import SellsBilling from './Components/Screens/SellsBilling/SellsBilling';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
