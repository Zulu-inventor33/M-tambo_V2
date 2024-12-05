import React from 'react';
import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      // Check if user data is available in localStorage
      const storedUser = localStorage.getItem('user');
      const storedAccessToken = localStorage.getItem('access_token');
  
      if (storedUser && storedAccessToken) {
        // If user is authenticated, set user state
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    }, []);
  
    const login = (userData, accessToken) => {
      // Save user and token in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('access_token', accessToken);
      setUser(userData);
      setIsAuthenticated(true);
    };
  
    const logout = () => {
      // Clear user data and tokens from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      setUser(null);
      setIsAuthenticated(false);
    };
  
    return (
      <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
};
  
export { AuthProvider, AuthContext };