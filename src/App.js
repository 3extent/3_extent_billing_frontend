import Login from './Components/Screens/Login/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Screens/Dashboard/Dashboard";
import CustomHeaderComponent from './Components/CustomComponents/CustomHeaderComponent/CustomHeaderComponent';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<CustomHeaderComponent/>} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
