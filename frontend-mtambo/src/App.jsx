import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-tooltip/dist/react-tooltip.css'

import AuthProvider from './context/AuthenticationContext';
import PrivateRoute from './router/PrivateRoute';
import { SidebarToggleProvider } from './context/SidebarToggleContext';
import { LoaderProvider } from './context/LoaderContext';
import Loader from './components/LoaderComponent/Loader';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

const App = () => {
	return (
		<div>
			<LoaderProvider>
				<ToastContainer />
				<BrowserRouter>
					<div className="App">
						<Loader />
						<AuthProvider>
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/login" element={<Login />} />
								<Route path="/forgot-password" element={<ForgotPassword />} />
								<Route path="/register" element={<Register />} />
								<Route element={<PrivateRoute />}>
									<Route
										path="/dashboard/*"
										element={
											<SidebarToggleProvider>
												<Dashboard />
											</SidebarToggleProvider>
										}
									/>
								</Route>
							</Routes>
						</AuthProvider>
					</div>
				</BrowserRouter>
			</LoaderProvider>
		</div>
	);
}

export default App;
