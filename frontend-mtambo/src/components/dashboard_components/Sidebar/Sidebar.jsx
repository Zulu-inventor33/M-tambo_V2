import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ sidebarLinks }) => {
  return (
    <nav className="pc-sidebar">
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
                        <li key={index} className={`pc-item ${link.isCaption ? "pc-caption" : ""} ${link.href === window.location.pathname ? "active" : ""
                          }`}>
                          {link.isCaption ? (
                            <>
                              <label>{link.text}</label>
                              <i className={link.iconClass}></i>
                            </>
                          ) : (
                            <a href={link.href} className="pc-link">
                              <span className="pc-micon">
                                <i className={link.iconClass}></i>
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
                            <i className="ti ti-brand-chrome"></i>
                          </span>
                          <span className="pc-mtext">My profile</span>
                        </Link>
                      </li>
                      <li className="pc-item">
                        <a href="../other/sample-page.html" className="pc-link">
                          <span className="pc-micon">
                            <i className="ti ti-brand-chrome"></i>
                          </span>
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
    </nav>
  );
};

export default Sidebar;