import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fileMaintenanceLog } from '../../../../api/MaintenanceSchedule';
import FileMaintLogHeader from './FileMaintLogHeader';
import LogDetailsTab from './LogDetailsTab';
import ConditionReport from './ConditionReport';
import MaintenanceLog from './MaintenanceLog';

const FileMaintenanceLog = ({ setProgress }) => {
    const location = useLocation();
    const { scheduleId } = useParams();
    const navigate = useNavigate();  // Use useNavigate hook for redirection
    const [date, setDate] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState("");
    const [maintenanceDetails, setMaintenanceDetails] = useState("");

    useEffect(() => {
        // for loader effect
        setProgress(40);
        setTimeout(() => {
            setProgress(100);
        }, 800);

        const currentDate = new Date().toLocaleDateString('en-GB');
        setDate(currentDate);
    }, []);

    // Access the details of the schedule in the passed state
    const scheduleDetails = location.state?.schedule;

    const [formData, setFormData] = useState({
        schedule_type: 'regular',
        condition_report: {
            elevator_id: '',
            condition: 'Operational',
            issues_found: 'None',
            technician_notes: 'Routine check completed',
            technician: '',
        },
        maintenance_log: {
            maintenance_date: '',
            work_done: 'Lubricated doors and checked system',
            technician: '',
        },
    });

    // Use useEffect to update formData when scheduleDetails changes
    useEffect(() => {
        if (scheduleDetails) {
            const today = new Date().toISOString().split('T')[0];
            // Check schedule_type and update the form data accordingly
            setFormData((prevData) => ({
                ...prevData,
                schedule_type: scheduleDetails.maintenance_schedule.schedule_type === 'normal' ? 'regular' : 'adhoc',
                condition_report: {
                    ...prevData.condition_report,
                    elevator_id: scheduleDetails.maintenance_schedule.elevator.id,
                    technician: scheduleDetails.maintenance_schedule.technician,
                },
                maintenance_log: {
                    ...prevData.maintenance_log,
                    maintenance_date: today,
                    technician: scheduleDetails.maintenance_schedule.technician,
                },
            }));
        }
    }, [scheduleDetails]);

    // Handle text area change
    const handleAdditionalDetailsChange = (e) => {
        setAdditionalDetails(e.target.value);
        setFormData(prev => ({
            ...prev,
            condition_report: {
                ...prev.condition_report,
                technician_notes: additionalDetails,
            }
        }));
    };
    const handleMaintenanceDetailsChange = (e) => {
        setMaintenanceDetails(e.target.value);
        setFormData(prev => ({
            ...prev,
            maintenance_log: {
                ...prev.maintenance_log,
                work_done: maintenanceDetails,
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("data to be submitted", formData);

        try {
            const payload = formData;
            const result = await fileMaintenanceLog(scheduleId, payload);

            // Success Toast
            toast.success("Maintenance log submitted successfully!");
            // Redirect to the completed schedules page
            navigate("/dashboard/technician/completed-schedules");

        } catch (err) {
            toast.error("Error submitting the maintenance log.");
            console.error("Error submitting form data", err);
        }
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                {/* header section */}
                <FileMaintLogHeader />
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header pb-0">
                                <ul className="nav nav-tabs profile-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="profile-tab-1" data-bs-toggle="tab" href="#profile-1" role="tab"
                                            aria-selected="true">
                                            <i className="ti ti-user me-2"></i>Log Details
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="profile-tab-2" data-bs-toggle="tab" href="#profile-2" role="tab"
                                            aria-selected="true">
                                            <i class="ti ti-file-text me-2"></i>Condition Report
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="profile-tab-3" data-bs-toggle="tab" href="#profile-3" role="tab"
                                            aria-selected="true">
                                            <i class="ti ti-id me-2"></i>Maintenance Schedule
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body">
                                <div className="tab-content">
                                    <div className="tab-pane show active" id="profile-1" role="tabpanel" aria-labelledby="profile-tab-1">
                                        <LogDetailsTab
                                            building={scheduleDetails.maintenance_schedule.building.name}
                                            location="Imaara Daima"
                                            machine_number={scheduleDetails.maintenance_schedule.elevator.machine_number}
                                            machine_type="Gear"
                                            controller_type="Digital"
                                            technician_full_name={scheduleDetails.maintenance_schedule.technician_full_name}
                                            date={date}
                                            approved_by="N/A"
                                        />
                                    </div>
                                    <div className="tab-pane" id="profile-2" role="tabpanel" aria-labelledby="profile-tab-2">
                                        <ConditionReport
                                            handleAdditionalDetailsChange={handleAdditionalDetailsChange}
                                            additionalDetails={additionalDetails}
                                        />
                                    </div>
                                    <div className="tab-pane" id="profile-3" role="tabpanel" aria-labelledby="profile-tab-3">
                                        <MaintenanceLog
                                            maintenanceDetails={maintenanceDetails}
                                            handleMaintenanceDetailsChange={handleMaintenanceDetailsChange}
                                            handleSubmit={handleSubmit}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileMaintenanceLog;