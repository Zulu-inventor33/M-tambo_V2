import React, { useState } from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';

const BuildingDetails = ({
    step,
    handleNextStep,
    handlePreviousStep,
    allDevelopers,
    formData,
    selectedDeveloper,
    handleChange,
    handleDeveloperChange
}) => {
    // Track invalid fields
    const [errors, setErrors] = useState({
        name: false,
        location: false,
        address: false,
        contact: false,
        developer: false
    });

    // Validate the fields to ensure they're filled
    const validateFields = () => {
        const newErrors = {};

        // Check if any of the fields are empty
        newErrors.developer = !formData.developer_id;
        newErrors.name = formData.name.trim() === "";
        newErrors.location = formData.location.trim() === "";
        newErrors.address = formData.address.trim() === "";
        newErrors.contact = formData.contact.trim() === "";

        setErrors(newErrors);

        // Return true if all fields are valid, false if any field is invalid
        return !Object.values(newErrors).includes(true);
    };

    // Handle input change and trigger validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);

        // Trigger field validation after value change
        validateFields();
    };

    // Handle the "Next" button click
    const handleNextClick = () => {
        if (validateFields()) {
            handleNextStep();
        }
    };

    return (
        <form id="validation-forms">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Select a Developer</label>
                        <Select
                            options={allDevelopers}
                            value={selectedDeveloper}
                            onChange={handleDeveloperChange}
                            placeholder="Select a developer"
                            isSearchable
                        />
                        {errors.developer && <div className="text-danger" style={{ fontSize: '12px' }}>Developer is required</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Building Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            placeholder="Enter Building Name"
                        />
                        {errors.name && <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Building Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                            placeholder="Enter Building Location"
                        />
                        {errors.location && <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <input
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter Address"
                        />
                        {errors.address && <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contact</label>
                        <input
                            className={`form-control ${errors.contact ? 'is-invalid' : ''}`}
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Enter Contact"
                        />
                        {errors.contact && <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>}
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex justify-content-between align-items-center">
                <button type="button" className="btn btn-secondary" onClick={handlePreviousStep} disabled={step === 1}>Back</button>
                <button type="button" className="btn btn-primary" onClick={handleNextClick} disabled={Object.values(errors).includes(true)}>Next</button>
            </div>
        </form>
    );
}
export default BuildingDetails;