import React from 'react';
import KeyPerformanceIndicators from './KeyPerformanceIndicators';
import JobStatusSummary from './JobStatusSummary';
import TechniciansAvailability from './TechniciansAvailability';

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
                                        <a href="../dashboard/index.html">Home</a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="javascript: void(0)">Dashboard</a>
                                    </li>
                                    <li className="breadcrumb-item" aria-current="page">
                                        Home
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column flex-md-row justify-content-between w-100">
                    {/* Section for the dashboard name with bold and big text */}
                    <div className="d-flex align-items-center mb-2 mb-md-0">
                        <h3 className="display-6 font-weight-bold m-0">Hassan's Company</h3>
                    </div>

                    {/* Section for buttons aligned to the right */}
                    <div className="d-flex flex-wrap gap-2 ms-md-auto">
                        <a href='/dashboard/add-new-building' className="d-flex align-items-center btn btn-shadow btn-primary">
                            Add Building
                        </a>
                        <a href='/dashboard/add-new-equipment' className="d-flex align-items-center btn btn-shadow btn-success">
                            Add Equipment
                        </a>
                    </div>
                </div>
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
