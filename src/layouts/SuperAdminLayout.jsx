import React from "react";
import { Outlet } from "react-router-dom";
import SuperAdminNavbar from "../superAdminPages/SuperAdminNavbar";

const SuperAdminLayout = () => {
  return (
    <div className="flex">
      <SuperAdminNavbar />

      <div className="flex grow ">
        <Outlet />
      </div>
    </div>
  );
};

export default SuperAdminLayout;
