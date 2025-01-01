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
				// Mocking the user details for now before api improved
				const dummyUser = {
					first_name: "Dummy",
					last_name: "Dummy2",
					email: "dummy@gmail.com",
					phone_number: "1234567892",
					account_type: "maintenance",
					created_at: "2024-12-26 17:07:12.635736",
					is_staff: 0
				};
				setUser(dummyUser);
				setToken(response?.data?.access);
				localStorage.setItem("site", response?.data?.access);
				// Correctly store the user object as a string in localhost
				localStorage.setItem("user", JSON.stringify(dummyUser));
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