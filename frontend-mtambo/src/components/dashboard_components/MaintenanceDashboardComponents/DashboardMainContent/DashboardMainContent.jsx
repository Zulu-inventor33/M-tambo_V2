import React, { useState, useEffect } from 'react';
import MainContentSearchSection from './MainContentSearchSection';

import LoadingCard from '../../LoadingCard';

const DashboardMainContent = ({ setProgress }) => {
    const [searchType, setSearchType] = useState('Technicians');
    const [isLoadingComponent, setIsLoadingComponent] = useState(false);

    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800);
    }, []);

    const handleSearchTypeChange = (newSearchType) => {
        setIsLoadingComponent(true);
        setSearchType(newSearchType);

        setTimeout(() => {
            setIsLoadingComponent(false);
        }, 1500);
    };

    return (
        <div className="pc-container">
            <div className="pc-content">
                {/* Search Section */}
                <MainContentSearchSection
                    handleSearchTypeChange={handleSearchTypeChange}
                    searchType={searchType}
                />

                {/* Loader (Displayed when loading) */}
                {isLoadingComponent && (
                    <LoadingCard
                        minHeightSetting={true}
                    />
                )}

                {/* Conditionally Render Sections Based on Search Type */}
                {!isLoadingComponent && searchType === 'Technicians' && (
                    <div>
                        <h4>Technician Information</h4>
                    </div>
                )}

                {!isLoadingComponent && searchType === 'Buildings' && (
                    <div>
                        <h4>Building Information</h4>
                    </div>
                )}

                {!isLoadingComponent && searchType === 'Elevators' && (
                    <div>
                        <h4>Elevator Information</h4>
                    </div>
                )}

                {!isLoadingComponent && searchType === 'Schedules' && (
                    <div>
                        <h4>Task Information</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardMainContent;