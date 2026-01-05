import React from "react";
import { Link } from "react-router";
import logoImg from "../../../assets/logo.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img
        src={logoImg}
        alt="CoinTasker Logo"
        className="w-24 h-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
