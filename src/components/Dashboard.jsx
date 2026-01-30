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

export default function HomeDashboard() {
  const stats = useMemo(
    () => [
      { label: "Total Products", value: "12" },
      { label: "Pending Requests", value: "4" },
      { label: "Ongoing Rentals", value: "3" },
      { label: "Monthly Earnings", value: "$1,280" }
    ],
    []
  );

  const products = JSON.parse(
    localStorage.getItem("productsWithHighQuantity") || "[]"
  );

  console.log("......products in dashboard", products)

  // const products = useMemo(
  //   () => [
  //     {
  //       id: "p1",
  //       title: "Canon DSLR Camera",
  //       description: "24MP + 18-55mm lens",
  //       image_url: "",
  //       category_id: "ELECTRONICS",
  //       price_per_day: 30,
  //       quantity: 4,
  //       deposit: 100,
  //       location_city: "Los Angeles",
  //       location_state: "CA",
  //       location_zip: "90001",
  //       rentals: 12
  //     },
  //     {
  //       id: "p2",
  //       title: "Cordless Drill",
  //       description: "18V brushless motor",
  //       image_url: "",
  //       category_id: "TOOLS",
  //       price_per_day: 12.5,
  //       quantity: 7,
  //       deposit: 40,
  //       location_city: "Austin",
  //       location_state: "TX",
  //       location_zip: "73301",
  //       rentals: 8
  //     },
  //     {
  //       id: "p3",
  //       title: "Camping Tent",
  //       description: "2-person tent",
  //       image_url: "",
  //       category_id: "OUTDOOR",
  //       price_per_day: 15,
  //       quantity: 3,
  //       deposit: 60,
  //       location_city: "Seattle",
  //       location_state: "WA",
  //       location_zip: "98101",
  //       rentals: 2
  //     }
  //   ],
  //   []
  // );

  return (
    <div className="dh-content">
      <section className="dh-stats">
        {stats.map((s, i) => (
          <StatCard key={i} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </section>

      <section className="dh-row">
        <div className="dh-col">
          <div className="dh-card">
            <div className="dh-card-head">
              <h2 className="dh-h2">Top Products (rentals &gt; 3)</h2>
            </div>
            <ProductsList embedded showActions={false} items={products} />
          </div>
        </div>
      </section>
    </div>
  );
}
