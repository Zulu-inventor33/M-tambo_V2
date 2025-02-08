import axios from "axios";

export const fetchElevators = async (buildingId) => {
    try {
        const response = await axios.get(`/api/elevators/building/${buildingId}/`);
        if (response.status !== 200) {
            throw new Error('Failed to fetch elevators');
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching elevators:", error);
        return [];
    }
};