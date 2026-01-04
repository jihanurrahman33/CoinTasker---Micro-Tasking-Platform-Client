import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading/Loading";
import { useNavigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return <Loading />;
  }
  if (!user) {
    navigate("/login");
  }
  return children;
};

export default PrivateRoute;
