import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import { FaHistory, FaCoins, FaDollarSign, FaCalendarAlt, FaSpinner, FaReceipt } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["paymentHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
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
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-secondary flex items-center gap-3">
             Payment History
          </h1>
          <p className="text-slate-500 text-lg">View your past coin purchase transactions.</p>
        </div>

        {/* Payment Table */}
        <div className="card glass-panel overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
                    <FaReceipt className="text-primary"/> Transaction Log
                </h2>
            </div>
            
            <div className="p-0">
                {payments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm text-slate-300">
                             <FaHistory size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-secondary">No payment history found</h3>
                        <p className="text-slate-500 mt-1">You haven't made any coin purchases yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Coins Received</th>
                                    <th className="px-6 py-4">Amount Paid</th>
                                    <th className="px-6 py-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                                            {payment.transactionId || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                 <FaCoins className="text-amber-500" />
                                                 {payment.coinAmount} Coins
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <FaDollarSign className="text-[10px]" /> {payment.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                           <div className="flex items-center justify-end gap-2 text-sm text-slate-500">
                                                <FaCalendarAlt className="text-slate-300" />
                                                {new Date(payment.paidAt).toLocaleDateString()}
                                           </div>
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
    </div>
  );
};

export default PaymentHistory;
