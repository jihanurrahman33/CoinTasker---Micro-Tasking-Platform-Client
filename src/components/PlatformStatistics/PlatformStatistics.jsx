import React, { useEffect, useRef, useState } from "react";
import { FaUsers, FaCheckCircle, FaCoins, FaStar } from "react-icons/fa";

const StatItem = ({ icon, value, label, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.floor(increment * currentStep));
      } else {
        setCount(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={elementRef}
      className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-indigo-100"
    >
      <div className="mb-4 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white shadow-lg">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-gray-600 text-center font-medium">{label}</div>
    </div>
  );
};

const PlatformStatistics = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Platform{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who are earning and achieving their goals on our platform
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem icon={<FaUsers className="w-8 h-8" />} value={15420} label="Active Workers" suffix="+" />
          <StatItem icon={<FaCheckCircle className="w-8 h-8" />} value={48500} label="Tasks Completed" suffix="+" />
          <StatItem icon={<FaCoins className="w-8 h-8" />} value={1250000} label="Coins Earned" suffix="+" />
          <StatItem icon={<FaStar className="w-8 h-8" />} value={98} label="Satisfaction Rate" suffix="%" />
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <p className="text-lg text-gray-700 mb-6">Trusted by workers and buyers worldwide</p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">Live Platform</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
              <FaCheckCircle className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-700 font-medium">Verified Users</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
              <FaStar className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700 font-medium">Top Rated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformStatistics;
