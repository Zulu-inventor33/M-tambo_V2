import React, { useState } from "react";
import { FaSearch, FaFilter, FaEye,  FaTimes } from "react-icons/fa";
import Select from 'react-select';


const dummySchedules = [
    { id: 1, elevator: "Elevator A", date: "2025-01-25", technician: "John Doe", description: "Routine inspection", type: "Regular" },
    { id: 2, elevator: "Elevator B", date: "2025-01-26", technician: "Jane Smith", description: "Lift upgrade", type: "Ad-Hoc" },
    { id: 3, elevator: "Elevator C", date: "2025-01-30", technician: "Bob Brown", description: "Safety check", type: "Regular" },
    { id: 4, elevator: "Elevator D", date: "2025-02-01", technician: "Alice Green", description: "Emergency maintenance", type: "Ad-Hoc" },
];

const CompletedJobs = () => {
    const [scheduleType, setScheduleType] = useState("Both");
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        elevator: '',
        technician: '',
    });

    // Filtering function
    const filterSchedules = () => {
        return dummySchedules.filter(schedule => {
            const matchesType = scheduleType === "Both" || schedule.type === scheduleType;
            const matchesStartDate = filters.startDate ? schedule.date >= filters.startDate : true;
            const matchesEndDate = filters.endDate ? schedule.date <= filters.endDate : true;
            const matchesElevator = filters.elevator ? schedule.elevator.includes(filters.elevator) : true;
            const matchesTechnician = filters.technician ? schedule.technician.includes(filters.technician) : true;

            return matchesType && matchesStartDate && matchesEndDate && matchesElevator && matchesTechnician;
        });
    };

    // Tab navigation handler
    const handleScheduleTypeChange = (type) => {
        setScheduleType(type);
    };

    const handleResetFilters = () => {
        setFilters({ startDate: '', endDate: '', elevator: '', technician: '' });
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                <div className="completed-schedules-section p-4">
                    <div className="container mt-5">
                        {/* Filter Section */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card mb-4">
                                    <div className="card-body d-flex flex-wrap justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Completed Schedules</h4>
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                data-bs-toggle="collapse"
                                                href="#filterSection"
                                                role="button"
                                                aria-expanded="false"
                                                aria-controls="filterSection"
                                            >
                                                <FaFilter /> Filter
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={handleResetFilters}
                                            >
                                                <FaTimes /> Clear Filters
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters Collapse */}
                        <div className="collapse" id="filterSection">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3 mb-3">
                                            <label>Schedule Type</label>
                                            <select
                                                className="form-select"
                                                value={scheduleType}
                                                onChange={(e) => setScheduleType(e.target.value)}
                                            >
                                                <option value="Both">Both</option>
                                                <option value="Regular">Regular</option>
                                                <option value="Ad-Hoc">Ad-Hoc</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label>Start Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={filters.startDate}
                                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={filters.endDate}
                                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label>Elevator</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search by Elevator"
                                                value={filters.elevator}
                                                onChange={(e) => setFilters({ ...filters, elevator: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label>Technician</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search by Technician"
                                                value={filters.technician}
                                                onChange={(e) => setFilters({ ...filters, technician: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedules List */}
                        <div className="row">
                            {filterSchedules().map(schedule => (
                                <div key={schedule.id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">{schedule.elevator}</h5>
                                            <p className="card-text">{schedule.description}</p>
                                            <p className="text-muted">Technician: {schedule.technician}</p>
                                            <p className="text-muted">Date: {schedule.date}</p>
                                            <p className={`text-${schedule.type === "Regular" ? "info" : "warning"}`}>{schedule.type} Maintenance</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h4 className="section-title mb-4">Completed Maintenance Schedules</h4>

                    {/* Tab Navigation for Regular vs Ad-Hoc */}
                    <div className="tab-nav mb-3">
                        <button
                            className={`tab-button ${scheduleType === "Both" ? "active" : ""}`}
                            onClick={() => handleScheduleTypeChange("Both")}
                        >
                            All
                        </button>
                        <button
                            className={`tab-button ${scheduleType === "Regular" ? "active" : ""}`}
                            onClick={() => handleScheduleTypeChange("Regular")}
                        >
                            Regular
                        </button>
                        <button
                            className={`tab-button ${scheduleType === "Ad-Hoc" ? "active" : ""}`}
                            onClick={() => handleScheduleTypeChange("Ad-Hoc")}
                        >
                            Ad-Hoc
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="filters d-flex mb-4">
                        <div className="filter-item mr-3">
                            <label>Date Range</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                            <span>to</span>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>

                        <div className="filter-item mr-3">
                            <label>Elevator</label>
                            <Select
                                options={dummySchedules.map(schedule => ({ value: schedule.elevator, label: schedule.elevator }))}
                                onChange={(selectedOption) =>
                                    setFilters({ ...filters, elevator: selectedOption.value })
                                }
                                placeholder="Select Elevator"
                            />
                        </div>

                        <div className="filter-item mr-3">
                            <label>Technician</label>
                            <Select
                                options={dummySchedules.map(schedule => ({ value: schedule.technician, label: schedule.technician }))}
                                onChange={(selectedOption) =>
                                    setFilters({ ...filters, technician: selectedOption.value })
                                }
                                placeholder="Select Technician"
                            />
                        </div>

                        <button className="btn btn-secondary">
                            <FaFilter /> Apply Filters
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="summary-cards mb-4">
                        <div className="card">
                            <h5>Total Completed Schedules</h5>
                            <p>{filterSchedules().length}</p>
                        </div>
                        <div className="card">
                            <h5>Overdue Completed Schedules</h5>
                            <p>0</p>
                        </div>
                        <div className="card">
                            <h5>Completion Rate</h5>
                            <p>100%</p>
                        </div>
                    </div>

                    {/* Completed Schedules Table */}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Elevator</th>
                                    <th>Date</th>
                                    <th>Technician</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterSchedules().map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td>{schedule.elevator}</td>
                                        <td>{schedule.date}</td>
                                        <td>{schedule.technician}</td>
                                        <td>{schedule.description}</td>
                                        <td>
                                            <button className="btn btn-info">
                                                <FaEye /> View Details
                                            </button>
                                        </td>
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

export default CompletedJobs;