import React, { useState, useEffect, useRef } from "react";
import { FaShieldAlt, FaBolt, FaUserCheck, FaBell, FaMobileAlt, FaLock } from "react-icons/fa";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

const benefits = [
  {
    icon: FaShieldAlt,
    title: "Secure Payments",
    description: "All transactions are encrypted and protected with industry-standard security protocols.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: FaBolt,
    title: "Fast Task Approval",
    description: "Quick review and approval process ensures you get paid faster than ever.",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    icon: FaUserCheck,
    title: "Verified Buyers",
    description: "Work with confidence knowing all buyers are verified and trusted members.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: FaBell,
    title: "Real-Time Notifications",
    description: "Stay updated with instant alerts for new tasks, messages, and payments.",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: FaMobileAlt,
    title: "Mobile Friendly",
    description: "Access the platform seamlessly from any device - desktop, tablet, or mobile.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: FaLock,
    title: "Role-Based Security",
    description: "Advanced permission system ensures data privacy and appropriate access control.",
    gradient: "from-indigo-500 to-purple-600",
  },
];

const WhyChooseUs = () => {
  const {user}=useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4 bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Discover the features that make us the best choice for earning and outsourcing micro-tasks
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                {/* Icon container */}
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>

                {/* Decorative gradient bar */}
                <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-gray-700 text-lg mb-6">Join thousands of satisfied users today</p>
          <Link to={user?`/dashboard`:`/register`} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
            Get Started Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
