import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { Tooltip } from 'react-tooltip'

import './Sidebar.css';
import { useSidebarToggle } from '../../../context/SidebarToggleContext';
import { useAuth } from '../../../context/AuthenticationContext';

const Sidebar = ({ sidebarLinks }) => {
	const { user } = useAuth();
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
			<div className="navbar-wrapper" style={{ display: 'block' }}>
				{/* This is the part with the sidebar logo */}
				<div className="m-header">
					<img
						src="/images/placeholder_logo.jpg"
						alt="mtambo logo"
						className="user-avtar"
					/>
					<Link to='/' className='b-brand pc-mtext'>
						M-TAMBO
					</Link>
				</div>
				<SimpleBar style={{ height: 'calc(100vh - 115px)' }}>
					<div className="navbar-content pc-trigger">
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
										<Link to={link.href} className="pc-link">
											<span className="pc-micon">
												{link.icon}
											</span>
											<span className={`pc-mtext ${isSidebarCollapsed ? 'pc-icon-only' : ''}`}>{link.text}</span>
										</Link>
									)}
								</li>
							))}
							{/* Logout sidebar link */}
							<li className="pc-item">
								<a href="../other/sample-page.html" className="pc-link">
									<span className="pc-micon">
										<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-power">
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M7 6a7.75 7.75 0 1 0 10 0" />
											<path d="M12 4l0 8" />
										</svg>
									</span>
									<span className="pc-mtext">Logout</span>
								</a>
							</li>
						</ul>
					</div>
				</SimpleBar>
				{/* user profile section of the sidebar */}
				<div className="d-flex justify-content-start align-items-center ps-3">
					<img
						src="/images/avatar_placeholder.png"
						alt=""
						className="user-avtar"
					/>
					<div className="pc-mtext">
						<div className="leading-5 d-flex flex-column">
							<span className="font-semibold pc-sidebar-username">{user.first_name} {user.last_name}</span>
							<span className="text-xs text-gray-600">{user.email}</span>
						</div>
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