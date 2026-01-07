import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaCalendarAlt,
  FaCoins,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner
} from "react-icons/fa";

const MySubmissions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: fetchedSubmissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      // Pass worker_email as a query parameter
      const res = await axiosSecure.get(`/submissions/my?worker_email=${user.email}`); 
      return res.data;
    },
    enabled: !!user?.email, // Only fetch when user email is available
  });

  // Sync state with fetched data
  useEffect(() => {
    if (fetchedSubmissions) {
      setSubmissions(fetchedSubmissions);
      setFilteredSubmissions(fetchedSubmissions);
    }
  }, [fetchedSubmissions]);

  // Filtering Logic
  useEffect(() => {
    let filtered = submissions;

    // Filter by search query (Task Title or Buyer Name)
    if (searchQuery) {
      filtered = filtered.filter(
        (submission) =>
          submission.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.buyer_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((submission) => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, statusFilter, submissions]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, endIndex);

  const stats = {
    total: submissions.length,
    approved: submissions.filter((s) => s.status === "approved").length,
    pending: submissions.filter((s) => s.status === "pending").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
    totalEarnings: submissions
      .filter((s) => s.status === "approved")
      .reduce((sum, s) => sum + s.payable_amount, 0),
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <FaCheckCircle className="h-3 w-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <FaTimesCircle className="h-3 w-3" /> Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <FaClock className="h-3 w-3" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50">
            <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <div
          className={`mb-8 transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-secondary mb-2">My Submissions</h1>
          <p className="text-slate-500 text-lg">Track all your task submissions and their status</p>
        </div>

        {/* Stats Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 transition-all duration-700 delay-100 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {/* Total Submissions */}
          <div className="card glass-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-secondary">{stats.total}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <FaFileAlt className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="card glass-panel p-6 border-emerald-100 bg-emerald-50/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 mb-1">Approved</p>
                <p className="text-3xl font-bold text-emerald-700">{stats.approved}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <FaCheckCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="card glass-panel p-6 border-amber-100 bg-amber-50/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-700">{stats.pending}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <FaClock className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="card glass-panel p-6 border-red-100 bg-red-50/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <FaTimesCircle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="card glass-panel p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-amber-900">{stats.totalEarnings}</p>
                <p className="text-xs text-amber-700 mt-1">coins earned</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <FaCoins className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          className={`card glass-panel p-6 mb-6 transition-all duration-700 delay-200 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by task title or buyer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div
          className={`card glass-panel overflow-hidden transition-all duration-700 delay-300 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-secondary">Submission History</h2>
            <p className="text-sm text-slate-500">
              Showing {filteredSubmissions.length > 0 ? startIndex + 1 : 0} to{" "}
              {Math.min(endIndex, filteredSubmissions.length)} of {filteredSubmissions.length} submissions
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Task Title</th>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentSubmissions.length > 0 ? (
                  currentSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 max-w-xs">
                          <FaFileAlt className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm font-medium text-slate-900 line-clamp-2">
                            {submission.task_title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {submission.buyer_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {submission.buyer_name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {submission.buyer_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FaCalendarAlt className="h-3 w-3 text-slate-400" />
                          {new Date(submission.current_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-semibold text-amber-600">
                          <FaCoins className="h-3 w-3 text-amber-500" />
                          {submission.payable_amount}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(submission.status)}</td>
                      <td className="px-6 py-4">
                         <p className="text-sm text-slate-500 line-clamp-2 max-w-xs" title={submission.submission_details}>
                            {submission.submission_details}
                         </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                           <FaFileAlt className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="font-medium text-secondary">No submissions found</p>
                        <p className="text-sm text-slate-500">Try adjusting your filters or search query</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
              <p className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <FaChevronLeft className="h-3 w-3" /> Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  Next <FaChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubmissions;
