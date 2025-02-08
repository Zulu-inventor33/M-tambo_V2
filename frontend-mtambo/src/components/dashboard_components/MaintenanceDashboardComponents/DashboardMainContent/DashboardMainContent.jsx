import React, { useState, useEffect } from 'react';

import KeyPerformanceIndicators from './KeyPerformanceIndicators';
import JobStatusSummary from './JobStatusSummary';
import TechniciansAvailability from './TechniciansAvailability';
import MainContentHeader from './MainContentHeader';
import MainContentSearchSection from './MainContentSearchSection';

const DashboardMainContent = ({ setProgress }) => {
    const [searchResults, setSearchResults] = useState(null);

    const handleSearch = (type, query, dateFilter) => {
        // Dummy data for demonstration
        const dummyData = {
            technician: { id: 1, name: 'John Doe', role: 'Senior Technician', status: 'Available' },
            task: { id: 101, description: 'Elevator Maintenance', date: dateFilter || '2023-10-15', status: 'Pending' },
            building: { id: 201, name: 'Tech Tower', location: 'Downtown', elevators: 5 },
            elevator: { id: 301, building: 'Tech Tower', status: 'Operational', lastService: '2023-09-20' },
        };

        setSearchResults(dummyData[type]);
    };

    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800)
    }, [])

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
                {/* Search Section */}
                <MainContentSearchSection onSearch={handleSearch} />

                {/* Display Search Results */}
                {searchResults && (
                    <div className="search-results">
                        <h3>Search Results</h3>
                        <pre>{JSON.stringify(searchResults, null, 2)}</pre>
                    </div>
                )}
                {/* the header section of the dashboard */}
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
