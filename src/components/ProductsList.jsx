// src/components/ProductsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import "../styles/ProductsList.css";
import { getProductsList, getCategoryByCode } from "../services/api";

export default function ProductsList({
  items: itemsProp = null,
  onDelete = null,
  embedded = false,
  showActions = true
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = useState(itemsProp ?? []);
  const [loading, setLoading] = useState(!itemsProp);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null, title: "" });
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    let cancel = false;
    if (itemsProp) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams(location.search);
        const q = (params.get("q") || "").trim();
        const res = await getProductsList(q);
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        if (!cancel) setRows(data);
      } catch {
        if (!cancel) setError("Failed to load products.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [itemsProp, location.search]);

  useEffect(() => {
    if (itemsProp) setRows(itemsProp);
  }, [itemsProp]);

  useEffect(() => {
    if (!rows || rows.length === 0) return;
    const filteredProducts = rows.filter(p => Number(p.quantity) >= 3);
    localStorage.setItem(
      "productsWithHighQuantity",
      JSON.stringify(filteredProducts)
    );
  }, [rows]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await getCategoryByCode("PRODUCTS");
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        const map = {};
        list.forEach(c => {
          if (c.id) map[String(c.id)] = c.name || c.value || c.label || "";
        });
        if (!cancel) setCategoryMap(map);
      } catch {}
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const gotoEdit = (product) => {
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
    } catch { }
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
        {loading ? (
          <div className="plist-empty">Loading…</div>
        ) : error ? (
          <div className="plist-empty">{error}</div>
        ) : rows.length === 0 ? (
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

                <div className="c" role="cell">
                  {categoryMap[p.category_id] || p.category_id}
                </div>

                <div className="c" role="cell">${Number(p.price_per_day ?? 0).toFixed(2)}</div>
                <div className="c" role="cell">{p.quantity}</div>
                <div className="c" role="cell">${Number(p.deposit ?? 0).toFixed(2)}</div>
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
