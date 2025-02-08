import axios from "axios";

// Fetch buildings by Maintainance company ID
export const fetchBuildings = async (companyId) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/maintenance-companies/${companyId}/buildings/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching buildings:", error);
        throw error;
    }
};

// Fetch the buildings a technicians is linked to
export const fetchTechnicianBuildings = async (technicianId) => {
    try {
        const response = await axios.get(`/api/maintenance-companies/1/technicians/${technicianId}/buildings/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching techicians BUildings:", error);
        throw error;
    }
}