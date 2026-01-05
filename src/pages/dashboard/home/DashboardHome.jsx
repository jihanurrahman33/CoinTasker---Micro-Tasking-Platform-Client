import React from "react";
import useRole from "../../../hooks/useRole";
import Loading from "../../../components/shared/Loading/Loading";
import AdminHome from "../Admin/AdminHome/AdminHome";
import BuyerHome from "../Buyer/BuyerHome/BuyerHome";
import WorkerHome from "../Worker/WorkerHome/WorkerHome";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();
  if (roleLoading) {
    return <Loading />;
  }
  if (role === "admin") {
    return <AdminHome />;
  }
  if (role === "buyer") {
    return <BuyerHome />;
  }
  if (role === "worker") {
    return <WorkerHome />;
  }
};

export default DashboardHome;
