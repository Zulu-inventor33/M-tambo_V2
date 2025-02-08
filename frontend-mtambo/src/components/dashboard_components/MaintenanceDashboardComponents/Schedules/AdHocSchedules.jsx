import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import StatCards from './StatCards';
import AdHocHeader from './AdHocHeader';
import { retrieveMaintenanceSchedules } from "../../../../api/MaintenanceSchedule";

// Localizer for react-big-calendar using moment.js
const localizer = momentLocalizer(moment);

const AdHocSchedules = ({ setProgress }) => {
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800)

        const retrieveSchedules = async () => {
            setLoading(true);
            try {
                const maintenanceShedulesData = await retrieveMaintenanceSchedules();
                console.log("yiiiiiiii", maintenanceShedulesData);
                const transformedSchedules = maintenanceShedulesData.adhoc_schedules.map(schedule => {
                    const maintenanceSchedule = schedule.maintenance_schedule;
                    return {
                        id: maintenanceSchedule.id,
                        elevator: maintenanceSchedule.elevator.user_name,
                        technician: maintenanceSchedule.technician_full_name,
                        scheduledDate: maintenanceSchedule.scheduled_date,
                        status: maintenanceSchedule.status.charAt(0).toUpperCase() + maintenanceSchedule.status.slice(1),
                        building: maintenanceSchedule.building.name.trim(),
                        description: maintenanceSchedule.description
                    };
                });

                setSchedules(transformedSchedules);

                const transformedEvents = transformedSchedules.map(schedule => ({
                    id: schedule.id,
                    title: `${schedule.elevator} - ${schedule.description}`,
                    start: new Date(schedule.scheduledDate),
                    end: new Date(schedule.scheduledDate),
                    status: schedule.status,
                    building: schedule.building,
                    technician: schedule.technician,
                }));
                setEvents(transformedEvents);
            } catch (error) {
                console.log("Failed to retrieve maintenance schedules", error);
            } finally {
                setLoading(false);
            }
        }
        retrieveSchedules();
    }, []);

    // Filter and counts
    const overdueJobs = schedules.filter(schedule => schedule.status === "Overdue");
    const scheduledJobs = schedules.filter(schedule => schedule.status === "Scheduled");
    const completedJobs = schedules.filter(schedule => schedule.status === "Completed");
    const upcomingJobs = schedules.filter(schedule => new Date(schedule.scheduledDate) > new Date());

    // Handle filter by technician
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Show modal for event details
    const handleShowModal = (schedule) => {
        setSelectedSchedule(schedule);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSchedule(null);
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* page header section */}
                <AdHocHeader />
                <StatCards
                    scheduleType="AdHoc"
                    scheduledJobs={scheduledJobs}
                    overdueJobs={overdueJobs}
                    completedJobs={completedJobs}
                />
                <div className="container-fluid mt-3">
                    {/* Calendar */}
                    <h3>Calendar View</h3>
                    <Calendar
                        localizer={localizer}
                        events={events.filter(event => event.technician.toLowerCase().includes(filter.toLowerCase()))}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        views={['month', 'week', 'day']}
                        onSelectEvent={handleShowModal}
                        draggableAccessor={() => true}
                    />
                    <div className='mb-2 mt-3'>
                        <span className="h5">Regular schedules</span>
                    </div>
                    <div className="card table-card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <Form>
                                <Form.Group controlId="technicianFilter">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by technician"
                                        value={filter}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="card-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Building</th>
                                        <th>Elevator</th>
                                        <th>Technician</th>
                                        <th>Description</th>
                                        <th>Scheduled Date</th>
                                        <th>Actions</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules
                                        .filter(schedule => schedule.technician.toLowerCase().includes(filter.toLowerCase()))
                                        .map(schedule => (
                                            <tr key={schedule.id}>
                                                <td>{schedule.building}</td>
                                                <td>{schedule.elevator}</td>
                                                <td>{schedule.technician}</td>
                                                <td>{schedule.description}</td>
                                                <td>{moment(schedule.scheduledDate).format('DD MMM YYYY')}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => handleShowModal(schedule)}>
                                                        More Details
                                                    </Button>
                                                </td>
                                                <td>
                                                    <span className={`badge ${schedule.status === 'Scheduled' ? 'bg-primary' : schedule.status === 'Completed' ? 'bg-success' : 'bg-danger'}`}>
                                                        {schedule.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal for View/Edit Schedule */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>View/Edit Maintenance Schedule</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedSchedule && (
                                <div>
                                    <h5>Elevator: {selectedSchedule.elevator}</h5>
                                    <p><strong>Technician:</strong> {selectedSchedule.technician}</p>
                                    <p><strong>Scheduled Date:</strong> {selectedSchedule.scheduledDate}</p>
                                    <p><strong>Status:</strong> {selectedSchedule.status}</p>
                                    <p><strong>Building:</strong> {selectedSchedule.building}</p>
                                    <p><strong>Description:</strong> {selectedSchedule.description}</p>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary">Save Changes</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default AdHocSchedules;