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
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop", // Meeting/work
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
    image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2670&auto=format&fit=crop", // Modern office/tech
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
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop", // Security/Tech
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

  return (
    <div className="relative min-h-[600px] md:h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-900">
      
      {/* Background Images */}
      {slides.map((s, index) => (
        <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
            <img 
                src={s.image} 
                alt={s.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
            />
             {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start py-12 md:py-20">
        <div className="max-w-3xl text-left text-white">
          
          {/* Subtitle */}
          <div
            className={`inline-block mb-4 md:mb-6 px-4 py-1.5 md:py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full transition-all duration-500 ease-out ${
              isAnimating ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            <p className="text-emerald-300 text-xs md:text-sm font-semibold tracking-wide uppercase">{slide.subtitle}</p>
          </div>

          {/* Title */}
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight transition-all duration-500 delay-100 ease-out ${
              isAnimating ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p
            className={`text-lg md:text-xl text-slate-200 mb-8 max-w-2xl leading-relaxed transition-all duration-500 delay-200 ease-out ${
              isAnimating ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            {slide.description}
          </p>

          {/* CTA Button */}
          <div
            className={`mb-12 transition-all duration-500 delay-300 ease-out flex gap-4 ${
              isAnimating ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            <Link to={slide.ctaLink} className="btn btn-lg bg-emerald-600 hover:bg-emerald-500 text-white border-none px-8 font-bold shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transition-all hover:-translate-y-1 rounded-xl">
                {slide.ctaText}
            </Link>
          </div>

          {/* Stats Row */}
           <div 
             className={`flex flex-wrap gap-8 items-center border-t border-white/10 pt-8 transition-all duration-500 delay-500 ease-out ${
               isAnimating ? "opacity-0" : "opacity-100"
             }`}
           >
                {slide.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-emerald-400">
                             <stat.icon />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 bottom-8 md:right-10 md:bottom-10 flex gap-4 z-20">
        <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white transition-all disabled:opacity-50 group"
            aria-label="Previous slide"
        >
            <FaChevronLeft className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20 group"
            aria-label="Next slide"
        >
            <FaChevronRight className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
    </div>
  );
};

export default HeroSection;
