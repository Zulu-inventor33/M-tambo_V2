import React from 'react';
import { Link } from 'react-router-dom';

import PageHeader from './PageHeader';
import KeyPerformanceIndicators from './KeyPerformanceIndicators';
import JobStatusSummary from './JobStatusSummary';
import TechniciansAvailability from './TechniciansAvailability';
import MainContentHeader from './MainContentHeader';

const DashboardMainContent = () => {
    const PageHeaderbreadcrumbItems = [
        { label: 'Dashboard' }
    ];
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
                <PageHeader title='Home' breadcrumbItems={PageHeaderbreadcrumbItems} />
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
