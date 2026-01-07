import React from "react";
import { Link } from "react-router";
import { FaBolt, FaChartLine, FaUsers } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-[480px] w-full overflow-hidden bg-slate-900 flex items-center py-12 md:py-20">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
          alt="Earn Money Completing Tasks"
          className="w-full h-full object-cover opacity-40"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 w-full">
        <div className="max-w-4xl text-left">
          {/* Subtitle Badge */}
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm">
            <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase">
              Join thousands of workers earning coins daily
            </p>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Earn Money Completing <br className="hidden md:block" />
            <span className="text-emerald-400">Simple Tasks</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Complete micro-tasks, earn coins, and withdraw your earnings instantly.
            No experience required to start your journey today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mb-10">
            <Link
              to={user ? "/dashboard/task-list" : "/register"}
              className="btn btn-lg bg-emerald-600 hover:bg-emerald-500 text-white border-none px-8 h-12 min-h-[3rem] font-bold shadow-lg shadow-emerald-600/20 rounded-xl text-base"
            >
              Start Earning Now
            </Link>
            <Link
              to="/about"
              className="btn btn-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 h-12 min-h-[3rem] font-bold backdrop-blur-sm rounded-xl text-base"
            >
              Learn More
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-x-12 gap-y-6 items-center border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FaUsers />
              </div>
              <div>
                <div className="text-xl font-bold text-white">10k+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Workers</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FaBolt />
              </div>
              <div>
                <div className="text-xl font-bold text-white">50k+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Tasks</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <FaChartLine />
              </div>
              <div>
                <div className="text-xl font-bold text-white">1M+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Coins</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold text-white">4.9/5</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
