import React from 'react';

const MainContentSearchSection = ({ handleSearchTypeChange, searchType }) => {
    return (
        <div className='container-fluid'>
            <div className='card'>
                <div className='card-header'>
                    <div className='d-flex justify-content-between align-items-center main-search-section-container'>
                        <div className="main-buttons-container">
                            {['Technicians', 'Buildings', 'Elevators', 'Schedules'].map((type) => (
                                <button
                                    key={type}
                                    className={`btn btn-outline-primary ${searchType === type ? 'btn-primary' : ''}`}
                                    onClick={() => handleSearchTypeChange(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className='main-search-section'>
                            <div className="main-content-form">
                                <i className="fa fa-search"></i>
                                <input type="text" className="form-control form-input" placeholder="Search anything..." />
                                <span className="left-pan"><i className="fa fa-microphone"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContentSearchSection;