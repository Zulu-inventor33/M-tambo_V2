import React, { createContext, useContext, useState } from 'react';

// Create the Loader Context
const LoaderContext = createContext();

// Custom hook to use loader context
export const useLoader = () => useContext(LoaderContext);

// LoaderProvider to wrap the app and provide loading state
export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};