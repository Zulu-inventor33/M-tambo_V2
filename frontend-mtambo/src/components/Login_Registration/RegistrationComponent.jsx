import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useLoader } from '../../context/LoaderContext';
import useForm from './UseForm';
import Step1 from './Step-1';
import Step2 from './Step-2';

const RegistrationComponent = () => {
    const { formData, handleInputChange, errors, errorMessages, step, setStep,
        handleSubmit, handleNextStep, handlePrevStep, handleSpecializationChange,
        maintenanceCompanies, loading, isShaking, setFormData
    } = useForm();
    const { startLoading, stopLoading } = useLoader();
    const navigate = useNavigate();

    const handleLoginRedirect = (e) => {
        e.preventDefault(); // Prevent the default link behavior
        startLoading(); // Start showing the loader

        // Set a timeout to stop the loader after 1.5 seconds
        setTimeout(() => {
            stopLoading(); // Stop the loader after 1.5 seconds
        }, 1500);

        // Immediately navigate to the login page without waiting
        navigate('/login');
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
                                <h3 className="mb-0"><b>Sign up</b></h3>
                                <a href="#" className="link-primary" onClick={handleLoginRedirect}>
                                    Already have an account?
                                </a>
                            </div>
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
                            <form onSubmit={handleSubmit} autoComplete="off">
                                {step === 1 && <Step1 formData={formData} handleInputChange={handleInputChange} errors={errors} />}
                                {step === 2 && (
                                    <Step2
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        handleSpecializationChange={handleSpecializationChange}
                                        maintenanceCompanies={maintenanceCompanies}
                                        setFormData={setFormData}
                                    />
                                )}
                                {/* Navigation buttons */}
                                <p className="mt-4 text-sm text-muted">
                                    By signing up, you agree to our
                                    <a href="#" className="text-primary"> Terms of Service </a>
                                    and <a href="#" className="text-primary"> Privacy Policy</a>
                                </p>
                                {step === 1 && (
                                    <div className="d-grid mt-3">
                                        <button type="button" className="next-button" onClick={handleNextStep}>
                                            Next Step
                                        </button>
                                    </div>
                                )}

                                <div className="row">
                                    {step === 2 && (
                                        <div className="d-flex justify-content-between">
                                            {/* Previous Button */}
                                            <button
                                                type="button"
                                                className="prev-button col-5 col-md-4"
                                                onClick={handlePrevStep}
                                            >
                                                Previous
                                            </button>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                className="submit-button col-5 col-md-4"
                                                disabled={loading}
                                            >
                                                {loading ? 'Signing Up...' : 'Sign Up'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                            <div className="separator mt-3">
                                <span>Or sign up with</span>
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

export default RegistrationComponent;