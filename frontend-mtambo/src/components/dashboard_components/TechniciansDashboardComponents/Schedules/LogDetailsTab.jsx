import React from "react";

const LogDetailsTab = ({
    building, 
    location, 
    machine_number, 
    machine_type, 
    controller_type, 
    technician_full_name, 
    date, 
    approved_by
}) => {

    return (
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5>QUALITY CHECK SHEET</h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item px-0 pt-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-2">
                                        <p class="mb-2">Building</p>
                                        <p class="mb-0 text-muted">
                                            {building}
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item px-0 pb-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-2">
                                        <p class="mb-2">Location</p>
                                        <p class="mb-0 text-muted">{location}</p>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item px-0 pb-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-2">
                                        <p class="mb-2">Machine Number</p>
                                        <p class="mb-0 text-muted">
                                            {machine_number}
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item px-0 pb-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-2">
                                        <p class="mb-2">Machine Type</p>
                                        <p class="mb-0 text-muted">{machine_type}</p>
                                    </div>
                                </div>
                            </li>
                            <li class="list-group-item px-0 pb-0">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="me-2">
                                        <p class="mb-2">Controller Type</p>
                                        <p class="mb-0 text-muted">{controller_type}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5>Technician Details</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="form-label">Technician Name</label>
                                    <input type="text" class="form-control" value={technician_full_name} readOnly />
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label class="form-label">Approved By</label>
                                    <input type="text" class="form-control" value={approved_by} readOnly />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input type="text" className="form-control" id="pc-datepicker-3" value={date} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 text-end">
                <button class="btn btn-primary">Fill condition report</button>
            </div>
        </div>
    )
}

export default LogDetailsTab;