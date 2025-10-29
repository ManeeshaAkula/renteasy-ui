import React from "react";
import "../styles/RenterCart.css";
import { useCart } from "../context/CartContext";

export default function RenterCart() {
  const { items, setQty, remove, clear, totals } = useCart();

  return (
    <div className="rc-wrap">
      <div className="rc-head">
        <h1 className="rc-title">Your Cart</h1>
        {items.length ? <button className="btn ghost" onClick={clear}>Clear Cart</button> : null}
      </div>

      {items.length === 0 ? (
        <div className="rc-empty">Your cart is empty.</div>
      ) : (
        <div className="rc-grid">
          <div className="rc-list">
            <div className="rc-row rc-head-row">
              <div className="c item">Item</div>
              <div className="c qty">Qty</div>
              <div className="c price">Price/Day</div>
              {/* could include days selection later */}
              <div className="c subtotal">Subtotal</div>
              <div className="c actions">Actions</div>
            </div>

            <div className="rc-body">
              {items.map(it => (
                <div key={it.id} className="rc-row">
                  <div className="c item">
                    <div className="rc-itemcell">
                      <div className="thumb" style={{backgroundImage:`url(${it.image_url})`}} />
                      <div className="meta">
                        <div className="name">{it.title}</div>
                        <div className="sub">${it.price_per_day}/day</div>
                      </div>
                    </div>
                  </div>
                  <div className="c qty">
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={it.qty}
                      onChange={(e)=>setQty(it.id, e.target.value)}
                    />
                  </div>
                  <div className="c price">${Number(it.price_per_day).toFixed(2)}</div>
                  <div className="c subtotal">${(Number(it.price_per_day)*it.qty).toFixed(2)}</div>
                  <div className="c actions">
                    <button className="btn danger" onClick={()=>remove(it.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rc-summary">
            <div className="rc-card">
              <div className="rc-line">
                <span>Subtotal</span>
                <b>${totals.subtotal.toFixed(2)}</b>
              </div>
              <div className="rc-line">
                <span>Deposit</span>
                <b>${totals.deposit.toFixed(2)}</b>
              </div>
              <div className="rc-total">
                <span>Total</span>
                <b>${totals.total.toFixed(2)}</b>
              </div>
              <button className="btn primary rc-checkout">Rent Now</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
