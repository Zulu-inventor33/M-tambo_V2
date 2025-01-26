import React from 'react';

const PaginationControl = ({ currentPage, totalPages, onPageChange, onRowsPerPageChange, rowsPerPage }) => {
    // Generate an array of page numbers
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className='p-3'>
            <div className="d-flex justify-content-between align-items-center flex-wrap mt-n2 ms-n2">
                {/* Rows per page dropdown */}
                <div className='pt-2 ps-2'>
                    <div className='d-flex align-items-center' style={{ flex: '1 1 auto', minWidth: '200px' }} >
                        <span style={{ fontSize: '14px' }}>Rows per page:</span>
                        <select
                            className="form-select form-select-sm ms-2"
                            value={rowsPerPage}
                            onChange={onRowsPerPageChange}
                            style={{ maxWidth: '80px' }}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>

                {/* Pagination controls */}
                <div className='pt-2 ps-2'>
                    <nav aria-label="pagination navigation">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(1)}>
                                    First
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(currentPage - 1)}
                                >
                                    Prev
                                </button>
                            </li>
                            {pageNumbers.map(number => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => onPageChange(number)}
                                    >
                                        {number}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(currentPage + 1)}
                                >
                                    Next
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => onPageChange(totalPages)}
                                >
                                    Last
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default PaginationControl;