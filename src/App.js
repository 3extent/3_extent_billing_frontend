import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import Login from './Components/Screens/Login/Login';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
        </Routes>
      </Router>

    </div>
  );
}

export default App;
