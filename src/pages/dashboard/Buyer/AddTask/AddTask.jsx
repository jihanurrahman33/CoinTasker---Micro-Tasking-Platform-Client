import React from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddTask = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Fetch User Coin Balance
  const { data: coinBalance = 0, refetch } = useQuery({
    queryKey: ["coinBalance", user?.email],
    queryFn: async () => {
      if (user?.email) {
        const res = await axiosSecure.get(`/users/${user.email}/coin`);
        return res.data.coin;
      }
      return 0;
    },
    enabled: !!user?.email,
  });

  const required_workers = watch("required_workers", 0);
  const payable_amount = watch("payable_amount", 0);
  const total_payable_amount = required_workers * payable_amount;

  const onSubmit = async (data) => {
    // 1. Check Coin Balance
    if (total_payable_amount > coinBalance) {
      Swal.fire({
        icon: "error",
        title: "Not enough coins",
        text: "You do not have enough coins to fund this task. Please purchase more coins.",
        confirmButtonText: "Purchase Coin",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/dashboard/purchase-coin");
        }
      });
      return;
    }

    // 2. Upload Image to ImageBB
    const formData = new FormData();
    formData.append("image", data.task_image_url[0]);

    try {
      const res = await axios.post(image_hosting_api, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const taskItem = {
          task_title: data.task_title,
          task_detail: data.task_detail,
          required_workers: parseInt(data.required_workers),
          payable_amount: parseInt(data.payable_amount),
          total_payable_amount: total_payable_amount,
          completion_date: data.completion_date,
          submission_info: data.submission_info,
          task_image_url: res.data.data.display_url,
          buyer_name: user?.displayName,
          buyer_email: user?.email,
        };

        // 3. Save Task to Collection & Deduct Coins
        // Note: In a real backend, these should be a single transaction
        const taskRes = await axiosSecure.post("/tasks", taskItem);

        if (taskRes.data.insertedId) {
          // Determine Success (Assuming backend handles coin deduction or we do it here)
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Task Added Successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
          // Refetch to update coin balance in UI
          refetch();
          navigate("/dashboard/my-tasks");
        }
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while adding the task.",
      });
    }
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Add New Task</h2>
      <div className="card bg-base-100 w-full shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          {/* Task Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Task Title</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Watch my YouTube video and make a comment"
              className="input input-bordered"
              {...register("task_title", { required: true })}
            />
            {errors.task_title && (
              <span className="text-red-500 text-sm">Title is required</span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Required Workers */}
            <div className="form-control hover:shadow-sm w-full">
              <label className="label">
                <span className="label-text">Required Workers</span>
              </label>
              <input
                type="number"
                placeholder="Total workers needed"
                className="input input-bordered"
                {...register("required_workers", { required: true, min: 1 })}
              />
              {errors.required_workers && (
                <span className="text-red-500 text-sm">
                  Required workers must be at least 1
                </span>
              )}
            </div>

            {/* Payable Amount */}
            <div className="form-control hover:shadow-sm w-full">
              <label className="label">
                <span className="label-text">Payable Amount (per worker)</span>
              </label>
              <input
                type="number"
                placeholder="Amount to pay each worker"
                className="input input-bordered"
                {...register("payable_amount", { required: true, min: 1 })}
              />
              {errors.payable_amount && (
                <span className="text-red-500 text-sm">
                  Amount must be greater than 0
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Completion Date */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Completion Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                {...register("completion_date", { required: true })}
              />
              {errors.completion_date && (
                <span className="text-red-500 text-sm">Date is required</span>
              )}
            </div>
            {/* Task Image */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Task Image</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                {...register("task_image_url", { required: true })}
              />
              {errors.task_image_url && (
                <span className="text-red-500 text-sm">Image is required</span>
              )}
            </div>
          </div>

          {/* Task Detail */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Task Detail</span>
            </label>
            <textarea
              placeholder="Detailed description of the task"
              className="textarea textarea-bordered textarea-md h-24"
              {...register("task_detail", { required: true })}
            ></textarea>
            {errors.task_detail && (
              <span className="text-red-500 text-sm">Detail is required</span>
            )}
          </div>

          {/* Submission Info */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Submission Info</span>
            </label>
            <textarea
              placeholder="What to submit, e.g., screenshot / proof"
              className="textarea textarea-bordered textarea-sm h-16"
              {...register("submission_info", { required: true })}
            ></textarea>
            {errors.submission_info && (
              <span className="text-red-500 text-sm">
                Submission info is required
              </span>
            )}
          </div>

          {/* Total Payable Info */}
          <div className="alert alert-info my-4">
            <span>Total Payable Amount: {total_payable_amount || 0} coins</span>
          </div>

          <div className="form-control mt-6">
            <button className="btn btn-primary">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
