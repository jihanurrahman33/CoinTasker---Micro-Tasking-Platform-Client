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
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <FaHistory className="text-indigo-600" /> Payment History
          </h1>
          <p className="text-gray-500 text-lg">View your past coin purchase transactions.</p>
        </div>

        {/* Payment Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 overflow-hidden">
            <div className="p-6 border-b border-indigo-50 bg-indigo-50/30">
                <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                    <FaReceipt className="text-indigo-500"/> Transaction Log
                </h2>
            </div>
            
            <div className="p-6">
                {payments.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                             <FaHistory size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No payment history found</h3>
                        <p className="text-gray-500 mt-1">You haven't made any coin purchases yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Coins Received</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount Paid</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                            {payment.transactionId || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-indigo-600 font-bold">
                                                 <FaCoins className="text-yellow-500" />
                                                 {payment.coinAmount} Coins
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <FaDollarSign className="mr-1 text-xs" /> {payment.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                           <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                                                <FaCalendarAlt className="text-gray-400" />
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
