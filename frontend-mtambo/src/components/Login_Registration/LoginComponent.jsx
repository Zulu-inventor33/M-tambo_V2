import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthenticationContext';

import './LoginComponent.css';

const LoginComponent = ({ setProgress }) => {
	const navigate = useNavigate();
	const { loginAction } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [isShaking, setIsShaking] = useState(false);

	useEffect(() => {
		setProgress(40);
		setTimeout(() => {
			setProgress(100);
		}, 800)
	}, [])

	const handleRegisterRedirect = (e) => {
		e.preventDefault();
		navigate('/register');
	};

	const handleForgotPassword = (e) => {
		e.preventDefault();
		navigate('/forgot-password');
	};

	// Handle email and password validation
	const validateForm = () => {
		let formErrors = { email: '', password: '' };
		let valid = true;

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!email) {
			formErrors.email = 'Email is required';
			valid = false;
		} else if (!emailRegex.test(email)) {
			formErrors.email = 'Please enter a valid email address';
			valid = false;
		}

		if (!password) {
			formErrors.password = 'Password is required';
			valid = false;
		} else if (password.length < 6) {
			formErrors.password = 'Password must be at least 6 characters';
			valid = false;
		}

		setError(formErrors);
		return valid;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			setLoading(true);
			const userData = {
				email_or_phone: email,
				password: password
			};
			console.log("Data to be submitted for Login:", JSON.stringify(userData));
			loginAction(userData);
		}
	};

	return (
		<div className="auth-main">
			<div className="auth-wrapper v3">
				<div className="auth-form">
					{/* header section is here */}
					<div className="auth-header">
						<Link to="/">
							<h3>M-TAMBO</h3>
						</Link>
					</div>
					<div className={`card my-5 ${isShaking ? 'shake-animation' : ''}`}>
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-end mb-4">
								<h3 className="mb-0"><b>Sign in</b></h3>
								<a href="#" className="link-primary" onClick={handleRegisterRedirect}>
									Don't have an account?
								</a>
							</div>
							<form onSubmit={handleSubmit} autoComplete="off">
								{/* email input section */}
								<div className="form-group mb-3">
									<label htmlFor="email" className="form-label">Email Address</label>
									<input
										type="email"
										id="email"
										name="email"
										placeholder="Email Address"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										className="form-control"
									/>
									{error.email && <span className="text-red-500 text-sm mt-1">{error.email}</span>}
								</div>
								{/* password input section */}
								<div className="form-group mb-3">
									<label className="form-label">Password</label>
									<div className="password-input-wrapper">
										<input
											id="password"
											name="password"
											type={showPassword ? 'text' : 'password'}
											autoCorrect="off"
											placeholder="Enter password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											className="form-control"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="password-toggle-button"
										>
											{showPassword ? (<FontAwesomeIcon icon={faEye} />) : (<FontAwesomeIcon icon={faEyeSlash} />)}
										</button>
									</div>
								</div>
								<div className="d-flex mt-1 justify-content-between">
									<div className="form-check">
										<input className="form-check-input input-primary" type="checkbox" id="customCheckc1" defaultChecked={true} />
										<label className="form-check-label text-muted" htmlFor="customCheckc1">Keep me sign in</label>
									</div>
									<h5 className="text-secondary f-w-400">
										<a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
									</h5>
								</div>
								{/*Sign in button */}
								<div className="d-grid mt-4">
									<button type="submit" className="btn btn-primary">Sign In</button>
								</div>
							</form>
							{/* or Separator */}
							<div className="saprator mt-3">
								<span>Login with</span>
							</div>
							<div className="row">
								<div className="col-12">
									<div className="d-grid">
										<button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
											<img src="../assets/images/authentication/google.svg" alt="Google" />
											<span className="d-none d-sm-inline-block"> Google</span>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="auth-footer row">
						<div className="col my-1">
							<p className="m-0">Copyright © <a href="/">M-TAMBO</a></p>
						</div>
						<div className="col-auto my-1">
							<ul className="list-inline footer-link mb-0">
								<li className="list-inline-item"><a href="#">Home</a></li>
								<li className="list-inline-item"><a href="#">Privacy Policy</a></li>
								<li className="list-inline-item"><a href="#">Contact Us</a></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginComponent;