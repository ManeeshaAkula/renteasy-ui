import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const RoleCtx = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => (localStorage.getItem("role") || "LENDER").toUpperCase());
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const data = decodeJwt(token);
    if (!data) return;
    if (!userId && data.id) setUserId(data.id);
    const fromToken =
      (data.role_code && String(data.role_code).toUpperCase()) ||
      (data.role_name && String(data.role_name).toUpperCase());
    if (fromToken && fromToken !== role) setRole(fromToken);
  }, []); // run once on mount

  const value = useMemo(() => ({ role, setRole, userId, setUserId }), [role, userId]);
  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
