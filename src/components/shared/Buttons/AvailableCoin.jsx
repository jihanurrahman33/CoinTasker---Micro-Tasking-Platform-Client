import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaBitcoin } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AvailableCoin = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: coinBalance = 0 } = useQuery({
    queryKey: ["coinBalance", user?.email],
    queryFn: async () => {
      if (user?.email) {
        const res = await axiosSecure.get(`/users/${user.email}/coin`);

        return res.data.coin;
      }
      return null;
    },
    enabled: !!user?.email,
  });
  return (
    <div className="p-2 rounded-full bg-secondary text-white">
      <button className="flex items-center  justify-between gap-2">
        <FaBitcoin />
        {coinBalance}
      </button>
    </div>
  );
};

export default AvailableCoin;
