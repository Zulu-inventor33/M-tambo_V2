import React from "react";
import { useNavigate } from 'react-router-dom';

import { useLoader } from "../context/LoaderContext";

const ForgotPasswordComponent = () => {
    const { startLoading, stopLoading } = useLoader();
    const navigate = useNavigate();

    const handleBackToLogin = (e) => {
        e.preventDefault();
        startLoading();
    
        // Set a timeout to stop the loader after 1.5 seconds
        setTimeout(() => {
          stopLoading(); // Stop the loader after 1.5 seconds
        }, 1500);
    
        navigate('/login');
    }
    return (
        <div className="auth-main">
            <div className="auth-wrapper v3">
                <div className="auth-form">
                    <div className="auth-header">
                        <h3>M-TAMBO</h3>
                    </div>
                    <div className="card my-5">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <h3 className="mb-0">
                                    <b>Forgot Password</b>
                                </h3>
                                <a href="#" className="link-primary" onClick={handleBackToLogin}>
                                    Back to Login
                                </a>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="Email Address"
                                />
                            </div>
                            <p className="mt-4 text-sm text-muted">
                                Do not forgot to check SPAM box.
                            </p>
                            <div className="d-grid mt-3">
                                <button type="button" className="btn btn-primary">Send Password Reset Email</button>
                            </div>
                        </div>
                    </div>
                    <div className="auth-footer row">
                        <div className="col my-1">
                            <p className="m-0">Copyright © <a href="#">M-TAMBO</a></p>
                        </div>
                        <div className="col-auto my-1">
                            <ul className="list-inline footer-link mb-0">
                                <li className="list-inline-item"><a href="/">Home</a></li>
                                <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
                                <li className="list-inline-item"><a href="#">Contact us</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordComponent;