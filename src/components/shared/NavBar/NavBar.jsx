import React, { useState } from "react";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Logo from "../Logo/Logo";
import {
  FaCoins,
  FaGithub,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import AvailableCoin from "../Buttons/AvailableCoin";

const NavBar = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch Coin Balance
  const { data: coins = 0 } = useQuery({
    queryKey: ["coinBalance", user?.email],
    queryFn: async () => {
      if (!user?.email) return 0;
      const res = await axiosSecure.get(`/users/${user.email}/coin`);
      return res.data.coin;
    },
    enabled: !!user?.email,
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-base-200 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/60 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="transition-opacity hover:opacity-80">
            <Logo />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost text-base-content hover:text-primary"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-white">
                  Register
                </Link>
                <a
                  href="https://github.com/jihanurrahman33"
                  target="_blank"
                  className="btn btn-outline border-base-300 hover:bg-base-200"
                >
                  <FaGithub className="size-4" /> Join as Developer
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-ghost gap-2 text-base-content hover:text-primary"
                >
                  <MdDashboard className="size-4" /> Dashboard
                </Link>

                {/* Coin Badge */}
                <AvailableCoin />

                {/* User Dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar border border-base-200 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 rounded-full">
                      <img src={user?.photoURL} alt={user?.displayName} />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-64 border border-base-200"
                  >
                    <li className="menu-title px-4 py-3 bg-base-200/50 rounded-t-box -mx-2 -mt-2 mb-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-base-content">
                          {user?.displayName}
                        </span>
                        <span className="text-xs font-normal opacity-70 text-base-content">
                          {user?.email}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="badge badge-primary badge-outline text-xs capitalize">
                            {role}
                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link to="/dashboard" className="py-3 font-medium">
                        <MdDashboard className="size-4" /> Dashboard
                      </Link>
                    </li>
                    <div className="divider my-1"></div>
                    <li>
                      <button
                        onClick={logOut}
                        className="py-3 text-error hover:bg-error/10 font-medium"
                      >
                        <FaSignOutAlt className="size-4" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Developer Link Icon Only for Desktop to save space if needed, or keep full */}
                <a
                  href="https://github.com/jihanurrahman33"
                  target="_blank"
                  className="btn btn-square btn-ghost text-base-content/70 hover:text-base-content"
                  title="Developer"
                >
                  <FaGithub className="size-5" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="btn btn-ghost md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FaTimes className="size-6" />
            ) : (
              <FaBars className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-base-200 py-4 animate-fade-in bg-base-100 px-2 space-y-3 shadow-inner">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost w-full justify-start text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary w-full text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <a
                  href="https://github.com/Programming-Hero-Web-Course4/b10a12-client-side-nishak53"
                  target="_blank"
                  className="btn btn-outline w-full justify-start gap-2"
                >
                  <FaGithub /> Join as Developer
                </a>
              </>
            ) : (
              <>
                {/* User Info Mobile */}
                <div className="flex items-center gap-3 px-4 py-4 bg-base-100 border border-base-200 rounded-xl shadow-sm">
                  <div className="avatar">
                    <div className="w-12 rounded-full border-2 border-primary/20">
                      <img src={user?.photoURL} />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{user?.displayName}</p>
                    <p className="text-sm opacity-70 capitalize">{role}</p>
                  </div>
                </div>

                {/* Coin Badge Mobile */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 mx-1">
                  <span className="text-amber-900 font-medium">
                    Available Balance
                  </span>
                  <div className="flex items-center gap-2">
                    <FaCoins className="text-amber-600 size-5" />
                    <span className="font-bold text-xl text-amber-900">
                      {coins}
                    </span>
                  </div>
                </div>

                <div className="divider my-1"></div>

                <Link
                  to="/dashboard"
                  className="btn btn-ghost w-full justify-start gap-3 text-lg font-normal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MdDashboard className="size-5" /> Dashboard
                </Link>
                <button
                  onClick={logOut}
                  className="btn btn-ghost w-full justify-start gap-3 text-error text-lg font-normal hover:bg-error/10"
                >
                  <FaSignOutAlt className="size-5" /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
export default NavBar;
