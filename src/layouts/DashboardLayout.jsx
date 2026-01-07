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
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Define navigation items based on role
  const getNavItems = () => {
    let items = [];

    if (role === "worker") {
      items = [
        { to: "/dashboard", icon: FaHome, label: "Dashboard" },
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
        { to: "/dashboard", icon: FaHome, label: "Dashboard" },
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
        { to: "/dashboard", icon: FaHome, label: "Dashboard" },
        { to: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
        { to: "/dashboard/manage-tasks", icon: FaTasks, label: "Manage Tasks" },
      ];
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="drawer lg:drawer-open bg-slate-50 font-sans">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Page Content */}
      <div className="drawer-content flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
                <label
                    htmlFor="my-drawer-2"
                    className="btn btn-square btn-ghost lg:hidden text-slate-600 hover:bg-slate-100"
                >
                    <FaBars className="size-5" />
                </label>
                <div className="lg:hidden">
                     <Logo />
                </div>
                {/* Greeting - Desktop */}
                <div className="hidden md:block">
                     <h2 className="text-lg font-semibold text-slate-800">
                        Welcome back, <span className="text-primary">{user?.displayName?.split(" ")[0]}</span>!
                        <span className="ml-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
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
              <button className="btn btn-ghost btn-circle btn-sm text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors relative">
                <IoIosNotifications className="size-6" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error border border-white"></span>
              </button>

              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-transparent hover:ring-primary/20 transition-all">
                  <div className="w-9 rounded-full">
                    <img alt="User Profile" src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"} />
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white/95 backdrop-blur-md rounded-xl w-60 border border-slate-100">
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                     <p className="font-semibold text-slate-800 truncate">{user?.displayName}</p>
                     <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  
                  {/* Mobile Coin View */}
                  <li className="sm:hidden mb-2">
                     {(role === "worker" || role === "buyer") && <AvailableCoin />}
                  </li>

                  <li>
                    <Link to="/dashboard/profile" className="py-2.5 hover:bg-slate-50 hover:text-primary rounded-lg text-slate-600 font-medium">
                       <FaUserCircle className="size-4" /> Profile
                    </Link>
                  </li>
                   <li>
                    <Link to="/dashboard/settings" className="py-2.5 hover:bg-slate-50 hover:text-primary rounded-lg text-slate-600 font-medium">
                       <FaCog className="size-4" /> Settings
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={handleLogOut} className="py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg font-medium">
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
        <aside className="bg-secondary text-white min-h-screen w-72 flex flex-col transition-all duration-300 shadow-2xl relative overflow-hidden">
           
           {/* Decorative Glow */}
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[200px] h-[200px] bg-primary/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-accent/10 rounded-full blur-[80px]" />
           </div>

           {/* Sidebar Header */}
           <div className="h-16 flex items-center px-6 border-b border-slate-700/50 bg-secondary/50 backdrop-blur-sm sticky top-0 z-20">
              <Logo className="text-white" />
           </div>

           {/* Sidebar Menu */}
           <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar z-10">
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
                                ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary/20 font-medium" 
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                             }`
                          }
                       >
                          <item.icon className={`size-5 transition-transform group-hover:scale-110`} />
                          <span className="text-sm tracking-wide">{item.label}</span>
                       </NavLink>
                    </li>
                 ))}

                 <div className="my-4 border-t border-slate-700/50 mx-2"></div>

                 {/* Common Links */}
                 <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                               isActive 
                               ? "bg-gradient-to-r from-primary to-emerald-600 text-white font-medium" 
                               : "text-slate-400 hover:bg-white/5 hover:text-white"
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
           <div className="p-4 border-t border-slate-700/50 bg-secondary/50 backdrop-blur-sm z-10">
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
