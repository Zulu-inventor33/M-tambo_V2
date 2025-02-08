import React, { useState, useEffect } from "react";

const ConditionReport = ({ handleAdditionalDetailsChange, additionalDetails }) => {
    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h5>Assignments</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="d-flex align-items-center justify-content-between">
                                <label className="form-check-label" htmlFor="validationFormCheck1">
                                    See the client for any complaints
                                </label>
                                <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="card">
                    <div className="card-header">
                        <h5>Have a ride in the lift and check the following</h5>
                    </div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0 pt-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" htmlFor="validationFormCheck1">
                                        Alarm Bell OK
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="alarmBell" checked readOnly />
                                </div>
                            </li>
                            <li className="list-group-item px-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" htmlFor="validationFormCheck1">
                                        Any noise while lift is in motion?
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="noiseInMotion" checked readOnly />
                                </div>
                            </li>
                            <li className="list-group-item px-0 pb-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" htmlFor="validationFormCheck1">
                                        Are cabin lights in good condition?
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="cabinLights" checked readOnly />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="card">
                    <div className="card-header">
                        <h5>Have a ride in the lift and check the following</h5>
                    </div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0 pt-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" htmlFor="validationFormCheck1">
                                        Is position indicator in good condition?
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="positionIndicator" checked readOnly />
                                </div>
                            </li>
                            <li className="list-group-item px-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" htmlFor="validationFormCheck1">
                                        All hall lantern indicators?
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="hallLanterns" checked readOnly />
                                </div>
                            </li>
                            <li className="list-group-item px-0 pb-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" htmlFor="validationFormCheck1">
                                        Is cabin flooring in good condition?
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="cabinFlooring" checked readOnly />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Additional Comments Section */}
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h5>Additional Comments or Details</h5>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="additionalDetails">Enter any additional comments or details:</label>
                            <textarea
                                id="additionalDetails"
                                className="form-control"
                                rows="4"
                                value={additionalDetails}
                                onChange={handleAdditionalDetailsChange}
                                placeholder="Provide any extra observations, concerns, or details..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConditionReport;