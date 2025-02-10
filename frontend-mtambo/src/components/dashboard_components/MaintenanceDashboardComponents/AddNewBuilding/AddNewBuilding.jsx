import React, { useState, useEffect } from 'react';

import FormProgressStepper from './FormProgressStepper';
import BuildingDetails from './BuildingDetails';
import ElevatorDetails from './ElevatorDetails';
import MaintenanceSchedule from './MaintenanceSchedule';
import AddNewBuildingHeader from './AddNewBuildingHeader';
import { fetchAllDevelopers } from '../../../../api/Developers';
import { fetchAllTechniciansForSpecificMaintenance } from '../../../../api/Technicians';

const AddNewBuilding = ({ setProgress }) => {
    const [step, setStep] = useState(1);
    const [allDevelopers, setAllDevelopers] = useState([]);
    const [loadingDevelopers, setLoadingDevelopers] = useState(false);
    const [errorLoadingDevelopers, setErrorLoadingDevelopers] = useState(false);
    const [selectedDeveloper, setSelectedDeveloper] = useState(null);
    const [allTechnicians, setAllTechnicians] = useState([]);
    const [loadingTechnicians, setLoadingTechnicians] = useState(false);
    const [errorLoadingTechnicians, setErrorLoadingTechnicians] = useState(false);
    const [selectedTechnician, setSelectedTechnician] = useState(null);
    const [elevatorId, setElevatorId] = useState("");
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

    // Retrieve the company object to get ID from localStorage
    const currentCompany = localStorage.getItem('user');
    const parsedCompany = currentCompany ? JSON.parse(currentCompany) : null;
    const companyId = parsedCompany ? parsedCompany.account_type_id : "";

    //enable loader
    useEffect(() => {
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800)

        //try to fetch all the developers
        const fetchDevelopersData = async () => {
            setLoadingDevelopers(true);
            try {
                const AllDevelopersData = await fetchAllDevelopers();
                // console.log("All developers", AllDevelopersData);
                // Transform the developers data into the format required by react-select
                const developers = AllDevelopersData.map(dev => ({
                    value: dev.id,
                    label: dev.developer_name
                }));
                setAllDevelopers(developers);
                setLoadingDevelopers(false);
            } catch (error) {
                setLoadingDevelopers(false);
                // Set the error state with the detailed message
                setErrorLoadingDevelopers(true);
                console.log("Error fetching the developers", error.message);
            }
        }

        //try to fetch technicians for the current maintenance company
        const fetchAllTechnicians = async () => {
            setLoadingTechnicians(true);
            try {
                const AllTechniciansData = await fetchAllTechniciansForSpecificMaintenance(companyId);
                // console.log("All technicians", AllTechniciansData);
                // Transform the data into the format required by react-select
                const technicians = AllTechniciansData.map(tech => ({
                    value: tech.id,
                    label: tech.technician_name
                }));
                setAllTechnicians(technicians);
                setLoadingTechnicians(false);
            } catch (error) {
                setLoadingTechnicians(false);
                setErrorLoadingTechnicians(true);
                console.error("Error fetching technicians:", error);
            }
        }

        fetchDevelopersData();
        fetchAllTechnicians();
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
            developer_id: selectedOption ? selectedOption.value : "",
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

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* header section */}
                <AddNewBuildingHeader />
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
                                    handleNextStep={handleNextStep}
                                    allDevelopers={allDevelopers}
                                    formData={formData}
                                    selectedDeveloper={selectedDeveloper}
                                    handleChange={handleChange}
                                    handleDeveloperChange={handleDeveloperChange}
                                    loadingDevelopers={loadingDevelopers}
                                    errorLoadingDevelopers={errorLoadingDevelopers}
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
                                    setElevatorId={setElevatorId}
                                    loadingTechnicians={loadingTechnicians}
                                    errorLoadingTechnicians={errorLoadingTechnicians}
                                />
                            )}

                            {/* Review Order Form */}
                            {step === 3 && (
                                <MaintenanceSchedule elevatorId={elevatorId} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewBuilding;