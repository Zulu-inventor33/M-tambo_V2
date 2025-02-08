import axios from "axios";

// retrieve all the maintenance schedules
export const retrieveMaintenanceSchedules = async () => {
    try {
        const response = await axios.get(`/api/jobs/maintenance-schedule/`);
        if (response.status !== 200) {
            throw new Error("Failed to retrieve Maintenance schedules");
        }
        return response.data;
    } catch (error) {
        console.error("Error retrieving schedules", error);
    }
};

// create a regular maintenance schedule
export const createRegularMaintenanceSchedule = async (elevatorId, frequency, start_date, description) => {
    try {
        const response = await axios.post(`/api/jobs/maintenance-schedule/elevator/${elevatorId}/create_initial_schedule`, {
            next_schedule: frequency,
            scheduled_date: start_date,
            description: description,
        });
        if (response.status !== 201) {
            throw new Error('Failed to create maintenance schedule');
        }
        return response.data;
    } catch (error) {
        console.error("Error creating schedule:", error);
    }
};

/**
 * Create an Ad-Hoc Maintenance Schedule
 * @param {number} elevatorId - The ID of the selected elevator
 * @param {string} description - The description of the maintenance
 * @param {string} startDate - The start date for the maintenance
 * @returns {Promise} - A promise that resolves to the response from the API
 */
export const createAdHocMaintenanceSchedule = async (elevatorId, description, startDate) => {
    try {
        const response = await axios.post(`/api/jobs/maintenance-schedule/elevator/${elevatorId}/create_adhoc`, {
            description: description,
            scheduled_date: startDate,
        });

        if (response.status !== 201) {
            throw new Error('Failed to create AD-HOC maintenance schedule');
        }
        return response.data;
    } catch (error) {
        console.error("Error creating ad-hoc maintenance schedule:", error);
    }
};

export const specificTechnicianSchedules = async (technicianId) => {
    try {
        const response = await axios.get(`/api/jobs/maintenance-schedule/technician/${technicianId}/`);
        if (response.status !== 200) {
            throw new Error("Failed to retrieve technician Maintenance schedules");
        }
        return response.data;
    } catch (error) {
        console.error("Error retrieving technician schedules", error);

    }
}

// Function to file a maintenance log for a schedule
export const fileMaintenanceLog = async (scheduleId, data) => {
  try {
    const endpoint = `/api/jobs/maintenance-schedule/${scheduleId}/file_maintenance_log/`;

    // Send the POST request with the data
    const response = await axios.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error filing maintenance log:", error);
    throw new Error(error.response?.data?.detail || 'Failed to file the maintenance log');
  }
};
