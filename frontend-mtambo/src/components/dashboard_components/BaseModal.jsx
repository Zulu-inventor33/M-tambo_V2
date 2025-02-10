import React from "react";

const BaseModal = ({ 
    showBaseModal, 
    modalHeader, 
    onClose, 
    title, 
    message, 
    onSuccessAction, 
    buttonText
 }) => {

    // If modal is not visible, don't render anything
    if (!showBaseModal) return null;

    return (
        <>
            <div className={`modal-backdrop ${showBaseModal ? 'fade show' : ''}`}></div>
            <div className={`modal ${showBaseModal ? "fade show" : ""}`} tabIndex="-1" aria-hidden="true" style={{ display: 'block' }} role="dialog">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        {modalHeader && (
                            <div className="modal-header">
                                <h3 className="calendar-modal-title f-w-600 text-truncate">
                                    Modal Header
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
                        )}
                        <div className="modal-body">
                            {title === 'Success' && (
                                <>
                                    <div className="card-body text-center">
                                        <div className="mb-3" style={{ fontSize: '50px', color: '#068e44' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={55} height={55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-square-check">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                                                <path d="M9 12l2 2l4 -4" />
                                            </svg>
                                        </div>
                                        <h4>Success! Your request was completed successfully.</h4>
                                        <h6 className='mt-4'>{message}</h6>
                                    </div>
                                </>
                            )}

                            {title === 'Error' && (
                                <>
                                    <div className="card-body text-center">
                                        <div className="mb-3" style={{ fontSize: '50px', color: '#d9534f' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-face-id-error">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                                                <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                                                <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                                                <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
                                                <path d="M9 10h.01" />
                                                <path d="M15 10h.01" />
                                                <path d="M9.5 15.05a3.5 3.5 0 0 1 5 0" />
                                            </svg>
                                        </div>

                                        <h4>Uh oh! Something went wrong.</h4>
                                        <h6 className='mt-4'>{message}</h6>
                                    </div>
                                </>

                            )}
                        </div>
                        <div className="modal-footer">
                            {title === 'Error' && (
                                <div className="flex-grow-1 text-end">
                                    <button type="button" className="btn btn-primary" onClick={onClose}>
                                        Close
                                    </button>
                                </div>
                            )}

                            {title === 'Success' && (
                                <div className="flex-grow-1 text-end">
                                    <button type="button" className="btn btn-info" onClick={onSuccessAction}>
                                        {buttonText}
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