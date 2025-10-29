import React from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

// Usage: <RoleRoute allow={["LENDER"]}><LenderPage/></RoleRoute>
export default function RoleRoute({ allow, children, redirect = "/dashboard" }) {
  const { role } = useRole();
  if (!allow.includes(role)) return <Navigate to={redirect} replace />;
  return children;
}
