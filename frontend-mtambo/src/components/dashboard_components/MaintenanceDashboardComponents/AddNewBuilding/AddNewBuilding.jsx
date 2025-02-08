import React, { useState, useEffect } from 'react';
import axios from 'axios';

import FormProgressStepper from './FormProgressStepper';
import BuildingDetails from './BuildingDetails';
import ElevatorDetails from './ElevatorDetails';
import MaintenanceSchedule from './MaintenanceSchedule';

const AddNewBuilding = ({ setProgress }) => {
    const [step, setStep] = useState(1);
    const [allDevelopers, setAllDevelopers] = useState([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [formData, setFormData] = useState({
        developer_id: "",
        name: "",
        location: "",
        address: "",
        contact: "",
        elevator: {
            user_name: "",
            controller_type: "",
            machine_type: "",
            capacity: "",
            machine_number: "",
            manufacturer: "",
            installation_date: "",
            technician_id: "",
        },
        maintenance: {
            schedule_type: "",
            description: "",
            scheduled_date: "",
        },
    });

    //enable loader
    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800)     
    }, [])

    const handleNextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handlePreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    // Retrieve the company object to get ID from localStorage
    const currentCompany = localStorage.getItem('user');
    const parsedCompany = currentCompany ? JSON.parse(currentCompany) : null;
    const companyId = parsedCompany ? parsedCompany.account_type_id : "";
    
    // fetch the developers 
    useEffect(() => {
        const fetchAllDevelopers = async () => {
            try {
                const response = await axios.get(`/api/developers/`);
                if (response.status === 200) {
                    // Transform the data into the format required by react-select
                    const developers = response.data.map(dev => ({
                        value: dev.id,
                        label: dev.developer_name
                    }));
                    setAllDevelopers(developers);
                }
            } catch (error) {
                console.error("Error fetching all the developers in the system:", error);
            }
        };

        fetchAllDevelopers();
    }, []);

    // Fetch all technicians for the maintenance company
    useEffect(() => {
        const fetchAllTechnicians = async () => {
            try {
                const response = await axios.get("/api/maintenance-companies/1/technicians/");
                if (response.status === 200) {
                    // Transform the data into the format required by react-select
                    const technicians = response.data.map(tech => ({
                        value: tech.id,
                        label: tech.technician_name
                    }));
                    setAllTechnicians(technicians);
                }
            } catch (error) {
                console.error("Error fetching technicians:", error);
            }
        };

        fetchAllTechnicians();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("elevator.")) {
            const elevatorField = name.split(".")[1];
            setFormData({
                ...formData,
                elevator: { ...formData.elevator, [elevatorField]: value },
            });
        } else if (name.includes("maintenance.")) {
            const maintenanceField = name.split(".")[1];
            setFormData({
                ...formData,
                maintenance: { ...formData.maintenance, [maintenanceField]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDeveloperChange = (selectedOption) => {
        setSelectedDeveloper(selectedOption);
        setFormData({
            ...formData,
            developer_id: selectedOption ? selectedOption.value : "", // Save the developer ID
        });
    };

    const handleTechnicianChange = (selectedOption) => {
        setSelectedTechnician(selectedOption);
        setFormData({
            ...formData,
            elevator: {
                ...formData.elevator,
                technician_id: selectedOption ? selectedOption.value : "", // Save the technician ID
            },
        });
    };

    const handleSubmit = async () => {
        try {
            // Ensure all required fields are filled
            if (!validateStep()) {
                console.error("Please fill all required fields.");
                return;
            }

            // Prepare the payload
            const payload = {
                ...formData,
                developer_id: selectedDeveloper ? selectedDeveloper.value : null, // Use the selected developer's ID
            };

            // Log the payload for debugging
            console.log("Submitting Payload:", payload);

            // Make the POST request
            const response = await axios.put(
                "http://localhost:8000/api/maintenance-companies/1/buildings/add",
                payload
            );

            // Handle the response
            if (response.status === 200 || response.status === 201) {
                console.log("Building added successfully:", response.data);
                alert("Building added successfully!");
            } else {
                console.error("Failed to add building:", response.data);
                alert("Failed to add building. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title">Add New Building</h5>
                        </div>
                        <div className="card-body">
                            {/* Stepper with connectors */}
                            <FormProgressStepper step={step} />

                            {/* Building Detials Form */}
                            {step === 1 && (
                                <BuildingDetails
                                    step={step}
                                    handleNextStep={handleNextStep}
                                    handlePreviousStep={handlePreviousStep}
                                    allDevelopers={allDevelopers}
                                    formData={formData}
                                    selectedDeveloper={selectedDeveloper}
                                    handleChange={handleChange}
                                    handleDeveloperChange={handleDeveloperChange}
                                />
                            )}

                            {/* Payment Details Form */}
                            {step === 2 && (
                                <ElevatorDetails
                                    step={step}
                                    handleNextStep={handleNextStep}
                                    handlePreviousStep={handlePreviousStep}
                                    allTechnicians={allTechnicians}
                                    formData={formData}
                                    setFormData={setFormData}
                                    selectedTechnician={selectedTechnician}
                                    handleChange={handleChange}
                                    handleTechnicianChange={handleTechnicianChange}
                                />
                            )}

                            {/* Review Order Form */}
                            {step === 3 && (
                                <MaintenanceSchedule
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewBuilding;