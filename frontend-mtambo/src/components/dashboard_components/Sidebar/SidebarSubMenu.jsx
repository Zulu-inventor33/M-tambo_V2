// This component is used to handle nested submenus in the sidebar.
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SidebarSubMenu = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => setIsOpen(!isOpen);

  return (
    <li className={`pc-item ${isOpen ? 'pc-hasmenu active' : 'pc-hasmenu'}`}>
      <a href="#!" className="pc-link" onClick={toggleSubMenu}>
        <span className="pc-micon">
          <i className="ti ti-menu"></i>
        </span>
        <span className="pc-mtext">{title}</span>
        <span className="pc-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-right"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
      </a>
      {isOpen && <ul className="pc-submenu">{children}</ul>}
    </li>
  );
};

SidebarSubMenu.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SidebarSubMenu;