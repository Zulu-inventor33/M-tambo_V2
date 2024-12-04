import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });
  
  // Handle email and password validation
  const validateForm = () => {
    let formErrors = { email: '', password: '' };
    let valid = true;

    if (!email) {
      formErrors.email = 'Email is required';
      valid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      valid = false;
    }

    setError(formErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted');
    }
  };

  return (
    <div className='relative bg-gray-100 overflow-hidden'>
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

          {/* Error message (e.g., email not verified) */}
          {/* This can be a dynamic error if needed */}
          {/* Example: */}
          {/* {verificationNeeded && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-4">
              <strong className="font-semibold">Warning!</strong> Verification needed
              <br />
              <button className="text-[#fc4b3b] font-semibold">Resend verification email</button>
            </div>
          )} */}

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
                  <svg width="18px" height="18px" viewBox="0 0 24 24" stroke="#000000">
                    <path d="M2 2L22 22" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18px" height="18px" viewBox="0 0 24 24" stroke="#000000">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              {error.password && <span className="text-red-500 text-sm mt-1">{error.password}</span>}
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-[#fc4b3b] text-white py-3 rounded-lg font-semibold hover:bg-[#fc4b3b]/80"
              >
                Sign In
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