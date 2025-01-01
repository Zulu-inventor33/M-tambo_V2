// This component represents each item in the sidebar, including the main link and icon.

import React from 'react';
import PropTypes from 'prop-types';

const SidebarItem = ({ icon, text, link }) => {
  return (
    <li className="pc-item">
      <a href={link} className="pc-link">
        <span className="pc-micon">
          <i className={icon}></i>
        </span>
        <span className="pc-mtext">{text}</span>
      </a>
    </li>
  );
};

SidebarItem.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default SidebarItem;