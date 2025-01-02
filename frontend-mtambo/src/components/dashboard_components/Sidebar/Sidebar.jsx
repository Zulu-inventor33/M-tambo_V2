import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './Sidebar.css';
import { useSidebarToggle } from '../../../context/SidebarToggleContext';

const Sidebar = ({ sidebarLinks }) => {
	const { isSidebarCollapsed, toggleSidebar } = useSidebarToggle();

	// State to track if the screen size is small (less than 1024px)
	const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

	// Update the screen size state when the window is resized
	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 1024);
		};

		// Add event listener for window resize
		window.addEventListener('resize', handleResize);

		// Cleanup on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Determine the class for the nav element
	const navClass = isSidebarCollapsed
		? isMobileView
			? "pc-sidebar-hide mob-sidebar-active"  // On small screens, both classes
			: "pc-sidebar-hide"                    // On large screens, only pc-sidebar-hide
		: "";
	return (
		<nav className={`pc-sidebar pc-trigger ${navClass}`}>
			<div className="navbar-wrapper">
				{/* This is the part with the sidebar logo */}
				<div className="m-header">
					<Link to='/' className='b-brand text-primary'>
						<h2 className='logo-lg dashboard-logo'>M-TAMBO</h2>
					</Link>
				</div>
				<div className="navbar-content simplebar-scrollable-y">
					<div className="simplebar-wrapper">
						<div className="simplebar-height-auto-observer-wrapper">
							<div className="simplebar-height-auto-observer"></div>
						</div>
						<div className="simplebar-mask">
							<div className="simplebar-offset">
								<div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content">
									<div className="simplebar-content">
										<ul className="pc-navbar">
											{sidebarLinks.map((link, index) => (
												<li
													key={index}
													className={`pc-item ${link.isCaption ? "pc-caption" : ""} ${link.href === window.location.pathname ? "active" : ""}`}
												>
													{link.isCaption ? (
														<>
															<label>{link.text}</label>
															<i className={link.iconClass}></i>
														</>
													) : (
														<a href={link.href} className="pc-link">
															<span className="pc-micon">
																{link.icon}
															</span>
															<span className="pc-mtext">{link.text}</span>
														</a>
													)}
												</li>
											))}
											<li className="pc-item pc-caption">
												<label>Other</label>
												<i className="ti ti-brand-chrome"></i>
											</li>
											<li className="pc-item">
												<Link to="/profile" className='pc-link'>
													<span className="pc-micon">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user-search">
															<path stroke="none" d="M0 0h24v24H0z" fill="none" />
															<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
															<path d="M6 21v-2a4 4 0 0 1 4 -4h1.5" />
															<path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
															<path d="M20.2 20.2l1.8 1.8" />
														</svg>
													</span>
													<span className="pc-mtext">My profile</span>
												</Link>
											</li>
											<li className="pc-item">
												<a href="../other/sample-page.html" className="pc-link">
													<span className="pc-micon">
														<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-power">
															<path stroke="none" d="M0 0h24v24H0z" fill="none" />
															<path d="M7 6a7.75 7.75 0 1 0 10 0" />
															<path d="M12 4l0 8" />
														</svg>													</span>
													<span className="pc-mtext">Logout</span>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="simplebar-placeholder"></div>
					</div>
				</div>
			</div>
			{/* pc-menu-overlay will only be visible if the nav has 'mob-sidebar-active' and isSidebarCollapsed is true */}
			{isSidebarCollapsed && navClass.includes('mob-sidebar-active') && (
				<div className="pc-menu-overlay" onClick={toggleSidebar}></div>
			)}
		</nav>
	);
};

export default Sidebar;