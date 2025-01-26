import React, { useEffect, useState } from 'react';
import axios from 'axios';

import TechnicianOverview from './TechnicianOverview';
import TechniciansTable from './TechniciansTable';
import PaginationControl from '../../Tables/PaginationControl';

const TechniciansDashboard = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [fetchedTechnicianData, setFetchedTechnicianData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //fetch the information of current maintenance company from localstorage to get email
    const currentData = JSON.parse(localStorage.getItem('user'));
    const email = currentData ? currentData.email : '';

    useEffect(() => {
        if (email) {
            fetchCompanyIdAndTechnicians(email);
        }
    }, [email]);

    // Fetch maintenance company ID by email and then fetch technicians too.
    const fetchCompanyIdAndTechnicians = async (email) => {
        try {
            const response = await axios.get(`/api/maintenance-companies/email/${email}/`);
            if (response.status === 200) {
                const companyId = response.data.id;
                // Once we have the company ID, fetch technicians
                fetchTechnicians(companyId);
            }
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.detail || 'Failed to fetch maintenance company details using email.';
            setError(errorMessage);
            console.error(errorMessage);
        }
    };

    // Fetch technicians by company ID
    const fetchTechnicians = async (companyId) => {
        try {
            const response = await axios.get(`/api/maintenance-companies/${companyId}/technicians/`);
            if (response.status === 200) {
                setFetchedTechnicianData(response.data);
                console.log(fetchedTechnicianData);
            } else {
                setError('No technicians found for this maintenance company.');
            }
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.detail || 'Failed to fetch technicians.';
            setError(errorMessage);
            console.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const kpiData = [
        { title: 'Total Technicians', value: 50, bgColor: 'bg-primary', icon: 'icon-users' },
        { title: 'Active Technicians', value: 40, bgColor: 'bg-success', icon: 'icon-check-circle' },
        { title: 'Suspended', value: 5, bgColor: 'bg-danger', icon: 'icon-x-circle' },
        { title: 'Specializations', value: 5, bgColor: 'bg-info', icon: 'icon-briefcase' },
    ];
    const columns = [
        'Technician',
        'Tasks Assigned',
        'Tasks Completed',
        'Completion Rate (%)',
        'Overdue Tasks',
        'Pending Tasks',
        'Performance Score'
    ];

    const technicianData = [
        { name: "John Doe", tasksAssigned: 20, tasksCompleted: 18, completionRate: 90, overdueTasks: 2, pendingTasks: 0, performanceScore: 95 },
        { name: "Jane Smith", tasksAssigned: 25, tasksCompleted: 20, completionRate: 80, overdueTasks: 5, pendingTasks: 0, performanceScore: 90 },
        { name: "Bob Johnson", tasksAssigned: 30, tasksCompleted: 25, completionRate: 83, overdueTasks: 3, pendingTasks: 2, performanceScore: 92 },
        { name: "Alice Williams", tasksAssigned: 22, tasksCompleted: 21, completionRate: 95, overdueTasks: 1, pendingTasks: 0, performanceScore: 98 },
        { name: "Mark Lee", tasksAssigned: 18, tasksCompleted: 14, completionRate: 77, overdueTasks: 4, pendingTasks: 0, performanceScore: 85 },
        { name: "Sara Green", tasksAssigned: 28, tasksCompleted: 26, completionRate: 93, overdueTasks: 2, pendingTasks: 0, performanceScore: 96 },
        { name: "Tom Harris", tasksAssigned: 19, tasksCompleted: 16, completionRate: 84, overdueTasks: 3, pendingTasks: 0, performanceScore: 91 },
        { name: "Emily Davis", tasksAssigned: 25, tasksCompleted: 22, completionRate: 88, overdueTasks: 3, pendingTasks: 0, performanceScore: 92 },
        { name: "Richard Brown", tasksAssigned: 32, tasksCompleted: 28, completionRate: 87, overdueTasks: 4, pendingTasks: 0, performanceScore: 93 },
        { name: "Olivia White", tasksAssigned: 27, tasksCompleted: 24, completionRate: 89, overdueTasks: 3, pendingTasks: 0, performanceScore: 94 },
        { name: "Chris Black", tasksAssigned: 21, tasksCompleted: 18, completionRate: 86, overdueTasks: 3, pendingTasks: 0, performanceScore: 92 },
        { name: "Monica Blue", tasksAssigned: 35, tasksCompleted: 30, completionRate: 86, overdueTasks: 5, pendingTasks: 0, performanceScore: 91 },
        { name: "Jacob Green", tasksAssigned: 15, tasksCompleted: 13, completionRate: 87, overdueTasks: 2, pendingTasks: 0, performanceScore: 93 },
        { name: "Sophia Red", tasksAssigned: 40, tasksCompleted: 38, completionRate: 95, overdueTasks: 2, pendingTasks: 0, performanceScore: 97 },
        { name: "Mason Gray", tasksAssigned: 22, tasksCompleted: 19, completionRate: 86, overdueTasks: 3, pendingTasks: 0, performanceScore: 90 }
    ];

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = technicianData.slice(indexOfFirstRow, indexOfLastRow);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle rows per page change
    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page on rows per page change
    };

    // Total number of pages
    const totalPages = Math.ceil(technicianData.length / rowsPerPage);

    if (loading) {
        // Show loading while fetching data
        return (
            <div className="pc-container">
                <div className="pc-content">
                    <div>Loading the technicians...</div>;
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="pc-container">
                <div className="pc-content">
                    <div>Error fetching technicians we will do better ui later: {error}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="pc-container">
            <div className="pc-content">
                <div className="card shadow-sm rounded-0">
                    <div className="container-fluid p-3">
                        <div className="row">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-3 d-flex align-items-center">
                                    <li className="breadcrumb-item">
                                        <a href="#" className="h6">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
                                        <h6 className="mb-0">Account Profile</h6>
                                    </li>
                                </ol>
                            </nav>
                            <div className="col-12">
                                <h2 className="h2">Technicians</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <TechnicianOverview />
                <div className="card table-card">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="input-group" style={{ maxWidth: "250px" }}>
                                <input type="text" className="form-control" placeholder="Search by technician name..." aria-label="Search" aria-describedby="basic-addon1" />
                            </div>

                            <a href="blob:https://mantisdashboard.io/e2c70724-3e75-47ef-bba8-d75003f31948" download="filtering.csv" className="ms-3">
                                <svg viewBox="64 64 896 896" focusable="false" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    {/* Pass the technicians and handlers as props to the TechnicianTable component */}
                    {/* Table */}
                    <div className="card-body">
                        <TechniciansTable
                            columns={columns}
                            currentRows={currentRows}
                        />
                    </div>
                    {/* Pagination Controls */}
                    <PaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPage={rowsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default TechniciansDashboard;