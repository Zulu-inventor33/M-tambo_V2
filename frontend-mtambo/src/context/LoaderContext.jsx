import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Loader Context
const LoaderContext = createContext();

// Custom hook to use loader context
export const useLoader = () => useContext(LoaderContext);

// LoaderProvider to wrap the app and provide loading state
export const LoaderProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);

	// Reset loader state when the app reloads (on page refresh)
	useEffect(() => {
		// This ensures the loader state is reset to false when the page is refreshed or reloaded
		setIsLoading(false);
	}, []);

	const startLoading = () => setIsLoading(true);
	const stopLoading = () => setIsLoading(false);

	return (
		<LoaderContext.Provider value={{ isLoading, startLoading, stopLoading }}>
			{children}
		</LoaderContext.Provider>
	);
};