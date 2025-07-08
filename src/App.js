import Login from './Components/Screens/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
import Supplier from "./Components/Screens/Supplier/Supplier";
import CustomTableCompoent from './Components/CustomComponents/CustomTableCompoent/CustomTableCompoent';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/" element={<Supplier/>}/> 
           {/* <Route path="/" element={<CustomTableCompoent/>}/>  */}

        </Routes>
      </Router>
    </div>
  );
}

export default App;
