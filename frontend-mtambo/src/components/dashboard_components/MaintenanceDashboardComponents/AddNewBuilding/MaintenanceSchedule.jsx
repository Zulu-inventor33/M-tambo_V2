import React, { useState } from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';

const MaintenanceSchedule = ({ formData, handleChange, handleSubmit }) => {
    const [errors, setErrors] = useState({
        schedule_type: false,
        description: false,
        scheduled_date: false,
    });

    const validateFields = () => {
        const newErrors = {};
        // Check if any of the fields are empty
        newErrors.schedule_type = formData.maintenance.schedule_type.trim() === "";
        newErrors.description = formData.maintenance.description.trim() === "";
        newErrors.scheduled_date = formData.maintenance.scheduled_date.trim() === "";

        setErrors(newErrors);

        // Return true if all fields are valid, false if any field is invalid
        return Object.values(newErrors).every((value) => !value);
    };

    const handleNextClick = () => {
        if (validateFields()) {
            console.log("yes it is okay mate")
        }
    };

    const scheduleTypes = [
        { label: "Weekly", value: "Weekly" },
        { label: "Monthly", value: "Monthly" },
        { label: "Yearly", value: "Yearly" },
        // Add more schedule types as needed
    ];

    return (
        <form id="maintenance-schedule-form">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Schedule Type</label>
                        <Select
                            options={scheduleTypes}
                            value={formData.maintenance.schedule_type ? { label: formData.maintenance.schedule_type, value: formData.maintenance.schedule_type } : null}
                            onChange={(selectedOption) => handleChange('maintenance.schedule_type', selectedOption ? selectedOption.value : '')}
                            placeholder="Select schedule type"
                            isSearchable
                        />
                        {errors.schedule_type && <div className="text-danger">Schedule type is required</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Scheduled Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="scheduled_date"
                            value={formData.maintenance.scheduled_date}
                            onChange={handleChange}
                        />
                        {errors.scheduled_date && <div className="text-danger">Scheduled date is required</div>}
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.maintenance.description}
                            onChange={handleChange}
                            placeholder="Enter maintenance description"
                        />
                        {errors.description && <div className="text-danger">Description is required</div>}
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center">
                <button type="button" className="btn btn-secondary" onClick={handleNextClick}>
                    Submit
                </button>
            </div>
        </form>
    );
};

export default MaintenanceSchedule;