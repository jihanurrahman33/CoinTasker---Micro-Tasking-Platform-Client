import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { IoIosNotifications } from "react-icons/io";
import {
  FaHome,
  FaUsers,
  FaTasks,
  FaMoneyBillWave,
  FaHistory,
  FaPlusCircle,
  FaList,
  FaCoins,
  FaSignOutAlt,
} from "react-icons/fa";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import Footer from "../components/shared/Footer/Footer";
import AvailableCoin from "../components/shared/Buttons/AvailableCoin";
import Logo from "../components/shared/Logo/Logo";

const DashboardLayout = () => {
  const { role, roleLoading } = useRole();
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut().then(() => {
      navigate("/");
    });
  };

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Define navigation items based on role
  const getNavItems = () => {
    let items = [];

    if (role === "worker") {
      items = [
        { to: "/dashboard", icon: FaHome, label: "Home" },
        { to: "/dashboard/task-list", icon: FaList, label: "Task List" },
        {
          to: "/dashboard/my-submissions",
          icon: FaTasks,
          label: "My Submissions",
        },
        {
          to: "/dashboard/withdrawals",
          icon: FaMoneyBillWave,
          label: "Withdrawals",
        },
      ];
    } else if (role === "buyer") {
      items = [
        { to: "/dashboard", icon: FaHome, label: "Home" },
        {
          to: "/dashboard/add-task",
          icon: FaPlusCircle,
          label: "Add New Tasks",
        },
        { to: "/dashboard/my-tasks", icon: FaTasks, label: "My Tasks" },
        {
          to: "/dashboard/purchase-coin",
          icon: FaCoins,
          label: "Purchase Coin",
        },
        {
          to: "/dashboard/payment-history",
          icon: FaHistory,
          label: "Payment History",
        },
      ];
    } else if (role === "admin") {
      items = [
        { to: "/dashboard/admin-home", icon: FaHome, label: "Home" },
        { to: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
        { to: "/dashboard/manage-tasks", icon: FaTasks, label: "Manage Tasks" },
      ];
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 flex justify-between items-center w-full">
            <Logo />
            <div className="flex items-center gap-4">
              {/* Available Coin - Only for Buyer/Worker */}
              {(role === "worker" || role === "buyer") && <AvailableCoin />}

              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{user?.displayName}</p>
                  <p className="text-xs opacity-60 capitalize">{role}</p>
                </div>
                <div className="avatar">
                  <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                    <img src={user?.photoURL} alt="profile" />
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-circle">
                <IoIosNotifications className="size-6" />
              </button>
            </div>
          </div>
        </nav>
        {/* Page content here */}
        <div className="p-4 flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible z-50">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 transition-all duration-300">
          {/* Sidebar content here */}
          <ul className="menu w-full grow gap-1 p-2">
            {/* Dynamic Role Links */}
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center p-2 rounded-btn ${
                      isActive ? "bg-primary text-white" : "hover:bg-base-300"
                    }`
                  }
                  data-tip={item.label}
                >
                  <item.icon className="my-1.5 inline-block size-4" />
                  <span className="is-drawer-close:hidden ml-3 font-medium">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}

            <div className="divider my-1"></div>

            {/* Common Links */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center p-2 rounded-btn ${
                    isActive ? "bg-primary text-white" : "hover:bg-base-300"
                  }`
                }
                data-tip="Home"
              >
                <FaHome className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden ml-3 font-medium">
                  Home
                </span>
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogOut}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center p-2 rounded-btn text-error hover:bg-error/10 w-full text-left"
                data-tip="Logout"
              >
                <FaSignOutAlt className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden ml-3 font-medium">
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
