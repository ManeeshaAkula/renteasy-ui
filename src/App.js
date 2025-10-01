// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";

import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProductsList from "./components/ProductsList";
import Product from "./components/Product";
import RentalRequest from "./components/RentalRequest";

import { isAuthenticated, logout } from "./services/api";
// import { getUserId } from "./services/auth";
import "./styles/App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = isAuthenticated();
    if (authenticated) setIsLoggedIn(true);
    setIsLoading(false);
  }, []);

  const handleSuccessfulAuth = () => setIsLoggedIn(true);
  const handleLogout = () => { logout(); setIsLoggedIn(false); };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onSuccessfulAuth={handleSuccessfulAuth} />} />

        {/* Shell with SideNav + Header always visible */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><ProductsList /></ProtectedRoute>} />
          <Route path="/product" element={<ProtectedRoute><Product sellerId="1234" /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><Product sellerId="1234" /></ProtectedRoute>} />
          <Route
            path="/rental-requests"
            element={
              <ProtectedRoute>
                <RentalRequest onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
