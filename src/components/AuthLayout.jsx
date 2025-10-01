import React from "react";

export default function AuthLayout({ children, brandTitle = "RentEasy", brandSubtitle = "A Rental Web Application" }) {
  return (
    <div className="auth-split">
      <div className="auth-visual">
        <div className="visual-layer">
          <div className="visual-content">
            <h2>Welcome to 
                Rent Easy
            </h2>
          </div>
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div className="grid-overlay" />
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-header">
            <div className="company-info">
              <h1 className="company-title">{brandTitle}</h1>
              <p className="company-subtitle">{brandSubtitle}</p>
            </div>
          </div>
          {children}
        </div>
        <footer className="auth-footer">
          <span>© {new Date().getFullYear()} {brandTitle}</span>
        </footer>
      </div>
    </div>
  );
}
