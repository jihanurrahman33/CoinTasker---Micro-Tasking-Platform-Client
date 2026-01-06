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
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Buyer Dashboard
          </h1>
          <p className="text-gray-500 text-lg">Manage your tasks and review worker submissions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Total Tasks */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 hover:shadow-xl transition-shadow group relative overflow-hidden">
             <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-5" />
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md text-white">
                    <FaFileAlt size={24} />
                </div>
             </div>
             <div>
                <p className="text-sm font-medium text-gray-500">Total Tasks Posted</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalTasks}</p>
             </div>
          </div>

          {/* Pending Workers */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-50 hover:shadow-xl transition-shadow group relative overflow-hidden">
             <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-purple-500 to-purple-600 opacity-5" />
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md text-white">
                    <FaUsers size={24} />
                </div>
                <FaClock className="text-amber-500" size={20}/>
             </div>
             <div>
                <p className="text-sm font-medium text-gray-500">Pending Workers</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pendingTasks}</p>
             </div>
          </div>

          {/* Total Payments */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-50 hover:shadow-xl transition-shadow group relative overflow-hidden">
             <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-green-500 to-green-600 opacity-5" />
             <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md text-white">
                    <FaDollarSign size={24} />
                </div>
             </div>
             <div>
                <p className="text-sm font-medium text-gray-500">Total Payments</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalPaymentPaid} <span className="text-sm font-normal text-gray-400">coins</span></p>
             </div>
          </div>
        </div>

        {/* Task to Review Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 overflow-hidden">
          <div className="p-6 border-b border-indigo-50 bg-indigo-50/30">
            <h2 className="text-2xl font-bold text-indigo-900">Tasks to Review</h2>
            <p className="text-sm text-indigo-600 flex items-center gap-2 mt-1">
               <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
               {submissions.length} pending submissions require your attention
            </p>
          </div>

          <div className="p-6">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <FaCheckCircle className="text-4xl text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-500">No pending submissions to review at the moment</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Worker</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Task Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payable Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="group hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {submission.worker_name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{submission.worker_name}</p>
                                    <p className="text-xs text-gray-500">{submission.worker_email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                             <p className="font-medium text-gray-700">{submission.task_title}</p>
                        </td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {submission.payable_amount} coins
                            </span>
                        </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaCalendarAlt className="text-gray-400"/>
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
                             className="inline-flex items-center px-3 py-1.5 border border-indigo-200 text-xs font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none transition-colors"
                           >
                              <FaEye className="mr-1.5 h-3 w-3" /> View Submission
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}>
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all scale-100 opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-start justify-between mb-4">
                     <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Submission Details
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Review the work submitted by the worker.</p>
                     </div>
                     <button 
                        type="button" 
                        onClick={handleCloseModal} 
                        className="text-gray-400 hover:text-gray-500 transition-colors bg-transparent p-2 rounded-full hover:bg-gray-100"
                     >
                        <FaTimes size={20} />
                     </button>
                  </div>

                  <div className="space-y-4">
                     {/* Worker */}
                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {selectedSubmission.worker_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{selectedSubmission.worker_name}</p>
                            <p className="text-sm text-gray-500">{selectedSubmission.worker_email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Task Title</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{selectedSubmission.task_title}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Payable Amount</p>
                            <p className="text-sm font-bold text-green-600 mt-1">{selectedSubmission.payable_amount} Coins</p>
                        </div>
                    </div>

                    <div>
                         <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Submission Proof</p>
                         <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
                            {selectedSubmission.submission_details}
                         </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleApprove}
                    className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                  >
                    {isProcessing ? <FaSpinner className="animate-spin"/> : <FaCheckCircle />} Approve
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleReject}
                    className="mt-3 w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-3 bg-red-100 text-base font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
                  >
                     {isProcessing ? <FaSpinner className="animate-spin"/> : <FaTimesCircle />} Reject
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
