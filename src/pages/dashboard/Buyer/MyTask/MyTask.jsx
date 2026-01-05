import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const MyTask = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedTask, setSelectedTask] = useState(null);
  
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
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
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
    document.getElementById("update_modal").showModal();
  };

  const handleUpdate = async (data) => {
     try {
        const res = await axiosSecure.patch(`/tasks/${selectedTask._id}`, {
            task_title: data.task_title,
            task_detail: data.task_detail,
            submission_info: data.submission_info
        });

        if(res.data.modifiedCount > 0){
             Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task Updated Successfully",
                showConfirmButton: false,
                timer: 1500
              });
              refetch();
              document.getElementById("update_modal").close();
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
    <div className="w-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">My Tasks</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table table-zebra bg-base-100">
          {/* head */}
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th>#</th>
              <th>Task Title</th>
              <th>Detail</th>
              <th>Workers Needed</th>
              <th>Amount</th>
              <th>Deadline</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.length === 0 ? (
                <tr>
                    <td colSpan="7" className="text-center py-4">No tasks found. Add a task using the "Add New Tasks" menu.</td>
                </tr>
            ) : sortedTasks.map((task, index) => (
              <tr key={task._id}>
                <th>{index + 1}</th>
                <td>{task.task_title}</td>
                <td>
                    <div className="tooltip" data-tip={task.task_detail}>
                        {task.task_detail.slice(0, 30)}...
                    </div>
                </td>
                <td>{task.required_workers}</td>
                <td>{task.payable_amount}</td>
                <td>{task.completion_date}</td>
                <td>
                  <div className="flex justify-center gap-2">
                    <button 
                        onClick={() => openUpdateModal(task)}
                        className="btn btn-sm btn-ghost text-info"
                        title="Update"
                    >
                      <FaEdit className="size-5" />
                    </button>
                    <button 
                        onClick={() => handleDelete(task._id)}
                        className="btn btn-sm btn-ghost text-error"
                        title="Delete"
                    >
                      <FaTrashAlt className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {/* Update Modal */}
        <dialog id="update_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Update Task</h3>
                <form onSubmit={handleSubmit(handleUpdate)}>
                    <div className="form-control w-full mb-3">
                        <label className="label">
                            <span className="label-text">Task Title</span>
                        </label>
                        <input 
                            type="text" 
                            className="input input-bordered w-full" 
                            {...register("task_title", {required: true})}
                        />
                         {errors.task_title && <span className="text-error text-xs">Required</span>}
                    </div>
                    <div className="form-control w-full mb-3">
                        <label className="label">
                            <span className="label-text">Task Detail</span>
                        </label>
                        <textarea 
                            className="textarea textarea-bordered w-full"
                             {...register("task_detail", {required: true})}
                        ></textarea>
                         {errors.task_detail && <span className="text-error text-xs">Required</span>}
                    </div>
                    <div className="form-control w-full mb-4">
                        <label className="label">
                            <span className="label-text">Submission Info</span>
                        </label>
                         <textarea 
                            className="textarea textarea-bordered w-full"
                             {...register("submission_info", {required: true})}
                        ></textarea>
                         {errors.submission_info && <span className="text-error text-xs">Required</span>}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button type="button" className="btn" onClick={()=>document.getElementById("update_modal").close()}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                 <button>close</button>
            </form>
        </dialog>

    </div>
  );
};

export default MyTask;
