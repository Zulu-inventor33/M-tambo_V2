import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
  const navigate = useNavigate();
  const user = false;

  const handleLoginClick = () => {
    navigate('/login');
  }
  const handleSignUpClick = () => {
    navigate('/register');
  };
  
  return (
    <div>
      {user ? (
        <div className="relative">
          {/* User Profile Dropdown */}
          <div className="avatar-section">
            <img src="images/cool_avatar.jpeg" alt="user avatar" className="avatar-img" />
            <span className="profile-username">
              <span>Hi,</span>
              <span className="name">User</span>
            </span>
          </div>
          {/* Dropdown Menu */}
          <ul className="dropdown-menu-section">
            <li><div className="user-box">Profile info here</div></li>
            <li><a href="#">Logout</a></li>
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-4 w-full md:w-auto flex-basis-auto">
          <button className="bg-[#fc4b3b] text-white py-2 px-4 rounded-md hover:bg-[#fc4b3b]/90" onClick={handleLoginClick}>
            Log In
          </button>
          <button className="bg-[#2c2c64] text-white py-2 px-4 rounded-md hover:bg-[#fc4b3b]/90" onClick={handleSignUpClick}>
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;