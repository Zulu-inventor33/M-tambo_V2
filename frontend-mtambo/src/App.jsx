import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-tooltip/dist/react-tooltip.css';
import LoadingBar from "react-top-loading-bar";

import AuthProvider from './context/AuthenticationContext';
import PrivateRoute from './router/PrivateRoute';
import { SidebarToggleProvider } from './context/SidebarToggleContext';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

const App = () => {
	const [progress, setProgress] = useState(0);
	const [primaryColor, setPrimaryColor] = useState('#1890ff');

	useEffect(() => {
		const body = document.body;
		const preset = body.getAttribute('data-pc-preset');
		let color;

		switch (preset) {
			case 'preset-2':
				color = '#3366ff';
				break;
			case 'preset-3':
				color = '#7265e6';
				break;
			case 'preset-4':
				color = '#068e44';
				break;
			case 'preset-5':
				color = '#3c64d0';
				break;
			case 'preset-6':
				color = '#f27013';
				break;
			case 'preset-7':
				color = '#2aa1af';
				break;
			case 'preset-8':
				color = '#00a854';
				break;
			case 'preset-9':
				color = '#009688';
				break;
			default:
				color = '#1890ff';
				break;
		}
		setPrimaryColor(color);
	}, []);

	return (
		<div>
			<ToastContainer />
			<BrowserRouter>
				<LoadingBar
					color={primaryColor}
					progress={progress}
					onLoaderFinished={() => setProgress(0)}
					style={{ height: '4px' }}
				/>
				<div className="App">
					<AuthProvider>
						<Routes>
							<Route path="/" element={<Home setProgress={setProgress} />} />
							<Route path="/about" element={<About setProgress={setProgress} />} />
							<Route path="/login" element={<Login setProgress={setProgress} />} />
							<Route path="/forgot-password" element={<ForgotPassword setProgress={setProgress} />} />
							<Route path="/register" element={<Register setProgress={setProgress} />} />
							<Route element={<PrivateRoute />}>
								<Route
									path="/dashboard/*"
									element={
										<SidebarToggleProvider>
											<Dashboard setProgress={setProgress} />
										</SidebarToggleProvider>
									}
								/>
							</Route>
						</Routes>
					</AuthProvider>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
