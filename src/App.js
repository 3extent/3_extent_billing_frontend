import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import AddSupplier from './Components/Screens/Supplier/AddSupplier';
import AddCustomer from './Components/Screens/Customer/AddCustomer';
import Billinghistory from './Components/Screens/SalesBilling/Billinghistory';
import SingleBillHistory from './Components/Screens/SalesBilling/SingleBillHistroy';
import { ToastContainer } from 'react-toastify';
import SingleDraftBillHistory from './Components/Screens/SalesBilling/SingleDraftBillHistroy';
import PrivacyPolicy from './Components/Screens/Policies/PrivacyPolicy';
import TermAndCondition from './Components/Screens/Policies/TermAndCondition';
import AddRepair from './Components/Screens/Repair/AddRepair';
import Repair from './Components/Screens/Repair/Repair';
import Repairers from './Components/Screens/Repair/Repairers';
import AddRepairers from './Components/Screens/Repair/AddRepairers';
import AcceptRepair from './Components/Screens/Repair/AcceptRepair';



// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/salesbilling" replace />;
  }
  return children;
};

function App() {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    setLoginStatus(isAuthenticated);
  }, []);

  // Function to update authentication state (can be passed to child components)
  const updateAuthState = (isAuthenticated) => {
    setLoginStatus(isAuthenticated);
  };

  console.log('loginStatus: ', loginStatus);

  return (
    <Router>
      <div className="flex">
        {loginStatus ? (
          <div className="w-[17%]">
            <DashboardSidebar onLogout={() => updateAuthState(false)} />
          </div>
        ) : (
          <div></div>
        )}
        <div className={loginStatus ? "w-[83%] p-4" : "w-full"}>
          <ToastContainer />
          <Routes>
            <Route path="/" element={
              <PublicRoute isAuthenticated={loginStatus}>
                <Login onLoginSuccess={() => updateAuthState(true)} />
              </PublicRoute>
            } />
            <Route
              path="/termAndCondition"
              element={
                <PublicRoute>
                  <TermAndCondition />
                </PublicRoute>
              }
            />
            <Route
              path="privacyPolicy"
              element={
                <PublicRoute>
                  <PrivacyPolicy />
                </PublicRoute>
              }
            />

            <Route path="/salesbilling" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <SalesBilling />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <ListOfProducts />
              </ProtectedRoute>
            } />
            <Route path="/supplier" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Supplier />
              </ProtectedRoute>
            } />
            <Route path="/customer" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Customer />
              </ProtectedRoute>
            } />
            <Route path="/brands" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Brands />
              </ProtectedRoute>
            } />
            <Route path="/models" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Models />
              </ProtectedRoute>
            } />
            <Route path="/repair" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Repair />
              </ProtectedRoute>
            } />
            {/* <Route path="/acceptrepair/:id" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <AcceptRepair />
              </ProtectedRoute>
            } /> */}
            <Route path="/repairers" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Repairers />
              </ProtectedRoute>
            } />
            <Route path="/stockin/:product_id?" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <StockIn />
              </ProtectedRoute>
            } />
            <Route path="/addbrands/:brand_id?" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <AddBrands />
              </ProtectedRoute>
            } />

            <Route path="/addmodels/:model_id?" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <AddModels />
              </ProtectedRoute>
            } />
            <Route path="/addcustomer/:customer_id?" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <AddCustomer />
              </ProtectedRoute>
            } />
            <Route path="/addsupplier/:supplier_id?" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <AddSupplier />
              </ProtectedRoute>
            } />
            <Route path="/billinghistory" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Billinghistory isDraft={false} />
              </ProtectedRoute>
            } />
            <Route path="/draftbillhistroy" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <Billinghistory isDraft={true} />
              </ProtectedRoute>
            } />
            <Route path="/singleBillHistory/:billId" element={<SingleBillHistory />} />
            <Route path="/singleDraftBillHistroy/:draftBillId" element={<SingleDraftBillHistory />} />

            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/addrepair/" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <AddRepair />
              </ProtectedRoute>
            } />
            <Route path="/AddRepairers" element={
              <ProtectedRoute isAuthenticated={loginStatus}>
                <AddRepairers />
              </ProtectedRoute>
            } />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
