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
  const [role, setRole] = useState(() =>
    (localStorage.getItem("role") || "LENDER").toUpperCase()
  );

  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");

  const [userName, setUserName] = useState(() => localStorage.getItem("userName"));
  //   if (!raw) return { first_name: "", last_name: "" };
  //   try {
  //     const parsed = JSON.parse(raw);
  //     return {
  //       first_name: parsed?.first_name || "",
  //       last_name: parsed?.last_name || ""
  //     };
  //   } catch {
  //     return { first_name: "", last_name: "" };
  //   }
  // });

  useEffect(() => {
    localStorage.setItem("role", role || "");
  }, [role]);

  useEffect(() => {
    localStorage.setItem("userId", userId || "");
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("userName", JSON.stringify(userName));
  }, [userName]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const data = decodeJwt(token);
    if (!data) return;
// console.log(".........data in decoded token", data)
    if (!userId && data.id) setUserId(String(data.id));

    const fromTokenRole =
      (data.role_code && String(data.role_code).toUpperCase()) ||
      (data.role_name && String(data.role_name).toUpperCase());

    if (fromTokenRole && fromTokenRole !== role) setRole(fromTokenRole);

    const fn =
      data.first_name || data.firstname || data.given_name || data.firstName || "";
    const ln =
      data.last_name || data.lastname || data.family_name || data.lastName || "";

    if ((fn || ln) && (!userName.first_name && !userName.last_name)) {
      setUserName({ first_name: String(fn), last_name: String(ln) });
    }
  }, []);

  const clearAuth = () => {
    setRole("");
    setUserId("");
    setUserName({ first_name: "", last_name: "" });
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken");
  };

  const value = useMemo(
    () => ({ role, setRole, userId, setUserId, userName, setUserName, clearAuth }),
    [role, userId, userName]
  );

  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
