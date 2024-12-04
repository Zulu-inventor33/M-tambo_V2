import React from 'react';
import Logo from './Logo';
import Menu from './Menu';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  return (
    <header className="w-full h-[64px] flex justify-center items-center fixed top-0 left-0 z-50 transition-all duration-200">
      <div className="container flex items-center justify-between px-4 md:px-6 w-full h-full">
        {/* The Mobile menu*/}
        <MobileMenu />
        {/* The logo M-TAMBO */}
        <Logo />
        {/* Desktop menu Navigations */}
        <Menu />
        {/* Login and sign up button */}
        <AuthButtons />
      </div>
    </header>
  );
};

export default Navbar;
