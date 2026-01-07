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
    color: "from-primary to-emerald-400",
    delay: 0,
  },
  {
    icon: FaBriefcase,
    title: "Post or Find Tasks",
    description: "Workers browse available tasks and pick what they like. Buyers post tasks with coin rewards.",
    color: "from-secondary to-slate-600",
    delay: 200,
  },
  {
    icon: FaCheckCircle,
    title: "Complete & Review",
    description: "Workers complete tasks and submit their work. Buyers review submissions and approve quality work.",
    color: "from-teal-500 to-cyan-500",
    delay: 400,
  },
  {
    icon: FaCoins,
    title: "Earn & Withdraw",
    description: "Workers earn coins for completed tasks. Accumulate coins and withdraw your earnings anytime.",
    color: "from-accent to-amber-400",
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
      className="relative py-20 px-4 bg-slate-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started in four simple steps. Whether you want to earn or get work done, our platform makes it easy.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines - desktop only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-100 via-slate-200 to-amber-100" />

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
                <div className="glass-card hover:shadow-2xl transition-all duration-300 p-8 h-full relative overflow-hidden group-hover:-translate-y-2 rounded-2xl">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-2xl font-bold text-slate-300 shadow-md ring-4 ring-white group-hover:text-primary transition-colors duration-300">
                    {index + 1}
                  </div>

                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{step.description}</p>
                </div>

                {/* Arrow indicator - desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-20">
                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100">
                      <FaArrowRight className="w-4 h-4 text-slate-400" />
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
            className="btn btn-primary-gradient px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 h-auto"
          >
            Get Started Now
            <FaArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
