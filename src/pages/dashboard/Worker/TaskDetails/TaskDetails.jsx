import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import {
  FaCalendarAlt,
  FaCoins,
  FaUsers,
  FaUser,
  FaChevronLeft,
  FaPaperPlane,
  FaImage,
  FaInfoCircle,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaSpinner
} from "react-icons/fa";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: task = {}, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm();

  const submissionDetailsValue = watch("submission_details", "");

  const onSubmit = async (data) => {
    const submissionData = {
      task_id: task._id,
      task_title: task.task_title,
      payable_amount: task.payable_amount,
      worker_email: user.email,
      worker_name: user.displayName,
      buyer_name: task.buyer_name,
      buyer_email: task.buyer_email,
      submission_details: data.submission_details,
      current_date: new Date().toISOString(),
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/submissions", submissionData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Submission Successful",
          text: "Your work has been submitted for review!",
          confirmButtonColor: "#4f46e5", // Indigo-600
        });
        reset();
        navigate("/dashboard/my-submissions");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  const getDaysRemaining = (completionDate) => {
    if (!completionDate) return 0;
    const days = Math.ceil(
      (new Date(completionDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const daysRemaining = getDaysRemaining(task.completion_date);
  const isUrgent = daysRemaining <= 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 font-sans">
      <div className="container mx-auto max-w-6xl">
        
        {/* Back Button */}
        <div className={`mb-6 transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
          <Link
            to="/dashboard/task-list"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors"
          >
            <FaChevronLeft className="h-4 w-4" />
            Back to Task List
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Task Header Card */}
            <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-700 delay-100 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
              {/* Task Image */}
              <div className="relative h-64 bg-gradient-to-br from-indigo-100 to-purple-100">
                {task.task_image_url ? (
                   <img
                   src={task.task_image_url}
                   alt={task.task_title}
                   className="w-full h-full object-cover"
                 />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-300">
                        <FaImage size={64} opacity={0.5}/>
                    </div>
                )}
               
                <div className="absolute top-4 right-4 flex gap-2">
                  {isUrgent && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Urgent
                    </span>
                  )}
                  {task.payable_amount >= 20 && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      High Pay
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.task_title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-6">
                  <FaUser className="h-4 w-4" />
                  <span>Posted by <span className="font-semibold text-gray-700">{task.buyer_name}</span></span>
                </div>

                <div className="space-y-8">
                  {/* Payment Info */}
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                            <FaCoins className="h-6 w-6 text-amber-600"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">You will earn</p>
                            <p className="text-3xl font-bold text-amber-900">{task.payable_amount} <span className="text-lg font-normal text-gray-600">coins</span></p>
                        </div>
                     </div>
                     <FaCheckCircle className="h-12 w-12 text-amber-600 opacity-20 hidden sm:block" />
                  </div>

                  {/* Task Description */}
                  <div>
                     <div className="flex items-center gap-2 mb-3">
                        <FaInfoCircle className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-xl font-bold text-gray-900">Task Description</h3>
                     </div>
                     <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-line">
                        {task.task_detail}
                     </div>
                  </div>

                  {/* Submission Requirements */}
                  <div>
                     <div className="flex items-center gap-2 mb-3">
                        <FaImage className="h-5 w-5 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-900">Submission Requirements</h3>
                     </div>
                     <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{task.submission_info}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Form Card */}
            <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transition-all duration-700 delay-200 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
               <div className="flex items-center gap-3 mb-2">
                 <FaPaperPlane className="h-5 w-5 text-indigo-600" />
                 <h2 className="text-2xl font-bold text-gray-900">Submit Your Work</h2>
               </div>
               <p className="text-gray-500 mb-8 ml-8">Provide details about your completed work. Be specific and include all necessary information.</p>
               
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 <div>
                    <label htmlFor="submission_details" className="block text-sm font-semibold text-gray-700 mb-2">
                        Submission Details *
                    </label>
                    <textarea
                        id="submission_details"
                        rows="8"
                        className={`w-full px-5 py-4 rounded-xl border transition-all bg-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none ${errors.submission_details ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}`}
                        placeholder="Describe your work and provide proof (e.g., screenshot URLs, links, etc.)..."
                        {...register("submission_details", { 
                            required: "Submission details are required",
                            minLength: {
                                value: 20,
                                message: "Please provide more detailed submission information (minimum 20 characters)"
                            }
                        })}
                    ></textarea>
                    {errors.submission_details && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <FaExclamationCircle className="h-4 w-4" />
                            {errors.submission_details.message}
                        </p>
                    )}
                    <p className="text-sm text-gray-400 mt-2 text-right">Minimum 20 characters. Current: {submissionDetailsValue?.length || 0}</p>
                 </div>

                 {/* Important Notice */}
                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-4">
                    <FaInfoCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Important Notes</h4>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Your submission will be reviewed by the task buyer.</li>
                            <li>Provide clear proof (links/text) of your completed work.</li>
                            <li>Incomplete or fraudulent submissions will be rejected.</li>
                        </ul>
                    </div>
                 </div>

                 <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {isSubmitting ? (
                        <>
                           <FaSpinner className="animate-spin" /> Submitting...
                        </>
                    ) : (
                        <>
                           <FaPaperPlane /> Submit Work for Review
                        </>
                    )}
                 </button>
               </form>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats Card */}
            <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 p-6 transition-all duration-700 delay-300 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Task Information</h3>
                
                <div className="space-y-5">
                    {/* Deadline */}
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                             <FaCalendarAlt size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Completion Date</p>
                            <p className={`font-bold ${isUrgent ? 'text-red-600' : 'text-gray-900'}`}>
                                {new Date(task.completion_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric'})}
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-xs">
                                <FaClock className={isUrgent ? "text-red-500" : "text-gray-400"} />
                                <span className={isUrgent ? "text-red-600 font-medium" : "text-gray-500"}>
                                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Deadline passed"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Positions */}
                    <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                             <FaUsers size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Positions Available</p>
                            <p className="text-xl font-bold text-gray-900">{task.required_workers}</p>
                            <p className="text-xs text-gray-500">workers needed</p>
                        </div>
                    </div>

                    {/* Payment Sidebar */}
                    <div className="flex gap-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 text-amber-600 shadow-sm">
                             <FaCoins size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-0.5">Payment per Task</p>
                            <p className="text-xl font-bold text-amber-900">{task.payable_amount}</p>
                        </div>
                    </div>

                    {/* Buyer Info */}
                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">Task Creator</p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {task.buyer_name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">{task.buyer_name}</p>
                                <p className="text-xs text-gray-500">{task.buyer_email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Help Card */}
            <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-6 transition-all duration-700 delay-400 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                 <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <FaExclamationCircle /> Need Help?
                 </h3>
                 <p className="text-sm text-indigo-800 mb-3">If you have questions about this task:</p>
                 <ul className="text-sm text-indigo-700 space-y-2 list-disc list-inside">
                    <li>Read the task description carefully.</li>
                    <li>Check the submission requirements.</li>
                    <li>Contact the buyer if unclear.</li>
                 </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
