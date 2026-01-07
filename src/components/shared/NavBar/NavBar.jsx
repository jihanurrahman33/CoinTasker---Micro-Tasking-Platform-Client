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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="transition-transform hover:scale-105 duration-300">
            <Logo />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost text-slate-600 hover:text-primary hover:bg-primary/10 font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary-gradient text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  Register
                </Link>
                <a
                  href="https://github.com/jihanurrahman33"
                  target="_blank"
                  className="btn btn-outline border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600"
                >
                  <FaGithub className="size-4" /> Join as Developer
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn-ghost gap-2 text-slate-600 hover:text-primary hover:bg-primary/10 font-medium"
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
                    className="btn btn-ghost btn-circle avatar border border-slate-200 hover:border-primary/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 rounded-full">
                      <img src={user?.photoURL} alt={user?.displayName} />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white/95 backdrop-blur-xl rounded-2xl w-64 border border-slate-100"
                  >
                    <li className="menu-title px-4 py-3 bg-slate-50 rounded-t-xl -mx-2 -mt-2 mb-2 border-b border-slate-100">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-secondary">
                          {user?.displayName}
                        </span>
                        <span className="text-xs font-normal opacity-70 text-slate-500">
                          {user?.email}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="badge badge-primary badge-outline text-xs capitalize bg-primary/5">
                            {role}
                          </span>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link to="/dashboard" className="py-3 font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg active:bg-primary/10">
                        <MdDashboard className="size-4" /> Dashboard
                      </Link>
                    </li>
                    <div className="divider my-1 border-slate-100"></div>
                    <li>
                      <button
                        onClick={logOut}
                        className="py-3 text-red-500 hover:bg-red-50 hover:text-red-600 font-medium rounded-lg"
                      >
                        <FaSignOutAlt className="size-4" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Developer Link Icon Only for Desktop */}
                <a
                  href="https://github.com/jihanurrahman33"
                  target="_blank"
                  className="btn btn-square btn-ghost text-slate-400 hover:text-secondary transition-colors"
                  title="Developer"
                >
                  <FaGithub className="size-5" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="btn btn-ghost md:hidden text-slate-600"
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
          <div className="md:hidden border-t border-slate-100 py-4 animate-fade-in bg-white/95 backdrop-blur-lg px-2 space-y-3 shadow-lg rounded-b-2xl absolute left-0 right-0 top-16">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost w-full justify-start text-lg text-slate-600 hover:text-primary hover:bg-primary/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary w-full text-lg shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <a
                  href="https://github.com/Programming-Hero-Web-Course4/b10a12-client-side-nishak53"
                  target="_blank"
                  className="btn btn-outline border-slate-200 text-slate-600 w-full justify-start gap-2"
                >
                  <FaGithub /> Join as Developer
                </a>
              </>
            ) : (
              <>
                {/* User Info Mobile */}
                <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl shadow-sm mx-1">
                  <div className="avatar">
                    <div className="w-12 rounded-full border-2 border-primary/20 p-0.5 bg-white">
                      <img src={user?.photoURL} />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-secondary">{user?.displayName}</p>
                    <p className="text-sm text-slate-500 capitalize">{role}</p>
                  </div>
                </div>

                {/* Coin Badge Mobile */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 mx-1 shadow-sm">
                  <span className="text-amber-800 font-medium">
                    Available Balance
                  </span>
                  <div className="flex items-center gap-2">
                    <FaCoins className="text-amber-500 size-5" />
                    <span className="font-bold text-xl text-amber-900">
                      {coins}
                    </span>
                  </div>
                </div>

                <div className="divider my-1 before:bg-slate-100 after:bg-slate-100"></div>

                <Link
                  to="/dashboard"
                  className="btn btn-ghost w-full justify-start gap-3 text-lg font-normal text-slate-600 hover:text-primary hover:bg-primary/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MdDashboard className="size-5" /> Dashboard
                </Link>
                <button
                  onClick={logOut}
                  className="btn btn-ghost w-full justify-start gap-3 text-red-500 text-lg font-normal hover:bg-red-50"
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
