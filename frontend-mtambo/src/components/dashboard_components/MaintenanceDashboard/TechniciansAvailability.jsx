import React, { useState } from 'react';
import { Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { FaPlus, FaBan, FaCheck } from 'react-icons/fa';

const TechniciansAvailability = () => {
    const [technicians, setTechnicians] = useState([
        { id: 'T001', name: 'John Doe', status: 'Active', assignments: ['2024-12-26', '2024-12-27'] },
        { id: 'T002', name: 'Jane Smith', status: 'Active', assignments: ['2024-12-28', '2024-12-29'] },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [newTechnician, setNewTechnician] = useState({ id: '', name: '', status: 'Active' });
    const [selectedTechnician, setSelectedTechnician] = useState(null);

    const handleAddTechnician = () => {
        setShowModal(true);
        setModalType('add');
    };

    const handleSuspendTechnician = (technician) => {
        setSelectedTechnician(technician);
        setShowModal(true);
        setModalType('suspend');
    };

    const handleSaveTechnician = () => {
        if (modalType === 'add') {
            setTechnicians([...technicians, newTechnician]);
        } else if (modalType === 'suspend' && selectedTechnician) {
            setTechnicians(technicians.map((tech) => 
                tech.id === selectedTechnician.id ? { ...tech, status: 'Suspended' } : tech
            ));
        }
        setShowModal(false);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalType(null);
        setNewTechnician({ id: '', name: '', status: 'Active' });
    };

    return (
        <div>
            <Button variant="primary" onClick={handleAddTechnician}>
                <FaPlus /> Add Technician
            </Button>
            <h3 className="mt-3">Technician Availability</h3>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Technician ID</th>
                        <th>Technician Name</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {technicians.map((technician) => (
                        <tr key={technician.id}>
                            <td>{technician.id}</td>
                            <td>{technician.name}</td>
                            <td>
                                {technician.assignments.join(', ')}
                            </td>
                            <td>
                                <Badge variant={technician.status === 'Active' ? 'success' : 'danger'}>
                                    {technician.status}
                                </Badge>
                            </td>
                            <td>
                                <Button variant="danger" onClick={() => handleSuspendTechnician(technician)}>
                                    <FaBan /> Suspend
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Adding/Suspending Technician */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'add' ? 'Add Technician' : 'Suspend Technician'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'add' ? (
                        <Form>
                            <Form.Group controlId="formTechnicianId">
                                <Form.Label>Technician ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTechnician.id}
                                    onChange={(e) => setNewTechnician({ ...newTechnician, id: e.target.value })}
                                    placeholder="Enter Technician ID"
                                />
                            </Form.Group>
                            <Form.Group controlId="formTechnicianName">
                                <Form.Label>Technician Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newTechnician.name}
                                    onChange={(e) => setNewTechnician({ ...newTechnician, name: e.target.value })}
                                    placeholder="Enter Technician Name"
                                />
                            </Form.Group>
                            <Form.Group controlId="formTechnicianStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newTechnician.status}
                                    onChange={(e) => setNewTechnician({ ...newTechnician, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    ) : (
                        <p>Are you sure you want to suspend {selectedTechnician?.name}?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveTechnician}>
                        {modalType === 'add' ? 'Add Technician' : 'Suspend Technician'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TechniciansAvailability;