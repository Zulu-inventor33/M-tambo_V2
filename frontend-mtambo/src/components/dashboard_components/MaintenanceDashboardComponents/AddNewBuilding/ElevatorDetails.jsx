import React, { useState } from 'react';
import Select from 'react-select';
import { Form } from 'react-bootstrap';
import axios from 'axios';

import BaseModal from '../../BaseModal';

const ElevatorDetails = ({
    step,
    handleNextStep,
    handlePreviousStep,
    allTechnicians,
    formData,
    setFormData,
    selectedTechnician,
    handleChange,
    handleTechnicianChange
}) => {
    const [selectedController, setSelectedController] = useState(null);
    const [selectedMachineType, setSelectedMachineType] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Retrieve the company object to get ID from localStorage
    const currentCompany = localStorage.getItem('user');
    const parsedCompany = currentCompany ? JSON.parse(currentCompany) : null;
    const companyId = parsedCompany ? parsedCompany.account_type_id : "";

    // Track validation errors
    const [errors, setErrors] = useState({
        user_name: false,
        controller_type: false,
        capacity: false,
        machine_number: false,
        technician: false,
        machine_type: false,
        manufacturer: false,
        installation_date: false,
    });

    // Validate form fields
    const validateFields = () => {
        const newErrors = {};

        // Check if any required field is empty
        newErrors.user_name = formData.elevator.user_name.trim() === "";
        newErrors.controller_type = !formData.elevator.controller_type;
        newErrors.capacity = formData.elevator.capacity.trim() === "";
        newErrors.machine_number = formData.elevator.machine_number.trim() === "";
        newErrors.technician = !formData.elevator.technician_id;
        newErrors.machine_type = !formData.elevator.machine_type;
        newErrors.manufacturer = formData.elevator.manufacturer.trim() === "";
        newErrors.installation_date = formData.elevator.installation_date.trim() === "";

        setErrors(newErrors);

        // Return true if all fields are valid, false if any field is invalid
        return Object.values(newErrors).every((value) => !value);
    };

    const allElevatorControllers = [
        { label: "Digital", value: "Digital" },
        { label: "Manual", value: "Manual" }
    ];

    const handleControllerChange = (selectedOption) => {
        setSelectedController(selectedOption);
        setFormData({
            ...formData,
            elevator: {
                ...formData.elevator,
                controller_type: selectedOption ? selectedOption.value : "",
            },
        });
    };

    const allMachineTypes = [
        { label: "Gear", value: "Gear" },
        { label: "Gearless", value: "Gearless" }
    ]

    const handleMachineTypeChange = (selectedOption) => {
        setSelectedMachineType(selectedOption);
        setFormData({
            ...formData,
            elevator: {
                ...formData.elevator,
                machine_type: selectedOption ? selectedOption.value : "",
            },
        });
    };

    // Handle input change and trigger validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        handleChange(e);

        // Trigger field validation after value change
        validateFields();
    };

    const handleSubmit = async () => {
        if (validateFields()) {
            try {
                setLoading(true);
                const payload = { ...formData };
                console.log("Submitting Payload:", payload);

                // Make the POST request BY USING THE COMPANY ID
                const response = await axios.put(`/api/maintenance-companies/${companyId}/buildings/add`, payload);

                // Handle the response
                if (response.status === 200 || response.status === 201) {
                    console.log("Building and Elevator added successfully:", response.data);
                    setLoading(false);
                    setShowSuccessModal(true);
                } else {
                    throw new Error("Failed to add building and elevator");
                }
            } catch (error) {
                setLoading(false);
                console.error("Error submitting form:", error);
                setErrorMessage(error.message || "An error occurred. Please try again.");
                setShowErrorModal(true);

            }
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        handleNextStep();
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    return (
        <form id="validation-forms">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Elevator name</label>
                        <input
                            className={`form-control ${errors.user_name ? 'is-invalid' : ''}`}
                            type="text"
                            name="elevator.user_name"
                            value={formData.elevator.user_name}
                            onChange={handleInputChange}
                            placeholder="Elevator name"
                        />
                        {errors.user_name && <Form.Control.Feedback type="invalid">Elevator nams is required.</Form.Control.Feedback>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Controller type</label>
                        <Select
                            options={allElevatorControllers}
                            value={selectedController}
                            onChange={handleControllerChange}
                            placeholder="Select controller type"
                            isSearchable
                        />
                        {errors.controller_type && <div className="text-danger" style={{ fontSize: '12px' }}>Developer is required</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Capacity</label>
                        <input
                            className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
                            type="text"
                            name="elevator.capacity"
                            value={formData.elevator.capacity}
                            onChange={handleInputChange}
                            placeholder="Enter Capacity"
                        />
                        {errors.capacity && <Form.Control.Feedback type="invalid">Elevator nams is required.</Form.Control.Feedback>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Machine number</label>
                        <input
                            className={`form-control ${errors.machine_number ? 'is-invalid' : ''}`}
                            type="text"
                            name="elevator.machine_number"
                            value={formData.elevator.machine_number}
                            onChange={handleInputChange}
                            placeholder="Enter Machine Number"
                        />
                        {errors.machine_number && <Form.Control.Feedback type="invalid">Elevator nams is required.</Form.Control.Feedback>}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Assign a Technician</label>
                        <Select
                            options={allTechnicians}
                            value={selectedTechnician}
                            onChange={handleTechnicianChange}
                            placeholder="Select a technician"
                            isSearchable
                        />
                        {errors.technician && <div className="text-danger" style={{ fontSize: '12px' }}>Developer is required</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Machine type</label>
                        <Select
                            options={allMachineTypes}
                            value={selectedMachineType}
                            onChange={handleMachineTypeChange}
                            placeholder="Select machine type"
                            isSearchable
                        />
                        {errors.machine_type && <div className="text-danger" style={{ fontSize: '12px' }}>Developer is required</div>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Manufacturer</label>
                        <input
                            className={`form-control ${errors.manufacturer ? 'is-invalid' : ''}`}
                            type="text"
                            name="elevator.manufacturer"
                            value={formData.elevator.manufacturer}
                            onChange={handleInputChange}
                            placeholder="Enter Manufacturer"
                        />
                        {errors.manufacturer && <Form.Control.Feedback type="invalid">Elevator nams is required.</Form.Control.Feedback>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Installation Date</label>
                        <input
                            className="form-control"
                            type="date"
                            name="elevator.installation_date"
                            value={formData.elevator.installation_date}
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            This field is required.
                        </Form.Control.Feedback>
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex justify-content-between align-items-center">
                <button type="button" className="btn btn-secondary" onClick={handlePreviousStep} disabled={step === 1}>Back</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>Next</button>
            </div>
            {/* Success Modal */}
            {showSuccessModal && (
                <BaseModal
                    showBaseModal={showSuccessModal}
                    title="Success"
                    message="Building and elevator were added successfully!"
                    onClose={handleCloseModal}
                    onSuccessAction={handleNextStep}
                />
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <BaseModal
                    showBaseModal={showErrorModal}
                    title="Error"
                    message={errorMessage || "An error occurred. Please try again."}
                    onClose={handleCloseErrorModal}
                />
            )}
        </form >
    );
}
export default ElevatorDetails;
