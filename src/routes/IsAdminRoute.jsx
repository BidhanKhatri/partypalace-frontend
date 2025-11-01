import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const IsAdminRoute = () => {
  const { role } = useSelector((state) => state?.user);
  return role === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default IsAdminRoute;
