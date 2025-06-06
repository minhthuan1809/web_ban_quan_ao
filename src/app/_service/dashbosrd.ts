import axios from "axios";

const getDashboard_API = async (accessToken: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/statistics/dashboard`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    return response.data;
}

export { getDashboard_API };
