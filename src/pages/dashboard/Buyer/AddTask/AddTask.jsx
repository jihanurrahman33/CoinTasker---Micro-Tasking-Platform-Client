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
  FaCheckCircle, 
  FaUsers
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-down">
          <h1 className="text-4xl font-bold font-heading text-secondary mb-2">Create New Task</h1>
          <p className="text-slate-500 text-lg">Post a task and hire workers instantly</p>
        </div>

        {/* Main Form Card */}
        <div className="card glass-panel shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="card-body p-8 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Task Title */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold text-secondary">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Watch my YouTube video and leave a comment"
                  className={`input input-bordered w-full h-12 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white/50 ${errors.task_title ? "input-error bg-red-50" : "border-slate-300"}`}
                  {...register("task_title", { required: "Task title is required" })}
                />
                {errors.task_title && <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><FaExclamationCircle/> {errors.task_title.message}</p>}
              </div>

              {/* Task Detail */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold text-secondary">
                  Task Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Explain the task step-by-step…"
                  rows={5}
                  className={`textarea textarea-bordered w-full text-base rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none bg-white/50 ${errors.task_detail ? "textarea-error bg-red-50" : "border-slate-300"}`}
                  {...register("task_detail", { required: "Task detail is required" })}
                ></textarea>
                {errors.task_detail && <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><FaExclamationCircle/> {errors.task_detail.message}</p>}
              </div>

              {/* Required Workers & Payable Amount - Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-control w-full space-y-2">
                  <label className="label-text text-base font-semibold text-secondary">
                    Required Workers <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                      <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="number"
                        placeholder="100"
                        className={`input input-bordered w-full h-12 pl-10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white/50 ${errors.required_workers ? "input-error bg-red-50" : "border-slate-300"}`}
                        {...register("required_workers", { required: "Required workers must be greater than 0", min: { value: 1, message: "Min 1 worker" } })}
                      />
                  </div>
                  {errors.required_workers && <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><FaExclamationCircle/> {errors.required_workers.message}</p>}
                </div>

                <div className="form-control w-full space-y-2">
                  <label className="label-text text-base font-semibold text-secondary">
                    Payable Amount (per worker) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                        <FaCoins className="size-4" />
                    </div>
                    <input
                      type="number"
                      placeholder="10"
                      className={`input input-bordered w-full h-12 pl-10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white/50 ${errors.payable_amount ? "input-error bg-red-50" : "border-slate-300"}`}
                      {...register("payable_amount", { required: "Payable amount must be greater than 0", min: { value: 1, message: "Min 1 coin" } })}
                    />
                  </div>
                  {errors.payable_amount && <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><FaExclamationCircle/> {errors.payable_amount.message}</p>}
                </div>
              </div>

              {/* Deadline */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold text-secondary">
                  Completion Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                        <FaCalendarAlt className="size-4" />
                    </div>
                    <input
                        type="date"
                        className={`input input-bordered w-full h-12 pl-10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white/50 ${errors.completion_date ? "input-error bg-red-50" : "border-slate-300"}`}
                        {...register("completion_date", { required: "Deadline is required" })}
                    />
                </div>
                {errors.completion_date && <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><FaExclamationCircle/> {errors.completion_date.message}</p>}
              </div>

              {/* Submission Information */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold text-secondary">
                  Submission Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Upload screenshot / link / proof"
                  rows={3}
                  className={`textarea textarea-bordered w-full text-base rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none bg-white/50 ${errors.submission_info ? "textarea-error bg-red-50" : "border-slate-300"}`}
                  {...register("submission_info", { required: "Submission info is required" })}
                ></textarea>
                {errors.submission_info && <p className="text-sm text-red-500 mt-1 flex items-center gap-1"><FaExclamationCircle/> {errors.submission_info.message}</p>}
              </div>

              {/* Image Upload */}
              <div className="form-control w-full space-y-2">
                <label className="label-text text-base font-semibold text-secondary">
                  Task Image Upload
                </label>

                {!imagePreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-slate-50/50 ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-slate-300 hover:border-primary hover:bg-slate-50"
                    }`}
                  >
                    <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                        <FaCloudUploadAlt className="mx-auto size-12 text-slate-300 mb-3" />
                        <p className="text-base text-slate-600 mb-2">
                        Drag and drop your image here, or{" "}
                        <span className="text-primary font-bold hover:underline">browse</span>
                        </p>
                        <p className="text-sm text-slate-400">Upload task image (ImageBB supported)</p>
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
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 w-full h-64 bg-slate-100 shadow-sm">
                    <img
                      src={imagePreview}
                      alt="Task preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-red-500 transition-colors z-10"
                    >
                      <FaTimes className="size-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Live Calculation Card */}
              <div className="card glass-panel bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-lg">
                <div className="card-body p-6 space-y-4">
                    <h3 className="text-lg font-bold text-secondary border-b border-slate-100 pb-3">Cost Calculation</h3>
                    
                    <div className="flex justify-between items-center text-base">
                        <span className="text-slate-500">Required Workers</span>
                        <span className="font-semibold text-secondary">{required_workers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-base">
                        <span className="text-slate-500">Payable Amount (per worker)</span>
                        <span className="font-semibold text-secondary flex items-center gap-1">
                            <FaCoins className="size-4 text-amber-500" />
                            {payable_amount || 0}
                        </span>
                    </div>
                    
                    <div className="divider my-0"></div>

                    <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-secondary">Total Payable Coins</span>
                        <span className="font-bold text-2xl text-primary flex items-center gap-1">
                             <FaCoins className="size-6 text-amber-500" />
                             {total_payable_amount}
                        </span>
                    </div>

                    {/* Available Coins Badge */}
                    <div className={`mt-2 p-4 rounded-xl flex justify-between items-center border ${hasInsufficientFunds ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"}`}>
                         <span className="text-sm font-bold">Available Coins</span>
                         <span className="text-base font-bold flex items-center gap-2">
                            <div className={`p-1 rounded-full ${hasInsufficientFunds ? "bg-red-100" : "bg-emerald-100"}`}>
                                <FaCoins className="size-3" />
                            </div>
                            {coinBalance}
                         </span>
                    </div>
                </div>
              </div>

              {/* Insufficient Funds Alert */}
              {hasInsufficientFunds && total_payable_amount > 0 && (
                 <div role="alert" className="alert alert-error bg-red-50 border border-red-200 text-red-800 shadow-sm">
                    <FaExclamationCircle className="size-5 text-red-500" />
                    <div className="ml-2">
                        <h3 className="font-bold">Insufficient Balance</h3>
                        <div className="text-xs text-red-600">You need <span className="font-bold">{total_payable_amount - coinBalance} more coins</span> to publish this task.</div>
                    </div>
                     <button type="button" onClick={() => navigate("/dashboard/purchase-coin")} className="btn btn-sm bg-red-600 border-none text-white hover:bg-red-700">Purchase Coin</button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || hasInsufficientFunds}
                className="btn btn-primary-gradient w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 transition-all text-white border-none disabled:opacity-70 disabled:cursor-not-allowed"
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
