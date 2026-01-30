import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";
import "../styles/Dashboard.css";
import { logout } from "../services/api";

const MENUS = {
  LENDER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "My Profile", path: "/my-profile" },
    { label: "Add Product", path: "/product" },
    { label: "Your Products", path: "/products" }
  ],
  BUYER: [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Browse", path: "/products" },
    { label: "My Cart", path: "/cart" },
    { label: "My Profile", path: "/my-profile" }
  ]
};

export default function DashboardLayout() {
  const { clearAuth } = useRole();
  const [currentView, setCurrentView] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");
  const role = localStorage.getItem("role");

  const safeRole = role && MENUS[role] ? role : "BUYER";
  const menu = MENUS[safeRole];

  const welcomeTitle = userName ? `Welcome ${userName}` : "Welcome";

  const pathToLabel = useMemo(
    () => Object.fromEntries(menu.map((m) => [m.path, m.label])),
    [menu]
  );

  useEffect(() => {
    const label = pathToLabel[location.pathname] || "Dashboard";
    if (label !== currentView) setCurrentView(label);
  }, [location.pathname, pathToLabel, currentView]);

  const onLogout = () => {
    logout();
    clearAuth();
    navigate("/login", { replace: true });
  };

  const onSearch = useCallback(() => {
    const q = searchTerm.trim();
    const valid = /^[A-Za-z0-9\s-]{3,}$/.test(q);
    if (!valid) return setSearchError("Enter at least 3 letters or digits");
    setSearchError("");
    navigate(`/products?q=${encodeURIComponent(q)}`);
  }, [searchTerm, navigate]);

  return (
    <div className="dh-shell">
      <aside className="dh-sidenav">
        <div className="dh-brand">RentEasy</div>

        <nav className="dh-nav">
          {menu.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className={currentView === label ? "active" : ""}
              onClick={() => setCurrentView(label)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="dh-role-switch">
          <button className="dh-switch-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="dh-main">
        <header className="dh-header">
          <div className="dh-header-left">
            <h1 className="dh-title">{welcomeTitle}</h1>
          </div>

          <div className="dh-header-right">
            <div className="dh-search">
              <input
                placeholder="Search product name or ZIP"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
              <button className="dh-search-btn" onClick={onSearch}>
                Search
              </button>
            </div>

            {searchError ? <span className="dh-search-error">{searchError}</span> : null}

            <div className="dh-user">
              <div className="dh-avatar">
                {((userName && userName[0]) || "U").toUpperCase()}
              </div>
              <span className="dh-username">{userName}</span>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
