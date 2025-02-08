import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { FaRegClipboard, FaExclamationCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header2Section from "./Header2Section";
import { fetchBuildings } from "../../../../api/BuildingsApi";
import { fetchElevators } from "../../../../api/ElevatorsApi";
import { createRegularMaintenanceSchedule, createAdHocMaintenanceSchedule } from "../../../../api/MaintenanceSchedule";

const CreateMaintenanceSchedule = ({ setProgress }) => {
    const [scheduleType, setScheduleType] = useState("None");
    const [buildingList, setBuildingList] = useState([]);
    const [elevatorList, setElevatorList] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [selectedElevator, setSelectedElevator] = useState(null);
    const [selectedFrequency, setSelectedFrequency] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");

    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800);
    }, []);

    const currentCompany = localStorage.getItem('user');
    const parsedCompany = currentCompany ? JSON.parse(currentCompany) : null;
    const companyId = parsedCompany ? parsedCompany.account_type_id : '';

    useEffect(() => {
        const fetchBuildingsData = async () => {
            setLoading(true);
            try {
                const buildingsData = await fetchBuildings(companyId);
                const formattedBuildings = buildingsData.map(building => ({
                    value: building.id,
                    label: building.name,
                }));
                setBuildingList(formattedBuildings);
            } catch (error) {
                console.error("Error fetching buildings data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBuildingsData();
    }, []);

    useEffect(() => {
        if (selectedBuilding) {
            const fetchElevatorsData = async () => {
                setLoading(true);
                try {
                    const elevatorsData = await fetchElevators(selectedBuilding.value);
                    const formattedElevators = elevatorsData.map(elevator => ({
                        value: elevator.id,
                        label: elevator.user_name,
                    }));
                    setElevatorList(formattedElevators);
                } catch (error) {
                    console.error("Error fetching elevators", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchElevatorsData();
        }
    }, [selectedBuilding]);

    const frequencyOptions = [
        { value: "1_week", label: "Weekly" },
        { value: "1_month", label: "Monthly" },
        { value: "1_year", label: "Yearly" },
    ];

    const handleBuildingChange = (selectedOption) => {
        setSelectedBuilding(selectedOption);
    };

    const handleElevatorChange = (selectedOption) => {
        setSelectedElevator(selectedOption);
    };

    const handleFrequencyChange = (selectedOption) => {
        setSelectedFrequency(selectedOption);
    };

    const generateDescription = (frequency) => {
        switch (frequency) {
            case "week":
                return "Weekly maintenance schedule";
            case "1_month":
                return "Montly maintenance schedule";
            case "1_year":
                return "Yearly maintenance schedule";
            default:
                return "";
        }
    };

    const handleSubmit = async () => {
        if (scheduleType === "Regular" && selectedElevator && selectedFrequency && startDate) {
            setLoading(true);
            const generatedDescription = generateDescription(selectedFrequency.value);
            setDescription(generatedDescription);
            console.log(description);
            try {
                const response = await createRegularMaintenanceSchedule(
                    selectedElevator.value,
                    selectedFrequency.value,
                    startDate,
                    description
                );
                console.log("Schedule Created:", response);
                // Show success notification for Regular Maintenance
                toast.success("Regular Maintenance Schedule Created Successfully!");
            } catch (error) {
                console.error("Error creating schedule:", error);
                // Show error notification for Regular Maintenance
                toast.error("Error creating Regular Maintenance Schedule. Please try again.");
            } finally {
                setLoading(false);
            }
        } else if (scheduleType === "Ad-hoc" && selectedElevator && description && startDate) {
            setLoading(true);
            try {
                const response = await createAdHocMaintenanceSchedule(
                    selectedElevator.value,
                    description,
                    startDate
                );
                console.log("Ad-Hoc Maintenance Schedule Created:", response);
                // Show success notification for Ad-Hoc Maintenance
                toast.success("Ad-Hoc Maintenance Schedule Created Successfully!");
            } catch (error) {
                console.error("Error creating Ad-Hoc schedule:", error);
                // Show error notification for Ad-Hoc Maintenance
                toast.error("Error creating Ad-Hoc Maintenance Schedule. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Please fill in all required fields.");
        }
    };

    return (
        <div className="pc-container">
            <div className="pc-content">
                <Header2Section />

                {/* Schedule Type Selection */}
                <div className="form-group mb-4">
                    <label className="form-label">Choose Schedule Type</label>
                    <select
                        className="form-select"
                        value={scheduleType}
                        onChange={(e) => setScheduleType(e.target.value)}
                    >
                        <option value="None">Select Schedule Type</option>
                        <option value="Regular">Regular Maintenance</option>
                        <option value="Ad-hoc">Ad-Hoc Maintenance</option>
                    </select>
                </div>

                {/* Card with dynamic fields based on selected schedule type */}
                <div className="card">
                    <div className="card-header">
                        <h5>{scheduleType !== "None" ? `${scheduleType} Maintenance` : "Choose a schedule type"}</h5>
                    </div>
                    <div className="card-body">
                        {scheduleType === "None" && (
                            <div className="d-flex flex-column align-items-center text-center">
                                <FaExclamationCircle size={40} color="#ff7b7b" />
                                <h6 className="mt-3">Please select a schedule type</h6>
                                <p className="text-muted">Choose between Regular or Ad-hoc Maintenance to start creating your schedule.</p>
                                <FaRegClipboard size={50} color="#4f94e0" />
                            </div>
                        )}

                        {scheduleType === "Regular" && (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Building</label>
                                        <Select
                                            options={buildingList}
                                            value={selectedBuilding}
                                            onChange={handleBuildingChange}
                                            placeholder="Select a Building"
                                            isSearchable
                                            isLoading={loading}
                                            isDisabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Frequency</label>
                                        <Select
                                            options={frequencyOptions}
                                            value={selectedFrequency}
                                            onChange={handleFrequencyChange}
                                            placeholder="Select Frequency"
                                            isSearchable
                                            isLoading={loading}
                                            isDisabled={loading}
                                        />
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Elevator</label>
                                        <Select
                                            options={elevatorList}
                                            value={selectedElevator}
                                            onChange={handleElevatorChange}
                                            placeholder="Select Elevator"
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
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {scheduleType === "Ad-hoc" && (
                            <>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Building</label>
                                            <Select
                                                options={buildingList}
                                                value={selectedBuilding}
                                                onChange={handleBuildingChange}
                                                placeholder="Select a Building"
                                                isSearchable
                                                isLoading={loading}
                                                isDisabled={loading}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Provide details of the schedule"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Elevator</label>
                                            <Select
                                                options={elevatorList}
                                                value={selectedElevator}
                                                onChange={handleElevatorChange}
                                                placeholder="Select Elevator"
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
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Only show submit button if schedule type is selected */}
                        {scheduleType !== "None" && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateMaintenanceSchedule;