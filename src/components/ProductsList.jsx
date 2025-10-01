// src/components/ProductsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import "../styles/ProductsList.css";

/**
 * Props:
 * - items?: array of products to display (if omitted, uses MOCK)
 * - onDelete?: async (id) => void  (optional; if omitted, deletes locally)
 * - embedded?: boolean (hides header actions etc.)
 * - showActions?: boolean (defaults true)
 */
export default function ProductsList({
  items: itemsProp = null,
  onDelete = null,
  embedded = false,
  showActions = true
}) {
  const navigate = useNavigate();

  const MOCK = [
    {
      id: "p1",
      title: "Canon DSLR Camera",
      description: "24MP body with 18-55mm lens.",
      image_url: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?w=600&q=80",
      category_id: "ELECTRONICS",
      price_per_day: 30,
      quantity: 4,
      deposit: 100,
      location_city: "Los Angeles",
      location_state: "CA",
      location_zip: "90001",
    },
    {
      id: "p2",
      title: "Cordless Drill",
      description: "18V brushless motor, 2 batteries.",
      image_url: "https://images.unsplash.com/photo-1562158070-0eb2b0d4f5c5?w=600&q=80",
      category_id: "TOOLS",
      price_per_day: 12.5,
      quantity: 7,
      deposit: 40,
      location_city: "Austin",
      location_state: "TX",
      location_zip: "73301",
    },
  ];

  const [rows, setRows] = useState(itemsProp ?? MOCK);
  const [confirm, setConfirm] = useState({ open: false, id: null, title: "" });

  useEffect(() => {
    if (itemsProp) setRows(itemsProp);
  }, [itemsProp]);

  const gotoEdit = (product) => {
    // pass full product via state so Product can prefill instantly (no fetch)
    navigate(`/product/${product.id}`, {
      state: { product, mode: "edit", from: "products-list" },
    });
  };

  const onRowClick = (product) => gotoEdit(product);

  const askDelete = (product) => {
    setConfirm({ open: true, id: product.id, title: product.title });
  };
  const closeConfirm = () => setConfirm({ open: false, id: null, title: "" });

  const doDelete = async () => {
    const id = confirm.id;
    closeConfirm();
    try {
      if (onDelete) await onDelete(id);
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const gridCols = showActions
    ? "2fr 1fr 1fr 0.6fr 1fr 1.6fr 0.8fr"
    : "2fr 1fr 1fr 0.6fr 1fr 1.6fr";

  return (
    <div className={`plist-wrap${embedded ? " embedded" : ""}`}>
      {!embedded && (
        <div className="plist-head">
          <h1 className="plist-title">Products</h1>
          <button className="btn primary" onClick={() => navigate("/product")}>
            <FiPlus style={{ marginRight: 8 }} />
            Add Product
          </button>
        </div>
      )}

      <div className="plist-card">
        {rows.length === 0 ? (
          <div className="plist-empty">No products found.</div>
        ) : (
          <div className="plist-table" role="table" aria-label="Products">
            <div className="plist-row plist-row-head" role="row" style={{ gridTemplateColumns: gridCols }}>
              <div className="c t" role="columnheader">Item</div>
              <div className="c" role="columnheader">Category</div>
              <div className="c" role="columnheader">Price/Day</div>
              <div className="c" role="columnheader">Qty</div>
              <div className="c" role="columnheader">Deposit</div>
              <div className="c" role="columnheader">Location</div>
              {showActions && <div className="c a" role="columnheader">Actions</div>}
            </div>

            {rows.map((p) => (
              <div
                key={p.id}
                className="plist-row plist-clickable"
                role="row"
                style={{ gridTemplateColumns: gridCols }}
                onClick={() => onRowClick(p)}
              >
                <div className="c t" role="cell">
                  <div className="plist-titlecell">
                    <div className="thumb" style={{ backgroundImage: `url(${p.image_url || ""})` }} />
                    <div className="meta">
                      <div className="name">{p.title}</div>
                      <div className="sub line-clamp-1">{p.description}</div>
                    </div>
                  </div>
                </div>
                <div className="c" role="cell">{p.category_id}</div>
                <div className="c" role="cell">${Number(p.price_per_day).toFixed(2)}</div>
                <div className="c" role="cell">{p.quantity}</div>
                <div className="c" role="cell">${Number(p.deposit).toFixed(2)}</div>
                <div className="c" role="cell">
                  {p.location_city}, {p.location_state} {p.location_zip}
                </div>
                {showActions && (
                  <div className="c a" role="cell" onClick={(e) => e.stopPropagation()}>
                    <button className="icon-btn" title="Edit" onClick={() => gotoEdit(p)}>
                      <FiEdit2 />
                    </button>
                    <button className="icon-btn danger" title="Delete" onClick={() => askDelete(p)}>
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {confirm.open && (
        <ConfirmDialog
          title="Delete product?"
          message={`Do you want to delete “${confirm.title}”? This action cannot be undone.`}
          onCancel={closeConfirm}
          onConfirm={doDelete}
        />
      )}
    </div>
  );
}

function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
