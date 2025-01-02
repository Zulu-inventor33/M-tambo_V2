import React from "react";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifyError, notifySuccess } from "../utils/notificationUtils";


// manage the authentication state
const AuthContext = createContext();

// wrap the application and provide the authentication context to its child components
const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("site") || "");
	// Start in loading state
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	// Use useEffect to load user from localStorage when the app first mounts
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		// Set loading to false once we've checked localStorage
		setLoading(false);
	}, []);

	const loginAction = async (data) => {
		try {
			setLoading(true);
			const response = await axios.post(`/api/login/`, JSON.stringify(data), {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 200) {
				// Extract user data and tokens from the response
				const userData = {
					first_name: response.data.first_name,
					last_name: response.data.last_name,
					email: response.data.email,
					phone_number: response.data.phone_number,
					account_type: response.data.account_type,
					created_at: response.data.created_at,
					is_staff: response.data.is_staff,
				};
				// Set user data and token in the state
				setUser(userData);
				setToken(response.data.access);

				// Save the token and user data in localStorage
				localStorage.setItem("site", response.data.access);
				localStorage.setItem("user", JSON.stringify(userData));

				setLoading(false);

				notifySuccess("Welcome Back to M-tambo!");
				navigate("/dashboard");
				return;
			}
			throw new Error(response.message);
		} catch (err) {
			setLoading(false)
			const errorMessage = err.response?.data?.error || 'Something went wrong!';
			notifyError(errorMessage);
			console.error(err);
		}
	};

	const logOut = () => {
		setUser(null);
		setToken("");
		localStorage.removeItem("site");
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ token, user, loginAction, logOut, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;

// The useAuth custom hook utilizes useContext to access the authentication 
// context from within components
export const useAuth = () => {
	return useContext(AuthContext);
};