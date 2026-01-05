import React, { use } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import AvailableCoin from "../Buttons/AvailableCoin";

const NavBar = () => {
  const { user, logOut } = use(AuthContext);

  const links = (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      {user && (
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      )}
    </>
  );
  return (
    <header>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">App Name</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end">
          {user ? (
            <div className="space-x-4 flex items-center">
              <AvailableCoin />
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={user?.photoURL} />
                </div>
              </div>
              <button onClick={logOut} className="btn">
                Log Out
              </button>
              <Link to="/join" className="btn">
                Join as a Developer
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
