import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <nav className={styles.nav_container}>
            {/* Mobile button navigation section */}
            <div>
                <button type="button" className={styles.open_mobile_menu_btn}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>

            {/* Application Logo section */}
            <div className={styles.logo_container}>
                <a className={styles.logo} aria-label="M-TAMBO" href="/">M-TAMBO</a>
            </div>

            {/* desktop links section for both logged-in and not logged-in */}
            <ul className={styles.desktop_links_container}>
                <li className={styles.desktop_link}>
                    <div className={styles.link}>
                        <button className={styles.link_btn} type="button">About Us</button>
                    </div>
                </li>
                <li className={styles.desktop_link}>
                    <div className={styles.link}>
                        <button className={styles.link_btn} type="button">Dashboard</button>
                    </div>
                </li>
                <li className={styles.desktop_link}>
                    <div className={styles.link}>
                        <button className={styles.link_btn} type="button">Services</button>
                    </div>
                </li>
                <li className={styles.desktop_link}>
                    <div className={styles.link}>
                        <button className={styles.link_btn} type="button">Contact Us</button>
                    </div>
                </li>
            </ul>

            {!isLoggedIn ? (
            // This section is shown when the user is NOT logged in
            <ul className={styles.sign_up_price_container}>
                <li className={styles.pricing_container}>
                    <a className={styles.price_link} href="#">Pricing</a>
                </li>
                <li className={styles.sign_up_container}>
                    <Link to="/login" className={styles.sign_up_link}>Sign In</Link>
                </li>
            </ul>
            ) : (
            // This section is shown when the user IS logged in
            <ul className={styles.user_logged_in_container_navbar_section}>
                <li className={styles.my_dashboard_section}>
                    <button className={styles.my_dashboard_btn}>My Dashboard</button>
                </li>
                <li className={styles.notifications_user_profile_container}>
                    <div className={styles.notifications_user_profile}>
                        <button type="button">
                        <span className={styles.notifications_container}>
                            <FontAwesomeIcon icon={faBell} />
                            <span className={styles.number_of_notifications}>3</span>
                        </span>
                        </button>
                        <button className={styles.user_profile_container} type="button">
                            <img className={styles.profile_image} src="https://lh3.googleusercontent.com/a/ACg8ocLVlbQI_KeZdSKCsRYuo6EtzqXI0G8Xu3jRghjzcj8ZuePraXs=s96-c" width="24" height="24" alt="avatar"/>
                            <FontAwesomeIcon icon={faCaretDown} />
                        </button>
                    </div>
                </li>
            </ul>
            )}
        </nav>
    );
};

export default Navbar;