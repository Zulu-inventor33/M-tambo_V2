import React, { useState } from 'react';
import Select from 'react-select';

import BaseModal from '../../BaseModal';
import { AddBuildingAndElevator } from '../../../../api/BuildingsApi';
import LoadingCard from '../../LoadingCard';
import ErrorCard from '../../ErrorCard';

const ElevatorDetails = ({
    step,
    handleNextStep,
    handlePreviousStep,
    allTechnicians,
    formData,
    setFormData,
    selectedTechnician,
    handleChange,
    handleTechnicianChange,
    setElevatorId,
    loadingTechnicians,
    errorLoadingTechnicians
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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = { ...formData };
            console.log("Submitting Payload for Building and elevator:", payload);
            const response = await AddBuildingAndElevator(companyId, payload);
            if (response.status === 200 || response.status === 201) {
                console.log("Building and Elevator added successfully:", response.data);
                const elevatorId = response.data?.elevators[0].id;
                if (elevatorId) {
                    console.log("elevator Id", elevatorId);
                    setElevatorId(elevatorId);
                } else {
                    console.log("No elevator Id was found in the response");
                }
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
            {loadingTechnicians && (
                <LoadingCard />
            )}

            {errorLoadingTechnicians && !loadingTechnicians && (
                <ErrorCard />
            )}

            {!loadingTechnicians && !errorLoadingTechnicians && (
                <>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Elevator name</label>
                                <input
                                    className={`form-control`}
                                    type="text"
                                    name="elevator.user_name"
                                    value={formData.elevator.user_name}
                                    onChange={handleChange}
                                    placeholder="Elevator name"
                                />
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
                            </div>
                            <div className="form-group">
                                <label className="form-label">Capacity</label>
                                <input
                                    className={`form-control`}
                                    type="text"
                                    name="elevator.capacity"
                                    value={formData.elevator.capacity}
                                    onChange={handleChange}
                                    placeholder="Enter Capacity"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Machine number</label>
                                <input
                                    className={`form-control`}
                                    type="text"
                                    name="elevator.machine_number"
                                    value={formData.elevator.machine_number}
                                    onChange={handleChange}
                                    placeholder="Enter Machine Number"
                                />
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
                            </div>
                            <div className="form-group">
                                <label className="form-label">Manufacturer</label>
                                <input
                                    className={`form-control`}
                                    type="text"
                                    name="elevator.manufacturer"
                                    value={formData.elevator.manufacturer}
                                    onChange={handleChange}
                                    placeholder="Enter Manufacturer"
                                />
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
                            </div>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-between align-items-center mt-3">
                        <button type="button" className="btn btn-secondary" onClick={handlePreviousStep} disabled={step === 1}>Back To Building Details</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>Submit Building and Elevator</button>
                    </div>
                </>
            )}
            {/* Success Modal */}
            {showSuccessModal && (
                <BaseModal
                    modalHeader={false}
                    showBaseModal={showSuccessModal}
                    title="Success"
                    message="Please proceed to the next step to complete the maintenance schedule for the elevator."
                    onClose={handleCloseModal}
                    onSuccessAction={handleNextStep}
                    buttonText="Proceed to Schedule Maintenance"
                />
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <BaseModal
                    modalHeader={false}
                    showBaseModal={showErrorModal}
                    title="Error"
                    message="Please ensure all fields are filled. If the issue persists, contact support."
                    onClose={handleCloseErrorModal}
                />
            )}
        </form >
    );
}
export default ElevatorDetails;
