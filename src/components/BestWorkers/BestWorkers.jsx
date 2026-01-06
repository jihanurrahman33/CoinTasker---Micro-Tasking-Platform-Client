import React, { useEffect, useState } from "react";
import { FaTrophy, FaChartLine, FaAward, FaCoins } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

const BestWorkers = () => {
  const {user} = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const axiosInstance = useAxios();

  const { data: topWorkers = [] } = useQuery({
    queryKey: ["bestWorkers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/workers/top");
      return res.data;
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("best-workers");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section
      id="best-workers"
      className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-white"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <FaTrophy className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Top Performers</span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Best Workers
          </h2>
          <p
            className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Meet our top earners who consistently deliver exceptional results
          </p>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topWorkers.map((worker, index) => (
            <div
              key={worker.id}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-200 hover:-translate-y-2 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: isVisible ? `${300 + index * 100}ms` : "0ms",
              }}
            >
              {/* Rank Badge */}
              {index < 3 && (
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-20">
                  <span className="text-white font-bold text-sm">#{index + 1}</span>
                </div>
              )}

              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10">
                {/* Worker Image */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-indigo-300 transition-colors duration-300">
                    <img
                      src={worker.photoURL}
                      alt={worker.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Achievement Icon */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaAward className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Worker Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{worker.name}</h3>
                  <p className="text-sm text-gray-500">{worker.task_completed} Tasks Completed</p>
                </div>

                {/* Coins Display */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-md">
                        <FaCoins className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {worker?.coin?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 text-center uppercase tracking-wider font-semibold">Total Earnings</p>
                </div>

                {/* Performance Indicator */}
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <FaChartLine className="w-4 h-4" />
                  <span className="font-semibold">Top Performer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-gray-600 mb-4">Want to join our top earners? Start completing tasks today!</p>
          <Link to={user?`/dashboard/task-list`:`/register`} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            Start Earning Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestWorkers;
