import React, { useEffect, useState } from "react";

import { fetchTechnicianBuildings } from "../../../../api/BuildingsApi";
import PaginationControl from "../../Tables/PaginationControl";

const TechnicianBuildings = ({ setProgress }) => {
    const [buildings, setBuildings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(7);

    const currentTechnician = localStorage.getItem('user');
    const parsedTechnician = currentTechnician ? JSON.parse(currentTechnician) : null;
    const technicianId = parsedTechnician ? parsedTechnician.account_type_id : '';
    
    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800);
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const technicianBuildings = await fetchTechnicianBuildings(technicianId);
                setBuildings(technicianBuildings);
            } catch (error) {
                console.error("Error fetching technicians buildings data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredBuildings = buildings.filter((building) => {
        return (
            building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            building.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            building.contact.toLowerCase().includes(searchQuery.toLowerCase())
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
        setCurrentPage(1);
    };

    const paginatedBuildings = filteredBuildings.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEditBuilding = (building) => {
        // Implement your edit logic
        console.log('Edit building:', building);
    };
    
    const handleDeleteBuilding = (id) => {
        // Implement your delete logic
        console.log('Delete building with id:', id);
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
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
    );
}

export default TechnicianBuildings;