import React, { useState } from 'react';

import UserProfileComponent from '../UserProfileComponent';

const ExpandableTable = ({ columns, users, currentRows }) => {
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
                    {/* Optional first column for expansion toggle */}
                    <th></th>
                    {/* Dynamically render table headers based on 'columns' prop */}
                    {columns.map((column, idx) => (
                        <th key={idx}>{column}</th>
                    ))}
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

                        {/* Expanded Row for User profile*/}
                        {expandedRow === index && (
                            <tr>
                                {/* This td will span across all columns */}
                                <td colSpan="6">
                                    <UserProfileComponent user={user} />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ExpandableTable;