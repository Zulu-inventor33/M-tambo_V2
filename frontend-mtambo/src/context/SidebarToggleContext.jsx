import React, { createContext, useState, useContext } from 'react';

// Create the Context
const SidebarToggleContext = createContext();

// Create a provider component
export const SidebarToggleProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Function to toggle the collapse state
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  return (
    <SidebarToggleContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {children}
    </SidebarToggleContext.Provider>
  );
};

// Custom hook to use the SidebarToggleContext
export const useSidebarToggle = () => {
  return useContext(SidebarToggleContext);
};