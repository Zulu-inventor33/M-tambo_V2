import React, { useEffect, useState } from 'react';

import HeaderSection from './HeaderSection';
import { fetchBuildings } from '../../../../api/BuildingsApi';
import { fetchCompanyDevelopers } from '../../../../api/MaintenanceCompanyApi';
import BuildingSummaryCard from './BuildingSummaryCard';
import PaginationControl from '../../Tables/PaginationControl';

const CompanyBuildings = ({ setProgress }) => {
    const [buildings, setBuildings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDeveloper, setSelectedDeveloper] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800);
    }, [setProgress]);

    const currentCompany = localStorage.getItem('user');
    const parsedCompany = currentCompany ? JSON.parse(currentCompany) : null;
    const companyId = parsedCompany ? parsedCompany.account_type_id : '';
    
    // Fetch buildings and developers
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const buildingsData = await fetchBuildings(companyId);
                setBuildings(buildingsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchDeveloperData = async () => {
            setIsLoading(true);
            try {
                const developersData = await fetchCompanyDevelopers(companyId);
                setDevelopers(developersData)
            } catch (error) {
                console.log("Error fetching Developers Data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        fetchDeveloperData();
    }, [companyId]);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(7);

    const filteredBuildings = buildings.filter((building) => {
        return (
            (building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                building.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                building.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                building.developer.developer_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedDeveloper ? building.developer.developer_name === selectedDeveloper : true)
        );
    });

    const totalPages = Math.ceil(filteredBuildings.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to the first page
    };

    const handleDeveloperChange = (e) => {
        setSelectedDeveloper(e.target.value);
        setCurrentPage(1); // Reset to the first page
    };

    const handleEditBuilding = (building) => {
        // Open edit modal logic here
    };

    const paginatedBuildings = filteredBuildings.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <>
            <div className="pc-container">
                <div className="pc-content">
                    <HeaderSection />
                    <BuildingSummaryCard buildings={buildings} />

                    <div className='mb-2'>
                        <span className="h5">Buildings List</span>
                    </div>
                    {isLoading ? (
                        <div className="text-center py-5">Loading...</div>
                    ) : (
                        <div className="card table-card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="input-group" style={{ maxWidth: '300px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name, address, or contact..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <select
                                    id='developer-select'
                                    value={selectedDeveloper}
                                    onChange={handleDeveloperChange}
                                    className="form-select w-auto ms-3"
                                >
                                    <option value="">All Developers</option>
                                    {developers.map((developer) => (
                                        <option
                                            key={developer.id}
                                            value={developer.developer_name}
                                        >
                                            {developer.developer_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="card-body">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Address</th>
                                            <th>Contact</th>
                                            <th>Developer</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedBuildings.map((building) => (
                                            <tr key={building.id}>
                                                <td>{building.name}</td>
                                                <td>{building.address}</td>
                                                <td>{building.contact}</td>
                                                <td>{building.developer.developer_name}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning btn-sm ms-2"
                                                        onClick={() => handleEditBuilding(building)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i> Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm ms-2"
                                                        onClick={() => handleDeleteBuilding(building.id)}
                                                    >
                                                        <i className="bi bi-trash"></i> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                    )}
                </div>
            </div>
        </>
    );
};

export default CompanyBuildings;