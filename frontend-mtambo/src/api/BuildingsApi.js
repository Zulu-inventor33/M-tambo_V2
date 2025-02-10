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

// Add a building with an Elevator Connected to it
export const AddBuildingAndElevator = async (companyId, payload) => {
    try {
        const response = await axios.put(`/api/maintenance-companies/${companyId}/buildings/add`, payload);
        // Handle the response (you can return it or do something else)
        console.log('Building and Elevator added successfully:', response.data);
        return response;
    } catch (error) {
        console.error('Error adding building and elevator:', error);
        throw new Error('Failed to add building and elevator. Please try again later.');
    }
};