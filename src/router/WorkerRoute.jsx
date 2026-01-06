import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading/Loading";

const WorkerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  if (loading) {
    return <Loading />;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  const {
    data: currentUser,
    isLoading,
  } = useQuery({
    queryKey: ["user", user.email],
    enabled: !!user.email, 
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }
  if (currentUser?.role !== "worker") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default WorkerRoute;
