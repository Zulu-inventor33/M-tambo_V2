import React, { useState, useContext } from 'react';
import './LoginComponent.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faQuestion, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { notifyError, notifySuccess } from '../../utils/notificationUtils';
import { AuthContext } from '../../context/AuthenticationContext';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  // Handle email and password validation
  const validateForm = () => {
    let formErrors = { email: '', password: '' };
    let valid = true;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      formErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(email)) {
      formErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setError(formErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const userData = {
        email_or_phone: email,
        password: password
      };

      console.log("Data to be submitted for Login:", JSON.stringify(userData));
      try {
        const response = await axios.post(`/api/login/`, JSON.stringify(userData), {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // one of the repsonse I get from MTAMBO API IS ACCESS
        if (response.status === 200) {
          // Call the login function from context to store user and tokens Globally on the local storage
          // This will help us keep the user data global
          setLoading(false);
          login(response.data.user, response.data.access, response.data.refresh);
          notifySuccess("Welcome Back to M-tambo!");
          navigate('/dashboard');
        }
        return;
      } catch (error) {
        // Handle network or server error
        setLoading(false);
        const errorMessage = error.response?.data?.error || 'Something went wrong!';
        console.log("Error message:", error);
        notifyError(errorMessage);
        if (error.response?.data?.error === 'A user with this email already exists.') {
          setError(prevErrors => ({
            ...prevErrors,
            password: 'Something went wrong. Please try again later.'
          }));
        } else {
          notifyError(errorMessage);
        }
      }
    }
  };

  return (
    <div className="login-page-new">
      {/* The upper section of the app */}
      <nav>
        <Link to="/" className="login-page-new__logo">
          <h2 className="login-page-new__logo-header-black">M-TAMBO</h2>
          <div className="login-page-new__logo-text"> The maintenance system for all. </div>
        </Link>
        <div className="login-page-new__top-right">
          <div className="login-page-new__top-right-text"> Don't have an account? </div>
          <Link to="/register" className="login-page-new__top-right-button">Sign up</Link>
        </div>
      </nav>
      <div className="login-page-new__main-top-divider"></div>
      {/* The main section of the page */}
      <div className="login-page-new__main">
        <div className="login-page-new__main-bg"></div>
        <div className="login-page-new__main-container">
          <div className="login-page-new__main-form">
            <div className="login-page-new__main-form-title-brand"></div>
            <h1 className="login-page-new__main-form-title ng-star-inserted"> Welcome back!</h1>
            {/* continue with google */}
            <div className='g-sign-in-button'>
              <div className='content-wrapper'>
                <div className='logo-wrapper'>
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="google icon" />
                </div>
                <span className="text-container">
                  <span>Continue with Google</span>
                </span>
              </div>
            </div>
            {/* or Separator */}
            <div className="social-login-divider ng-star-inserted">
              <span className="social-login-divider_text">or</span>
            </div>
            {/* the login form starts here */}
            <div className="login-page-new__main-form-router-outlet">
              <form onSubmit={handleSubmit}>
                <div className="login-page-new__main-form-row">
                  {/* email input section */}
                  <label htmlFor="email" className="login-page-new__main-form-row-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error.email && <span className="text-red-500 text-sm mt-1">{error.email}</span>}
                </div>
                {/* password input section */}
                <div className="login-page-new__main-form-row">
                  <label htmlFor="password" className="login-page-new__main-form-row-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoCorrect="off"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle-button"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (<FontAwesomeIcon icon={faEye} />) : (<FontAwesomeIcon icon={faEyeSlash} />)}
                    </button>
                  </div>
                </div>
                <button type="submit" className="login-page-new__main-form-button">
                  <span className="login-page-new__main-form-button-text"> Sign In </span>
                </button>
              </form>
            </div>
            <a href="#" target="_blank" className="login-page-new__main-form-help">
              <FontAwesomeIcon icon={faQuestion} />
              <div className="login-page-new__main-form-help-text"> Help </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;