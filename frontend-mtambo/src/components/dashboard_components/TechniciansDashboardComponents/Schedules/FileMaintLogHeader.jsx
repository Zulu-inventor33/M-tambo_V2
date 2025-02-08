import React from 'react';
import { Link } from 'react-router-dom';

const FileMaintLogHeader = () => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between w-100 mb-4">
            <div className='custom-breadcrumb'>
                <div className="breadcrumb-container">
                    <div className="breadcrumb-item">
                        <Link to="/dashboard" className="breadcrumb-button">Home</Link>
                    </div>
                    <div className="breadcrumb-separator">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 6l6 6l-6 6" />
                        </svg>
                    </div>
                    <div className="breadcrumb-item active">
                        <Link to="/dashboard/technician/my-schedules" className="breadcrumb-button">My Schedules</Link>
                    </div>
                    <div className="breadcrumb-separator">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 6l6 6l-6 6" />
                        </svg>
                    </div>
                    <div className="breadcrumb-item active">
                        <span className="breadcrumb-button active">File Maintenance Log</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-2 ms-md-auto">
                <Link to="/dashboard/technician/completed-tasks" className="btn btn-outline-primary">
                    See completed tasks
                </Link>
            </div>
        </div>
    );
};

export default FileMaintLogHeader;