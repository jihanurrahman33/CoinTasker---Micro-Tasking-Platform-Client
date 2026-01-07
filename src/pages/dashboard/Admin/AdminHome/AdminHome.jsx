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
            Admin Dashboard
          </h1>
          <p className="text-slate-500 text-lg">Monitor platform statistics and manage withdrawal requests</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Workers */}
            <div className="card glass-panel p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-primary to-emerald-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-primary to-emerald-600 p-3 shadow-lg shadow-primary/20 w-fit">
                         <FaUsers className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-500">Total Workers</p>
                         <p className="text-3xl font-bold text-secondary">{stats.totalWorkers}</p>
                     </div>
                 </div>
            </div>

            {/* Total Buyers */}
             <div className="card glass-panel p-6 relative overflow-hidden group hover:border-secondary/30 transition-all duration-300">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-secondary to-slate-700 opacity-5 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-secondary to-slate-700 p-3 shadow-lg shadow-slate-200 w-fit">
                         <FaUsers className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-500">Total Buyers</p>
                         <p className="text-3xl font-bold text-secondary">{stats.totalBuyers}</p>
                     </div>
                 </div>
            </div>

            {/* Total Available Coins */}
             <div className="card glass-panel p-6 relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-accent to-amber-500 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-accent to-amber-500 p-3 shadow-lg shadow-accent/20 w-fit">
                         <FaCoins className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-500">Total Available Coins</p>
                         <p className="text-3xl font-bold text-accent">{stats.totalAvailableCoins.toLocaleString()}</p>
                     </div>
                 </div>
            </div>

            {/* Total Payments */}
             <div className="card glass-panel p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
                 <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-emerald-500 to-green-600 opacity-10 group-hover:scale-110 transition-transform origin-top-right"></div>
                 <div className="relative space-y-2">
                     <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-3 shadow-lg shadow-emerald-200 w-fit">
                         <FaMoneyBillWave className="h-6 w-6 text-white" />
                     </div>
                     <div>
                         <p className="text-sm font-medium text-slate-500">Total Payments</p>
                         <p className="text-3xl font-bold text-emerald-600">{stats.totalPayments}</p>
                     </div>
                 </div>
            </div>
        </div>

        {/* Withdrawal Requests Table */}
        <div className="card glass-panel overflow-hidden animate-fade-in-up">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                  <FaWallet className="text-primary"/> Pending Withdrawal Requests
              </h2>
              <p className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full w-fit">
                  {withdrawals.length} pending requests
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {withdrawals.length > 0 ? (
                <table className="table w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Worker</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Coins</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal._id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white font-bold shadow-md text-sm">
                              {withdrawal.worker_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{withdrawal.worker_name}</p>
                              <p className="text-xs text-slate-500">{withdrawal.worker_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-bold text-accent">
                            <FaCoins className="text-amber-500" /> {withdrawal.withdrawal_coin}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                            <span className="text-xs">$</span> {withdrawal.withdrawal_amount}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {withdrawal.payment_system}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FaCalendarAlt className="text-slate-400" />
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
                              className="btn btn-sm btn-outline text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary rounded-lg transition-all gap-2"
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
                <div className="bg-emerald-50 p-4 rounded-full mb-3">
                  <FaCheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">All Caught Up!</h3>
                <p className="text-slate-500 mt-1">There are no pending withdrawal requests to review.</p>
              </div>
            )}
          </div>
        </div>

        {/* View & Process Withdrawal Modal */}
        {isViewModalOpen && selectedWithdrawal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-up">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
                        <h3 className="text-2xl font-heading font-bold text-secondary">
                            Process Withdrawal
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">Review details before approving payment</p>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Worker Info */}
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center gap-4">
                             <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {selectedWithdrawal.worker_name?.charAt(0)}
                             </div>
                             <div>
                                 <h4 className="text-lg font-bold text-slate-900">{selectedWithdrawal.worker_name}</h4>
                                 <div className="flex items-center gap-2 text-primary mt-1">
                                     <FaUser className="w-4 h-4"/>
                                     <span className="text-sm font-medium">{selectedWithdrawal.worker_email}</span>
                                 </div>
                             </div>
                        </div>

                        {/* Amount Grid */}
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Coins to Deduct</p>
                                 <div className="flex items-center gap-2 text-2xl font-bold text-accent">
                                     <FaCoins /> {selectedWithdrawal.withdrawal_coin}
                                 </div>
                             </div>
                             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                 <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Payment Amount</p>
                                 <div className="flex items-center gap-2 text-2xl font-bold text-emerald-600">
                                     <span className="font-sans">$</span> {selectedWithdrawal.withdrawal_amount}
                                 </div>
                             </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-4">
                             <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Transaction Details</h4>
                             <div className="grid gap-3">
                                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                     <span className="text-slate-500 text-sm">Payment System</span>
                                     <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                                         {selectedWithdrawal.payment_system}
                                     </span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                     <span className="text-slate-500 text-sm">Account Number</span>
                                     <span className="font-mono font-bold text-slate-900 tracking-wider">
                                         {selectedWithdrawal.account_number}
                                     </span>
                                 </div>
                                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                     <span className="text-slate-500 text-sm">Requested On</span>
                                     <span className="font-medium text-slate-900 text-sm">
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

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                         <button 
                             onClick={() => setIsViewModalOpen(false)}
                             disabled={isProcessing}
                             className="px-5 py-2.5 rounded-xl font-medium_ text-slate-600 hover:bg-slate-200 transition-colors"
                         >
                             Cancel
                         </button>
                         <button 
                             onClick={() => handlePaymentSuccess(selectedWithdrawal._id)}
                             disabled={isProcessing}
                             className="btn btn-primary-gradient px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-emerald-200 transition-all transform active:scale-95 flex items-center gap-2 border-none"
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
