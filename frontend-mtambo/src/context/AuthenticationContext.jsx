import React from 'react';
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Session expiry duration in milliseconds (1 day = 86400000 ms)
  const sessionExpiryDuration = 86400000; 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAccessToken = localStorage.getItem('access_token');
    const storedLoginTime = localStorage.getItem('login_time');

    if (storedUser && storedAccessToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Check if the session has expired
        if (storedLoginTime && Date.now() - parseInt(storedLoginTime) > sessionExpiryDuration) {
          // Session has expired, log the user out
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('login_time');
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Session is valid, set user state
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        // In case of error, log out the user
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('login_time');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      // No user data or token in localStorage, user is not authenticated
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Handle login
  const login = (userData, accessToken, refreshToken) => {
    const loginTime = Date.now();
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('login_time', loginTime.toString());
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('login_time');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };