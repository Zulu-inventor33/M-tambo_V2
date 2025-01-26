import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const JobStatusSummary = () => {
    // Example data for today's jobs
    const jobs = [
        {
            id: 2,
            building: 'Tsavo Heights',
            technician: 'Charlie Brown',
            status: 'Pending'
        }
    ];

    // Example data for technician activity
    const technicianActivity = [
        { name: 'Charlie Brown', completed: 4, pending: 1 },
        { name: 'Kelvin Mutea', completed: 0, pending: 0 },
        { name: 'Hassan Munene', completed: 0, pending: 0 },
        { name: 'Tiinayo Elijah', completed: 0, pending: 0 }
    ];


    // Active alerts data
    const alerts = [
        { alertId: 'A001', description: 'Overdue Maintenance', technicianId: 'T001', status: 'Urgent' },
        { alertId: 'A002', description: 'Incomplete Maintenance', technicianId: 'T003', status: 'Pending' }
    ];

    return (
        <div className="row mb-4">
            {/* Today's Jobs Section */}
            <div className="col-md-6">
                <div className="card table-card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span className="h6">Today's Jobs</span>
                        <Link to="/dashboard/create-maintenance-task" className="btn btn-sm btn-primary">
                            Create Maintenance Task
                        </Link>
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Job ID</th>
                                    <th>Building</th>
                                    <th>Technician</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr key={job.id}>
                                        <td>{job.id}</td>
                                        <td>{job.building}</td>
                                        <td>{job.technician}</td>
                                        <td>
                                            <span className={`badge bg-${job.status.toLowerCase()}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Technician Activity Tracker Section */}
            <div className="col-md-6">
                <div className="card table-card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span className="h6">Technician Activity Tracker</span>
                        {/* Export Button */}
                        <button className="btn btn-outline-primary">
                            View detailed report
                        </button>
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Technician</th>
                                    <th>Jobs Completed</th>
                                    <th>Jobs Pending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {technicianActivity.map((technician, index) => (
                                    <tr key={index}>
                                        <td>{technician.name}</td>
                                        <td>{technician.completed}</td>
                                        <td>{technician.pending}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobStatusSummary;
