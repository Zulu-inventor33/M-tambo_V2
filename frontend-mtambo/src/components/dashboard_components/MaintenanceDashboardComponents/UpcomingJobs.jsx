import React, { useState, useEffect } from "react";
import axios from "axios";

import PageHeader from "./PageHeader";
import ExpandableTable from "../Tables/ExpandableTable";
import PaginationControl from "../Tables/PaginationControl";

const UpcomingJobs = () => {
    const PageHeaderbreadcrumbItems = [
        { label: 'Home', link: '/dashboard' },
        { label: 'Job Management' }
    ];
    const [fetchedCompletedJobs, setFetchedCompletedJobs] = useState([]);

    //fetch the information of current maintenance company from localstorage to get email
    const currentData = JSON.parse(localStorage.getItem('user'));
    //retrieve the id of the current maintenance company
    const companyId = currentData ? currentData.account_type_id : '';

    useEffect(() => {

        fetchCompletedJobs = async () => {
            try {
                const response = await axios.get(`/api/jobs/maintenance-schedule/maintenance_company/${companyId}/upcoming_jobs/`);
                if (response.status === 200) {
                    setFetchedCompletedJobs(response.data);
                    console.log(fetchedCompletedJobs);
                }
            } catch (error) {
                
            }
        };
    }, []);

    // Fetch maintenance company ID by email and then fetch technicians too.
    // const fetchCompanyIdAndTechnicians = async (email) => {
    //     try {
    //         const response = await axios.get(`/ api / maintenance - companies / email / ${ email } / `);
    //         if (response.status === 200) {
    //             const companyId = response.data.id;
    //             // Once we have the company ID, fetch technicians
    //             fetchTechnicians(companyId);
    //         }
    //     } catch (err) {
    //         setLoading(false);
    //         const errorMessage = err.response?.data?.detail || 'Failed to fetch maintenance company details using email.';
    //         setError(errorMessage);
    //         console.error(errorMessage);
    //     }
    // };

    // Fetch technicians by company ID
    const fetchTechnicians = async (companyId) => {
        try {
            const response = await axios.get(`/ api / maintenance - companies / ${ companyId } / technicians / `);
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
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const columns = ['Technician', 'Building', 'Description', 'Scheduled Date', 'Status'];
    const technicians = [
        { technician: "Erik Baglioni", building: "Main Office - Block A", description: "Fixing the air conditioning", scheduledDate: "2025-01-15", status: "In Progress" },
        { technician: "Glen Franceschi", building: "Main Office - Block B", description: "Electrical system maintenance", scheduledDate: "2025-01-20", status: "Overdue" },
        { technician: "Barry Pritchard", building: "Warehouse 1", description: "Plumbing repairs", scheduledDate: "2025-01-22", status: "In Progress" },
        { technician: "Isabella Santiago", building: "Conference Center", description: "Network setup and configuration", scheduledDate: "2025-01-18", status: "Completed" },
        { technician: "Florence Franke", building: "Warehouse 2", description: "Security system installation", scheduledDate: "2025-01-25", status: "Scheduled" },
        { technician: "Adrian Wallis", building: "Lobby Building", description: "Interior painting", scheduledDate: "2025-02-01", status: "In Progress" },
        { technician: "Sophia Turner", building: "Building C", description: "HVAC system maintenance", scheduledDate: "2025-01-10", status: "Overdue" },
        { technician: "Michael Harris", building: "Server Room - Floor 2", description: "Server rack installation", scheduledDate: "2025-02-05", status: "Scheduled" },
        { technician: "Olivia Johnson", building: "Building A - East Wing", description: "Lighting fixture replacement", scheduledDate: "2025-01-17", status: "Completed" },
        { technician: "James Turner", building: "Building D", description: "Emergency exit signage installation", scheduledDate: "2025-01-30", status: "Scheduled" },
        { technician: "Liam Brown", building: "Storage Facility", description: "Forklift maintenance", scheduledDate: "2025-01-28", status: "In Progress" },
        { technician: "Emily Davis", building: "Building F", description: "Fire alarm system check", scheduledDate: "2025-02-03", status: "Scheduled" },
        { technician: "Daniel Lee", building: "Building G", description: "Painting the exterior walls", scheduledDate: "2025-01-12", status: "Completed" },
        { technician: "Emma Wilson", building: "Main Office - Block C", description: "Ceiling fan repair", scheduledDate: "2025-01-23", status: "In Progress" },
        { technician: "Jack Martinez", building: "Building H", description: "Elevator maintenance", scheduledDate: "2025-01-25", status: "Overdue" },
        { technician: "Michael Harris", building: "Server Room - Floor 2", description: "Server rack installation", scheduledDate: "2025-02-05", status: "Scheduled" },
        { technician: "Olivia Johnson", building: "Building A - East Wing", description: "Lighting fixture replacement", scheduledDate: "2025-01-17", status: "Completed" },
        { technician: "James Turner", building: "Building D", description: "Emergency exit signage installation", scheduledDate: "2025-01-30", status: "Scheduled" },
        { technician: "Liam Brown", building: "Storage Facility", description: "Forklift maintenance", scheduledDate: "2025-01-28", status: "In Progress" },
        { technician: "Emily Davis", building: "Building F", description: "Fire alarm system check", scheduledDate: "2025-02-03", status: "Scheduled" },
        { technician: "Daniel Lee", building: "Building G", description: "Painting the exterior walls", scheduledDate: "2025-01-12", status: "Completed" },
        { technician: "Emma Wilson", building: "Main Office - Block C", description: "Ceiling fan repair", scheduledDate: "2025-01-23", status: "In Progress" },
        { technician: "Jack Martinez", building: "Building H", description: "Elevator maintenance", scheduledDate: "2025-01-25", status: "Overdue" },
        { technician: "Michael Harris", building: "Server Room - Floor 2", description: "Server rack installation", scheduledDate: "2025-02-05", status: "Scheduled" },
        { technician: "Olivia Johnson", building: "Building A - East Wing", description: "Lighting fixture replacement", scheduledDate: "2025-01-17", status: "Completed" },
        { technician: "James Turner", building: "Building D", description: "Emergency exit signage installation", scheduledDate: "2025-01-30", status: "Scheduled" },
        { technician: "Liam Brown", building: "Storage Facility", description: "Forklift maintenance", scheduledDate: "2025-01-28", status: "In Progress" },
        { technician: "Emily Davis", building: "Building F", description: "Fire alarm system check", scheduledDate: "2025-02-03", status: "Scheduled" },
        { technician: "Daniel Lee", building: "Building G", description: "Painting the exterior walls", scheduledDate: "2025-01-12", status: "Completed" },
        { technician: "Emma Wilson", building: "Main Office - Block C", description: "Ceiling fan repair", scheduledDate: "2025-01-23", status: "In Progress" },
        { technician: "Jack Martinez", building: "Building H", description: "Elevator maintenance", scheduledDate: "2025-01-25", status: "Overdue" },

    ];

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = technicians.slice(indexOfFirstRow, indexOfLastRow);

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
    const totalPages = Math.ceil(technicians.length / rowsPerPage);

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* page header section */}
                <PageHeader title='Manage Jobs' breadcrumbItems={PageHeaderbreadcrumbItems} />
                <div className="container-fluid mt-4">
                    {/* Card Container */}
                    <div className="card table-card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span className="h4">Upcoming Jobs</span>
                            {/* Export Button */}
                            <button className="btn btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-download">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                    <path d="M7 11l5 5l5 -5" />
                                    <path d="M12 4l0 12" />
                                </svg>
                                Export PDF
                            </button>
                        </div>
                        {/* Table */}
                        <div className="card-body">
                            <ExpandableTable 
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
        </div>
    );
};

export default UpcomingJobs;