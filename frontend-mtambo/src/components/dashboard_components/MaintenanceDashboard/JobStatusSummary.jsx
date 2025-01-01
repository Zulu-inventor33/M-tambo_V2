import React, { useState } from 'react';
import { Modal, Button, Table, Badge, Card } from 'react-bootstrap';

const JobStatusSummary = () => {
    // Technician profiles stored as an object
    const technicianProfiles = {
        T001: {
            name: 'John Doe',
            position: 'Plumber',
            email: 'john.doe@example.com',
            phone: '123-456-7890'
        },
        T002: {
            name: 'Jane Smith',
            position: 'Electrician',
            email: 'jane.smith@example.com',
            phone: '234-567-8901'
        },
        T003: {
            name: 'Mike Johnson',
            position: 'HVAC Specialist',
            email: 'mike.johnson@example.com',
            phone: '345-678-9012'
        }
    };

    // Building details stored as an object
    const buildings = {
        B001: {
            name: 'Building One',
            location: 'Downtown',
            floors: 10,
            manager: 'Alice Cooper',
        },
        B002: {
            name: 'Building Two',
            location: 'Uptown',
            floors: 12,
            manager: 'Bob Richards',
        },
    };

    // State to handle modals
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showTechnicianModal, setShowTechnicianModal] = useState(false);
    const [showBuildingModal, setShowBuildingModal] = useState(false);

    // Job data
    const jobs = [
        { jobId: 'J102', jobType: 'Repair', location: 'Imaara Daima', technicianId: 'T001', buildingId: 'B001', status: 'In Progress' },
        { jobId: 'J103', jobType: 'Maintenance', location: 'Westlands', technicianId: 'T002', buildingId: 'B002', status: 'Completed' },
        { jobId: 'J104', jobType: 'Checkup', location: 'Westlands', technicianId: 'T003', buildingId: 'B002', status: 'Completed' }
    ];

    // Active alerts data
    const alerts = [
        { alertId: 'A001', description: 'Overdue Maintenance', technicianId: 'T001', status: 'Urgent' },
        { alertId: 'A002', description: 'Incomplete Maintenance', technicianId: 'T003', status: 'Pending' }
    ];

    // Modal Handlers
    const handleTechnicianClick = (technicianId) => {
        setSelectedTechnician(technicianProfiles[technicianId]);
        setShowTechnicianModal(true);
    };

    const handleBuildingClick = (buildingId) => {
        setSelectedBuilding(buildings[buildingId]);
        setShowBuildingModal(true);
    };

    const handleCloseTechnicianModal = () => setShowTechnicianModal(false);
    const handleCloseBuildingModal = () => setShowBuildingModal(false);

    // Badge color for alert status
    const getAlertStatusColor = (status) => {
        switch (status) {
            case 'Urgent': return 'danger';
            case 'Pending': return 'warning';
            case 'Resolved': return 'success';
            default: return 'secondary';
        }
    };

    // Function to get the badge color based on job status
    const getBadgeColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'warning';
            case 'Completed':
                return 'success';
            case 'Delayed':
                return 'danger';
            case 'Coming Up':
                return 'info';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="col-12">
            <div className="row mb-4">
                <div className="col">
                    <h3>Quick Job Summary</h3>
                </div>
                <div className="col"></div>
            </div>

            <div className="row">
                {/* Job Summary Table */}
                <div className="col-md-8">
                    <Card>
                        <Card.Body>
                            <h4>Upcoming Jobs</h4>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Job ID</th>
                                        <th>Job Type</th>
                                        <th>Location</th>
                                        <th>Technician ID</th>
                                        <th>Building ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.jobId}>
                                            <td>{job.jobId}</td>
                                            <td>{job.jobType}</td>
                                            <td>{job.location}</td>
                                            <td>
                                                <Button variant="link" onClick={() => handleTechnicianClick(job.technicianId)}>
                                                    {job.technicianId}
                                                </Button>
                                            </td>
                                            <td>
                                                <Button variant="link" onClick={() => handleBuildingClick(job.buildingId)}>
                                                    {job.buildingId}
                                                </Button>
                                            </td>
                                            <td>
                                                <span variant={getBadgeColor(job.status)} class={`badge bg-${getBadgeColor(job.status)}`}>{job.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>

                {/* Alerts Table (Narrower) */}
                <div className="col-md-4"> {/* Narrower column for Alerts */}
                    <Card>
                        <Card.Body>
                            <h6>Active Alerts</h6>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Technician ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.map((alert) => (
                                        <tr key={alert.alertId}>
                                            <td>{alert.description}</td>
                                            <td>
                                                <Button variant="link" onClick={() => handleTechnicianClick(alert.technicianId)}>
                                                    {alert.technicianId}
                                                </Button>
                                            </td>
                                            <td>
                                                <span variant={getAlertStatusColor(alert.status)} class={`badge bg-${getAlertStatusColor(alert.status)}`}>{alert.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>
            </div>

            {/* Technician Profile Modal */}
            <Modal show={showTechnicianModal} onHide={handleCloseTechnicianModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Technician Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTechnician && (
                        <div>
                            <p><strong>Name:</strong> {selectedTechnician.name}</p>
                            <p><strong>Position:</strong> {selectedTechnician.position}</p>
                            <p><strong>Email:</strong> {selectedTechnician.email}</p>
                            <p><strong>Phone:</strong> {selectedTechnician.phone}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTechnicianModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Building Details Modal */}
            <Modal show={showBuildingModal} onHide={handleCloseBuildingModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Building Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBuilding && (
                        <div>
                            <p><strong>Name:</strong> {selectedBuilding.name}</p>
                            <p><strong>Location:</strong> {selectedBuilding.location}</p>
                            <p><strong>Floors:</strong> {selectedBuilding.floors}</p>
                            <p><strong>Manager:</strong> {selectedBuilding.manager}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseBuildingModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default JobStatusSummary;
