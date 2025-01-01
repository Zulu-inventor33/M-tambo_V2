import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthenticationContext';
import LoggedInUserProfile from './LoggedInUserProfile';

const Navbar = () => {
    const { user } = useAuth();
    //track the login state of the user
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    //update the when the user state from auth context updates after login
    useEffect(() => {
        if (user) {
            setIsUserLoggedIn(true);
        } else {
            setIsUserLoggedIn(false);
        }
    }, [user]);

    console.log(isUserLoggedIn)
    console.log(user)

    return (
        <nav className="nav_container">
            {/* Mobile button navigation section */}
            <div>
                <button type="button" className="open_mobile_menu_btn">
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* Application Logo section */}
            <div className="logo_container">
                <Link to="/" className="logo" aria-label="M-TAMBO">M-TAMBO</Link>
            </div>

            {/* desktop links section for both logged-in and not logged-in */}
            <ul className="desktop_links_container">
                <li className="desktop_link">
                    <div className="link">
                        <Link to="/about" className="link_btn">About Us</Link>
                    </div>
                </li>
                <li className="desktop_link">
                    <div className="link">
                        <Link to="/dashboard" className="link_btn">Dashboard</Link>
                    </div>
                </li>
                <li className="desktop_link">
                    <div className="link">
                        <Link to="/services" className="link_btn">Services</Link>
                    </div>
                </li>
                <li className="desktop_link">
                    <div className="link">
                        <Link to="/contact" className="link_btn">Contact Us</Link>
                    </div>
                </li>
            </ul>

            {!isUserLoggedIn ? (
                // This section is shown when the user is NOT logged in
                <ul className="sign_up_price_container">
                    <li className="pricing_container">
                        <a className="price_link" href="#">Pricing</a>
                    </li>
                    <li className="sign_up_container">
                        <Link to="/login" className="sign_up_link">Sign In</Link>
                    </li>
                </ul>
            ) : (
                // This section is shown when the user IS logged in
                <ul className="user_logged_in_container_navbar_section">
                    <LoggedInUserProfile />
                </ul>
            )}
        </nav>
    );
};

export default Navbar;