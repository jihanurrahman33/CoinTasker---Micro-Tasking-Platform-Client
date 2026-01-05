import React from "react";
import { FaBitcoin } from "react-icons/fa";

const AvailableCoin = ({ amount }) => {
  return (
    <div className="p-2 rounded-full bg-secondary text-white">
      <button className="flex items-center  justify-between gap-2">
        <FaBitcoin />
        {amount}
      </button>
    </div>
  );
};

export default AvailableCoin;
