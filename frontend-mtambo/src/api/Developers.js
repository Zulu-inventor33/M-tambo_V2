import axios from "axios";

// Fetch All the developers in our system
export const fetchAllDevelopers = async () => {
    try {
        const response = await axios.get(`/api/developers/`);
        console.log("Successfully fetched all developers:", response.status);
        return response.data;
    } catch (error) {
        console.error("Error fetching the developers in the system:", error);

        // Throw a more informative error message
        throw new Error(error.response?.data?.message || 'Failed to fetch developers. Please try again later.');
    }
};