import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    Form,
    Dropdown
} from 'react-bootstrap';
import { FaUser, FaTasks, FaMapMarkerAlt, FaChartLine, FaSearch, FaCalendarAlt, FaBell } from 'react-icons/fa';
import Calendar from "react-calendar"; // Import react-calendar

// Sample technicians and tasks data
const technicians = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 890',
        status: 'Available',
        skillset: ['HVAC', 'Plumbing'],
        currentTask: 'None',
        performance: 4.5,
        location: 'New York',
        availability: { monday: '9:00 AM - 5:00 PM', tuesday: 'Off', wednesday: '9:00 AM - 6:00 PM' },
        certifications: ['HVAC Specialist', 'Plumbing License'],
        taskHistory: [
            { taskId: 101, taskName: 'Fix Heating Unit', status: 'Completed', rating: 5.0 },
            { taskId: 102, taskName: 'Install Bathroom Pipes', status: 'Completed', rating: 4.2 },
        ],
        profilePicture: 'https://www.example.com/images/john-doe.jpg',
        customerRatings: 4.5,
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 234 567 891',
        status: 'Unavailable',
        skillset: ['Electrical', 'HVAC'],
        currentTask: 'Fix Water Leakage',
        performance: 4.7,
        location: 'California',
        availability: { monday: '10:00 AM - 6:00 PM', tuesday: '9:00 AM - 5:00 PM', wednesday: 'Off' },
        certifications: ['Electrical License', 'HVAC Specialist'],
        taskHistory: [
            { taskId: 103, taskName: 'Fix Water Leakage', status: 'Completed', rating: 4.8 },
            { taskId: 104, taskName: 'Install Lighting Fixtures', status: 'Pending', rating: null },
        ],
        profilePicture: 'https://www.example.com/images/jane-smith.jpg',
        customerRatings: 4.6,
    },
    // More technicians...
];

const tasks = [
    { id: 1, name: 'Fix Heating Unit', status: 'Pending', priority: 'High', location: 'New York', assignedTechnician: null },
    { id: 2, name: 'Install Bathroom Pipes', status: 'In Progress', priority: 'Medium', location: 'California', assignedTechnician: null },
    { id: 3, name: 'Fix Water Leakage', status: 'Completed', priority: 'Low', location: 'New York', assignedTechnician: 'John Doe' }
];

const TechnicianDashboard = () => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [selectedTechnicianForTask, setSelectedTechnicianForTask] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
    const [assignedTask, setAssignedTask] = useState(null); // State for assigned task
    const [availableSlots, setAvailableSlots] = useState({}); // Store available slots for technicians
    const [notifications, setNotifications] = useState([]); // Notifications state

    const handleViewProfile = (techId) => {
        const technician = technicians.find((tech) => tech.id === techId);
        setSelectedTechnician(technician);
        setShowProfileModal(true);
    };

    // Handle date change in calendar
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Simulating the task assignment by checking availability
    const handleAssignTask = (techId, task) => {
        const technician = technicians.find((tech) => tech.id === techId);
        const available = checkAvailability(technician, selectedDate);
        if (available) {
            setAssignedTask(task);
            alert(`Task "${task}" has been assigned to ${technician.name}`);
        } else {
            alert(`${technician.name} is not available on ${selectedDate.toDateString()}`);
        }
    };

    // Check technician availability for a given day (simple logic based on availability)
    const checkAvailability = (technician, date) => {
        const day = date.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        const availability = technician.availability[day];
        return availability && availability !== "Off";
    };

    const handleCloseProfile = () => {
        setShowProfileModal(false);
        setSelectedTechnician(null);
    };

    // Task Filter
    const handleFilterChange = (filterType, value) => {
        const filtered = tasks.filter(task => task[filterType] === value || !value);
        setFilteredTasks(filtered);
    };

    // Task Assignment Modal
    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        setShowAssignModal(true);
    };


    // Simulate marking notifications as read
    const handleMarkAsRead = (index) => {
        const newNotifications = [...notifications];
        newNotifications[index] = `[READ] ${newNotifications[index]}`;
        setNotifications(newNotifications);
    };

    return (
        <div className="pc-container">
            <div className="pc-content">
                <h2>Technician Dashboard</h2>

                {/* Technician List */}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Current Task</th>
                            <th>Performance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {technicians.map((tech) => (
                            <tr key={tech.id}>
                                <td>{tech.name}</td>
                                <td>{tech.status}</td>
                                <td>{tech.currentTask}</td>
                                <td>{tech.performance}</td>
                                <td>
                                    <Button variant="info" size="sm" onClick={() => handleViewProfile(tech.id)}>
                                        View Profile
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Task Assignment Section */}
                <h3>Task Assignment</h3>
                <Row>
                    {/* Filter by Priority */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Priority</Form.Label>
                            <Form.Control as="select" onChange={(e) => handleFilterChange('priority', e.target.value)}>
                                <option value="">All</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    {/* Filter by Status */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" onChange={(e) => handleFilterChange('status', e.target.value)}>
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    {/* Filter by Location */}
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control as="select" onChange={(e) => handleFilterChange('location', e.target.value)}>
                                <option value="">All</option>
                                <option value="New York">New York</option>
                                <option value="California">California</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Task List */}
                <Row>
                    {filteredTasks.map((task) => (
                        <Col md={4} key={task.id}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>{task.name}</Card.Title>
                                    <Card.Text>Status: {task.status}</Card.Text>
                                    <Card.Text>Priority: {task.priority}</Card.Text>
                                    <Card.Text>Location: {task.location}</Card.Text>
                                    <Card.Text>
                                        Assigned Technician: {task.assignedTechnician || 'None'}
                                    </Card.Text>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleTaskSelect(task)}
                                    >
                                        {task.assignedTechnician ? 'Reassign' : 'Assign'}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Task Assignment Modal */}
                <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Assign Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Task:</strong> {selectedTask?.name}</p>
                        <Form.Group>
                            <Form.Label>Select Technician</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {selectedTechnicianForTask ? selectedTechnicianForTask.name : 'Select Technician'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {technicians.map((technician) => (
                                        <Dropdown.Item
                                            key={technician.id}
                                            onClick={() => setSelectedTechnicianForTask(technician)}
                                        >
                                            {technician.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAssignTask}>
                            Assign Task
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* Technician Profile Modal */}
                <Modal show={showProfileModal} onHide={handleCloseProfile}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedTechnician?.name || 'Technician'} - Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex mb-3">
                            <img
                                src={selectedTechnician?.profilePicture || 'https://www.example.com/default-profile.jpg'}
                                alt="Profile"
                                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                            />
                            <div className="ms-3">
                                <h5>{selectedTechnician?.name || 'N/A'}</h5>
                                <p>Email: {selectedTechnician?.email || 'N/A'}</p>
                                <p>Phone: {selectedTechnician?.phone || 'N/A'}</p>
                                <p>Location: {selectedTechnician?.location || 'N/A'}</p>
                            </div>
                        </div>

                        <h6>Performance Metrics</h6>
                        <ul>
                            <li>Customer Rating: {selectedTechnician?.customerRatings || 'N/A'}</li>
                            <li>Performance Score: {selectedTechnician?.performance || 'N/A'}</li>
                        </ul>

                        <h6>Skills</h6>
                        <p>{selectedTechnician?.skillset?.join(', ') || 'N/A'}</p>

                        <h6>Certifications</h6>
                        <p>{selectedTechnician?.certifications?.join(', ') || 'N/A'}</p>

                        <h6>Availability</h6>
                        <ul>
                            {selectedTechnician?.availability ? (
                                Object.entries(selectedTechnician.availability).map(([day, time]) => (
                                    <li key={day}>{day}: {time}</li>
                                ))
                            ) : (
                                <li>No availability information available.</li>
                            )}
                        </ul>

                        <h6>Task History</h6>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedTechnician?.taskHistory && selectedTechnician.taskHistory.length > 0 ? (
                                    selectedTechnician.taskHistory.map((task) => (
                                        <tr key={task.taskId}>
                                            <td>{task.taskName}</td>
                                            <td>{task.status}</td>
                                            <td>{task.rating || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No task history available.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseProfile}>Close</Button>
                        <Button variant="primary">Assign New Task</Button>
                    </Modal.Footer>
                </Modal>

                <Col md={4}>
                    {/* Availability Calendar */}
                    <Card>
                        <Card.Header>
                            <FaCalendarAlt /> Availability Calendar
                        </Card.Header>
                        <Card.Body>
                            <Calendar
                                onChange={handleDateChange}
                                value={selectedDate}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Row>
                    <Col md={4}>
                        <Card>
                            <Card.Header>
                                <FaBell /> Notifications
                            </Card.Header>
                            <Card.Body>
                                <ul>
                                    {notifications.length === 0 ? (
                                        <li>No new notifications</li>
                                    ) : (
                                        notifications.map((notification, index) => (
                                            <li key={index}>
                                                {notification}{" "}
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() => handleMarkAsRead(index)}
                                                >
                                                    Mark as Read
                                                </Button>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
