import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { FaUserPlus, FaBriefcase, FaCheckCircle, FaCoins, FaArrowRight } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const steps = [
  {
    icon: FaUserPlus,
    title: "Sign Up & Choose Role",
    description:
      "Create your account and select your role - become a Worker to earn coins or a Buyer to get tasks done.",
    color: "from-indigo-500 to-purple-500",
    delay: 0,
  },
  {
    icon: FaBriefcase,
    title: "Post or Find Tasks",
    description: "Workers browse available tasks and pick what they like. Buyers post tasks with coin rewards.",
    color: "from-blue-500 to-cyan-500",
    delay: 200,
  },
  {
    icon: FaCheckCircle,
    title: "Complete & Review",
    description: "Workers complete tasks and submit their work. Buyers review submissions and approve quality work.",
    color: "from-emerald-500 to-teal-500",
    delay: 400,
  },
  {
    icon: FaCoins,
    title: "Earn & Withdraw",
    description: "Workers earn coins for completed tasks. Accumulate coins and withdraw your earnings anytime.",
    color: "from-amber-500 to-orange-500",
    delay: 600,
  },
];

const HowItWorks = () => {
  const {user}=useAuth();
  const [visibleSteps, setVisibleSteps] = useState([false, false, false, false]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations when section comes into view
            steps.forEach((step, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => {
                  const newSteps = [...prev];
                  newSteps[index] = true;
                  return newSteps;
                });
              }, step.delay);
            });
            // Stop observing once triggered
             if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
             }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 bg-gradient-to-br from-slate-50 to-indigo-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in four simple steps. Whether you want to earn or get work done, our platform makes it easy.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines - desktop only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-blue-300 to-emerald-200" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isVisible = visibleSteps[index];

            return (
              <div
                key={index}
                className={`group relative transition-all duration-700 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {/* Step card */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full relative overflow-hidden group-hover:-translate-y-2 border border-slate-100">
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-md ring-4 ring-white">
                    {index + 1}
                  </div>

                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>

                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-indigo-50 to-transparent rounded-tl-full opacity-50" />
                </div>

                {/* Arrow indicator - desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-20">
                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
                      <FaArrowRight className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA button */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <Link
            to={user?`/dashboard`:`/register`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
