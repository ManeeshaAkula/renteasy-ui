import React, { useEffect, useMemo, useState } from "react";
import "../styles/RenterProducts.css";
import { useCart } from "../context/CartContext";

const mockProducts = [
  { id:"p1", title:"Canon DSLR Camera", price_per_day:30, image_url:"https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=600&q=80", city:"Los Angeles", state:"CA" },
  { id:"p2", title:"Cordless Drill",    price_per_day:12.5, image_url:"https://images.unsplash.com/photo-1562158070-0eb2b0d4f5c5?w=600&q=80", city:"Austin", state:"TX" },
  { id:"p3", title:"Camping Tent",      price_per_day:15, image_url:"https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=600&q=80", city:"Seattle", state:"WA" },
  { id:"p4", title:"Road Bike",         price_per_day:18, image_url:"https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=600&q=80", city:"Denver", state:"CO" },
  { id:"p5", title:"Projector 1080p",   price_per_day:15, image_url:"https://images.unsplash.com/photo-1582771498005-7aa6b98d2a06?w=600&q=80", city:"San Jose", state:"CA" },
];

export default function RenterProducts() {
  const { add } = useCart();
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(mockProducts);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q)
    );
  }, [rows, query]);

  // Example: replace with API call
  useEffect(() => { setRows(mockProducts); }, []);

  return (
    <div className="rp-wrap">
      <div className="rp-head">
        <h1 className="rp-title">Browse Products</h1>
        <div className="rp-search">
          <input placeholder="Search title, city, state" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
      </div>

      <div className="rp-grid">
        {filtered.map(p => (
          <div key={p.id} className="rp-card">
            <div className="rp-thumb" style={{backgroundImage:`url(${p.image_url})`}} />
            <div className="rp-meta">
              <div className="rp-name">{p.title}</div>
              <div className="rp-sub">{p.city}, {p.state}</div>
            </div>
            <div className="rp-price">${p.price_per_day}/day</div>
            <button className="btn primary" onClick={()=>add(p, 1)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
