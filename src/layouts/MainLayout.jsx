import React from "react";
import NavBar from "../components/shared/NavBar/NavBar";
import { Outlet } from "react-router";
import Footer from "../components/shared/Footer/Footer";

const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
