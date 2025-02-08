import axios from "axios";

export const fetchCompanyDevelopers = async (CompanyId) => {
    try {
        const response = await axios.get(`/api/maintenance-companies/${CompanyId}/developers/`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch developers for maintenance company');
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching developers for maintenance company:", error);
        return [];
    }
};