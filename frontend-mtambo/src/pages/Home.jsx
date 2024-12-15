import React from 'react';
import Navbar from '../components/Navbar_home_page/Navbar';
import HeroSection from '../components/Hero_section_home_page/Hero_section';
import FooterSection from '../components/Footer_home_page/FooterSection';

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FooterSection />
    </div>
  );
};

export default Home;