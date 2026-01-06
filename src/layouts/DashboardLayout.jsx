import React from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router";
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
  FaBars,
  FaUserCircle,
  FaCog
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <span className="loading loading-spinner loading-lg text-indigo-600"></span>
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
        { to: "/dashboard", icon: FaHome, label: "Home" },
        { to: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
        { to: "/dashboard/manage-tasks", icon: FaTasks, label: "Manage Tasks" },
      ];
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="drawer lg:drawer-open bg-gray-50 font-sans">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Page Content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <label
                    htmlFor="my-drawer-2"
                    className="btn btn-square btn-ghost lg:hidden text-gray-600 hover:bg-gray-100"
                >
                    <FaBars className="size-5" />
                </label>
                <div className="lg:hidden">
                     <Logo />
                </div>
                {/* Greeting - Desktop */}
                <div className="hidden md:block">
                     <h2 className="text-lg font-semibold text-gray-800">
                        Welcome back, <span className="text-indigo-600">{user?.displayName?.split(" ")[0]}</span>!
                        <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 capitalize">
                            {role}
                        </span>
                     </h2>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Available Coin */}
              {(role === "worker" || role === "buyer") && (
                  <div className="hidden sm:block">
                      <AvailableCoin />
                  </div>
              )}

              {/* Notifications */}
              <button className="btn btn-ghost btn-circle btn-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors relative">
                <IoIosNotifications className="size-6" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
              </button>

              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-indigo-100 transition-all">
                  <div className="w-9 rounded-full">
                    <img alt="User Profile" src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-xl w-60 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                     <p className="font-semibold text-gray-800 truncate">{user?.displayName}</p>
                     <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  {/* Mobile Coin View */}
                  <li className="sm:hidden mb-2">
                     {(role === "worker" || role === "buyer") && <AvailableCoin />}
                  </li>

                  <li>
                    <Link to="/dashboard/profile" className="py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-gray-600">
                       <FaUserCircle className="size-4" /> Profile
                    </Link>
                  </li>
                   <li>
                    <Link to="/dashboard/settings" className="py-2.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-gray-600">
                       <FaCog className="size-4" /> Settings
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={handleLogOut} className="py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg">
                       <FaSignOutAlt className="size-4" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-x-hidden">
             <div className="mx-auto max-w-7xl animate-fade-in-up">
                 <Outlet />
             </div>
        </main>

        <Footer />
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="bg-slate-900 text-white min-h-screen w-72 flex flex-col transition-all duration-300 shadow-2xl">
           {/* Sidebar Header */}
           <div className="h-16 flex items-center px-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-20">
              <Logo className="text-white" />
           </div>

           {/* Sidebar Menu */}
           <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
              <ul className="space-y-1.5">
                 {/* Role Specific Links */}
                 {navItems.map((item, index) => (
                    <li key={index}>
                       <NavLink
                          to={item.to}
                          end={item.to === "/dashboard"}
                          className={({ isActive }) =>
                             `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                                isActive 
                                ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/20 font-medium" 
                                : "text-slate-400 hover:bg-white/5 hover:text-indigo-300"
                             }`
                          }
                       >
                          <item.icon className="size-5 transition-transform group-hover:scale-110" />
                          <span className="text-sm tracking-wide">{item.label}</span>
                       </NavLink>
                    </li>
                 ))}

                 <div className="my-4 border-t border-slate-800/60 mx-2"></div>

                 {/* Common Links */}
                 <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                               isActive 
                               ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white" 
                               : "text-slate-400 hover:bg-white/5 hover:text-indigo-300"
                            }`
                         }
                    >
                        <FaHome className="size-5 transition-transform group-hover:scale-110" />
                        <span className="text-sm tracking-wide">Home</span>
                    </NavLink>
                 </li>
              </ul>
           </div>

           {/* Sidebar Footer */}
           <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
               <button 
                  onClick={handleLogOut}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
               >
                   <FaSignOutAlt className="size-5 transition-transform group-hover:-translate-x-1" />
                   <span className="text-sm font-medium">Logout</span>
               </button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
