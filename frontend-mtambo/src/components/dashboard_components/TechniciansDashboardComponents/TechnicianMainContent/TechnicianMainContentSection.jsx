import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

import TechnicianMainContentHeader from './MainContentHeader';

const TechnicianMainContentSection = ({ setProgress }) => {

    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800)
    }, [setProgress])
    
    // Dummy data
    const currentTask = {
        description: "Check elevator maintenance logs",
        scheduledDate: "2025-02-08",
        status: "pending"
    };

    const upcomingTasks = [
        { id: 1, description: "Fix elevator 1", scheduledDate: "2025-02-09", status: "scheduled" },
        { id: 2, description: "Check elevator 2", scheduledDate: "2025-02-10", status: "scheduled" },
        { id: 3, description: "Maintain elevator 3", scheduledDate: "2025-02-11", status: "scheduled" },
        { id: 4, description: "Elevator 4 checkup", scheduledDate: "2025-02-12", status: "scheduled" },
        { id: 5, description: "Elevator 5 servicing", scheduledDate: "2025-02-13", status: "scheduled" },
        { id: 6, description: "Elevator 6 inspection", scheduledDate: "2025-02-14", status: "scheduled" }
    ];

    const completedTasks = [
        { id: 1, description: "Completed elevator 1 maintenance", completedDate: "2025-02-07", status: "completed" },
        { id: 2, description: "Fixed elevator 2", completedDate: "2025-02-06", status: "completed" },
        { id: 3, description: "Elevator 3 servicing finished", completedDate: "2025-02-05", status: "completed" }
    ];

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                <div className="container">
                    {/* header section */}
                    <TechnicianMainContentHeader />
                    <div className='row'>
                        <div className="col-md-12 col-xl-7">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Current Task</h5>
                                </div>
                                <div className="card-body">
                                    <p>{currentTask.description}</p>
                                    <p>Scheduled on: {new Date(currentTask.scheduledDate).toLocaleDateString()}</p>
                                    <p>
                                        <span className={`badge ${currentTask.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                                            {currentTask.status === 'pending' ? 'Pending' : 'Completed'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <h5>Completed Tasks</h5>
                                </div>
                                <div className="card-body">
                                    {completedTasks.length === 0 ? (
                                        <p>No completed tasks</p>
                                    ) : (
                                        completedTasks.map(task => (
                                            <div key={task.id} className="mb-2">
                                                <p>{task.description}</p>
                                                <p>Completed on: {new Date(task.completedDate).toLocaleDateString()}</p>
                                                <p>
                                                    <span className={`badge bg-success`}>
                                                        <FaCheckCircle /> Completed
                                                    </span>
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Upcoming Tasks Card */}
                        <div className="col-md-12 col-xl-5">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Upcoming Tasks</h5>
                                </div>
                                <div className="card-body">
                                    {upcomingTasks.length === 0 ? (
                                        <p>No upcoming tasks</p>
                                    ) : (
                                        upcomingTasks.map(task => (
                                            <div key={task.id} className="mb-2">
                                                <p>{task.description}</p>
                                                <p>Scheduled on: {new Date(task.scheduledDate).toLocaleDateString()}</p>
                                                <p>
                                                    <span className={`badge ${task.status === 'scheduled' ? 'bg-primary' : 'bg-success'}`}>
                                                        {task.status === 'scheduled' ? 'Scheduled' : 'Completed'}
                                                    </span>
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianMainContentSection;
