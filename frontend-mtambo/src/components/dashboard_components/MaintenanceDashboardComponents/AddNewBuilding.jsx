import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Container, Form, Button, Row, Col, Card, Alert, ProgressBar } from "react-bootstrap";

const AddNewBuilding = () => {
    const [allDevelopers, setAllDevelopers] = useState([]);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [allTechnicians, setAllTechnicians] = useState([]); // State for technicians
    const [selectedTechnician, setSelectedTechnician] = useState(null); // Selected technician
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        developer_id: "",
        name: "",
        address: "",
        contact: "",
        elevator: {
            user_name: "",
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

    const [errors, setErrors] = useState({
        developer_id: false,
        name: false,
        address: false,
        contact: false,
        elevator: {
            user_name: false,
            capacity: false,
            machine_number: false,
            manufacturer: false,
            installation_date: false,
            technician_id: false,
        },
        maintenance: {
            schedule_type: false,
            description: false,
            scheduled_date: false,
        },
    });

    const [isStepValid, setIsStepValid] = useState(false); // Track if the current step is valid

    // Log formData on every change
    useEffect(() => {
        console.log("Form Data Updated:", formData);
        validateStep(); // Validate the step whenever formData changes
    }, [formData]);

    // Fetch all developers
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
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/maintenance-companies/1/technicians/"
                );
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

    const validateStep = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (step === 1) {
            if (!formData.developer_id) {
                newErrors.developer_id = true;
                valid = false;
            }
            if (!formData.name) {
                newErrors.name = true;
                valid = false;
            }
            if (!formData.address) {
                newErrors.address = true;
                valid = false;
            }
            if (!formData.contact) {
                newErrors.contact = true;
                valid = false;
            }
        } else if (step === 2) {
            if (!formData.elevator.user_name) {
                newErrors.elevator.user_name = true;
                valid = false;
            }
            if (!formData.elevator.capacity) {
                newErrors.elevator.capacity = true;
                valid = false;
            }
            if (!formData.elevator.machine_number) {
                newErrors.elevator.machine_number = true;
                valid = false;
            }
            if (!formData.elevator.manufacturer) {
                newErrors.elevator.manufacturer = true;
                valid = false;
            }
            if (!formData.elevator.installation_date) {
                newErrors.elevator.installation_date = true;
                valid = false;
            }
            if (!formData.elevator.technician_id) {
                newErrors.elevator.technician_id = true;
                valid = false;
            }
        }

        setErrors(newErrors);
        setIsStepValid(valid); // Update the step validity
        return valid;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handleBack = () => setStep(step - 1);

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

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h3>Building Details</h3>
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
                                </div>
                                <Form.Group className="mb-3">
                                    <Form.Label>Building Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter Building Name"
                                        isInvalid={errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        This field is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter Address"
                                        isInvalid={errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        This field is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        placeholder="Enter Contact"
                                        isInvalid={errors.contact}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        This field is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <h3>Elevator Details</h3>
                        <Form.Group className="mb-3">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="elevator.user_name"
                                value={formData.elevator.user_name}
                                onChange={handleChange}
                                placeholder="Enter User Name"
                                isInvalid={errors.elevator.user_name}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="elevator.capacity"
                                value={formData.elevator.capacity}
                                onChange={handleChange}
                                placeholder="Enter Capacity"
                                isInvalid={errors.elevator.capacity}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Machine Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="elevator.machine_number"
                                value={formData.elevator.machine_number}
                                onChange={handleChange}
                                placeholder="Enter Machine Number"
                                isInvalid={errors.elevator.machine_number}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Manufacturer</Form.Label>
                            <Form.Control
                                type="text"
                                name="elevator.manufacturer"
                                value={formData.elevator.manufacturer}
                                onChange={handleChange}
                                placeholder="Enter Manufacturer"
                                isInvalid={errors.elevator.manufacturer}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Installation Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="elevator.installation_date"
                                value={formData.elevator.installation_date}
                                onChange={handleChange}
                                isInvalid={errors.elevator.installation_date}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Technician</Form.Label>
                            <Select
                                options={allTechnicians}
                                value={selectedTechnician}
                                onChange={handleTechnicianChange}
                                placeholder="Select a technician"
                                isSearchable
                            />
                            {errors.elevator.technician_id && (
                                <div className="text-danger">This field is required.</div>
                            )}
                        </Form.Group>
                    </>
                );
            case 3:
                return (
                    <>
                        <h3>Maintenance Schedule</h3>
                        <Form.Group className="mb-3">
                            <Form.Label>Schedule Type</Form.Label>
                            <Form.Select
                                name="maintenance.schedule_type"
                                value={formData.maintenance.schedule_type}
                                onChange={handleChange}
                                isInvalid={errors.maintenance.schedule_type}
                            >
                                <option value="">Select Schedule Type</option>
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="yearly">Yearly</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="maintenance.description"
                                value={formData.maintenance.description}
                                onChange={handleChange}
                                placeholder="Enter Description"
                                isInvalid={errors.maintenance.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Scheduled Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="maintenance.scheduled_date"
                                value={formData.maintenance.scheduled_date}
                                onChange={handleChange}
                                isInvalid={errors.maintenance.scheduled_date}
                            />
                            <Form.Control.Feedback type="invalid">
                                This field is required.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </>
                );
            default:
                return null;
        }
    };

    const Stepper = () => {
        const steps = [
            { number: "01", title: "Building Details", subtitle: "Enter building details" },
            { number: "02", title: "Elevator Details", subtitle: "Setup elevator information" },
            { number: "03", title: "Maintenance Schedule", subtitle: "Add maintenance schedule" },
        ];

        return (
            <div className="stepper d-flex justify-content-between align-items-center mb-4">
                {steps.map((stepData, index) => (
                    <div
                        key={index}
                        className={`step ${step === index + 1 ? "active" : ""}`}
                    >
                        <div className="step-number">{stepData.number}</div>
                        <div className="step-content">
                            <p className="step-title">{stepData.title}</p>
                            <p className="step-subtitle">{stepData.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* header section */}
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Home</h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="javascript: void(0)">Add Building</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Card>
                    <Card.Body>
                        <Stepper />
                        {renderStep()}
                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={handleBack}
                                disabled={step === 1}
                            >
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={step === 3 ? handleSubmit : handleNext}
                                disabled={!isStepValid} // Use isStepValid to disable the button
                            >
                                {step === 3 ? "Submit" : "Next"}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default AddNewBuilding;