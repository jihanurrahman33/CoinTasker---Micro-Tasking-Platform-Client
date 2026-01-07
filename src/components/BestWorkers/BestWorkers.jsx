import React, { useEffect, useState } from "react";
import { FaTrophy, FaChartLine, FaAward, FaCoins } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import { CardSkeleton } from "../shared/Skeleton";

const BestWorkers = () => {
  const {user} = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const axiosInstance = useAxios();

  const { data: topWorkers = [], isLoading } = useQuery({
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
      className="relative py-20 px-4 overflow-hidden bg-slate-50"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <FaTrophy className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent-content/80 text-accent">Top Performers</span>
          </div>
           <h2
            className={`text-4xl md:text-5xl font-heading font-bold mb-4 text-secondary transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Best Workers
          </h2>
          <p
            className={`text-lg text-slate-600 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Meet our top earners who consistently deliver exceptional results
          </p>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
             [...Array(3)].map((_, i) => <CardSkeleton key={i} />)
          ) : (
             topWorkers.map((worker, index) => (
                <div
                  key={worker.id}
                  className={`group relative glass-card p-6 rounded-2xl hover:-translate-y-2 ${
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
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
                  <div className="relative z-10">
                    {/* Worker Image */}
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-primary/30 transition-colors duration-300">
                        <img
                          src={(() => {
                            if (worker.photoURL?.includes('githubusercontent.com')) {
                              return `${worker.photoURL}${worker.photoURL.includes('?') ? '&' : '?'}s=200`;
                            }
                            return worker.photoURL;
                          })()}
                          alt={worker.name}
                          width="96"
                          height="96"
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {/* Achievement Icon */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center shadow-lg text-white">
                        <FaAward className="w-5 h-5" />
                      </div>
                    </div>
    
                    {/* Worker Info */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-secondary mb-1">{worker.name}</h3>
                      <p className="text-sm text-slate-600">{worker.task_completed} Tasks Completed</p>
                    </div>
    
                    {/* Coins Display */}
                    <div className="bg-slate-50/80 rounded-xl p-4 mb-4 border border-slate-100">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                            <FaCoins className="w-4 h-4" />
                        </div>
                        <span className="text-3xl font-bold text-secondary">
                          {worker?.coin?.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 text-center uppercase tracking-wider font-semibold">Total Earnings</p>
                    </div>
    
                    {/* Performance Indicator */}
                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
                      <FaChartLine className="w-4 h-4" />
                      <span className="font-semibold">Top Performer</span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-slate-600 mb-4">Want to join our top earners? Start completing tasks today!</p>
          <Link to={user?`/dashboard/task-list`:`/register`} className="btn btn-primary-gradient px-8 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300">
            Start Earning Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestWorkers;
