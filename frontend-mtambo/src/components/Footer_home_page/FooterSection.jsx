import React, { useState, useEffect } from 'react';
import './FooterSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';


const FooterSection = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // update the current year everytime the component mounts
    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="footer-section">
            <div className="upper-footer-section">
                <div className="upper-footer-section-wrapper">
                    <div className="equipments-section">
                        <button type="button" className="header">
                            Equipments
                            <FontAwesomeIcon icon={faCaretDown}/>
                        </button>
                        <ul className="equipments-list-container">
                            <li><a className="equipment" href="#">Elevators</a></li>
                            <li><a className="equipment" href="#">HVAC</a></li>
                            <li><a className="equipment" href="#">Generators</a></li>
                        </ul>
                    </div>
                    <div className="information-section">
                        <button type="button" className="header">
                            Information
                            <FontAwesomeIcon icon={faCaretDown}/>
                        </button>
                        <ul className="equipments-list-container">
                            <li><a className="equipment" href="#">Pricing</a></li>
                            <li><a className="equipment" href="#">About us</a></li>
                            <li><a className="equipment" href="#">API</a></li>
                            <li><a className="equipment" href="#">Dashboard</a></li>
                            <li><a className="equipment" href="#">Contact us</a></li>
                        </ul>
                    </div>
                    <div className="terms_of_use_and_support_container">
                        <div className="terms_of_use_container">
                            <button type="button" className="header">
                                Legal
                                <FontAwesomeIcon icon={faCaretDown}/>
                            </button>
                            <ul className="equipments-list-container">
                                <li><a className="equipment" href="#">Terms of use</a></li>
                                <li><a className="equipment" href="#">Privacy policy</a></li>
                                <li><a className="equipment" href="#">Cookies policy</a></li>
                            </ul>
                        </div>
                        <div className="support_container">
                            <button type="button" aria-expanded="true" data-state="open" className="header">
                                Support
                                <FontAwesomeIcon icon={faCaretDown}/>
                            </button>
                            <ul className="equipments-list-container">
                                <li><a className="equipment" href="#">FAQ</a></li>
                                <li><a className="equipment" href="#">Search guide</a></li>
                                <li><a className="equipment" href="#">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="social_media_section_container">
                        <p className="header">Social media</p>
                        <ul className="social_media_list">
                            <li className="list">
                                <a href="#" target="_blank" rel="nofollow noopener noreferrer" className="link facebook_link">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" aria-hidden="true">
                                    <path d="M501 257.5c0-135.3-109.7-245-245-245S11 122.2 11 257.5c0 122.3 89.6 223.6 206.7 242V328.3h-62.2v-70.8h62.2v-54c0-61.4 36.6-95.3 92.5-95.3 26.8 0 54.8 4.8 54.8 4.8v60.3h-30.9c-30.4 0-39.9 18.9-39.9 38.3v46h67.9l-10.9 70.8h-57.1v171.2C411.4 481.1 501 379.8 501 257.5"></path>
                                </svg>
                                </a>
                            </li>
                            <li className="list">
                                <a href="#" target="_blank" rel="nofollow noopener noreferrer" className="link twitter_link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" aria-hidden="true">
                                    <path d="M298.158 216.797 484.663 0h-44.196L278.525 188.242 149.182 0H0l195.592 284.655L0 512h44.198l171.016-198.79L351.809 512h149.182L298.147 216.797zm-60.536 70.366-19.818-28.345L60.124 33.272h67.885L255.26 215.295l19.817 28.345 165.411 236.601h-67.886l-134.98-193.067z"></path>
                                </svg>
                                </a>
                            </li>
                            <li className="list">
                                <a href="#" target="_blank" rel="nofollow noopener noreferrer" className="link linkedin_link">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" aria-hidden="true">
                                    <path d="M436.2 436.3h-75.9V317.4c0-28.3-.5-64.8-39.5-64.8-39.5 0-45.6 30.9-45.6 62.7v120.9h-75.9V191.9h72.8v33.4h1c7.3-12.5 17.8-22.7 30.5-29.7 12.7-6.9 27-10.3 41.4-9.8 76.9 0 91.1 50.6 91.1 116.4zM113.9 158.5c-8.7 0-17.2-2.6-24.5-7.4-7.2-4.8-12.9-11.7-16.2-19.8s-4.2-16.9-2.5-25.4 5.9-16.4 12-22.5c6.2-6.2 14-10.4 22.5-12.1s17.4-.8 25.4 2.5 14.9 9 19.8 16.2c4.8 7.2 7.4 15.7 7.4 24.5 0 5.8-1.1 11.5-3.3 16.8s-5.5 10.2-9.5 14.3c-4.1 4.1-8.9 7.3-14.3 9.5-5.3 2.3-11 3.4-16.8 3.4m37.9 277.8H75.9V191.9h75.9zM474.1 0H37.8c-9.9-.1-19.4 3.7-26.5 10.6S.1 27 0 36.9V475c.1 9.9 4.2 19.4 11.2 26.3 7.1 6.9 16.6 10.8 26.5 10.7H474c9.9.1 19.5-3.7 26.6-10.6s11.2-16.4 11.3-26.3V36.9c-.1-9.9-4.2-19.4-11.3-26.3S484-.1 474.1 0"></path>
                                </svg>
                                </a>
                            </li>
                        </ul>
                        <a className="sign_up" href="https://www.freepik.com/sign-up?client_id=freepik&amp;lang=en">Sign up</a>
                    </div>
                </div>
            </div>
            <div className="middle_footer_section">
                <div className="middle_footer_section_wrapper">
                <a href="#" aria-label="M-TAMBO" className="mtambo_logo">M-TAMBO</a>
                <p className="copyright">
                    Copyright © {currentYear} All rights reserved.
                </p>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;