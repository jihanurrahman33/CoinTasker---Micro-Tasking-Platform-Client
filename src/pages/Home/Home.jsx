import React from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import BestWorkers from "../../components/BestWorkers/BestWorkers";
import Testimonials from "../../components/Testimonials/Testimonials";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import PlatformStatistics from "../../components/PlatformStatistics/PlatformStatistics";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <BestWorkers />
      <Testimonials />
      <HowItWorks />
      <PlatformStatistics />
      <WhyChooseUs />
    </div>
  );
};

export default Home;
