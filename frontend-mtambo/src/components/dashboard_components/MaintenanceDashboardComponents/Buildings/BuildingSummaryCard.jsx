import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { fetchElevators } from '../../../../api/ElevatorsApi';
import PaginationControl from '../../Tables/PaginationControl';

const BuildingSummaryCard = ({ buildings }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [elevators, setElevators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentBuildings, setCurrentBuildings] = useState(buildings);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    useEffect(() => {
        setCurrentBuildings(buildings);
    }, [buildings]);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = currentBuildings.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(currentBuildings.length / rowsPerPage);

    const fetchElevatorsData = async (buildingId) => {
        setLoading(true);
        try {
            const elevatorsData = await fetchElevators(buildingId);
            setElevators(elevatorsData);
        } catch (error) {
            console.error('Error fetching elevators:', error);
            // Handle error (show a message or something)
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedBuilding) {
            fetchElevatorsData(selectedBuilding);
        }
    }, [selectedBuilding]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setCurrentBuildings(buildings.filter((building) =>
            building.name.toLowerCase().includes(query.toLowerCase())
        ));
    };

    const handleBuildingSelect = (buildingId) => {
        setSelectedBuilding(buildingId);
    };

    useEffect(() => {
        if (selectedBuilding === null && buildings.length > 0) {
            setSelectedBuilding(buildings[0].id);
        }
    }, [selectedBuilding, buildings]);

    return (
        <div className='row'>
            {/* Left Column: Buildings List */}
            <div className="col-12 col-md-7">
                <div className="card table-card">
                    <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-center">
                        <span className="h6 mb-0">Buildings Summary</span>
                        <div className="input-group w-50">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Building Name"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{ borderRadius: '4px' }}
                            />
                        </div>
                    </div>
                    <div>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Building Name</th>
                                    <th className='d-flex justify-content-end'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((building) => (
                                    <tr
                                        key={building.id}
                                        onClick={() => handleBuildingSelect(building.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>
                                            <span
                                                style={{
                                                    backgroundColor: building.id === selectedBuilding ? '#068e44' : 'rgb(250, 173, 20)',
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    display: 'inline-block',
                                                    marginRight: '10px',
                                                }}
                                            />
                                            {building.name}
                                        </td>
                                        <td className='d-flex justify-content-end'>
                                            <button className="btn btn-outline-success btn-sm" onClick={() => handleBuildingSelect(building.id)}>
                                                View Elevators
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
            </div>

            {/* Right Column: Elevators for Selected Building */}
            <div className="col-12 col-md-5">
                <div className="card table-card">
                    <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-center">
                        <span className="h6 mb-0">
                            {selectedBuilding ? currentBuildings.find(building => building.id === selectedBuilding)?.name : 'Select a Building'} Elevators
                        </span>
                    </div>
                    <div className='card-body'>
                        {loading ? (
                            <p>Loading elevators...</p>
                        ) : selectedBuilding ? (
                            elevators.length > 0 ? (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>Machine Number</th>
                                            <th>Machine Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elevators.map(elevator => (
                                            <tr key={elevator.id}>
                                                <td>{elevator.user_name}</td>
                                                <td>{elevator.machine_number}</td>
                                                <td>{elevator.machine_type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No elevators available for this building.</p>
                            )
                        ) : (
                            <p>Select a building to see its elevators.</p>
                        )}
                        <div className='px-3 d-flex flex-column flex-md-row justify-content-between w-100 mb-4'>
                            <div>
                                <span className="h6 mb-0">Total Elevators: {elevators.length}</span>
                            </div>
                            <div>
                                <Link to="/dashboard/buildings/elevators" className='btn btn-outline-primary btn-sm'>
                                    See More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildingSummaryCard;