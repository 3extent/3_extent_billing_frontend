import Login from './Components/Screens/Login/Login';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
// import Supplier from "./Components/Screens/Supplier/Supplier";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          {/* <Route path="/" element={<Supplier/>}/>  */}
        </Routes>

      </Router>


    </div>

  );
}

export default App;
