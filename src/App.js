import Login from './Components/Screens/Login/Login';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
import ListOfProducts from './Components/Screens/Products/ListOfProducts';
// import Supplier from "./Components/Screens/Supplier/Supplier";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/' element={<ListOfProducts />} />
          {/* <Route path="/" element={<Supplier/>}/>  */}
        </Routes>

      </Router>


    </div>

  );
}

export default App;
