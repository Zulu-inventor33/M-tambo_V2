import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const TopBar = () => {
  return (
    <header className="pc-header">
      <div className="header-wrapper">
        {/* [Mobile Media Block] start */}
        <div className="me-auto pc-mob-drp">
          <ul className="list-unstyled">
            {/* ======= Menu collapse Icon ===== */}
            <li className="pc-h-item pc-sidebar-collapse">
              <a href="#" className="pc-head-link ms-0" id="sidebar-hide">
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
            <li className="pc-h-item pc-sidebar-popup">
              <a href="#" className="pc-head-link ms-0" id="mobile-collapse">
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
            <li className="dropdown pc-h-item d-inline-flex d-md-none">
              <a className="pc-head-link dropdown-toggle arrow-none m-0" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
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
        {/* [Mobile Media Block end] */}
        <div className="ms-auto">
          <ul className="list-unstyled">
            <li className="dropdown pc-h-item pc-mega-menu">
              <a className="pc-head-link dropdown-toggle arrow-none me-0 show" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="true">
                <i className="ti ti-layout-grid"></i>
              </a>
            </li>
            <li className="dropdown pc-h-item">
              <a className="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                <i className="ti ti-language"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-end pc-h-dropdown">
                <a href="#!" className="dropdown-item">
                  <i className="ti ti-user"></i>
                  <span>My Account</span>
                </a>
                <a href="#!" className="dropdown-item">
                  <i className="ti ti-settings"></i>
                  <span>Settings</span>
                </a>
                <a href="#!" className="dropdown-item">
                  <i className="ti ti-headset"></i>
                  <span>Support</span>
                </a>
                <a href="#!" className="dropdown-item">
                  <i className="ti ti-lock"></i>
                  <span>Lock Screen</span>
                </a>
                <a href="#!" className="dropdown-item">
                  <i className="ti ti-power"></i>
                  <span>Logout</span>
                </a>
              </div>
            </li>
            <li className="dropdown pc-h-item">
              <a className="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                <i className="ti ti-bell"></i>
                <span className="badge bg-success rounded-pill">1</span>
              </a>
              <div className="dropdown-menu dropdown-menu-end pc-h-dropdown">
                <div className="notification-box">
                  <h6>Notifications</h6>
                  <ul className="list-unstyled">
                    <li className="media">
                      <span className="new"></span>
                      <div className="media-body">
                        <h6 className="media-heading">John, just like you!</h6>
                        <p className="media-text">2 minutes ago</p>
                      </div>
                    </li>
                  </ul>
                  <div className="view-all text-center">
                    <a href="#" className="btn btn-primary btn-sm">View All</a>
                  </div>
                </div>
              </div>
            </li>
            <li className="dropdown pc-h-item">
              <a className="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                <i className="ti ti-mail"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-end pc-h-dropdown">
                <h6>Latest Message</h6>
                <ul className="list-unstyled">
                  <li className="media">
                    <img className="img-fluid img-30 me-3 rounded-circle" src="assets/images/user/3.jpg" alt="avatar" />
                    <div className="media-body">
                      <h6 className="media-heading">John, just like you!</h6>
                      <p className="media-text">2 minutes ago</p>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default TopBar;