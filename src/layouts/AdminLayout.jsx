import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../adminPages/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex grow ">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
