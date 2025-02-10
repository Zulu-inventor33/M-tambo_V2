import axios from "axios";

// Fetch All the technicians for a specific maintenance company.
export const fetchAllTechniciansForSpecificMaintenance = async (companyId) => {
    try {
        const response = await axios.get(`/api/maintenance-companies/${companyId}/technicians/`);

        if (response.status === 200) {
            console.log("Successfully fetched all technicians for maintenance:", response.status);
            return response.data;
        } else {
            console.error("Unexpected response status:", response.status);
            throw new Error("Failed to fetch technicians for the maintenance company. Unexpected status.");
        }
    } catch (error) {
        console.error("Error fetching technicians for the maintenance company:", error.message);
        throw new Error("Failed to fetch technicians for the maintenance company.");
    }
};