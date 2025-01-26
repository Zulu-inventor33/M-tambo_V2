import React, { useState } from 'react';
import { Card, Button, Row, Col, ListGroup, FormControl } from 'react-bootstrap';

// Dummy data for technicians
const technicians = [
    {
        id: 1, name: "John Doe", available: true, completionRate: 85, satisfaction: 4.2,
        jobs: [
            { title: 'Elevator Repair', assignedDate: '2024-12-01', status: 'Completed', completionRate: 85 },
            { title: 'Routine Check', assignedDate: '2024-12-10', status: 'Pending', completionRate: 50 }
        ],
        tasksInProgress: ['Fixing Door Sensor']
    },
    {
        id: 2, name: "Jane Smith", available: false, completionRate: 90, satisfaction: 4.8,
        jobs: [
            { title: 'Cable Replacement', assignedDate: '2024-11-20', status: 'Completed', completionRate: 95 },
            { title: 'Annual Maintenance', assignedDate: '2024-12-05', status: 'Pending', completionRate: 60 }
        ],
        tasksInProgress: ['Testing New Cable']
    },
    {
        id: 3, name: "Alan Brown", available: true, completionRate: 95, satisfaction: 4.5,
        jobs: [
            { title: 'Troubleshooting', assignedDate: '2024-12-15', status: 'Completed', completionRate: 98 },
            { title: 'Routine Check', assignedDate: '2024-12-20', status: 'Pending', completionRate: 40 }
        ],
        tasksInProgress: []
    },
    {
        id: 4, name: "Emily Clarke", available: true, completionRate: 80, satisfaction: 4.0,
        jobs: [
            { title: 'Cable Replacement', assignedDate: '2024-12-05', status: 'Completed', completionRate: 80 },
            { title: 'Troubleshooting', assignedDate: '2024-12-18', status: 'Pending', completionRate: 70 }
        ],
        tasksInProgress: ['Fixing Network Issue']
    },
    {
        id: 5, name: "Michael Johnson", available: false, completionRate: 92, satisfaction: 4.6,
        jobs: [
            { title: 'Elevator Repair', assignedDate: '2024-12-12', status: 'Completed', completionRate: 92 },
            { title: 'Emergency Call', assignedDate: '2024-12-17', status: 'Pending', completionRate: 60 }
        ],
        tasksInProgress: []
    },
    {
        id: 6, name: "Sarah Lee", available: true, completionRate: 75, satisfaction: 3.9,
        jobs: [
            { title: 'Routine Check', assignedDate: '2024-12-10', status: 'Completed', completionRate: 75 },
            { title: 'Cable Installation', assignedDate: '2024-12-15', status: 'Pending', completionRate: 80 }
        ],
        tasksInProgress: ['Installing Cable']
    }
];

const TechnicianOverview = () => {
    const [selectedTechnician, setSelectedTechnician] = useState(technicians[0]);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter technicians based on the search term
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        const technician = technicians.find(tech => tech.name.toLowerCase().includes(e.target.value.toLowerCase()));
        if (technician) {
            setSelectedTechnician(technician);
        } else {
            setSelectedTechnician(null); // Or show a default message if no technician is found
        }
    };

    return (
        <Row className="d-flex">
            {/* Left Side: Technician Profile */}
            <Col md={5} sm={12}>
                <div className="card">
                    <div className="card-header">
                        <FormControl
                            type="text"
                            placeholder="Search Technician"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {/* Technician Profile */}
                            <div className="col-12">
                                <div className="d-flex align-items-center">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src="/images/avatar_placeholder.png"
                                            alt="Avatar"
                                            className="rounded-circle me-3"
                                            style={{ width: '50px', height: '50px' }}
                                        />
                                        <div>
                                            <h5 className="mb-0">{selectedTechnician ? selectedTechnician.name : "No Technician Selected"}</h5>
                                            <p className="mb-0">Technician</p>
                                        </div>
                                    </div>
                                    {/* Availability Badge */}
                                    <div
                                        className={`badge ms-3 ${selectedTechnician && selectedTechnician.available ? 'bg-success' : 'bg-danger'} text-white`}>
                                        {selectedTechnician && selectedTechnician.available ? 'Available' : 'Unavailable'}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <hr />
                            </div>

                            {/* Stats Section */}
                            <div className="col-12">
                                <div className="d-flex justify-content-between">
                                    {/* Completion Rate */}
                                    <div>
                                        <h5 className="mb-0">{selectedTechnician ? selectedTechnician.completionRate : 0}%</h5>
                                        <p className="mb-0">Completion Rate</p>
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${selectedTechnician ? selectedTechnician.completionRate : 0}%` }}
                                                aria-valuenow={selectedTechnician ? selectedTechnician.completionRate : 0}
                                                aria-valuemin="0"
                                                aria-valuemax="100">
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="vr mx-3"></div>

                                    {/* Total Jobs */}
                                    <div>
                                        <h5 className="mb-0">{selectedTechnician ? selectedTechnician.jobs.length : 0}</h5>
                                        <p className="mb-0">Total Jobs</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <hr />
                            </div>

                            {/* Contact Information */}
                            <div className="col-12">
                                <ul className="list-unstyled">
                                    <li className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="64 64 896 896">
                                                <path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.6-21.5-39.3-50.5-42.7 33.2z" />
                                            </svg>
                                            <span className="ms-2">anshan.dh81@gmail.com</span>
                                        </div>
                                    </li>
                                    {/* Other contact info remains the same */}
                                    <li className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="64 64 896 896">
                                                <path d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7a405.46 405.46 0 01-86.4 127.3c-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3a68.2 68.2 0 00-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4zm-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 .9.9 21.6-8a481.29 481.29 0 00285.7-285.8l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z" />
                                            </svg>
                                            <span className="ms-2">(+1-876) 8654 239 581</span>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="64 64 896 896">
                                                <path d="M952 474H829.8C812.5 327.6 696.4 211.5 550 194.2V72c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v122.2C327.6 211.5 211.5 327.6 194.2 474H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h122.2C211.5 696.4 327.6 812.5 474 829.8V952c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V829.8C696.4 812.5 812.5 696.4 829.8 550H952c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM512 756c-134.8 0-244-109.2-244-244s109.2-244 244-244 244 109.2 244 244-109.2 244-244 244z" />
                                            </svg>
                                            <span className="ms-2">New York</span>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="64 64 896 896">
                                                <path d="M854.6 289.1a362.49 362.49 0 00-79.9-115.7 370.83 370.83 0 00-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 00169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0022.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z" />
                                            </svg>
                                            <a href="https://google.com" target="_blank" className="ms-2">https://anshan.dh.url</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            {/* Right Side: Job Assignment & History */}
            <Col md={7} sm={12}>
                <div className='card table-card'>
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span class="h4">Job & Assignment History</span>
                        <button class="btn btn-primary">
                            Download
                        </button>
                    </div>
                    <div className='card-body'>
                        <div className="table">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Assigned Date</th>
                                        <th>Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTechnician && selectedTechnician.jobs.length > 0 ? (
                                        selectedTechnician.jobs.map((job, index) => (
                                            <tr key={index}>
                                                <td>{job.title}</td>
                                                <td>{new Date(job.assignedDate).toLocaleDateString()}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${job.status === 'Completed' ? 'bg-success' : job.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => alert('Job Details')}>
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No job history available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className='card'>
                        <div className='card-header'>
                            <h5>Tasks in Progress</h5>
                        </div>
                        <div className='card-body'>
                            <ul className="list-unstyled">
                                {selectedTechnician && selectedTechnician.tasksInProgress.length > 0 ? (
                                    selectedTechnician.tasksInProgress.map((task, index) => (
                                        <li key={index} className="d-flex justify-content-between align-items-center">
                                            <span>{task}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-center">No tasks in progress</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default TechnicianOverview;