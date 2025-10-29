import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);

/**
 * Local-storage backed cart.
 * Swap the internals with server calls later if needed.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("renteasy_cart") || "[]"); }
    catch { return []; }
  });

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem("renteasy_cart", JSON.stringify(items));
  }, [items]);

  // actions
  const add = (product, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.id === product.id);
      if (i >= 0) {
        const next = [...prev];
        next[i].qty = Math.min(99, next[i].qty + qty);
        return next;
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          image_url: product.image_url,
          price_per_day: Number(product.price_per_day) || 0,
          qty: Number(qty) || 1,
          deposit: Number(product.deposit || 0),
        },
      ];
    });
  };

  const setQty = (id, qty) =>
    setItems(prev =>
      prev.map(x => (x.id === id ? { ...x, qty: Math.max(1, Math.min(99, Number(qty) || 1)) } : x))
    );

  const remove = id => setItems(prev => prev.filter(x => x.id !== id));
  const clear = () => setItems([]);

  // totals (simple example: deposit per item already on item.deposit)
  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + (Number(it.price_per_day) || 0) * (it.qty || 0), 0);
    const deposit  = items.reduce((s, it) => s + (Number(it.deposit) || 0) * (it.qty || 0), 0);
    const total    = subtotal + deposit;
    return { subtotal, deposit, total };
  }, [items]);

  const value = useMemo(() => ({ items, add, setQty, remove, clear, totals }), [items, totals]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
