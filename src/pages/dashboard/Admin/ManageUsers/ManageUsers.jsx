import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaTrashAlt,
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaCoins,
  FaSearch,
  FaUserCog,
  FaUsers,
  FaUserTie,
  FaShoppingBag,
  FaSpinner
} from "react-icons/fa";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;

    try {
        const res = await axiosSecure.patch(`/users/role/${user._id}`, { role: newRole });
        if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
                position: "center",
                icon: "success",
                title: `${user.name} is now a ${newRole}`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    } catch (error) {
        console.error("Failed to update role", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while updating the role!',
        });
    }
  };

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            const res = await axiosSecure.delete(`/users/${user._id}`);
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire("Deleted!", "User has been removed.", "success");
            }
        } catch (error) {
            console.error("Failed to delete user", error);
             Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete user.',
            });
        }
      }
    });
  };

  const filteredUsers = users.filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    totalWorkers: users.filter((u) => u.role === "worker").length,
    totalBuyers: users.filter((u) => u.role === "buyer").length,
    totalAdmins: users.filter((u) => u.role === "admin").length,
  };

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-screen bg-indigo-50/30">
              <FaSpinner className="animate-spin text-4xl text-indigo-600" />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Manage Users
          </h1>
          <p className="text-gray-500 text-lg">Control user roles and manage platform access</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-lg shadow-indigo-200 w-fit">
                         <FaUsers className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Total Users</p>
                         <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
                     </div>
                 </div>
            </div>

            {/* Workers */}
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-green-500 to-green-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg shadow-green-200 w-fit">
                         <FaUserTie className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Workers</p>
                         <p className="text-3xl font-bold text-green-600">{stats.totalWorkers}</p>
                     </div>
                 </div>
            </div>

            {/* Buyers */}
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg shadow-blue-200 w-fit">
                         <FaShoppingBag className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Buyers</p>
                         <p className="text-3xl font-bold text-blue-600">{stats.totalBuyers}</p>
                     </div>
                 </div>
            </div>

            {/* Admins */}
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-red-500 to-red-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-3 shadow-lg shadow-red-200 w-fit">
                         <FaUserShield className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Admins</p>
                         <p className="text-3xl font-bold text-red-600">{stats.totalAdmins}</p>
                     </div>
                 </div>
            </div>
        </div>

        {/* Users Table Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-50 overflow-hidden animate-fade-in-up">
            {/* Table Header Controls */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <h2 className="text-xl font-bold text-indigo-950 flex items-center gap-2">
                             <FaUserCog className="text-indigo-600"/> All Users
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-3">
                         {/* Search */}
                         <div className="relative">
                             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                             <input 
                                type="text" 
                                placeholder="Search users..." 
                                className="input input-bordered pl-10 w-full sm:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-xl h-11"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                             />
                         </div>
                         {/* Filter */}
                         <select 
                            className="select select-bordered bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl h-11 font-medium text-gray-600"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                         >
                             <option value="all">All Roles</option>
                             <option value="worker">Workers</option>
                             <option value="buyer">Buyers</option>
                             <option value="admin">Admins</option>
                         </select>
                     </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Coins</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Update Role</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-indigo-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 h-10 rounded-full ring-2 ring-indigo-100 ring-offset-2">
                                                    <img src={user.photo || "https://i.ibb.co/5GzXkwq/user.png"} alt={user.name} />
                                                </div>
                                            </div>
                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-gray-300" /> {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                                            user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
                                            user.role === 'buyer' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            'bg-green-50 text-green-700 border-green-200'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-bold text-gray-700">
                                            <FaCoins className="text-yellow-500" /> {user.coin || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            value={user.role}
                                            className="select select-sm select-bordered w-full max-w-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                                        >
                                            <option value="worker">Worker</option>
                                            <option value="buyer">Buyer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user)}
                                            className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg group-hover:opacity-100 transition-all"
                                            title="Delete User"
                                        >
                                            <FaTrashAlt className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                         <div className="bg-gray-100 p-4 rounded-full">
                                            <FaUser className="w-8 h-8 text-gray-300" />
                                         </div>
                                         <p className="text-lg font-medium">No users found</p>
                                         <p className="text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Summary */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 text-xs text-gray-500 flex justify-between items-center">
                 <span>Showing {filteredUsers.length} users</span>
                 <span>Manage roles carefully, as they affect user permissions immediately.</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
