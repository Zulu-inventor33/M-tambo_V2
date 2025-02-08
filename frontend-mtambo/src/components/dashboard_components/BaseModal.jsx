import React from "react";
import { FiCheckCircle } from "react-icons/fi"; // Using react-icons for the check-circle icon
import { FaArrowRight } from "react-icons/fa"; // Adding an arrow icon to guide the next step

const BaseModal = ({ showBaseModal, onClose, title, message, onSuccessAction }) => {
    // If modal is not visible, don't render anything
    if (!showBaseModal) return null;

    return (
        <>
            <div className={`modal-backdrop ${showBaseModal ? 'fade show' : ''}`}></div>
            <div className={`modal ${showBaseModal ? "fade show" : ""}`} tabIndex="-1" aria-hidden="true" style={{ display: 'block' }} role="dialog">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="calendar-modal-title f-w-600 text-truncate">
                                {title}
                            </h3>
                            <button
                                type="button"
                                className="close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={onClose}
                            >
                                <i className="ti ti-x f-20"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            {title === 'Success' && (
                                <>
                                    <div className="text-center">
                                        {/* Success Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check text-success">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                            <path d="M9 12l2 2l4 -4" />
                                        </svg>
                                    </div>
                                    <p className="text-muted mt-3">
                                        <strong>{message}</strong>
                                    </p>
                                    <p className="text-muted">
                                        The next step is to <strong>create a maintenance schedule</strong> for the elevator to finish the process.
                                        Please proceed with that to complete the setup.
                                    </p>
                                </>
                            )}

                            {title === 'Error' && (
                                <p className="text-muted">{message}</p>
                            )}
                        </div>
                        <div className="modal-footer justify-content-between">
                            {title === 'Error' && (
                                <div className="flex-grow-1 text-end">
                                    <button type="button" className="btn btn-primary" onClick={onClose}>
                                        Close
                                    </button>
                                </div>
                            )}

                            {title === 'Success' && (
                                <div className="flex-grow-1 text-end">
                                    <button type="button" className="btn btn-success" onClick={onSuccessAction}>
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BaseModal;