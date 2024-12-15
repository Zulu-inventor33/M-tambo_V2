import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCode, faTools, faWrench } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { notifySuccess, notifyError } from '../../utils/notificationUtils';

const RegistrationComponent = () => {
    // State management for form data
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        accountType: '',
        developerName: '',
        developerAddress: '',
        specialization: '',
        companyName: '',
        companyAddress: '',
        companyRegNumber: '',
        equipmentSpecialization: '',
        affiliatedCompany: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(0);
    const [registrationMethod, setRegistrationMethod] = useState(null);
    //this error state will store the error whenever data is being validated.
    const [error, setErrors] = useState({});
    //this errorMessages state will store the errors incase the user goes to next step without
    //filling all the steps
    const [errorMessages, setErrorMessages] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let errors = {};
        let valid = true;

        if (!formData.email) {
            errors.email = 'Email is required';
            valid = false;
        }

        if (!formData.firstName) {
            errors.firstName = 'First name is required';
            valid = false;
        }

        if (!formData.lastName) {
            errors.lastName = 'Last name is required';
            valid = false;
        }

        if (!formData.phone) {
            errors.phone = 'Phone number is required';
            valid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
            valid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const isStepComplete = () => {
        const errors = [];
        if (step === 1) {
            if (formData.email === '' || formData.firstName === '' || formData.lastName === '') {
                errors.push("Please fill out all fields.");
            }
        } else if (step === 2) {
            if (formData.phone === '' || formData.password === '' || formData.confirmPassword === '' || formData.password !== formData.confirmPassword) {
                errors.push("Please fill out all fields and make sure passwords match.");
            }
        } else if (step === 3) {
            if (formData.accountType === '') {
                errors.push("Please select an account type.");
            }
        } else if (step === 4) {
            if (formData.accountType === 'developer' && (formData.developerName === '' || formData.developerAddress === '')) {
                errors.push("Please fill out all fields for Developer.");
            } else if (formData.accountType === 'maintenance' && (formData.companyName === '' || formData.companyAddress === '')) {
                errors.push("Please fill out all fields for Maintenance.");
            } else if (formData.accountType === 'technician' && (formData.equipmentSpecialization === '' || formData.affiliatedCompany === '')) {
                errors.push("Please fill out all fields for Technician.");
            }
        }

        // If there are errors, update the state and return false
        if (errors.length > 0) {
            setErrorMessages(errors);
            console.log(errorMessages);
            return false;
        }

        // Clear errors if step is complete
        setErrorMessages([]);
        return true;
    };

    // Navigate to the next step if the current step is complete
    const handleNextStep = () => {
        if (isStepComplete()) {
            setStep(step + 1);
        }
    };

    // Navigate to the previous step
    const handlePrevStep = () => {
        setErrorMessages([]);
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Handle registration method (Email or Google)
    const handleRegistrationMethod = (method) => {
        setRegistrationMethod(method);
        if (method === 'email') {
            // Start with step 1 for email registration
            setStep(1);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);
            const userData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone_number: formData.phone,
                password: formData.password,
                account_type: formData.accountType,
            };

            if (formData.accountType === 'developer') {
                userData.developer_name = formData.developerName;
                userData.address = formData.developerAddress;
            } else if (formData.accountType === 'maintenance') {
                userData.company_name = formData.companyName;
                userData.company_address = formData.companyAddress;
                userData.company_registration_number = formData.companyRegNumber;
                userData.specialization = formData.specialization;
            } else if (formData.accountType === 'technician') {
                userData.equipment_specialization = formData.equipmentSpecialization;
                userData.affiliated_company = formData.affiliatedCompany;
            }

            try {
                const response = await axios.post('/api/signup/', JSON.stringify(userData), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                // the response that I get from server api is user details if reg is successfull contains
                // the user details
                if (response?.data?.first_name === formData.firstName) {
                    console.log("yoooooooooooooooooooooooo");
                    notifySuccess("Registration successful! Welcome to M-tambo.");
                    setLoading(false);
                }
                return;
            } catch (error) {
                setLoading(false);
                const errorMessage = error.response?.data?.error || 'Something went wrong!';
                console.log("Error message:", errorMessage);
                notifyError(errorMessage);
                if (error.response?.data?.error === 'A user with this email already exists.') {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        email: 'A user with this email already exists.',
                    }));
                } else {
                    notifyError(errorMessage);
                }
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-new">
            {/* Navigation header section */}
            <nav>
                <Link to="/" className="login-page-new__logo">
                    <h2 className="login-page-new__logo-header-black">M-TAMBO</h2>
                    <div className="login-page-new__logo-text"> The maintenance system for all. </div>
                </Link>
                <div className="login-page-new__top-right">
                    <div className="login-page-new__top-right-text"> Already a member of M-TAMBO? </div>
                    <Link to="/login" className="login-page-new__top-right-button">Login</Link>
                </div>
            </nav>
            <div className="login-page-new__main-top-divider"></div>
            {/* this is where the details begins */}
            <div className="login-page-new__main">
                <div className="login-page-new__main-bg"></div>
                <div className="login-page-new__main-container">
                    <div className="login-page-new__main-form">
                        <div className="login-page-new__main-form-title-brand"></div>
                        <h1 className="login-page-new__main-form-title">Welcome to M-TAMBO!</h1>

                        {/* Show error messages if any */}
                        {errorMessages.length > 0 && (
                            <div className="error-messages">
                                {errorMessages.map((msg, idx) => (
                                    <p key={idx} className="error-text">
                                        <span className="error-icon">⚠️</span> {msg}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Step 0: Registration method selection */}
                        {step === 0 && (
                            <>
                                <div className='g-sign-in-button'>
                                    <div className='content-wrapper'>
                                        <div className='logo-wrapper'>
                                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="google icon" />
                                        </div>
                                        <span className="text-container">
                                            <span>Continue with Google</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="social-login-divider">
                                    <span className="social-login-divider_text">or</span>
                                </div>
                                <div className='g-sign-in-button' onClick={() => handleRegistrationMethod('email')}>
                                    <div className='content-wrapper'>
                                        <div className='logo-wrapper'>
                                            <img src="/images/email_img.webp" alt="email icon" />
                                        </div>
                                        <span className="text-container">
                                            <span>Register with email</span>
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Email registration form */}
                        {registrationMethod === 'email' && (
                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Personal Information */}
                                {step === 1 && (
                                    <>
                                        <div className="login-page-new__main-form-row">
                                            <label htmlFor="email" className="login-page-new__main-form-row-label">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="login-page-new__main-form-row">
                                            <label htmlFor="firstName" className="login-page-new__main-form-row-label">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                placeholder="Enter your first name"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="login-page-new__main-form-row">
                                            <label htmlFor="lastName" className="login-page-new__main-form-row-label">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Enter your last name"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Step 2: Password and phone number */}
                                {step === 2 && (
                                    <>
                                        <div className="login-page-new__main-form-row">
                                            <div className="login-page-new__main-form-row">
                                                <label htmlFor="phoneNumber" className="login-page-new__main-form-row-label">Phone Number</label>
                                                <input
                                                    type="text"
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="Enter your phone number"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <label htmlFor="password" className="login-page-new__main-form-row-label">Password</label>
                                            <div className="password-input-wrapper">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    placeholder="Enter your password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
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
                                        <div className="login-page-new__main-form-row">
                                            <label htmlFor="confirmPassword" className="login-page-new__main-form-row-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Step 3: Account Type */}
                                {step === 3 && (
                                    <>
                                        <div className='login-page-new__main-form-row'>
                                            <h2 className="account-type-title">Choose Account Type</h2>
                                            <div className="account-type-options">
                                                {/* Account Type Selection with Custom Styled Radio Buttons */}
                                                <div className="account-type-option">
                                                    <input
                                                        type="radio"
                                                        id="developer"
                                                        name="accountType"
                                                        value="developer"
                                                        checked={formData.accountType === 'developer'}
                                                        onChange={handleInputChange}
                                                        className="account-type-radio"
                                                    />
                                                    <label htmlFor="developer" className="account-type-label">
                                                        <FontAwesomeIcon icon={faCode} className="account-type-icon" />
                                                        <span>Developer</span>
                                                    </label>
                                                </div>
                                                <div className="account-type-option">
                                                    <input
                                                        type="radio"
                                                        id="maintenance"
                                                        name="accountType"
                                                        value="maintenance"
                                                        checked={formData.accountType === 'maintenance'}
                                                        onChange={handleInputChange}
                                                        className="account-type-radio"
                                                    />
                                                    <label htmlFor="maintenance" className="account-type-label">
                                                        <FontAwesomeIcon icon={faWrench} className="account-type-icon" />
                                                        <span>Maintenance</span>
                                                    </label>
                                                </div>
                                                <div className="account-type-option">
                                                    <input
                                                        type="radio"
                                                        id="technician"
                                                        name="accountType"
                                                        value="technician"
                                                        checked={formData.accountType === 'technician'}
                                                        onChange={handleInputChange}
                                                        className="account-type-radio"
                                                    />
                                                    <label htmlFor="technician" className="account-type-label">
                                                        <FontAwesomeIcon icon={faTools} className="account-type-icon" />
                                                        <span>Technician</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step 4: Account Type-specific Fields */}
                                {step === 4 && (
                                    <>
                                        {formData.accountType === 'developer' && (
                                            <>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="developerName" className="login-page-new__main-form-row-label">Developer Name</label>
                                                    <input
                                                        type="text"
                                                        id="developerName"
                                                        name="developerName"
                                                        placeholder="Enter developer name"
                                                        value={formData.developerName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="developerAddress" className="login-page-new__main-form-row-label">Developer Address</label>
                                                    <input
                                                        type="text"
                                                        id="developerAddress"
                                                        name="developerAddress"
                                                        placeholder="Enter developer address"
                                                        value={formData.developerAddress}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {formData.accountType === 'maintenance' && (
                                            <>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="companyName" className="login-page-new__main-form-row-label">Company Name</label>
                                                    <input
                                                        type="text"
                                                        id="companyName"
                                                        name="companyName"
                                                        placeholder="Enter company name"
                                                        value={formData.companyName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="companyAddress" className="login-page-new__main-form-row-label">Company Address</label>
                                                    <input
                                                        type="text"
                                                        id="companyAddress"
                                                        name="companyAddress"
                                                        placeholder="Enter company address"
                                                        value={formData.companyAddress}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="companyRegNumber" className="login-page-new__main-form-row-label">Company Registration Number</label>
                                                    <input
                                                        type="text"
                                                        id="companyRegNumber"
                                                        name="companyRegNumber"
                                                        placeholder="Company registration number"
                                                        value={formData.companyRegNumber}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="specialization" className="login-page-new__main-form-row-label">Specialization</label>
                                                    <input
                                                        type="text"
                                                        id="specialization"
                                                        name="specialization"
                                                        placeholder="Specialization"
                                                        value={formData.specialization}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {formData.accountType === 'technician' && (
                                            <>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="equipmentSpecialization" className="login-page-new__main-form-row-label">Equipment Specialization</label>
                                                    <input
                                                        type="text"
                                                        id="equipmentSpecialization"
                                                        name="equipmentSpecialization"
                                                        placeholder="Enter equipment specialization"
                                                        value={formData.equipmentSpecialization}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="login-page-new__main-form-row">
                                                    <label htmlFor="affiliatedCompany" className="login-page-new__main-form-row-label">Affiliated Company</label>
                                                    <input
                                                        type="text"
                                                        id="affiliatedCompany"
                                                        name="affiliatedCompany"
                                                        placeholder="Enter affiliated company"
                                                        value={formData.affiliatedCompany}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                {/* Navigation buttons */}
                                <div className="login-page-new__main-form-buttons">
                                    {step > 1 && (
                                        <button type="button" className="prev-button" onClick={handlePrevStep}>
                                            Previous
                                        </button>
                                    )}
                                    {step < 4 && (
                                        <button type="button" className="next-button" onClick={handleNextStep}>
                                            Next
                                        </button>
                                    )}
                                    {step === 4 && (
                                        <button type="submit" className="submit-button">
                                        Sign Up
                                    </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationComponent;