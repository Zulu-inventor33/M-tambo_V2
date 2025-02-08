import React from "react";

const StatCards = ({ scheduleType, scheduledJobs, overdueJobs, completedJobs }) => (
    <div className="row row-card-no-pd mt--2">
        <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h5>
                                {scheduleType === 'Regular' ? (
                                    <b>Total Regular Schedules</b>

                                ) : (
                                    <b>Total Ad Hoc Schedules</b>
                                )}
                            </h5>
                        </div>
                        <h3 className="text-info fw-bold">{scheduledJobs.length}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h5>
                                {scheduleType === 'Regular' ? (
                                    <b>Overdue Regular Schedules</b>

                                ) : (
                                    <b>Overdue Ad Hoc Schedules</b>
                                )}
                            </h5>
                        </div>
                        <h3 className="text-success fw-bold">{overdueJobs.length}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div>
                            <h5>
                                {scheduleType === 'Regular' ? (
                                    <b>Completed Regular Schedules</b>

                                ) : (
                                    <b>Completed Ad Hoc Schedules</b>
                                )}
                            </h5>
                        </div>
                        <h3 className="text-danger fw-bold">{completedJobs.length}</h3>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-12 col-sm-6 col-md-6 col-xl-3">
            <div className="card">
                <div className="card-body">
                    <a href="#" class="btn btn-secondary w-100">View More Details</a>
                </div>
            </div>
        </div>
    </div>
);

export default StatCards;