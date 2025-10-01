import React, { useMemo } from "react";
import "../styles/Dashboard.css";
import ProductsList from "./ProductsList";

function StatCard({ label, value, sub }) {
  return (
    <div className="dh-card stat">
      <div className="dh-stat-label">{label}</div>
      <div className="dh-stat-value">{value}</div>
      {sub ? <div className="dh-stat-sub">{sub}</div> : null}
    </div>
  );
}

function QuickAction({ label, onClick }) {
  return <button className="dh-qa-btn" onClick={onClick}>{label}</button>;
}

export default function HomeDashboard() {
  const stats = useMemo(
    () => [
      { label: "Total Products", value: "12", sub: "3 inactive" },
      { label: "Pending Requests", value: "4", sub: "Review now" },
      { label: "Ongoing Rentals", value: "3", sub: "2 end this week" },
      { label: "Monthly Earnings", value: "$1,280", sub: "↑ 12% vs last month" },
    ],
    []
  );

  const products = useMemo(
    () => [
      { id: "p1", title: "Canon DSLR Camera", description: "24MP + 18-55mm lens", image_url: "", category_id: "ELECTRONICS", price_per_day: 30, quantity: 4, deposit: 100, location_city: "Los Angeles", location_state: "CA", location_zip: "90001", rentals: 12 },
      { id: "p2", title: "Cordless Drill", description: "18V brushless motor", image_url: "", category_id: "TOOLS", price_per_day: 12.5, quantity: 7, deposit: 40, location_city: "Austin", location_state: "TX", location_zip: "73301", rentals: 8 },
      { id: "p3", title: "Camping Tent", description: "2-person tent", image_url: "", category_id: "OUTDOOR", price_per_day: 15, quantity: 3, deposit: 60, location_city: "Seattle", location_state: "WA", location_zip: "98101", rentals: 2 },
    ],
    []
  );

  return (
    <div className="dh-content">
      {/* Stat cards */}
      <section className="dh-stats">
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </section>

      {/* Quick Actions */}
      <section className="dh-row">
        <div className="dh-col">
          <div className="dh-card">
            <div className="dh-card-head">
              <h2 className="dh-h2">Quick Actions</h2>
            </div>
            <div className="dh-qa">
              <QuickAction label="Add Product" onClick={() => (window.location.href = "/product")} />
              <QuickAction label="Manage Inventory" onClick={() => (window.location.href = "/products")} />
              <QuickAction label="Withdrawal" onClick={() => (window.location.href = "/earnings")} />
            </div>
          </div>
        </div>
      </section>

      {/* Top Products (reuses ProductsList, no actions) */}
      <section className="dh-row">
        <div className="dh-col">
          <div className="dh-card">
            <div className="dh-card-head">
              <h2 className="dh-h2">Top Products (rentals &gt; 3)</h2>
            </div>
            <ProductsList
              embedded
              showActions={false}
              items={products.filter((p) => Number(p.rentals) > 3)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
