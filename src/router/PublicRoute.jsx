import React from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import Loading from "../components/shared/Loading/Loading";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return <Loading />;
  }
  if (user) {
    return navigate("/");
  }
  return children;
};

export default PublicRoute;
