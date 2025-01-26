import React, { useState } from 'react';

import PageHeader from './PageHeader';

const CreateMaintenanceTask = () => {
    const [formData, setFormData] = useState({
        building: '',
        technician: '',
        scheduledDate: '',
        jobDescription: '',
    });

    const PageHeaderbreadcrumbItems = [
        { label: 'Home', link: '/dashboard' },
        { label: 'Create Maintenance Tasks' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            scheduledDate: value, // Store as string in 'YYYY-MM-DD' format
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleReset = () => {
        setFormData({
            building: '',
            technician: '',
            scheduledDate: '',
            jobDescription: '',
            // Reset other fields here if necessary
        });
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* header section */}
                <PageHeader title='Create Maintenance Task' breadcrumbItems={PageHeaderbreadcrumbItems} />
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5>Create a Maintenance Task</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    {/* Select Building */}
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="building" className="form-label">Building</label>
                                        <select
                                            id="building"
                                            name="building"
                                            className="form-select"
                                            value={formData.building}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Building</option>
                                            {/* Add options for buildings here */}
                                        </select>
                                    </div>

                                    {/* Select Technician */}
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="technician" className="form-label">Technician</label>
                                        <select
                                            id="technician"
                                            name="technician"
                                            className="form-select"
                                            value={formData.technician}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Technician</option>
                                            {/* Add options for technicians here */}
                                        </select>
                                    </div>

                                    {/* Scheduled date */}
                                    <div className="col-12 col-sm-6 mb-3">
                                        <label htmlFor="scheduledDate" className="form-label">Scheduled date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="scheduledDate"
                                            name="scheduledDate"
                                            value={formData.scheduledDate}
                                            onChange={handleDateChange}
                                        />
                                    </div>

                                    {/* Job Description */}
                                    <div className="col-12 mb-3">
                                        <label htmlFor="jobDescription" className="form-label">Job Description</label>
                                        <textarea
                                            className="form-control"
                                            id="jobDescription"
                                            name="jobDescription"
                                            rows="3"
                                            value={formData.jobDescription}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary me-2">
                                            Add Job
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMaintenanceTask;