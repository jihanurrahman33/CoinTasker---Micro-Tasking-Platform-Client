import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { 
  FaCoins, 
  FaCloudUploadAlt, 
  FaTimes, 
  FaExclamationCircle, 
  FaCalendarAlt, 
  FaSpinner, 
  FaCheckCircle 
} from "react-icons/fa";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddTask = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const required_workers = watch("required_workers", "");
  const payable_amount = watch("payable_amount", "");
  const total_payable_amount = (Number(required_workers) || 0) * (Number(payable_amount) || 0);
  const hasInsufficientFunds = total_payable_amount > coinBalance;

  // Image Upload Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) return;
    setValue("task_image_url", [file]); // Manually set react-hook-form value
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const removeImage = () => {
      setImagePreview(null);
      setValue("task_image_url", null);
  }

  const onSubmit = async (data) => {
    if (hasInsufficientFunds) return;

    setIsSubmitting(true);

    // 1. Upload Image to ImageBB
    const formData = new FormData();
    // Assuming data.task_image_url is a FileList or array of files from manual set
    const imageFile = data.task_image_url[0]; 
    
    if(!imageFile) {
        setIsSubmitting(false);
        Swal.fire({ icon: "error", title: "Image Required", text: "Please upload a task thumbnail." });
        return;
    }

    formData.append("image", imageFile);

    try {
      const res = await axios.post(image_hosting_api, formData, {
        headers: { "content-type": "multipart/form-data" },
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
          created_at: new Date().toISOString(),
        };

        // 2. Save Task to Collection
        const taskRes = await axiosSecure.post("/tasks", taskItem);

        if (taskRes.data.insertedId) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Task created successfully! 🎉",
            showConfirmButton: false,
            timer: 2000,
          });
          refetch();
          navigate("/dashboard/my-tasks");
        }
      }
    } catch (error) {
      console.error("Error creating task:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-base-100 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-base-content mb-2">Create New Task</h1>
          <p className="text-base-content/60 text-lg">Post a task and hire workers instantly</p>
        </div>

        {/* Main Form Card */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Task Title */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold">
                  Task Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Watch my YouTube video and leave a comment"
                  className={`input input-bordered w-full h-12 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${errors.task_title ? "input-error" : ""}`}
                  {...register("task_title", { required: "Task title is required" })}
                />
                {errors.task_title && <p className="text-sm text-error mt-1">{errors.task_title.message}</p>}
              </div>

              {/* Task Detail */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold">
                  Task Detail <span className="text-error">*</span>
                </label>
                <textarea
                  placeholder="Explain the task step-by-step…"
                  rows={5}
                  className={`textarea textarea-bordered w-full text-base rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none ${errors.task_detail ? "textarea-error" : ""}`}
                  {...register("task_detail", { required: "Task detail is required" })}
                ></textarea>
                {errors.task_detail && <p className="text-sm text-error mt-1">{errors.task_detail.message}</p>}
              </div>

              {/* Required Workers & Payable Amount - Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-control w-full space-y-2">
                  <label className="label-text text-base font-semibold">
                    Required Workers <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className={`input input-bordered w-full h-12 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${errors.required_workers ? "input-error" : ""}`}
                    {...register("required_workers", { required: "Required workers must be greater than 0", min: { value: 1, message: "Min 1 worker" } })}
                  />
                  {errors.required_workers && <p className="text-sm text-error mt-1">{errors.required_workers.message}</p>}
                </div>

                <div className="form-control w-full space-y-2">
                  <label className="label-text text-base font-semibold">
                    Payable Amount (per worker) <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warning pointer-events-none">
                        <FaCoins className="size-5" />
                    </div>
                    <input
                      type="number"
                      placeholder="10"
                      className={`input input-bordered w-full h-12 pl-10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${errors.payable_amount ? "input-error" : ""}`}
                      {...register("payable_amount", { required: "Payable amount must be greater than 0", min: { value: 1, message: "Min 1 coin" } })}
                    />
                  </div>
                  {errors.payable_amount && <p className="text-sm text-error mt-1">{errors.payable_amount.message}</p>}
                </div>
              </div>

              {/* Deadline */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold">
                  Completion Deadline <span className="text-error">*</span>
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
                        <FaCalendarAlt className="size-5" />
                    </div>
                    <input
                        type="date"
                        className={`input input-bordered w-full h-12 pl-10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${errors.completion_date ? "input-error" : ""}`}
                        {...register("completion_date", { required: "Deadline is required" })}
                    />
                </div>
                {errors.completion_date && <p className="text-sm text-error mt-1">{errors.completion_date.message}</p>}
              </div>

              {/* Submission Information */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold">
                  Submission Information <span className="text-error">*</span>
                </label>
                <textarea
                  placeholder="Upload screenshot / link / proof"
                  rows={3}
                  className={`textarea textarea-bordered w-full text-base rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none ${errors.submission_info ? "textarea-error" : ""}`}
                  {...register("submission_info", { required: "Submission info is required" })}
                ></textarea>
                {errors.submission_info && <p className="text-sm text-error mt-1">{errors.submission_info.message}</p>}
              </div>

              {/* Image Upload */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold">
                  Task Image Upload
                </label>

                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-base-300 hover:border-indigo-400 hover:bg-base-200"
                    }`}
                  >
                    <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                        <FaCloudUploadAlt className="mx-auto size-12 text-base-content/40 mb-3" />
                        <p className="text-base text-base-content/70 mb-2">
                        Drag and drop your image here, or{" "}
                        <span className="text-indigo-600 font-medium hover:underline">browse</span>
                        </p>
                        <p className="text-sm text-base-content/50">Upload task image (ImageBB supported)</p>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border-2 border-base-300 w-full h-64 bg-base-200">
                    <img
                      src={imagePreview}
                      alt="Task preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-base-100 rounded-full shadow-lg hover:bg-base-200 transition-colors z-10"
                    >
                      <FaTimes className="size-4 text-base-content" />
                    </button>
                  </div>
                )}
              </div>

              {/* Live Calculation Card */}
              <div className="card bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
                <div className="card-body p-5 space-y-3">
                    <h3 className="text-lg font-semibold text-indigo-900 border-b border-indigo-200 pb-2">Cost Calculation</h3>
                    
                    <div className="flex justify-between items-center text-base">
                        <span className="text-base-content/70">Required Workers</span>
                        <span className="font-semibold text-base-content">{required_workers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                        <span className="text-base-content/70">Payable Amount (per worker)</span>
                        <span className="font-semibold text-base-content flex items-center gap-1">
                            <FaCoins className="size-4 text-warning" />
                            {payable_amount || 0}
                        </span>
                    </div>
                    
                    <div className="divider my-1"></div>

                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-indigo-900">Total Payable Coins</span>
                        <span className="font-bold text-2xl text-indigo-600 flex items-center gap-1">
                             <FaCoins className="size-6 text-warning" />
                             {total_payable_amount}
                        </span>
                    </div>

                    {/* Available Coins Badge */}
                    <div className={`mt-2 p-3 rounded-lg flex justify-between items-center ${hasInsufficientFunds ? "bg-error/10 text-error" : "bg-success/10 text-success-content"}`}>
                         <span className="text-sm font-medium">Available Coins</span>
                         <span className="text-base font-bold flex items-center gap-1">
                            <FaCoins className="size-4" />
                            {coinBalance}
                         </span>
                    </div>
                </div>
              </div>

              {/* Insufficient Funds Alert */}
              {hasInsufficientFunds && total_payable_amount > 0 && (
                 <div role="alert" className="alert alert-error bg-error/10 border-error/20 text-error-content">
                    <FaExclamationCircle className="size-5" />
                    <div className="ml-2">
                        <h3 className="font-bold">Insufficient Balance</h3>
                        <div className="text-xs">You need {total_payable_amount - coinBalance} more coins to publish this.</div>
                    </div>
                     <button type="button" onClick={() => navigate("/dashboard/purchase-coin")} className="btn btn-sm btn-error text-white">Purchase Coin</button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || hasInsufficientFunds}
                className="btn btn-primary w-full h-14 text-lg font-semibold rounded-xl"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Creating Task...
                  </>
                ) : (
                  "Add Task"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
