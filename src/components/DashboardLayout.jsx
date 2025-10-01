import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const labelToPath = {
  "Dashboard": "/dashboard",
  "Add Product": "/product",
  "Your Products": "/products",
  "Rental Requests": "/rental-requests",
  "Active Rentals": "/active-rentals",
  "Earnings": "/earnings",
  "Settings": "/settings",
  "Support": "/support"
};

function Header({ searchTerm, setSearchTerm, onSearch, searchError }) {
  const handleKey = (e) => e.key === "Enter" && onSearch();
  return (
    <header className="dh-header">
      <div className="dh-header-left">
        <h1 className="dh-title">Dashboard</h1>
      </div>
      <div className="dh-header-right">
        <div className="dh-search">
          <input
            placeholder="Search name or ZIP"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="dh-search-btn" onClick={onSearch}>Search</button>
        </div>
        {searchError ? <span className="dh-search-error">{searchError}</span> : null}
        <div className="dh-user">
          <div className="dh-avatar">U</div>
          <span className="dh-username">User</span>
        </div>
      </div>
    </header>
  );
}

function SideNav({ currentView, setCurrentView }) {
  const items = [
    "Dashboard",
    "Add Product",
    "Your Products",
    "Rental Requests",
    "Active Rentals",
    "Earnings",
    "Settings",
    "Support"
  ];
  return (
    <aside className="dh-sidenav">
      <div className="dh-brand">RentEasy</div>
      <nav className="dh-nav">
        {items.map((label) => (
          <Link
            key={label}
            to={labelToPath[label]}
            className={currentView === label ? "active" : ""}
            onClick={() => setCurrentView(label)}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="dh-role-switch">
        <span>Switch Role</span>
        <button className="dh-switch-btn">Renter</button>
      </div>
    </aside>
  );
}

export default function DashboardLayout() {
  const [currentView, setCurrentView] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const pathToLabel = useMemo(
    () => Object.fromEntries(Object.entries(labelToPath).map(([k, v]) => [v, k])),
    []
  );

  useEffect(() => {
    const label = pathToLabel[location.pathname] || "Dashboard";
    if (label !== currentView) setCurrentView(label);
  }, [location.pathname, pathToLabel, currentView]);

  const onSearch = useCallback(() => {
    const q = searchTerm.trim();
    const valid = /^[A-Za-z0-9\s-]{3,}$/.test(q);
    if (!valid) return setSearchError("Enter at least 3 letters or digits");
    setSearchError("");
    // Example: send users to products (you can wire real filtering later)
    navigate("/products");
  }, [searchTerm, navigate]);

  return (
    <div className="dh-shell">
      <SideNav currentView={currentView} setCurrentView={setCurrentView} />
      <main className="dh-main">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={onSearch}
          searchError={searchError}
        />
        {/* Every page renders BELOW the header, with the sidenav fixed */}
        <Outlet />
      </main>
    </div>
  );
}
