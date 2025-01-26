import React, { useState } from "react";

const CalendarEventModal = ({ showEventModal, eventData, onClose }) => {
    // If modal is not visible, don't render anything
    if (!showEventModal) return null;

    return (
        <>
            <div class={`modal-backdrop ${showEventModal ? 'fade show' : ''}`}></div>
            <div className={`modal ${showEventModal ? "fade show" : ""}`} tabIndex="-1" aria-hidden="true" style={{ display: 'block' }} role="dialog">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="calendar-modal-title f-w-600 text-truncate">{eventData.title}</h3>
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
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <div className="avtar avtar-xs bg-light-secondary">
                                        <i className="ti ti-heading f-20"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-1"><b>Technician</b></h5>
                                    <p className="pc-event-title text-muted">{eventData.technician}</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <div className="avtar avtar-xs bg-light-warning">
                                        <i className="ti ti-map-pin f-20"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-1"><b>Venue</b></h5>
                                    <p className="pc-event-venue text-muted">{eventData.venue}</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <div className="avtar avtar-xs bg-light-danger">
                                        <i className="ti ti-calendar-event f-20"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-1"><b>Date</b></h5>
                                    <p className="pc-event-date text-muted">{eventData.date}</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <div className="avtar avtar-xs bg-light-primary">
                                        <i className="ti ti-file-text f-20"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h5 className="mb-1"><b>Description</b></h5>
                                    <p className="pc-event-description text-muted">{eventData.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            <ul className="list-inline me-auto mb-0">
                                <li className="list-inline-item align-bottom">
                                    <button className="avtar avtar-s btn-link-danger btn-pc-default w-sm-auto">
                                        <i className="ti ti-trash f-18"></i> Delete
                                    </button>
                                </li>
                                <li className="list-inline-item align-bottom">
                                    <button className="avtar avtar-s btn-link-success btn-pc-default">
                                        <i className="ti ti-edit-circle f-18"></i> Edit
                                    </button>
                                </li>
                            </ul>
                            <div className="flex-grow-1 text-end">
                                <button type="button" className="btn btn-primary" onClick={onClose}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CalendarEventModal;