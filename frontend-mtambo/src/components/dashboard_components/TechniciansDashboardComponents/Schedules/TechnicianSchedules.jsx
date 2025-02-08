import React, { useEffect, useState } from 'react';
import { Button, Modal, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { specificTechnicianSchedules } from '../../../../api/MaintenanceSchedule';
import TechnicianScheduleHeader from './TechnicianScheduleHeader';

const TechnicianSchedules = ({ setProgress }) => {
    const [schedules, setSchedules] = useState({
        regular_schedules: [],
        adhoc_schedules: [],
    });
    const [showDetails, setShowDetails] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const currentTechnician = localStorage.getItem('user');
    const parsedTechnician = currentTechnician ? JSON.parse(currentTechnician) : null;
    const technicianId = parsedTechnician ? parsedTechnician.account_type_id : '';

    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800);

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const technicianSchedules = await specificTechnicianSchedules(technicianId);
                setSchedules(technicianSchedules);
            } catch (error) {
                console.error("Error fetching technician's schedules:", error);
                setError('Failed to fetch schedules. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        if (technicianId) {
            fetchData();
        } else {
            setError('No technician ID found. Please log in.');
        }
    }, [technicianId]);

    const completeSchedule = (scheduleId) => {
        console.log(`Completing schedule with ID: ${scheduleId}`);
        // Here you would call the API to update the schedule status
    };

    const showScheduleDetails = (schedule) => {
        setCurrentSchedule(schedule);
        setShowDetails(true);
    };


    const handleFileScheduleLog = (schedule) => {
        //pass the schedule data as a state while navigating to be used
        console.log("schedule Id", schedule.maintenance_schedule.id);
        try {
            navigate(`/dashboard/technician/file-maintenance-log/${schedule.maintenance_schedule.id}`, {
                state: { schedule }
            });
        } catch (error) {
            console.error("Error completing the schedule:", error);
        }
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* header section */}
                <TechnicianScheduleHeader />

                {/* Regular Schedule cards */}
                <div className='container-fluid'>
                    <div className='row'>
                        {schedules.regular_schedules.length === 0 ? (
                            <div className="col-md-6 col-xl-4">
                                <div className="card">
                                    <div className="card-header">
                                        No regular schedules currently.
                                    </div>
                                    <div className='card-body'>Enjoy the silence.</div>
                                </div>
                            </div>
                        ) : (
                            schedules.regular_schedules.map((item) => (
                                <div className="col-md-6 col-xl-4">
                                    <div className="card" key={item.maintenance_schedule.id}>
                                        <div className="card-header">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-calendar">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                                                        <path d="M16 3v4" />
                                                        <path d="M8 3v4" />
                                                        <path d="M4 11h16" />
                                                        <path d="M11 15h1" />
                                                        <path d="M12 15v3" />
                                                    </svg>
                                                    <h5 className="ms-3 mb-0">Regular Schedule</h5>
                                                </div>
                                                <div className="dropdown">
                                                    <a className="avtar avtar-s btn-link-secondary dropdown-toggle arrow-none" href="#"
                                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i class="ti ti-dots-vertical f-18"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-end">
                                                        <a
                                                            className="dropdown-item"
                                                            href="javascript:void(0)"
                                                            onClick={() => showScheduleDetails(item)}
                                                        >
                                                            More details
                                                        </a>
                                                        <a
                                                            className="dropdown-item"
                                                            href="javascript:void(0)"
                                                            onClick={() => handleFileScheduleLog(item)}
                                                        >
                                                            File log
                                                        </a>
                                                        <a className="dropdown-item" href="#">Raise issue</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-3">{item.maintenance_schedule.description}</p>

                                            {/* Scheduled Date */}
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-clock-hour-2">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                        <path d="M12 12l3 -2" />
                                                        <path d="M12 7v5" />
                                                    </svg>
                                                    <p className="ms-2 mb-0">
                                                        Scheduled for: {new Date(item.maintenance_schedule.scheduled_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Building */}
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <i className="ti ti-building-bank"></i>
                                                    <p className="ms-2 mb-0 text-truncate">Building: {item.maintenance_schedule.building.name}</p>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="d-flex align-items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-redux">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M16.54 7c-.805 -2.365 -2.536 -4 -4.54 -4c-2.774 0 -5.023 2.632 -5.023 6.496c0 1.956 1.582 4.727 2.512 6" />
                                                    <path d="M4.711 11.979c-1.656 1.877 -2.214 4.185 -1.211 5.911c1.387 2.39 5.138 2.831 8.501 .9c1.703 -.979 2.875 -3.362 3.516 -4.798" />
                                                    <path d="M15.014 19.99c2.511 0 4.523 -.438 5.487 -2.1c1.387 -2.39 -.215 -5.893 -3.579 -7.824c-1.702 -.979 -4.357 -1.235 -5.927 -1.07" />
                                                    <path d="M10.493 9.862c.48 .276 1.095 .112 1.372 -.366a1 1 0 0 0 -.367 -1.365a1.007 1.007 0 0 0 -1.373 .366a1 1 0 0 0 .368 1.365z" />
                                                    <path d="M9.5 15.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                                    <path d="M15.5 14m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                                </svg>
                                                <p className="ms-2 mb-0">
                                                    <span className='me-2'>Status:</span>
                                                    <span className={`badge p-1 ${item.maintenance_schedule.status === 'overdue' ? 'bg-danger' : 'bg-warning'}`}>
                                                        {item.maintenance_schedule.status === 'overdue' ? <FaExclamationTriangle /> : <FaCheckCircle />} {item.maintenance_schedule.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => showScheduleDetails(item)}>
                                                    More details
                                                </button>
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleFileScheduleLog(item)}>
                                                    File Log
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {/* Ad-Hoc Schedule cards */}
                <div className='container-fluid'>
                    <div className='row'>
                        {schedules.adhoc_schedules.length === 0 ? (
                            <div className="col-md-6 col-xl-4">
                                <div className="card">
                                    <div className="card-header">
                                        No Ad-Hoc schedules currently.
                                    </div>
                                    <div className='card-body'>Enjoy the silence.</div>
                                </div>
                            </div>
                        ) : (
                            schedules.adhoc_schedules.map((item) => (
                                <div className="col-md-6 col-xl-4">
                                    <div className='card' key={item.maintenance_schedule.id}>
                                        <div className="card-header">
                                            <div className="d-flex">
                                                <div className="flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-asana">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M12 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                        <path d="M17 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                        <path d="M7 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                                    </svg>
                                                </div>
                                                <div className="flex-grow-1 mx-3 d-flex align-items-center">
                                                    <h5 className="">Ad Hoc Schedule</h5>
                                                </div>
                                                <div className="dropdown">
                                                    <a className="avtar avtar-s btn-link-secondary dropdown-toggle arrow-none" href="#"
                                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i class="ti ti-dots-vertical f-18"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-end">
                                                        <a
                                                            className="dropdown-item"
                                                            href="javascript:void(0)"
                                                            onClick={() => showScheduleDetails(item)}
                                                        >
                                                            More details
                                                        </a>
                                                        <a
                                                            className="dropdown-item"
                                                            href="javascript:void(0)"
                                                            onClick={() => handleFileScheduleLog(item)}
                                                        >
                                                            File log
                                                        </a>
                                                        <a className="dropdown-item" href="#">Raise issue</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-3">{item.maintenance_schedule.description}</p>

                                            {/* Scheduled Date */}
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-clock-hour-2">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                        <path d="M12 12l3 -2" />
                                                        <path d="M12 7v5" />
                                                    </svg>
                                                    <p className="ms-2 mb-0">
                                                        Scheduled for: {new Date(item.maintenance_schedule.scheduled_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Building */}
                                            <div className="mb-2">
                                                <div className="d-flex align-items-center">
                                                    <i className="ti ti-building-bank"></i>
                                                    <p className="ms-2 mb-0 text-truncate">Building: {item.maintenance_schedule.building.name}</p>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="d-flex align-items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-redux">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M16.54 7c-.805 -2.365 -2.536 -4 -4.54 -4c-2.774 0 -5.023 2.632 -5.023 6.496c0 1.956 1.582 4.727 2.512 6" />
                                                    <path d="M4.711 11.979c-1.656 1.877 -2.214 4.185 -1.211 5.911c1.387 2.39 5.138 2.831 8.501 .9c1.703 -.979 2.875 -3.362 3.516 -4.798" />
                                                    <path d="M15.014 19.99c2.511 0 4.523 -.438 5.487 -2.1c1.387 -2.39 -.215 -5.893 -3.579 -7.824c-1.702 -.979 -4.357 -1.235 -5.927 -1.07" />
                                                    <path d="M10.493 9.862c.48 .276 1.095 .112 1.372 -.366a1 1 0 0 0 -.367 -1.365a1.007 1.007 0 0 0 -1.373 .366a1 1 0 0 0 .368 1.365z" />
                                                    <path d="M9.5 15.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                                    <path d="M15.5 14m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                                </svg>
                                                <p className="ms-2 mb-0">
                                                    <span className='me-2'>Status:</span>
                                                    <span className={`badge p-1 ${item.maintenance_schedule.status === 'overdue' ? 'bg-danger' : 'bg-warning'}`}>
                                                        {item.maintenance_schedule.status === 'overdue' ? <FaExclamationTriangle /> : <FaCheckCircle />} {item.maintenance_schedule.status}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <button
                                                    className='btn btn-sm btn-outline-secondary'
                                                    onClick={() => showScheduleDetails(item)}
                                                >
                                                    More details
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleFileScheduleLog(item)}
                                                >
                                                    File Log
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Modal for Schedule Details */}
                <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Schedule Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {currentSchedule && (
                            <div>
                                <p><strong>Description:</strong> {currentSchedule.maintenance_schedule.description}</p>
                                <p><strong>Elevator:</strong> {currentSchedule.maintenance_schedule.elevator.user_name} (Machine: {currentSchedule.maintenance_schedule.elevator.machine_number})</p>
                                <p><strong>Scheduled Date:</strong> {new Date(currentSchedule.maintenance_schedule.scheduled_date).toLocaleDateString()}</p>
                                <p><strong>Building:</strong> {currentSchedule.maintenance_schedule.building.name}</p>
                                <p><strong>Status:</strong> <Badge variant={currentSchedule.maintenance_schedule.status === 'overdue' ? 'danger' : 'success'}>{currentSchedule.maintenance_schedule.status}</Badge></p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDetails(false)}>Close</Button>
                        <Button variant="success" onClick={() => completeSchedule(currentSchedule.maintenance_schedule.id)}>Mark as Completed</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    );
};

export default TechnicianSchedules;