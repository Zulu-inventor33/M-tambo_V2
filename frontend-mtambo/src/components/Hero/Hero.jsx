import React from 'react';

const HeroSection = () => {
  return (
    <section id="hero_section" className="relative bg-light pt-5 text-center min-h-[510px]">
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden'>
        {/* Background image section */}
        <picture className="block w-full h-full">
          <source srcSet="images/lift1.jpg" media="(min-width: 1440px)" />
          <source srcSet="images/lift1.jpg" media="(max-width: 640px)" />
          <img src="images/lift1.jpg" className="w-full h-full object-cover" alt="hero_section_background" />
        </picture>
      </div>
      {/* the overlay for the image */}
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(25,27,38,0.6)]"></div>
      {/* the content part */}
      <div className="content_section relative w-full flex items-center justify-center flex-col text-center min-h-[510px] px-[32px] text-white">
        <h1 className="mb-2 text-[1.8rem] font-extrabold text-white">Revolutionize Your Maintenance Management with the M-TAMBO CMMS</h1>
        <h2 className="fw-light mb-4 text-lg">M-TAMBO is an easy-to-use maintenance management tool that helps you oversee HVAC systems, elevators, and power generators from a single platform.</h2>
        <div className="mt-4 flex justify-center gap-4">
          <button className="rounded-md bg-[#2c2c64] px-3.5 py-2.5 text-sm font-semibold text-white">
            Get Started
          </button>
          <button className="rounded-md bg-[#fc4b3b] px-3.5 py-2.5 text-sm font-semibold text-white">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;