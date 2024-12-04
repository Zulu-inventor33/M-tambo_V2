import React from 'react';
import Navbar from '../components/Header/Navbar';
import HeroSection from '../components/Hero/Hero'

const Home = () => {
  return (
    <div className="h-screen bg-gray-100">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default Home;