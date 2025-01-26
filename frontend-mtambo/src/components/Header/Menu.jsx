import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthenticationContext';

const Menu = () => {
  const { user, logOut } = useAuth();
  console.log(user);
  console.log("yoooooooooooooooooooooooooooo");
  return (
    <nav className="hidden md:flex space-x-6 justify-center tracking-tight flex-grow flex-basis-auto">
      <Link to="/" className="desktop-link text-white transition-colors duration-300">Home</Link>
      <Link to="/about" className="desktop-link text-white transition-colors duration-300">About Us</Link>
      <Link to="/dashboard" className="desktop-link text-white transition-colors duration-300">Dashboard</Link>

      <div className="relative">
        <button className="desktop-link text-white flex items-center">
          Services
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="absolute hidden right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg transition-opacity duration-200 ease-in-out">
          <Link to="/elevators" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Elevators</Link>
          <Link to="/generators" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">Power Back-up Generators</Link>
          <Link to="/hvac" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">HVAC systems</Link>
        </div>
      </div>

      <Link to="/contact" className="desktop-link text-white transition-colors duration-300">Contact Us</Link>
    </nav>
  );
};

export default Menu;