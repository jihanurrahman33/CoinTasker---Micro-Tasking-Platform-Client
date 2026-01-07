import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import { Link } from "react-router";
import { 
  FaCheckCircle, 
  FaClock, 
  FaCoins, 
  FaFileAlt, 
  FaSpinner, 
  FaChartLine 
} from "react-icons/fa";

const WorkerHome = () => {
    const { user } = useAuth(); // Assuming useAuthContext is what useAuth is based on.
    const axiosSecure = useAxiosSecure();

  // Fetch Stats
  const { data: stats = { totalSubmissions: 0, pendingSubmissions: 0, totalEarnings: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ["workerStats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/worker/stats?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Fetch Approved Submissions
  const { data: approvedSubmissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ["workerApprovedSubmissions", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/submissions/my?worker_email=${user.email}&status=approved`);
      return res.data;
    },
    enabled: !!user?.email,
  });


  if (statsLoading || submissionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
         <div className="flex flex-col items-center">
             <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
             <p className="text-secondary font-medium">Loading Dashboard...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in-down">
          <h1 className="text-4xl font-heading font-bold text-secondary mb-2">
            Worker Dashboard
          </h1>
          <p className="text-slate-500 text-lg">Track your submissions and total earnings</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Submissions */}
          <div className="card glass-panel p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-gradient-to-br from-primary to-emerald-600 rounded-xl shadow-lg shadow-primary/20">
                <FaFileAlt className="w-6 h-6 text-white" />
              </div>
              <FaChartLine className="text-primary/20 w-12 h-12 absolute right-4 bottom-4 group-hover:scale-110 transition-transform"/>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Submissions</h3>
            <p className="text-3xl font-bold text-secondary">
              {stats.totalSubmissions}
            </p>
            <p className="text-xs text-slate-400 mt-2">All time submissions</p>
          </div>

          {/* Pending Submissions */}
          <div className="card glass-panel p-6 relative overflow-hidden group hover:border-accent/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-gradient-to-br from-accent to-amber-600 rounded-xl shadow-lg shadow-accent/20">
                <FaClock className="w-6 h-6 text-white" />
              </div>
               <FaClock className="text-accent/20 w-12 h-12 absolute right-4 bottom-4 group-hover:rotate-12 transition-transform"/>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Pending Submissions</h3>
            <p className="text-3xl font-bold text-accent">
              {stats.pendingSubmissions}
            </p>
            <p className="text-xs text-slate-400 mt-2">Awaiting approval</p>
          </div>

          {/* Total Earnings */}
          <div className="card glass-panel p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-200">
                <FaCoins className="w-6 h-6 text-white" />
              </div>
              <FaCoins className="text-emerald-500/20 w-12 h-12 absolute right-4 bottom-4 group-hover:scale-110 transition-transform"/>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Earnings</h3>
            <p className="text-3xl font-bold text-emerald-600">
              {stats.totalEarnings} Coins
            </p>
            <p className="text-xs text-slate-400 mt-2">≈ ${(stats.totalEarnings / 20).toFixed(2)} USD</p>
          </div>
        </div>

        {/* Approved Submissions Table */}
        <div className="card glass-panel overflow-hidden animate-fade-in-up">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <FaCheckCircle className="w-5 h-5 text-emerald-500" />
              Approved Submissions
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Task Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Buyer Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Payable Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {approvedSubmissions.length > 0 ? (
                  approvedSubmissions.map((submission, index) => (
                    <tr
                      key={submission._id}
                      className="hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 line-clamp-1">{submission.task_title}</div>
                        <div className="text-xs text-slate-500 mt-1">Submitted on {new Date(submission.current_date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700">{submission.buyer_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 bg-amber-50 w-max px-2 py-1 rounded-md border border-amber-100">
                          <FaCoins className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-sm font-bold text-amber-700">{submission.payable_amount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <FaCheckCircle className="w-3 h-3" />
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-slate-100 p-4 rounded-full">
                            <FaCheckCircle className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-base font-medium text-secondary">No approved submissions yet</p>
                        <p className="text-sm">Complete tasks accurately to get approvals!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info Call to Action */}
        <div className="rounded-2xl shadow-xl p-8 relative overflow-hidden group bg-gradient-to-r from-secondary to-slate-900 text-white">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:opacity-30 transition-opacity"></div>
           
          <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
            <div>
              <h3 className="text-2xl font-bold mb-2 font-heading">Keep Up the Great Work!</h3>
              <p className="text-slate-300 text-lg opacity-90 max-w-xl">
                 You have <span className="font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">{stats.pendingSubmissions}</span> pending submissions waiting for review. While you wait, check out new available tasks.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/dashboard/task-list"
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Browse Tasks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerHome;
