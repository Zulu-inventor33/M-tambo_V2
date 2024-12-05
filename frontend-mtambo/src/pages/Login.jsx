import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notifySuccess, notifyError } from '../utils/notificationUtils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  // To redirect the user after successful login
  const navigate = useNavigate();
  
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
        notifySuccess("Welcome Back to M-tambo!");
        console.log("User logins successfully:", response.data);
        // Successful login, store the tokens in localStorage
        localStorage.setItem('access_token', response.data.access);
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
    <div className='relative bg-gray-100 overflow-hidden w-full h-full'>
      {/* Decorative Rounded Divs */}
      <div className="absolute z-0 w-40 h-40 bg-[#fc4b3b] rounded-full -right-28 -top-28"></div>
      <div className="absolute z-0 w-40 h-40 bg-[#fc4b3b] rounded-full -left-28 -bottom-16"></div>
      <div className="absolute z-0 w-32 h-32 bg-[#fc4b3b] rounded-full right-10 bottom-10"></div>
      {/* Header Section */}
      <header className="hidden md:block fixed top-0 left-0 w-full z-50">
        <div className="container mx-auto flex justify-start py-6">
          <div className="bg-white shadow-lg rounded-lg py-4 px-6 flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-[#2c2c64]">M-tambo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="login-page" className="flex items-center justify-center min-h-screen py-4 px-4 md:pt-6">
        <section className="bg-white py-8 lg:py-4 px-6 max-w-md w-full rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-[#2c2c64]">Welcome Back!</h2>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.email ? 'border-red-500' : ''}`}
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error.email && <span className="text-red-500 text-sm mt-1">{error.email}</span>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fc4b3b] ${error.password ? 'border-red-500' : ''}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 top-6 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
              {error.password && <span className="text-red-500 text-sm mt-1">{error.password}</span>}
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#fc4b3b] text-white py-3 rounded-lg font-semibold hover:bg-[#fc4b3b]/80"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Don't have an account section */}
          <div className="text-center mt-4">
            <p className="text-gray-600">Don't have an account? <a href="/register" className="text-[#fc4b3b] font-semibold">Register</a></p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;