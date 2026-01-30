// App.jsx (excerpt)
import React, { useState, useEffect } from 'react';
import { RoleProvider } from "./context/RoleContext";
import RoleRoute from "./components/RoleRoute";
import DashboardLayout from "./components/DashboardLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import './styles/App.css';
import { isAuthenticated, getUserType, logout } from './services/api.js';
import ProtectedRoute from './components/ProtectedRoute';


// Lender pages
import Dashboard from "./components/Dashboard";
import Product from "./components/Product";
import ProductsList from "./components/ProductsList";
import RentalRequest from "./components/RentalRequest";
import MyProfile from "./components/MyProfile";

// Renter pages
import RenterDashboard from "./components/RenterDashboard";
import RenterProducts from "./components/RenterProducts";
import RenterCart from "./components/RenterCart";
import RenterProfile from "./components/RenterProfile";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const authenticated = isAuthenticated();
    const storedUserType = getUserType();
    const storedUserId = localStorage.getItem("userId");

    if (authenticated) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      setUserId(storedUserId);
    }

    setIsLoading(false);
  }, []);

  const handleSuccessfulAuth = (response) => {
    setTimeout(() => {
      setIsLoggedIn(true);
      setUserType(response.userType || "Lender");
      setUserId(response.userId || localStorage.getItem("userId"));
    }, 100);
  };
      console.log("............. response in successful auth", userType)

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserType(null);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <RoleProvider>
      <Routes>
        <Route path="/login" element={<Login onSuccessfulAuth={handleSuccessfulAuth} />} />
        <Route path="/register" element={<Register userType={userType} setUserType={setUserType} />} /><Route element={<DashboardLayout />}>
          {/* LENDER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {userType === "BUYER" ? (
                  <RenterDashboard onLogout={handleLogout} />
                ) : (
                  <Dashboard onLogout={handleLogout} />
                )}
              </ProtectedRoute>

            }
          />

          <Route
            path="my-profile"
            element={

              <ProtectedRoute>
                {userType === "BUYER" ? (
                  <RenterProfile onLogout={handleLogout} />
                ) : (
                  <MyProfile onLogout={handleLogout} />
                )}
              </ProtectedRoute>
            }
          />

          <Route
            path="/product"
            element={
              <RoleRoute allow={["LENDER"]}>
                <Product userId={userId}/>
              </RoleRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <RoleRoute allow={["LENDER"]}>
                <Product userId={userId}/>
              </RoleRoute>
            }
          />
          <Route
            path="/products"
            element={
              <RoleRoute allow={["LENDER"]}>
                <ProductsList userId={userId}/>
              </RoleRoute>
            }
          />
          <Route
            path="/rental-requests"
            element={
              <RoleRoute allow={["LENDER"]}>
                <RentalRequest />
              </RoleRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <RoleRoute allow={["LENDER"]}>
                <MyProfile />
              </RoleRoute>
            }
          />

          {/* RENTER */}
          <Route
            path="/renter/dashboard"
            element={
              <RoleRoute allow={["BUYER"]}>
                <RenterDashboard onLogout={handleLogout} />
              </RoleRoute>
            }
          />
          <Route
            path="/renter/products"
            element={
              <RoleRoute allow={["BUYER"]}>
                <RenterProducts />
              </RoleRoute>
            }
          />
          <Route
            path="/renter/cart"
            element={
              <RoleRoute allow={["BUYER"]}>
                <RenterCart />
              </RoleRoute>
            }
          />


          {/* Default */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </RoleProvider>
  );
}
