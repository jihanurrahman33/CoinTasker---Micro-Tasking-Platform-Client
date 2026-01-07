import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FaChevronLeft, FaChevronRight, FaCoins, FaUsers, FaBolt, FaChartLine } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const HeroSection = () => {
  const {user}=useAuth();
  const slides = [
  {
    id: 1,
    title: "Earn Money Completing Simple Tasks",
    subtitle: "Join thousands of workers earning coins daily",
    description: "Complete micro-tasks, earn coins, and withdraw your earnings instantly. No experience required.",
    ctaText: "Start Earning Now",
    ctaLink: user?"/dashboard/task-list": "/register",
    bgGradient: "from-emerald-600 via-teal-600 to-emerald-800",
    icon: FaCoins,
    stats: [
      { label: "Active Workers", value: "10,000+", icon: FaUsers },
      { label: "Tasks Completed", value: "50,000+", icon: FaBolt },
      { label: "Coins Earned", value: "1M+", icon: FaChartLine },
    ],
  },
  {
    id: 2,
    title: "Post Tasks & Get Results Fast",
    subtitle: "Hire skilled workers for your micro-tasks",
    description:
      "Need help with social media engagement, data entry, or content moderation? Post your task and get it done within hours.",
    ctaText: "Post Your First Task",
    ctaLink: user?"/dashboard/add-task": "/register",
    bgGradient: "from-secondary via-slate-800 to-slate-900",
    icon: FaBolt,
    stats: [
      { label: "Avg. Completion", value: "2 Hours", icon: FaBolt },
      { label: "Success Rate", value: "98%", icon: FaChartLine },
      { label: "Buyers Trust", value: "5,000+", icon: FaUsers },
    ],
  },
  {
    id: 3,
    title: "Secure & Transparent Platform",
    subtitle: "Your trusted micro-task marketplace",
    description:
      "Built with security and transparency in mind. Track every transaction, manage your earnings, and grow your income safely.",
    ctaText: "Learn More",
    ctaLink: "/about",
    bgGradient: "from-teal-600 via-cyan-700 to-teal-800",
    icon: FaChartLine,
    stats: [
      { label: "Secure Payments", value: "100%", icon: FaChartLine },
      { label: "Daily Payouts", value: "24/7", icon: FaBolt },
      { label: "User Rating", value: "4.8/5", icon: FaUsers },
    ],
  },
];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="relative min-h-[500px] md:h-[calc(100vh-4rem)] w-full overflow-hidden bg-base-100">
      {/* Background with gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-all duration-700 ease-in-out`}
      />

      {/* Animated background patterns - optimized for mobile */}
      <div className="absolute inset-0 opacity-10 pointer-events-none hidden md:block">
        <div className="absolute top-10 left-10 w-48 h-48 md:w-72 md:h-72 bg-white rounded-full blur-xl md:blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full blur-xl md:blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/3 w-56 h-56 md:w-80 md:h-80 bg-white rounded-full blur-xl md:blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center text-white px-4">
          {/* Icon - Smaller on mobile */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-4 md:mb-6 transition-all duration-500 ease-out ${
              isAnimating ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>

          {/* Subtitle */}
          <div
            className={`inline-block mb-4 md:mb-6 px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full transition-all duration-500 delay-100 ease-out ${
              isAnimating ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <p className="text-emerald-50 text-xs md:text-sm font-semibold tracking-wide uppercase">{slide.subtitle}</p>
          </div>

          {/* Title - Responsive sizing */}
          <h1
            className={`text-3xl md:text-5xl lg:text-7xl font-heading font-bold text-white mb-4 md:mb-6 leading-tight transition-all duration-500 delay-200 ease-out ${
              isAnimating ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p
            className={`text-base md:text-xl text-emerald-50/90 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed transition-all duration-500 delay-300 ease-out ${
              isAnimating ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            {slide.description}
          </p>

          {/* CTA Button */}
          <div
            className={`mb-8 md:mb-12 transition-all duration-500 delay-400 ease-out ${
              isAnimating ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <Link to={slide.ctaLink} className="btn btn-md md:btn-lg bg-white text-emerald-700 hover:bg-emerald-50 border-none px-8 font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 rounded-full ring-2 ring-white/50">
                {slide.ctaText}
            </Link>
          </div>


        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-90"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-90"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-300 rounded-full shadow-lg ${
              index === currentSlide ? "w-12 h-3 bg-white" : "w-3 h-3 bg-white/40 hover:bg-white/60 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
    </div>
  );
};

export default HeroSection;
