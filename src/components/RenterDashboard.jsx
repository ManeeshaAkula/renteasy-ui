import React, { useMemo } from "react";
import "../styles/RenterDashboard.css";

export default function RenterDashboard() {
    const stats = useMemo(() => ([
        { label: "Active Rentals", value: 2 },
        { label: "Pending Requests", value: 1 },
        { label: "Cart Items", value: (JSON.parse(localStorage.getItem("renteasy_cart") || "[]") || []).length },
        { label: "Total Spent (30d)", value: "$240" },
    ]), []);

    const upcoming = [
        { id: "AR-201", title: "Canon DSLR Camera", from: "2025-10-04", to: "2025-10-06", status: "Ongoing" },
        { id: "AR-198", title: "Camping Tent", from: "2025-10-11", to: "2025-10-14", status: "Booked" },
    ];

    const recents = [
        { id: "RR-901", title: "Cordless Drill", status: "Declined" },
        { id: "RR-899", title: "GoPro HERO11", status: "Accepted" },
    ];

    const suggestions = [
        { id: "p1", title: "DJI Mini 3 Drone", price_per_day: 25, image_url: "https://images.unsplash.com/photo-1518544801976-3e18f3d2e0b2?w=600&q=80" },
        { id: "p2", title: "Road Bike", price_per_day: 18, image_url: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=600&q=80" },
        { id: "p3", title: "Projector 1080p", price_per_day: 15, image_url: "https://images.unsplash.com/photo-1582771498005-7aa6b98d2a06?w=600&q=80" },
    ];

    return (
        <div className="rd-wrap">
            <section className="rd-stats">
                {stats.map((s, i) => (
                    <div key={i} className="rd-card stat">
                        <div className="rd-stat-label">{s.label}</div>
                        <div className="rd-stat-value">{s.value}</div>
                    </div>
                ))}
            </section>

            <section className="rd-grid">
                <div className="rd-card">
                    <div className="rd-card-head"><h3>Upcoming / Current</h3></div>
                    <div className="rd-list">
                        {upcoming.map(u => (
                            <div key={u.id} className="rd-row">
                                <div className="rd-title">{u.title}</div>
                                <div className="rd-sub">{u.from} → {u.to}</div>
                                <span className={`rd-badge ${u.status.toLowerCase()}`}>{u.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rd-card">
                    <div className="rd-card-head"><h3>Recent Requests</h3></div>
                    <div className="rd-list">
                        {recents.map(r => (
                            <div key={r.id} className="rd-row">
                                <div className="rd-title">{r.title}</div>
                                <div className="rd-sub">{r.id}</div>
                                <span className={`rd-badge ${r.status.toLowerCase()}`}>{r.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rd-card">
                <div className="rd-card-head"><h3>Recommended for you</h3></div>
                <div className="rd-suggest">
                    {suggestions.map(p => (
                        <div key={p.id} className="rd-item">
                            <div className="rd-thumb" style={{ backgroundImage: `url(${p.image_url})` }} />
                            <div className="rd-item-meta">
                                <div className="rd-item-title">{p.title}</div>
                                <div className="rd-item-sub">${p.price_per_day}/day</div>
                            </div>
                            <a className="rd-link" href="/renter/products">See more</a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
