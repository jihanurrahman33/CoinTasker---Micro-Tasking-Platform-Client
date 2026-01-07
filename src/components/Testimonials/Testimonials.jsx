import React, { useState, useEffect } from "react";
import { FaStar, FaQuoteRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Worker",
    coins: 2450,
    image: "https://i.ibb.co.com/mJ9Xm73/woman1.jpg", 
    quote:
      "This platform changed my life! I've earned over 2,450 coins completing tasks in my free time. The payment process is seamless and the tasks are always interesting.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Buyer",
    coins: 1200,
    image: "https://i.ibb.co.com/SnM34wH/man1.jpg",
    quote:
      "As a buyer, I've found countless reliable workers who deliver quality results. The platform makes it incredibly easy to manage tasks and review submissions quickly.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Worker",
    coins: 3850,
    image: "https://i.ibb.co.com/gTvvjsJ/woman2.jpg",
    quote:
      "I love the flexibility this platform offers. I can work from anywhere and choose tasks that match my skills. Already earned 3,850 coins in just 2 months!",
    rating: 5,
  },
  {
    id: 4,
    name: "David Park",
    role: "Buyer",
    coins: 980,
    image: "https://i.ibb.co.com/vVjW9rS/man2.jpg",
    quote:
      "Finding quality workers has never been easier. The task submission system is straightforward, and I always get the results I need on time. Highly recommend!",
    rating: 5,
  },
  {
    id: 5,
    name: "Jennifer Taylor",
    role: "Worker",
    coins: 4200,
    image: "https://i.ibb.co.com/5xxN8R0/woman3.jpg",
    quote:
      "The best micro-tasking platform I've used! Clear instructions, fair pay, and instant withdrawals. I've already withdrawn over $200 to my account!",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied workers and buyers who are earning and growing with our platform
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden px-4 py-8">
            <div className="relative min-h-[450px] md:min-h-[400px]"> 
              {testimonials.map((testimonial, index) => {
                const isActive = index === currentIndex;
                const isPrev = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
                
                let positionClass = "translate-x-[120%] opacity-0 scale-95"; // Default: Right, hidden
                let zIndex = "z-0";

                if (isActive) {
                  positionClass = "translate-x-0 opacity-100 scale-100";
                  zIndex = "z-20";
                } else if (isPrev) {
                   positionClass = "-translate-x-[120%] opacity-0 scale-95"; // Left, hidden
                }

                return (
                  <div
                    key={testimonial.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${positionClass} ${zIndex} flex items-center justify-center`}
                  >
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-indigo-50 w-full max-w-3xl relative">
                      
                      {/* Quote Icon */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                          <FaQuoteRight className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center mt-6">
                        <p className="text-lg md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                          "{testimonial.quote}"
                        </p>

                        {/* Rating */}
                        <div className="flex justify-center gap-1 mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FaStar key={i} className="w-5 h-5 text-amber-400" />
                          ))}
                        </div>

                        <div className="divider opacity-50 my-6"></div>

                        {/* User Info */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <div className="avatar">
                                <div className="w-16 h-16 rounded-full ring ring-indigo-100 ring-offset-base-100 ring-offset-2">
                                    <img 
                                      src={testimonial.image} 
                                      alt={testimonial.name} 
                                      width="64"
                                      height="64"
                                      loading={isActive ? "eager" : "lazy"}
                                      fetchPriority={isActive ? "high" : "auto"}
                                      decoding="async"
                                    />
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                                <div className="flex items-center gap-2 justify-center md:justify-start mt-1">
                                    <span className={`badge border-none font-semibold ${testimonial.role === "Worker" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                        {testimonial.role}
                                    </span>
                                    <span className="text-sm text-gray-500 font-medium">
                                        • {testimonial.coins.toLocaleString()} coins earned
                                    </span>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 hover:scale-110 transition-all text-indigo-600 z-30"
            aria-label="Previous testimonial"
          >
           <FaChevronLeft className="w-5 h-5"/>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 hover:scale-110 transition-all text-indigo-600 z-30"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-5 h-5"/>
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-3 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full h-3 ${
                  index === currentIndex ? "w-10 bg-indigo-600" : "w-3 bg-indigo-200 hover:bg-indigo-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto divide-y md:divide-y-0 md:divide-x divide-indigo-100">
           {/* Stat 1 */}
          <div className="text-center px-4 py-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-2">10K+</div>
            <div className="text-lg font-medium text-gray-500 uppercase tracking-widest">Active Users</div>
          </div>
           {/* Stat 2 */}
          <div className="text-center px-4 py-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">50K+</div>
            <div className="text-lg font-medium text-gray-500 uppercase tracking-widest">Tasks Completed</div>
          </div>
           {/* Stat 3 */}
          <div className="text-center px-4 py-4 hover:-translate-y-2 transition-transform duration-300">
            <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">$500K+</div>
            <div className="text-lg font-medium text-gray-500 uppercase tracking-widest">Total Earnings</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
