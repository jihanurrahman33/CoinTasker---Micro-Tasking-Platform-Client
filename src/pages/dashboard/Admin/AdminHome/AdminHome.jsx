import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaUsers,
  FaCoins,
  FaMoneyBillWave,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaSpinner,
  FaWallet
} from "react-icons/fa";

const AdminHome = () => {
 
  const axiosSecure = useAxiosSecure();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Admin Stats
  const { data: stats = { totalWorkers: 0, totalBuyers: 0, totalAvailableCoins: 0, totalPayments: 0 }, isLoading: statsLoading ,refetch: refetchStats} = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  // Fetch Pending Withdrawals
  const { data: withdrawals = [], isLoading: withdrawalsLoading, refetch: refetchWithdrawals } = useQuery({
    queryKey: ["pendingWithdrawals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdrawals?status=pending"); 
      return res.data;
    },
  });

  const handleViewClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsViewModalOpen(true);
  };

  const handlePaymentSuccess = async (withdrawalId) => {
    setIsProcessing(true);
    try {
        const res = await axiosSecure.patch(`/withdrawals/${withdrawalId}`, { status: "approved" });
        if (res.data.modifiedCount > 0) {
            refetchWithdrawals();
            refetchStats();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Withdrawal Approved",
                text: "Payment has been processed successfully.",
                showConfirmButton: false,
                timer: 1500
            });
            setIsViewModalOpen(false);
            setSelectedWithdrawal(null);
        }
    } catch (error) {
        console.error("Failed to approve withdrawal", error);
        Swal.fire({
            icon: 'error',
            title: 'Approval Failed',
            text: error.response?.data?.message || 'Something went wrong!',
        });
    } finally {
        setIsProcessing(false);
    }
  };

  if (statsLoading || withdrawalsLoading) {
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
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-lg">Monitor platform statistics and manage withdrawal requests</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Workers */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-indigo-500 to-indigo-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-lg shadow-indigo-200 w-fit">
                         <FaUsers className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Total Workers</p>
                         <p className="text-3xl font-bold text-indigo-600">{stats.totalWorkers}</p>
                     </div>
                 </div>
            </div>

            {/* Total Buyers */}
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-purple-500 to-purple-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg shadow-purple-200 w-fit">
                         <FaUsers className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Total Buyers</p>
                         <p className="text-3xl font-bold text-purple-600">{stats.totalBuyers}</p>
                     </div>
                 </div>
            </div>

            {/* Total Available Coins */}
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-amber-500 to-amber-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-3 shadow-lg shadow-amber-200 w-fit">
                         <FaCoins className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Total Available Coins</p>
                         <p className="text-3xl font-bold text-amber-600">{stats.totalAvailableCoins.toLocaleString()}</p>
                     </div>
                 </div>
            </div>

            {/* Total Payments */}
             <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-green-500 to-green-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg shadow-green-200 w-fit">
                         <FaMoneyBillWave className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-gray-500">Total Payments</p>
                         <p className="text-3xl font-bold text-green-600">{stats.totalPayments}</p>
                     </div>
                 </div>
            </div>
        </div>

        {/* Withdrawal Requests Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-50 overflow-hidden animate-fade-in-up">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-indigo-950 flex items-center gap-2">
                  <FaWallet className="text-indigo-600"/> Pending Withdrawal Requests
              </h2>
              <p className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full w-fit">
                  {withdrawals.length} pending requests
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {withdrawals.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-indigo-50/30 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Coins</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal._id}
                        className="hover:bg-indigo-50/40 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold shadow-md text-sm">
                              {withdrawal.worker_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{withdrawal.worker_name}</p>
                              <p className="text-xs text-gray-500">{withdrawal.worker_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-bold text-amber-600">
                            <FaCoins className="text-amber-500" /> {withdrawal.withdrawal_coin}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md w-fit">
                            <span className="text-xs">$</span> {withdrawal.withdrawal_amount}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {withdrawal.payment_system}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCalendarAlt className="text-gray-400" />
                            {new Date(withdrawal.withdraw_date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleViewClick(withdrawal)}
                              className="btn btn-sm btn-outline border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-lg transition-all gap-2"
                            >
                              <FaEye /> View
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-green-50 p-4 rounded-full mb-3">
                  <FaCheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500 mt-1">There are no pending withdrawal requests to review.</p>
              </div>
            )}
          </div>
        </div>

        {/* View & Process Withdrawal Modal */}
        {isViewModalOpen && selectedWithdrawal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up">
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 sticky top-0 z-10">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Process Withdrawal
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">Review details before approving payment</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Worker Info */}
                        <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 flex items-center gap-4">
                             <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {selectedWithdrawal.worker_name?.charAt(0)}
                             </div>
                             <div>
                                 <h4 className="text-lg font-bold text-gray-900">{selectedWithdrawal.worker_name}</h4>
                                 <div className="flex items-center gap-2 text-indigo-600 mt-1">
                                     <FaUser className="w-4 h-4"/>
                                     <span className="text-sm font-medium">{selectedWithdrawal.worker_email}</span>
                                 </div>
                             </div>
                        </div>

                        {/* Amount Grid */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                 <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Coins to Deduct</p>
                                 <div className="flex items-center gap-2 text-2xl font-bold text-amber-600">
                                     <FaCoins /> {selectedWithdrawal.withdrawal_coin}
                                 </div>
                             </div>
                             <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                 <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Payment Amount</p>
                                 <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                                     <span className="font-sans">$</span> {selectedWithdrawal.withdrawal_amount}
                                 </div>
                             </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-4">
                             <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Transaction Details</h4>
                             <div className="grid gap-3">
                                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                     <span className="text-gray-500 text-sm">Payment System</span>
                                     <span className="font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                                         {selectedWithdrawal.payment_system}
                                     </span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                     <span className="text-gray-500 text-sm">Account Number</span>
                                     <span className="font-mono font-bold text-gray-900 tracking-wider">
                                         {selectedWithdrawal.account_number}
                                     </span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                     <span className="text-gray-500 text-sm">Requested On</span>
                                     <span className="font-medium text-gray-900 text-sm">
                                         {new Date(selectedWithdrawal.withdraw_date).toLocaleDateString(undefined, {
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                         })}
                                     </span>
                                 </div>
                             </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
                             <div className="mt-0.5"><FaSpinner className="animate-spin" /></div>
                             <p>
                                 Approving this request will verify the transaction and <strong>permanently deduct {selectedWithdrawal.withdrawal_coin} coins</strong> from the worker's balance. Ensure the payment has been sent to the account above.
                             </p>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-2xl">
                         <button 
                             onClick={() => setIsViewModalOpen(false)}
                             disabled={isProcessing}
                             className="px-5 py-2.5 rounded-xl font-medium_ text-gray-600 hover:bg-gray-200 transition-colors"
                         >
                             Cancel
                         </button>
                         <button 
                             onClick={() => handlePaymentSuccess(selectedWithdrawal._id)}
                             disabled={isProcessing}
                             className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 transition-all transform active:scale-95 flex items-center gap-2"
                         >
                             {isProcessing ? <FaSpinner className="animate-spin"/> : <FaCheckCircle />}
                             {isProcessing ? "Processing..." : "Confirm Payment"}
                         </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
