import Login from './Components/Screens/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
import ListOfProducts from './Components/Screens/Products/ListOfProducts';
// import Supplier from "./Components/Screens/Supplier/Supplier";
import CustomTableCompoent from './Components/CustomComponents/CustomTableCompoent/CustomTableCompoent';
import DropdownCompoent from './Components/CustomComponents/DropdownCompoent/DropdownCompoent';
// import Brands from './Components/Screens/Brands/Brands';
// import Customer from './Components/Screens/Customer/Customer';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
             {/* <Route path="/" element={<StockInformation />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path='/' element={<ListOfProducts />} /> */}
          {/* <Route path="/" element={<Supplier/>}/>  */}
           {/* <Route path="/" element={<CustomTableCompoent/>}/>  */}
           {/* <Route path="/" element={<DropdownCompoent/>}/>  */}

        </Routes>
      </Router>
    </div>
  );
}

export default App;
