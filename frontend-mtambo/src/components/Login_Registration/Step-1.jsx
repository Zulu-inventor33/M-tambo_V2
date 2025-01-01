import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';


import Input from './InputComponent';

const Step1 = ({ formData, handleInputChange, errors }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group mb-3">
                        <label className="form-label">First Name*</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            error={errors.firstName}
                            className="form-control"
                            placeholder="First Name"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group mb-3">
                        <label className="form-label">Last Name*</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            error={errors.lastName}
                            className="form-control"
                            placeholder="Last Name"
                        />
                    </div>
                </div>
            </div>
            <div className="form-group mb-3">
                <label className="form-label">Email Address*</label>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    placeholder="Email Address"
                    className="form-control"
                />
            </div>
            <div className="form-group mb-3">
                <label className="form-label">Phone number*</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                />
            </div>
            <div className="form-group mb-3">
                <label className="form-label">Password*</label>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
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
            <div className="form-group mb-3">
                <label className="form-label">Confirm Password*</label>
                <div className="password-input-wrapper">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle-button"
                    >
                        {showConfirmPassword ? (<FontAwesomeIcon icon={faEye} />) : (<FontAwesomeIcon icon={faEyeSlash} />)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1;