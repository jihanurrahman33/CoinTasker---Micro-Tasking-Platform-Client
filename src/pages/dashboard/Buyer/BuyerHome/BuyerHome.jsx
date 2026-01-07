import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  FaFileAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaSpinner,
  FaTimes
} from "react-icons/fa";

const BuyerHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Buyer Stats
  const { data: stats = { totalTasks: 0, pendingTasks: 0, totalPaymentPaid: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ["buyerStats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/buyer/stats?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch Pending Submissions
  const { data: submissions = [], isLoading: submissionsLoading, refetch } = useQuery({
    queryKey: ["buyerPendingSubmissions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/buyer-pending?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;
    setIsProcessing(true);

    try {
      const res = await axiosSecure.patch(`/submissions/approve/${selectedSubmission._id}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: "Submission approved and worker credited.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // Refresh list
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not approve submission.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;
    setIsProcessing(true);

    try {
      const res = await axiosSecure.patch(`/submissions/reject/${selectedSubmission._id}`, {
          taskId: selectedSubmission.task_id // Need task_id to increment worker count
      });
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "info",
          title: "Rejected",
          text: "Submission rejected.",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch(); // Refresh list
        handleCloseModal();
      }
    } catch (error) {
        console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not reject submission.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (statsLoading || submissionsLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-secondary">
            Buyer Dashboard
          </h1>
          <p className="text-slate-500 text-lg">Manage your tasks and review worker submissions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Total Tasks */}
          <div className="card glass-panel p-6 hover:shadow-xl transition-shadow group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-slate-100">
             <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-primary/10 to-emerald-500/10 opacity-50" />
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-primary to-emerald-600 rounded-xl shadow-lg text-white">
                    <FaFileAlt size={24} />
                </div>
             </div>
             <div>
                <p className="text-sm font-medium text-slate-500">Total Tasks Posted</p>
                <p className="text-3xl font-bold text-secondary group-hover:text-primary transition-colors">{stats.totalTasks}</p>
             </div>
          </div>

          {/* Pending Workers */}
          <div className="card glass-panel p-6 hover:shadow-xl transition-shadow group relative overflow-hidden bg-gradient-to-br from-white to-amber-50 border-amber-100">
             <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-amber-500/10 to-orange-600/10 opacity-50" />
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg text-white">
                    <FaUsers size={24} />
                </div>
                <FaClock className="text-amber-500/50" size={24}/>
             </div>
             <div>
                <p className="text-sm font-medium text-amber-700/70">Pending Workers</p>
                <p className="text-3xl font-bold text-amber-700">{stats.pendingTasks}</p>
             </div>
          </div>

          {/* Total Payments */}
          <div className="card glass-panel p-6 hover:shadow-xl transition-shadow group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 border-blue-100">
             <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-blue-500/10 to-cyan-600/10 opacity-50" />
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg text-white">
                    <FaDollarSign size={24} />
                </div>
             </div>
             <div>
                <p className="text-sm font-medium text-blue-700/70">Total Payments</p>
                <p className="text-3xl font-bold text-blue-700">{stats.totalPaymentPaid} <span className="text-sm font-normal text-blue-400">coins</span></p>
             </div>
          </div>
        </div>

        {/* Task to Review Section */}
        <div className="card glass-panel overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-secondary">Tasks to Review</h2>
                <p className="text-sm text-slate-500 mt-1">
                 Pending submissions requiring approval
                </p>
            </div>
             {submissions.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {submissions.length} Pending
                </span>
             )}
          </div>

          <div className="p-0">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-slate-50 p-6 rounded-full mb-4 border border-slate-100 shadow-sm">
                    <FaCheckCircle className="text-5xl text-emerald-300" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-2">All caught up!</h3>
                <p className="text-slate-500 max-w-sm">No pending submissions to review at the moment. Great job submitting tasks!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                      <th className="px-6 py-4">Worker</th>
                      <th className="px-6 py-4">Task Title</th>
                      <th className="px-6 py-4">Payable Amount</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                                    {submission.worker_name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary">{submission.worker_name}</p>
                                    <p className="text-xs text-slate-500">{submission.worker_email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                             <p className="font-medium text-slate-700 group-hover:text-primary transition-colors">{submission.task_title}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                <FaDollarSign className="text-[10px]" /> {submission.payable_amount}
                            </span>
                        </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <FaCalendarAlt className="text-slate-300"/>
                                {new Date(submission.current_date).toLocaleDateString()}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button
                             type="button"
                             onClick={() => {
                                 console.log("View Submission Clicked", submission);
                                 handleViewSubmission(submission);
                             }}
                             className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
                           >
                              <FaEye className="mr-1.5 h-3 w-3" /> View
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

        {isModalOpen && selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}>
            <div 
                className="card glass-panel w-full max-w-lg overflow-hidden transform transition-all scale-100 opacity-100 shadow-2xl ring-1 ring-slate-900/5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                     <div>
                        <h3 className="text-xl font-bold font-heading text-secondary">
                            Submission Details
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Review the work submitted by the worker.</p>
                     </div>
                     <button 
                        type="button" 
                        onClick={handleCloseModal} 
                        className="btn btn-circle btn-sm btn-ghost text-slate-400 hover:text-secondary"
                     >
                        <FaTimes />
                     </button>
                  </div>

                  <div className="space-y-5">
                     {/* Worker */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                            {selectedSubmission.worker_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-secondary truncate">{selectedSubmission.worker_name}</p>
                            <p className="text-sm text-slate-500 truncate">{selectedSubmission.worker_email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg border border-slate-100 bg-white">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Task Title</p>
                            <p className="text-sm font-semibold text-secondary mt-1 line-clamp-2">{selectedSubmission.task_title}</p>
                        </div>
                        <div className="p-3 rounded-lg border border-amber-100 bg-amber-50/50">
                            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Payable Amount</p>
                            <p className="text-lg font-bold text-amber-700 mt-0.5">{selectedSubmission.payable_amount} <span className="text-xs font-normal text-amber-600">Coins</span></p>
                        </div>
                    </div>

                    <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Submission Proof</p>
                         <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-mono">
                            {selectedSubmission.submission_details}
                         </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleApprove}
                    className="btn btn-primary-gradient border-none text-white shadow-lg shadow-primary/20 flex-1"
                  >
                    {isProcessing ? <FaSpinner className="animate-spin"/> : <FaCheckCircle />} Approve Submission
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleReject}
                    className="btn bg-red-50 text-red-600 hover:bg-red-100 border-red-200 hover:border-red-300 flex-1"
                  >
                     {isProcessing ? <FaSpinner className="animate-spin"/> : <FaTimesCircle />} Reject
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleCloseModal}
                    className="btn btn-ghost text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
          </div>
        )}
    </div>
  );
};

export default BuyerHome;
