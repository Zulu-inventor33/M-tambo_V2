import React, { useState, useEffect } from "react";
import TechCompScheduleHeader from "./TechCompScheduleHeader";
import { specificTechnicianSchedules } from '../../../../api/MaintenanceSchedule';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const TechnicianCompletedSchedules = ({ setProgress }) => {
    const [schedules, setSchedules] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState("");
    const [searchBuilding, setSearchBuilding] = useState("");
    const [selectedScheduleType, setSelectedScheduleType] = useState("");

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

        fetchData();
    }, [technicianId, setProgress]);

    // Filter completed schedules from both regular and adhoc schedules
    const completedSchedules = [
        ...schedules.regular_schedules?.filter(item => item.maintenance_schedule.status === 'completed') || [],
        ...schedules.adhoc_schedules?.filter(item => item.maintenance_schedule.status === 'completed') || []
    ];

    const handleScheduleTypeChange = (e) => {
        setSelectedScheduleType(e.target.value);
    }

    const handleSearchChange = (e) => {
        setSearchBuilding(e.target.value);
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* header section */}
                <TechCompScheduleHeader />

                {/* Display error if there's one */}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className='container-fluid'>
                    <div className='row'>
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : schedules.regular_schedules && schedules.regular_schedules.length === 0 ? (
                            <div className="col-md-6 col-xl-4">
                                <div className="card">
                                    <div className="card-header">No regular schedules currently.</div>
                                    <div className='card-body'>Enjoy the silence.</div>
                                </div>
                            </div>
                        ) : (
                            schedules.regular_schedules?.filter(item => item.maintenance_schedule.status === 'completed')
                                .sort((a, b) => new Date(b.maintenance_schedule.scheduled_date) - new Date(a.maintenance_schedule.scheduled_date))
                                .slice(0, 2)
                                .map((item) => (
                                    <div className="col-md-6 col-xl-4" key={item.maintenance_schedule.id}>
                                        <h5 class="mb-3">Recently completed tasks</h5>
                                        <div className="card">
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
                                                            Scheduled on: {new Date(item.maintenance_schedule.scheduled_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Completed Date (if available) */}
                                                {item.maintenance_schedule.maintenance_log && item.maintenance_schedule.maintenance_log.length > 0 && (
                                                    <div className="mb-2">
                                                        <div className="d-flex align-items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-check">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M5 12l5 5l10 -10" />
                                                            </svg>
                                                            <p className="ms-2 mb-0">
                                                                Completed on: {new Date(item.maintenance_schedule.maintenance_log[0].date_completed).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
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
                                                        <span className={`badge p-1 ${item.maintenance_schedule.status === 'overdue' ? 'bg-danger' : 'bg-success'}`}>
                                                            {item.maintenance_schedule.status === 'overdue' ? <FaExclamationTriangle /> : <FaCheckCircle />} {item.maintenance_schedule.status}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
                {isLoading ? (
                    <div>Loading...</div>
                ) : completedSchedules.length === 0 ? (
                    <div>No completed schedules available.</div>
                ) : (
                    <>
                        <div className="card table-card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by building"
                                        value={searchBuilding}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="form-select"
                                        value={selectedScheduleType}
                                        onChange={handleScheduleTypeChange}
                                    >
                                        <option value="">All Schedule Types</option>
                                        <option value="regular">Regular</option>
                                        <option value="adhoc">Adhoc</option>
                                    </select>
                                </div>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Scheduled Date</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Building</th>
                                            <th scope="col">Elevator</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Completed Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completedSchedules.map((item) => (
                                            <tr key={item.maintenance_schedule.id}>
                                                <td>{new Date(item.maintenance_schedule.scheduled_date).toLocaleDateString()}</td>
                                                <td>{item.maintenance_schedule.description}</td>
                                                <td>{item.maintenance_schedule.building.name}</td>
                                                <td>{item.maintenance_schedule.elevator.user_name}</td>
                                                <td>
                                                    <span className={`badge ${item.maintenance_schedule.status === 'overdue' ? 'bg-danger' : 'bg-success'}`}>
                                                        {item.maintenance_schedule.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {/* Check if maintenance_log exists and display the date_completed */}
                                                    {item.maintenance_schedule.maintenance_log && item.maintenance_schedule.maintenance_log.length > 0 ? (
                                                        new Date(item.maintenance_schedule.maintenance_log[0].date_completed).toLocaleDateString()
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TechnicianCompletedSchedules;