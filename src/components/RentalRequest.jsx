import React, { useMemo, useState } from "react";
import "../styles/RentalRequest.css";
import { FiPhone, FiUser, FiMapPin, FiCheck, FiX } from "react-icons/fi";

const TABS = ["All", "Pending", "Accepted", "Declined"];

const mockRequests = [
  {
    id: "RR-1001",
    product: {
      id: "p1",
      title: "Canon DSLR Camera",
      image_url: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=600&q=80",
      price_per_day: 30,
      deposit: 100,
      location_city: "Los Angeles",
      location_state: "CA",
    },
    renter: {
      id: "u88",
      name: "John Smith",
      phone: "+1 (555) 238-9912",
      city: "Burbank",
      state: "CA",
    },
    start_date: "2025-10-05",
    end_date: "2025-10-08",
    status: "Pending",
    note: "Planning a weekend shoot."
  },
  {
    id: "RR-1002",
    product: {
      id: "p2",
      title: "Cordless Drill",
      image_url: "https://images.unsplash.com/photo-1562158070-0eb2b0d4f5c5?w=600&q=80",
      price_per_day: 12.5,
      deposit: 40,
      location_city: "Austin",
      location_state: "TX",
    },
    renter: {
      id: "u42",
      name: "Alice Johnson",
      phone: "+1 (555) 412-0081",
      city: "Austin",
      state: "TX",
    },
    start_date: "2025-10-02",
    end_date: "2025-10-04",
    status: "Accepted",
    note: "Need for minor home repairs."
  },
  {
    id: "RR-1003",
    product: {
      id: "p3",
      title: "Camping Tent",
      image_url: "https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=600&q=80",
      price_per_day: 15,
      deposit: 60,
      location_city: "Seattle",
      location_state: "WA",
    },
    renter: {
      id: "u19",
      name: "Michael Lee",
      phone: "+1 (555) 901-7721",
      city: "Bellevue",
      state: "WA",
    },
    start_date: "2025-10-14",
    end_date: "2025-10-18",
    status: "Declined",
    note: "Backpacking trip."
  },
  {
    id: "RR-1004",
    product: {
      id: "p3",
      title: "Camping Tent",
      image_url: "https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=600&q=80",
      price_per_day: 15,
      deposit: 60,
      location_city: "Seattle",
      location_state: "WA",
    },
    renter: {
      id: "u19",
      name: "Michael Lee",
      phone: "+1 (555) 901-7721",
      city: "Bellevue",
      state: "WA",
    },
    start_date: "2025-10-14",
    end_date: "2025-10-18",
    status: "Declined",
    note: "Backpacking trip."
  },
  {
    id: "RR-1005",
    product: {
      id: "p3",
      title: "Camping Tent",
      image_url: "https://images.unsplash.com/photo-1504711331083-9c895941bf81?w=600&q=80",
      price_per_day: 15,
      deposit: 60,
      location_city: "Seattle",
      location_state: "WA",
    },
    renter: {
      id: "u19",
      name: "Michael Lee",
      phone: "+1 (555) 901-7721",
      city: "Bellevue",
      state: "WA",
    },
    start_date: "2025-10-14",
    end_date: "2025-10-18",
    status: "Declined",
    note: "Backpacking trip."
  }
];

function daysBetween(a, b) {
  try {
    const d1 = new Date(a);
    const d2 = new Date(b);
    const ms = d2 - d1;
    const days = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
    return days;
  } catch { return 1; }
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString();
  } catch { return iso; }
}

function money(n) {
  const num = Number(n || 0);
  return `$${num.toFixed(2)}`;
}

export default function RentalRequests() {
  const [tab, setTab] = useState("Pending");
  const [rows, setRows] = useState(mockRequests);
  const [confirm, setConfirm] = useState({ open: false, id: null, type: null }); // type: 'accept' | 'decline'
  const [banner, setBanner] = useState("");

  const filtered = useMemo(() => {
    if (tab === "All") return rows;
    return rows.filter(r => r.status === tab);
  }, [rows, tab]);

  const openConfirm = (id, type) => setConfirm({ open: true, id, type });
  const closeConfirm = () => setConfirm({ open: false, id: null, type: null });

  const onConfirm = async () => {
    const { id, type } = confirm;
    closeConfirm();
    // optimistic update; wire your API here
    setRows(prev => prev.map(r => (r.id === id ? { ...r, status: type === "accept" ? "Accepted" : "Declined" } : r)));
    setBanner(type === "accept" ? "Request accepted." : "Request declined.");
    setTimeout(() => setBanner(""), 2500);
  };

  return (
    <div className="rr-wrap">
      <div className="rr-head">
        <h1 className="rr-title">Rental Requests</h1>
        <div className="rr-tabs">
          {TABS.map(name => (
            <button
              key={name}
              className={`rr-tab ${tab === name ? "active" : ""}`}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {banner ? <div className="rr-banner">{banner}</div> : null}

      <div className="rr-card">
        <div className="rr-table" role="table" aria-label="Rental Requests">
          {/* Header stays outside the scrollable body */}
          <div className="rr-head-row" role="row">
            <div className="c item" role="columnheader">Product</div>
            <div className="c renter" role="columnheader">Renter</div>
            <div className="c dates" role="columnheader">Dates</div>
            <div className="c money" role="columnheader">Price/Day</div>
            <div className="c money" role="columnheader">Deposit</div>
            <div className="c money" role="columnheader">Total</div>
            <div className="c status" role="columnheader">Status</div>
            <div className="c actions" role="columnheader">Actions</div>
          </div>

          {/* Scrollable body */}
          <div className="rr-body">
            {filtered.length === 0 ? (
              <div className="rr-empty">No requests.</div>
            ) : (
              filtered.map(req => {
                const nights = daysBetween(req.start_date, req.end_date);
                const total = (req.product.price_per_day * nights) + req.product.deposit;
                return (
                  <div className="rr-row" role="row" key={req.id}>
                    <div className="c item" role="cell">
                      <div className="rr-itemcell">
                        {/* <div className="thumb" style={{ backgroundImage: `url(${req.product.image_url || ""})` }} /> */}
                        <div className="meta">
                          <div className="name">{req.product.title}</div>
                          <div className="sub">
                            {req.product.location_city}, {req.product.location_state} • <span className="muted">{req.id}</span>
                          </div>
                          {/* {req.note ? <div className="note">{req.note}</div> : null} */}
                        </div>
                      </div>
                    </div>

                    <div className="c renter" role="cell">
                      <div className="rr-renter">
                        {/* <div className="avatar">{(req.renter.name || "?").slice(0, 1)}</div> */}
                        <div className="info">
                          <div className="name"><FiUser /> {req.renter.name}</div>
                          <div className="phone"><FiPhone /> {req.renter.phone}</div>
                          <div className="place"><FiMapPin /> {req.renter.city}, {req.renter.state}</div>
                        </div>
                      </div>
                    </div>

                    <div className="c dates" role="cell">
                      <div className="rr-dates">
                        <div>{fmtDate(req.start_date)} → {fmtDate(req.end_date)}</div>
                        <div className="muted">{nights} {nights > 1 ? "nights" : "night"}</div>
                      </div>
                    </div>

                    <div className="c money" role="cell">{money(req.product.price_per_day)}</div>
                    <div className="c money" role="cell">{money(req.product.deposit)}</div>
                    <div className="c money" role="cell">
                      <div className="total">{money(total)}</div>
                      {/* <div className="muted small">incl. deposit</div> */}
                    </div>

                    <div className="c status" role="cell">
                      <span className={`badge ${req.status.toLowerCase()}`}>{req.status}</span>
                    </div>

                    <div className="c actions" role="cell">
                      <button
                        className="btn success"
                        disabled={req.status === "Accepted"}
                        onClick={() => openConfirm(req.id, "accept")}
                        title="Accept"
                      >
                        <FiCheck /> Accept
                      </button>
                      <button
                        className="btn danger"
                        disabled={req.status === "Declined"}
                        onClick={() => openConfirm(req.id, "decline")}
                        title="Decline"
                      >
                        <FiX /> Decline
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {confirm.open && (
        <ConfirmDialog
          type={confirm.type}
          onCancel={() => setConfirm({ open: false, id: null, type: null })}
          onConfirm={onConfirm}
        />
      )}
    </div>
  );
}

function ConfirmDialog({ type, onCancel, onConfirm }) {
  const title = type === "accept" ? "Accept this request?" : "Decline this request?";
  const message = type === "accept"
    ? "The renter will be notified that you accepted. Continue?"
    : "The renter will be notified that you declined. Continue?";
  return (
    <div className="rr-modal-backdrop" role="dialog" aria-modal="true">
      <div className="rr-modal">
        <h3 className="rr-modal-title">{title}</h3>
        <p className="rr-modal-message">{message}</p>
        <div className="rr-modal-actions">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${type === "accept" ? "success" : "danger"}`} onClick={onConfirm}>
            {type === "accept" ? "Yes, Accept" : "Yes, Decline"}
          </button>
        </div>
      </div>
    </div>
  );
}
