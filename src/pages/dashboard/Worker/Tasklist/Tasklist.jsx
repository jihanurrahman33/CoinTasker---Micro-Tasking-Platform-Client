import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import {
  FaList,
  FaSearch,
  FaFilter,
  FaCoins,
  FaCalendarAlt,
  FaUsers,
  FaUser,
  FaEye,
  FaChevronRight,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router";
import { CardSkeleton } from "../../../../components/shared/Skeleton";

const Tasklist = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["availableTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks/available");
      return res.data;
    },
  });

  // Filter tasks logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.buyer_name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (filter === "high-pay") {
      matchesFilter = task.payable_amount >= 20;
    } else if (filter === "urgent") {
      const daysUntilDue = Math.ceil(
        (new Date(task.completion_date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );
      matchesFilter = daysUntilDue <= 7;
    }

    return matchesSearch && matchesFilter;
  });

  const getDaysRemaining = (completionDate) => {
    const days = Math.ceil(
      (new Date(completionDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div
          className={`mb-8 transition-all duration-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <FaList className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Available Tasks
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl ml-1 text-lg">
            Browse and select tasks to complete. Earn coins by helping buyers with
            their micro-tasks.
          </p>
        </div>

        {/* Stats Summary */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-700 delay-100 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-indigo-50 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Tasks
                </p>
                <p className="text-3xl font-bold text-indigo-900">
                  {filteredTasks.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <FaList className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-amber-50 bg-gradient-to-br from-amber-50/50 to-yellow-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Earnings Potential
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-bold text-amber-900">
                    {filteredTasks.reduce(
                      (sum, task) => sum + task.payable_amount,
                      0
                    )}
                  </p>
                  <FaCoins className="h-5 w-5 text-amber-600 mt-1" />
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <FaChartLine className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-green-50 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Total Positions
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {filteredTasks.reduce(
                    (sum, task) => sum + task.required_workers,
                    0
                  )}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <FaUsers className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div
          className={`mb-8 flex flex-col md:flex-row gap-4 transition-all duration-700 delay-200 transform ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by task title or buyer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaFilter className="h-4 w-4" />
              All
            </button>
            <button
              onClick={() => setFilter("high-pay")}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${
                filter === "high-pay"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaCoins className="h-4 w-4" />
              High Pay
            </button>
            <button
              onClick={() => setFilter("urgent")}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${
                filter === "urgent"
                  ? "bg-red-500 text-white shadow-lg shadow-red-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaCalendarAlt className="h-4 w-4" />
              Urgent
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          /* Task Cards Grid */
          <>
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaSearch className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      No tasks found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task, index) => {
                  const daysRemaining = getDaysRemaining(task.completion_date);
                  const isUrgent = daysRemaining <= 7;

                  return (
                    <div
                      key={task._id}
                      className={`group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
                        isVisible ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        animation: isVisible
                          ? `fadeInUp 0.5s ease-out forwards ${
                              index * 100
                            }ms`
                          : "none",
                      }}
                    >
                      {/* Task Image Banner */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        {task.task_image_url ? (
                          <img
                            src={task.task_image_url}
                            alt={task.task_title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                           <div className="text-indigo-300">
                               <FaList className="w-16 h-16 opacity-50"/>
                           </div>
                        )}
                        
                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
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

                      <div className="p-5">
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                            {task.task_title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FaUser className="h-3 w-3" />
                            <span>Posted by {task.buyer_name}</span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            {/* Payment */}
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                            <span className="text-sm text-gray-700 font-medium">
                              Payment
                            </span>
                            <div className="flex items-center gap-1">
                              <FaCoins className="h-4 w-4 text-amber-600" />
                              <span className="text-lg font-bold text-amber-900">
                                {task.payable_amount} coins
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-1">
                              <FaCalendarAlt className="h-4 w-4" />
                              Deadline
                            </span>
                            <span
                              className={`font-semibold ${
                                isUrgent ? "text-red-600" : "text-gray-700"
                              }`}
                            >
                             {new Date(task.completion_date).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 flex items-center gap-1">
                              <FaUsers className="h-4 w-4" />
                              Positions Left
                            </span>
                            <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-md">
                              {task.required_workers}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/dashboard/task-list/${task._id}`}
                          className="w-full inline-block"
                        >
                          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn">
                            <FaEye className="h-4 w-4" />
                            View Details
                            <FaChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Tasklist;
