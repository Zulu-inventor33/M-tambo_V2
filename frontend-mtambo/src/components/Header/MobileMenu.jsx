import React from 'react';
import styles from './MobileMenu.module.css';
import { useState } from 'react';

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMobileMenu = () => setIsMenuOpen(true);
  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* The button to open the mobile menu navigation on small screen */}
      <div id="open-menu-btn" className="md:hidden flex items-center justify-start w-full open-menu-btn">
        <button id="nav-open" className="text-white focus:outline-none" onClick={openMobileMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
            <path 
              fill-rule="evenodd" 
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </button>
      </div>
      {/* menu navigation links */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
        <div id="close-menu-btn" className={styles.closeMenuBtn} onClick={closeMobileMenu}>
          <i className="fa-regular fa-x"></i>
        </div>
        <nav className={styles.Navbar}>
            <a href="#home" className={styles.mobileMenuLink}>Home</a>
            <a href="#about-us" className={styles.mobileMenuLink}>About Us</a>
            <a href="#about-us" className={styles.mobileMenuLink}>Dashboard</a>
            <a href="#services" className={styles.mobileMenuLink}>Services</a>
            <a href="#contact" className={styles.mobileMenuLink}>Contact Us</a>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;