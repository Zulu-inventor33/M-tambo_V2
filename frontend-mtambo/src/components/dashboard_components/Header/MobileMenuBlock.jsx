import React from 'react';

import { useSidebarToggle } from '../../../context/SidebarToggleContext';

const MobileMenuBlock = () => {
    const { toggleSidebar } = useSidebarToggle();

    return (
        <div className="me-auto pc-mob-drp pc-topbar-toggler-section">
            <ul className="list-unstyled">
                {/* ======= Menu collapse Icon ===== */}
                <li className="pc-h-item pc-sidebar-collapse">
                    <a
                        href="#"
                        className="pc-head-link ms-0 custom-collapse-icon"
                        id="sidebar-hide"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleSidebar();
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-align-right-2">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M20 4v16" />
                            <path d="M4 6h12" />
                            <path d="M10 12h6" />
                            <path d="M6 18h10" />
                        </svg>
                    </a>
                </li>
                <li className="pc-h-item pc-sidebar-popup">
                    <a
                        href="#"
                        className="pc-head-link ms-0"
                        id="mobile-collapse"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleSidebar();
                        }}
                    >
                        <i className="ti ti-menu-2"></i>
                    </a>
                </li>
                <li className="dropdown pc-h-item d-inline-flex d-md-none">
                    <a
                        className="pc-head-link dropdown-toggle arrow-none m-0"
                        data-bs-toggle="dropdown"
                        href="#"
                        role="button"
                        aria-haspopup="false"
                        aria-expanded="false"
                    >
                        <i className="ti ti-search"></i>
                    </a>
                    <div className="dropdown-menu pc-h-dropdown drp-search">
                        <form className="px-3">
                            <div className="form-group mb-0 d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input type="search" className="form-control border-0 shadow-none" placeholder="Search here. . ." />
                            </div>
                        </form>
                    </div>
                </li>
                <li className="pc-h-item d-none d-md-inline-flex">
                    <form className="header-search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search icon-search">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="search" className="form-control" placeholder="Search here. . ." />
                    </form>
                </li>
            </ul>
        </div>
    );
};

export default MobileMenuBlock;