import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { socket } from "../../socket";
import SmoothScroll from "../utils/SmoothScroll";

const Layout = () => {
  socket.connect();
  socket.on("connect", () => {
    console.log("socket connected");
  });

  // logic to scroll to top while navigating different routes
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {/* <SmoothScroll> */}
      <Navbar />

      <Outlet />

      <Footer />
      {/* </SmoothScroll> */}
    </>
  );
};

export default Layout;
