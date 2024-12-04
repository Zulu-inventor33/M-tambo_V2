import React from 'react';

const Logo = () => {
  return (
    <a href="/" className="flex-basis-auto flex items-center space-x-4 cursor-pointer justify-start w-full md:w-auto logo-section">
      <span id="logo-name" className="text-white text-xl font-semibold transition-colors duration-200 text-center">
        M-TAMBO
      </span>
    </a>
  );
};

export default Logo;