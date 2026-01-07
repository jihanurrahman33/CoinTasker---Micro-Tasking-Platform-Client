import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaTrashAlt,
  FaTasks,
  FaCoins,
  FaSearch,
  FaClipboardList,
  FaUsers,
  FaMoneyBillWave,
  FaSpinner,
  FaUserTie
} from "react-icons/fa";

const ManageTasks = () => {
  const axiosSecure = useAxiosSecure();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks");
      return res.data;
    },
  });

  const handleDeleteTask = (task) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete task!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            const res = await axiosSecure.delete(`/tasks/${task._id}`);
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire("Deleted!", "Task has been removed.", "success");
            }
        } catch (error) {
            console.error("Failed to delete task", error);
             Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete task.',
            });
        }
      }
    });
  };

  const filteredTasks = tasks.filter((task) =>
      task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.buyer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalTasks: tasks.length,
    totalSpots: tasks.reduce((sum, task) => sum + parseInt(task.required_workers || 0), 0),
    totalBudget: tasks.reduce((sum, task) => sum + (parseInt(task.payable_amount || 0) * parseInt(task.required_workers || 0)), 0),
  };

  if (isLoading) {
      return (
          <div className="flex justify-center items-center h-screen bg-slate-50">
              <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-secondary">
            Manage Tasks
          </h1>
          <p className="text-slate-500 text-lg">Oversee all tasks posted on the platform</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Tasks */}
            <div className="card glass-panel p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                 <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-primary to-emerald-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-primary to-emerald-600 p-3 shadow-lg shadow-primary/20 w-fit">
                         <FaTasks className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-500">Total Tasks</p>
                         <p className="text-3xl font-bold text-secondary">{stats.totalTasks}</p>
                     </div>
                 </div>
            </div>

            {/* Total Work Spots */}
             <div className="card glass-panel p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                 <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-emerald-500 to-green-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-3 shadow-lg shadow-emerald-200 w-fit">
                         <FaUsers className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-500">Total Work Spots</p>
                         <p className="text-3xl font-bold text-emerald-600">{stats.totalSpots}</p>
                     </div>
                 </div>
            </div>

            {/* Total Platform Budget */}
             <div className="card glass-panel p-6 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
                 <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-accent to-amber-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-accent to-amber-600 p-3 shadow-lg shadow-accent/20 w-fit">
                         <FaMoneyBillWave className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-500">Total Value (Coins)</p>
                         <p className="text-3xl font-bold text-accent">{stats.totalBudget}</p>
                     </div>
                 </div>
            </div>
        </div>

        {/* Tasks Table Card */}
        <div className="card glass-panel overflow-hidden animate-fade-in-up">
            {/* Table Header Controls */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                             <FaClipboardList className="text-primary"/> All Tasks
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Review and manage posted tasks</p>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-3">
                         {/* Search */}
                         <div className="relative">
                             <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                             <input 
                                type="text" 
                                placeholder="Search tasks or buyers..." 
                                className="input input-bordered pl-10 w-full sm:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl h-11"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                             />
                         </div>
                     </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Task Info</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Buyer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pay / Task</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => (
                                <tr key={task._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 h-10 rounded-lg ring-1 ring-slate-200">
                                                    <img src={task.task_image_url || "https://i.ibb.co/5GzXkwq/user.png"} alt={task.task_title} />
                                                </div>
                                            </div>
                                            <div className="max-w-xs">
                                                <div className="font-semibold text-slate-900 line-clamp-1">{task.task_title}</div>
                                                <div className="text-xs text-slate-500 line-clamp-1">{task.submission_info}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                         <div>
                                            <p className="text-sm font-medium text-slate-900">{task.buyer_name}</p>
                                            <p className="text-xs text-slate-500">{task.buyer_email}</p>
                                         </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                            <FaUserTie className="text-primary" />
                                            <span className="font-medium text-slate-900">{task.required_workers}</span>
                                            <span className="text-xs">spots</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-700 bg-amber-50 w-fit px-2 py-1 rounded-md border border-amber-100">
                                            <FaCoins className="text-amber-500" /> {task.payable_amount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteTask(task)}
                                            className="btn btn-ghost btn-sm text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg group-hover:opacity-100 transition-all"
                                            title="Delete Task"
                                        >
                                            <FaTrashAlt className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                         <div className="bg-slate-100 p-4 rounded-full">
                                            <FaTasks className="w-8 h-8 text-slate-300" />
                                         </div>
                                         <p className="text-lg font-medium">No tasks found</p>
                                         <p className="text-sm">No tasks match your search.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Summary */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex justify-between items-center">
                 <span>Showing {filteredTasks.length} tasks</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTasks;
