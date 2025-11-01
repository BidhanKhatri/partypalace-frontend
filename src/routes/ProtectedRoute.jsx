import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state?.user?.user);
  return user ? <Outlet /> : <LoginPage />;
};

export default ProtectedRoute;
