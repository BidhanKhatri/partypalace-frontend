import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const IsSuperAdminRoute = () => {
  const { role } = useSelector((state) => state?.user);
  return role === "superadmin" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default IsSuperAdminRoute;
