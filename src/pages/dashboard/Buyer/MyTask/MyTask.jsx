import React, { useState } from "react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrashAlt, FaClipboardList, FaUsers, FaDollarSign, FaCalendarAlt, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const MyTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch Tasks
  const { data: tasks = [], refetch } = useQuery({
    queryKey: ["my-tasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Sort tasks by completion_date descending (simple string comparison works for ISO dates, or new Date)
  const sortedTasks = [...tasks].sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date));

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this! Coins will be refunded for uncompleted tasks.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            const res = await axiosSecure.delete(`/tasks/${id}`);
            if (res.data.deletedCount > 0) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your task has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
              
                 queryClient.invalidateQueries({
                queryKey: ["coinBalance", user?.email],
              }); 
                refetch();
            }
        } catch (error) {
             Swal.fire({
                title: "Error!",
                text: "Failed to delete task.",
                icon: "error",
            });
        }
      }
    });
  };

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    setValue("task_title", task.task_title);
    setValue("task_detail", task.task_detail);
    setValue("submission_info", task.submission_info);
    setIsModalOpen(true);
  };

  const closeUpdateModal = () => {
      setIsModalOpen(false);
      setSelectedTask(null);
  }

  const handleUpdate = async (data) => {
     try {
        const res = await axiosSecure.patch(`/tasks/${selectedTask._id}`, {
            task_title: data.task_title,
            task_detail: data.task_detail,
            submission_info: data.submission_info
        });

        if(res.data.modifiedCount > 0){
             Swal.fire({
                position: "center",
                icon: "success",
                title: "Task Updated Successfully",
                showConfirmButton: false,
                timer: 1500
              });
              refetch();
              closeUpdateModal();
        }
     } catch (error) {
         Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "Could not update task.",
        });
     }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
          
        {/* Header */}
        <div className="space-y-2 animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-secondary">
            My Tasks
          </h1>
          <p className="text-slate-500 text-lg">Manage and monitor your posted tasks</p>
        </div>

        <div className="card glass-panel overflow-hidden animate-fade-in-up">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                        <FaClipboardList className="text-primary"/> Task List
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                     You have posted <span className="font-bold text-secondary">{sortedTasks.length}</span> tasks
                    </p>
                </div>
            </div>

            <div className="p-0">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                    {/* head */}
                    <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <tr>
                        <th className="px-6 py-4">#</th>
                        <th className="px-6 py-4">Task Title</th>
                        <th className="px-6 py-4">Workers Needed</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Deadline</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedTasks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <FaClipboardList className="text-4xl mb-2 opacity-50" />
                                        <p className="text-lg font-medium text-secondary">No tasks found</p>
                                        <p className="text-sm">Create a new task to get started.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : sortedTasks.map((task, index) => (
                        <tr key={task._id} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-400">{index + 1}</td>
                            <td className="px-6 py-4">
                                <div className="space-y-1">
                                    <p className="font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">{task.task_title}</p>
                                    <div className="tooltip tooltip-bottom text-left" data-tip={task.task_detail}>
                                        <p className="text-xs text-slate-500 line-clamp-1 cursor-help border-b border-dotted border-slate-300 inline-block">{task.task_detail}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <FaUsers className="text-slate-400"/> {task.required_workers}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                    <FaDollarSign className="text-[10px]" /> {task.payable_amount}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <FaCalendarAlt className="text-slate-300"/>
                                    {new Date(task.completion_date).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button 
                                        onClick={() => openUpdateModal(task)}
                                        className="btn btn-sm btn-square btn-ghost text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                        title="Update"
                                    >
                                    <FaEdit className="size-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(task._id)}
                                        className="btn btn-sm btn-square btn-ghost text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                    <FaTrashAlt className="size-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Update Modal */}
         {isModalOpen && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={closeUpdateModal}>
            <div 
                className="card glass-panel w-full max-w-lg overflow-hidden transform transition-all scale-100 opacity-100 shadow-2xl ring-1 ring-slate-900/5 bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold font-heading text-secondary">Update Task</h3>
                    <button onClick={closeUpdateModal} className="btn btn-circle btn-sm btn-ghost text-slate-400 hover:text-secondary">
                        <FaTimes />
                    </button>
                </div>
                
                <div className="p-6">
                    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                        <div className="form-control w-full space-y-2">
                            <label className="label-text text-sm font-semibold text-secondary">
                                Task Title <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                className={`input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white ${errors.task_title ? "input-error bg-red-50" : "border-slate-300"}`} 
                                {...register("task_title", {required: "Task title is required"})}
                            />
                             {errors.task_title && <span className="text-red-500 text-xs mt-1">{errors.task_title.message}</span>}
                        </div>
                        <div className="form-control w-full space-y-2">
                            <label className="label-text text-sm font-semibold text-secondary">
                                Task Detail <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                rows={4}
                                className={`textarea textarea-bordered w-full rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white resize-none ${errors.task_detail ? "textarea-error bg-red-50" : "border-slate-300"}`}
                                 {...register("task_detail", {required: "Task detail is required"})}
                            ></textarea>
                             {errors.task_detail && <span className="text-red-500 text-xs mt-1">{errors.task_detail.message}</span>}
                        </div>
                        <div className="form-control w-full space-y-2">
                            <label className="label-text text-sm font-semibold text-secondary">
                                Submission Info <span className="text-red-500">*</span>
                            </label>
                             <textarea 
                                rows={2}
                                className={`textarea textarea-bordered w-full rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white resize-none ${errors.submission_info ? "textarea-error bg-red-50" : "border-slate-300"}`}
                                 {...register("submission_info", {required: "Submission info is required"})}
                            ></textarea>
                             {errors.submission_info && <span className="text-red-500 text-xs mt-1">{errors.submission_info.message}</span>}
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" className="btn btn-ghost text-slate-500 hover:bg-slate-100" onClick={closeUpdateModal}>Cancel</button>
                            <button type="submit" className="btn btn-primary-gradient text-white shadow-lg shadow-primary/20 border-none">Update Task</button>
                        </div>
                    </form>
                </div>
            </div>
          </div>
         )}
      </div>
    </div>
  );
};

export default MyTask;
