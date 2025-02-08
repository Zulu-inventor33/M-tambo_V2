import React from "react";

const MaintenanceLog = ({ handleMaintenanceDetailsChange, maintenanceDetails, handleSubmit }) => {
    return (
        <div className="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Stop the lift at the top floor and from the machine room, carry out the following:</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="d-flex align-items-center justify-content-between">
                                <label className="form-check-label" for="validationFormCheck1">
                                    Check the machine gear and bearing oil level(for geared machines)
                                </label>
                                <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Have a ride in the lift and check the following</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item px-0 pt-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" for="validationFormCheck1">
                                        Check the machine break for wear.
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
                                </div>
                            </li>
                            <li class="list-group-item px-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" for="validationFormCheck1">
                                        Check the controller for any loose connection.
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
                                </div>
                            </li>
                            <li class="list-group-item px-0 pb-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" for="validationFormCheck1">
                                        Blow out the dust from controller.
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Have a ride in the lift and check the following</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item px-0 pt-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" for="validationFormCheck1">
                                        Clean the machine and machine room.
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
                                </div>
                            </li>
                            <li class="list-group-item px-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" for="validationFormCheck1">
                                        Clean the top of car - oil the guard rails.
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
                                </div>
                            </li>
                            <li class="list-group-item px-0 pb-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" for="validationFormCheck1">
                                        Put the lift back in service and observe its operation for 30 minutes.
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
                                </div>
                            </li>
                            <li class="list-group-item px-0 pb-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <label className="form-check-label" for="validationFormCheck1">
                                        Get the time sheet signed.
                                    </label>
                                    <input type="checkbox" className="form-check-input" id="validationFormCheck1" checked required />
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
                                value={maintenanceDetails}
                                onChange={handleMaintenanceDetailsChange}
                                placeholder="Provide any extra observations, concerns, or details..."
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 text-end">
                <button
                    class="btn btn-primary"
                    onClick={handleSubmit}
                >
                    File Maintenance Log
                </button>
            </div>
        </div>
    );
};

export default MaintenanceLog;