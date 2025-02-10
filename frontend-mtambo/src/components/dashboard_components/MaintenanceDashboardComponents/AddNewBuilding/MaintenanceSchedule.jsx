import React, { useState } from 'react';
import Select from 'react-select';

import { createRegularMaintenanceSchedule } from '../../../../api/MaintenanceSchedule';
import BaseModal from '../../BaseModal';

const MaintenanceSchedule = ({ elevatorId }) => {
    const [loading, setLoading] = useState(false);
    const [selectedScheduleType, setSelectedScheduleType] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const scheduleTypes = [
        { value: "1_week", label: "Weekly" },
        { value: "1_month", label: "Monthly" },
        { value: "1_year", label: "Yearly" },
    ];

    const generateDescription = (frequency) => {
        switch (frequency) {
            case "1_week":
                return "Weekly maintenance schedule";
            case "1_month":
                return "Montly maintenance schedule";
            case "1_year":
                return "Yearly maintenance schedule";
            default:
                return "";
        }
    };

    const handleScheduleTypeChange = (selectedOption) => {
        setSelectedScheduleType(selectedOption);
    };

    const handleSubmitMaintenanceSchedule = async () => {
        console.log("submitting maintenance schedule");
        setLoading(true);
        const generatedDescription = generateDescription(selectedScheduleType.value);
        console.log("generated description", generatedDescription);
        try {
            const response = await createRegularMaintenanceSchedule(
                elevatorId,
                selectedScheduleType.value,
                startDate,
                generatedDescription
            );
            console.log("Schedule Created:", response);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error creating schedule:", error);
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form id="maintenance-schedule-form">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Frequency</label>
                        <Select
                            options={scheduleTypes}
                            value={selectedScheduleType}
                            onChange={handleScheduleTypeChange}
                            placeholder="Select Frequency"
                            isSearchable
                            isLoading={loading}
                            isDisabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="scheduled_date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-end align-items-center">
                <button type="button" className="btn btn-primary" onClick={handleSubmitMaintenanceSchedule}>
                    Schedule Maintenance
                </button>
            </div>
            {/* Success Modal */}
            {showSuccessModal && (
                <BaseModal
                    modalHeader={false}
                    showBaseModal={showSuccessModal}
                    title="Success"
                    message="A maintenance schedule has been created for the elevator. To add another elevator and create a maintenance schedule, click the button below. Otherwise, you can head to the schedules."
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
        </form>
    );
};

export default MaintenanceSchedule;