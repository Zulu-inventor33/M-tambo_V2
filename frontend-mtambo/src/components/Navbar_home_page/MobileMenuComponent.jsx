import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faPowerOff } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../context/AuthenticationContext';
import './MobileMenuComponent.css';

const MobileMenu = ({ isMenuOpen, toggleMenu, isUserLoggedIn, user, logOut }) => {
    const [expanded, setExpanded] = useState({
        tools: false,
        images: false,
        icons: false,
        videos: false,
        templates: false,
        psd: false,
        mockups: false,
        more: false,
    });
    const [profileOpen, setProfileOpen] = useState(false);


    const toggleSection = (section) => {
        setExpanded((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const toggleProfile = () => {
        setProfileOpen(!profileOpen);
    };

    return (
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <div role="dialog" className={`mobile-menu-container ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="mobile-menu-header">
                    <div className='mobile-menu-logo-container'>
                        <span className='mobile-menu-logo'>M-TAMBO</span>
                    </div>
                    <button type="button" className="close-menu-btn" onClick={toggleMenu}>
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div>
                <div className='mobile-menu-content-container'>
                    <ul className="mobile-menu-links">
                        {!isUserLoggedIn && (
                            <li>
                                <a href="/login">
                                    <button className="menu-item sign-in-button">
                                        Sign in
                                    </button>
                                </a>
                            </li>
                        )}
                        <li>
                            <a href="/about-us">
                                <button className="menu-item">
                                    About us
                                </button>
                            </a>
                        </li>
                        <li>
                            <a href="/dashboard">
                                <button className="menu-item">
                                    Dashboard
                                </button>
                            </a>
                        </li>
                        <li>
                            <a href="/services">
                                <button className="menu-item">
                                    Services
                                </button>
                            </a>
                        </li>
                        <li>
                            <a href="/services">
                                <button className="menu-item">
                                    Contact us
                                </button>
                            </a>
                        </li>
                        {isUserLoggedIn && (
                            <li>
                                <button className="menu-item">
                                    <div className='user-avatar-container'>
                                        <img
                                            src="/images/avatar_placeholder.avif"
                                            alt="user-image"
                                            className="user-avatar wid-35"
                                        />
                                        <div>
                                            <h6 className="mb-1 user-name ">{`${user.first_name} ${user.last_name}`}</h6>
                                            <span className='account-type'>{user.account_type}</span>    
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill='currentColor' viewBox="0 0 512 512" width="16" height="16">
                                        <path d="m256 275.6-92.3-92.3c-9.8-9.8-25.6-9.8-35.4 0s-9.8 25.6 0 35.4l110 110c4.9 4.9 11.3 7.3 17.7 7.3s12.8-2.4 17.7-7.3l110-110c9.8-9.8 9.8-25.6 0-35.4s-25.6-9.8-35.4 0z"></path>
                                    </svg>
                                </button>
                                {expanded.tools && <div className="submenu">Expanded submenu profile content</div>}
                            </li>
                        )}
                        <li>
                            <button className="menu-item" onClick={logOut}>
                                Logout
                                <FontAwesomeIcon icon={faPowerOff} />
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;