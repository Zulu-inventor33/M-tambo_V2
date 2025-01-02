import React from 'react';
import { Link } from 'react-router-dom';

import KeyPerformanceIndicators from './KeyPerformanceIndicators';
import JobStatusSummary from './JobStatusSummary';
import TechniciansAvailability from './TechniciansAvailability';
import MainContentHeader from './MainContentHeader';

const DashboardMainContent = () => {
    // Mock data (in the future, this data will come from the API)
    const keyPerformanceData = [
        {
            title: "Active Elevators",
            count: 15,
            icon: "fa fa-elevator",
            color: "primary",
        },
        {
            title: "Upcoming Jobs",
            count: 8,
            icon: "fa fa-calendar-check",
            color: "info",
        },
        {
            title: "Completed Jobs",
            count: 45,
            icon: "fa fa-check-circle",
            color: "success",
        },
        {
            title: "Pending Alerts",
            count: 3,
            icon: "fa fa-exclamation-triangle",
            color: "danger",
        },
    ];

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* the header section of the dashboard */}
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Home</h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard">Dashboard</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <MainContentHeader />
                {/* key performance indicators section */}
                <KeyPerformanceIndicators data={keyPerformanceData} />
                {/* Job status quick summary section */}
                <JobStatusSummary />
                {/* Technicians availability section */}
                <TechniciansAvailability />
            </div>
        </div>
    );
};

export default DashboardMainContent;
