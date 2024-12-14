import React, { useState } from 'react';
import './LoginComponent.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

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

        // Call the login function from context to store user and tokens Globally
        login(response.data.user, response.data.access);
        notifySuccess("Welcome Back to M-tambo!");
        console.log("User logins successfully:", response.data);
        localStorage.setItem('refresh_token', response.data.refresh);
        setLoading(false);
        navigate('/dashboard'); // Redirect to dashboard or home page
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
            <button className="google-btn">
              Continue with Google
              <FontAwesomeIcon icon={faGoogle} className='google-icon' />
            </button>
            {/* or Separator */}
            <div className="social-login-divider ng-star-inserted">
              <span className="social-login-divider_text">or</span>
            </div>
            {/* the login form starts here */}
            <div className="login-page-new__main-form-router-outlet">
              <form>
                <div className="login-page-new__main-form-row">
                  <label for="email" className="login-page-new__main-form-row-label">Email</label>
                  <input
                    id="loginEmail"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="login-page-new__main-form-row">
                  <label for="password" className="login-page-new__main-form-row-label">Password</label>
                  <input
                    id="loginPassword"
                    type="password"
                    autocorrect="off"
                    placeholder="Enter password"
                  />
                </div>
                <button type="submit" class="login-page-new__main-form-button">
                  <span className="login-page-new__main-form-button-text"> Sign In </span>
                </button>
              </form>
            </div>
            <a href="#" target="_blank" class="login-page-new__main-form-help">
              <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 6a6 6 0 016-6h4a6 6 0 016 6v4a6 6 0 01-6 6H6a6 6 0 01-6-6V6zm2 0a4 4 0 014-4h4a4 4 0 014 4v4a4 4 0 01-4 4H6a4 4 0 01-4-4V6zm5.117-.483c-.12.25-.34.483-.617.483H6c-.552 0-1.016-.46-.836-.982A3.001 3.001 0 0111 6c0 1.126-.62 1.863-1.538 2.308C9.192 8.44 9 8.7 9 9a1 1 0 01-2 0v-.5c0-.828.724-1.313 1.482-1.647C8.787 6.72 9 6.467 9 6a1 1 0 00-1-1c-.512 0-.761.262-.883.517zM8 13a1 1 0 100-2 1 1 0 000 2z" fill="#fff"></path>
              </svg>
              <div class="login-page-new__main-form-help-text"> Help </div>
            </a>
          </div>
          <div className="login-page-new__main-bot">
            <div className="login-page-new__main-bot-text ng-star-inserted">
              Don't have an account?
              <Link to="/register" className="login-page-new__main-bot-text-link">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;