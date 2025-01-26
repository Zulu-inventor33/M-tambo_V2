import React, { useState } from 'react';

const ExpandableTable = ({ users, currentRows }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    // Function to handle row expansion toggle
    const toggleRow = (index) => {
        console.log(index)
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
        <table className="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Technician</th>
                    <th>Building</th>
                    <th>Description</th>
                    <th>Scheduled Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {currentRows.map((user, index) => (
                    <React.Fragment key={index}>
                        {/* Regular Table Row */}
                        <tr>
                            <td>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => toggleRow(index)}
                                >
                                    <i className="ti ti-chevron-right"></i>
                                </button>
                            </td>
                            <td>{user.technician}</td>
                            <td>{user.building}</td>
                            <td>{user.description}</td>
                            <td>{user.scheduledDate}</td>
                            <td>
                                <span
                                    className={`badge ${user.status === 'Completed'
                                        ? 'bg-success'
                                        : user.status === 'In Progress'
                                            ? 'bg-warning'
                                            : 'bg-danger'
                                        }`}
                                >
                                    {user.status}
                                </span>
                            </td>
                        </tr>
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ExpandableTable;