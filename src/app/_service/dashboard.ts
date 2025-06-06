import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDashboardStats = async (accessToken?: string) => {
    const res = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        },
    });
    return res.data;
} 